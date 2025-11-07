const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('../config/testDb');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// Import routes
const productRoutes = require('../routes/productRoutes');
const cartRoutes = require('../routes/cartRoutes');
const checkoutRoutes = require('../routes/checkoutRoutes');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

describe('API Integration Tests', () => {
  let testProduct1, testProduct2;

  beforeAll(async () => {
    await connectTestDB();
  }, 30000);

  afterAll(async () => {
    await disconnectTestDB();
  }, 30000);

  beforeEach(async () => {
    await clearTestDB();
    
    // Create test products
    testProduct1 = await Product.create({
      name: 'Test Product 1',
      price: 1000,
      image: 'https://example.com/image1.jpg',
      stock: 10
    });

    testProduct2 = await Product.create({
      name: 'Test Product 2',
      price: 1500,
      image: 'https://example.com/image2.jpg',
      stock: 5
    });
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBe('Test Product 1');
      expect(response.body.data[1].name).toBe('Test Product 2');
    });

    it('should return empty array when no products exist', async () => {
      await clearTestDB();

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('POST /api/cart', () => {
    it('should add item to cart with valid data', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: testProduct1._id.toString(),
          qty: 2,
          userId: 'test_user'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.productId).toBe(testProduct1._id.toString());
      expect(response.body.data.qty).toBe(2);
      expect(response.body.data.userId).toBe('test_user');
    });

    it('should return 400 with missing productId', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          qty: 2
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Product ID and quantity are required');
    });

    it('should return 400 with invalid quantity', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: testProduct1._id.toString(),
          qty: -1
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Quantity must be at least 1');
    });

    it('should return 404 with non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: fakeId.toString(),
          qty: 1
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Product not found');
    });
  });

  describe('GET /api/cart', () => {
    beforeEach(async () => {
      // Add items to cart
      await Cart.create({
        productId: testProduct1._id,
        qty: 2,
        userId: 'test_user'
      });

      await Cart.create({
        productId: testProduct2._id,
        qty: 1,
        userId: 'test_user'
      });
    });

    it('should return cart items with total', async () => {
      const response = await request(app)
        .get('/api/cart')
        .query({ userId: 'test_user' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.total).toBe(3500); // (1000 * 2) + (1500 * 1)
    });

    it('should return empty cart for user with no items', async () => {
      const response = await request(app)
        .get('/api/cart')
        .query({ userId: 'empty_user' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(0);
      expect(response.body.data.total).toBe(0);
    });
  });

  describe('DELETE /api/cart/:id', () => {
    let cartItem;

    beforeEach(async () => {
      cartItem = await Cart.create({
        productId: testProduct1._id,
        qty: 2,
        userId: 'test_user'
      });
    });

    it('should remove cart item successfully', async () => {
      const response = await request(app)
        .delete(`/api/cart/${cartItem._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Item removed from cart');

      // Verify item is deleted
      const deletedItem = await Cart.findById(cartItem._id);
      expect(deletedItem).toBeNull();
    });

    it('should return 404 for non-existent cart item', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/cart/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Cart item not found');
    });
  });

  describe('POST /api/checkout', () => {
    it('should process checkout successfully', async () => {
      const cartItems = [
        {
          productId: { price: 1000 },
          qty: 2
        },
        {
          productId: { price: 1500 },
          qty: 1
        }
      ];

      const customerInfo = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/api/checkout')
        .send({
          cartItems,
          customerInfo
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.receipt.total).toBe(3500);
      expect(response.body.receipt.customerInfo).toEqual(customerInfo);
      expect(response.body.receipt.timestamp).toBeDefined();
    });

    it('should return 400 with missing cart items', async () => {
      const response = await request(app)
        .post('/api/checkout')
        .send({
          customerInfo: {
            name: 'John Doe',
            email: 'john@example.com'
          }
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Cart items are required');
    });

    it('should return 400 with missing customer info', async () => {
      const response = await request(app)
        .post('/api/checkout')
        .send({
          cartItems: [{ productId: { price: 1000 }, qty: 1 }]
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Customer name and email are required');
    });
  });
});
