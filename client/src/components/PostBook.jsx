import React, { useState, useRef } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import '../styles/PostBook.css';
import OwnerHeader from './OwnerHeader';
import Footer from './Footer';
//import { useRef } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 39.168804,
  lng: -86.536659,
};

function PostBook() {
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    genre: '',
    ISBN: '',
    publication_year: '',
    condition: '',
    price_per_day: '',
    image: null,
    address: '',
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    description: '',
  });
  const imageRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };


  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    console.log(lat, lng)
    setBookData((prevData) => ({
      ...prevData,
      location: { lat, lng }
    }));
  }

  const handleFileChange = (e) => {
    setBookData({ ...bookData, image: e.target.files[0] });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    const formData = new FormData();
  Object.keys(bookData).forEach(key => {
    if (key !== 'image' && key!=='location') { // Exclude image key
      formData.append(key, bookData[key]);
    }
  });

  formData.append('location', JSON.stringify(bookData.location));

  if (imageRef.current.files[0]) {
    formData.append('image', imageRef.current.files[0]);
  }

    try {
      const response = await axios.post('http://localhost:8080/userview/postbook', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      alert('Book posted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error posting book:', error.response.data);
      alert('Error posting book');
    }
  };

  return (
    <div>
     <OwnerHeader />
    <div className="post-book-container">
    <form onSubmit={handleSubmit} className="post-book-form" enctype="multipart/form-data">
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" value={bookData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input type="text" name="author" value={bookData.author} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Genre:</label>
          <input type="text" name="genre" value={bookData.genre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>ISBN:</label>
          <input type="text" name="ISBN" value={bookData.ISBN} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Publication Year:</label>
          <input type="number" name="publication_year" value={bookData.publication_year} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Condition:</label>
          <input type="text" name="condition" value={bookData.condition} onChange={handleChange}  />
        </div>
        <div className="form-group">
          <label>Price Per Day:</label>
          <input type="number" name="price_per_day" value={bookData.price_per_day} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={bookData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
        <label>Image:</label>
        <input type="file" ref={imageRef} name="image" onChange={handleFileChange} />
      </div>
      <div className="form-group">
        <label>Address:</label>
        <input type="text" name="address" value={bookData.address} onChange={handleChange} required />
      </div>
        <div className="form-group">
          <label>Location:</label>
          <LoadScript googleMapsApiKey='AIzaSyAuhAVZf10KG1trTGAtF25hLt7aYkLIAfs'>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={13}
              onClick={onMapClick}
            >
              <Marker key={`${bookData.location.lat}-${bookData.location.lng}`} position={bookData.location} />

            </GoogleMap>
          </LoadScript>
        </div>

        <button type="submit" className="submit-button">Post Book</button>
      </form>
    </div>
    <Footer/>
    </div>
  );
}

export default PostBook;