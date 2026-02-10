require('dotenv').config();
const twilio = require('twilio');

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send SMS using Twilio
 * @param {string} to - E.g. +91XXXXXXXXXX
 * @param {string} body - The SMS message content
 */
const sendSms = async (to, body) => {
  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_PHONE, // Your Twilio SMS number (e.g., +1315xxxxxxx)
      to,
      body,
    });
    console.log(`✅ SMS sent: ${message.sid}`);
  } catch (error) {
    console.error(`❌ SMS failed: ${error.message}`);
  }
};

module.exports = sendSms;
