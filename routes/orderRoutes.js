/*const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Orders');
const { sendCustomerEmail, sendOwnerEmail } = require('../utils/sendEmail');
const { sendWhatsappMessage } = require('../utils/sendWhatsapp');
const sendSms = require('../utils/sendSms');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const moment = require('moment');
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      shippingAddress,
      cartItems,
      shippingMethod,
      billingMethod,
      totalAmount
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Missing Razorpay payment details' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const newOrder = new Order({
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

    await newOrder.save();

    // Notifications
    const customerPhone = `+91${shippingAddress.phone}`;
    await sendCustomerEmail(newOrder);
    await sendOwnerEmail(newOrder);
    await sendWhatsappMessage(customerPhone, `🎉 Order Confirmed!\nOrder ID: #${newOrder._id}\nTotal: ₹${totalAmount}`);
    await sendWhatsappMessage('+919944772593', `📦 New Order\nOrder ID: ${newOrder._id}\nCustomer: ${shippingAddress.fullName}`);
    await sendSms(customerPhone, `Your order #${newOrder._id} is confirmed!`);

    res.status(200).json({
      success: true,
      message: 'Order placed and WhatsApp message sent!',
      orderId: newOrder._id
    });

  } catch (error) {
    console.error('❌ Error in /verify-payment:', error);
    res.status(500).json({ success: false, message: 'Server error while placing order.' });
  }
});

// ✅ VERIFY PAYMENT AND PLACE ORDER
// router.post('/verify-payment', async (req, res) => {
//   try {
//     const {
//       razorpayOrderId,
//       razorpayPaymentId,
//       razorpaySignature,
//       shippingAddress,
//       cartItems,
//       shippingMethod,
//       billingMethod,
//       totalAmount
//     } = req.body;

//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//       .digest('hex');

//     if (expectedSignature !== razorpaySignature) {
//       return res.status(400).json({ success: false, message: 'Invalid payment signature' });
//     }

//     // ✅ Save order to DB
//     const newOrder = new Order({
//       shippingAddress,
//       cartItems,
//       shippingMethod,
//       billingMethod,
//       totalAmount,
//       status: 'Processing',
//       paymentInfo: {
//         razorpayOrderId,
//         razorpayPaymentId,
//         razorpaySignature,
//         method: 'Razorpay'
//       }
//     });

//     await newOrder.save();

//     const customerPhone = `+91${shippingAddress.phone}`;

//     // ✅ Send Email to Customer
//     await sendCustomerEmail(newOrder);

//     // ✅ Notify Owner
//     await sendOwnerEmail(newOrder);

//     // ✅ Send WhatsApp
//     await sendWhatsappMessage(
//       customerPhone,
//       `🎉 Order Confirmed!\nOrder ID: #${newOrder._id}\nTotal: ₹${totalAmount}\nThank you for shopping with Poovizhi Farms!`
//     );

//     await sendWhatsappMessage(
//       '+919944772593',
//       `📦 New Order Received\nOrder ID: ${newOrder._id}\nCustomer: ${shippingAddress.fullName}\nTotal: ₹${totalAmount}`
//     );

//     // ✅ Send SMS
//     await sendSms(
//       customerPhone,
//       `Your order #${newOrder._id} has been placed with Poovizhi Farms!`
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Order placed and WhatsApp message sent!',
//       orderId: newOrder._id
//     });

//   } catch (error) {
//     console.error('❌ Error placing order:', error.message);
//     res.status(500).json({ success: false, message: 'Server error while placing order.' });
//   }
// });

// 📦 GET ALL ORDERS
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// 📄 GENERATE INVOICE PDF
router.get('/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).fillColor('#2e7d32').text('Order Invoice', { align: 'center' }).moveDown();
    doc.fontSize(12).fillColor('black')
      .text(`Order ID: ${order._id}`)
      .text(`Date: ${moment(order.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`)
      .text(`Status: ${order.status}`)
      .text(`Payment ID: ${order.paymentInfo?.razorpayPaymentId || 'N/A'}`).moveDown();

    const addr = order.shippingAddress;
    doc.fontSize(14).fillColor('#2e7d32').text('Shipping Address', { underline: true })
      .fontSize(12).fillColor('black')
      .text(`${addr.fullName}`)
      .text(`${addr.house}, ${addr.street}`)
      .text(`${addr.city}, ${addr.state} - ${addr.pincode}`)
      .text(`${addr.country}`)
      .text(`Phone: ${addr.phone}`).moveDown();

    doc.fontSize(14).fillColor('#2e7d32').text('Products', { underline: true }).moveDown(0.5);

    order.cartItems.forEach((item, index) => {
      doc.fontSize(12).fillColor('black')
        .text(`${index + 1}. ${item.name}`)
        .text(`Quantity: ${item.quantity}`)
        .text(`Price: ₹${item.price}`)
        .text(`Total: ₹${item.quantity * item.price}`).moveDown(0.5);
    });

    const total = order.cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);
    doc.moveDown().fontSize(14).fillColor('#2e7d32').text(`Total Paid: ₹${total}`, { align: 'right' });

    doc.moveDown().fontSize(10).fillColor('gray').text('Thank you for your purchase!', { align: 'center' });
    doc.end();
  } catch (err) {
    console.error('❌ Invoice generation error:', err.message);
    res.status(500).json({ message: 'Failed to generate invoice' });
  }
});

module.exports = router;*/


