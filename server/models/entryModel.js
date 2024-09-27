const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  channelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Channel', 
    required: true 
    },
    data: mongoose.Schema.Types.Mixed,
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Entry', entrySchema);
