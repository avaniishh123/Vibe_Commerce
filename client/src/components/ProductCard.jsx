import { formatPrice } from '../utils/formatPrice';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      {/* Product image with aspect ratio container */}
      <div className="relative w-full pt-[75%] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      {/* Product details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Category badge */}
        {product.category && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium w-fit mb-2">
            {product.category}
          </span>
        )}
        
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        
        {/* Shipping and Tax badges */}
        {(product.shippingCost > 0 || product.taxRate > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.shippingCost > 0 && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                + {formatPrice(product.shippingCost)} shipping
              </span>
            )}
            {product.taxRate > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                {product.taxRate}% tax
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4 mt-auto">
          <span className="text-xl sm:text-2xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
          {product.stock > 0 && product.stock <= 10 && (
            <span className="text-xs sm:text-sm text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
              Only {product.stock} left
            </span>
          )}
        </div>
        
        {/* Touch-friendly button */}
        <button
          onClick={() => onAddToCart(product._id)}
          disabled={product.stock === 0}
          className={`w-full btn-touch rounded-md font-medium transition-all duration-200 text-sm sm:text-base ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'btn-primary shadow-sm hover:shadow-md'
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
