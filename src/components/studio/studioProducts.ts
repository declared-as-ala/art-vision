import type { StudioDesign, StudioSide } from "./studioTypes";

export type StudioProductId =
  | "cartes-de-visite"
  | "cartes-fidelite"
  | "flyers"
  | "bons-cadeaux"
  | "cartes-postales"
  | "affiches"
  | "roll-up"
  | "baches";
export type Orientation = "portrait" | "landscape";

export interface StudioFormat {
  id: string;
  label: string;
  /** Dimensions in the format's natural orientation. */
  widthMm: number;
  heightMm: number;
  /** Whether portrait / landscape is a meaningful choice. */
  orientable: boolean;
  /** Natural orientation (the one widthMm × heightMm describes). */
  natural: Orientation;
  note?: string;
  /** Title label when the generic label is not enough ("85 × 200 cm") */
  shortLabel?: string;
  /** false when the catalog offers this format single-sided only */
  versoAvailable?: boolean;
}

export interface CustomSizeRule {
  minCm: number;
  maxCm: number;
  maxAreaM2: number;
  defaultWidthCm: number;
  defaultHeightCm: number;
}

export interface StudioProduct {
  id: StudioProductId;
  name: string;
  /** Short singular used in labels ("Flyer", "Bon cadeau"…). */
  shortName: string;
  description: string;
  image: string;
  formats: StudioFormat[];
  custom?: CustomSizeRule;
  bleedMm: number;
  safeMarginMm: number;
  /** false => single-sided document (no verso). */
  hasVerso: boolean;
  /** Key in src/data/studio-catalog.json */
  catalogKey: StudioProductId;
  /** Slug in the public print catalog (/impression/<slug>) */
  catalogSlug: string;
  /** "instant" = priced from the catalog matrix, "quote" = estimate + quote request */
  mode: "instant" | "quote";
  /** Slug used by the persistence/order layer */
  orderSlug: string;
}

