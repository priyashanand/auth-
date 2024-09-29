const express = require('express');
const router = express.Router();
const Channel = require('../models/channelModel');


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
