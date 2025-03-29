require("dotenv").config({ path: "../.env" });  // Load .env from backend
const mongoose = require("mongoose");

// Import Models
const Model = require("../models/models");
const Variant = require("../models/variant");
const Color = require("../models/colors");
const Category = require("../models/categories");
const Accessory = require("../models/accessories");
const Feature = require("../models/features");

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ ERROR: MongoDB connection string is missing in .env file.");
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// Sample Data
const models = [
  { name: "Tesla Model S", brand: "Tesla", year: 2024 },
  { name: "Ford Mustang", brand: "Ford", year: 2023 },
];

const variants = [
  { name: "Long Range", model: "Tesla Model S", price: 79999 },
  { name: "Plaid", model: "Tesla Model S", price: 99999 },
];

const colors = [
  { name: "Midnight Silver", hex: "#333F48", price: 1000 },
  { name: "Pearl White", hex: "#FFFFFF", price: 0 },
];

const categories = [{ name: "Interior" }, { name: "Exterior" }];

const accessories = [
  { name: "All-Weather Floor Mats", category: "Interior", price: 200 },
  { name: "Carbon Fiber Spoiler", category: "Exterior", price: 1200 },
];

const features = [
  { name: "Autopilot", type: "Technology", description: "Full self-driving capabilities" },
  { name: "Panoramic Roof", type: "Design", description: "Expansive glass roof" },
];

const seedDB = async () => {
  try {
    // Clear previous data
    await Model.deleteMany();
    await Variant.deleteMany();
    await Color.deleteMany();
    await Category.deleteMany();
    await Accessory.deleteMany();
    await Feature.deleteMany();

    // Insert Models first
    const insertedModels = await Model.insertMany(models);
    
    // Map model names to ObjectIds
    const modelMap = {};
    insertedModels.forEach((model) => {
      modelMap[model.name] = model._id;
    });

    // Convert variant model names to ObjectIds
    const updatedVariants = variants.map((variant) => ({
      ...variant,
      model: modelMap[variant.model] || null, // Assign ObjectId or null
    }));

    // Check if any model reference is missing
    if (updatedVariants.some((v) => !v.model)) {
      throw new Error("❌ Some variants have invalid model references!");
    }

    // Insert updated variants
    await Variant.insertMany(updatedVariants);
    await Color.insertMany(colors);
    await Category.insertMany(categories);
    await Accessory.insertMany(accessories);
    await Feature.insertMany(features);

    console.log("🚀 Data Seeded Successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    mongoose.connection.close();
  }
};


// Run the Seeder
connectDB().then(seedDB);
