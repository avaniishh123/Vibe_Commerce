import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from './Toast';
import { getCart, checkout } from '../services/api';
import { formatPrice } from '../utils/formatPrice';

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [cartItems, setCartItems] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCart();
      const items = response.data.items;
      
      // If cart is empty, redirect to cart page
      if (items.length === 0) {
        navigate('/cart');
        return;
      }
      
      setCartItems(items);
    } catch (err) {
      setError(err.message || 'Failed to load cart items');
      console.error('Failed to fetch cart items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToast({
        message: 'Please fix the form errors',
        type: 'error'
      });
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await checkout(cartItems, {
        name: formData.name,
        email: formData.email
      });
      
      setReceipt(response.receipt);
      
      // Save order to database
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const { createOrder } = await import('../services/api');
        
        await createOrder({
          userId: user.id || 'guest',
          userEmail: formData.email,
          userName: formData.name,
          items: cartItems.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            qty: item.qty,
            image: item.productId.image,
            shippingCost: item.productId.shippingCost || 0,
            taxRate: item.productId.taxRate || 0
          })),
          subtotal: response.receipt.subtotal,
          shipping: response.receipt.shipping,
          tax: response.receipt.tax,
          total: response.receipt.total
        });
      } catch (orderError) {
        console.error('Failed to save order:', orderError);
        // Don't show error to user, order was still processed
      }
      
      setToast({
        message: 'Order placed successfully!',
        type: 'success'
      });
    } catch (err) {
      setError(err.message || 'Failed to process checkout');
      setToast({
        message: err.message || 'Failed to process checkout',
        type: 'error'
      });
      console.error('Failed to process checkout:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.qty);
    }, 0);
  };

  const calculateShipping = () => {
    return cartItems.reduce((sum, item) => {
      const shippingCost = item.productId.shippingCost || 0;
      return sum + (shippingCost * item.qty);
    }, 0);
  };

  const calculateTax = () => {
    return cartItems.reduce((sum, item) => {
      const itemSubtotal = item.productId.price * item.qty;
      const taxRate = item.productId.taxRate || 0;
      return sum + (itemSubtotal * taxRate / 100);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const closeToast = () => {
    setToast(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h2>
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Display receipt after successful checkout
  if (receipt) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        {/* Toast notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4 animate-pulse-scale">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 text-sm sm:text-base">Thank you for your purchase</p>
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Order Details</h3>
            
            <div className="space-y-2 sm:space-y-3 mb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium text-right">{new Date(receipt.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium text-right break-all">{receipt.customerInfo.name}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-right break-all">{receipt.customerInfo.email}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatPrice(receipt.subtotal)}</span>
                </div>
                {receipt.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">{formatPrice(receipt.shipping)}</span>
                  </div>
                )}
                {receipt.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">{formatPrice(receipt.tax)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Items Ordered:</h4>
              <div className="space-y-3">
                {receipt.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start gap-4 text-xs sm:text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 line-clamp-2">{item.productId.name}</p>
                      <p className="text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <span className="font-medium whitespace-nowrap">{formatPrice(item.productId.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-lg sm:text-xl md:text-2xl font-bold mb-8">
            <span>Total Amount:</span>
            <span className="text-blue-600">{formatPrice(receipt.total)}</span>
          </div>

          <Link
            to="/"
            className="block w-full text-center btn-touch btn-primary text-sm sm:text-base"
          >
            Back to Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Display checkout form
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-2xl">
          <p className="text-red-600 text-sm sm:text-base">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-6">Customer Information</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    validationErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {validationErrors.name && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {validationErrors.email && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-touch btn-primary text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    'Complete Order'
                  )}
                </button>
                <Link
                  to="/cart"
                  className="btn-touch btn-secondary text-sm sm:text-base text-center"
                >
                  Back to Cart
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Order summary - sticky on desktop */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 lg:sticky lg:top-4">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between gap-3 text-xs sm:text-sm pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 line-clamp-2">{item.productId.name}</p>
                    <p className="text-gray-500 mt-1">Qty: {item.qty}</p>
                    {item.productId.shippingCost > 0 && (
                      <p className="text-xs text-orange-600 mt-0.5">
                        + {formatPrice(item.productId.shippingCost * item.qty)} shipping
                      </p>
                    )}
                    {item.productId.taxRate > 0 && (
                      <p className="text-xs text-blue-600 mt-0.5">
                        {item.productId.taxRate}% tax
                      </p>
                    )}
                  </div>
                  <span className="font-medium whitespace-nowrap">{formatPrice(item.productId.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="border-t-2 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
              </div>
              {calculateShipping() > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{formatPrice(calculateShipping())}</span>
                </div>
              )}
              {calculateTax() > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(calculateTax())}</span>
                </div>
              )}
              <div className="flex justify-between text-lg sm:text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-2xl">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base inline-flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Shopping
        </Link>
      </div>
    </div>
  );
};

export default Checkout;
