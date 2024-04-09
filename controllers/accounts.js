const Account = require('../models/account');

// Create a new account
exports.createAccount = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const account = new Account({ username, email, password });
        await account.save();
        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create account', error: error.message });
    }
};

// Authenticate a user
exports.authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const account = await Account.findOne({ email });
        if (!account) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }
        account.comparePassword(password, (error, isMatch) => {
            if (isMatch && !error) {
                // User authenticated, proceed accordingly
                res.status(200).json({ message: 'User authenticated successfully' });
            } else {
                res.status(401).json({ message: 'Authentication failed. Wrong password.' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
};

// Add more CRUD operations as needed (update, delete, etc.)
