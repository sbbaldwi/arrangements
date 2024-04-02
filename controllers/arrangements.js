const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');

exports.getArrangementById = async (req, res) => {
    try {
        const db = getDb();
        const collection = db.collection('arrangements');
        const arrangement = await collection.findOne({ _id: new ObjectId(req.params.id) });
        
        if (!arrangement) {
            return res.status(404).json({ message: 'Arrangement not found' });
        }

        res.status(200).json(arrangement);
    } catch (err) {
        res.status(500).json({ message: "Error fetching arrangement", error: err.message });
    }
};

// Configure storage options for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this uploads directory exists
    },
    filename: (req, file, cb) => {
        // Naming convention for the file
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Initialize Multer with options to accept both PDF and MP3 files
const upload = multer({ storage: storage }).fields([
    { name: 'pdfDocument', maxCount: 1 },
    { name: 'mp3Recording', maxCount: 1 }
]);

exports.uploadArrangement = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError || err) {
            // Handle Multer or unknown upload errors
            return res.status(500).json({ message: "Error uploading files", error: err.message });
        }
        // Proceed to the next middleware/function
        next();
    });
};

exports.createArrangement = async (req, res) => {
    try {
        const { name, title, description, type, length, levelOfDifficulty, price, minimumCopies } = req.body;
        const pdfDocument = req.files['pdfDocument'] ? req.files['pdfDocument'][0].path : null;
        const mp3Recording = req.files['mp3Recording'] ? req.files['mp3Recording'][0].path : '';

        // Data validation
        if (!name || !title || !description || !type || !length || !levelOfDifficulty || !price || !minimumCopies || !pdfDocument) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }
        if (!['SSAA', 'SATB', 'TTBB'].includes(type)) {
            return res.status(400).json({ message: 'Type must be SSAA, SATB, or TTBB.' });
        }
        if (isNaN(levelOfDifficulty) || isNaN(price) || isNaN(minimumCopies)) {
            return res.status(400).json({ message: 'level of difficulty, price, and minimum copies must be numeric values.' });
        }
        const levelOfDifficultyVal = Number(levelOfDifficulty);
        const priceVal = Number(price);
        const minimumCopiesVal = Number(minimumCopies);

        if (levelOfDifficultyVal < 1 || levelOfDifficultyVal > 4) {
            return res.status(400).json({ message: 'Level of difficulty must be between 1 and 4.' });
        }

        const formattedPrice = `$${priceVal.toFixed(2)}`;

        // Database operation
        const db = getDb();
        const collection = db.collection('arrangements');
        const result = await collection.insertOne({
            name,
            title,
            description,
            type,
            length,
            levelOfDifficulty: levelOfDifficultyVal,
            price: formattedPrice,
            minimumCopies: minimumCopiesVal,
            pdfDocument,
            mp3Recording
        });

        res.status(201).json({ message: "Arrangement created successfully", id: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: "Error creating arrangement", error: err.message });
    }
};

exports.updateArrangement = async (req, res) => {
    try {
        const db = getDb();
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
};

exports.deleteArrangement = async (req, res) => {
    try {
        const db = getDb();
        const collection = db.collection('arrangements');
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Arrangement not found' });
        }

        res.status(200).json({ message: "Arrangement deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting arrangement", error: err.message });
    }
};
