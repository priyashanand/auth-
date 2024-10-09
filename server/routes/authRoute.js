const express = require ('express')
const authController = require('../controllers/authController')
const Channel = require('../models/channelModel');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/signup', authController.signup)
router.post('/login', authController.login)

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    // console.log(token)
    
    if (!token) {
      return res.status(403).json({ message: 'Token required' });
    }
  
    jwt.verify(token.slice(7), 'secretkey123', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  };


router.post('/channels', authenticateJWT, async (req, res) => {
    const { name, description, fields } = req.body;

    if (!name || !fields) {
        return res.status(400).json({ message: 'Channel name and fields are required' });
    }

    try {
        const userId = req.user._id;
        const apiKey = uuidv4(); 

        // Create the new channel
        const newChannel = new Channel({
            name,
            description,
            fields,
            userId, 
            apiKey
        });

        await newChannel.save();

        res.status(201).json({
            message: 'Channel created successfully',
            channel: newChannel
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create channel', error: error.message });
    }
});

module.exports = router