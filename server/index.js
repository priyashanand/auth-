const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') 
const authRouter = require('./routes/authRoute')
const jwt = require('jsonwebtoken');

const app = express()
const port = 4001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)

// yaha pr data ka middleware dalna hai

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');
//   console.log(token)
  
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

// Apply to routes
app.use('/api', authenticateJWT, authRouter);


app.get('/', (req,res)=>{
    res.send('<h1>This is my server home</h1>')
})

mongoose
    .connect('mongodb://127.0.0.1:27017/authentication')
    .then(()=> console.log('Connected to mongodb'))
    .catch((error)=>console.error('Failed to connect : ', error))

app.use((err, req, res, next)=>{
    err.statuCode = err.statuCode || 500
    err.status = err.status || 'error'

    res.status(err.statuCode).json({
        status: err.status,
        message : err.message
    })
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
