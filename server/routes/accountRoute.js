const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const authenticateJWT = require('../middleware/authenticateJWT'); 

router.get('/me',authenticateJWT,async (req, res, next) => {
    try {
        //console.log(req.user)
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


router.patch('/me', authenticateJWT, async (req, res) => {
    const { firstName, lastName } = req.body;

    // Check if at least one field (firstName or lastName) is provided
    if (!firstName && !lastName) {
        return res.status(400).json({ message: 'At least one of first name or last name is required' });
    }

    try {
        // Get the logged-in user's ID from the JWT token (set by authenticateJWT)
        const userId = req.user._id;

        // Create an update object dynamically based on the provided fields
        const updateFields = {};
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;

        // Find the user by ID and update the provided fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields, // Update only the fields provided
            { new: true, runValidators: true } // Return the updated user object and validate inputs
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the updated user info (excluding sensitive fields like password)
        res.status(200).json({
            message: 'User information updated successfully',
            user: {
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                mobileNumber: updatedUser.mobileNumber,
                avatar: updatedUser.avatar,
                uuid: updatedUser.uuid
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;