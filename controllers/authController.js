const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Optional: Basic password length check
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token in response
    res.status(201).json({
      message: "User created successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed. Please try again later." });
  }
};

/*exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error. Please try again later." });
  }
};*/
exports.login = async (req, res) => {
  let { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    email = email.toLowerCase(); // Normalize email

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error. Please try again later." });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1️⃣ Generate token and hash
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // 2️⃣ Save to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // 3️⃣ Create reset link
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
    

    // 4️⃣ Send email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another SMTP service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click this link to reset your password:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>This link will expire in 1 hour.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to email" });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // 1️⃣ Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2️⃣ Find matching user and check token expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired" });
    }

    // 3️⃣ Validate password strength (optional)
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // 4️⃣ Set the new password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Could not reset password" });
  }
};
