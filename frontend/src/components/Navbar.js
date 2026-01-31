import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, THEME_COLOR } from '../constants.js';

const Navbar = () => {
  return (
    <nav style={navContainer}>
      {/* Brand Name - Clicking this takes you Home */}
      <Link to="/" style={logoStyle}>
        {APP_NAME}
      </Link>

      <div style={navLinks}>
        <Link to="/" style={linkItem}>Browse</Link>
        
        {/* The "Sell" button is our Primary Action */}
        <Link to="/sell" style={sellButton}>
          + Sell Item
        </Link>
      </div>
    </nav>
  );
};

// --- Styles (Keeping it breathing and spacious) ---

const navContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 8%',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #f0f0f0',
  position: 'sticky',
  top: 0,
  zIndex: 1000
};

const logoStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: THEME_COLOR,
  textDecoration: 'none',
  letterSpacing: '-0.5px'
};

const navLinks = {
  display: 'flex',
  alignItems: 'center',
  gap: '30px'
};

const linkItem = {
  textDecoration: 'none',
  color: '#333',
  fontWeight: '500',
  fontSize: '1rem'
};

const sellButton = {
  textDecoration: 'none',
  backgroundColor: THEME_COLOR,
  color: '#fff',
  padding: '10px 22px',
  borderRadius: '25px', // Rounded "Pill" shape common in modern apps
  fontWeight: '600',
  boxShadow: '0 4px 10px rgba(255, 77, 77, 0.2)',
  transition: 'transform 0.2s'
};

export default Navbar;