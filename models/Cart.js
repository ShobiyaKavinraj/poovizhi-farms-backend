
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  product: {
    _id: { type: String, required: true },
    name: String,
    price: Number,
    imageUrl: String,
    variants: Array,
    selectedVariantIndex: Number
  },
  quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('CartItem', CartItemSchema);
