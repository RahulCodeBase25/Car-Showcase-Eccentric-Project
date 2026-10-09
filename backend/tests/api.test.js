const { test, before, after, describe } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { createApp } = require("../src/app");
const { seedCatalog } = require("../src/seed");
const { bookableDates } = require("../src/services/schedule");
const { DESTINATION_FEE } = require("../src/data/catalog");

let mem;
let app;

before(async () => {
  mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri("test"));
  await seedCatalog();
  await Promise.all(mongoose.modelNames().map((n) => mongoose.model(n).syncIndexes()));
  app = createApp({ dbLabel: "test" });
});

after(async () => {
  await mongoose.disconnect();
  await mem.stop();
});

const aero = { model: "aero", trim: "standard", color: "glacier", wheels: "aero", packages: [] };

describe("catalog", () => {
  test("lists the three models in order with their options", async () => {
    const res = await request(app).get("/api/models").expect(200);
    assert.deepEqual(res.body.map((m) => m.slug), ["aero", "terra", "volt"]);
    assert.equal(res.body[0].colors.length, 4);
    assert.equal(res.body[0]._id, undefined);
  });

  test("returns one model, or 404", async () => {
    const res = await request(app).get("/api/models/volt").expect(200);
    assert.equal(res.body.body, "coupe");
    await request(app).get("/api/models/delorean").expect(404);
  });

  test("seeding twice doesn't duplicate anything", async () => {
    await seedCatalog();
    const res = await request(app).get("/api/packages").expect(200);
    assert.equal(res.body.length, 4);
  });
});

describe("pricing", () => {
  test("base car is base price plus delivery", async () => {
    const res = await request(app).post("/api/quote").send(aero).expect(200);
    assert.equal(res.body.total, 32900 + DESTINATION_FEE);
  });

  test("adds trim, colour, wheels and packages", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ model: "aero", trim: "long-range", color: "signal-red", wheels: "sport", packages: ["autopilot", "panoramic-roof"] })
      .expect(200);
    assert.equal(res.body.total, 32900 + 4500 + 1200 + 1500 + 3900 + 1400 + DESTINATION_FEE);
    assert.equal(res.body.specs.rangeKm, 540, "trim specs override the base specs");
  });

  test("packages included with a trim cost nothing and are always listed", async () => {
    const res = await request(app)
      .post("/api/quote")
      .send({ model: "volt", trim: "track", color: "volt-yellow", wheels: "aero", packages: ["ambient", "ambient"] })
      .expect(200);
    assert.equal(res.body.total, 74900 + 18500 + DESTINATION_FEE);
    assert.deepEqual(res.body.packages.sort(), ["ambient", "surround-view"]);
  });

  test("rejects options that don't belong to the car", async () => {
    // Volt Yellow is a Volt colour, not an Aero one
    const res = await request(app).post("/api/quote").send({ ...aero, color: "volt-yellow" }).expect(400);
    assert.match(res.body.message, /Unknown colour/);
    await request(app).post("/api/quote").send({ ...aero, packages: ["jetpack"] }).expect(400);
    await request(app).post("/api/quote").send({ ...aero, model: "nope" }).expect(400);
  });

  test("ignores any price the client sends", async () => {
    const res = await request(app).post("/api/quote").send({ ...aero, total: 1 }).expect(200);
    assert.notEqual(res.body.total, 1);
  });
});

describe("saved builds", () => {
  test("saves a build and loads it back by code", async () => {
    const saved = await request(app).post("/api/builds").send({ ...aero, packages: ["ambient"] }).expect(201);
    assert.match(saved.body.code, /^[2-9A-HJKMNP-Z]{6}$/);
    const loaded = await request(app).get(`/api/builds/${saved.body.code.toLowerCase()}`).expect(200);
    assert.equal(loaded.body.quote.total, saved.body.quote.total);
    assert.deepEqual(loaded.body.packages, ["ambient"]);
  });

  test("unknown code is a 404", async () => {
    await request(app).get("/api/builds/ZZZZZZ").expect(404);
  });
});

describe("test drives", () => {
  const date = () => bookableDates()[0];
  const booking = (over = {}) => ({ name: "Ada Lovelace", email: "ada@example.com", model: "terra", location: "dallas", date: date(), slot: "10:00", ...over });

  test("options list showrooms, dates and times, never a Sunday", async () => {
    const res = await request(app).get("/api/test-drives/options").expect(200);
    assert.equal(res.body.locations.length, 3);
    assert.ok(res.body.dates.length >= 25);
    for (const d of res.body.dates) assert.notEqual(new Date(`${d}T12:00:00Z`).getUTCDay(), 0);
  });

  test("books a slot and counts it against availability", async () => {
    const res = await request(app).post("/api/test-drives").send(booking()).expect(201);
    assert.match(res.body.ref, /^TD-/);
    const avail = await request(app).get(`/api/test-drives/availability?location=dallas&date=${date()}`).expect(200);
    assert.equal(avail.body.find((s) => s.slot === "10:00").left, 1);
    assert.equal(avail.body.find((s) => s.slot === "11:30").left, 2);
  });

  test("one booking per person per day", async () => {
    const res = await request(app).post("/api/test-drives").send(booking({ slot: "13:00", email: "ADA@example.com" })).expect(409);
    assert.match(res.body.message, /already have/);
  });

  test("a slot never gets more bookings than there are cars, even when requests race", async () => {
    const people = Array.from({ length: 6 }, (_, i) => booking({ slot: "14:30", email: `racer${i}@example.com` }));
    const results = await Promise.all(people.map((b) => request(app).post("/api/test-drives").send(b)));
    const statuses = results.map((r) => r.status).sort();
    assert.deepEqual(statuses, [201, 201, 409, 409, 409, 409]);
  });

  test("validates the form", async () => {
    await request(app).post("/api/test-drives").send(booking({ email: "not-an-email" })).expect(400);
    await request(app).post("/api/test-drives").send(booking({ name: "" })).expect(400);
    await request(app).post("/api/test-drives").send(booking({ slot: "03:00" })).expect(400);
    await request(app).post("/api/test-drives").send(booking({ date: "2020-01-01" })).expect(400);
    await request(app).post("/api/test-drives").send(booking({ location: "paris" })).expect(400);
    await request(app).post("/api/test-drives").send(booking({ model: { $ne: null } })).expect(400);
  });
});

test("bad JSON gets a 400, unknown routes a 404", async () => {
  await request(app).post("/api/quote").set("Content-Type", "application/json").send("{oops").expect(400);
  await request(app).get("/api/nothing-here").expect(404);
});
