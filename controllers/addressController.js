const Address = require("../models/addressModel");

// Create a new address
const createAddress = async (req, res) => {
  try {
    const { name, phone, street, apartment, company, postalCode, city, state, country } = req.body;
    const userId = req.userId; 

    const newAddress = new Address({
      name,
      phone,
      street,
      apartment,
      company,
      postalCode,
      city,
      state,
      country,
      user: userId
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (err) {
    res.status(500).json({ message: "Error creating address", error: err.message });
  }
};

// Get all addresses of the user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.userId });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching addresses", error: err.message });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  try {
    const { name, phone, street, apartment, company, postalCode, city, state, country } = req.body;
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { name, phone, street, apartment, company, postalCode, city, state, country },
      { new: true }
    );
    res.status(200).json(updatedAddress);
  } catch (err) {
    res.status(500).json({ message: "Error updating address", error: err.message });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting address", error: err.message });
  }
};

module.exports = { createAddress, getAddresses, updateAddress, deleteAddress };
