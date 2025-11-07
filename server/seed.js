require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

// Mock products data
// Note: shippingCost is in cents, taxRate is percentage (e.g., 10 = 10%)
const products = [
  {
    name: 'Wireless Headphones',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 15,
    category: 'Audio',
    shippingCost: 0,
    taxRate: 0
  },
  {
    name: 'Smart Watch',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    stock: 20,
    category: 'Electronics',
    shippingCost: 0,
    taxRate: 0
  },
  {
    name: 'Laptop Backpack',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    stock: 30,
    category: 'Accessories',
    shippingCost: 0,
    taxRate: 0
  },
  {
    name: 'USB-C Hub',
    price: 899,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    stock: 25,
    category: 'Computing',
    shippingCost: 0,
    taxRate: 0
  },
  {
    name: 'Mechanical Keyboard',
    price: 4599,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    stock: 12,
    category: 'Computing',
    shippingCost: 499, // Heavy item - $4.99 shipping
    taxRate: 8 // 8% tax
  },
  {
    name: 'Wireless Mouse',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    stock: 40,
    category: 'Computing',
    shippingCost: 0,
    taxRate: 0
  },
  {
    name: 'Phone Stand',
    price: 599,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
    stock: 50,
    category: 'Accessories',
    shippingCost: 0,
    taxRate: 0
  },
  {
    name: 'Bluetooth Speaker',
    price: 3299,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    stock: 18,
    category: 'Audio',
    shippingCost: 599, // Heavy item - $5.99 shipping
    taxRate: 10 // 10% tax
  },
  {
    name: 'Webcam HD',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500',
    stock: 22,
    category: 'Electronics',
    shippingCost: 0,
    taxRate: 0
  },
  {
    name: 'Desk Lamp',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    stock: 35,
    category: 'Home',
    shippingCost: 399, // Heavy item - $3.99 shipping
    taxRate: 5 // 5% tax
  },
  {
    name: 'Portable Charger',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    stock: 45,
    category: 'Electronics',
    shippingCost: 0,
    taxRate: 0
  },
  {
    name: 'Noise Cancelling Earbuds',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    stock: 28,
    category: 'Audio',
    shippingCost: 0,
    taxRate: 0
  },
  {
    name: 'Gaming Mouse Pad',
    price: 799,
    image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=500',
    stock: 60,
    category: 'Accessories',
    shippingCost: 0,
    taxRate: 0
  },
  {
    name: 'USB Microphone',
    price: 4299,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500',
    stock: 15,
    category: 'Audio',
    shippingCost: 699, // Heavy item - $6.99 shipping
    taxRate: 12 // 12% tax
  },
  {
    name: 'Laptop Stand',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    stock: 38,
    category: 'Accessories',
    shippingCost: 0,
    taxRate: 0
  }
];

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123'
};

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products inserted successfully`);

    // Insert mock user
    const createdUser = await User.create(mockUser);
    console.log(`Mock user created: ${createdUser.name} (${createdUser.email})`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
