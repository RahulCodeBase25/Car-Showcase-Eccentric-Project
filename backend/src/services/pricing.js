const { DESTINATION_FEE } = require("../data/catalog");

class InvalidOption extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

// Works out the price of a configuration. The server is the only place
// prices are calculated, so the browser can't send its own total.
function quote(model, packages, { trim, color, wheels, packages: chosen = [] }) {
  const pick = (list, id, what) => {
    const found = list.find((o) => o.id === id);
    if (!found) throw new InvalidOption(`Unknown ${what} "${id}" for ${model.name}`);
    return found;
  };

  const t = pick(model.trims, trim, "trim");
  const c = pick(model.colors, color, "colour");
  const w = pick(model.wheels, wheels, "wheel");
  if (!Array.isArray(chosen) || chosen.length > packages.length) throw new InvalidOption("packages must be a list");
  const unique = [...new Set(chosen)];
  const included = new Set(t.includes || []);

  const lines = [
    { label: `${model.name} ${t.name}`, amount: model.basePrice + t.price },
    { label: c.name, amount: c.price },
    { label: `${w.name} wheels`, amount: w.price },
  ];
  for (const id of unique) {
    const p = pick(packages, id, "package");
    lines.push(included.has(id) ? { label: p.name, amount: 0, note: `Included with ${t.name}` } : { label: p.name, amount: p.price });
  }
  // Packages that come with the trim are listed even if not ticked
  for (const id of included) {
    if (!unique.includes(id)) {
      const p = packages.find((x) => x.id === id);
      if (p) lines.push({ label: p.name, amount: 0, note: `Included with ${t.name}` });
    }
  }
  lines.push({ label: "Destination and delivery", amount: DESTINATION_FEE });

  return {
    model: model.slug,
    trim: t.id,
    color: c.id,
    wheels: w.id,
    packages: [...new Set([...unique, ...included])],
    specs: { ...model.specs, ...(t.specs || {}) },
    lines,
    total: lines.reduce((sum, l) => sum + l.amount, 0),
    currency: "USD",
  };
}

module.exports = { quote, InvalidOption };
