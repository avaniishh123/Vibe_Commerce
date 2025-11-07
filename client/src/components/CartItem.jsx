import { useState } from 'react';
import { formatPrice } from '../utils/formatPrice';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [quantity, setQuantity] = useState(item.qty);

  const handleQuantityChange = (newQty) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    onUpdateQuantity(item._id, newQty);
  };

  const handleIncrement = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      handleQuantityChange(value);
    }
  };

  // Calculate subtotal
  const subtotal = item.productId.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Product thumbnail */}
      <div className="w-full sm:w-24 h-24 flex-shrink-0">
        <img
          src={item.productId.image}
          alt={item.productId.name}
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
        />
      </div>

      {/* Product details - responsive layout */}
      <div className="flex-1 min-w-0 w-full sm:w-auto">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
          {item.productId.name}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base font-medium">
          {formatPrice(item.productId.price)} each
        </p>
      </div>

      {/* Quantity controls - touch-friendly */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <span className="text-sm text-gray-600 sm:hidden">Quantity:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            className="btn-touch w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-md text-gray-700 font-bold text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            min="1"
            className="w-16 sm:w-20 h-10 sm:h-11 text-center border-2 border-gray-300 rounded-md text-base sm:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Quantity"
          />
          <button
            onClick={handleIncrement}
            className="btn-touch w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-md text-gray-700 font-bold text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal and remove button - responsive layout */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
        {/* Subtotal */}
        <div className="text-left sm:text-right min-w-[100px]">
          <p className="text-xs sm:text-sm text-gray-500">Subtotal</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">
            {formatPrice(subtotal)}
          </p>
        </div>

        {/* Remove button - touch-friendly */}
        <button
          onClick={() => onRemove(item._id)}
          className="btn-touch btn-danger text-sm sm:text-base whitespace-nowrap flex items-center gap-2"
          aria-label="Remove item from cart"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
