const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') 


const app = express()
const port = 4000

app.use(cors)
app.use(express.json())

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
        status: err.status
        message = err.message
    })
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
