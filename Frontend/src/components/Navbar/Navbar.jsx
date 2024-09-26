import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';


import Images from '../../assets';

const Navbar = () => {

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
          <Link to="/" className='nav-link'>Home</Link>
          <Link to="/documentation" className='nav-link'>Documentation</Link>
          <Link to="/support" className='nav-link'>Support</Link>
          <Link to="/signin" className='nav-link'>Sign In</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
