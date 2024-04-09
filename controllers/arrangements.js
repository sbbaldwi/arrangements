const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer();

const Arrangement = require('../models/arrangement');

const mongoose = require('mongoose');
const FileSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String
});
const FileModel = mongoose.model('File', FileSchema);

const saveFile = async (file) => {
    const newFile = new FileModel({
        name: file.originalname,
        data: file.buffer,
        contentType: file.mimetype
    });
    const savedFile = await newFile.save();
    return savedFile._id;
};


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


    createArrangement: async (req, res, next) => {
        const db = await getDb();
        const collection = db.collection('arrangements');
        let arrangement = new Arrangement({
            title: req.body.title,
            composer: req.body.composer,
            description: req.body.description,
            type: req.body.type,
            length: req.body.length,
            levelOfDifficulty: req.body.levelOfDifficulty,
            price: req.body.price,
            minimumCopies: req.body.minimumCopies,
        })

        if (req.file) {
            try {
                const fieldname = req.file.fieldname;
                const fileId = await saveFile(req.file);
                arrangement[fieldname] = fileId;
            } catch (error) {
                return res.status(500).json({ message: 'Error saving file', error: error.message });
            }
        }

        arrangement.save()
            .then(response => {
                res.json({
                    message: 'Arrangement added successfully'
                })
            })
            .catch(error => {
                res.json({
                    message: 'an error occured'
                })
            })
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







/*try {
            // Validate required fields
            const requiredFields = ['title', 'composer', 'description', 'type', 'length', 'levelOfDifficulty', 'price', 'minimumCopies'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ message: `${field} is required.` });
                }
            }
    
            if (!['SSAA', 'SATB', 'TTBB'].includes(req.body.type)) {
                return res.status(400).json({ message: 'Type must be SSAA, SATB, or TTBB.' });
            }
            const { levelOfDifficulty, price, minimumCopies } = req.body;
            if (isNaN(levelOfDifficulty) || isNaN(price) || isNaN(minimumCopies)) {
                return res.status(400).json({ message: 'level of difficulty, price, and minimum copies must be numeric values.' });
            }
    
            // Save files using Multer
            const coverImageId = await saveFile(req.file('coverImage')[0]); // Assuming only one file is uploaded
            const pdfDocumentId = await saveFile(req.file('pdfDocument')[0]);
            const mp3RecordingId = await saveFile(req.file('mp3Recording')[0]);
    
            // Create the arrangement using the Mongoose model
            const arrangement = new Arrangement({
                ...req.body,
                pdfDocument: pdfDocumentId,
                mp3Recording: mp3RecordingId,
                coverImage: coverImageId
            });
    
            // Save the arrangement to the database
            await arrangement.save();
    
            res.status(201).json({ message: "Arrangement created successfully", id: arrangement._id });
        } catch (err) {
            res.status(500).json({ message: "Error creating arrangement", error: err.message });
        }
    },
 */