export const STUDIO_PRODUCTS: StudioProduct[] = [
  {
    id: "cartes-de-visite",
    name: "Cartes de visite",
    shortName: "Carte de visite",
    description: "Le support incontournable pour vos rendez-vous.",
    image: "/images/impression/16-cartes-de-visite-art-vision.webp",
    formats: [
      { id: "cdv", label: "Carte de visite", widthMm: 85, heightMm: 55, orientable: false, natural: "landscape" },
    ],
    bleedMm: 2,
    safeMarginMm: 3,
    hasVerso: true,
    catalogKey: "cartes-de-visite",
    catalogSlug: "cartes-de-visite",
    mode: "instant",
    orderSlug: "cartes-de-visite",
  },
  {
    id: "flyers",
    name: "Flyers",
    shortName: "Flyer",
    description: "Promotions, événements, ouvertures ou menus.",
    image: "/images/impression/29-flyers-art-vision.webp",
    formats: [
      { id: "a6", label: "A6", widthMm: 105, heightMm: 148, orientable: true, natural: "portrait" },
      { id: "a5", label: "A5", widthMm: 148, heightMm: 210, orientable: true, natural: "portrait" },
      { id: "a4", label: "A4", widthMm: 210, heightMm: 297, orientable: true, natural: "portrait" },
      { id: "a3", label: "A3", widthMm: 297, heightMm: 420, orientable: true, natural: "portrait" },
      { id: "us", label: "Format US (105 × 210)", widthMm: 105, heightMm: 210, orientable: true, natural: "portrait" },
    ],
    bleedMm: 2,
    safeMarginMm: 3,
    hasVerso: true,
    catalogKey: "flyers",
    catalogSlug: "flyers",
    mode: "instant",
    orderSlug: "flyers",
  },
  {
    id: "bons-cadeaux",
    name: "Bons cadeaux",
    shortName: "Bon cadeau",
    description: "Instituts, boutiques, restaurants et spas.",
    image: "/images/impression/17-cartes-de-voeux-art-vision.webp",
    formats: [
      { id: "a6", label: "A6", widthMm: 148, heightMm: 105, orientable: true, natural: "landscape" },
      { id: "us", label: "Format US (105 × 210)", widthMm: 210, heightMm: 105, orientable: true, natural: "landscape" },
      { id: "a5", label: "A5", widthMm: 210, heightMm: 148, orientable: true, natural: "landscape" },
    ],
    bleedMm: 2,
    safeMarginMm: 3,
    hasVerso: true,
    catalogKey: "bons-cadeaux",
    catalogSlug: "cartes-de-voeux",
    mode: "instant",
    orderSlug: "bons-cadeaux",
  },
  {
    id: "cartes-fidelite",
    name: "Cartes de fidélité",
    shortName: "Carte de fidélité",
    description: "Cartes à tamponner ou à points, impression carton.",
    image: "/images/impression/16-cartes-de-visite-art-vision.webp",
    formats: [{ id: "cdv", label: "Carte de fidélité", widthMm: 85, heightMm: 55, orientable: false, natural: "landscape" }],
    bleedMm: 2,
    safeMarginMm: 3,
    hasVerso: true,
    catalogKey: "cartes-fidelite",
    catalogSlug: "cartes-de-visite",
    mode: "instant",
    orderSlug: "cartes-fidelite",
  },
  {
    id: "cartes-postales",
    name: "Cartes postales",
    shortName: "Carte postale",
    description: "Cartes postales A6 recto / verso.",
    image: "/images/impression/18-cartes-postales-art-vision.webp",
    formats: [{ id: "a6", label: "A6", widthMm: 148, heightMm: 105, orientable: true, natural: "landscape" }],
    bleedMm: 2,
    safeMarginMm: 3,
    hasVerso: true,
    catalogKey: "cartes-postales",
    catalogSlug: "cartes-postales",
    mode: "instant",
    orderSlug: "cartes-postales",
  },
  {
    id: "affiches",
    name: "Affiches",
    shortName: "Affiche",
    description: "Affiches du A4 au A1, papiers FSC ou recyclés.",
    image: "/images/impression/01-affiches-art-vision.webp",
    formats: [
      { id: "a4", label: "A4", widthMm: 210, heightMm: 297, orientable: true, natural: "portrait", versoAvailable: false },
      { id: "a3", label: "A3", widthMm: 297, heightMm: 420, orientable: true, natural: "portrait" },
      { id: "a2", label: "A2", widthMm: 420, heightMm: 594, orientable: true, natural: "portrait" },
      { id: "a1", label: "A1", widthMm: 594, heightMm: 841, orientable: true, natural: "portrait" },
    ],
    bleedMm: 2,
    safeMarginMm: 3,
    hasVerso: true,
    catalogKey: "affiches",
    catalogSlug: "affiches",
    mode: "instant",
    orderSlug: "affiches",
  },
  {
    id: "roll-up",
    name: "Roll-up",
    shortName: "Roll-up",
    description: "Roll-up enrouleur : toile vinyle 440 g ou tissu polyester.",
    image: "/images/impression/38-roll-up-art-vision.webp",
    formats: [
      { id: "ru85", label: "85 × 200 cm", shortLabel: "85 × 200 cm", widthMm: 850, heightMm: 2000, orientable: false, natural: "portrait" },
      { id: "ru100", label: "100 × 200 cm", shortLabel: "100 × 200 cm", widthMm: 1000, heightMm: 2000, orientable: false, natural: "portrait", versoAvailable: false },
      { id: "ru120", label: "120 × 200 cm", shortLabel: "120 × 200 cm", widthMm: 1200, heightMm: 2000, orientable: false, natural: "portrait", versoAvailable: false },
      { id: "ru150", label: "150 × 200 cm", shortLabel: "150 × 200 cm", widthMm: 1500, heightMm: 2000, orientable: false, natural: "portrait", versoAvailable: false },
      { id: "ru200", label: "200 × 200 cm", shortLabel: "200 × 200 cm", widthMm: 2000, heightMm: 2000, orientable: false, natural: "portrait", versoAvailable: false },
      { id: "tx200x220", label: "Tissu 200 × 220 cm", shortLabel: "tissu 200 × 220 cm", widthMm: 2000, heightMm: 2200, orientable: false, natural: "portrait", versoAvailable: false },
      { id: "tx200x250", label: "Tissu 200 × 250 cm", shortLabel: "tissu 200 × 250 cm", widthMm: 2000, heightMm: 2500, orientable: false, natural: "portrait", versoAvailable: false },
      { id: "tx200x300", label: "Tissu 200 × 300 cm", shortLabel: "tissu 200 × 300 cm", widthMm: 2000, heightMm: 3000, orientable: false, natural: "portrait", versoAvailable: false },
    ],
    bleedMm: 2,
    safeMarginMm: 3,
    hasVerso: true,
    catalogKey: "roll-up",
    catalogSlug: "roll-up",
    mode: "instant",
    orderSlug: "roll-up",
  },
  {
    id: "baches",
    name: "Bâches",
    shortName: "Bâche",
    description: "Bâches publicitaires PVC 510 g, dimensions sur mesure.",
    image: "/images/impression/05-baches-art-vision.webp",
    formats: [],
    custom: { minCm: 30, maxCm: 1000, maxAreaM2: 300, defaultWidthCm: 300, defaultHeightCm: 100 },
    bleedMm: 20,
    safeMarginMm: 30,
    hasVerso: false,
    catalogKey: "baches",
    catalogSlug: "baches",
    mode: "quote",
    orderSlug: "baches",
  },
];

