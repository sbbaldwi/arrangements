const express = require('express');
const router = express.Router();
const arrangements = require('../controllers/arrangements'); 

router.get('/arrangements/:id', arrangementsController.getArrangementById);
router.post('/', arrangements.uploadArrangement, arrangements.createArrangement);
router.put('/arrangements/:id', arrangementsController.updateArrangement);
router.delete('/arrangements/:id', arrangementsController.deleteArrangement);

module.exports = router;
