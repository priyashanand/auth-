const express = require('express');
const router = express.Router();
const Channel = require('../models/channelModel');
const authenticateJWT = require('../middleware/authenticateJWT'); 


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


const updateFieldNamesInChannel = async (channelId, updatedFields, res) => {
    try {
        // Find the channel by its ID
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        const fieldDataMap = {};
        updatedFields.forEach(({ oldName, newName }) => {
            fieldDataMap[oldName] = newName;
        });

        // Update field names within the entries
        channel.entries = channel.entries.map(entry => {
            entry.fieldData = entry.fieldData.map(field => {
                if (fieldDataMap[field.name]) {
                    field.name = fieldDataMap[field.name]; // Update the field name
                }
                return field;
            });
            return entry;
        });

        // Update field names in the channel's main fields array (if applicable)
        channel.fields = channel.fields.map(field => {
            return fieldDataMap[field] ? fieldDataMap[field] : field;
        });

        // Save the updated channel
        await channel.save();

        res.status(200).json({
            message: 'Field names updated successfully',
            channel: channel
        });
    } catch (error) {
        console.error('Error updating field names:', error);
        res.status(500).json({ message: 'Failed to update field names', error: error.message });
    }
};

// PATCH request to update field names
router.patch('/channels/:channelId/fields', authenticateJWT, async (req, res) => {
    const { channelId } = req.params;
    const updatedFields = req.body.fields; // Expecting [{oldName, newName}] format

    if (!updatedFields || !Array.isArray(updatedFields)) {
        return res.status(400).json({ message: 'Invalid fields data provided' });
    }

    await updateFieldNamesInChannel(channelId, updatedFields, res);
});


module.exports = router;