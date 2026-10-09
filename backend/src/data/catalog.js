// The showroom catalog. On start-up it is written into MongoDB (upsert by
// slug/id), so editing this file and restarting is all it takes to change
// a price or add a colour.

const wheels = (sizes) => [
  { id: "aero", name: `Aero ${sizes[0]}"`, style: "aero", finish: "#c9ced4", price: 0 },
  { id: "sport", name: `Sport ${sizes[1]}" gloss black`, style: "sport", finish: "#202327", price: 1500 },
  { id: "turbine", name: `Turbine ${sizes[2]}" bronze`, style: "turbine", finish: "#a77b4f", price: 2800 },
];

const models = [
  {
    slug: "aero",
    name: "Aero",
    body: "hatch",
    tagline: "A city car that drives like a sports car.",
    description:
      "Compact outside, roomy inside, and quick off the line. The Aero is the electric hatch for people who park on the street and still take the long way home.",
    basePrice: 32900,
    order: 1,
    specs: { rangeKm: 420, zeroTo100: 6.9, topSpeed: 170, seats: 5, chargeMin: 28 },
    trims: [
      { id: "standard", name: "Standard", price: 0, specs: {} },
      { id: "long-range", name: "Long Range", price: 4500, specs: { rangeKm: 540 } },
      { id: "performance", name: "Performance", price: 8900, specs: { rangeKm: 500, zeroTo100: 4.9, topSpeed: 200 }, includes: ["ambient"] },
    ],
    colors: [
      { id: "glacier", name: "Glacier White", hex: "#eceef0", price: 0 },
      { id: "graphite", name: "Graphite", hex: "#3d4148", price: 900 },
      { id: "signal-red", name: "Signal Red", hex: "#c21f2e", price: 1200 },
      { id: "lagoon", name: "Lagoon Blue", hex: "#1d5ea6", price: 1200 },
    ],
    wheels: wheels([17, 18, 19]),
  },
  {
    slug: "terra",
    name: "Terra",
    body: "suv",
    tagline: "Seven seats. One charge. Any road.",
    description:
      "A family SUV with a flat floor, a third row adults can actually sit in, and enough range for a weekend away without planning the stops.",
    basePrice: 48900,
    order: 2,
    specs: { rangeKm: 510, zeroTo100: 6.2, topSpeed: 190, seats: 7, chargeMin: 30 },
    trims: [
      { id: "standard", name: "Standard", price: 0, specs: {} },
      { id: "long-range", name: "Long Range", price: 5200, specs: { rangeKm: 620 } },
      { id: "adventure", name: "Adventure", price: 7800, specs: { rangeKm: 580, zeroTo100: 5.4 }, includes: ["surround-view"] },
    ],
    colors: [
      { id: "glacier", name: "Glacier White", hex: "#eceef0", price: 0 },
      { id: "obsidian", name: "Obsidian Black", hex: "#16181b", price: 900 },
      { id: "sage", name: "Sage Green", hex: "#6b7d66", price: 1300 },
      { id: "dune", name: "Dune Sand", hex: "#c4ab86", price: 1300 },
    ],
    wheels: wheels([19, 20, 21]),
  },
  {
    slug: "volt",
    name: "Volt",
    body: "coupe",
    tagline: "Two doors. No compromises.",
    description:
      "A low, wide grand tourer with all-wheel drive and launch control. It is quiet on the motorway and loud on a back road.",
    basePrice: 74900,
    order: 3,
    specs: { rangeKm: 480, zeroTo100: 3.4, topSpeed: 260, seats: 4, chargeMin: 22 },
    trims: [
      { id: "gt", name: "GT", price: 0, specs: {} },
      { id: "gt-performance", name: "GT Performance", price: 9500, specs: { zeroTo100: 2.9, topSpeed: 280 } },
      { id: "track", name: "Track Edition", price: 18500, specs: { rangeKm: 440, zeroTo100: 2.6, topSpeed: 305 }, includes: ["ambient", "surround-view"] },
    ],
    colors: [
      { id: "volt-yellow", name: "Volt Yellow", hex: "#f0bf12", price: 0 },
      { id: "ember", name: "Ember Orange", hex: "#e0531c", price: 1800 },
      { id: "racing-green", name: "Racing Green", hex: "#1d5e40", price: 1800 },
      { id: "liquid-silver", name: "Liquid Silver", hex: "#aab1b9", price: 2400 },
    ],
    wheels: wheels([20, 21, 21]),
  },
];

const packages = [
  {
    id: "panoramic-roof",
    name: "Panoramic glass roof",
    description: "One sheet of tinted glass from windscreen to rear seats, with a power sunshade.",
    price: 1400,
    media: { type: "image", src: "/assets/features/sunroof.webp" },
    order: 1,
  },
  {
    id: "surround-view",
    name: "360° camera",
    description: "A bird's-eye view of the car on the centre screen, so tight parking spots stop being guesswork.",
    price: 900,
    media: { type: "image", src: "/assets/features/camera-360.webp" },
    order: 2,
  },
  {
    id: "ambient",
    name: "Ambient lighting",
    description: "64-colour lighting along the dash and doors that can follow the music or the drive mode.",
    price: 600,
    media: { type: "image", src: "/assets/features/ambient.webp" },
    order: 3,
  },
  {
    id: "autopilot",
    name: "Highway assist",
    description: "Keeps the lane, holds the distance to the car ahead and changes lanes when you flick the indicator.",
    price: 3900,
    media: { type: "video", src: "/assets/features/autopilot.mp4", poster: "/assets/features/autopilot.webp" },
    order: 4,
  },
];

const DESTINATION_FEE = 1200;

// Test-drive booking rules
const locations = [
  { id: "dallas", name: "Dallas, Uptown" },
  { id: "austin", name: "Austin, South Congress" },
  { id: "houston", name: "Houston, Midtown" },
];
const SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00"];
const CARS_PER_SLOT = 2; // each showroom has two demo cars
const BOOKING_WINDOW_DAYS = 30;

module.exports = { models, packages, DESTINATION_FEE, locations, SLOTS, CARS_PER_SLOT, BOOKING_WINDOW_DAYS };
