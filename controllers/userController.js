const User = require('../models/User');
const mongoose = require('mongoose');

const getUserData = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Optional: Ensure requesting user is the same as token user
    if (userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getUserData };
