// controllers/cartController.js
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Fetch Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add item to Cart
exports.addItemToCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, variantKey, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, variantKey, quantity }] });
    } else {
      const existingItem = cart.items.find(item => item.productId.toString() === productId && item.variantKey === variantKey);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, variantKey, quantity });
      }
    }
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Remove item from Cart
exports.removeItemFromCart = async (req, res) => {
  const { userId, itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Update item quantity in Cart
exports.updateItemQuantity = async (req, res) => {
  const { userId, itemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.quantity = quantity;
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item quantity' });
  }
};
