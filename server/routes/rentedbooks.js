const express = require('express');
const RentedBook = require('../models/RentedBook'); 
const Book = require('../models/Book');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Fetch rented books for a specific user
router.get('/getbooks', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1]; 
    const decoded = jwt.verify(token, 'mysecretkey170904');
    const user = await User.findById(decoded.userId);

    const rentedBooks = await RentedBook.find({ renterUserId: user._id })
                                        .populate('bookId')
                                        .exec();
    const currentRentals = rentedBooks.filter(book => book.status === 'delivered');
    const pastRentals = rentedBooks.filter(book => book.status === 'returned');
    const pendingReviewRentals = rentedBooks.filter(book => book.status === 'returned' && !book.reviewed);
    const current = currentRentals.map(book => ({
      _id: book._id,
      title: book.bookId.title,
      author: book.bookId.author,
      genre: book.bookId.genre,
      startDate: book.startDate,
      days: book.days,
      price_per_day: book.bookId.price_per_day,
      image: book.bookId.image,
      owner_user_id: book.bookId.owner_user_id
    }))
    const past = pastRentals.map(book => ({
      _id: book._id,
      title: book.bookId.title,
      author: book.bookId.author,
      genre: book.bookId.genre,
      startDate: book.startDate,
      days: book.days,
      price_per_day: book.bookId.price_per_day,
      image: book.bookId.image,
      owner_user_id: book.bookId.owner_user_id,
      reviewed: book.reviewed
    }))
    const pendingReview = pendingReviewRentals.map(book => ({
      _id: book._id,
      title: book.bookId.title,
      author: book.bookId.author,
      genre: book.bookId.genre,
      startDate: book.startDate,
      days: book.days,
      price_per_day: book.bookId.price_per_day,
      image: book.bookId.image,
      owner_user_id: book.bookId.owner_user_id,
      reviewed: book.reviewed
    }))
    res.json({ current, past, pendingReview});
  } catch (error) {
    console.error('Error fetching rented books:', error);
    res.status(500).json({ message: 'Error fetching rented books.' });
  }
});

router.post('/review/:userId', async (req, res) => {
  const { userId } = req.params;
  const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'mysecretkey170904'); // Use environment variable for secret
    const reviewerUserId= decoded.userId;
  const {rating, comment,rentedBookId } = req.body;
  console.log(userId)
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.reviews.push({ reviewerUserId, rating, comment });
    await user.save();

  //   const rentedBook = await RentedBook.findById(rentedBookId);
  //   if (rentedBook) {
  //     rentedBook.reviewed = true;
  //   await rentedBook.save();
  //  }

   const updatedRentedBook = await RentedBook.findByIdAndUpdate(
    rentedBookId,
    { reviewed : true },
    { new: true }
  )

    res.status(200).json({ message: 'Review added successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review.', error: error.message });
  }
});

router.put('/update-status/:rentedBookId', async (req, res) => {
  const { rentedBookId } = req.params;
  const { status } = req.body; 

  try {
    const updatedRentedBook = await RentedBook.findByIdAndUpdate(
      rentedBookId,
      { status },
      { new: true }
    ).populate('bookId');

    if (!updatedRentedBook) {
      return res.status(404).json({ message: 'Rented book not found.' });
    }
    
    const book = updatedRentedBook.bookId;
    //console.log(book)
    res.json({_id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      startDate: updatedRentedBook.startDate,
      days: updatedRentedBook.days,
      price_per_day: book.price_per_day,
      image: book.image,
      owner_user_id: book.owner_user_id,
      status: updatedRentedBook.status
    });
  } catch (error) {
    console.error('Error updating rented book status:', error);
    res.status(500).json({ message: 'Error updating rented book status.' });
  }
});

module.exports = router;
