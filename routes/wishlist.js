const express = require('express');
const router = express.Router();
const WishlistItem = require('../models/Wishlist');
const authMiddleware=require('../Middleware/authMiddleware');
// GET: all wishlist items
router.get('/', async (req, res) => {
  try {
    const items = await WishlistItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wishlist', error: err });
  }
});

// POST: add item to wishlist
/*router.post('/', async (req, res) => {
  const item = req.body;

  try {
    const exists = await WishlistItem.findOne({
      _id: item._id,
      selectedVariantIndex: item.selectedVariantIndex
    });

    if (exists) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    const newItem = new WishlistItem(item);
    await newItem.save();
    res.status(201).json({ message: 'Added to wishlist', item: newItem });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to wishlist', error: err });
  }
});*/
/*router.post('/', async (req, res) => {
  const item = req.body;

  try {
    const exists = await WishlistItem.findOne({
      productId: item.productId,
      selectedVariantIndex: item.selectedVariantIndex
    });

    if (exists) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    const newItem = new WishlistItem(item);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    res.status(500).json({ message: 'Error adding to wishlist', error: err });
  }
});*/
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, name, imageUrl, price, selectedVariantIndex, quantity } = req.body;

    const exists = await WishlistItem.findOne({
      user: req.user.id,
      productId,
      selectedVariantIndex
    });

    if (exists) {
      return res.status(200).json({
        alreadyExists: true,
        item: exists
      });
    }

    const newItem = new WishlistItem({
      user: req.user.id,
      productId,
      name,
      imageUrl,
      price,
      selectedVariantIndex,
      quantity,
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      alreadyExists: false,
      item: savedItem
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { productId, name, imageUrl, price, selectedVariantIndex, quantity } = req.body;

//     // Optional: check if item already exists
//     const exists = await WishlistItem.findOne({
//       user: req.user.id,
//       productId,
//       selectedVariantIndex
//     });

//     if (exists) {
//       return res.status(409).json({ message: 'Item already in wishlist' });
//     }

//     const newItem = new WishlistItem({
//       user: req.user.id,
//       productId,
//       name,
//       imageUrl,
//       price,
//       selectedVariantIndex,
//       quantity,
//     });

//     const savedItem = await newItem.save();
//     res.status(201).json({ item: savedItem });
//   } catch (error) {
//     console.error('Error adding to wishlist:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// });
// DELETE: remove item
// router.delete('/:id/:variantIndex', async (req, res) => {
//   const { id, variantIndex } = req.params;

//   try {
//     await WishlistItem.deleteOne({
//       _id: id,
//       selectedVariantIndex: parseInt(variantIndex)
//     });

//     res.json({ message: 'Removed from wishlist' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error removing from wishlist', error: err });
//   }
// });
router.delete('/:productId/:variantIndex', authMiddleware, async (req, res) => {
  const { productId, variantIndex } = req.params;

  try {
    await WishlistItem.deleteOne({
      productId,
      selectedVariantIndex: parseInt(variantIndex),
      user: req.user.id
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    res.status(500).json({ message: 'Error removing from wishlist', error: err });
  }
});



module.exports = router;
