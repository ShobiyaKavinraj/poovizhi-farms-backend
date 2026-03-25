const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/', async (req, res) => {
  try {node 
    const { totalAmount } = req.body;

    if (!totalAmount || totalAmount < 1) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const options = {
      amount: totalAmount * 100, // convert to paise
      currency: 'INR',
      receipt: 'receipt_order_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

module.exports = router;
