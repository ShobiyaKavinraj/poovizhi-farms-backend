require ('dotenv').config();
const nodemailer = require('nodemailer');

const sendOrderConfirmation = async (order, isStatusUpdate = false) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemsList = order.cartItems
    .map(item => `• ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`)
    .join('<br>');

  const html = `
    <h2>${isStatusUpdate ? 'Order Update' : 'Order Confirmation'} from Poovizhi Farms</h2>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Status:</strong> ${order.status}</p>
    <p><strong>Total:</strong> ₹${order.totalAmount}</p>
    <h3>Shipping Address:</h3>
    <p>
      ${order.shippingAddress.fullName}<br>
      ${order.shippingAddress.house}, ${order.shippingAddress.street},<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode},<br>
      ${order.shippingAddress.country}<br>
      📞 ${order.shippingAddress.phone}
    </p>
    <h3>Items:</h3>
    <p>${itemsList}</p>
  `;

  const mailOptions = {
    from: 'Poovizhi Farms <no-reply@poovizhi.com>',
    to: order.shippingAddress.email,
    subject: isStatusUpdate ? `Order ${order.status} - Poovizhi Farms` : 'Your Order Confirmation',
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent');
  } catch (error) {
    console.error('❌ Email error:', error);
  }
};

module.exports = sendOrderConfirmation;