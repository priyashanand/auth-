import React from 'react';
import './AuthorizedNav.css';
import { Link } from 'react-router-dom';


import Images from '../../assets';

const AuthNavbar = () => {
  return (
    <>
      <div className='navbar'>
        <div className='logo'>
          <img 
            src={Images.logo}
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
