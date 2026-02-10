require('dotenv').config();
const twilio = require('twilio');

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send WhatsApp message via Twilio Sandbox
 * @param {string} to - E.g. +91xxxxxxxxxx
 * @param {string} body - The WhatsApp message content
 */
const sendWhatsappMessage = async (to, body) => {
  try {
    const message = await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio Sandbox WhatsApp number
      to: `whatsapp:${to}`,
      body: body,
    });
    console.log(`✅ WhatsApp message sent: ${message.sid}`);
  } catch (error) {
    console.error(`❌ WhatsApp failed: ${error.message}`);
  }
};

module.exports = { sendWhatsappMessage };
