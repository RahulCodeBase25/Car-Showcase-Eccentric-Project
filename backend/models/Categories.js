const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Accessory", "Feature"], required: true }
});

module.exports = mongoose.model("Category", CategorySchema);