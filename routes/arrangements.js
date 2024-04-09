const express = require('express');
const router = express.Router();
const arrangements = require('../controllers/arrangements');

router.get('/:id', arrangements.getArrangementById);
router.get('/', arrangements.getAllArrangements)
router.post('/', arrangements.uploadMiddleware, arrangements.createArrangement);
router.put('/:id', arrangements.updateArrangement);
router.delete('/:id', arrangements.deleteArrangement);

module.exports = router;
