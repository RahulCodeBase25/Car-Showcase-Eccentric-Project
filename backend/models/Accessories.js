const mongoose = require("mongoose");

const AccessorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },  // 🔹 Use ObjectId
  variant: { type: String, required: true },  // 🔹 Required
  image: { type: String, required: true }  // 🔹 Required
});

module.exports = mongoose.model("Accessory", AccessorySchema);
