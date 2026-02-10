const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken');
const User = require('../models/User'); // Adjust path as needed

// GET /api/user/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the JWT payload includes user ID as 'id'
    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
    // res.json({ email: user.email });
  } catch (err) {
    console.error('Error in /me route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
