import React, { useState } from 'react';
import axios from 'axios';


function Forgot() {

  const [email, setEmail] = useState('');
  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/Forgot', {
        email
      });
      console.log(response.data);
    } catch (error) {
      console.error('Not a valid email or username:', error);
    }
  };

  return (
    <div >
      <form onSubmit={sendEmail}>
        <div>
          <label>Password Recovery:</label>
          <input type="email" placeholder = "Please type your email here"  onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit">Send Email</button>
      </form>
      
    </div>
  );
}

export default Forgot;
