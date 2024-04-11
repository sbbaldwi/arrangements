const Account = require('../models/account');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, param, validationResult } = require('express-validator');

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
  // Ensure you've installed and required jwt

// Get all accounts
exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch accounts', error: error.message });
    }
};
// Get account by ID
exports.getAccountById = [
    param('id').isMongoId().withMessage('Invalid MongoDB ID'),
    validate,
    async (req, res) => {
        try {
            const accountId = req.params.id;
            const account = await Account.findById(accountId);
            if (account) {
                res.status(200).json(account);
            } else {
                res.status(404).json({ message: 'Account not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch account', error: error.message });
        }
    }
];


// Get account by ID
exports.getAccountById = async (req, res) => {
    try {
        const accountId = req.params.id;
        const account = await Account.findById(accountId);
        if (account) {
            res.status(200).json(account);
        } else {
            res.status(404).json({ message: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch account', error: error.message });
    }
};

// Create a new account
exports.createAccount = [
    body('username').trim().isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate,
    async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);
            const account = new Account({ username, email, password: hashedPassword });
            await account.save();
            res.status(201).json({ message: 'Account created successfully', userId: account._id });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create account', error: error.message });
        }
    }
];


// Authenticate a user
exports.authenticateUser = [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').not().isEmpty().withMessage('Password is required'),
    validate,
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const account = await Account.findOne({ email });
            if (!account) {
                return res.status(401).json({ message: 'Authentication failed. User not found.' });
            }

            const passwordIsValid = await bcrypt.compare(password, account.password);
            if (!passwordIsValid) {
                return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
            }

            const token = jwt.sign({ id: account._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'User authenticated successfully', token: token, userId: account._id });
        } catch (error) {
            res.status(500).json({ message: 'Authentication failed', error: error.message });
        }
    }
];


exports.updateAccount = [
    param('id').isMongoId().withMessage('Invalid MongoDB ID'),
    body().custom(body => Object.keys(body).length !== 0).withMessage('Please provide data to update'),
    validate,
    async (req, res) => {
        try {
            const accountId = req.params.id;
            const updatedData = req.body;
            const updatedAccount = await Account.findByIdAndUpdate(accountId, updatedData, { new: true });
            if (updatedAccount) {
                res.status(200).json({ message: 'Account updated successfully', account: updatedAccount });
            } else {
                res.status(404).json({ message: 'Account not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Failed to update account', error: error.message });
        }
    }
];


exports.deleteAccount = [
    param('id').isMongoId().withMessage('Invalid MongoDB ID'),
    validate,
    async (req, res) => {
        try {
            const accountId = req.params.id;
            const deletedAccount = await Account.findByIdAndDelete(accountId);
            if (deletedAccount) {
                res.status(200).json({ message: 'Account deleted successfully' });
            } else {
                res.status(404).json({ message: 'Account not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete account', error: error.message });
        }
    }
];



// Add more CRUD operations as needed (update, delete, etc.)
