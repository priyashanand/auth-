import React from 'react';
import './AuthorizedNav.css';
import { Link } from 'react-router-dom';

const AuthNavbar = () => {
  return (
    <>
      <div className='navbar'>
        <div className='logo'>
          <img 
            src='../Navbar/xtrans_logo.webp'
            alt='XTrans Logo' 
          />
          <span className='company'>Xtrans Solutions</span>
        </div>
        <div className='items'>
          <Link to="/dashboard" className='nav-link'>Home</Link>
          <Link to="/documentation" className='nav-link'>Documentation</Link>
          <Link to="/support" className='nav-link'>Support</Link>
        </div>
      </div>
    </>
  );
};

export default AuthNavbar;
