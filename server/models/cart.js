const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // This will be the Book ID
  title: String,
  price_per_day: Number,
  days: {
    type: Number,
    default: 1,
    min: [1, 'Days can not be less then 1.']
  },
  // Add any other book details you want to store in the cart
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Assuming you have a User model
  },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Cart', CartSchema);
