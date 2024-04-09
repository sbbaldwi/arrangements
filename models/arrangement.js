const mongoose = require('mongoose');

const arrangementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    composer: { type: String, required: true },
    ensembleType: {
        type: String,
        required: true,
        enum: ['SSAA', 'SATB', 'TTBB']
    },
    difficultyLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    minimumPurchase: { type: Number, required: true },
    sheetMusic: {
        type: String,
        required: true
    },
    recording: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Arrangement', arrangementSchema, 'arrangements');

