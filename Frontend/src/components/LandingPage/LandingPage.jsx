import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../Alert/Alert';

const LandingPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const checkChannelExistence = () => {
        const channelExists = localStorage.getItem('channelId'); // Simulating channel existence check

        if (channelExists) {
            // If a channel exists, redirect to dashboard
            navigate(`/dashboard/${channelExists}`);
        } else {
            setError('No channels found. Please create a channel.');
        }
    };

    return (
        <div>
            <h2>Welcome to the Landing Page</h2>
            <button onClick={checkChannelExistence}>Go to Dashboard</button>
            <button onClick={() => navigate('/create-channel')}>Create Channel</button>
            {error && <AlertModal message={error} onClose={() => setError(null)} />}
        </div>
    );
};

export default LandingPage;
