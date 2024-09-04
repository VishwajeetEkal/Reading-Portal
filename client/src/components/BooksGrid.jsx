import React, { useContext } from 'react';
import BookCard from './BookCard';
import '../styles/BooksGrid.css';
import { CartContext } from './CartContext'; // Assuming you have a CartContext

function BooksGrid({ books }) {
  const { addToCart } = useContext(CartContext); // Use addToCart from your context

  const handleAddToCart = (book) => {
    addToCart(book);
  };

  return (
    <div className="books-grid">
      {books.map((book) => (
        <BookCard key={book._id} book={book} onAddToCart={handleAddToCart} />
      ))}
    </div>
  );
}

export default BooksGrid;
