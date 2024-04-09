const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: 'uploads/', // Ensure this directory exists
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'pdfDocument', maxCount: 1 },
    { name: 'mp3Recording', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);

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
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError || err) {
                return res.status(500).json({ message: "Error uploading files", error: err.message });
            }

            const coverImage = req.files && req.files['coverImage'] && req.files['coverImage'][0];

            if (!coverImage) {
                return res.status(400).json({ message: "Cover image is required." });
            }

            // Check file size
            if (coverImage.size > MAX_FILE_SIZE) {
                return res.status(400).json({ message: "Cover image exceeds maximum allowed size." });
            }

            // Check content type
            if (!isValidImageType(coverImage.mimetype)) {
                return res.status(400).json({ message: "Invalid image type for cover image." });
            }

            // Check dimensions
            const dimensions = await sharp(coverImage.buffer).metadata();
            if (dimensions.width !== 500 || dimensions.height !== 500) {
                return res.status(400).json({ message: "Cover image must be 500x500 pixels." });
            }

            // Success response
            return res.status(200).json({ message: "Cover image uploaded successfully." });
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

            // Ensure a cover image is uploaded
            if (!req.files['coverImage']) {
                return res.status(400).json({ message: 'Cover image is required.' });
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
