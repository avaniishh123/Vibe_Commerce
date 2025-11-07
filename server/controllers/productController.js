const Product = require('../models/Product');

/**
 * Get all products
 * @route GET /api/products
 * @access Public
 */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
};

module.exports = {
  getProducts
};
