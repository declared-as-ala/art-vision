/**
 * Guided print configuration, built on the existing verified price tables (src/data/impression-products.json).
 *
 * Nothing is invented or interpolated: every selectable combination is one real (category, row, quantity column)
 * cell of the tables, and the price shown is that cell's text. A combination without a price does not exist here
 * and is routed to a quote request instead.
 */

export type SideKey = "recto" | "recto-verso" | "unique";
export type Dim = "format" | "material" | "grammage" | "sides" | "finish" | "quantity";

/** Order in which the choices are presented; earlier choices constrain the later ones. */
export const DIM_ORDER: Dim[] = ["format", "material", "grammage", "sides", "finish", "quantity"];

export interface RawCategory {
  id: string;
  title: string;
  name: string;
  quantities: string[];
  rows: { format: string; dimension: string; prices: Record<string, string | null> }[];
}

export interface Offer {
  key: string;
  categoryId: string;
  categoryName: string;
  /** "A6|10,5 x 14,8 cm" — unique per table row */
  formatKey: string;
  format: string;
  dimension: string;
  material: string;
  grammage: string;
  finish: string;
  sides: SideKey;
  /** quantity column label -> price text, only columns that have a price */
  prices: Record<string, string>;
  quantityOrder: string[];
}

export interface PrintCatalogue {
  offers: Offer[];
  /** true when prices are "Tarif HT / m²" (total depends on the surface: quote required) */
  perSquareMetre: boolean;
}

export type Selection = Record<Dim, string>;

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** Free-text category names ("300grs / m² + Vernis UV - Recto / Verso") → structured choices. */
export function parseCategoryName(rawName: string): { material: string; grammage: string; finish: string; sides: SideKey } {
  let base = clean(rawName);

  let sides: SideKey = "unique";
  if (/\s*-\s*recto\s*\/\s*verso\s*$/i.test(base)) {
    sides = "recto-verso";
    base = base.replace(/\s*-\s*recto\s*\/\s*verso\s*$/i, "");
  } else if (/\s*-\s*recto\s*$/i.test(base)) {
    sides = "recto";
    base = base.replace(/\s*-\s*recto\s*$/i, "");
  }
  base = base.replace(/^recto\s*\/\s*verso\s*-\s*/i, "").replace(/[\s-]+$/g, "");

  let finish = "";
  const plus = base.indexOf("+");
  if (plus >= 0) {
    finish = clean(base.slice(plus + 1).replace(/\s*\+\s*/g, " + "));
    base = base.slice(0, plus);
  }

  let grammage = "";
  const g = /(\d+)\s*(?:grs?|g)\b(?:\s*\/?\s*m\s*[²2])?/i.exec(base);
  if (g) {
    grammage = `${g[1]} g/m²`;
    base = base.replace(g[0], " ");
  }

  const material = clean(base.replace(/\s*\/\s*(?=\s*-|\s*$)/g, " ").replace(/(\s*-\s*){2,}/g, " - ").replace(/^[\s\-/]+|[\s\-/]+$/g, ""));
  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  return { material: cap(material) || "Standard", grammage, finish: cap(finish), sides };
}

export function buildCatalogue(categories: RawCategory[]): PrintCatalogue {
  const offers: Offer[] = [];
  let perSquareMetre = false;
  const seen = new Set<string>();

  for (const cat of categories) {
    const parsed = parseCategoryName(cat.name);
    // "Tarifs au m² par matière" is a table title, not a material: the rows themselves are the materials
    if (/^tarifs? au m²/i.test(cat.name)) parsed.material = "Standard";
    const sqm = cat.quantities.some((q) => /m²/i.test(q));
    if (sqm) perSquareMetre = true;
    // Tables with several rows of the same name (e.g. "Roll Up") are told apart by their dimension
    cat.rows.forEach((row, i) => {
      const prices: Record<string, string> = {};
      for (const q of cat.quantities) {
        const p = row.prices[q];
        if (p && p.trim() && p.trim() !== "-") prices[q] = p.trim();
      }
      if (Object.keys(prices).length === 0) return;
      const offer: Offer = {
        key: `${cat.id}#${i}`,
        categoryId: cat.id,
        categoryName: cat.name,
        formatKey: `${row.format}|${row.dimension}`,
        format: row.format,
        dimension: row.dimension,
        ...parsed,
        prices,
        quantityOrder: cat.quantities.filter((q) => prices[q]),
      };
      // Two tables mapping to the same choices would be ambiguous: keep the first one only
      const sig = [offer.formatKey, offer.material, offer.grammage, offer.sides, offer.finish].join("§");
      if (seen.has(sig)) return;
      seen.add(sig);
      offers.push(offer);
    });
  }
  return { offers, perSquareMetre };
}

/* ───────────── values & labels ───────────── */

