const mongoose = require("mongoose");
const FeatureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Image", "Video"], required: true },
  url: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  variant: { type: mongoose.Schema.Types.ObjectId, ref: "Variant", required: true }
});

module.exports = mongoose.model("Feature", FeatureSchema);