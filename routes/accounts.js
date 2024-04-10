const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accounts');

router.get('/', accountController.getAllAccounts);
router.get('/:id', accountController.getAccountById);
// Create a new account
router.post('/', accountController.createAccount);

// Authenticate a user
router.post('/authenticate', accountController.authenticateUser);

// Delete an account
router.delete('/:id', accountController.deleteAccount);

// Update an account
router.put('/:id', accountController.updateAccount);

module.exports = router;