export function valueOf(o: Offer, dim: Exclude<Dim, "quantity">): string {
  switch (dim) {
    case "format": return o.formatKey;
    case "material": return o.material;
    case "grammage": return o.grammage;
    case "sides": return o.sides;
    case "finish": return o.finish;
  }
}

export function labelOf(dim: Dim, value: string, offers: Offer[]): string {
  if (dim === "format") {
    const o = offers.find((x) => x.formatKey === value);
    return o ? (o.dimension ? `${o.format} — ${o.dimension}` : o.format) : value;
  }
  if (dim === "sides") return value === "recto" ? "Recto (1 face)" : value === "recto-verso" ? "Recto verso (2 faces)" : value;
  if (dim === "finish") return value || "Sans finition";
  if (dim === "grammage") return value || "Standard";
  if (dim === "quantity") return value.replace(/\s*ex$/i, " ex.");
  return value;
}

/** Product-specific wording (a panel is not a business card). */
export const DIM_LABELS: Record<string, Partial<Record<Dim, string>>> = {
  default: { format: "Format et dimensions", material: "Papier / matériau", grammage: "Grammage", sides: "Impression", finish: "Finition", quantity: "Quantité" },
  panneaux: { format: "Matériau et épaisseur", quantity: "Tarif" },
  baches: { format: "Surface cumulée" },
  "roll-up": { format: "Dimensions", material: "Support" },
  autocollants: { material: "Support" },
};

export function dimLabel(slug: string, dim: Dim): string {
  return DIM_LABELS[slug]?.[dim] ?? DIM_LABELS.default[dim]!;
}

/** Short plain-language explanations of technical terms. */
const GLOSSARY: { test: RegExp; text: string }[] = [
  { test: /fsc/i, text: "FSC : papier issu de forêts gérées durablement." },
  { test: /soft[- ]?touch/i, text: "Soft-Touch : pelliculage mat au toucher doux et velouté." },
  { test: /pelliculage mat/i, text: "Pelliculage mat : film mat qui protège le papier et lui donne un aspect sobre." },
  { test: /vernis uv/i, text: "Vernis UV : vernis brillant qui protège la surface et fait ressortir les couleurs." },
  { test: /vernis s[ée]lectif/i, text: "Vernis sélectif : vernis appliqué uniquement sur certaines zones du visuel." },
  { test: /dos bleu/i, text: "Dos bleu : papier d'affichage dont le verso est bleu, pour éviter la transparence lors du collage." },
  { test: /inscriptible|cachetable/i, text: "Inscriptible / cachetable : on peut écrire dessus au stylo et y apposer un tampon." },
  { test: /recycl/i, text: "Recyclé : fabriqué à partir de fibres recyclées." },
  { test: /fluo/i, text: "Fluo : support aux couleurs vives fluorescentes." },
  { test: /m1/i, text: "M1 : classement de réaction au feu (matériau difficilement inflammable)." },
];

export function explain(...values: string[]): string[] {
  const out: string[] = [];
  for (const g of GLOSSARY) if (values.some((v) => g.test.test(v)) && !out.includes(g.text)) out.push(g.text);
  return out;
}

export const GRAMMAGE_HELP = "Grammage : le poids du papier en g/m². Plus il est élevé, plus le papier est épais et rigide.";
export const SIDES_HELP = "Recto : une seule face imprimée. Recto verso : les deux faces sont imprimées.";

/* ───────────── selection logic ───────────── */

function matching(offers: Offer[], sel: Partial<Selection>, upTo: Dim): Offer[] {
  const idx = DIM_ORDER.indexOf(upTo);
  return offers.filter((o) =>
    DIM_ORDER.slice(0, idx).every((d) => d === "quantity" || sel[d] === undefined || valueOf(o, d) === sel[d])
  );
}

function ordered(values: string[]): string[] {
  return [...new Set(values)];
}

/** Values of `dim` that really exist given the choices made before it. */
export function candidates(offers: Offer[], sel: Partial<Selection>, dim: Dim): string[] {
  const pool = matching(offers, sel, dim);
  if (dim === "quantity") return ordered(pool.flatMap((o) => o.quantityOrder));
  return ordered(pool.map((o) => valueOf(o, dim)));
}

/** Every value of `dim` in the catalogue, whether or not it fits the current choices. */
export function allValues(offers: Offer[], dim: Dim): string[] {
  if (dim === "quantity") return ordered(offers.flatMap((o) => o.quantityOrder));
  return ordered(offers.map((o) => valueOf(o, dim)));
}

