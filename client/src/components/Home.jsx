import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      try {
        const response = await axios.get('https://ubook.onrender.com/home', {
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
    <div>
      <h1>Welcome, {user.email}!</h1>
      {/* Display other user data here */}
            <p><a href = "/Userview">Profile Page</a></p>

    </div>
  );
}

export default Home;

