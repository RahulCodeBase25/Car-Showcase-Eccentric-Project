const mongoose = require("mongoose");

// A saved configuration. The price is stored as it was quoted, so a shared
// link keeps showing the same numbers even if the catalog changes later.
const buildSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    trim: { type: String, required: true },
    color: { type: String, required: true },
    wheels: { type: String, required: true },
    packages: { type: [String], default: [] },
    quote: { type: Object, required: true },
  },
  { versionKey: false, timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Build", buildSchema);
