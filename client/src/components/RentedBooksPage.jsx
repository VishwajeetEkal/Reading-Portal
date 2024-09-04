import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/RentedBooksPage.css'; 
import Header from './Header';
import Footer from './Footer';
import ChatModal from "./ChatModal";

function RentedBooksPage({ userId }) {
  const [rentedBooks, setRentedBooks] = useState({ current: [], past: [], pendingReview: [] });
  const [selectedFilter, setSelectedFilter] = useState('current');
  const [isModalOpen, setModalOpen] = useState(false);
  const [chatWith, setChatWith] = useState("");

  useEffect(() => {

          const token = localStorage.getItem('token');
          if (!token) {
            alert('No token found. Please log in.');
            return;
          }

         const fetchBooks = async () => {
            try {
              const response = await axios.get('http://localhost:8080/rentedbooks/getbooks',{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log(response.data)
              setRentedBooks(response.data)
            } catch (error) {
              console.error('Error fetching rented books:', error);
            }
          };
      
          fetchBooks();
        
  }, []);

  const handleReturnBook = async (rentedBookId) => {
    try {
      const response = await axios.put(`http://localhost:8080/rentedbooks/update-status/${rentedBookId}`, 
        { status: 'returned' }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      console.log(response.data)
      if (response.status === 200) {
        // Update the state to reflect the change
        setRentedBooks(prevState => ({
          ...prevState,
          current: prevState.current.filter(book => book._id !== rentedBookId),
          past: [...prevState.past, response.data], // Add the returned book to past rentals
          pendingReview: [...prevState.pendingReview, response.data] 
        }));
      }
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const handleReviewSubmit = async (e, ownerId,rentedBookId) => {
    e.preventDefault();
    const { rating, review } = e.target.elements;
    
    try {
      console.log(ownerId)
      const response = await axios.post(`http://localhost:8080/rentedbooks/review/${ownerId}`, { 
        rating: rating.value,
        comment: review.value,
        rentedBookId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.status === 200) {
        // Remove the reviewed book from pendingReview and update state
        setRentedBooks(prevState => ({
          ...prevState,
          pendingReview: prevState.pendingReview.filter(book => book._id !== rentedBookId)
        }));
      }
      console.log(rentedBooks);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };  

  return (
    <>
    <div>
      <Header/>
    <div className="rented-books">
      <h1>My Rented Books</h1>
      <div className="filter-buttons">
        <button onClick={() => setSelectedFilter('current')}>Current Rentals</button>
        <button onClick={() => setSelectedFilter('past')}>Past Rentals</button>
        <button onClick={() => setSelectedFilter('pendingReview')}>Pending Review</button>
      </div>

      {selectedFilter === 'current' ? (
        <>
          <h2>Current Rentals</h2>
          <ul>
        {rentedBooks.current.map(book => (
          <li key={book._id}>
            {console.log(book)}
            <img src={book.image} alt={book.title} />
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Rented for {book.days} days</p>
            <p>Price per day: ${book.price_per_day}</p>
            <button onClick={() => handleReturnBook(book._id)}>Return</button>
            <button
              onClick={() => {
                setModalOpen(true);
                setChatWith(book.owner_user_id)
              }}
              style={{
                backgroundColor: '#a3c8e3',
                color: 'black'
              }}
            >
              Chat with the Owner
            </button>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
        </>
      ) : selectedFilter === 'past' ? (
        <>
          <h2>Past Rentals</h2>
          <ul>
        {rentedBooks.past.map(book => (
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
            {rentedBooks.pendingReview.map(book => (
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
    <Footer/>
    </div>
    <ChatModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        withId={chatWith}
        withType="owner"
        title="Owner"
      />
    </>
  );
}

export default RentedBooksPage;
