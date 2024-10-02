// ChannelDashboard.js
// import React, { useState, useEffect } from 'react';
// import GaugeChartComponent from '../GuageChart/GuageChart';
// import LineChartComponent from '../LineChart/LineChart';
// import FieldDisplay from './FieldDisplay';
// import './NewDasboard.css';
// import AuthNavbar from '../Authorized-Navbar/AuthorizedNav';
// import { useParams } from 'react-router-dom';

// const ChannelDashboard = () => {
//   const [channelData, setChannelData] = useState(null);
//   const [entries, setEntries] = useState([]);

//   useEffect(() => {
//     // Fetch channel information from API
//     fetch('http://localhost:4001/api/channels/1234')
//       .then((response) => response.json())
//       .then((data) => {
//         setChannelData(data);
//       });

//     // Fetch entries for the channel
//     fetch('http://localhost:4001/api/channels/1234/entries')
//       .then((response) => response.json())
//       .then((data) => {
//         setEntries(data.fieldData);
//       });
//   }, []);

// //   if (!channelData || !entries.length) {
// //     return <div>Loading...</div>;
// //   }

//   return (
//     <div className="dashboard">
//       <div className="channel-info">
//         <h1>{channelData.name}</h1>
//         <p>Channel ID: {channelData.id}</p>
//         <p>Author: {channelData.author}</p>
//       </div>

//       <div className="charts-container">
//         <div className="chart">
//           <FieldDisplay name="Temperature" value={entries[0].temperature} />
//           <GaugeChartComponent value={entries[0].temperature} />
//         </div>

//         <div className="chart">
//           <FieldDisplay name="Humidity" value={entries[0].humidity} />
//           <LineChartComponent
//             data={{
//               series1: [10, 20, 30, 40, 50],
//               series2: [15, 25, 35, 45, 55],
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChannelDashboard;

// const ChannelDashboard = () => {
//     // Hardcoded example data
//     const channelData = {
//       name: "Weather Station",
//       id: "123456",
//       author: "John Doe",
//     };
  
//     const entries = [
//       {
//         temperature: 22.5,
//         humidity: 65,
//       },
//     ];
  
//     return (
//         <>
//         <AuthNavbar/>
//       <div className="dashboard">
//         <div className="channel-info">
//           <h1>{channelData.name}</h1>
//           <p>Channel ID: {channelData.id}</p>
//           <p>Author: {channelData.author}</p>
//         </div>
  
//         <div className="charts-container">
//           <div className="chart">
//             <FieldDisplay name="Temperature" value={entries[0].temperature} />
//             <GaugeChartComponent value={entries[0].temperature} />
//           </div>
  
//           <div className="chart">
//             <FieldDisplay name="Humidity" value={entries[0].humidity} />
//             <LineChartComponent
//               data={{
//                 series1: [10, 20, 30, 40, 50],
//                 series2: [15, 25, 35, 45, 55],
//               }}
//             />
//           </div>
//         </div>
//       </div>
//       </>
//     );
//   };
  
//   export default ChannelDashboard;

// import React, { useEffect, useState } from 'react';
// import AuthNavbar from './AuthNavbar';
// import FieldDisplay from './FieldDisplay';
// import GaugeChartComponent from './GaugeChartComponent';
// import LineChartComponent from './LineChartComponent';
// import axios from 'axios';

// const ChannelDashboard = () => {
//   const [channelData, setChannelData] = useState(null);
//   const [fieldData, setFieldData] = useState({});
//   const [historicalData, setHistoricalData] = useState({}); // Store historical data for line charts

//   useEffect(() => {
//     // Fetch channel data from API
//     axios.get('/api/channel') // Assuming this is the API endpoint for channel data
//       .then(response => {
//         const { name, description, fields } = response.data;
//         setChannelData({ name, description, fields });

//         // Fetch the latest field data and historical data (past 3 hours)
//         axios.get('/api/channel/field-data') // Endpoint for field data
//           .then(res => {
//             setFieldData(res.data.fieldData);

//             // Simulate fetching historical data (in reality, you would fetch this from the API)
//             const simulatedHistoricalData = fields.reduce((acc, field) => {
//               acc[field] = Array.from({ length: 10 }, () => Math.random() * 100); // Simulated random data
//               return acc;
//             }, {});
//             setHistoricalData(simulatedHistoricalData);
//           });
//       })
//       .catch(error => console.error('Error fetching channel data:', error));
//   }, []);

//   if (!channelData || Object.keys(fieldData).length === 0) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <AuthNavbar />
//       <div className="dashboard">
//         <div className="channel-info">
//           <h1>{channelData.name}</h1>
//           <p>{channelData.description}</p>
//         </div>

