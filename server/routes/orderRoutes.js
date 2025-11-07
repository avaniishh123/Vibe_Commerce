const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById } = require('../controllers/orderController');

// POST /api/orders - Create new order
router.post('/', createOrder);

// GET /api/orders/user/:userId - Get all orders for a user
router.get('/user/:userId', getUserOrders);

// GET /api/orders/:orderId - Get specific order
router.get('/:orderId', getOrderById);

module.exports = router;
