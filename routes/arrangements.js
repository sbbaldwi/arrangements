const express = require('express');
const router = express.Router();
const arrangementsController = require('../controllers/arrangements');
const upload = require('../middleware/upload'); // Ensure this path matches the location of your multer configuration

router.post('/upload', upload.fields([{ name: 'sheetMusic', maxCount: 1 }, { name: 'recording', maxCount: 1 }]), arrangementsController.uploadArrangement);
router.get('/:id', arrangementsController.getArrangementById);
router.get('/', arrangementsController.getAllArrangements);
router.put('/:id', arrangementsController.updateArrangement);
router.delete('/:id', arrangementsController.deleteArrangement);

module.exports = router;