//         <div className="charts-container">
//           {channelData.fields.map((field, index) => (
//             <div className="chart" key={index}>
//               <FieldDisplay name={field} value={fieldData[field]} />
//               <GaugeChartComponent value={fieldData[field]} />

//               <LineChartComponent
//                 data={{
//                   series1: historicalData[field], // Historical data for each field
//                 }}
//                 timeLabels={Array.from({ length: 10 }, (_, i) => `${i} mins ago`)} // Simulating past 10 timestamps
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChannelDashboard;


// const ChannelDashboard = () => {
//     const [channelData, setChannelData] = useState(null);
//     const [fieldData, setFieldData] = useState({});
//     const [historicalData, setHistoricalData] = useState({});
//     const { id } = useParams();
//     useEffect(() => {
//       // Simulate fetching channel data and field data
//       const simulatedChannelData = {
//         name: "Weather Station Demo",
//         description: "Simulated channel with weather data",
//         fields: ["temperature", "pressure", "humidity", "windspeed"],
//       };
//       setChannelData(simulatedChannelData);
  
//       // Simulate current field data with random values
//       const simulatedFieldData = {
//         temperature: (Math.random() * 15 + 10).toFixed(1), // 10°C - 25°C
//         pressure: (Math.random() * 50 + 950).toFixed(1), // 950 hPa - 1000 hPa
//         humidity: (Math.random() * 50 + 40).toFixed(1), // 40% - 90%
//         windspeed: (Math.random() * 10 + 5).toFixed(1), // 5 km/h - 15 km/h
//       };
//       setFieldData(simulatedFieldData);
  
//       // Simulate historical data over the last 2 hours (e.g., 12 data points, one every 10 minutes)
//       const simulatedHistoricalData = simulatedChannelData.fields.reduce((acc, field) => {
//         acc[field] = Array.from({ length: 12 }, () => (Math.random() * 100).toFixed(1));
//         return acc;
//       }, {});
//       setHistoricalData(simulatedHistoricalData);
//     }, []);
  
//     if (!channelData || Object.keys(fieldData).length === 0) {
//       return <div>Loading...</div>;
//     }
  
//     return (
//       <>
//         <AuthNavbar />
//         <div className="dashboard">
//           <div className="channel-info">
//             <h1>{channelData.name}</h1>
//             <p>{channelData.description}</p>
//           </div>
  
//           <div className="charts-container">
//             {channelData.fields.map((field, index) => (
//               <div className="chart" key={index}>
//                 <FieldDisplay name={field} value={fieldData[field]} />
//                 <GaugeChartComponent value={fieldData[field]} />
  
//                 <LineChartComponent
//                   data={{
//                     series1: historicalData[field], // Historical data for each field
//                   }}
//                   timeLabels={Array.from({ length: 12 }, (_, i) => `${(2 - Math.floor(i / 6))}h ${i % 6 * 10}m ago`)} // Simulating past 2 hours
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </>
//     );
//   };
  
//   export default ChannelDashboard;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import GaugeChartComponent from '../GuageChart/GuageChart';
// import LineChartComponent from '../LineChart/LineChart';
// import FieldDisplay from './FieldDisplay';
// import './NewDasboard.css';
// import AuthNavbar from '../Authorized-Navbar/AuthorizedNav';
// import { useParams } from 'react-router-dom';

// const ChannelDashboard = () => {
//     const [channelData, setChannelData] = useState(null);
//     const [fieldData, setFieldData] = useState({});
//     const [historicalData, setHistoricalData] = useState({});
//     const { id } = useParams();
//     console.log(id);
//     // console.log(setChannelData);

//     useEffect(() => {
//       const fetchChannelData = async () => {
//           try {
//               const token = localStorage.getItem('token');
//               const apiKey = localStorage.getItem('x-api-key');
  
//               if (!token || !apiKey) {
//                   console.error('Token or API Key missing');
//                   return;
//               }
  
//               // const channelResponse = await axios.get(`http://localhost:4001/api/channels/${id}`, {
//               //     headers: {
//               //         'Authorization': `Bearer ${token}`,
//               //         'x-api-key': `Bearer ${apiKey}`,
//               //     },
//               // });

//               // console.log(channelResponse);
  
//               // const { name, description, fields } = channelResponse.data.channel;
//               // setChannelData({ name, description, fields });
  
//               const fieldResponse = await axios.get(`http://localhost:4001/api/channels/${id}/entries`, {
//                   headers: {
//                       'Authorization': `Bearer ${token}`,
//                       'x-api-key': `Bearer ${apiKey}`,
//                   },
//               });
  
//               const latestEntry = fieldResponse.data.entries[0].fieldData.reduce((acc, curr) => {
//                   acc[curr.name] = curr.value;
//                   return acc;
//               }, {});
//               setFieldData(latestEntry);
  
