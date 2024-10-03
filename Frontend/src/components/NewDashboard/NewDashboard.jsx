
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GaugeChartComponent from '../GuageChart/GuageChart';
import LineChartComponent from '../LineChart/LineChart';
import FieldDisplay from './FieldDisplay';
import './NewDasboard.css';
import AuthNavbar from '../Authorized-Navbar/AuthorizedNav';
// import { useParams, useNavigate } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';

const ChannelDashboard = () => {
    // const [channelData, setChannelData] = useState(null);
    const [channelData, setChannelData] = useState({});
    const [fieldData, setFieldData] = useState({});
    const [historicalData, setHistoricalData] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
      const fetchChannelData = async () => {
          try {
              const token = localStorage.getItem('token');
              const apiKey = localStorage.getItem('x-api-key');
                // console.log(apiKey);
              if (!token || !apiKey) {
                  console.error('Token or API Key missing');
                  return;
              }

            //   const fieldResponse = await axios.get(`http://localhost:4001/api/channels/${id}/entries`, {
            //       headers: {
            //           'Authorization': `Bearer ${token}`,
            //           'x-api-key': `Bearer ${apiKey}`,
            //       },
            //   });
            const fieldResponse = await axios.get(`http://localhost:4001/api/auth/channels`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-api-key': `Bearer ${apiKey}`,
                },
            });

            // console.log(fieldResponse);

            // if(fieldResponse.data.entries.length === 0) {
            //     const channelId = fieldResponse.data[0]._id;  // Use the correct channelId from the response
            //     console.log('redirecting to channel enteries');
            //     navigate(`/channels/${channelId}/entries`);
            // }
            // console.log(fieldResponse)
            
  
              const latestEntry = fieldResponse.data.fields.reduce((acc, curr) => {
                  acc[curr.name] = curr.value;
                  return acc;
              }, {});
            //   console.log(latestEntry)
              setFieldData(latestEntry);
  
              const historicalDataResponse = fieldResponse.data.entries.slice(0, 12).reduce((acc, entry) => {
                  entry.fieldData.forEach(field => {
                      acc[field.name] = acc[field.name] || [];
                      acc[field.name].push(field.value);
                  });
                  return acc;
              }, {});
              setHistoricalData(historicalDataResponse);
          } catch (error) {
              if (error.response && error.response.status === 403) {
                  console.error('Authorization failed. Check API key and token.');
              } else {
                  console.error('Error fetching channel data:', error);
              }
          }
      };
  
      fetchChannelData();
  }, [id]);
//   console.log(fieldData)

    if (!channelData || Object.keys(fieldData).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <AuthNavbar />
            <div className="dashboard">
                <div className="channel-info">
                    <h1>{channelData.name}</h1>
                    <p>{channelData.description}</p>
                </div>

                <div className="charts-container">
                    {channelData.fields.map((field, index) => (
                        <div className="chart" key={index}>
                            <FieldDisplay name={field} value={fieldData[field]} />
                            <GaugeChartComponent value={fieldData[field]} />
                            <LineChartComponent
                                data={{
                                    series1: historicalData[field],
                                }}
                                timeLabels={Array.from({ length: 12 }, (_, i) => `${(2 - Math.floor(i / 6))}h ${i % 6 * 10}m ago`)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ChannelDashboard;

