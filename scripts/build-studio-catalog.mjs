// Derives src/data/studio-catalog.json (small, client-safe) from the full print catalog.
// Run: node scripts/build-studio-catalog.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const products = JSON.parse(fs.readFileSync(path.join(root, "src/data/impression-products.json"), "utf8"));

// studio product -> catalog slug + catalog row labels accepted per studio format id
const WANTED = {
  "cartes-de-visite": { slug: "cartes-de-visite", rows: { cdv: ["Carte de Crédit"] } },
  flyers: {
    slug: "flyers",
    rows: { a6: ["A6"], a5: ["A5"], a4: ["A4"], a3: ["A3"], us: ["US"] },
  },
  "bons-cadeaux": {
    slug: "cartes-de-voeux",
    rows: { a6: ["A6"], us: ["US"], a5: ["A5"] },
  },
};

const price = (v) => {
  if (!v) return null;
  const m = String(v).replace(/\s/g, "").match(/([\d]+(?:,\d+)?)/);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
};

const clean = (title) =>
  title
    .replace(/^(Flyers|Cartes de voeux|Cartes de visite)\s*-\s*/i, "")
    .replace(/\s*-\s*Recto\s*\/\s*Verso\s*$/i, "")
    .replace(/\s*-\s*Recto\s*$/i, "")
    .replace(/\s*-\s*-\s*/g, " - ")
    .replace(/\?/g, "é")
    .trim();

const out = {};
for (const [studioId, cfg] of Object.entries(WANTED)) {
  const src = products[cfg.slug];
  const papers = [];
  for (const cat of src.categories) {
    const sides = /recto-verso$/.test(cat.id) ? "recto-verso" : /recto$/.test(cat.id) ? "recto" : "recto-verso";
    const rows = {};
    for (const [fmtId, labels] of Object.entries(cfg.rows)) {
      const row = cat.rows.find((r) => labels.includes(r.format));
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
console.log("studio-catalog.json written:", Object.keys(out).map((k) => `${k}:${out[k].papers?.length ?? out[k].brackets.length}`).join(", "));
