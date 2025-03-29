const mongoose = require("mongoose");
const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hexCode: { type: String, required: true },
  price: { type: Number, required: true },
  variant: { type: mongoose.Schema.Types.ObjectId, ref: "Variant", required: true }
});

module.exports = mongoose.model("Color", ColorSchema);