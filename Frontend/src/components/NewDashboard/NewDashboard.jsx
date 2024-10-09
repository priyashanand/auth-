import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GaugeChartComponent from '../GuageChart/GuageChart';
import LineChartComponent from '../LineChart/LineChart';
import FieldDisplay from './FieldDisplay';
import './NewDasboard.css';
import Navbar from '../Navbar/Navbar';
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

                // Extract the list of all fields from the channel or from all entries
                const allFields = new Set();
                
                // If channel fields are returned in the response, use them
                if (fieldResponse.data.channel?.fields) {
                    fieldResponse.data.channel.fields.forEach(field => allFields.add(field));
                } else {
                    // Otherwise, collect all fields from entries
                    fieldResponse.data.entries.forEach(entry => {
                        entry.fieldData.forEach(field => allFields.add(field.name));
                    });
                }

                // Convert Set to array
                const createdFields = Array.from(allFields);

                // Initialize the latest field data object with 0 for all fields
                const latestEntry = createdFields.reduce((acc, fieldName) => {
                    acc[fieldName] = 0;  // Default value is 0
                    return acc;
                }, {});

                // Iterate over the entries, ensuring all fields are populated
                fieldResponse.data.entries.forEach(entry => {
                    entry.fieldData.forEach(field => {
                        latestEntry[field.name] = field.value;  // Update the latest value for each field
                    });
                });

                setFieldData(latestEntry);  // Set the current field data for display

                // Process historical data
                const historicalDataResponse = fieldResponse.data.entries.reduce((acc, entry) => {
                    createdFields.forEach(fieldName => {
                        acc[fieldName] = acc[fieldName] || [];
                        const field = entry.fieldData.find(f => f.name === fieldName);
                        const value = field ? field.value : (acc[fieldName].length > 0 ? acc[fieldName][acc[fieldName].length - 1].value : 0); // Carry forward the last value or default to 0
                        acc[fieldName].push({ value, timestamp: entry.timestamp });
                    });
                    return acc;
                }, {});

                setHistoricalData(historicalDataResponse);  // Set the historical data for charts

                // Set channel metadata like name and description
                setChannelData({
                    name: fieldResponse.data.channelName,  // Adjust based on actual response structure
                    fields: createdFields,  // Use the full set of fields
                });
            } catch (error) {
                console.error('Error fetching channel data:', error);
            }
        };

        fetchChannelData();
    }, [id]);

    if (!channelData.fields || channelData.fields.length === 0) {
        // Show a message if there are no fields in the channel
        return (
            <>
                <Navbar />  {/* Navbar for authenticated users */}
                <div className="dashboard">
                    <div className="empty-state-message">
                        <h2>No Data Available</h2>
                        <p>This channel currently has no entries. Please add data to view the charts.</p>
                    </div>
                </div>
            </>
        );
    }

    if (Object.keys(fieldData).length === 0) {
        // Render empty charts for each field based on channel fields, even if no data is available
        return (
            <>
                <Navbar />  {/* Navbar for authenticated users */}
                <div className="dashboard">
                    <div className="empty-state-message">
                        <h2>No Data Available</h2>
                        <p>This channel currently has no entries. Please add data to view the charts.</p>
                        <div className="charts-container">
                            {/* Display empty charts dynamically based on the number of fields */}
                            {channelData.fields.map((field, index) => (
                                <div className="chart" key={index}>
                                    <FieldDisplay name={field} value="No Data" />
                                    <GaugeChartComponent value={0} />
                                    <p className="empty-chart-message">No data available for {field} yet.</p>
                                    <LineChartComponent data={{ series1: [] }} timeLabels={[]} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />  {/* Navbar for authenticated users */}
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
                            <GaugeChartComponent value={fieldData[field]} />  {/* Display gauge chart with latest value */}
                            <LineChartComponent
                                data={{
                                    series1: historicalData[field]?.map(entry => entry.value) || [],  // Historical data for the line chart, or empty array
                                }}
                                timeLabels={historicalData[field]?.map(entry => {
                                    const date = new Date(entry.timestamp); // Create Date object from timestamp
                                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format to hh:mm
                                }) || []}  
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ChannelDashboard;
