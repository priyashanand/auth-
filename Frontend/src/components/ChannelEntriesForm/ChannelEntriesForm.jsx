import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ChannelEntriesForm() {
  const { channelId } = useParams(); // Get channelId from route params
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if channelId is undefined
    if (!channelId) {
      setResponseMessage('Channel ID is required.');
      return;
    }
    
    // Fetch channel details including field schema to populate form
    const fetchChannelDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiKey = localStorage.getItem('x-api-key');
        if (!token) {
          setResponseMessage('Authorization token is missing');
          return;
        }

        const response = await axios.get(`http://localhost:4001/api/auth/channels`, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'x-api-key': `Bearer ${apiKey}`,
          },
      });
        console.log(response);
        setFields(response.data.fields);
      } catch (error) {
        setResponseMessage('Failed to fetch channel details: ' + (error.response ? error.response.data.message : error.message));
      }
    };
    fetchChannelDetails();
  }, [channelId]);

  console.log(channelId); // Debugging log

  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // const token = localStorage.getItem('token');
      const apiKey = localStorage.getItem('x-api-key'); // No need to prefix 'Bearer' here
  
      const response = await axios.post(`http://localhost:4001/api/auth/channels/${channelId}/entries`, { 
        fieldData: formData,
      }, {
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'x-api-key': apiKey,
      },
      });

      console.log(apiKey);
  
      setResponseMessage(response.data.message);
      navigate(`/dashboard/${channelId}`); // Redirect back to the dashboard after submission
    } catch (error) {
      setResponseMessage(error.response ? error.response.data.message : 'Failed to add entry');
    }
  };

  return (
    <div className="channel-entries-form-container">
      <h2>Add Entries to Channel</h2>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={index} className="form-group">
            <label htmlFor={field}>{field}</label>
            <input
              type="text"
              id={field}
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(e, field)}
              required
            />
          </div>
        ))}
        <button type="submit" className="submit-btn">Submit Entry</button>
      </form>
    </div>
  );
}

export default ChannelEntriesForm;
