/*require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require('./routes/wishlist');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkout');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], // frontend origin
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);


app.get("/", (req, res) => res.send("🌿 Poovizhi Farms API is running."));

connectDB(); 


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});*/

// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require('./routes/wishlist');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkout');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes=require('./routes/contact')
// const testRoutes = require('./routes/testRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware Setup
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

app.use(cookieParser()); // ✅ Parses cookies sent by client
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Morgan logging only in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // Logs incoming requests
}

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/contact",contactRoutes);
// app.use('/api/test', testRoutes);


// ✅ Health check
app.get("/", (req, res) => res.send("🌿 Poovizhi Farms API is running."));

// ✅ Connect DB and Start Server
connectDB();


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
