const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: String,
  apartment: String,
  company: String,
  postalCode: String,
  city: String,
  state: String,
  country: String,
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
