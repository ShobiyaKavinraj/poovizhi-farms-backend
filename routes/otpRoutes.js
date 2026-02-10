const express = require('express');
const router = express.Router();
const axios = require('axios');

const otpStore = {}; // Simple in-memory store: use Redis or DB for production

// Generate OTP
router.post('/send', async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

  // Store the OTP temporarily
  otpStore[phone] = otp;

  console.log(`Sending OTP ${otp} to ${phone}`);

  try {
    // Send SMS using Fast2SMS or any other provider
    await axios.post('https://www.fast2sms.com/dev/bulkV2', {
      variables_values: otp,
      route: 'otp',
      numbers: phone,
    }, {
      headers: {
        authorization: 'YOUR_FAST2SMS_API_KEY'
      }
    });

    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify', (req, res) => {
  const { phone, otp } = req.body;
  if (otpStore[phone] === otp) {
    delete otpStore[phone]; // Clear OTP after success
    return res.status(200).json({ success: true, message: 'OTP verified' });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

module.exports = router;
