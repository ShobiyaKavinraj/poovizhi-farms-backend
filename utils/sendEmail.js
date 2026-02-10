require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Order Confirmation to Customer
const sendCustomerEmail = async (order) => {
  const itemsList = order.cartItems
    .map(item => `• ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`)
    .join('<br>');

  const html = `
    <h3>Thank you for your order from Poovizhi Farms!</h3>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Status:</strong> ${order.status}</p>
    <p><strong>Total:</strong> ₹${order.totalAmount}</p>
    <h4>Items:</h4>
    <p>${itemsList}</p>
    <h4>Shipping Address:</h4>
    <p>
      ${order.shippingAddress.fullName}<br>
      ${order.shippingAddress.house}, ${order.shippingAddress.street},<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode},<br>
      ${order.shippingAddress.country}<br>
      📞 ${order.shippingAddress.phone}
    </p>
    <p>We’ll notify you once your order is out for delivery.</p>
  `;

  await transporter.sendMail({
    from: `"Poovizhi Farms" <${process.env.EMAIL_USER}>`,
    to: order.shippingAddress.email,
    subject: `✅ Order Confirmation - #${order._id}`,
    html,
  });
};

// 2. Admin Notification
const sendOwnerEmail = async (order) => {
  await transporter.sendMail({
    from: `"Poovizhi Farms" <${process.env.EMAIL_USER}>`,
    to: 'sofiyakavinraj@gmail.com', // Admin email
    subject: `🛒 New Order Received - #${order._id}`,
    html: `
      <h3>New Order Received</h3>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total:</strong> ₹${order.totalAmount}</p>
      <p><strong>Customer:</strong> ${order.shippingAddress.fullName}</p>
    `,
  });
};

// 3. Status Update to Customer
const sendStatusUpdateEmail = async (order) => {
  await transporter.sendMail({
    from: `"Poovizhi Farms" <${process.env.EMAIL_USER}>`,
    to: order.shippingAddress.email,
    subject: `📦 Order Update - #${order._id} is now ${order.status}`,
    html: `
      <p>Hi ${order.shippingAddress.fullName},</p>
      <p>Your order status has been updated to: <strong>${order.status}</strong></p>
      <p>We’ll keep you updated with the next steps.</p>
    `,
  });
};

// 4. Delivery Confirmation
const sendDeliveryEmail = async (order) => {
  await transporter.sendMail({
    from: `"Poovizhi Farms" <${process.env.EMAIL_USER}>`,
    to: order.shippingAddress.email,
    subject: `📬 Your Order #${order._id} Has Been Delivered!`,
    html: `
      <p>Dear ${order.shippingAddress.fullName},</p>
      <p>We're happy to let you know that your order has been successfully delivered.</p>
      <p>Thank you for shopping with Poovizhi Farms!</p>
    `,
  });
};

module.exports = {
  sendCustomerEmail,
  sendOwnerEmail,
  sendStatusUpdateEmail,
  sendDeliveryEmail,
};
