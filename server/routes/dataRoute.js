const express = require('express');
const router = express.Router();
const Channel = require('../models/channelModel');


// // router.post('/channels/:channelId/entries', async (req, res) => {
// //     const { channelId } = req.params;
// //     const apiKey = req.header('x-api-key');  
// //     const { fieldData } = req.body;
// //     const token = req.header('Authorization') ? req.header('Authorization') : null;

// //     console.log('channelId received:', channelId); 
// //     console.log('Received fieldData:', fieldData);

// //     console.log('tokeken is :', token);

// //     try {
// //         const channel = await Channel.findById(channelId);
// //         console.log('channel:', channel);

// //         if (!channel) {
// //             return res.status(404).json({ message: 'Channel not found' });
// //         }

// //         if (!apiKey) {
// //             return res.status(400).json({ message: 'API key is missing in the headers' });
// //         }

// //         if (channel.apiKey !== apiKey) {
// //             return res.status(403).json({ message: 'Invalid API key' });
// //         }

// //         const validFields = channel.fields;
// //         const receivedFields = Object.keys(fieldData);
// //         const isValid = receivedFields.every(field => validFields.includes(field));

// //         if (!isValid) {
// //             return res.status(400).json({ message: 'Invalid field data' });
// //         }

// //         const newEntry = {
// //             fieldData: Object.entries(fieldData).map(([name, value]) => ({ name, value })),
// //             timestamp: new Date()
// //         };

// //         //console.log('Transformed fieldData:', newEntry.fieldData);

// //         channel.entries.push(newEntry);
// //         //console.log('Channel entries before saving:', channel.entries);

// //         await channel.save();

// //         res.status(201).json({
// //             message: 'Entry added successfully',
// //             entry: newEntry
// //         });
// //         // console.log(token)
// //     } catch (error) {
// //         res.status(500).json({ message: 'Failed to add entry', error: error.message });
// //     }
// // });

// // router.post('/channels/:channelId/entries', async (req, res) => {
// //     const { channelId } = req.params;
// //     const apiKey = req.header('x-api-key');
// //     const token = req.header('Authorization') ? req.header('Authorization') : null;
// //     const values = req.query.values ? req.query.values.split(',') : null; // Values passed via URL

// //     console.log('channelId received:', channelId);
// //     console.log('Received values:', values);

// //     try {
// //         const channel = await Channel.findById(channelId);
// //         console.log('channel:', channel);

// //         // Check if channel exists
// //         if (!channel) {
// //             return res.status(404).json({ message: 'Channel not found' });
// //         }

// //         // Check if API key is provided and valid
// //         // if (!apiKey) {
// //         //     return res.status(400).json({ message: 'API key is missing in the headers' });
// //         // }

// //         // if (channel.apiKey !== apiKey) {
// //         //     return res.status(403).json({ message: 'Invalid API key' });
// //         // }

// //         // Check if values are provided in the URL query
// //         if (!values) {
// //             return res.status(400).json({ message: 'Values are missing in the query parameters' });
// //         }

// //         // Validate the number of fields and values
// //         const validFields = channel.fields;
        
// //         // Ensure the number of values matches the number of fields
// //         if (values.length !== validFields.length) {
// //             return res.status(400).json({ message: `Number of values (${values.length}) does not match number of fields (${validFields.length})` });
// //         }

// //         // Map values to their corresponding field names
// //         const fieldData = validFields.reduce((acc, field, index) => {
// //             acc[field] = values[index];
// //             return acc;
// //         }, {});

// //         // Create a new entry
// //         const newEntry = {
// //             fieldData: Object.entries(fieldData).map(([name, value]) => ({ name, value })),
// //             timestamp: new Date()
// //         };

// //         channel.entries.push(newEntry);

// //         await channel.save();

// //         res.status(201).json({
// //             message: 'Entry added successfully',
// //             entry: newEntry
// //         });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Failed to add entry', error: error.message });
// //     }
// // });

// // router.post('/channels/:channelId/entries', async (req, res) => {
// //     const { channelId } = req.params;
// //     const fieldData = req.query; // Get field data from query parameters

// //     console.log('channelId received:', channelId); 
// //     console.log('Received fieldData:', fieldData);

// //     // Check if any fields are provided
// //     if (Object.keys(fieldData).length === 0) {
// //         return res.status(400).json({ message: 'At least one field is required' });
// //     }

// //     try {
// //         const channel = await Channel.findById(channelId);
// //         // console.log('channel:', channel);

// //         if (!channel) {
// //             return res.status(404).json({ message: 'Channel not found' });
// //         }

// //         // Create a new entry dynamically based on the query parameters
// //         const newEntry = {
// //             fieldData: [],
// //             timestamp: new Date()
// //         };

