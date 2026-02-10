const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  searchProducts,
} = require("../controllers/productController");

router.get("/", getAllProducts);             // GET /api/products
router.get("/search", searchProducts);       // GET /api/products/search?q=
router.get("/:id", getProductById);          // GET /api/products/:id

module.exports = router;
/*const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Search products by name
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || '';
    console.log("🔍 Searching for:", query);

    const products = await Product.find({
      name: { $regex: query, $options: 'i' }, // case-insensitive
    });

    res.json(products);
  } catch (err) {
    console.error("❌ Search route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;*/
