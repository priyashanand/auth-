const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
    },
    description: String,
    apiKey: { 
        type: String, 
        unique: true, 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    //this is array of objects
    fields: [{ 
        name: String, 
        type: String 
    }],
    apiKey: { 
        type: String, 
        required: true 
    }
});

module.exports = mongoose.model('Channel', channelSchema);
