const mongoose = require("mongoose");

const AccessorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  variant: { type: mongoose.Schema.Types.ObjectId, ref: "Variant", required: true },
  image: { type: String, required: true }
});

module.exports = mongoose.model("Accessory", AccessorySchema);