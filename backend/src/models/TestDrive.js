const mongoose = require("mongoose");

const testDriveSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    model: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD, showroom local date
    slot: { type: String, required: true }, // HH:MM
    car: { type: Number, required: true, min: 1 }, // which demo car in that slot
    buildCode: String,
  },
  { versionKey: false, timestamps: { createdAt: true, updatedAt: false } }
);

// Each demo car can only be booked once per slot. Two people racing for the
// last car both try car 1, then car 2: the database lets exactly one win.
testDriveSchema.index({ location: 1, date: 1, slot: 1, car: 1 }, { unique: true });
// One test drive per person per day
testDriveSchema.index({ email: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("TestDrive", testDriveSchema);
