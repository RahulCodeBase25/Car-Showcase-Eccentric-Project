const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const CarModel = require("./models/CarModel");
const Package = require("./models/Package");
const Build = require("./models/Build");
const TestDrive = require("./models/TestDrive");
const { quote } = require("./services/pricing");
const { bookableDates, checkDateAndSlot } = require("./services/schedule");
const { locations, SLOTS, CARS_PER_SLOT } = require("./data/catalog");

// Short, readable codes: no 0/O or 1/I/L to mix up when read aloud
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const makeCode = (length) => Array.from(crypto.randomBytes(length), (b) => ALPHABET[b % ALPHABET.length]).join("");

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Per-IP limit for anything that writes to the database
function writeLimiter({ max = 30, windowMs = 10 * 60_000 } = {}) {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const entry = hits.get(req.ip);
    if (!entry || now > entry.resetAt) hits.set(req.ip, { count: 1, resetAt: now + windowMs });
    else if (++entry.count > max) return res.status(429).json({ message: "Too many requests. Try again in a few minutes." });
    next();
  };
}

const asyncRoute = (fn) => (req, res, next) => fn(req, res, next).catch(next);

function createApp({ corsOrigins = [], dbLabel = "unknown" } = {}) {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(cors({ origin: corsOrigins.length ? corsOrigins : true }));
  app.use(express.json({ limit: "10kb" }));

  const writes = writeLimiter();
  const api = express.Router();

  app.get("/health", (req, res) =>
    res.json({ status: mongoose.connection.readyState === 1 ? "ok" : "starting", database: dbLabel })
  );

  // ---- Catalog
  api.get(
    "/models",
    asyncRoute(async (req, res) => {
      res.json(await CarModel.find({}, { _id: 0 }).sort({ order: 1 }).lean());
    })
  );

  api.get(
    "/models/:slug",
    asyncRoute(async (req, res) => {
      const model = await CarModel.findOne({ slug: String(req.params.slug) }, { _id: 0 }).lean();
      if (!model) return res.status(404).json({ message: "No car with that name" });
      res.json(model);
    })
  );

  api.get(
    "/packages",
    asyncRoute(async (req, res) => {
      res.json(await Package.find({}, { _id: 0 }).sort({ order: 1 }).lean());
    })
  );

  // ---- Pricing and saved builds
  const priceFor = async (body = {}) => {
    const model = await CarModel.findOne({ slug: String(body.model) }).lean();
    if (!model) {
      const err = new Error("Pick a car first");
      err.status = 400;
      throw err;
    }
    const packages = await Package.find().lean();
    return quote(model, packages, body);
  };

  api.post(
    "/quote",
    asyncRoute(async (req, res) => res.json(await priceFor(req.body)))
  );

  api.post(
    "/builds",
    writes,
    asyncRoute(async (req, res) => {
      const q = await priceFor(req.body);
      for (let tries = 0; tries < 5; tries++) {
        try {
          const build = await Build.create({ code: makeCode(6), model: q.model, trim: q.trim, color: q.color, wheels: q.wheels, packages: q.packages, quote: q });
          return res.status(201).json({ code: build.code, quote: q, createdAt: build.createdAt });
        } catch (err) {
          if (err.code !== 11000) throw err; // code already taken: try another
        }
      }
      throw new Error("Could not save the build, please try again");
    })
  );

  api.get(
    "/builds/:code",
    asyncRoute(async (req, res) => {
      const build = await Build.findOne({ code: String(req.params.code).toUpperCase() }, { _id: 0 }).lean();
      if (!build) return res.status(404).json({ message: "We couldn't find that build. Check the code and try again." });
      res.json(build);
    })
  );

  // ---- Test drives
  api.get("/test-drives/options", (req, res) => {
    res.json({ locations, dates: bookableDates(), slots: SLOTS });
  });

  api.get(
    "/test-drives/availability",
    asyncRoute(async (req, res) => {
      const location = String(req.query.location ?? "");
      const date = String(req.query.date ?? "");
      if (!locations.some((l) => l.id === location)) return res.status(400).json({ message: "Pick a showroom" });
      const problem = checkDateAndSlot(date, SLOTS[0]);
      if (problem) return res.status(400).json({ message: problem });
      const taken = await TestDrive.aggregate([
        { $match: { location, date } },
        { $group: { _id: "$slot", n: { $sum: 1 } } },
      ]);
      const used = Object.fromEntries(taken.map((t) => [t._id, t.n]));
      res.json(SLOTS.map((slot) => ({ slot, left: Math.max(0, CARS_PER_SLOT - (used[slot] || 0)) })));
    })
  );

  api.post(
    "/test-drives",
    writes,
    asyncRoute(async (req, res) => {
      const { name, email, buildCode } = req.body || {};
      const [model, location, date, slot] = ["model", "location", "date", "slot"].map((k) => String(req.body?.[k] ?? ""));
      const fail = (message) => res.status(400).json({ message });
      if (typeof name !== "string" || name.trim().length < 2 || name.length > 80) return fail("Enter your name");
      if (typeof email !== "string" || !EMAIL.test(email.trim()) || email.length > 120) return fail("Enter a valid email address");
      if (!(await CarModel.exists({ slug: model }))) return fail("Pick a car to drive");
      if (!locations.some((l) => l.id === location)) return fail("Pick a showroom");
      const problem = checkDateAndSlot(date, slot);
      if (problem) return fail(problem);

      const base = { name: name.trim(), email: email.trim().toLowerCase(), model, location, date, slot };
      if (typeof buildCode === "string" && /^[A-Z0-9]{6}$/i.test(buildCode)) base.buildCode = buildCode.toUpperCase();

      // Try each demo car in turn; the unique index makes this safe under races
      for (let car = 1; car <= CARS_PER_SLOT; car++) {
        try {
          const booking = await TestDrive.create({ ...base, car, ref: `TD-${makeCode(5)}` });
          const where = locations.find((l) => l.id === location).name;
          return res.status(201).json({ ref: booking.ref, name: booking.name, model, location: where, date, slot });
        } catch (err) {
          if (err.code !== 11000) throw err;
          if (err.keyPattern?.email) return res.status(409).json({ message: "You already have a test drive booked that day." });
          // that car is taken: try the next one
        }
      }
      res.status(409).json({ message: "That time just filled up. Please pick another." });
    })
  );

  app.use("/api", api);

  app.use((req, res) => res.status(404).json({ message: "Not found" }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || (err.type === "entity.parse.failed" ? 400 : 500);
    if (status >= 500) console.error(err);
    res.status(status).json({ message: status >= 500 ? "Something went wrong on our side" : err.message });
  });

  return app;
}

module.exports = { createApp };
