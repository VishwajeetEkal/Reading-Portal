import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', {
        emailOrUsername,
        password,
      });

      console.log(response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        if (response.data.role === 'admin') {
          navigate('/adminDashboard');
        } else if (response.data.role === 'user') {
          navigate('/Dashboard');
        } else {
          navigate('/OwnerDashboard');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error.response.data);
    }
  };

  return (
    <Box className="login-container">
      <Box marginBottom={2}>
        {/* Logo */}
        <Typography variant="h6">
          <img src={require("../images/ubook.png")} alt="Logo" width="250" height="50" />
        </Typography>
      </Box>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <Typography variant="body1" className="input-label">
            Email or Username:
          </Typography>
          <TextField
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <Typography variant="body1" className="input-label">
            Password:
          </Typography>
          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <Button type="submit" variant="contained" className="submit-button">
          Login
        </Button>
      </form>
      <Box className="signup-link">
        <Typography variant="body1">
          Don't have an account? <a href="/signup">Sign up</a>
        </Typography>
      </Box>
      <Box className="social-login">
        <Typography variant="body1">
          <a href="http://localhost:8080/auth/google" className="google-login">
            Login with Google
          </a>
        </Typography>
      </Box>
      <Box className="forgot-password">
        <Typography variant="body1">
          <a href="/forgot">Forgot password?</a>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;
