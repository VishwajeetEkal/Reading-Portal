import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/OrderConfirmationPage.css'; 
import { Link } from 'react-router-dom';

function OrderConfirmationPage() {
  const location = useLocation();
  const { cartItems, total } = location.state;
  console.log(location.state)

  return (
    <div className="order-confirmation-container">
      <h1>Order Confirmation</h1>
      <div className="order-summary">
        <h2>Thank you for your order!</h2>
        <p>Your payment has been received and your order is now being processed.</p>
        <p>A confirmation has been sent to your email.</p>
        
        <h3>Order Summary:</h3>
        <ul className="order-items-list">
          {cartItems.map(item => (
            <li key={item._id} className="order-item">
              <span>{item.title}</span>
              <span>{item.days} days @ ${item.price_per_day}/day</span>
              <span>${(item.days * item.price_per_day).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        
        <p className="order-total">Total: ${total}</p>
      </div>
      <li><Link to="/dashboard">continue shopping</Link></li>
    </div>
  );
}

export default OrderConfirmationPage;