export function getProduct(id: string | null | undefined): StudioProduct | null {
  return STUDIO_PRODUCTS.find((p) => p.id === id) ?? null;
}

export interface StudioSpec {
  productId: StudioProductId;
  formatId: string;
  orientation: Orientation;
  widthMm: number;
  heightMm: number;
  bleedMm: number;
  safeMarginMm: number;
  /** Whether a printed verso exists for this format */
  hasVerso: boolean;
  /** "Flyer A5" */
  title: string;
  /** "148 × 210 mm · Portrait" */
  dimensionsLabel: string;
  /** Stable key used for drafts / templates */
  key: string;
}

const fmt = (n: number) => String(Math.round(n * 10) / 10).replace(".", ",");
/** "148 × 210 mm" — or in cm once a side reaches 1 m */
export function dimensionsText(widthMm: number, heightMm: number): string {
  return Math.max(widthMm, heightMm) >= 1000 ? `${fmt(widthMm / 10)} × ${fmt(heightMm / 10)} cm` : `${fmt(widthMm)} × ${fmt(heightMm)} mm`;
}

export function orientationLabel(o: Orientation) {
  return o === "portrait" ? "Portrait" : "Paysage";
}

export function buildSpec(
  product: StudioProduct,
  formatId: string,
  orientation?: Orientation,
  customCm?: { w: number; h: number }
): StudioSpec | null {
  if (product.custom) {
    const rule = product.custom;
    const w = customCm?.w ?? rule.defaultWidthCm;
    const h = customCm?.h ?? rule.defaultHeightCm;
    if (!isValidCustomSize(product, w, h)) return null;
    const o: Orientation = w >= h ? "landscape" : "portrait";
    return {
      productId: product.id,
      formatId: "custom",
      orientation: o,
      hasVerso: false,
      widthMm: w * 10,
      heightMm: h * 10,
      bleedMm: product.bleedMm,
      safeMarginMm: product.safeMarginMm,
      title: `${product.shortName} sur mesure`,
      dimensionsLabel: `${fmt(w)} × ${fmt(h)} cm`,
      key: `${product.id}:custom:${fmt(w)}x${fmt(h)}`,
    };
  }
  const format = product.formats.find((f) => f.id === formatId);
  if (!format) return null;
  const o: Orientation = format.orientable ? orientation ?? format.natural : format.natural;
  const swap = o !== format.natural;
  const widthMm = swap ? format.heightMm : format.widthMm;
  const heightMm = swap ? format.widthMm : format.heightMm;
  return {
    productId: product.id,
    formatId: format.id,
    orientation: o,
    widthMm,
    heightMm,
    bleedMm: product.bleedMm,
    safeMarginMm: product.safeMarginMm,
    hasVerso: product.hasVerso && (format.versoAvailable ?? true),
    title: product.formats.length > 1 ? `${product.shortName} ${format.shortLabel ?? format.label.split(" ")[0]}` : product.shortName,
    dimensionsLabel: `${dimensionsText(widthMm, heightMm)}${format.orientable ? ` · ${orientationLabel(o)}` : ""}`,
    key: `${product.id}:${format.id}:${o}`,
  };
}

export function isValidCustomSize(product: StudioProduct, wCm: number, hCm: number): boolean {
  const rule = product.custom;
  if (!rule) return false;
  if (!Number.isFinite(wCm) || !Number.isFinite(hCm)) return false;
  if (wCm < rule.minCm || hCm < rule.minCm || wCm > rule.maxCm || hCm > rule.maxCm) return false;
  return (wCm * hCm) / 10000 <= rule.maxAreaM2;
}

export function customSizeError(product: StudioProduct, wCm: number, hCm: number): string | null {
  const rule = product.custom;
  if (!rule) return null;
  if (!Number.isFinite(wCm) || !Number.isFinite(hCm) || wCm <= 0 || hCm <= 0) return "Indiquez une largeur et une hauteur.";
  if (wCm < rule.minCm || hCm < rule.minCm) return `Chaque côté doit faire au moins ${rule.minCm} cm.`;
  if (wCm > rule.maxCm || hCm > rule.maxCm) return `Chaque côté est limité à ${rule.maxCm} cm. Au-delà, demandez un devis.`;
  if ((wCm * hCm) / 10000 > rule.maxAreaM2) return `Surface maximale : ${rule.maxAreaM2} m².`;
  return null;
}

