const express = require('express');
const router = express.Router();
const arrangements = require('../controllers/arrangements');
const upload = require('../middleware/upload')

router.get('/:id', arrangements.getArrangementById);
router.get('/', arrangements.getAllArrangements)
router.post('/', [
    upload.single('pdfDocument'),
    upload.single('mp3Recording'),
    upload.single('coverImage')
], arrangements.createArrangement);
router.put('/:id', arrangements.updateArrangement);
router.delete('/:id', arrangements.deleteArrangement);

module.exports = router;