export type Prefs = Partial<Record<Dim, string | RegExp>>;
/** Reasonable first choice for the most common products (otherwise the first table row, without finish). */
export const PREFS: Record<string, Prefs> = {
  "cartes-de-visite": { material: "FSC", grammage: "300 g/m²", sides: "recto", quantity: "500 ex" },
  flyers: { format: /^A6[|]/, material: "FSC", grammage: "130 g/m²", quantity: "500 ex" },
  depliants: { format: /^A5 plié en 2/, material: "FSC", quantity: "500 ex" },
  affiches: { format: /^A3[|]/, material: "FSC", sides: "recto", quantity: "100 ex" },
};

function pick(dim: Dim, values: string[], prefs?: Prefs): string {
  if (values.length === 0) return "";
  const want = prefs?.[dim];
  if (want !== undefined) {
    const hit = values.find((v) => (typeof want === "string" ? v === want : want.test(v)));
    if (hit !== undefined) return hit;
  }
  if (dim === "finish" && values.includes("")) return "";
  return values[0];
}

export interface Resolved { sel: Selection; notices: string[] }

/**
 * Re-validate every choice after `from` (or all of them): a choice that no longer exists with the earlier ones
 * is replaced by the first valid option, and the change is reported so it can be explained to the visitor.
 */
export function resolve(offers: Offer[], previous: Partial<Selection>, from: Dim | null, labels: (d: Dim) => string, prefs?: Prefs): Resolved {
  const sel: Partial<Selection> = { ...previous };
  const notices: string[] = [];
  const start = from === null ? 0 : DIM_ORDER.indexOf(from) + 1;

  DIM_ORDER.forEach((dim, i) => {
    if (i < start) return;
    const values = candidates(offers, sel, dim);
    const current = sel[dim];
    if (current !== undefined && values.includes(current)) return;
    const next = pick(dim, values, prefs);
    if (current !== undefined && current !== "" && next !== current && values.length > 0) {
      notices.push(`${labels(dim)} : « ${labelOf(dim, current, offers)} » n'est pas disponible avec ce choix — remplacé par « ${labelOf(dim, next, offers)} ».`);
    }
    sel[dim] = next;
  });
  return { sel: sel as Selection, notices };
}

export function matchOffer(offers: Offer[], sel: Selection): Offer | undefined {
  return offers.find((o) => (["format", "material", "grammage", "sides", "finish"] as const).every((d) => valueOf(o, d) === sel[d]));
}

/* ───────────── prices ───────────── */

export interface PriceView {
  /** text exactly as published in the table, e.g. "46 €" or "18,30 à 22,50 €" */
  text: string;
  /** set only when the cell is a single amount */
  amount?: number;
  quantity?: number;
}

export const parseAmount = (t: string): number | undefined => {
  const m = /^\s*([\d\s.]+(?:,\d+)?)\s*€\s*$/.exec(t.replace(/ /g, " "));
  if (!m) return undefined;
  const n = Number(m[1].replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};

export function priceFor(offer: Offer | undefined, qty: string): PriceView | undefined {
  const text = offer?.prices[qty];
  if (!text) return undefined;
  const q = /^(\d+)\s*ex$/i.exec(qty.trim());
  return { text, amount: parseAmount(text), quantity: q ? Number(q[1]) : undefined };
}

const eur = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 3 });
export const unitPriceText = (p: PriceView): string | null =>
  p.amount !== undefined && p.quantity && p.quantity > 1 ? `soit ${eur.format(p.amount / p.quantity)} € HT / ex.` : null;

/* ───────────── hand-off to the forms ───────────── */

export interface Summary { product: string; format: string; paper: string; sides: string; finish: string; quantity: string; price: string }

export function summarise(productName: string, offers: Offer[], sel: Selection, price: PriceView | undefined, perSqm: boolean): Summary {
  const o = matchOffer(offers, sel);
  const paper = o ? [o.material !== "Standard" ? o.material : "", o.grammage].filter(Boolean).join(" ") || "Standard" : "";
  return {
    product: productName,
    format: o ? labelOf("format", o.formatKey, offers) : "",
    paper,
    sides: o && o.sides !== "unique" ? labelOf("sides", o.sides, offers) : "",
    finish: o?.finish || "",
    quantity: perSqm ? "" : labelOf("quantity", sel.quantity, offers),
    price: price ? `${price.text} HT${perSqm ? " / m²" : ""}` : "",
  };
}

/** Query string understood by /devis-sur-mesure (quote form) — every choice travels with the visitor. */
export function quoteQuery(s: Summary, extra: Record<string, string>): string {
  const qs = new URLSearchParams({ prefill: "impression", product: s.product, ...extra });
  if (s.format) qs.set("format", s.format);
  const paper = [s.paper, s.sides].filter(Boolean).join(" — ");
  if (paper) qs.set("paper", paper);
  if (s.finish) qs.set("finish", s.finish);
  const n = /^(\d+)/.exec(s.quantity);
  if (n) qs.set("qty", n[1]);
  if (s.price) qs.set("price", s.price);
  return qs.toString();
}
