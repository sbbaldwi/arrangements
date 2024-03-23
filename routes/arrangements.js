const express = require('express');
const router = express.Router();
const arrangements = require('../controllers/arrangements'); 

router.post('/', arrangements.uploadArrangement, arrangements.createArrangement);

module.exports = router;
