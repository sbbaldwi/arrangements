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

exports.updateAccount = async (req, res) => {
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
};

exports.deleteAccount = async (req, res) => {
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
};

// Add more CRUD operations as needed (update, delete, etc.)
