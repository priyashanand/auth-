import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../Alert/Alert';
import './LandingPage.css';
import Navbar from '../Navbar/Navbar';
import SecondaryNavbar from '../SecondaryNavbar/SecondaryNavbar';
import axios from 'axios';

const LandingPage = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);

  // Fetch channels on component mount
  useEffect(() => {
    const fetchChannels = async () => {
      const token = localStorage.getItem('token'); // Get token from local storage
      if (!token) {
        navigate('/signin'); // Redirect if no token exists
        return;
      }
      try {
        const response = await axios.get('http://localhost:4001/api/auth/channels', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChannels(response.data.channels); // Assuming the response contains a 'channels' array
      } catch (error) {
        console.error('Error fetching channels:', error);
        setError('An error occurred while fetching channels.');
      }
    };
    fetchChannels();
  }, [navigate]);

  // Handle channel redirection and backdrop removal
  const handleChannelClick = (channelId) => {
    navigate(`/dashboard/${channelId}`); // Correctly redirect to the channel dashboard
    removeBackdropShowClass(); // Remove backdrop display after redirection
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
      <Navbar />
      <SecondaryNavbar />

      <div className="landing-page-container">
        <h2>Welcome to Xtrans IoT Cloud</h2>
        <div className="row">
          {channels.length > 0 ? (
            channels.map((channel) => (
              <div key={channel._id} className="col-md-4 mb-4">
                <div className="card" style={{ width: '18rem' }}>
                  <div className="card-body">
                    <h5 className="card-title">{channel.name}</h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">{channel.description}</h6>
                    <p className="card-text">
                      <small className="text-muted">{channel.fields.length} Fields</small>
                    </p>
                    <a 
                      href={`/dashboard/${channel._id}`} 
                      className="card-link"
                      onClick={(e) => {
                        e.preventDefault(); 
                        handleChannelClick(channel._id);
                      }}
                    >
                      Go to Channel
                    </a>
                    <a 
                      href={`/edit/${channel._id}`} 
                      className="card-link"
                      onClick={(e) => {
                        e.preventDefault(); 
                        navigate(`/edit/${channel._id}`);
                      }}
                    >
                      Edit Channel
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No channels found. Create one to get started!</p>
          )}
        </div>
        {error && <AlertModal message={error} onClose={() => setError(null)} />}
      </div>
    </>
  );
};

export default LandingPage;
