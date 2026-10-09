require("dotenv").config();
const mongoose = require("mongoose");
const { createApp } = require("./app");
const { seedCatalog } = require("./seed");

const PORT = Number(process.env.PORT) || 5000;
const corsOrigins = (process.env.CORS_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);

// Use MONGODB_URI when it's set and reachable. Otherwise (and unless turned
// off) start an in-memory MongoDB so the demo still works: saved builds and
// bookings then last until the server restarts.
async function connect() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
      return "mongodb";
    } catch (err) {
      console.error("Could not reach MONGODB_URI:", err.message);
      if (process.env.ALLOW_MEMORY_DB === "false") throw err;
    }
  }
  const { MongoMemoryServer } = require("mongodb-memory-server");
  const mem = await MongoMemoryServer.create({ instance: { args: ["--wiredTigerCacheSizeGB", "0.25"] } });
  await mongoose.connect(mem.getUri("eccentric"));
  return "in-memory (temporary)";
}

async function main() {
  const dbLabel = await connect();
  await seedCatalog();
  await Promise.all(mongoose.modelNames().map((n) => mongoose.model(n).syncIndexes()));
  const app = createApp({ corsOrigins, dbLabel });
  app.listen(PORT, () => console.log(`Eccentric Motors API on port ${PORT} (database: ${dbLabel})`));
}

main().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
