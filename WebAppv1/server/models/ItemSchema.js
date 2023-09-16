const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    example: 'b422b740-54e0-405f-94fc-f5dd32b55e91'
  },
  name: {
    type: String,
    required: true,
    example: 'Baked Cake'
  },
  code: {
    type: String,
    required: true,
    example: 'TIN001'
  },
  quantity_on_hand: {
    type: Number,
    required: true,
    min: 0,
    example: 100
  },
  purchase_unit_price: {
    type: Number,
    required: true,
    example: 100
  },
  sale_unit_price: {
    type: Number,
    required: true,
    example: 100
  }
});

module.exports = mongoose.model('Item', ItemSchema);
