const { getProducts } = require('../controllers/productController');
const Product = require('../models/Product');

// Mock the Product model
jest.mock('../models/Product');

describe('Product Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return all products with success response', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', price: 1000, image: 'img1.jpg', stock: 10 },
        { _id: '2', name: 'Product 2', price: 2000, image: 'img2.jpg', stock: 5 }
      ];

      Product.find.mockResolvedValue(mockProducts);

      await getProducts(req, res);

      expect(Product.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProducts
      });
    });

    it('should handle database errors', async () => {
      const errorMessage = 'Database error';
      Product.find.mockRejectedValue(new Error(errorMessage));

      await getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to fetch products'
      });
    });
  });
});
