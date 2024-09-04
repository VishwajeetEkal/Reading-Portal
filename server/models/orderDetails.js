const mongoose = require('mongoose');

const orderDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  cardDetails: {
    lastFourDigits: String,
    expiryDate: String,
    // Do not store the full card number or CVV
  },
  cartItems: [{
    // Reference to cart item schema or embedded cart item details
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    days: Number,
    title: String,
    price_per_day: Number,
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  }
}, { timestamps: true }); // Add timestamps to track when the order was placed

const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema);

module.exports = OrderDetails;
