const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCartQuantity, removeFromCart } = require('../controllers/cartController');

// POST /api/cart - Add item to cart
router.post('/', addToCart);

// GET /api/cart - Get cart items
router.get('/', getCart);

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', updateCartQuantity);

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', removeFromCart);

module.exports = router;
