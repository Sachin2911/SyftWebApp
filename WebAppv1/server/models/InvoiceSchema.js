const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    example: 'b422b740-54e0-405f-94fc-f5dd32b55e91'
  },
  issue_date: {
    type: String,
    required: true,
    example: '2021-01-31'
  },
  due_date: {
    type: String,
    required: true,
    example: '2021-01-31'
  },
  paid_date: {
    type: String,
    default: null,
    example: '2021-01-31'
  },
  paid: {
    type: Boolean,
    default: false
  },
  contact_id: {
    type: String,
    required: true,
    example: '8e81fbc4-4f33-4ae9-bf5e-a2415372e77b'
  },
  total: {
    type: Number,
    required: true,
    example: 100
  },
  amount_due: {
    type: Number,
    required: true,
    example: 100
  },
  exchange_rate: {
    type: Number,
    required: true,
    example: 1.4
  },
  currency: {
    type: String,
    required: true,
    example: 'ZAR'
  },
  is_sale: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
