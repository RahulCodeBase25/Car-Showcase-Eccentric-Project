const mongoose = require("mongoose");
const VariantSchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: "Model", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  colors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }],
  accessories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accessory" }],
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }]
});

module.exports = mongoose.model("Variant", VariantSchema);
