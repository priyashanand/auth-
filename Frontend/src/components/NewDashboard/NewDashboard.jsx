import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GaugeChartComponent from '../GuageChart/GuageChart';
import LineChartComponent from '../LineChart/LineChart';
import FieldDisplay from './FieldDisplay';
import './NewDasboard.css';
import AuthNavbar from '../Authorized-Navbar/AuthorizedNav';
import { useParams } from 'react-router-dom';

const ChannelDashboard = () => {
    const [channelData, setChannelData] = useState({});
    const [fieldData, setFieldData] = useState({});
    const [historicalData, setHistoricalData] = useState({});
    const { id } = useParams();  // Get the channel ID from the route

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                // Fetch the channel's field data and entries dynamically using the channel ID
                const fieldResponse = await axios.get(`http://localhost:4001/api/channels/${id}/entries/read`);
                
                if (!fieldResponse.data.entries || fieldResponse.data.entries.length === 0) {
                    console.error('No entries found for this channel');
                    return;
                }

                // Extract the latest field data for each field in the channel
                const latestEntry = fieldResponse.data.entries[0].fieldData.reduce((acc, curr) => {
                    acc[curr.name] = curr.value;
                    return acc;
                }, {});

                setFieldData(latestEntry);  // Set the current field data for display

                // Extract historical data for each field (up to the last 12 entries)
                const historicalDataResponse = fieldResponse.data.entries.slice(0, 12).reduce((acc, entry) => {
                    entry.fieldData.forEach(field => {
                        acc[field.name] = acc[field.name] || [];
                        acc[field.name].push(field.value);
                    });
                    return acc;
                }, {});

                setHistoricalData(historicalDataResponse);  // Set the historical data for charts

                // Set channel metadata like name, description, and fields
                setChannelData({
                    name: fieldResponse.data.message,  // You might need to adjust based on actual response structure
                    fields: fieldResponse.data.entries[0].fieldData.map(field => field.name),  // Dynamically set fields based on response
                });
            } catch (error) {
                console.error('Error fetching channel data:', error);
            }
        };

        fetchChannelData();
    }, [id]);

    if (!channelData || Object.keys(fieldData).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <AuthNavbar />  {/* Navbar for authenticated users */}
            <div className="dashboard">
                <div className="channel-info">
                    <h1>{channelData.name}</h1>
                    <p>{channelData.description}</p>
                </div>

                <div className="charts-container">
                    {/* Map over the fields and display gauge and line charts for each */}
                    {channelData.fields.map((field, index) => (
                        <div className="chart" key={index}>
                            <FieldDisplay name={field} value={fieldData[field]} />  {/* Display current field value */}
                            <GaugeChartComponent value={fieldData[field]} />  {/* Display gauge chart for the field */}
                            <LineChartComponent
                                data={{
                                    series1: historicalData[field],  // Historical data for the line chart
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

