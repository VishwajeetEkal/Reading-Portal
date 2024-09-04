// routes/cart.js
const express = require('express');
const Book = require('../models/Book');
const nodemailer = require('nodemailer');
const router = express.Router();
const Cart = require('../models/cart');
const OrderDetails = require('../models/orderDetails');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken'); // This should be at the top of your file


// Get cart items for a user
router.get('/cart-items', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1]; 
    const decoded = jwt.verify(token, 'mysecretkey170904');
    const user = await User.findById(decoded.userId);
    //console.log(user)
    const cartItems = await Cart.find({ userId: user._id });
    const Items = cartItems[0].items
    console.log(Items)
    res.json(Items);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
});

// Add an item to the cart
router.post('/add-to-cart', async (req, res) => {
  const  book  = req.body;
  console.log(book)
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1]; 
  const decoded = jwt.verify(token, 'mysecretkey170904');
  const user = await User.findById(decoded.userId);
  const userId = user._id;
  try {
    // Check if the book is already in the cart
    const existingItem = await Cart.findOne({ userId, 'items._id': book._id });
    //console.log(existingItem)
    if (existingItem) {
      return res.json({ message: 'Item already in cart' });
    }

    // Add new item to cart
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $push: { items: book } },
      { new: true, upsert: true } // upsert will create a new cart if it doesn't exist
    );
   
    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/update-cart-item', async (req, res) => {
  try {
    const { _id, days } = req.body; // _id is the cart item's id, days is the new quantity
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'mysecretkey170904'); // Use environment variable for secret
    const userId = decoded.userId;

    // Find the cart by userId and update the specific item
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => item._id.equals(_id));
    //console.log(itemIndex)
    if (itemIndex === -1) {
      return res.status(404).send('Item not found in cart');
    }

    // Update the days for the item
    cart.items[itemIndex].days = days;
    //console.log(cart)
    // Save the updated cart
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/remove-cart-item/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'mysecretkey170904'); // Use environment variable for secret
    const userId = decoded.userId;

    // Find the cart by userId and remove the specific item
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(item => !item._id.equals(itemId));

    // Save the updated cart
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/create-order', async (req, res) => {
  const { amount, cardDetails } = req.body;

  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, 'mysecretkey170904');
  const userId = decoded.userId;

  
    // Retrieve the cart items for the user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for the user.' });
    }

    // Extract the cart items
    const cartItems = cart.items;

  try {
    const orderDetails = new OrderDetails({
      userId,
      amount,
      cardDetails: {
        lastFourDigits: cardDetails.lastFourDigits, 
        expiryDate: cardDetails.expiryDate
      },
      cartItems,
      status: 'pending'
    });

    const savedOrderDetails = await orderDetails.save();
   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Set up nodemailer transport
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
      console.log(owner)
      const emailDetails = {
        from: "Support@UBook.com",
        to: owner.email,
        subject: "Your book has been rented",
        html: `
          <h1>Book Rental Notification</h1>
          <p>Dear ${owner.firstname} ${owner.lastname},</p>
          <p>Your book "${book.title}" has been rented.</p>
          <p>Order Number: ${savedOrderDetails._id}</p>
          <p>Rented by user ID: ${userId}</p>
          <p>Rental period: ${cartItem.days} days</p>
          <p>Total Amount: $${cartItem.price_per_day * cartItem.days}</p>
          <p>Status: Awaiting your approval</p>
        `
      };

      await mailTransport.sendMail(emailDetails);
    }
    // Prepare the email details
    const details = {
      from: "Support@UBook.com",
      to: user.email,
      subject: "Order Confirmation",
      html: `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>Order Number: ${savedOrderDetails._id}</p>
        <p>Total Amount: $${amount}</p>
        <h2>Order Details:</h2>
        ${cartItems.map(item => `<p>${item.title} - ${item.days} days at $${item.price_per_day} per day</p>`).join('')}
        <p>Status: Awaiting Approval</p>
      `
    };

    await mailTransport.sendMail(details);

    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
    console.log(cartItems)
    console.log(amount)
    res.status(201).json({ message: 'Order has been created and is awaiting approval.', orderdata:{cartItems,amount} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order details.' });
  }
});

module.exports = router;
