const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart'); // Adjust the path as necessary

router.get('/:userId', CartController.getCartItems);

router.post('/', CartController.addItemToCart);

router.put('/:id', CartController.updateCartItem);

router.delete('/:id', CartController.deleteCartItem);

module.exports = router;
