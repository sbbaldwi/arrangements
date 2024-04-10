const CardInfo = require('../models/cardInfo');

// Get all cardInfo
exports.getAllCardInfo = async (req, res) => {
    try {
        const cardInfo = await CardInfo.find();
        res.status(200).json(cardInfo);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch card info', error: error.message });
    }
};

// Get cardInfo by ID
exports.getCardInfoById = async (req, res) => {
    try {
        const cardInfoId = req.params.id;
        const cardInfo = await CardInfo.findById(cardInfoId);
        if (cardInfo) {
            res.status(200).json(cardInfo);
        } else {
            res.status(404).json({ message: 'Card info not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch card info', error: error.message });
    }
};

// Create new cardInfo
exports.createCardInfo = async (req, res) => {
    try {
        const { cardNumber, expirationDate, cvv } = req.body;
        const cardInfo = new CardInfo({ cardNumber, expirationDate, cvv });
        await cardInfo.save();
        res.status(201).json({ message: 'Card info created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create card info', error: error.message });
    }
};

// Update cardInfo by ID
exports.updateCardInfo = async (req, res) => {
    try {
        const cardInfoId = req.params.id;
        const updatedData = req.body;
        const updatedCardInfo = await CardInfo.findByIdAndUpdate(cardInfoId, updatedData, { new: true });
        if (updatedCardInfo) {
            res.status(200).json({ message: 'Card info updated successfully', cardInfo: updatedCardInfo });
        } else {
            res.status(404).json({ message: 'Card info not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update card info', error: error.message });
    }
};

// Delete cardInfo by ID
exports.deleteCardInfo = async (req, res) => {
    try {
        const cardInfoId = req.params.id;
        const deletedCardInfo = await CardInfo.findByIdAndDelete(cardInfoId);
        if (deletedCardInfo) {
            res.status(200).json({ message: 'Card info deleted successfully' });
        } else {
            res.status(404).json({ message: 'Card info not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete card info', error: error.message });
    }
};
