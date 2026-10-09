const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const money = (n) => usd.format(n);
export const plusMoney = (n) => (n > 0 ? `+ ${usd.format(n)}` : "Included");

export const niceDate = (ymd, opts = { weekday: "long", month: "long", day: "numeric" }) =>
  new Date(`${ymd}T12:00:00Z`).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

export const SPEC_LABELS = [
  { key: "rangeKm", label: "Range", unit: "km" },
  { key: "zeroTo100", label: "0–100 km/h", unit: "s" },
  { key: "topSpeed", label: "Top speed", unit: "km/h" },
  { key: "seats", label: "Seats", unit: "" },
];
