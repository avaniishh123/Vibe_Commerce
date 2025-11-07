const { processCheckout } = require('../controllers/checkoutController');

describe('Checkout Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('processCheckout', () => {
    it('should process checkout and return receipt', async () => {
      const mockCartItems = [
        {
          productId: { price: 1000 },
          qty: 2
        },
        {
          productId: { price: 1500 },
          qty: 1
        }
      ];
      const mockCustomerInfo = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      req.body = {
        cartItems: mockCartItems,
        customerInfo: mockCustomerInfo
      };

      await processCheckout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        receipt: expect.objectContaining({
          total: 3500,
          timestamp: expect.any(String),
          items: mockCartItems,
          customerInfo: mockCustomerInfo
        })
      });
    });

    it('should return 400 if cartItems is missing', async () => {
      req.body = {
        customerInfo: { name: 'John', email: 'john@example.com' }
      };

      await processCheckout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Cart items are required'
      });
    });

    it('should return 400 if cartItems is empty array', async () => {
      req.body = {
        cartItems: [],
        customerInfo: { name: 'John', email: 'john@example.com' }
      };

      await processCheckout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Cart items are required'
      });
    });

    it('should return 400 if customerInfo is missing', async () => {
      req.body = {
        cartItems: [{ productId: { price: 1000 }, qty: 1 }]
      };

      await processCheckout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Customer name and email are required'
      });
    });

    it('should return 400 if customer name is missing', async () => {
      req.body = {
        cartItems: [{ productId: { price: 1000 }, qty: 1 }],
        customerInfo: { email: 'john@example.com' }
      };

      await processCheckout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Customer name and email are required'
      });
    });

    it('should calculate total correctly with different price formats', async () => {
      req.body = {
        cartItems: [
          { price: 1000, qty: 2 },
          { productId: { price: 500 }, qty: 3 }
        ],
        customerInfo: { name: 'John', email: 'john@example.com' }
      };

      await processCheckout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        receipt: expect.objectContaining({
          total: 3500
        })
      });
    });

    it('should handle errors gracefully', async () => {
      req.body = {
        cartItems: [{ productId: null, qty: 1 }],
        customerInfo: { name: 'John', email: 'john@example.com' }
      };

      // This should not throw but calculate total as 0
      await processCheckout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        receipt: expect.objectContaining({
          total: 0
        })
      });
    });
  });
});
