// controllers/wishlistController.js
const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id });
    res.json({ wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId, variantKey } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    let wishlistItem = await Wishlist.findOne({ user: req.user._id, productId, variantKey });

    if (wishlistItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    wishlistItem = new Wishlist({
      user: req.user._id,
      productId,
      variantKey,
    });

    await wishlistItem.save();

    const wishlist = await Wishlist.find({ user: req.user._id });
    res.json({ wishlist });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId, variantKey } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    await Wishlist.findOneAndDelete({ user: req.user._id, productId, variantKey });

    const wishlist = await Wishlist.find({ user: req.user._id });
    res.json({ wishlist });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
};
