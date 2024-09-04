const express = require('express');
const RentedBook = require('../models/RentedBook'); 
const Book = require('../models/Book');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/allbooks', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1]; 
        const decoded = jwt.verify(token, 'mysecretkey170904');
        const userId = decoded.userId;

        // Fetch all books posted by the user
        const books = await Book.find({ owner_user_id: userId, active : true });
        const allbooks = await Book.find({ owner_user_id: userId });
        // Fetch all rented books related to the user's books
        const rentedBooks = await RentedBook.find({ bookId: { $in: allbooks.map(book => book._id) } })
                                            .populate('bookId')
                                            .exec();
        console.log(rentedBooks)
        // Filter out books that are currently rented
        const currentRentals = rentedBooks.filter(book => book.status === 'delivered' && !book.reviewed);

        // Filter out books that have been returned and are pending review
        const pendingReviews = rentedBooks.filter(book => book.status === 'returned' && !book.reviewed);
        //console.log({ currentlyPosted: books, pastRented: currentRentals, pendingReviews })
        res.json({ currentlyPosted: books, pastRented: rentedBooks, pendingReviews });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books.' });
    }
});

router.delete('/deletebook/:bookId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send('Authorization token is missing');
    }
    const token = authHeader.split(' ')[1]; 
    const decoded = jwt.verify(token, 'mysecretkey170904');
    const userId = decoded.userId;

    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);

    if (book.owner_user_id.toString() !== userId) {
      return res.status(403).send('You do not have permission to delete this book');
    }

    await Book.findByIdAndUpdate(
      bookId,
      { active:false },
      { new: true }
    ).populate('_id');
    res.status(200).send('Book successfully deleted');
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book.' });
  }
});

module.exports = router;