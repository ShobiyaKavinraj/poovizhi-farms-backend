const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Import the model

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields (name, email, message) are required.',
    });
  }

  try {
    // Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Message saved successfully. We will get back to you soon!',
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
});

module.exports = router;