/** Resolve a studio spec from URL search params (or return null when incomplete). */
export function specFromParams(params: { get(name: string): string | null }): StudioSpec | null {
  const product = getProduct(params.get("product"));
  if (!product) return null;
  if (product.custom) {
    const w = parseFloat((params.get("w") || "").replace(",", "."));
    const h = parseFloat((params.get("h") || "").replace(",", "."));
    if (!params.get("w") || !params.get("h")) return null;
    return buildSpec(product, "custom", undefined, { w, h });
  }
  let formatId = params.get("format");
  // Products with a single format open directly
  if (!formatId && product.formats.length === 1) formatId = product.formats[0].id;
  if (!formatId) return null;
  const orientation = params.get("orientation") === "portrait" ? "portrait" : params.get("orientation") === "landscape" ? "landscape" : undefined;
  return buildSpec(product, formatId, orientation);
}

export function specToQuery(spec: StudioSpec): string {
  const q = new URLSearchParams({ product: spec.productId });
  if (spec.formatId === "custom") {
    q.set("w", String(spec.widthMm / 10));
    q.set("h", String(spec.heightMm / 10));
  } else {
    q.set("format", spec.formatId);
    q.set("orientation", spec.orientation);
  }
  return q.toString();
}

export function createBlankDesign(spec: StudioSpec): StudioDesign {
  const product = getProduct(spec.productId)!;
  const empty = (): StudioSide => ({ backgroundColor: "#ffffff", elements: [] });
  return {
    id: `draft-${spec.key}`,
    productSlug: product.orderSlug,
    productName: product.name,
    formatName: `${spec.title} — ${spec.dimensionsLabel}`,
    widthMm: spec.widthMm,
    heightMm: spec.heightMm,
    bleedMm: spec.bleedMm,
    safeMarginMm: spec.safeMarginMm,
    activeSide: "recto",
    formatId: spec.formatId,
    orientation: spec.orientation,
    singleSided: !spec.hasVerso,
    recto: empty(),
    verso: empty(),
  };
}

/** Does the design still match the spec (dimensions) it is supposed to be for? */
export function designMatchesSpec(design: StudioDesign, spec: StudioSpec): boolean {
  return (
    design.productSlug === getProduct(spec.productId)?.orderSlug &&
    Math.abs(design.widthMm - spec.widthMm) < 0.05 &&
    Math.abs(design.heightMm - spec.heightMm) < 0.05
  );
}

/** True when a side contains anything the user could lose. */
export function designHasContent(design: StudioDesign): boolean {
  return design.recto.elements.length > 0 || design.verso.elements.length > 0;
}

/* ───────────── Drafts (one per product + format + orientation) ───────────── */

export const DRAFT_PREFIX = "art_vision_studio_draft_v2_";
export const draftKey = (spec: StudioSpec) => `${DRAFT_PREFIX}${spec.key}`;
export const previousDraftKey = (spec: StudioSpec) => `${DRAFT_PREFIX}previous_${spec.key}`;

export interface StoredDraftInfo {
  key: string;
  specKey: string;
  title: string;
  dimensionsLabel: string;
  productId: StudioProductId;
  formatId: string;
  orientation: Orientation;
  widthMm: number;
  heightMm: number;
  updatedAt: number;
}

export function readDraft(spec: StudioSpec): StudioDesign | null {
  try {
    const raw = localStorage.getItem(draftKey(spec));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { design?: StudioDesign; savedAt?: number };
    const design = parsed.design;
    if (!design?.recto || !design?.verso) return null;
    return designMatchesSpec(design, spec) ? design : null;
  } catch {
    return null;
  }
}

export function writeDraft(spec: StudioSpec, design: StudioDesign): boolean {
  try {
    localStorage.setItem(draftKey(spec), JSON.stringify({ design, savedAt: Date.now() }));
    return true;
  } catch {
    return false;
  }
}

export function listDrafts(): StoredDraftInfo[] {
  const out: StoredDraftInfo[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(DRAFT_PREFIX) || key.startsWith(`${DRAFT_PREFIX}previous_`)) continue;
      const parsed = JSON.parse(localStorage.getItem(key) || "null") as { design?: StudioDesign; savedAt?: number } | null;
      const d = parsed?.design;
      if (!d || !designHasContent(d)) continue;
      const product = STUDIO_PRODUCTS.find((p) => p.orderSlug === d.productSlug);
      if (!product) continue;
      const spec = buildSpec(
        product,
        d.formatId || product.formats[0]?.id || "custom",
        d.orientation,
        product.custom ? { w: d.widthMm / 10, h: d.heightMm / 10 } : undefined
      );
      if (!spec || !designMatchesSpec(d, spec)) continue;
      out.push({
        key,
        specKey: spec.key,
        title: spec.title,
        dimensionsLabel: spec.dimensionsLabel,
        productId: spec.productId,
        formatId: spec.formatId,
        orientation: spec.orientation,
        widthMm: spec.widthMm,
        heightMm: spec.heightMm,
        updatedAt: parsed?.savedAt ?? 0,
      });
    }
  } catch {
    /* storage unavailable */
  }
  return out.sort((a, b) => b.updatedAt - a.updatedAt);
}
