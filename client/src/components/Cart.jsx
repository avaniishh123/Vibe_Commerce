import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import Toast from './Toast';
import { getCart, updateCartQuantity, removeFromCart } from '../services/api';
import { formatPrice } from '../utils/formatPrice';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCart();
      setCartItems(response.data.items);
      setTotal(response.data.total);
    } catch (err) {
      setError(err.message || 'Failed to load cart');
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
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

  const handleUpdateQuantity = async (itemId, newQty) => {
    try {
      // Update quantity on backend
      await updateCartQuantity(itemId, newQty);
      // Re-fetch the cart to get updated totals
      await fetchCart();
      setToast({
        message: 'Cart updated successfully',
        type: 'success'
      });
    } catch (err) {
      setToast({
        message: err.message || 'Failed to update quantity',
        type: 'error'
      });
      console.error('Failed to update quantity:', err);
      // Re-fetch cart to revert to correct state
      await fetchCart();
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      // Re-fetch cart after removal
      await fetchCart();
      setToast({
        message: 'Item removed from cart',
        type: 'success'
      });
    } catch (err) {
      setToast({
        message: err.message || 'Failed to remove item',
        type: 'error'
      });
      console.error('Failed to remove item:', err);
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Shopping Cart</h2>
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span className="hidden sm:inline">Vibe Commerce</span>
              <span className="sm:hidden">Vibe</span>
            </Link>
            
            <nav className="flex gap-3 sm:gap-6">
              <Link 
                to="/shop" 
                className="text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] flex items-center"
              >
                <span>Shop</span>
              </Link>
              <Link 
                to="/cart" 
                className="text-sm sm:text-base text-blue-600 font-semibold transition-colors duration-200 px-3 py-2 rounded-md bg-blue-50 min-h-[44px] flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span>Cart</span>
              </Link>
              {user && (
                <Link 
                  to="/orders" 
                  className="text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <span className="hidden sm:inline">Orders</span>
                </Link>
              )}
              {user && (
                <button
                  onClick={handleLogout}
                  className="text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Shopping Cart</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm sm:text-base">{error}</p>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <p className="text-gray-500 text-lg sm:text-xl mb-6">Your cart is empty</p>
          <Link
            to="/"
            className="inline-block btn-touch btn-primary text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Order summary - sticky on desktop */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 lg:sticky lg:top-4">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                </div>
                {calculateShipping() > 0 ? (
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Shipping</span>
                    <span className="font-medium">{formatPrice(calculateShipping())}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                )}
                {calculateTax() > 0 && (
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Tax</span>
                    <span className="font-medium">{formatPrice(calculateTax())}</span>
                  </div>
                )}
              </div>

              <div className="border-t-2 pt-4 mb-6">
                <div className="flex justify-between text-lg sm:text-xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full text-center btn-touch btn-primary mb-3 text-sm sm:text-base"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="block w-full text-center btn-touch btn-secondary text-sm sm:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Cart;
