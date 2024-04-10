const express = require('express');
const router = express.Router();

// Import controller
const accountController = require('../controllers/accounts');

// Specific Routes
router.post('/login', accountController.authenticateUser);
router.post('/register', accountController.createAccount);

// General CRUD routes
router.get('/:id', accountController.getAccountById);
router.get('/', accountController.getAllAccounts);
router.delete('/:id', accountController.deleteAccount);
router.put('/:id', accountController.updateAccount);

module.exports = router;