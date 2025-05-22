const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  bal: { type: Number, required: true }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = {Customer};