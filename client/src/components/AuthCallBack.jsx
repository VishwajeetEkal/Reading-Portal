import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      // Save token in local storage
      localStorage.setItem('token', token);

      // Navigate to home page
      navigate('/home');
    } else {
      // Handle error case
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div>Loading...</div>
  );
}

export default AuthCallback;
