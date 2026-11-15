import catalog from "@/data/impression-catalog.json";
import products from "@/data/impression-products.json";

/**
 * "Nos impressions les plus demandées" — every figure comes from the verified price tables
 * (src/data/impression-products.json), never typed by hand, so the home page cannot drift from the product pages.
 */

type Row = { format: string; dimension: string; prices: Record<string, string | null> };
type Category = { id: string; name: string; quantities: string[]; rows: Row[] };
type ProductData = { fileGuidelines: { production: string; shipping: string }; categories: Category[] };

const DATA = products as unknown as Record<string, ProductData>;

type Pick = {
  catalogSlug: string; // key in the catalogue / price tables
  page: string; // public product page (canonical slug)
  name: string;
  usage: string;
  categoryId: string;
  formatStartsWith: string;
  quantity: string; // column key in the price table
  sides: string; // as stated in the price table title
  unit: string; // label shown after the quantity
};

const PICKS: Pick[] = [
  { catalogSlug: "cartes-de-visite", page: "carte-de-visite", name: "Cartes de visite", usage: "Se présenter et laisser une trace après un rendez-vous.", categoryId: "300grs-m-fsc-recto", formatStartsWith: "Carte de Crédit", quantity: "500 ex", sides: "recto", unit: "500 ex." },
  { catalogSlug: "flyers", page: "flyer", name: "Flyers", usage: "Annoncer une offre, un événement ou une ouverture.", categoryId: "130-grs-m-fsc-recto-verso", formatStartsWith: "A6 10,5 x 14,8", quantity: "500 ex", sides: "recto verso", unit: "500 ex." },
  { catalogSlug: "depliants", page: "depliant", name: "Dépliants", usage: "Présenter une carte, une gamme ou des services.", categoryId: "250grs-m-fsc-recto-verso", formatStartsWith: "A5 plié en 2", quantity: "500 ex", sides: "recto verso", unit: "500 ex." },
  { catalogSlug: "roll-up", page: "roll-up", name: "Roll-up", usage: "Habiller un stand, un salon ou un point de vente.", categoryId: "toile-vynil-440-grs-recto", formatStartsWith: "Roll Up 200", quantity: "1 ex", sides: "recto", unit: "1 ex." },
  { catalogSlug: "baches", page: "bache", name: "Bâches", usage: "Signaler un commerce, un chantier ou un événement.", categoryId: "baches-pvc-510g", formatStartsWith: "1 à 5 m²", quantity: "Tarif HT / m²", sides: "recto", unit: "" },
];

export type PopularPrint = {
  slug: string;
  name: string;
  usage: string;
  image: string;
  alt: string;
  href: string;
  quoteHref: string;
  /** e.g. "A6 · 10,5 x 14,8 cm · 130 g/m² FSC · recto verso · 500 ex." */
  config: string;
  /** e.g. "48 € HT" or "18,30 à 22,50 € HT / m²" */
  price: string;
  delivery: string;
};

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

export function getPopularPrints(): PopularPrint[] {
  const out: PopularPrint[] = [];
  for (const p of PICKS) {
    const data = DATA[p.catalogSlug];
    const meta = catalog.products.find((c) => c.slug === p.catalogSlug) as { image: string; alt?: string } | undefined;
    const cat = data?.categories.find((c) => c.id === p.categoryId);
    const row = cat?.rows.find((r) => `${r.format} ${r.dimension}`.startsWith(p.formatStartsWith));
    const raw = row?.prices[p.quantity];
    if (!data || !meta || !cat || !row || !raw) continue;

    const perSqm = p.quantity.includes("m²");
    const price = clean(perSqm ? `${raw} HT / m²` : `${raw} HT`).replace("€ HT / m² HT", "€ HT / m²");
    const paper = clean(cat.name.replace(/\s*-\s*Recto( \/ Verso)?$/i, ""));
    const config = [row.format, row.dimension, paper, p.sides, p.unit].map(clean).filter(Boolean).join(" · ");

    const qs = new URLSearchParams({
      prefill: "impression",
      product: p.name,
      format: `${row.format} (${row.dimension})`,
      paper: `${paper} — ${p.sides}`,
      qty: perSqm ? "" : p.quantity.replace(/\D+/g, ""),
      price: price,
      src: "home-top-prints",
    });
    if (perSqm) qs.delete("qty");

    out.push({
      slug: p.page,
      name: p.name,
      usage: p.usage,
      image: meta.image,
      alt: meta.alt || `Impression ${p.name.toLowerCase()} — Art Vision`,
      href: `/impression/${p.page}`,
      quoteHref: `/devis-sur-mesure?${qs.toString()}`,
      config,
      price,
      delivery: `Production : ${data.fileGuidelines.production.replace(/\.$/, "")} · Livraison : ${data.fileGuidelines.shipping.replace(/\.$/, "")}`,
    });
  }
  return out;
}
