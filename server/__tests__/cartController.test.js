const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Mock the models
jest.mock('../models/Cart');
jest.mock('../models/Product');

describe('Cart Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    it('should add item to cart successfully', async () => {
      const mockProduct = { _id: 'prod123', name: 'Test Product', price: 1000 };
      const mockCartItem = { _id: 'cart123', productId: 'prod123', qty: 2, userId: 'mock_user_1' };

      req.body = { productId: 'prod123', qty: 2 };
      Product.findById.mockResolvedValue(mockProduct);
      Cart.create.mockResolvedValue(mockCartItem);

      await addToCart(req, res);

      expect(Product.findById).toHaveBeenCalledWith('prod123');
      expect(Cart.create).toHaveBeenCalledWith({
        productId: 'prod123',
        qty: 2,
        userId: 'mock_user_1'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCartItem
      });
    });

    it('should return 400 if productId is missing', async () => {
      req.body = { qty: 2 };

      await addToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Product ID and quantity are required'
      });
    });

    it('should return 400 if quantity is less than 1', async () => {
      const mockProduct = { _id: 'prod123', name: 'Test Product', price: 1000 };
      req.body = { productId: 'prod123', qty: -1 };
      Product.findById.mockResolvedValue(mockProduct);

      await addToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Quantity must be at least 1'
      });
    });

    it('should return 404 if product not found', async () => {
      req.body = { productId: 'prod123', qty: 2 };
      Product.findById.mockResolvedValue(null);

      await addToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Product not found'
      });
    });

    it('should handle database errors', async () => {
      req.body = { productId: 'prod123', qty: 2 };
      Product.findById.mockRejectedValue(new Error('Database error'));

      await addToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to add item to cart'
      });
    });
  });

  describe('getCart', () => {
    it('should return cart items with total', async () => {
      const mockCartItems = [
        {
          _id: 'cart1',
          productId: { _id: 'prod1', name: 'Product 1', price: 1000 },
          qty: 2,
          userId: 'mock_user_1'
        },
        {
          _id: 'cart2',
          productId: { _id: 'prod2', name: 'Product 2', price: 1500 },
          qty: 1,
          userId: 'mock_user_1'
        }
      ];

      req.query = { userId: 'mock_user_1' };
      Cart.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCartItems)
      });

      await getCart(req, res);

      expect(Cart.find).toHaveBeenCalledWith({ userId: 'mock_user_1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          items: mockCartItems,
          total: 3500
        }
      });
    });

    it('should use default userId if not provided', async () => {
      Cart.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([])
      });

      await getCart(req, res);

      expect(Cart.find).toHaveBeenCalledWith({ userId: 'mock_user_1' });
    });

    it('should handle database errors', async () => {
      Cart.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await getCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to fetch cart'
      });
    });
  });

  describe('removeFromCart', () => {
    it('should remove cart item successfully', async () => {
      const mockCartItem = { _id: 'cart123', productId: 'prod123', qty: 2 };
      req.params = { id: 'cart123' };
      Cart.findByIdAndDelete.mockResolvedValue(mockCartItem);

      await removeFromCart(req, res);

      expect(Cart.findByIdAndDelete).toHaveBeenCalledWith('cart123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Item removed from cart'
      });
    });

    it('should return 404 if cart item not found', async () => {
      req.params = { id: 'cart123' };
      Cart.findByIdAndDelete.mockResolvedValue(null);

      await removeFromCart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Cart item not found'
      });
    });

    it('should handle database errors', async () => {
      req.params = { id: 'cart123' };
      Cart.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      await removeFromCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to remove item from cart'
      });
    });
  });
});
