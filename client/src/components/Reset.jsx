

import React, { useState } from 'react';
import axios from 'axios';
import {useSearchParams } from 'react-router-dom';
import '../styles/Reset.css';
import { useNavigate } from "react-router-dom";


function Reset() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const x = searchParams.get("token")
  const doReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/reset/${x}`, {
        password,
        confirmpassword
      });
      console.log(response.data);
      navigate("/login")
    } catch (error) {
      console.error('Error with new password', error.response.data);
    }
  };

  return (
    <div className="reset-container">
      <form onSubmit={doReset} className="reset-form">
        <div className="input-group">
          <label className="label">Make New Password:</label>
          <input
            type="password"
            value={password}
            placeholder="new password"
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            value={confirmpassword}
            placeholder="confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" className="button">Change Password</button>
      </form>
    </div>
  );
}

export default Reset;