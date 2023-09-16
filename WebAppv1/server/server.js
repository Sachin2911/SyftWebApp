require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const Contact = require('./models/ContactSchema');  // Replace with the path to your ContactSchema file
const dataRoutes = require('./routes/dataRoutes')
const infoRoutes = require('./routes/infoRoutes')

const app = express();

// Middleware to log out requests
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
// These routes are for getting the info from the Syft API and storing on Mongo
app.use('/data',dataRoutes)
// Routes for getting info from Mongo
app.use('/info',infoRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(
    ()=>{
        // Listen for requests
        app.listen(process.env.PORT, ()=>{
            console.log("Listening on 4000")
        })
    }
).catch((error)=>{console.log(error)})