// //         // Extract valid fields from the channel
// //         const validFields = channel.fields.map(field => field.toLowerCase()); // Normalize to lowercase

// //         // Loop through each field in fieldData
// //         for (const [key, value] of Object.entries(fieldData)) {
// //             // Only include valid fields
// //             if (validFields.includes(key.toLowerCase())) { // Normalize to lowercase for comparison
// //                 newEntry.fieldData.push({ name: key, value }); // Construct field data
// //             } else {
// //                 console.warn(`Field ${key} is not valid and will be ignored.`);
// //             }
// //         }

// //         // Check if newEntry has valid fieldData
// //         if (newEntry.fieldData.length === 0) {
// //             return res.status(400).json({ message: 'No valid fields provided' });
// //         }

// //         // Add the entry to the channel's entries array
// //         channel.entries.push(newEntry);

// //         // Save the updated channel with the new entry
// //         await channel.save();

// //         res.status(201).json({
// //             message: 'Entry added successfully',
// //             entry: newEntry
// //         });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Failed to add entry', error: error.message });
// //     }
// // });

// router.post('/channels/:channelId/entries', async (req, res) => {
//     const { channelId } = req.params;
//     const fieldData = req.query; // Get field data from query parameters

//     console.log('channelId received:', channelId);
//     console.log('Received fieldData:', fieldData);

//     // Check if any fields are provided
//     if (Object.keys(fieldData).length === 0) {
//         return res.status(400).json({ message: 'At least one field is required' });
//     }

//     try {
//         const channel = await Channel.findById(channelId);
//         console.log('channel:', channel);

//         if (!channel) {
//             return res.status(404).json({ message: 'Channel not found' });
//         }

//         // Create a new entry dynamically based on the query parameters
//         const newEntry = {
//             fieldData: [],
//             timestamp: new Date()
//         };

//         // Extract valid fields from the channel
//         const validFields = channel.fields; // The array of field names

//         console.log('Valid fields:', validFields); // Log valid fields

//         // Loop through each field in fieldData
//         for (const [key, value] of Object.entries(fieldData)) {
//             // Only include valid fields
//             if (validFields.includes(key)) {
//                 newEntry.fieldData.push({ name: key, value }); // Construct field data
//             } else {
//                 console.warn(`Field ${key} is not valid and will be ignored.`);
//             }
//         }

//         // Check if newEntry has valid fieldData
//         if (newEntry.fieldData.length === 0) {
//             return res.status(400).json({ message: 'No valid fields provided' });
//         }

//         // Add the entry to the channel's entries array
//         channel.entries.push(newEntry);

//         // Save the updated channel with the new entry
//         await channel.save();

//         res.status(201).json({
//             message: 'Entry added successfully',
//             entry: newEntry
//         });
//     } catch (error) {
//         console.error('Error saving entry:', error); // Log the error
//         res.status(500).json({ message: 'Failed to add entry', error: error.message });
//     }
// });







// router.get('/channels/:channelId/entries', async (req, res) => {
//     const { channelId } = req.params;
//     const requestedFields = req.query.fields ? req.query.fields.split(',') : []; 

//     // const apiKey = req.header('x-api-key');
//     // const token = req.header('Authorization') ? req.header('Authorization') : null;
//     //console.log('Received token:', token);

//     // if (!apiKey) {
//     //     return res.status(400).json({ message: 'API key is missing in the headers' });
//     // }

//     // if (!token) {
//     //     return res.status(401).json({ message: 'JWT token is missing in the headers' });
//     // }

//     try {
//         const channel = await Channel.findById(channelId);
        
//         if (!channel) {
//             return res.status(404).json({ message: 'Channel not found' });
//         }

//         // If no fields are requested, return all entries
//         if (requestedFields.length === 0) {
//             return res.status(200).json({
//                 message: 'Entries retrieved successfully',
//                 entries: channel.entries
//             });
//         }

//         // Filter the entries based on requested fields
//         const filteredEntries = channel.entries.map(entry => {
//             const filteredFieldData = entry.fieldData.filter(field => requestedFields.includes(field.name));
//             return {
//                 timestamp: entry.timestamp,
//                 fieldData: filteredFieldData
//             };
//         });

//         res.status(200).json({
//             message: 'Entries retrieved successfully',
//             entries: filteredEntries
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to retrieve entries', error: error.message });
//     }
// });

// // Create an entry for a channel
// router.route('/channels/:channelId/entries')
//     .post(async (req, res) => {
//         const { channelId } = req.params;
//         const fieldData = req.body; // Use POST body for data
//         await processEntry(channelId, fieldData, res);
//     })
//     .get(async (req, res) => {
//         const { channelId } = req.params;
//         const fieldData = req.query; // Get field data from query parameters
//         await processEntry(channelId, fieldData, res);
//     });

