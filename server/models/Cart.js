const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  userId: {
    type: String,
    required: true,
    default: 'mock_user_1'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient cart queries
cartSchema.index({ userId: 1, productId: 1 });

module.exports = mongoose.model('Cart', cartSchema);
