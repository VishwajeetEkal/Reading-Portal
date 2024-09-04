
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BooksGrid from './BooksGrid';
import '../styles/BrowseBooks.css';
import Header from './Header';
import Footer from './Footer';
import { CartProvider } from './CartContext';


function BrowseBooksPage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [minCost, setMinCost] = useState(0);
const [maxCost, setMaxCost] = useState(Infinity);
const [selectedGenres, setSelectedGenres] = useState('');
const [publishedYear, setPublishedYear] = useState(null);


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/userview/browsebooks');
        setBooks(response.data);
        setFilteredBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const results = books.filter(book => {
      // Check if the book matches the search term.
      const matchesSearchTerm = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                book.genre.toLowerCase().includes(searchTerm.toLowerCase());

      // Check if the book matches the cost filters.
      const matchesCost = book.price_per_day >= minCost && (maxCost === Infinity || book.price_per_day <= maxCost);

      // Check if the book matches the genre filter, if a genre is selected.
      const matchesGenre = selectedGenres ? book.genre === selectedGenres : true;

      // Check if the book matches the publication year filter, if a year is set.
      const matchesPublishedYear = publishedYear ? (book.publication_year >= publishedYear) : true;

      return matchesSearchTerm && matchesCost && matchesGenre && matchesPublishedYear;
    });

    setFilteredBooks(results);
  }, [searchTerm, books, minCost, maxCost, selectedGenres, publishedYear]);
  
return (
  <CartProvider>
  <div>
<Header />
  <div className="browse-books-page">
    <aside className="filters-section">
      <div className="filter-container">
        <div className="filter">
          <label className="filter-label">Min Cost:</label>
          <input
            type="number"
            className="filter-input"
            value={minCost}
            onChange={(e) => setMinCost(e.target.value)}
          />
        </div>
        <div className="filter">
          <label className="filter-label">Max Cost:</label>
          <input
            type="number"
            className="filter-input"
            value={maxCost}
            onChange={(e) => setMaxCost(e.target.value)}
          />
        </div>
        <div className="filter">
          <label className="filter-label">Genre:</label>
          <select
            className="filter-select"
            onChange={(e) => setSelectedGenres(e.target.value)}
          >
            <option value="">Select Genre</option>
            <option value="romance">romance</option>
        <option value="thriller">thriller</option>
        <option value="drama">drama</option>
        <option value="fiction">fiction</option>
          </select>
        </div>
        <div className="filter">
          <label className="filter-label">Publication Year:</label>
          <input
            type="number"
            className="filter-input"
            onChange={(e) => setPublishedYear(e.target.value)}
          />
        </div>
      </div>
    </aside>
    <main className="books-section">
      <h1 className="books-header">Posted Books</h1>
      <input
        type="text"
        placeholder="Search for books..."
        className="searchbar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <BooksGrid books={filteredBooks} />
    </main>
  </div>
  <Footer />
   </div>
   </CartProvider>
);
}


export default BrowseBooksPage;

