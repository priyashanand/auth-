const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
//const upload = require('../middleware/multerConfig');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    // console.log(token)
    
    if (!token) {
      return res.status(403).json({ message: 'Token required' });
    }
  
    jwt.verify(token, 'secretkey123', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  };


router.get('/me',authenticateJWT,async (req, res, next) => {
    try {
        console.log(req.user)
        // The user ID is extracted from the JWT and available in req.user
        const userId = req.user._id;

        // Fetch user details from the database
        const user = await User.findById(userId, '-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'User details retrieved successfully',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobileNumber: user.mobileNumber,
                avatar: user.avatar,
                uuid: user.uuid,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;