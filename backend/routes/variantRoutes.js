// backend/routes/variantRoutes.js
const express = require("express");
const router = express.Router();
const Variant = require("../models/variantModel");

// Get all variants
router.get("/", async (req, res) => {
  try {
    const variants = await Variant.find({}).populate("colors features accessories");
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single variant by ID
router.get("/:id", async (req, res) => {
  try {
    const variant = await Variant.findById(req.params.id).populate("colors features accessories");
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }
    res.json(variant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;