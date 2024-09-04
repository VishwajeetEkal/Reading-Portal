import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import Header from './Header';
import Footer from './Footer';

function Dashboard() {
  const navigate = useNavigate();
  const [postedBooks, setPostedBooks] = useState([]);
  const [rentedBooks, setRentedBooks] = useState([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    // Fetch posted books, rented books, and earnings data from the server
    // and update the corresponding state variables.
  }, []);

  const handlePostNewBook = () => {
    navigate('/PostBook');
  };

  return (
    <div>
      <Header />
      <div className="dashboard-container">
        <div className="summary-section">
          <h2>Summary</h2>
          {/* <p>Posted Books: {postedBooks.length}</p> */}
          <p>Rented Books: {rentedBooks.length}</p>
        </div>
        {/* <div className="post-new-book-button">
          <button onClick={handlePostNewBook}>Post New Book</button>
        </div> */}
        <div className="rented-books-list">
          <h2>Rented Books</h2>
          <ul>
            {rentedBooks.map((book) => (
              <li key={book.id} className="rented-book-item">
                <p>Title: {book.title}</p>
                <p>Renter's Details: {book.renterDetails}</p>
                <p>Lender's Details: {book.lenderDetails}</p>
              </li>
            ))}
          </ul>
        </div>
        {/* <div className="earnings-section">
          <h2>Earnings</h2>
          <p>Total Earnings: ${earnings}</p>
        </div> */}
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;