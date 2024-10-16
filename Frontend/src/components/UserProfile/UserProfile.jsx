import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';  // Assuming you want to style it
import Navbar from '../Navbar/Navbar';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/signin'); // Redirect to signin if no token is found
        return;
      }

      try {
        const response = await axios.get('http://localhost:4001/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status === 'success') {
          setUser(response.data.user); // Set the user data in the state
        } else {
          setError('Failed to load user details');
        }
      } catch (error) {
        setError('An error occurred while fetching user details');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
        <Navbar />
        <div className="user-profile-container">
        <h1>User Profile</h1>
        {user ? (
            <>
            <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="profile-row">
                <div className="profile-item">
                    <h4>First Name</h4>
                    <p>{user.firstName}</p>
                </div>
                <div className="profile-item">
                    <h4>Last Name</h4>
                    <p>{user.lastName}</p>
                </div>
                </div>
            </div>

            <div className="profile-section">
                <h2>Contact Information</h2>
                <div className="profile-row">
                <div className="profile-item">
                    <h4>Email</h4>
                    <p>{user.email}</p>
                </div>
                <div className="profile-item">
                    <h4>Mobile Number</h4>
                    <p>{user.mobileNumber}</p>
                </div>
                </div>
            </div>

            {user.avatar && (
                <div className="profile-section">
                <h2>Avatar</h2>
                <img src={user.avatar} alt="User Avatar" className="user-avatar" />
                </div>
            )}
            </>
        ) : (
            <p>Loading user profile...</p>
        )}
        </div>
    </>
  );
};

export default UserProfile;
