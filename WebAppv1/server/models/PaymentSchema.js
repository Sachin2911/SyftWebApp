const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    example: 'b422b740-54e0-405f-94fc-f5dd32b55e91'
  },
  date: {
    type: String,
    required: true,
    example: '2021-01-31'
  },
  contact_id: {
    type: String,
    required: true,
    example: '129d0813-b934-401e-a2d5-8a03f65c8143'
  },
  total: {
    type: Number,
    required: true,
    example: 100
  },
  exchange_rate: {
    type: Number,
    required: true,
    example: 1.4
  },
  is_income: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
