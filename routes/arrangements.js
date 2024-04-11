const express = require('express');
const router = express.Router();
const arrangementsController = require('../controllers/arrangements');

router.post('/upload', arrangementsController.uploadArrangement);

router.get('/:id', arrangementsController.getArrangementById);
router.get('/', arrangementsController.getAllArrangements);

router.put('/:id', arrangementsController.updateArrangement);

router.delete('/:id', arrangementsController.deleteArrangement);

module.exports = router;
