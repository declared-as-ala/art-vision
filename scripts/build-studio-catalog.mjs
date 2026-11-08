// Derives src/data/studio-catalog.json (small, client-safe) from the full print catalog.
// Run: node scripts/build-studio-catalog.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const products = JSON.parse(fs.readFileSync(path.join(root, "src/data/impression-products.json"), "utf8"));

// studio product -> catalog slug + how to find each studio format's row in the catalog tables
//   { format: [labels] }  matches the row "format" column
//   { dim: RegExp }       matches the row "dimension" column (when the label is generic, e.g. "Roll Up")
const WANTED = {
  "cartes-de-visite": { slug: "cartes-de-visite", rows: { cdv: { format: ["Carte de Crédit"] } } },
  // Loyalty cards are printed on the same card stock as business cards (85 × 55 mm, incl. the stampable paper)
  "cartes-fidelite": { slug: "cartes-de-visite", rows: { cdv: { format: ["Carte de Crédit"] } } },
  flyers: {
    slug: "flyers",
    rows: { a6: { format: ["A6"] }, a5: { format: ["A5"] }, a4: { format: ["A4"] }, a3: { format: ["A3"] }, us: { format: ["US"] } },
  },
  "bons-cadeaux": { slug: "cartes-de-voeux", rows: { a6: { format: ["A6"] }, us: { format: ["US"] }, a5: { format: ["A5"] } } },
  affiches: { slug: "affiches", rows: { a4: { format: ["A4"] }, a3: { format: ["A3"] }, a2: { format: ["A2"] }, a1: { format: ["A1"] } } },
  "cartes-postales": { slug: "cartes-postales", rows: { a6: { format: ["A6"] } } },
  "roll-up": {
    slug: "roll-up",
    rows: {
      ru85: { dim: /200 \(h\) x 85 \(l\)/ },
      ru100: { dim: /200 \(h\) x 100 \(l\)/ },
      ru120: { dim: /200 \(h\) x 120 \(l\)/ },
      ru150: { dim: /200 \(h\) x 150 \(l\)/ },
      ru200: { dim: /200 \(h\) x 200 \(l\)/ },
      tx200x220: { dim: /200 \(l\) x 220 \(h\)/ },
      tx200x250: { dim: /200 \(l\) x 250 \(h\)/ },
      tx200x300: { dim: /200 \(l\) x 300 \(h\)/ },
    },
  },
};

const price = (v) => {
  if (!v) return null;
  const m = String(v).replace(/\s/g, "").match(/([\d]+(?:,\d+)?)/);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
};

const clean = (title) =>
  title
    .replace(/^(Flyers|Cartes de voeux|Cartes de visite|Cartes postales|Affiches|Roll\s*-?\s*Up)\s*-\s*/i, "")
    .replace(/\s*-\s*Recto\s*\/\s*Verso\s*$/i, "")
    .replace(/\s*-\s*Recto\s*$/i, "")
    .replace(/\s*-\s*-\s*/g, " - ")
    .replace(/[\s-]+$/, "")
    .replace(/\?/g, "é")
    .trim();

const out = {};
for (const [studioId, cfg] of Object.entries(WANTED)) {
  const src = products[cfg.slug];
  const papers = [];
  for (const cat of src.categories) {
    const sides = /recto-verso$/.test(cat.id) ? "recto-verso" : /recto$/.test(cat.id) ? "recto" : "recto-verso";
    const rows = {};
    for (const [fmtId, rule] of Object.entries(cfg.rows)) {
      const row = cat.rows.find((r) => (rule.format ? rule.format.includes(r.format) : rule.dim.test(r.dimension)));
      if (!row) continue;
      const prices = {};
      for (const q of cat.quantities) {
        const p = price(row.prices[q]);
        if (p != null) prices[q] = p;
      }
      if (Object.keys(prices).length) rows[fmtId] = prices;
    }
    if (!Object.keys(rows).length) continue;
    papers.push({ id: cat.id, name: clean(cat.title), fullName: cat.title.replace(/\?/g, "é"), sides, quantities: cat.quantities, rows });
  }
  out[studioId] = { catalogSlug: cfg.slug, fileGuidelines: src.fileGuidelines, papers };
}

// Bâches: per-m² tariff brackets (HT)
const b = products["baches"];
const brackets = b.categories[0].rows.map((r) => {
  const m = r.format.match(/(\d+)\s*à\s*(\d+)/);
  const t = String(r.prices["Tarif HT / m²"] || "").replace(/\s/g, "").match(/([\d,]+)à([\d,]+)/);
  return {
    label: r.format,
    fromM2: m ? Number(m[1]) : 0,
    toM2: m ? Number(m[2]) : 0,
    minPerM2: t ? parseFloat(t[1].replace(",", ".")) : null,
    maxPerM2: t ? parseFloat(t[2].replace(",", ".")) : null,
  };
});
out["baches"] = {
  catalogSlug: "baches",
  fileGuidelines: b.fileGuidelines,
  material: b.categories[0].title,
  brackets,
};

fs.writeFileSync(path.join(root, "src/data/studio-catalog.json"), JSON.stringify(out));
console.log(
  "studio-catalog.json written:",
  Object.keys(out)
    .map((k) => `${k}:${out[k].papers?.length ?? out[k].brackets.length}`)
    .join(", ")
);