/*const express = require('express');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const crypto = require('crypto');
const Order = require('../models/Orders');


const router = express.Router();

// Utils
const { sendCustomerEmail, sendOwnerEmail } = require('../utils/sendEmail.js');
const { sendWhatsappMessage } = require('../utils/sendWhatsapp.js');
const sendSms = require('../utils/sendSms.js');

// 📦 GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// ✅ VERIFY PAYMENT and PLACE ORDER
router.post('/verify-payment', async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    orderDetails,
  } = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  try {
    // 💾 Save order
    const newOrder = new Order({
      ...orderDetails,
      razorpayOrderId,
      razorpayPaymentId,
      status: 'Paid',
    });

    await newOrder.save();

    // 📧 Email
    await sendCustomerEmail(newOrder);
    await sendOwnerEmail(newOrder);

    // 📲 WhatsApp to customer
    const customerPhone = `+91${newOrder.shippingAddress.phone}`;
    await sendWhatsappMessage(
      customerPhone,
      `🎉 Order Confirmed!\nOrder ID: #${newOrder._id}\nTotal: ₹${newOrder.totalAmount}\nThank you for shopping with Poovizhi Farms!`
    );
    console.log('✅ WhatsApp sent to customer');

    // 📩 SMS to customer
    await sendSms(
      customerPhone,
      `Your order #${newOrder._id} has been placed with Poovizhi Farms!`
    );
    console.log('✅ SMS sent to customer');

    // 📲 WhatsApp to owner
    const ownerPhone = '+919944772593';
    await sendWhatsappMessage(
      ownerPhone,
      `📦 New Order Received\nOrder ID: ${newOrder._id}\nCustomer: ${newOrder.shippingAddress.fullName}\nTotal: ₹${newOrder.totalAmount}`
    );
    console.log('✅ WhatsApp sent to owner');

    res.json({ success: true, message: 'Order placed, email & WhatsApp sent' });

  } catch (err) {
    console.error('❌ Order saving error:', err);
    res.status(500).json({ success: false, message: 'Failed to save order' });
  }
});

// 📄 INVOICE PDF GENERATOR
router.get('/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

    doc.pipe(res);

    doc
      .fontSize(20)
      .fillColor('#2e7d32')
      .text('Order Invoice', { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Order ID: ${order._id}`)
      .text(`Date: ${moment(order.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`)
      .text(`Status: ${order.status}`)
      .text(`Billing Method: ${order.billingMethod || 'N/A'}`)
      .text(`Payment ID: ${order.razorpayPaymentId || 'N/A'}`)
      .moveDown();

    const addr = order.shippingAddress;
    doc
      .fontSize(14)
      .fillColor('#2e7d32')
      .text('Shipping Address', { underline: true })
      .fontSize(12)
      .fillColor('black')
      .text(`${addr.fullName}`)
      .text(`${addr.house}, ${addr.street}`)
      .text(`${addr.city}, ${addr.state} - ${addr.pincode}`)
      .text(`${addr.country}`)
      .text(`Phone: ${addr.phone}`)
      .moveDown();

    doc
      .fontSize(14)
      .fillColor('#2e7d32')
      .text('Products', { underline: true })
      .moveDown(0.5);

    order.cartItems.forEach((item, index) => {
      doc
        .fontSize(12)
        .fillColor('black')
        .text(`${index + 1}. ${item.name}`)
        .text(`Quantity: ${item.quantity}`)
        .text(`Price: ₹${item.price}`)
        .text(`Total: ₹${item.quantity * item.price}`)
        .moveDown(0.5);
    });

    const total = order.cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

    doc
      .moveDown()
      .fontSize(14)
      .fillColor('#2e7d32')
      .text(`Total Paid: ₹${total}`, { align: 'right' });

    doc
      .moveDown()
      .fontSize(10)
      .fillColor('gray')
      .text('Thank you for your purchase!', { align: 'center' });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate invoice' });
  }
});

module.exports = router;

// BASIC ORDER FIRST CREATED
/*const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Orders');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// POST /api/orders/verify-payment — Verify Razorpay payment and save order
router.post('/verify-payment', async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    orderDetails,
  } = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  try {
    const newOrder = new Order({
      ...orderDetails,
      razorpayOrderId,
      razorpayPaymentId,
      status: 'Paid',
    });

    await newOrder.save();
    res.json({ success: true, message: 'Payment verified and order saved' });
  } catch (err) {
    console.error('Order saving error:', err);
    res.status(500).json({ success: false, message: 'Failed to save order' });
  }
});

module.exports = router;*/
// SECOND WITH FINALL CORRECTED ORDER
const express = require('express');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const Order = require('../models/Orders');
const {
  sendCustomerEmail,
  sendOwnerEmail,
  sendStatusUpdateEmail,
} = require('../utils/sendEmail');



