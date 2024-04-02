const express = require('express');
const router = express.Router();
const arrangements = require('../controllers/arrangements');

router.get('/arrangements/:id', arrangements.getArrangementById);
router.post('/', arrangements.uploadArrangement, arrangements.createArrangement);
router.put('/arrangements/:id', arrangements.updateArrangement);
router.delete('/arrangements/:id', arrangements.deleteArrangement);

module.exports = router;
