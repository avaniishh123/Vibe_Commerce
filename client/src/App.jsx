import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import { getCart } from './services/api';

// Shop page component (products with header/footer)
const Shop = () => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchCartCount();
    const interval = setInterval(fetchCartCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await getCart();
      const totalItems = response.data.items.reduce((sum, item) => sum + item.qty, 0);
      setCartItemCount(totalItems);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
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
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="hidden sm:inline">Shop</span>
              </Link>
              <Link 
                to="/cart" 
                className="text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 active:bg-gray-200 min-h-[44px] flex items-center gap-2 relative"
              >
                <div className="relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
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

      {/* Main content */}
      <main className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)]">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Products</h2>
          <ProductGrid />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center text-gray-600 text-xs sm:text-sm">
            <p className="mb-2">© 2025 Vibe Commerce. All rights reserved.</p>
            <p className="text-gray-500">Built with React, Express, and MongoDB</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing and Auth Routes (no header/footer) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Shop Routes (with header/footer) */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  );
}

export default App;
