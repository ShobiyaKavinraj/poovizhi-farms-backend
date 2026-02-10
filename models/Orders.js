/*const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    house: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    addressType: { type: String, default: 'Home' },
  },
  cartItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
    },
  ],
  shippingMethod: { type: String, default: 'Standard' },
  billingMethod: {
    type: String,
    enum: ['COD', 'Online'],
    required: true,
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);*/
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    house: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    addressType: { type: String, default: 'Home' },
  },
  cartItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
    },
    
  ],
  totalAmount: { type: Number, required: true },
  
  shippingMethod: { type: String, default: 'Standard' },
  billingMethod: {
    type: String,
    enum: ['COD', 'Online'],
    required: true,
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  // paymentInfo: {
  //   razorpayOrderId: String,
  //   razorpayPaymentId: String,
  //   razorpaySignature: String,
  //   method: String,
  // },
  // totalAmount: { type: Number },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);

