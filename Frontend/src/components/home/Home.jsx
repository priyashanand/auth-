import React from 'react';
import './Home.css'; // Import the extracted CSS
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="Home">
        <main className="Home-main">
          <h1>Empower Your IoT Projects with XTrans</h1>
          <p>
            Seamlessly integrate AI, ML, and Blockchain technologies with our
            powerful IoT platform.
          </p>
          <div className="buttons">
            {/* Use Link for navigation */}
            <Link to="/signup" className="btn-primary">
              Get Started
            </Link>
            <button className="btn-secondary">Contact Sales</button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