const router = express.Router();

// ✅ GET ALL ORDERS (ADMIN)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Fetch orders failed:', err.message);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});
// routes/orders.js or wherever your order routes are
/*router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});*/


// ✅ VERIFY RAZORPAY PAYMENT & CREATE ORDER
router.post('/verify-payment', async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    orderDetails, 
  } = req.body;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const newOrder = new Order({
      ...orderDetails,
      razorpayOrderId,
      razorpayPaymentId,
      status: 'Paid',
    });

    await newOrder.save();
    await sendCustomerEmail(newOrder);  // ✅ send to customer
    await sendOwnerEmail(newOrder);     // ✅ notify admin

    res.status(200).json({ success: true, message: 'Order saved successfully', orderId: newOrder._id });
  } catch (err) {
    console.error('❌ Error saving order:', err.message);
    res.status(500).json({ success: false, message: 'Failed to save order' });
  }
});
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    await sendStatusUpdateEmail(order);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
});


// ✅ GENERATE INVOICE PDF
router.get('/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

    doc.pipe(res);

    doc
      .fontSize(20)
      .fillColor('#2e7d32')
      .text('Order Invoice', { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .fillColor('black')
      .text(`Order ID: ${order._id}`)
      .text(`Date: ${moment(order.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`)
      .text(`Status: ${order.status}`)
      .text(`Billing Method: ${order.billingMethod}`)
      .text(`Payment ID: ${order.razorpayPaymentId || 'N/A'}`)
      .moveDown();

    const addr = order.shippingAddress;
    doc
      .fontSize(14)
      .fillColor('#2e7d32')
      .text('Shipping Address', { underline: true })
      .fontSize(12)
      .fillColor('black')
      .text(`${addr.fullName}`)
      .text(`${addr.house}, ${addr.street}`)
      .text(`${addr.city}, ${addr.state} - ${addr.pincode}`)
      .text(`${addr.country}`)
      .text(`Phone: ${addr.phone}`)
      .moveDown();

    doc
      .fontSize(14)
      .fillColor('#2e7d32')
      .text('Products', { underline: true })
      .moveDown(0.5);

    order.cartItems.forEach((item, index) => {
      doc
        .fontSize(12)
        .fillColor('black')
        .text(`${index + 1}. ${item.name}`)
        .text(`Quantity: ${item.quantity}`)
        .text(`Price: ₹${item.price}`)
        .text(`Total: ₹${item.quantity * item.price}`)
        .moveDown(0.5);
    });

    const total = order.cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

    doc
      .moveDown()
      .fontSize(14)
      .fillColor('#2e7d32')
      .text(`Total Paid: ₹${total}`, { align: 'right' });

    doc
      .moveDown()
      .fontSize(10)
      .fillColor('gray')
      .text('Thank you for your purchase!', { align: 'center' });

    doc.end();
  } catch (err) {
    console.error('❌ Invoice error:', err.message);
    res.status(500).json({ message: 'Failed to generate invoice' });
  }
});

module.exports = router;
