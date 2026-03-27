const express = require('express');
const router = express.Router();
const Address = require('../models/addressModel');
const authenticate = require('../Middleware/authMiddleware');

// GET all addresses
router.get('/', authenticate, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    res.json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching addresses' });
  }
});

// POST new address
router.post('/', authenticate, async (req, res) => {
  try {
    const address = new Address({ ...req.body, userId: req.user._id });
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while saving address' });
  }
});

// PUT update address
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Address not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating address' });
  }
});

// DELETE address
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting address' });
  }
});

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const Address = require('../models/addressModel');
// const authenticate = require('../Middleware/authMiddleware'); // Token check middleware

// // GET all addresses for the logged-in user
// router.get('/', authenticate, async (req, res) => {
//   try {
//     const addresses = await Address.find({ userId: req.user._id });
//     res.json(addresses);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error while fetching addresses' });
//   }
// });

// // POST new address
// router.post('/', authenticate, async (req, res) => {
//   try {
//     const address = new Address({ ...req.body, userId: req.user._id });
//     await address.save();
//     res.status(201).json(address);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error while saving address' });
//   }
// });

// // PUT update address
// router.put('/:id', authenticate, async (req, res) => {
//   try {
//     const updated = await Address.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user._id },
//       req.body,
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error while updating address' });
//   }
// });

// // DELETE address
// router.delete('/:id', authenticate, async (req, res) => {
//   try {
//     await Address.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
//     res.json({ message: 'Address deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error while deleting address' });
//   }
// });

// module.exports = router;
