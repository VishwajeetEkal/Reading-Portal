import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="contact-info">Contact Information</div>
      <div className="social-media-links">
        {/* Add your social media links here */}
        <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
      <div className="privacy-policy-terms">
        <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <a href="#" target="_blank" rel="noopener noreferrer">Terms of Service</a>
      </div>
    </footer>
  );
}

export default Footer;
