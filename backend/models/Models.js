const mongoose = require("mongoose");
const ModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String },
  variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }]
});

module.exports = mongoose.model("Model", ModelSchema);