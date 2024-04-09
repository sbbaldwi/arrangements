const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart'); // Adjust the path as necessary

router.get('/cart/:userId', CartController.getCartItems);

router.post('/cart', CartController.addItemToCart);

router.put('/cart/:id', CartController.updateCartItem);

router.delete('/cart/:id', CartController.deleteCartItem);

module.exports = router;
