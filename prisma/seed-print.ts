/**
 * Seeds default print products, their options and a starter price grid for
 * Flyers and Cartes de visite. Idempotent (upsert by slug / combo).
 * Run: npx tsx prisma/seed-print.ts
 */
import { makePrisma } from "./seed-client";

const prisma = makePrisma();
const TVA = 0.2;
const toCents = (e: number) => Math.round(e * 100);

interface ProductDef {
  slug: string; name: string; description: string; mode?: "instant" | "quote";
  papers: string[]; formats: string[]; finishes: string[];
  productionTime?: string;
}

const PRODUCTS: ProductDef[] = [
  { slug: "flyers", name: "Flyers", description: "Flyers publicitaires haute qualité, idéals pour vos promotions et événements.", papers: ["135g brillant", "170g brillant", "300g mat"], formats: ["A6", "A5", "A4", "DL"], finishes: ["Sans finition", "Pelliculage mat", "Vernis sélectif"], productionTime: "3 à 5 jours ouvrés" },
  { slug: "cartes-de-visite", name: "Cartes de visite", description: "Cartes de visite professionnelles, format standard 85×55 mm.", papers: ["350g mat", "350g brillant", "350g soft touch"], formats: ["85x55 mm"], finishes: ["Sans finition", "Vernis 3D sélectif", "Dorure à chaud"], productionTime: "3 à 5 jours ouvrés" },
  { slug: "affiches", name: "Affiches", description: "Affiches grand format pour vitrines et événements.", papers: ["135g brillant", "170g brillant", "250g satiné"], formats: ["A3", "A2", "A1"], finishes: ["Sans finition", "Pelliculage mat"], productionTime: "4 à 6 jours ouvrés" },
  { slug: "depliants", name: "Dépliants", description: "Dépliants 2 ou 3 volets pour présenter vos offres.", papers: ["135g brillant", "170g brillant"], formats: ["A4 2 volets", "A4 3 volets"], finishes: ["Sans finition", "Pelliculage mat"], productionTime: "4 à 6 jours ouvrés" },
  { slug: "brochures", name: "Brochures", description: "Brochures et catalogues piqués ou dos carré collé.", mode: "quote", papers: ["135g", "170g"], formats: ["A5 8p", "A5 16p", "A4 8p"], finishes: ["Piqûre à cheval", "Dos carré collé"] },
  { slug: "baches", name: "Bâches", description: "Bâches publicitaires résistantes, œillets inclus.", mode: "quote", papers: ["Bâche 440g", "Bâche 510g"], formats: ["1x1 m", "2x1 m", "3x1 m"], finishes: ["Œillets standard", "Ourlet + œillets"] },
  { slug: "roll-up", name: "Roll-up", description: "Roll-up enrouleurs avec sac de transport.", mode: "quote", papers: ["Bâche polypropylène"], formats: ["85x200 cm", "100x200 cm"], finishes: ["Structure alu standard", "Structure premium"] },
  { slug: "stickers", name: "Stickers & Autocollants", description: "Stickers découpés ou planches, intérieur/extérieur.", mode: "quote", papers: ["Vinyle blanc", "Vinyle transparent"], formats: ["Rond 5cm", "Carré 7cm", "Custom"], finishes: ["Mat", "Brillant"] },
];

// Simple base grid generator (HT euros) for instant products.
function gridPrice(slug: string, paperIdx: number, formatIdx: number, qty: number): number {
  if (slug === "cartes-de-visite") {
    const base = 12 + paperIdx * 6;
    const per = 0.04 * (1 + paperIdx * 0.2);
    return Math.round((base + per * qty) * 100) / 100;
  }
  if (slug === "affiches") {
    const base = 18 + paperIdx * 4;
    const per = 0.85 * (1 + formatIdx * 0.4) * (1 + paperIdx * 0.15);
    return Math.round((base + per * qty) * 100) / 100;
  }
  // flyers
  const base = 15 + paperIdx * 5;
  const per = 0.1 * (1 + formatIdx * 0.25) * (1 + paperIdx * 0.2) * (1 - Math.min(qty / 12000, 0.4));
  return Math.round((base + per * qty) * 100) / 100;
}

const QUANTITIES = [100, 250, 500, 1000, 2500, 5000];

async function main() {
  console.log("Seeding print products…");
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const product = await prisma.printProduct.upsert({
      where: { slug: p.slug },
      update: { name: p.name, description: p.description, mode: p.mode || "instant", productionTime: p.productionTime || null, sortOrder: i, active: true },
      create: { slug: p.slug, name: p.name, description: p.description, mode: p.mode || "instant", productionTime: p.productionTime || null, sortOrder: i, active: true, minQuantity: 1, sides: "both" },
    });

    // Options (replace)
    await prisma.printOption.deleteMany({ where: { productId: product.id } });
    const mkOpts = (type: string, list: string[]) => list.map((name, idx) => ({ productId: product.id, type, name, value: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), sortOrder: idx }));
    for (const o of [...mkOpts("paper", p.papers), ...mkOpts("format", p.formats), ...mkOpts("finish", p.finishes)]) {
      await prisma.printOption.create({ data: o });
    }

    // Starter price grid only for instant products with a known formula
    if ((p.mode || "instant") === "instant" && ["flyers", "cartes-de-visite", "affiches"].includes(p.slug)) {
      const qtys = p.slug === "affiches" ? [10, 25, 50, 100, 250, 500] : QUANTITIES;
      for (let pi = 0; pi < p.papers.length; pi++) {
        for (let fi = 0; fi < p.formats.length; fi++) {
          for (const qty of qtys) {
            const ht = gridPrice(p.slug, pi, fi, qty);
            const htC = toCents(ht);
            const ttcC = Math.round(htC * (1 + TVA));
            await prisma.printPrice.upsert({
              where: { productId_paper_format_finish_side_quantity: { productId: product.id, paper: p.papers[pi], format: p.formats[fi], finish: "", side: "recto", quantity: qty } },
              update: { priceHtCents: htC, priceTtcCents: ttcC, active: true },
              create: { productId: product.id, paper: p.papers[pi], format: p.formats[fi], finish: "", side: "recto", quantity: qty, priceHtCents: htC, priceTtcCents: ttcC, productionDays: 5, active: true },
            });
          }
        }
      }
    }
  }
  const count = await prisma.printPrice.count();
  console.log(`✓ ${PRODUCTS.length} products, ${count} price rows.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
