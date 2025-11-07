const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Add item to cart
 * @route POST /api/cart
 * @access Public
 */
const addToCart = async (req, res) => {
  try {
    const { productId, qty, userId = 'mock_user_1' } = req.body;

    // Validate input
    if (!productId || !qty) {
      return res.status(400).json({
        success: false,
        error: 'Product ID and quantity are required'
      });
    }

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1'
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Create cart item
    const cartItem = await Cart.create({
      productId,
      qty,
      userId
    });

    res.status(201).json({
      success: true,
      data: cartItem
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart'
    });
  }
};

/**
 * Get cart items for user
 * @route GET /api/cart
 * @access Public
 */
const getCart = async (req, res) => {
  try {
    const { userId = 'mock_user_1' } = req.query;

    // Fetch cart items with populated product details
    const cartItems = await Cart.find({ userId }).populate('productId');

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.qty);
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        items: cartItems,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart'
    });
  }
};

/**
 * Update cart item quantity
 * @route PUT /api/cart/:id
 * @access Public
 */
const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { qty } = req.body;

    // Validate quantity
    if (!qty || qty < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1'
      });
    }

    // Find and update cart item
    const cartItem = await Cart.findByIdAndUpdate(
      id,
      { qty },
      { new: true, runValidators: true }
    ).populate('productId');

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: cartItem
    });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart quantity'
    });
  }
};

/**
 * Remove item from cart
 * @route DELETE /api/cart/:id
 * @access Public
 */
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findByIdAndDelete(id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart'
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart
};
