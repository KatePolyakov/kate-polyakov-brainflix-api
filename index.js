const express = require('express');
const cors = require('cors');
const app = express();
const videoRouter = require('./routes/video');

//importing and configuring dotenv once.
require('dotenv').config();

// process.env contains the .env variables
const PORT = process.env.PORT || 8080;

// CORS middleware to allow requests from any origin (any other server)
app.use(cors());

// Use JSON middleware so that I can use req.body
app.use(express.json());

// A miidleware that allows us to serve static files
app.use(express.static('./public'));


// Router-middleware
app.use('/videos', videoRouter);


app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`)
})