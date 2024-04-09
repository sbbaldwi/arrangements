const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDirSync = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Paths where files will be uploaded
// Ensure directories exist based on the relative paths used by multer
const uploadsBasePath = path.join(__dirname, '../uploads');
const imagesPath = path.join(uploadsBasePath, 'images');
const audiosPath = path.join(uploadsBasePath, 'audios');
const pdfsPath = path.join(uploadsBasePath, 'pdfs');

module.exports = function (app) {
    ensureDirSync(imagesPath);
    ensureDirSync(audiosPath);
    ensureDirSync(pdfsPath);

    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
};




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Save files in different directories based on their type
        let uploadPath = path.join(__dirname, '../uploads'); // Default path
        if (file.mimetype.includes('image')) {
            uploadPath = path.join(__dirname, '../uploads/images');
        } else if (file.mimetype.includes('pdf')) {
            uploadPath = path.join(__dirname, '../uploads/pdfs');
        } else if (file.mimetype.includes('audio/mpeg')) {
            uploadPath = path.join(__dirname, '../uploads/audios');
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate a unique name for each file
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 50 }, // for example, limit file size to 50MB
    fileFilter: function (req, file, cb) {
        // Accept images, PDFs, and MP3s only
        if (file.mimetype.includes('image') ||
            file.mimetype.includes('pdf') ||
            file.mimetype.includes('audio/mpeg')) {
            cb(null, true);
        } else {
            cb(new Error('Only .pdf, .mp3, and image files are allowed!'), false);
        }
    }
}).fields([{ name: 'coverImage', maxCount: 1 }, { name: 'pdfDocument', maxCount: 1 }, { name: 'mp3Recording', maxCount: 1 }]);


const ArrangementController = {
    getAllArrangements: async (req, res) => {
        try {
            const db = await getDb();
            const collection = db.collection('arrangements');
            const arrangements = await collection.find({}).toArray();
            res.status(200).json(arrangements);
        } catch (err) {
            res.status(500).json({ message: "Error fetching arrangements", error: err.message });
        }
    },

    getArrangementById: async (req, res) => {
        try {
            const db = await getDb();
            const collection = db.collection('arrangements');
            const arrangement = await collection.findOne({ _id: new ObjectId(req.params.id) });
            if (!arrangement) {
                return res.status(404).json({ message: 'Arrangement not found' });
            }
            res.status(200).json(arrangement);
        } catch (err) {
            res.status(500).json({ message: "Error fetching arrangement", error: err.message });
        }
    },

    uploadMiddleware: (req, res, next) => {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(500).json({ message: "Multer error uploading files", error: err.message });
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(500).json({ message: "Unknown error uploading files", error: err.message });
            }
            // Everything went fine.
            next(); // Proceed to the next middleware or controller action
        });
    },


    createArrangement: async (req, res) => {
        try {
            const db = await getDb();
            const collection = db.collection('arrangements');

            // Validate required fields
            const requiredFields = ['title', 'composer', 'description', 'type', 'length', 'levelOfDifficulty', 'price', 'minimumCopies'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ message: `${field} is required.` });
                }
            }

            const coverImagePath = req.files['coverImage'] ? req.files['coverImage'][0].path : '';
            const pdfDocumentPath = req.files['pdfDocument'] ? req.files['pdfDocument'][0].path : '';
            const mp3RecordingPath = req.files['mp3Recording'] ? req.files['mp3Recording'][0].path : '';


            // Additional validations as in the old version
            if (!['SSAA', 'SATB', 'TTBB'].includes(req.body.type)) {
                return res.status(400).json({ message: 'Type must be SSAA, SATB, or TTBB.' });
            }
            const { levelOfDifficulty, price, minimumCopies } = req.body;
            if (isNaN(levelOfDifficulty) || isNaN(price) || isNaN(minimumCopies)) {
                return res.status(400).json({ message: 'level of difficulty, price, and minimum copies must be numeric values.' });
            }

            // Insert the arrangement into the database
            const result = await collection.insertOne({
                ...req.body,
                pdfDocument: pdfDocumentPath,
                mp3Recording: mp3RecordingPath,
                coverImage: coverImagePath
            });

            res.status(201).json({ message: "Arrangement created successfully", id: result.insertedId });
        } catch (err) {
            res.status(500).json({ message: "Error creating arrangement", error: err.message });
        }
    },


    updateArrangement: async (req, res) => {
        try {
            const db = await getDb();
            const collection = db.collection('arrangements');
            const result = await collection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: req.body }
            );
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Arrangement not found' });
            }
            res.status(200).json({ message: "Arrangement updated successfully" });
        } catch (err) {
            res.status(500).json({ message: "Error updating arrangement", error: err.message });
        }
    },

    deleteArrangement: async (req, res) => {
        try {
            const db = await getDb();
            const collection = db.collection('arrangements');
            const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Arrangement not found' });
            }
            res.status(200).json({ message: "Arrangement deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: "Error deleting arrangement", error: err.message });
        }
    }
};

module.exports = ArrangementController;
