import axios from 'axios';

// Create Axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Network error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// API service functions

/**
 * Register a new user
 * @param {Object} userData - User data (name, email, password)
 * @returns {Promise} Promise resolving to user data
 */
export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - User credentials (email, password)
 * @returns {Promise} Promise resolving to user data
 */
export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

/**
 * Reset password
 * @param {Object} resetData - Reset data (email, newPassword, confirmPassword)
 * @returns {Promise} Promise resolving to success message
 */
export const resetPassword = async (resetData) => {
  const response = await api.post('/api/auth/reset-password', resetData);
  return response.data;
};

/**
 * Fetch all products from the backend
 * @returns {Promise} Promise resolving to products array
 */
export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

/**
 * Add a product to the cart
 * @param {string} productId - The ID of the product to add
 * @param {number} qty - The quantity to add (default: 1)
 * @returns {Promise} Promise resolving to the created cart item
 */
export const addToCart = async (productId, qty = 1) => {
  const response = await api.post('/api/cart', {
    productId,
    qty,
    userId: 'mock_user_1',
  });
  return response.data;
};

/**
 * Fetch all cart items for the current user
 * @returns {Promise} Promise resolving to cart items and total
 */
export const getCart = async () => {
  const response = await api.get('/api/cart', {
    params: { userId: 'mock_user_1' },
  });
  return response.data;
};

/**
 * Update cart item quantity
 * @param {string} itemId - The ID of the cart item to update
 * @param {number} qty - The new quantity
 * @returns {Promise} Promise resolving to updated cart item
 */
export const updateCartQuantity = async (itemId, qty) => {
  const response = await api.put(`/api/cart/${itemId}`, { qty });
  return response.data;
};

/**
 * Remove a specific item from the cart
 * @param {string} itemId - The ID of the cart item to remove
 * @returns {Promise} Promise resolving to success message
 */
export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/api/cart/${itemId}`);
  return response.data;
};

/**
 * Process checkout with cart items and customer information
 * @param {Array} cartItems - Array of cart items to checkout
 * @param {Object} customerInfo - Customer information (name, email)
 * @returns {Promise} Promise resolving to receipt object
 */
export const checkout = async (cartItems, customerInfo) => {
  const response = await api.post('/api/checkout', {
    cartItems,
    userId: 'mock_user_1',
    customerInfo,
  });
  return response.data;
};

/**
 * Create a new order
 * @param {Object} orderData - Order data (userId, userEmail, userName, items, subtotal, shipping, tax, total)
 * @returns {Promise} Promise resolving to created order
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/api/orders', orderData);
  return response.data;
};

/**
 * Get all orders for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise} Promise resolving to array of orders
 */
export const getUserOrders = async (userId) => {
  const response = await api.get(`/api/orders/user/${userId}`);
  return response.data;
};

/**
 * Get a specific order by ID
 * @param {string} orderId - The order ID
 * @returns {Promise} Promise resolving to order details
 */
export const getOrderById = async (orderId) => {
  const response = await api.get(`/api/orders/${orderId}`);
  return response.data;
};

export default api;
