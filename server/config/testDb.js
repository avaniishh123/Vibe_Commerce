const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const connectTestDB = async () => {
  try {
    // Use test database URI or append _test to existing database
    const testUri = process.env.MONGODB_TEST_URI || process.env.MONGODB_URI;
    
    await mongoose.connect(testUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Test database connected');
  } catch (error) {
    console.error('Test database connection error:', error);
    process.exit(1);
  }
};

const disconnectTestDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Test database disconnected');
  } catch (error) {
    console.error('Error disconnecting test database:', error);
  }
};

const clearTestDB = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error('Error clearing test database:', error);
  }
};

module.exports = {
  connectTestDB,
  disconnectTestDB,
  clearTestDB
};
