import React, { useEffect, useState } from 'react';
import './secondarynavbar.css';
import CreateChannelForm from '../CreateChannelForm/CreateChannelForm'; // Ensure correct import path
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SecondaryNavbar = () => {
  const [channels, setChannels] = useState([]); // State to hold channels
  const [showCreateChannelForm, setShowCreateChannelForm] = useState(false); // State to toggle form visibility
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate(); // Hook for navigation

  // Function to check for existing channels
  const checkChannelExistence = async () => {
    const token = localStorage.getItem('token'); // Get token from local storage
    if (!token) {
      navigate('/signin'); // Redirect if no token exists
      return;
    }

    try {
      // Fetch channels for the current user
      const response = await axios.get('http://localhost:4001/api/auth/channels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { channels } = response.data;
      console.log(response);

      if (channels && channels.length > 0) {
        setChannels(channels); // Set channels in the state
      } else {
        setError('No channels found for this user.');
      }
    } catch (error) {
      console.error('Error checking channels:', error);
      setError('An error occurred while checking for channels.'); // Show error if request fails
    }
  };

  // Use Effect to check for channels on component mount
  useEffect(() => {
    checkChannelExistence(); // Call function on mount
  }, []);

  // Function to toggle the visibility of the Create Channel Form
  const toggleCreateChannelForm = () => {
    setShowCreateChannelForm(!showCreateChannelForm);
  };

  // Function to handle navigating to a channel
  const handleChannelClick = (channelId) => {
    navigate(`/dashboard/${channelId}`);
    removeBackdropShowClass(); // Remove backdrop display
  };

  // Function to remove the "show" class from all elements with the "offcanvas-backdrop" class
  const removeBackdropShowClass = () => {
    const backdrops = document.querySelectorAll('.offcanvas-backdrop');
    backdrops.forEach((backdrop) => {
      backdrop.style.display = 'none'; // Set display of each backdrop to none
    });
  };

  return (
    <>
      <nav className="navbar sticky-top bg-dark landing">
        <div className="container-fluid secnav">
          <button 
            className="btn btn-primary sidebar" 
            type="button" 
            data-bs-toggle="offcanvas" 
            data-bs-target="#offcanvasWithBothOptions" 
            aria-controls="offcanvasWithBothOptions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
          </button>

          <ul className="navbar-nav me-auto order-0">
            <li className="nav-item">
              Current Dashboard
            </li>
          </ul>
        </div>
      </nav>

      {/* Offcanvas Menu */}
      <div 
        className="offcanvas offcanvas-start" 
        data-bs-scroll="true" 
        tabIndex="-1" 
        id="offcanvasWithBothOptions" 
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Channels</h5>
          <button 
            type="button" 
            className="btn-close" 
            data-bs-dismiss="offcanvas" 
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {/* Display channels if available */}
          {channels.length > 0 ? (
            <div>
              {channels.map((channel) => (
                <button
                  key={channel._id} // Use the channel's unique _id as the key
                  className="btn btn-secondary w-100 mb-2"
                  onClick={() => handleChannelClick(channel._id)}
                >
                  <strong>{channel.name}</strong> <br />
                  {channel.description} <br />
                  Fields: {channel.fields.length}
                </button>
              ))}
            </div>
          ) : (
            <p>{error || 'No channels available'}</p>
          )}
          
          {/* Button to toggle the Create Channel Form */}
          <button className="btn btn-primary" onClick={toggleCreateChannelForm}>
            {showCreateChannelForm ? 'Hide Create Channel Form' : 'Create a New Channel'}
          </button>

          {/* Conditionally render the CreateChannelForm component */}
          {showCreateChannelForm && <CreateChannelForm />}
        </div>
      </div>
    </>
  );
};

export default SecondaryNavbar;
