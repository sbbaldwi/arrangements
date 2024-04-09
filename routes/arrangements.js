const express = require('express');
const router = express.Router();
const arrangementsController = require('../controllers/arrangements');
const upload = require('../middleware/upload')

router.get('/:id', arrangementsController.getArrangementById);
router.get('/', arrangementsController.getAllArrangements)
router.post('/upload', arrangementsController.uploadArrangement);
router.put('/:id', arrangementsController.updateArrangement);
router.delete('/:id', arrangementsController.deleteArrangement);

module.exports = router;
