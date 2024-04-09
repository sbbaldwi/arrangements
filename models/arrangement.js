const mongoose = require('mongoose');

const arrangementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    composer: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['SSAA', 'SATB', 'TTBB'], required: true },
    length: { type: Number, required: true },
    levelOfDifficulty: { type: Number, required: true },
    price: { type: Number, required: true },
    minimumCopies: { type: Number, required: true },
    pdfDocument: { type: String, required: true },
    mp3Recording: { type: String, required: true },
    coverImage: { type: String, required: true }
});

// Create the model for arrangement
const Arrangement = mongoose.model('arrangement', arrangementSchema);

module.exports = Arrangement;