const express = require('express');
const router = express.Router();
const arrangements = require('../controllers/arrangements');

router.get('/arrangements/:id', arrangements.getArrangementById);
router.post('/arrangements', arrangements.uploadMiddleware, arrangements.createArrangement); 
router.put('/arrangements/:id', arrangements.updateArrangement);
router.delete('/arrangements/:id', arrangements.deleteArrangement);

module.exports = router;
