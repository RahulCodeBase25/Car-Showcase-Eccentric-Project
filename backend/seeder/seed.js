const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Model = require("../models/Models");
const Variant = require("../models/Variant");
const Color = require("../models/Colors");
const Category = require("../models/Categories");
const Accessory = require("../models/Accessories");
const Feature = require("../models/Features");

// ✅ Fix: Ensure correct .env file path
dotenv.config({ path: "../.env" });

// ✅ Debugging log
console.log("MONGO_URI from env:", process.env.MONGO_URI);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}

// Call connectDB
connectDB();


const seedDB = async () => {
  try {
    console.log("🧹 Clearing old data...");
    await Model.deleteMany();
    await Variant.deleteMany();
    await Color.deleteMany();
    await Category.deleteMany();
    await Accessory.deleteMany();
    await Feature.deleteMany();

    console.log("🚀 Inserting new data...");

    const models = await Model.insertMany([
      { name: "Tesla Model S", brand: "Tesla" },
      { name: "Ford Mustang", brand: "Ford" },
    ]);

    const variants = await Variant.insertMany([
      { name: "Long Range", model: models[0]._id, price: 79999 },
      { name: "Plaid", model: models[0]._id, price: 99999 },
    ]);

    await Model.updateOne({ _id: models[0]._id }, { variants: variants.map(v => v._id) });

    const colors = await Color.insertMany([
      { name: "Midnight Silver", hexCode: "#333F48", price: 1000, variant: variants[0]._id },
      { name: "Pearl White", hexCode: "#FFFFFF", price: 0, variant: variants[1]._id },
    ]);

    const categories = await Category.insertMany([
      { name: "Interior", type: "Accessory" },
      { name: "Exterior", type: "Feature" },
    ]);

    const accessories = await Accessory.insertMany([
      { name: "All-Weather Floor Mats", category: categories[0]._id, variant: variants[0]._id, image: "default.jpg" },
      { name: "Carbon Fiber Spoiler", category: categories[1]._id, variant: variants[1]._id, image: "default.jpg" },
    ]);

    const features = await Feature.insertMany([
      { name: "Autopilot", type: "Image", url: "autopilot.jpg", category: categories[1]._id, variant: variants[0]._id },
      { name: "Panoramic Roof", type: "Image", url: "roof.jpg", category: categories[1]._id, variant: variants[1]._id },
    ]);

    console.log("🎉 Data Seeded Successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    mongoose.connection.close();
  }
};

connectDB().then(() => seedDB());
