const CarModel = require("./models/CarModel");
const Package = require("./models/Package");
const catalog = require("./data/catalog");

// Writes the catalog into the database. Safe to run on every start.
async function seedCatalog() {
  await CarModel.bulkWrite(catalog.models.map((m) => ({ replaceOne: { filter: { slug: m.slug }, replacement: m, upsert: true } })));
  await Package.bulkWrite(catalog.packages.map((p) => ({ replaceOne: { filter: { id: p.id }, replacement: p, upsert: true } })));
  await CarModel.deleteMany({ slug: { $nin: catalog.models.map((m) => m.slug) } });
  await Package.deleteMany({ id: { $nin: catalog.packages.map((p) => p.id) } });
}

module.exports = { seedCatalog };
