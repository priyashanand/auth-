const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const createError = require('../utils/appError')
const bcrypt = require('bcrypt')
const uuid = require('uuid')

let uniqueId = 1
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();


const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Redirect URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

// Function to get a new access token
// async function getNewAccessToken() {
//     try {
//         const { token } = await oauth2Client.getAccessToken();
//         return token;
//     } catch (error) {
//         console.error('Error refreshing access token:', error.message);
//         throw new Error('Could not refresh access token');
//     }
// }



// const createTransporter = async () => {
//     const accessToken = await getNewAccessToken();

//     return nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: true,
//         auth: {
//             type: 'OAuth2',
//             user: process.env.USER_EMAIL,
//             clientId: process.env.CLIENT_ID,
//             clientSecret: process.env.CLIENT_SECRET,
//             refreshToken: process.env.REFRESH_TOKEN,
//             accessToken, // Use refreshed access token
//         },
//     });
// };


exports.signup = async (req, res, next) => {
    try{
        const user = await User.findOne({email:  req.body.email })

        if (user){
            return next(new createError('User already exists', 400))
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        const apikey = uuid.v4()

        const newUser = await User.create({
            ...req.body,
            // uid: uniqueId,
            uuid: apikey,
            password: hashedPassword,
            verified: false // New users are unverified by default
        });

        // Send verification email
        // const transporter = await createTransporter();
        // transporter.verify((error, success)=>{
        //     if(error){
        //         console.log(error)
        //     }
        //     else{
        //         console.log("message ready to be sent")
        //         console.log(success)
        //     }
        // })

        const verificationLink = `http://localhost:4001/verify?uuid=${newUser.uuid}`;
        // await transporter.sendMail({
        //     from: process.env.EMAIL_USER,
        //     to: newUser.email,
        //     subject: 'Email Verification',
        //     text: `Please verify your email by clicking the following link: ${verificationLink}`,
        // });

        const token = jwt.sign({ _id: newUser._id , verified: newUser.verified}, 'secretkey123', {
            expiresIn: '1d',
        })

        res.status(201).json({
            status: 'success',
            message: 'User registered sucessfully',
            token,
            user:{
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                mobileNUmber: newUser.mobileNumber,
                avatar: newUser.avatar,
                uuid: newUser.uuid,
                // uid: newUser.uid
            }
        })

    } catch(error){
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) return next(new createError('User not found', 404));
        
        const isPasswordValid = bcrypt.compare(password, user.password)

        if(!isPasswordValid) return next(new createError('Incorrect password', 401));

        const token = jwt.sign({_id: user._id}, 'secretkey123',{
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