//               const historicalDataResponse = fieldResponse.data.entries.slice(0, 12).reduce((acc, entry) => {
//                   entry.fieldData.forEach(field => {
//                       acc[field.name] = acc[field.name] || [];
//                       acc[field.name].push(field.value);
//                   });
//                   return acc;
//               }, {});
//               setHistoricalData(historicalDataResponse);
//           } catch (error) {
//               if (error.response && error.response.status === 403) {
//                   console.error('Authorization failed. Check API key and token.');
//               } else {
//                   console.error('Error fetching channel data:', error);
//               }
//           }
//       };
  
//       fetchChannelData();
//   }, [id]);
  

//     if (!channelData || Object.keys(fieldData).length === 0) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <>
//             <AuthNavbar />
//             <div className="dashboard">
//                 <div className="channel-info">
//                     <h1>{channelData.name}</h1>
//                     <p>{channelData.description}</p>
//                 </div>

//                 <div className="charts-container">
//                     {channelData.fields.map((field, index) => (
//                         <div className="chart" key={index}>
//                             <FieldDisplay name={field} value={fieldData[field]} />
//                             <GaugeChartComponent value={fieldData[field]} />
//                             <LineChartComponent
//                                 data={{
//                                     series1: historicalData[field],
//                                 }}
//                                 timeLabels={Array.from({ length: 12 }, (_, i) => `${(2 - Math.floor(i / 6))}h ${i % 6 * 10}m ago`)}
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ChannelDashboard;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import GaugeChartComponent from '../GuageChart/GuageChart';
// import LineChartComponent from '../LineChart/LineChart';
// import FieldDisplay from './FieldDisplay';
// import './NewDasboard.css';
// import AuthNavbar from '../Authorized-Navbar/AuthorizedNav';
// import { useParams, useNavigate } from 'react-router-dom';

// const ChannelDashboard = () => {
//     const [channelData, setChannelData] = useState(null);
//     const [fieldData, setFieldData] = useState({});
//     const [historicalData, setHistoricalData] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { id } = useParams();

//     useEffect(() => {
//         const fetchChannelData = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const token = localStorage.getItem('token');
//                 const apiKey = localStorage.getItem('x-api-key');

//                 if (!token || !apiKey) {
//                     throw new Error('Token or API Key missing');
//                 }

//                 // Fetch channel info
//                 const channelResponse = await axios.get(`http://localhost:4001/api/channels/${id}`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'x-api-key': `Bearer ${apiKey}`,
//                     },
//                 });

//                 const { name, description, fields } = channelResponse.data.channel;
//                 setChannelData({ name, description, fields });

//                 // Fetch field entries
//                 const fieldResponse = await axios.get(`http://localhost:4001/api/channels/${id}/entries`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'x-api-key': `Bearer ${apiKey}`,
//                     },
//                 });

//                 const latestEntry = fieldResponse.data.entries[0].fieldData.reduce((acc, curr) => {
//                     acc[curr.name] = curr.value;
//                     return acc;
//                 }, {});
//                 setFieldData(latestEntry);

//                 const historicalDataResponse = fieldResponse.data.entries.slice(0, 12).reduce((acc, entry) => {
//                     entry.fieldData.forEach(field => {
//                         acc[field.name] = acc[field.name] || [];
//                         acc[field.name].push(field.value);
//                     });
//                     return acc;
//                 }, {});
//                 setHistoricalData(historicalDataResponse);
//             } catch (error) {
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchChannelData();
//     }, [id]);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <>
//             <AuthNavbar />
//             <div className="dashboard">
//                 <div className="channel-info">
//                     <h1>{channelData.name}</h1>
//                     <p>{channelData.description}</p>
//                 </div>

//                 <div className="charts-container">
//                     {channelData.fields.map((field, index) => (
//                         <div className="chart" key={index}>
//                             <FieldDisplay name={field} value={fieldData[field]} />
//                             <GaugeChartComponent value={fieldData[field]} />
//                             <LineChartComponent
//                                 data={{
//                                     series1: historicalData[field],
//                                 }}
//                                 timeLabels={Array.from({ length: 12 }, (_, i) => `${(2 - Math.floor(i / 6))}h ${i % 6 * 10}m ago`)}
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ChannelDashboard;

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

            // const chanannelId = fieldData.data.userId;

            if(fieldResponse.data.entries.length === 0) {
                const channelId = fieldResponse.data._id;  // Use the correct channelId from the response
                navigate(`/channels/${channelId}/entries`);
            }
            // console.log(fieldResponse)
            
  
              const latestEntry = fieldResponse.data.fields.reduce((acc, curr) => {
                  acc[curr.name] = curr.value;
                  return acc;
              }, {});
              console.log(latestEntry)
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
  console.log(fieldData)

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
