const express = require("express");
const router = express.Router();
const Color = require("../models/colors"); // Import Color model

// Create a new Color
router.post("/", async (req, res) => {
  try {
    const color = new Color(req.body);
    await color.save();
    res.status(201).json(color);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Colors
router.get("/", async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
