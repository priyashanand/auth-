import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertModal from '../Alert/Alert';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const checkChannelExistence = async () => {
        const token = localStorage.getItem('token'); // Get token from local storage
        if (!token) {
            navigate('/signin'); // Redirect if no token exists
            return;
        }
        const userId = localStorage.getItem('userId');

        try {
            // const user = await Channel.findOne({email});
        } catch (error) {
            console.error('Error checking channels');
            setError('An error occurred while checking for channels.'); // Show error if request fails
        }
    };

    return (
        <div className="landing-page-container">
            <h2>Welcome to Xtrans IoT Cloud</h2>
            <button className="button-dashboard" onClick={checkChannelExistence}>Go to Dashboard</button>
            <button className="button-create" onClick={() => navigate('/create-channel')}>Create Channel</button>
            {error && <AlertModal message={error} onClose={() => setError(null)} />}
        </div>
    );
};

export default LandingPage;
