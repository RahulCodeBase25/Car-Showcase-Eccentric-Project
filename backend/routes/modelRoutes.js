const express = require("express");
const router = express.Router();
const Model = require("../models/models"); // Import model here

// Create a new Model
router.post("/", async (req, res) => {
  try {
    const model = new Model(req.body);
    await model.save();
    res.status(201).json(model);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Models
router.get("/", async (req, res) => {
  try {
    const models = await Model.find().populate("variants");
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
