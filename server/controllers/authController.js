const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const createError = require('../utils/appError')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');
const createTransporter = require('../utils/nodeMailer')
require('dotenv').config();


exports.signup = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const apiKey = uuidv4(); // Generate unique UUID for verification

        const newUser = await User.create({
            ...req.body,
            uuid: apiKey,
            password: hashedPassword,
            verified: false // New users are unverified by default
        });

        //Send verification email
        const transporter = await createTransporter();
        console.log(transporter)
        transporter.verify((error, success)=>{
            if(error){
                console.log("message cannot be sent")
                console.log(error)
            }
            else{
                console.log("message ready to be sent")
                console.log(success)
            }
        })

        const verificationLink = `http://localhost:4001/verify?uuid=${newUser.uuid}`;
        await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: newUser.email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the following link: ${verificationLink}`,
        });

        const token = jwt.sign({ _id: newUser._id , verified: newUser.verified}, 'secretkey123', {
            expiresIn: '1d',
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully. Please verify your email.',
            token,
            user: {
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                mobileNumber: newUser.mobileNumber,
                avatar: newUser.avatar,
                uuid: newUser.uuid,
                verified: newUser.verified
            }
        });

    } catch (error) {
        next(error);
    }
};


exports.login = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) return next(new createError('User not found', 404));
        
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) return next(new createError('Incorrect password', 401));

        const token = jwt.sign({_id: user._id, verified: user.verified}, 'secretkey123',{
            expiresIn: '1d',
        });

        res.status(200).json({
            status: 'success',
            token , 
            message: 'Loggen in sucessfully',
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                uuid: user.uuid,
                // uid: uniqueId
            }

        });
    }catch(error) {
        next(error);
    }
}

exports.verifyEmail = async (req, res, next) => {
    try {
        const { uuid } = req.query; // UUID should come from the query parameter

        const user = await User.findOne({ uuid });

        if (!user) {
            return res.status(400).json({ message: 'Invalid verification link.' });
        }

        if (user.verified) {
            return res.status(400).json({ message: 'User already verified.' });
        }

        user.verified = true; // Set verified to true
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Email verified successfully.',
        });
    } catch (error) {
        next(error);
    }
};


exports.forgetPassword = async(req, res, next) => {
    try {
        const email = req.body.email;
        console.log(email);
        const user = await User.findOne({email});
        if (!user){
            return next(new createError('User not found', 404));
        }

        const token = jwt.sign({_id: user._id, verified: user.verified}, 'secretkey321', {expiresIn:'15m'})

        //   console.log(typeof(token));
        user.resetLink = token

        user.save()

        // await user.updateOne({},{
        //     resetLink: token,
        // })

        const data = {
            to: email,
            subject: 'Reset Account Password Link',
            html: `
            <h3>Please click the link below to reset your password</h3>
            <p>http://localhost:4001/api/auth/update-password/${token}</p>
            `,
          }
          const transporter = await createTransporter();
        //   console.log(transporter)
          transporter.verify((error, success)=>{
            if(error){
                console.log("message cannot be sent")
                console.log(error)
            }
            else{
                console.log("message ready to be sent")
                console.log(success) 
            }
          })

        transporter.sendMail(data, function(error, body) {
            if (error) {
            return res.status(400).json({error: error.message})
            }
            return res.status(200).json({message: 'Email has been sent, please follow the instructions'})
        })


        //   user.updateOne({resetLink: token}, (err, token)=>{
        //     if(err){
        //         console.log("could not set the resetlink")
        //         res.status(400).json({
        //             status: "failed",
        //             message: "could not set the resetlink"
        //         })
        //     }else{
                // transporter.sendMail(data, function(error, body) {
                //     if (error) {
                //       return res.status(400).json({error: error.message})
                //     }
                //     return res.status(200).json({message: 'Email has been sent, please follow the instructions'})
                //   })
        //     }
        //   })



    } catch (error) {
        next(error)
    }
}



// creating update password
exports.updatePassword = async (req, res, next)=>{
    const {token} = req.params
    console.log(token);
    const {password} = req.body
    if (token) {
        jwt.verify(token, 'secretkey321', async function(error, decodedData) {
            if (error) {
                return res.status(400).json({error: 'Incorrect token or it is expired'})
            }
            const user = await User.findOne({resetLink: token})
            if (!user) {
                return res.status(400).json({error: 'User with this token does not exist'})
            }
            const hashedPassword = await bcrypt.hash(password, 12);

            user.password = hashedPassword
            user.save()
            return res.status(200).json({message: 'Email has been sent, please follow the instructions'})
        // User.findOne({resetLink: token}, async (err, user) => {
        //     if (err || !user) {
        //     return res.status(400).json({error: 'User with this token does not exist'})
        //     }
        //     const hashedPassword = await bcrypt.hash(password, 12);

        //     user.password = hashedPassword
        //     user.save((err, result) => {
        //     if (err) {
        //         return res.status(400).json({error: 'Reset Password Error'})
        //     } else {
        //         return res.status(200).json({message:'Your password has been changed'})
        //     }
        //     })
        // })
        })
    } else {
        return res.status(401).json({error: "Authentication Error"})
    }    
}
