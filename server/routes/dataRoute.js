const express = require('express');
const router = express.Router();
const Channel = require('../models/channelModel');


// router.post('/channels/:channelId/entries', async (req, res) => {
//     const { channelId } = req.params;
//     const { apiKey } = req.headers;  // The API key will be sent in the request header
//     const { fieldData } = req.body;

//     try {
//         // Find the channel by ID and verify the apiKey
//         const channel = await Channel.findById(channelId);

//         if (!channel) {
//             return res.status(404).json({ message: 'Channel not found' });
//         }

//         if (channel.apiKey !== apiKey) {
//             return res.status(403).json({ message: 'Invalid API key' });
//         }

//         // Validate fieldData against channel fields
//         const validFields = channel.fields.map(field => field.name);
//         const isValidData = fieldData.every(entry => validFields.includes(entry.name));

//         if (!isValidData) {
//             return res.status(400).json({ message: 'Invalid field data' });
//         }

//         // Create a new entry
//         const newEntry = {
//             fieldData,
//             timestamp: new Date()
//         };

//         // Add the entry to the channel's entries array
//         channel.entries.push(newEntry);

//         // Save the updated channel with the new entry
//         await channel.save();

//         res.status(201).json({
//             message: 'Entry added successfully',
//             entry: newEntry
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to add entry', error: error.message });
//     }
// });

// router.post('/channels/:channelId/entries', async (req, res) => {
//     const { channelId } = req.params; 
//     const apiKey = req.header('x-api-key');  // The API key will be sent in the request header
//     const { fieldData } = req.body;

//     console.log('channelId received:', channelId);
    
//     console.log('apiKey:', apiKey);

//     try {
//         const channel = await Channel.findById(channelId);
//         console.log('channel:', channel);

//         if (!channel) {
//             return res.status(404).json({ message: 'Channel not found' });
//         }
//         // Check if the API key is provided in the headers
//         if (!apiKey) {
//             return res.status(400).json({ message: 'API key is missing in the headers' });
//         }

//         // Find the channel by ID
//         //const channel = await Channel.findById(channelId);

//         if (!channel) {
//             return res.status(404).json({ message: 'Channel not found' });
//         }

//         // Validate the API key
//         if (channel.apiKey !== apiKey) {
//             return res.status(403).json({ message: 'Invalid API key' });
//         }

//         // Validate fieldData against channel fields
//         // const validFields = channel.fields.map(field => field.name);
//         const validFields = channel.fields;
//         const receivedFields = Object.keys(fieldData);
//         // const isValidData = fieldData.every(entry => validFields.includes(entry.name));
//         const isValid = receivedFields.every(field => validFields.includes(field));

//         if (!isValid) {
//             return res.status(400).json({ message: 'Invalid field data' });
//         }

//         // Create a new entry
//         const newEntry = {
//             data: fieldData,
//             timestamp: new Date()
//         };

//         // Add the entry to the channel's entries array
//         channel.entries.push(newEntry);

//         // Save the updated channel with the new entry
//         await channel.save();

//         res.status(201).json({
//             message: 'Entry added successfully',
//             entry: newEntry
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to add entry', error: error.message });
//     }
// });


// GET: Retrieve all entries for a specific channel

router.post('/channels/:channelId/entries', async (req, res) => {
    const { channelId } = req.params;
    const apiKey = req.header('x-api-key');  
    const { fieldData } = req.body;

    console.log('channelId received:', channelId); 
    console.log('Received fieldData:', fieldData);
    console.log('apiKey:', apiKey);

    try {
        const channel = await Channel.findById(channelId);
        console.log('channel:', channel);

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        if (!apiKey) {
            return res.status(400).json({ message: 'API key is missing in the headers' });
        }

        if (channel.apiKey !== apiKey) {
            return res.status(403).json({ message: 'Invalid API key' });
        }

        const validFields = channel.fields;
        const receivedFields = Object.keys(fieldData);
        const isValid = receivedFields.every(field => validFields.includes(field));

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid field data' });
        }

        const newEntry = {
            fieldData: Object.entries(fieldData).map(([name, value]) => ({ name, value })),
            timestamp: new Date()
        };

        console.log('Transformed fieldData:', newEntry.fieldData);

        channel.entries.push(newEntry);
        console.log('Channel entries before saving:', channel.entries);

        await channel.save();

        res.status(201).json({
            message: 'Entry added successfully',
            entry: newEntry
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add entry', error: error.message });
    }
});


router.get('/channels/:channelId/entries', async (req, res) => {
    const { channelId } = req.params;
    const { apiKey } = req.headers;  // API key sent in the header

    try {
        // Find the channel by its ID
        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        // Validate the API key
        if (channel.apiKey !== apiKey) {
            return res.status(403).json({ message: 'Invalid API key' });
        }

        // Get the entries
        const entries = channel.entries;

        res.status(200).json({
            message: 'Entries retrieved successfully',
            entries
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve entries', error: error.message });
    }
});

module.exports = router;
