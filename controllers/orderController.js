/*const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Orders');

// Create Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createCheckoutOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const options = {
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    res.status(500).json({ error: 'Error creating Razorpay order' });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderDetails } = req.body;

  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isValid = expectedSignature === razorpaySignature;

  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }

  try {
    const newOrder = new Order({
      ...orderDetails,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'Paid',
    });

    await newOrder.save();

    // Optional: Send confirmation email here via nodemailer or 3rd party API

    res.json({ success: true, message: 'Order verified and saved', orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save order after payment' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};*/
const crypto = require('crypto');
const Order = require('../models/Orders');
const sendWhatsappMessage = require('../utils/sendWhatsapp');
const nodemailer = require('nodemailer');
require('dotenv').config();

const verifyAndPlaceOrder = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      shippingAddress,
      cartItems,
      shippingMethod,
      billingMethod,
      totalAmount,
    } = req.body;

    // ✅ Signature Verification
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // ✅ Save order in DB
    const order = await Order.create({
      shippingAddress,
      cartItems,
      shippingMethod,
      billingMethod,
      totalAmount,
      status: 'Processing',
      paymentInfo: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        method: 'Razorpay'
      }
    });

    // ✅ Send WhatsApp to customer
    await sendWhatsappMessage(`+91${shippingAddress.phone}`, `✅ Hi ${shippingAddress.fullName}, your order #${order._id} of ₹${totalAmount} has been placed.`);

    // ✅ Notify admin
    await sendWhatsappMessage('+919944772593', `📦 New Order #${order._id}\nName: ${shippingAddress.fullName}\nTotal: ₹${totalAmount}`);

    // ✅ Send email to customer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Poovizhi Farms" <${process.env.EMAIL_USER}>`,
      to: shippingAddress.email,
      subject: `✅ Order Confirmation - #${order._id}`,
      html: `
        <h3>Thank you for your order!</h3>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total:</strong> ₹${order.totalAmount}</p>
        <p>We’ll notify you when your order is out for delivery.</p>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Order placed and WhatsApp message sent!',
      orderId: order._id
    });

  } catch (error) {
    console.error('❌ Order Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while placing order.' });
  }
};

module.exports = { verifyAndPlaceOrder };
