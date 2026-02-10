/*const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Orders');
const router = express.Router();

router.post('/verify-payment', async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    orderDetails,
  } = req.body;

  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature ||
    !orderDetails ||
    !orderDetails.shippingAddress
  ) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const newOrder = new Order({
      shippingAddress: orderDetails.shippingAddress,  // ✅ send full object
      cartItems: orderDetails.products || [],
      shippingMethod: orderDetails.shippingMethod || 'Standard',
      billingMethod: orderDetails.billingMethod || 'Online',
      razorpayOrderId,
      razorpayPaymentId,
      status: 'Paid',
    });

    await newOrder.save();

    res.status(200).json({ success: true, message: '✅ Payment verified and order saved' });

  } catch (err) {
    console.error('🔥 Order Save Error:', err.message);
    res.status(500).json({ success: false, message: 'Order save failed', error: err.message });
  }
});

module.exports = router;*/


const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Orders');
const router = express.Router();

// POST /api/payment/verify-payment — Verify Razorpay payment or Save COD order
router.post('/verify-payment', async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    orderDetails,
  } = req.body;

  if (!orderDetails || !orderDetails.shippingAddress) {
    return res.status(400).json({ success: false, message: 'Missing shipping address' });
  }

  try {
    // If it's not a COD order, verify signature
    if (orderDetails.billingMethod !== 'COD') {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ success: false, message: 'Invalid Razorpay signature' });
      }
    }

    /*const newOrder = new Order({
      shippingAddress: orderDetails.shippingAddress,
      cartItems: orderDetails.products || [],
      shippingMethod: orderDetails.shippingMethod || 'Standard',
      billingMethod: orderDetails.billingMethod || 'Online',
      razorpayOrderId,
      razorpayPaymentId,
      status: orderDetails.billingMethod === 'COD' ? 'Pending' : 'Paid',
    });*/
    const newOrder = new Order({
  shippingAddress: orderDetails.shippingAddress,
  cartItems: (orderDetails.products || []).map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || item.imageUrl || '/placeholder.jpg', // Add this
  })),
  shippingMethod: orderDetails.shippingMethod || 'Standard',
  billingMethod: orderDetails.billingMethod || 'Online',
  razorpayOrderId,
  razorpayPaymentId,
  status: orderDetails.billingMethod === 'COD' ? 'Pending' : 'Paid',
});


    await newOrder.save();

    res.status(200).json({ success: true, message: '✅ Order saved successfully!' });
  } catch (err) {
    console.error('🔥 Order Save Error:', err.message);
    res.status(500).json({ success: false, message: 'Order save failed', error: err.message });
  }
});

module.exports = router;

