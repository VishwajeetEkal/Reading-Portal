// CartProvider.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
    // Load cart items from the database when the provider mounts
    const loadCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/cartview/cart-items',{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Could not load cart items", error);
      }
    };

    loadCartItems();
  }, []);

  const addToCart = async (book) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
    try {
      // Send the book to the backend to be added to the cart
      const response = await axios.post('http://localhost:8080/cartview/add-to-cart', book,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // If the book was added successfully, update the state
      setCartItems((currentItems) => {
        const isBookInCart = currentItems.some((item) => item._id === book._id);
        if (!isBookInCart) {
          return [...currentItems, book];
        } else {
          return currentItems; // or handle duplicate case
        }
      });
      console.log(response.data)
      alert(response.data.message);
    } catch (error) {
      console.error("Could not add item to cart", error);
    }
  };

  // ... other context methods ...

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
