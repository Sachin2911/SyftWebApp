const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  productCode: {
    type: String,
    required: true,
    unique: true,
  },
  threshold: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Alert', AlertSchema);
