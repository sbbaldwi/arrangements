const mongoose = require('mongoose');

const cardInfoSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true
    },
    expirationDate: {
        type: String, 
        required: true
    },
    cvv: {
        type: String,
        required: true
    }
});

const CardInfo = mongoose.model('CardInfo', cardInfoSchema);

module.exports = CardInfo;
