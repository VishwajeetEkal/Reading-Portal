import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/PaymentPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const total = location.state?.total;

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [billingStreet, setBillingStreet] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [billingCountry, setBillingCountry] = useState('');

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // Card number validation: must be 16 digits
    if (!cardNumber.match(/^\d{16}$/)) {
      isValid = false;
      errors.cardNumber = "Card number must be 16 digits.";
    }

    // CVV validation: must be 3 digits
    if (!cvv.match(/^\d{3}$/)) {
      isValid = false;
      errors.cvv = "CVV must be 3 digits.";
    }


    // card holder name validation
    if (!cardName.trim()) {
        isValid = false;
        errors.cardName = "Cardholder name cannot be blank.";
      }

    // ExpiryDate Validation
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    const match = expiryDate.match(expiryDateRegex);
    if (match) {
        const currentYear = new Date().getFullYear() % 100; // Get last two digits of the year
        const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed
        const month = parseInt(match[1], 10); // First capturing group: Month
        const year = parseInt(match[2], 10); // Second capturing group: Year

      //console.log(month)
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        isValid = false;
        errors.expiryDate = "Expiry date cannot be in the past.";
      }
    } else {
      isValid = false;
      errors.expiryDate = "Enter a valid expiry date (MM/YY).";
    }

    if (!billingStreet.trim()) {
        isValid = false;
        errors.billingStreet = "Billing street cannot be blank.";
      }

      if (!billingCity.trim()) {
        isValid = false;
        errors.billingCity = "Billing City cannot be blank.";
      }

      if (!billingState.trim()) {
        isValid = false;
        errors.billingState = "Billing State cannot be blank.";
      }

      if (!billingZip.trim()) {
        isValid = false;
        errors.billingZip = "Billing Zip cannot be blank.";
      }

      if (!billingCountry.trim()) {
        isValid = false;
        errors.billingCountry = "Billing Country cannot be blank.";
      }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
    
        try {
          // , store order details
          const orderDetails = {
            amount: total,
            cardDetails: {
              cardType: 'Visa', // Replace with actual card type
              lastFourDigits: cardNumber.slice(-4), // Never store the full card number
              expiryDate: expiryDate
            },
          };
          const token = localStorage.getItem('token');
            if (!token) {
             alert('No token found. Please log in.');
            return;
            }
          const response = await axios.post('http://localhost:8080/cartview/create-order', orderDetails, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (response.status === 201) {
            const cartItems = response.data.orderdata.cartItems;
            const total = response.data.orderdata.amount;
            console.log(response.data);
            //console.log(total)
            alert("Payment is successful, your order is awaiting approval.");
            navigate('/order-confirmation', { state: {cartItems,total } });
          }
        } catch (error) {
          console.error("An error occurred during payment submission:", error);
          alert("An error occurred during payment submission.");
        }
      } else {
        console.log("Form is invalid. Please correct the errors.");
      }
    };

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      <p>Total Amount: ${total}</p>

      <form className="payment-form" onSubmit={handleSubmit}>
        <label htmlFor="cardNumber">Card Number:</label>
        <input type="text" id="cardNumber" name="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 1234 1234 1234" required />
        {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}

        <label htmlFor="cardName">Cardholder Name:</label>
        <input type="text" id="cardName" name="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe" required />
        {errors.cardName && <p className="error-message">{errors.cardName}</p>}

        <label htmlFor="expiryDate">Expiry Date:</label>
        <input type="text" id="expiryDate" name="expiryDate" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="MM/YY" required />
        {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}


        <label htmlFor="cvv">CVV:</label>
        <input type="text" id="cvv" name="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" required />
        {errors.cvv && <p className="error-message">{errors.cvv}</p>}
         
        <h2>Billing Address</h2>

        <label htmlFor="billingStreet">Street Address:</label>
        <input type="text" id="billingStreet" name="billingStreet" value={billingStreet} onChange={(e) => setBillingStreet(e.target.value)} placeholder="1234 Main St" required />
        {errors.billingStreet && <p className="error-message">{errors.billingStreet}</p>}

        <label htmlFor="billingCIty">City:</label>
        <input type="text" id="billingCity" name="billingCity" value={billingCity} onChange={(e) => setBillingCity(e.target.value)} placeholder="Bloomington" required />
        {errors.billingCity && <p className="error-message">{errors.billingCity}</p>}

        <label htmlFor="billingState">State:</label>
        <input type="text" id="billingState" name="billingState" value={billingState} onChange={(e) => setBillingState(e.target.value)} placeholder="Indiana" required />
        {errors.billingState && <p className="error-message">{errors.billingState}</p>}

        <label htmlFor="billingZip">Zip:</label>
        <input type="text" id="billingZip" name="billingZip" value={billingZip} onChange={(e) => setBillingZip(e.target.value)} placeholder="47402" required />
        {errors.billingZip && <p className="error-message">{errors.billingZip}</p>}

        <label htmlFor="billingCountry">Country:</label>
        <input type="text" id="billingCountry" name="billingCountry" value={billingCountry} onChange={(e) => setBillingCountry(e.target.value)} placeholder="United States" required />
        {errors.billingCountry && <p className="error-message">{errors.billingCountry}</p>}

        <button type="submit" className="submit-button">Pay ${total}</button>
      </form>
    </div>
  );
}

export default PaymentPage;

// test for pushing