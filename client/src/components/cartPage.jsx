// CartPage.js
import React, {  useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/cartPage.css';
import Header from './Header';
import Footer from './Footer';

function CartPage() {
  const navigate = useNavigate();
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
  // remove item from cart
  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/cartview/remove-cart-item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(currentItems => currentItems.filter(item => item._id !== itemId));
    } catch (error) {
      console.error("Could not remove cart item", error);
    }
  };
  
  // to increase or decrease number of days
  const handleIncreaseDays = async (item) => {
    const updatedItem = { ...item, days: item.days + 1 };
    await updateItemInCart(updatedItem);
  };
  
  const handleDecreaseDays = async (item) => {
    const updatedItem = { ...item, days: Math.max(1, item.days - 1) };
    await updateItemInCart(updatedItem);
  };
  // function to update backend
  const updateItemInCart = async (updatedItem) => {
    const token = localStorage.getItem('token');
    try {
      //console.log(updatedItem)
      await axios.put(`http://localhost:8080/cartview/update-cart-item`, updatedItem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(currentItems =>
        currentItems.map(item => (item._id === updatedItem._id ? updatedItem : item))
      );
    } catch (error) {
      console.error("Could not update cart item", error);
    }
  };
  
  // Function to calculate the total price of the cart
  const calculateTotal = (items) => {
      return items.reduce((acc, item) => acc + item.price_per_day * item.days, 0).toFixed(2);
  };

  const handleCheckOut = (cartItems) =>{
    const total = cartItems.reduce((acc, item) => acc + item.price_per_day * item.days, 0).toFixed(2);
    console.log(total)
    navigate('/payment', { state: { total } });
  }

  return (
    <div>
    <Header/>
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <h3>{item.title}</h3>
              <p>Price per Day: ${item.price_per_day}</p>
              <div className="cart-item-controls">
                <button onClick={() => handleDecreaseDays(item)}>-</button>
                <span> Days: {item.days} </span>
                <button onClick={() => handleIncreaseDays(item)}>+</button>
              </div>
              <button className="cart-item-remove" onClick={() => handleRemoveItem(item._id)}>Remove</button>
            </div>
          ))}
          <div className="cart-total">
            <h4>Total: ${calculateTotal(cartItems)}</h4>
          </div>
        </div>
      )}
    </div>
    <div className="checkout-button-container">
      <button className="checkout-button" onClick={() => handleCheckOut(cartItems)}>
        Proceed to Checkout
      </button>
    </div>
    <Footer/>
    </div>
  );
}


export default CartPage;
