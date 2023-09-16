const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    example: 'b422b740-54e0-405f-94fc-f5dd32b55e91'
  },
  name: {
    type: String,
    required: true,
    example: 'John Doe'
  },
  is_supplier: {
    type: Boolean,
    default: false
  },
  is_customer: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    example: 'john.doe@gmail.com',
    default: null
  },
  phone: {
    type: String,
    example: '0861234567',
    default: null
  }
});

module.exports = mongoose.model('Contact', ContactSchema);
