const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    media: { type: { type: String, enum: ["image", "video"] }, src: String, poster: String },
    order: { type: Number, default: 0 },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Package", packageSchema);
