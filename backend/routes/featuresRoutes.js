const express = require("express");
const router = express.Router();
const Feature = require("../models/features"); // Import Feature model

// Create a new Feature
router.post("/", async (req, res) => {
  try {
    const feature = new Feature(req.body);
    await feature.save();
    res.status(201).json(feature);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Features
router.get("/", async (req, res) => {
  try {
    const features = await Feature.find();
    res.json(features);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
