const express = require('express');
const router = express.Router();
const CartItem = require('../models/Cart');
const authMiddleware = require('../Middleware/authMiddleware');

router.use(authMiddleware);

// 🔍 Get Cart Items
router.get('/', async (req, res) => {
  try {
    const cart = await CartItem.find({ userId: req.user._id });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// ➕ Add Item to Cart
router.post('/', async (req, res) => {
  try {
    const { _id, name, price, quantity, imageUrl, variants, selectedVariantIndex } = req.body;

    let item = await CartItem.findOne({ userId: req.user._id, 'product._id': _id });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = new CartItem({
        userId: req.user._id,
        product: { _id, name, price, imageUrl, variants, selectedVariantIndex },
        quantity,
      });
      await item.save();
    }

    const cart = await CartItem.find({ userId: req.user._id });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// ✏️ Update Quantity
router.put('/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;

    await CartItem.findOneAndUpdate(
      { userId: req.user._id, 'product._id': req.params.itemId },
      { quantity }
    );

    const cart = await CartItem.find({ userId: req.user._id });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// ❌ Remove Item
router.delete('/:itemId', async (req, res) => {
  try {
    await CartItem.findOneAndDelete({
      userId: req.user._id,
      'product._id': req.params.itemId,
    });

    const cart = await CartItem.find({ userId: req.user._id });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

/*const express = require('express');
const router = express.Router();
const CartItem = require('../models/Cart'); // Assuming you have a CartItem mongoose model

// Get cart by userId
router.get('/:userId', async (req, res) => {
  try {
    const cart = await CartItem.find({ userId: req.params.userId });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Add item to cart
router.post('/:userId', async (req, res) => {
  try {
    const { _id, name, price, quantity, imageUrl, variants, selectedVariantIndex } = req.body;

    let item = await CartItem.findOne({ userId: req.params.userId, 'product._id': _id });
    
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = new CartItem({
        userId: req.params.userId,
        product: { _id, name, price, imageUrl, variants, selectedVariantIndex },
        quantity
      });
      await item.save();
    }

    const cart = await CartItem.find({ userId: req.params.userId });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update quantity
router.put('/:userId/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    await CartItem.findOneAndUpdate(
      { userId: req.params.userId, 'product._id': req.params.itemId },
      { quantity }
    );
    const cart = await CartItem.find({ userId: req.params.userId });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Remove item
router.delete('/:userId/:itemId', async (req, res) => {
  try {
    await CartItem.findOneAndDelete({ userId: req.params.userId, 'product._id': req.params.itemId });
    const cart = await CartItem.find({ userId: req.params.userId });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;*/
