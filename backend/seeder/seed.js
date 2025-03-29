const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Model = require("../models/models.js");
const Variant = require("../models/variant.js");
const Color = require("../models/colors.js");
const Category = require("../models/categories.js");
const Accessory = require("../models/accessories.js");
const Feature = require("../models/features.js");

// Load .env file
dotenv.config({ path: "../.env" });

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
}// Sample Data
const models = [
  { name: "Tesla Model S", brand: "Tesla", year: 2024 },
  { name: "Ford Mustang", brand: "Ford", year: 2023 },
];

const variants = [
  { name: "Long Range", model: "Tesla Model S", price: 79999 },
  { name: "Plaid", model: "Tesla Model S", price: 99999 },
];

const colors = [
  { name: "Midnight Silver", hexCode: "#333F48", price: 1000, variant: "Long Range" },
  { name: "Pearl White", hexCode: "#FFFFFF", price: 0, variant: "Plaid" },
];

const categoriesData = [
  { name: "Interior", type: "Accessory" },
  { name: "Exterior", type: "Feature" }
];

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

    const insertedModels = await Model.insertMany(models);
    const modelMap = Object.fromEntries(insertedModels.map(model => [model.name, model._id]));

    const updatedVariants = variants.map(v => ({ ...v, model: modelMap[v.model] || null }));
    const insertedVariants = await Variant.insertMany(updatedVariants);
    const variantMap = Object.fromEntries(insertedVariants.map(v => [v.name, v._id]));

    const updatedColors = colors.map(c => ({ ...c, variant: variantMap[c.variant] || null }));
    if (updatedColors.some(c => !c.variant)) throw new Error("❌ Some colors have invalid variant references!");

    await Color.insertMany(updatedColors);
    const insertedCategories = await Category.insertMany(categoriesData);
    const categoryMap = Object.fromEntries(insertedCategories.map(c => [c.name, c._id]));

    const accessories = [
      { name: "All-Weather Floor Mats", category: categoryMap["Interior"], price: 200 },
      { name: "Carbon Fiber Spoiler", category: categoryMap["Exterior"], price: 1200 },
    ];

    const features = [
      { name: "Autopilot", type: "Technology", description: "Full self-driving capabilities" },
      { name: "Panoramic Roof", type: "Design", description: "Expansive glass roof" },
    ];

    await Accessory.insertMany(accessories);
    await Feature.insertMany(features);

    console.log("🎉 Data Seeded Successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    mongoose.connection.close();
  }
};

// Run the Seeder
connectDB().then(() => {
  console.log("Database connected, seeding...");
});