/**
 * Process checkout and generate mock receipt
 * @route POST /api/checkout
 * @access Public
 */
const processCheckout = async (req, res) => {
  try {
    const { cartItems, customerInfo } = req.body;

    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart items are required'
      });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      return res.status(400).json({
        success: false,
        error: 'Customer name and email are required'
      });
    }

    // Calculate subtotal, shipping, and taxes
    let subtotal = 0;
    let totalShipping = 0;
    let totalTax = 0;

    cartItems.forEach(item => {
      const product = item.productId;
      const price = product?.price || item.price || 0;
      const qty = item.qty || 1;
      const itemSubtotal = price * qty;
      
      subtotal += itemSubtotal;
      
      // Add shipping cost (per item quantity)
      if (product?.shippingCost) {
        totalShipping += product.shippingCost * qty;
      }
      
      // Calculate tax on item subtotal
      if (product?.taxRate) {
        const itemTax = (itemSubtotal * product.taxRate) / 100;
        totalTax += itemTax;
      }
    });

    // Calculate final total
    const total = subtotal + totalShipping + totalTax;

    // Generate mock receipt
    const receipt = {
      subtotal,
      shipping: totalShipping,
      tax: totalTax,
      total,
      timestamp: new Date().toISOString(),
      items: cartItems,
      customerInfo
    };

    res.status(200).json({
      success: true,
      receipt
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process checkout'
    });
  }
};

module.exports = {
  processCheckout
};
