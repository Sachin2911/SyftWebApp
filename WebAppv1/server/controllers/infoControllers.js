const Contact = require('../models/ContactSchema')
const Invoice = require('../models/InvoiceSchema')
const axios = require('axios');
const Item = require('../models/ItemSchema')
const Payment = require('../models/PaymentSchema')
const mongoose = require("mongoose")

const schemaDict = {
    'contacts':Contact,
    'invoice':Invoice,
    'item':Item,
    'payment':Payment
  }

const infoElement = async (req, res) =>{
  const {element} = req.params
  try{
  const output = await schemaDict[element].find({})
  console.log(`${element} has been received`);
  res.status(200).json(output)
  
  }catch(error){
    console.log('An error occurred:', error);
    res.status(500).send("An error occured");
  }
}

const infoElementParticular = async (req, res) => {
  const { element, id } = req.params;
  try {
    const output = await schemaDict[element].findOne({ id: id }); // Using findOne to search by custom 'id'
    if (!output) {
      return res.status(404).json({ error: "No such Element" });
    }
    res.status(200).json(output);
  } catch (error) {
    console.log('An error occurred:', error);
    res.status(500).json({ error: "An error occurred while fetching the data" });
  }
};

module.exports = {
  infoElement,
  infoElementParticular
};
  