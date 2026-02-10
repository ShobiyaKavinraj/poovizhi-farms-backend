const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  _id: Number,
  name: { type: String, required: true },  
  description: String,
  imageUrl: String,
  price: Number,
  quantity: String,
  variants: [
    {
      quantity: String,
      price: Number,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

