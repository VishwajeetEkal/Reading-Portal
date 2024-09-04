import React, { useState, useEffect } from "react";
import axios from "axios";
import OwnerHeader from "./OwnerHeader";
import Footer from "./Footer";
import "../styles/UserProfile.css";

function OwnerProfilePage({ userId }) {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    quote: "",
    // Add other fields as needed
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/profile/getdetails`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => console.error("Error fetching user data", error));
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/profile/updatedetails`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        console.log("Profile updated", response.data);
        setIsEditMode(false); // Exit edit mode after update
      })
      .catch((error) => console.error("Error updating profile", error));
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <OwnerHeader />
      <card className="profile-card">
        <h1>User Profile</h1>
        {isEditMode ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <h4>First Name</h4>
            <input
              name="firstname"
              value={userData.firstname}
              onChange={handleChange}
            />
            <h4>Last Name</h4>
            <input
              name="lastname"
              value={userData.lastname}
              onChange={handleChange}
            />
            {/* Add other editable fields here */}
            <button type="submit">Save Changes</button>
            <button onClick={() => setIsEditMode(false)}>Cancel</button>
          </form>
        ) : (
          <div>
            <div className="profile-details">
              <div
              >
                <h4>First Name</h4>
                <p   style={{
                  marginBottom: "20px",
                }}>{userData.firstname}</p>
                <h4>Last Name</h4>
                <p>{userData.lastname}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p   style={{
                  marginBottom: "20px",
                }}>{userData.email}</p>
                <h4>Username</h4>
                <p>{userData.username}</p>
              </div>
            </div>
            <button className="edit-profile-button" onClick={handleEdit}>Edit Profile</button>
          </div>
        )}
      </card>

      <Footer />
    </div>
  );
}

export default OwnerProfilePage;
