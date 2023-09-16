const Contact = require('../models/ContactSchema')
const Invoice = require('../models/InvoiceSchema')
const axios = require('axios');
const Item = require('../models/ItemSchema')
const Payment = require('../models/PaymentSchema')
const mongoose = require("mongoose")

// Dictionary to map elements with their Schema
const schemaDict = {
  'contacts':Contact,
  'invoice':Invoice,
  'item':Item,
  'payment':Payment
}


const dataPullAll = async (req, res) => {
  try {
    const elements = ["contacts", "item", "invoice", "payment"];
    for (const element of elements) {
      await dataPullElementUtility(element);
    }
    res.status(200).send(`All have been updated`);
  } catch (error) {
    console.log("An error occurred:", error);
    res.status(500).send(`An error occurred ${error}`);
  }
};

const dataPullElementUtility = async (element) => {
  try {
    const response = await axios.get(`https://hackathon.syftanalytics.com/api/${element}`,
      { headers: { 'x-api-key': process.env.API_KEY } });
    const output = response.data.data;
  
    await Promise.all(output.map(async (output) => {
      await schemaDict[element].findOneAndUpdate(
        { id: output.id },
        output,
        { upsert: true, new: true, runValidators: true }
      );
    }));
  
    console.log(`${element} updated or inserted to MongoDB`);
  } catch (error) {
    console.log('An error occurred:', error);
    throw error;
  }
};

const dataPullElement = async (req, res) => {
  const { element } = req.params;
  try {
    await dataPullElementUtility(element);
    res.status(200).send(`${element} have been updated`);
  } catch (error) {
    console.log('An error occurred:', error);
    res.status(500).send(`An error occurred ${error}`);
  }
};

module.exports = {
  dataPullAll,
  dataPullElement
};
