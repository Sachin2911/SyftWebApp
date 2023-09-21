require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")


const Contact = require('./models/ContactSchema');  // Replace with the path to your ContactSchema file
const dataRoutes = require('./routes/dataRoutes')
const infoRoutes = require('./routes/infoRoutes')
const userRoutes = require('./routes/userRoutes')

/* CONFIGURATIONS */
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

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
//auth routes
app.use('/user', userRoutes)


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(
    ()=>{
        // Listen for requests
        app.listen(process.env.PORT, ()=>{
            console.log("Listening on 4000")
        })
    }
).catch((error)=>{console.log(error)})
