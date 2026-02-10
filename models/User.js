const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantKey: { type: String, default: "default" }
}, { _id: false });

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  variantKey: { type: String, default: "default" }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  password: { type: String, required: true, minlength: 6 },

  
  phone: { type: String },
  profileImage: { type: String },
  
  addresses: [addressSchema],
  wishlist: [wishlistItemSchema],
  cart: [cartItemSchema],

  // Order history (could be referenced or embedded)
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  // Password reset support
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },

  

  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

