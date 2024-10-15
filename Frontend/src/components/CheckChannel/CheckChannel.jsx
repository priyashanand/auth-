import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertModal from '../Alert/Alert';

const CheckChannel = () => {
    const [channelExists, setChannelExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkChannel = async () => {
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
                    setChannelExists(true);
                } else {
                    setChannelExists(false);
                }
            } catch (error) {
                setError('Error checking channel');
            } finally {
                setLoading(false);
            }
        };

        checkChannel();
    }, [navigate]);

    useEffect(() => {
        if (!loading) {
            if (error) {
                return;
            }

            if (channelExists) {
                navigate('/dashboard'); // Redirect to dashboard if channel exists
            } else {
                navigate('/create-channel'); // Redirect to create channel page if not
            }
        }
    }, [loading, error, channelExists, navigate]);

    return (
        <>
            {loading && <div>Loading...</div>}
            {error && <AlertModal message={error} onClose={() => setError(null)} />}
        </>
    );
};

export default CheckChannel;
