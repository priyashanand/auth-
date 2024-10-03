import React, {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertModal from '../Alert/Alert';

const LandingPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const checkChannelExistence = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin'); // Redirect if no token exists
            return;
        }

        try {
            const response = await axios.get('http://localhost:4001/api/channels', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.length > 0) {
                // If channels exist, redirect to dashboard
                navigate(`/dashboard/${response.data[0]._id}`);
            } else {
                setError('No channels found. Please create a channel.');
            }
        } catch (error) {
            console.error('Error checking channels:', error);
            setError('An error occurred while checking for channels.');
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
