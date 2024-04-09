const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accounts');

// Create a new account
router.post('/accounts', accountController.createAccount);

// Authenticate a user
router.post('/authenticate', accountController.authenticateUser);

// Delete an account
router.delete('/accounts/:id', accountController.deleteAccount);

// Update an account
router.put('/accounts/:id', accountController.updateAccount);

module.exports = router;
