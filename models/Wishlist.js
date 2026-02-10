/*const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // product ID
  name: { type: String, required: true },
  imageUrl: { type: String },
  price: { type: Number, required: true },
  selectedVariantIndex: { type: Number, required: true },
  variant: {
    quantity: { type: String },
    price: { type: Number }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WishlistItem', WishlistItemSchema);*/
const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String, required: true },
  name: String,
  imageUrl: String,
  price: Number,
  selectedVariantIndex: Number,
  quantity: String,
});

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);

