const mongoose = require("mongoose");

const option = { _id: false, id: { type: String, required: true }, name: { type: String, required: true }, price: { type: Number, default: 0, min: 0 } };

const carModelSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    body: { type: String, enum: ["hatch", "suv", "coupe"], required: true },
    tagline: String,
    description: String,
    basePrice: { type: Number, required: true, min: 0 },
    order: { type: Number, default: 0 },
    specs: { rangeKm: Number, zeroTo100: Number, topSpeed: Number, seats: Number, chargeMin: Number },
    trims: [new mongoose.Schema({ ...option, specs: { type: Object, default: {} }, includes: { type: [String], default: [] } }, { _id: false, minimize: false })],
    colors: [new mongoose.Schema({ ...option, hex: { type: String, required: true } }, { _id: false })],
    wheels: [new mongoose.Schema({ ...option, style: String, finish: String }, { _id: false })],
  },
  { versionKey: false, minimize: false }
);

module.exports = mongoose.model("CarModel", carModelSchema);
