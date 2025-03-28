const express = require("express");
const router = express.Router();
const Accessory = require("../models/accessories"); // Import Accessory model

// Create a new Accessory
router.post("/", async (req, res) => {
  try {
    const accessory = new Accessory(req.body);
    await accessory.save();
    res.status(201).json(accessory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Accessories
router.get("/", async (req, res) => {
  try {
    const accessories = await Accessory.find();
    res.json(accessories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
