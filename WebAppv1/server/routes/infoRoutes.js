const express = require("express")
const { infoElement, infoElementParticular} = require("../controllers/infoControllers")
const requireAuth = require('../middleware/requireAuth')
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');


const router = express.Router()
router.use(requireAuth) //Will fire the middleware function to check for the JWT token

router.get('/alerts', async (req, res) => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db("test");
        
        const alerts = await db.collection('alert').find({}).toArray();
        res.status(200).json(alerts);
        
        client.close();
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});

router.delete('/alerts/:id', async (req, res) => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db("test");
        
        const result = await db.collection('alert').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 1) {
            res.status(200).send({ message: "Successfully deleted" });
        } else {
            throw new Error("Document not found and wasn't deleted.");
        }

        client.close();
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});



router.get('/:element', infoElement)
router.get('/:element/:id', infoElementParticular)

router.post('/alerts', async (req, res) => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db("test");

        // Check if the alert already exists
        const existingAlert = await db.collection('alert').findOne({ productCode: req.body.productCode });
        if (existingAlert) {
            res.status(409).send({ message: "Alert for this product already exists!" });
            client.close();
            return;
        }

        // If not, insert the new alert
        await db.collection('alert').insertOne(req.body);
        res.status(200).send({ message: "Success" });
        client.close();
    } catch (error) {
        console.error(error); // For better error diagnostics
        res.status(500).send({ message: "Server error" });
    }
});



module.exports = router