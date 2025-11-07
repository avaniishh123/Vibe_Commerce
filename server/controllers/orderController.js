const Order = require('../models/Order');

/**
 * Create a new order
 * @route POST /api/orders
 * @access Public
 */
const createOrder = async (req, res) => {
  try {
    const { userId, userEmail, userName, items, subtotal, shipping, tax, total } = req.body;

    // Validate required fields
    if (!userId || !userEmail || !userName || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required order information'
      });
    }

    // Create order
    const order = await Order.create({
      userId,
      userEmail,
      userName,
      items,
      subtotal,
      shipping: shipping || 0,
      tax: tax || 0,
      total,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
};

/**
 * Get orders for a specific user
 * @route GET /api/orders/user/:userId
 * @access Public
 */
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Find all orders for this user, sorted by most recent first
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
};

/**
 * Get a specific order by ID
 * @route GET /api/orders/:orderId
 * @access Public
 */
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById
};
