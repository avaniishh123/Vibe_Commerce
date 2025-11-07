/**
 * Format price from cents to dollar string
 * @param {number} priceInCents - Price in cents (e.g., 2499)
 * @returns {string} Formatted price string (e.g., "$24.99")
 */
export const formatPrice = (priceInCents) => {
  if (typeof priceInCents !== 'number' || isNaN(priceInCents)) {
    return '$0.00';
  }
  
  const dollars = priceInCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
};

/**
 * Calculate total price for cart items
 * @param {Array} items - Array of cart items with price and qty
 * @returns {number} Total price in cents
 */
export const calculateTotal = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }
  
  return items.reduce((total, item) => {
    const price = item.productId?.price || item.price || 0;
    const qty = item.qty || 0;
    return total + (price * qty);
  }, 0);
};
