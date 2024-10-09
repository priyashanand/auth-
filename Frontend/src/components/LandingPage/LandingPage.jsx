import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../Alert/Alert';
import './LandingPage.css';
import Navbar from '../Navbar/Navbar';
import { FaBars } from 'react-icons/fa';

const LandingPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const checkChannelExistence = async () => {
        const token = localStorage.getItem('token'); // Get token from local storage
        if (!token) {
            navigate('/signin'); // Redirect if no token exists
            return;
        }
        try {
            // const user = await Channel.findOne({email});
        } catch (error) {
            console.error('Error checking channels');
            setError('An error occurred while checking for channels.'); // Show error if request fails
        }
    };

    return (
        <>
            <Navbar />
            {/* Offcanvas toggle button in the top-left corner */}
            

            {/* Offcanvas Sidebar */}
            <div 
                
                className="offcanvas offcanvas-start" 
                data-bs-scroll="true" 
                tabIndex="-1" 
                id="offcanvasWithBothOptions" 
                aria-labelledby="offcanvasWithBothOptionsLabel"
            >
                <div className="sidebar-button-container">
                    <button 
                        className="btn btn-primary sidebar-toggle-button" 
                        type="button" 
                        data-bs-toggle="offcanvas" 
                        data-bs-target="#offcanvasWithBothOptions" 
                        aria-controls="offcanvasWithBothOptions"
                    >
                        < FaBars size={24} />
                    </button>
                </div>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Menu</h5>
                    <button 
                        type="button" 
                        className="btn-close" 
                        data-bs-dismiss="offcanvas" 
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <p>Try scrolling the rest of the page to see this option in action.</p>
                </div>
            </div>

            <div className="landing-page-container">
                <h2>Welcome to Xtrans IoT Cloud</h2>
                <button className="button-dashboard" onClick={checkChannelExistence}>Go to Dashboard</button>
                <button className="button-create" onClick={() => navigate('/create-channel')}>Create Channel</button>
                {error && <AlertModal message={error} onClose={() => setError(null)} />}
            </div>
        </>
    );
};

export default LandingPage;
