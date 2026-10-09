const { SLOTS, BOOKING_WINDOW_DAYS } = require("../data/catalog");

// Dates are plain YYYY-MM-DD strings in the showrooms' time zone (Central).
const TZ = "America/Chicago";
const todayLocal = (now = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now);

const addDays = (ymd, n) => {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const isSunday = (ymd) => new Date(`${ymd}T12:00:00Z`).getUTCDay() === 0;

// Bookable dates: tomorrow up to the window, showrooms closed on Sundays
function bookableDates(now = new Date()) {
  const today = todayLocal(now);
  const out = [];
  for (let i = 1; i <= BOOKING_WINDOW_DAYS; i++) {
    const d = addDays(today, i);
    if (!isSunday(d)) out.push(d);
  }
  return out;
}

function checkDateAndSlot(date, slot, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return "Pick a date";
  if (!bookableDates(now).includes(date)) return "That date can't be booked. Pick a day from tomorrow up to 30 days ahead (closed Sundays).";
  if (!SLOTS.includes(slot)) return "Pick one of the listed times";
  return null;
}

module.exports = { bookableDates, checkDateAndSlot, todayLocal, addDays };
