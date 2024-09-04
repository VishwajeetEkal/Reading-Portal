const express = require('express');
const nodemailer = require('nodemailer');
const OrderDetails = require('../models/orderDetails'); 
const RentedBook = require('../models/RentedBook');
const User = require('../models/user_model');
const Book = require('../models/Book');
const router = express.Router();


router.get('/orders', async (req, res) => {
    const { status } = req.query; // Retrieve the status from query parameters
  
    try {
      const query = status ? { status } : {}; // If status is provided, use it in the query
      const orders = await OrderDetails.find(query);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Error fetching orders.' });
    }
  });
  
// Endpoint to update order status
router.put('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // 'approved' or 'declined'

  try {
    const updatedOrder = await OrderDetails.findByIdAndUpdate(orderId, { status }, { new: true });
    if (status === 'approved') {
      for (const item of updatedOrder.cartItems) {
        const newRentedBook = new RentedBook({
          bookId: item._id, // Make sure this is the book ID
          renterUserId: updatedOrder.userId, // The user who rented the books
          days: item.days, // The number of days for the rental
          status: 'delivered'
        });

        await newRentedBook.save();
      }

      // Possibly update the Book model to indicate that it's rented
    }
    const cartItems = updatedOrder.cartItems
    const userId = updatedOrder.userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ubookint@gmail.com",
        pass: "ufgj gaun khqk vpsn"  
      }
    });

    for (const cartItem of cartItems) {
      const book = await Book.findById(cartItem._id);
      const owner = await User.findById(book.owner_user_id);
      const emailDetails = {
        from: "Support@UBook.com",
        to: owner.email,
        subject: "Your book has been rented",
        html: `
          <h1>Book Rental Notification</h1>
          <p>Dear ${owner.firstname} ${owner.lastname},</p>
          <p>Your book "${book.title}" has been rented.</p>
          <p>Order Number: ${updatedOrder._id}</p>
          <p>Rented by user ID: ${userId}</p>
          <p>Rental period: ${cartItem.days} days</p>
          <p>Total Amount: $${cartItem.price_per_day * cartItem.days}</p>
          <p>Status: ${status}</p>
        `
      };
      await mailTransport.sendMail(emailDetails);
    }
    console.log(cartItems)
    const details = {
      from: "Support@UBook.com",
      to: user.email,
      subject: "Order Confirmation",
      html: `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>Order Number: ${updatedOrder._id}</p>
        <p>Total Amount: $${updatedOrder.amount}</p>
        <h2>Order Details:</h2>
        ${cartItems.map(item => `<p>${item.title} - ${item.days} days at $${item.price_per_day} per day</p>`).join('')}
        <p>Status: ${status}</p>
      `
    };

    await mailTransport.sendMail(details);

    console.log(updatedOrder);
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order.' });
  }
});

module.exports = router;
