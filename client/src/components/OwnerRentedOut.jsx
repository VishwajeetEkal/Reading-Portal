import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AllPostedBooks({ userId }) {
    const [books, setBooks] = useState({ currentlyPosted: [], pastRented: [], pendingReviews: [] });
    const [selectedFilter, setSelectedFilter] = useState('currentlyPosted');

  useEffect(() => {
    const token = localStorage.getItem('token');
          if (!token) {
            alert('No token found. Please log in.');
            return;
          }
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/rentedout/allbooks`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
          console.log(response.data);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books', error);
      }
    };

    fetchBooks();
  }, [userId]);

  const handleReviewSubmit = async (e, ownerId,rentedBookId) => {
    e.preventDefault();
    const { rating, review } = e.target.elements;
    
    try {
      console.log(ownerId)
      const response = await axios.post(`http://localhost:8080/rentedout/review/${ownerId}`, { 
        rating: rating.value,
        comment: review.value,
        rentedBookId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.status === 200) {
        // Remove the reviewed book from pendingReview and update state
        setBooks(prevState => ({
          ...prevState,
          pendingReview: prevState.pendingReview.filter(book => book._id !== rentedBookId)
        }));
      }
      console.log(books);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };  

  const handleDeleteBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8080/rentedout/deletebook/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 200) {
        setBooks(prevState => ({
          ...prevState,
          currentlyPosted: prevState.currentlyPosted.filter(book => book._id !== bookId),
        }));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };
  return (
    <div className="posted-books">
      <h1>All Posted Books</h1>
      <div className="filter-buttons">
        <button onClick={() => setSelectedFilter('currentlyPosted')}>Currently Posted Books</button>
        <button onClick={() => setSelectedFilter('past')}>Past Rentals</button>
        <button onClick={() => setSelectedFilter('pendingReview')}>Pending Review</button>
      </div>

      {selectedFilter === 'currentlyPosted' ? (
        <>
          <h2>Currently Posted</h2>
          <ul>
        {books.currentlyPosted.map(book => (
          <li key={book._id}>
            <img src={book.image} alt={book.title} />
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Rented for {book.days} days</p>
            <p>Price per day: ${book.price_per_day}</p>
            <button onClick={() => handleDeleteBook(book._id)}>Delete Post</button>
          </li>
        ))}
      </ul>
        </>
      ) : selectedFilter === 'past' ? (
        <>
          <h2>Past Rentals</h2>
          <ul>
        {books.pastRented.map(book => (
          <li key={book._id}>
            <img src={book.image} alt={book.title} />
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Rented for {book.days} days</p>
            <p>Price per day: ${book.price_per_day}</p>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
        </>
      ): (
        <>
          <h2>Pending Review</h2>
          <ul>
            {books.pendingReviews.map(book => (
              <li key={book._id}>
                <img src={book.image} alt={book.title} />
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Rented for {book.days} days</p>
                <p>Price per day: ${book.price_per_day}</p>
                <form onSubmit={(e) => handleReviewSubmit(e, book.owner_user_id,book._id)}>
                  <input type="number" name="rating" min="1" max="5" required placeholder="Rating (1-5)" />
                  <textarea name="review" required placeholder="Write a review about the owner"></textarea>
                  <button type="submit">Submit Review</button>
                </form>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default AllPostedBooks;
