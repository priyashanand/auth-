const express = require('express');
const router = express.Router();
const Channel = require('../models/channelModel');


const retrieveEntriesFromChannel = async (channelId, fields, res) => {
    try {
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        let entries = channel.entries; 

        if (fields) {
            const requestedFields = fields.split(',');
            entries = entries.map(entry => {
                const filteredFieldData = entry.fieldData.filter(field =>
                    requestedFields.includes(field.name)
                );
                return {
                    ...entry.toObject(), 
                    fieldData: filteredFieldData 
                };
            });
        }

        res.status(200).json({
            message: 'Entries retrieved successfully',
            entries: entries
        });
    } catch (error) {
        console.error('Error retrieving entries:', error);
        res.status(500).json({ message: 'Failed to retrieve entries', error: error.message });
    }
};

router.get('/channels/:channelId/entries/read', async (req, res) => {
    const { channelId } = req.params;
    const { fields } = req.query; 
    await retrieveEntriesFromChannel(channelId, fields, res);
});

module.exports = router;