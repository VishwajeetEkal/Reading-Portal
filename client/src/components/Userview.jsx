import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

function Userview() {

  const [user, setUser] = useState('');
  //gets user and calls server function to pull data  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/user', {
          headers: {
            'x-auth-token': token,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error.response.data);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  
    return (
    <div >
      <h1>User Profile</h1> 
      <p>Username: {user.username}</p>
      <p>First Name: {user.firstname}</p>
      <p>Last Name: {user.lastname}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default Userview;