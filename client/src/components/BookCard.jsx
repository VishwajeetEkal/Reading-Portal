
import React, { useState } from 'react';
import '../styles/BookCard.css';


function BookCard({ book, onAddToCart }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(book);
  };

  
  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Prevent the background from scrolling
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Allow the background to scroll again
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="book-card">
      <div className="book-image-container">
      <img src={`http://localhost:8080/${book.image}`} alt="Book Cover" className="book-image" onClick={handleOpenModal} />
      </div>
      <div className="book-details">
        <p className="book-date">{new Date(book.postedAT).toLocaleDateString()}</p>
        <p className="book-price">${book.price_per_day}</p>
        <h3 className="book-title">{book.title}</h3>
      </div>
      
      {isModalOpen && (
        <div className="book-modal" onClick={handleCloseModal}>
          <div className="book-modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Year: {book.publication_year}</p>
            <p>Condition: {book.condition}</p>
            <p>Price per Day: ${book.price_per_day}</p>
            <p>Address: {book.address}</p>
            <p>Description: {book.description}</p>
            <button className="view-button">View Location</button>
            <div className="add-container">
            <button className="add-button" onClick={handleAddToCart}>Add to cart</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookCard;
