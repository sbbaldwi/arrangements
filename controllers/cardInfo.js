const CardInfo = require('../models/cardInfo');
const { body, param, validationResult } = require('express-validator');

// Validation middleware
const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({ errors: errors.array() });
    };
};

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
exports.getCardInfoById = [
    param('id').isMongoId(),
    validate,
    async (req, res) => {
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
    }
];

// Create new cardInfo
exports.createCardInfo = [
    body('cardNumber').isCreditCard().withMessage('Invalid credit card number'),
    body('expirationDate').isISO8601().withMessage('Invalid expiration date'),
    body('cvv').isLength({ min: 3, max: 4 }).withMessage('Invalid CVV'),
    validate,
    async (req, res) => {
        try {
            const { cardNumber, expirationDate, cvv } = req.body;
            const cardInfo = new CardInfo({ cardNumber, expirationDate, cvv });
            await cardInfo.save();
            res.status(201).json({ message: 'Card info created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create card info', error: error.message });
        }
    }
];

// Update cardInfo by ID
exports.updateCardInfo = [
    param('id').isMongoId(),
    body('cardNumber').optional().isCreditCard().withMessage('Invalid credit card number'),
    body('expirationDate').optional().isISO8601().withMessage('Invalid expiration date'),
    body('cvv').optional().isLength({ min: 3, max: 4 }).withMessage('Invalid CVV'),
    validate,
    async (req, res) => {
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
    }
];

// Delete cardInfo by ID
exports.deleteCardInfo = [
    param('id').isMongoId(),
    validate,
    async (req, res) => {
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
    }
];