// // Function to process the entry
// const processEntry = async (channelId, fieldData, res) => {
//     console.log('channelId received:', channelId);
//     console.log('Received fieldData:', fieldData);

//     // Check if any fields are provided
//     if (Object.keys(fieldData).length === 0) {
//         return res.status(400).json({ message: 'At least one field is required' });
//     }

//     try {
//         const channel = await Channel.findById(channelId);
//         console.log('channel:', channel);

//         if (!channel) {
//             return res.status(404).json({ message: 'Channel not found' });
//         }

//         // Create a new entry dynamically based on the query parameters
//         const newEntry = {
//             fieldData: [],
//             timestamp: new Date()
//         };

//         // Extract valid fields from the channel
//         const validFields = channel.fields; // The array of field names

//         console.log('Valid fields:', validFields); // Log valid fields

//         // Loop through each field in fieldData
//         for (const [key, value] of Object.entries(fieldData)) {
//             // Only include valid fields
//             if (validFields.includes(key)) {
//                 newEntry.fieldData.push({ name: key, value }); // Construct field data
//             } else {
//                 console.warn(`Field ${key} is not valid and will be ignored.`);
//             }
//         }

//         // Check if newEntry has valid fieldData
//         if (newEntry.fieldData.length === 0) {
//             return res.status(400).json({ message: 'No valid fields provided' });
//         }

//         // Add the entry to the channel's entries array
//         channel.entries.push(newEntry);

//         // Save the updated channel with the new entry
//         await channel.save();

//         res.status(201).json({
//             message: 'Entry added successfully',
//             entry: newEntry
//         });
//     } catch (error) {
//         console.error('Error saving entry:', error); // Log the error
//         res.status(500).json({ message: 'Failed to add entry', error: error.message });
//     }
// };

// const addEntryToChannel = async (channelId, fieldData, res) => {
//     try {
//         const channel = await Channel.findById(channelId);
//         if (!channel) {
//             return res.status(404).json({ message: 'Channel not found' });
//         }

//         const validFields = channel.fields; // Get valid fields from channel
//         const newEntry = { fieldData: [], timestamp: new Date() };

//         // Loop through provided field data and validate against channel fields
//         for (const [key, value] of Object.entries(fieldData)) {
//             if (validFields.includes(key)) {
//                 newEntry.fieldData.push({ name: key, value }); // Only add valid fields
//             } else {
//                 console.warn(`Field ${key} is not valid and will be ignored.`);
//             }
//         }

//         if (newEntry.fieldData.length === 0) {
//             return res.status(400).json({ message: 'No valid fields provided' });
//         }

//         // Add the entry to the channel's entries
//         channel.entries.push(newEntry);
//         await channel.save(); // Save the channel with the new entry

//         res.status(201).json({
//             message: 'Entry added successfully',
//             entry: newEntry
//         });
//     } catch (error) {
//         console.error('Error adding entry:', error);
//         res.status(500).json({ message: 'Failed to add entry', error: error.message });
//     }
// };

// router.route('/api/channels/:channelId/entries')
//     .post(async (req, res) => {
//         const { channelId } = req.params;
//         const fieldData = req.body; // Expecting data in the request body
//         await addEntryToChannel(channelId, fieldData, res);
//     })
//     .get(async (req, res) => {
//         const { channelId } = req.params;
//         const fieldData = req.query; // Expecting data in query parameters
//         await addEntryToChannel(channelId, fieldData, res);
//     });

// router.get('/api/channels/:channelId/entries', async (req, res) => {
//     const { channelId } = req.params;
//     const { fields } = req.query; // Get the fields from query parameters

//     try {
//         // Find the channel by its ID
//         const channel = await Channel.findById(channelId);

//         // Check if the channel exists
//         if (!channel) {
//             return res.status(404).json({ message: 'Channel not found' });
//         }

//         // Get all entries
//         let entries = channel.entries;

//         // If fields are specified, filter the entries
//         if (fields) {
//             const requestedFields = fields.split(','); // Split the fields by comma
//             entries = entries.map(entry => {
//                 const filteredFieldData = entry.fieldData.filter(field =>
//                     requestedFields.includes(field.name)
//                 );
//                 return {
//                     ...entry.toObject(), // Convert mongoose document to plain object
//                     fieldData: filteredFieldData // Only include requested fields
//                 };
//             });
//         }

//         // Return the entries of the channel
//         res.status(200).json({
//             message: 'Entries retrieved successfully',
//             entries: entries
//         });
//     } catch (error) {
//         console.error('Error retrieving entries:', error);
//         res.status(500).json({ message: 'Failed to retrieve entries', error: error.message });
//     }
// });

module.exports = router;
