const express = require("express");
const router = express.Router();
const Variant = require("../models/variant"); // Import Variant model

// Create a new Variant
router.post("/", async (req, res) => {
  try {
    const variant = new Variant(req.body);
    await variant.save();
    res.status(201).json(variant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Variants
router.get("/", async (req, res) => {
  try {
    const variants = await Variant.find().populate("colors features accessories");
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
