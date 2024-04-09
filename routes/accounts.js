const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accounts');

router.post('/create', accountController.createAccount);
router.post('/authenticate', accountController.authenticateUser);

// Additional routes for other operations as needed

module.exports = router;
