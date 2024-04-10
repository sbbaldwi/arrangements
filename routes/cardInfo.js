const express = require('express');
const router = express.Router();
const CardInfoController = require('../controllers/cardInfo');

router.get('/', CardInfoController.getAllCardInfo);

router.get('/:id', CardInfoController.getCardInfoById);

router.post('/', CardInfoController.createCardInfo);

router.put('/:id', CardInfoController.updateCardInfo);

router.delete('/:id', CardInfoController.deleteCardInfo);

module.exports = router;