const User = require('../models/userModel')

exports.getUser = async (req, res, next) => {
    try{
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message: 'user not found',
            })
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
                avatar:user.avatar,
                uuid: user.uuid,
                role: user.role,
                verified:false
            }
        });

    }catch(error){
        next(error);
    }
};

exports.changeName = async (req, res, next) => {
    const {firstName, lastName} = req.body;

    if(!firstName && !lastName){
        return res.status(400).json({
            message: "Atleast one of the first name or lastname is required",
        })
    }

    try{
        const userId = req.user._id;

        const updateFields = {};
        if(firstName) updateFields.firstName = firstName;
        if(lastName) updateFields.lastName = lastName

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

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

    }catch(error){
        console.error('Could not update the user:', error);
    }
}