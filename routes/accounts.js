const express = require('express');
const router = express.Router();

const accountsController = require('../controllers/accounts');

router.get('/', accountsController.getAll);
router.get('/:id', accountsController.getSingle);
router.post('/', accountsController.createAccount);
router.put('/:id', accountsController.updateAccount);
router.delete('/:id', accountsController.deleteAccount);

module.exports = router;