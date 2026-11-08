import type { StudioDesign, StudioElement, StudioSide, StudioTemplate } from "./studioTypes";
import { STUDIO_TEMPLATES } from "./StudioTemplates";
import { createBlankDesign, getProduct, type StudioSpec } from "./studioProducts";

/** CSS px per mm used by the editor (font sizes are expressed in these px). */
const PX = 3.7795;

interface Theme {
  id: string;
  label: string; // filter label
  name: string;
  bg: string;
  bg2: string;
  fg: string;
  muted: string;
  accent: string;
  accent2: string;
  onAccent: string;
  head: string;
  body: string;
}

const THEMES: Theme[] = [
  { id: "nuit", label: "Sombre", name: "Nuit Violette", bg: "#08051F", bg2: "#1A1238", fg: "#ffffff", muted: "#b9b3d6", accent: "#FF6A00", accent2: "#D72888", onAccent: "#ffffff", head: "Montserrat", body: "Montserrat" },
  { id: "blanc", label: "Clair", name: "Blanc Épuré", bg: "#ffffff", bg2: "#f1eefb", fg: "#14102b", muted: "#6b6880", accent: "#6C2BD9", accent2: "#D72888", onAccent: "#ffffff", head: "Montserrat", body: "Montserrat" },
  { id: "or", label: "Premium", name: "Noir & Or", bg: "#0a0a0c", bg2: "#17171b", fg: "#f4efe0", muted: "#a59f8a", accent: "#d4af37", accent2: "#f0d77a", onAccent: "#0a0a0c", head: "Playfair Display", body: "Montserrat" },
  { id: "nature", label: "Nature", name: "Vert Sauge", bg: "#e7eddf", bg2: "#2f4a2a", fg: "#23381f", muted: "#5b7a4b", accent: "#2f4a2a", accent2: "#9db38a", onAccent: "#e7eddf", head: "Playfair Display", body: "Montserrat" },
  { id: "rose", label: "Doux", name: "Rosé Poudré", bg: "#f7e4e1", bg2: "#6b2e35", fg: "#5a2229", muted: "#8d4a52", accent: "#6b2e35", accent2: "#e3a9a3", onAccent: "#f7e4e1", head: "Playfair Display", body: "Montserrat" },
  { id: "impact", label: "Impact", name: "Impact Orange", bg: "#FF6A00", bg2: "#18181b", fg: "#18181b", muted: "#3a1d00", accent: "#18181b", accent2: "#ffffff", onAccent: "#ffffff", head: "Oswald", body: "Oswald" },
];

type T = Partial<StudioElement> & { fontSize: number; color: string };

const text = (id: string, x: number, y: number, w: number, h: number, value: string, o: T): StudioElement => ({
  id,
  type: "text",
  x: r1(x),
  y: r1(y),
  width: r1(w),
  height: r1(h),
  text: value,
  fontFamily: "Montserrat",
  textAlign: "left",
  ...o,
  fontSize: r1(o.fontSize),
});
const rect = (id: string, x: number, y: number, w: number, h: number, fill: string, extra: Partial<StudioElement> = {}): StudioElement => ({
  id, type: "rect", x: r1(x), y: r1(y), width: r1(w), height: r1(h), fill, ...extra,
});
const circle = (id: string, x: number, y: number, d: number, fill: string, extra: Partial<StudioElement> = {}): StudioElement => ({
  id, type: "circle", x: r1(x), y: r1(y), width: r1(d), height: r1(d), fill, ...extra,
});
const line = (id: string, x: number, y: number, w: number, color: string, thick: number): StudioElement => ({
  id, type: "line", x: r1(x), y: r1(y), width: r1(w), height: 1, stroke: color, strokeWidth: r1(thick),
});
function r1(n: number) {
  return Math.round(n * 10) / 10;
}
/** Font size (px) from a glyph size in mm, shrunk so `chars` characters fit in `boxW` mm. */
const fs = (sizeMm: number, chars = 0, boxW = 0) => {
  const fit = chars && boxW ? Math.min(sizeMm, boxW / (chars * 0.72)) : sizeMm;
  return fit * PX;
};
const lineH = (sizeMm: number, lines = 1) => sizeMm * 1.25 * lines;

function sideOf(bg: string, elements: StudioElement[]): StudioSide {
  return { backgroundColor: bg, elements };
}

/* ───────────── Layouts ───────────── */

function flyerLayout(t: Theme, W: number, H: number): { recto: StudioSide; verso: StudioSide } {
  const b = Math.min(W, H);
  const m = b * 0.08;
  const portrait = H >= W;
  const dark = t.bg === "#08051F" || t.bg === "#0a0a0c" || t.bg === "#FF6A00" ? true : false;
  const circleD = b * (portrait ? 0.36 : 0.4);
  const colW = portrait ? W - m * 2 : W * 0.56 - m;

  const head = (portrait ? b * 0.13 : b * 0.15);
  const headLines = ["VOTRE", "OFFRE", "SPÉCIALE"];
  const headSize = Math.min(head, colW / (8 * 0.74));
  const headY = portrait ? H * 0.13 : H * 0.2;
  const headH = lineH(headSize, 3) * 0.9;

  const recto: StudioElement[] = [
    rect("band", 0, 0, W, Math.max(2, H * 0.03), t.accent),
    text("tag", m, portrait ? H * 0.07 : H * 0.1, colW, lineH(b * 0.04), "NOUVEAUTÉ · ÉDITION LIMITÉE", {
      fontSize: fs(b * 0.034, 28, colW), fontWeight: "600", color: t.accent === t.fg ? t.muted : t.accent === "#18181b" ? t.fg : t.accent, letterSpacing: 2, fontFamily: t.body,
    }),
    text("title", m, headY, colW, headH, headLines.join("\n"), {
      fontSize: headSize * PX, fontWeight: "800", color: t.fg, fontFamily: t.head, lineHeight: 1.05,
    }),
    line("rule", m, headY + headH + b * 0.03, b * 0.2, t.accent2, Math.max(0.6, b * 0.008)),
    text("sub", m, headY + headH + b * 0.07, colW, lineH(b * 0.045, 3), "Décrivez en une phrase ce que vous proposez\net pourquoi vos clients doivent venir.", {
      fontSize: fs(b * 0.04, 42, colW), color: t.muted, fontFamily: t.body, lineHeight: 1.35,
    }),
    circle("badge", portrait ? W - m - circleD : W - m - circleD, portrait ? H * 0.56 : H * 0.18, circleD, t.accent),
    text("badge-t", portrait ? W - m - circleD : W - m - circleD, (portrait ? H * 0.56 : H * 0.18) + circleD * 0.3, circleD, lineH(circleD * 0.3), "−20%", {
      fontSize: fs(circleD * 0.28), fontWeight: "800", color: t.onAccent, textAlign: "center", fontFamily: t.head,
    }),
    text("badge-s", portrait ? W - m - circleD : W - m - circleD, (portrait ? H * 0.56 : H * 0.18) + circleD * 0.62, circleD, lineH(circleD * 0.1), "SUR TOUT LE MAGASIN", {
      fontSize: fs(circleD * 0.075, 20, circleD * 0.8), fontWeight: "600", color: t.onAccent, textAlign: "center", letterSpacing: 1, fontFamily: t.body,
    }),
    rect("footer", 0, H * 0.84, W, H * 0.16, dark ? t.bg2 : t.accent),
    text("contact", m, H * 0.84 + H * 0.045, W - m * 2, lineH(b * 0.04, 2), "06 00 00 00 00  ·  contact@votre-site.fr\n12 rue Exemple, 75000 Ville", {
      fontSize: fs(b * 0.038, 34, W - m * 2), fontWeight: "600", color: dark ? t.fg : t.onAccent, fontFamily: t.body, lineHeight: 1.4,
    }),
  ];

  const verso: StudioElement[] = [
    rect("band", 0, 0, W, Math.max(2, H * 0.03), t.accent),
    text("title", m, H * 0.1, W - m * 2, lineH(b * 0.09, 2), "Pourquoi\nnous choisir ?", {
      fontSize: fs(b * 0.085, 12, W - m * 2), fontWeight: "800", color: t.fg, fontFamily: t.head, lineHeight: 1.1,
    }),
    line("rule", m, H * 0.1 + lineH(b * 0.09, 2) + b * 0.03, b * 0.2, t.accent2, Math.max(0.6, b * 0.008)),
    text("list", m, H * 0.1 + lineH(b * 0.09, 2) + b * 0.08, W - m * 2, lineH(b * 0.05, 7), "✓  Premier avantage de votre offre\n\n✓  Deuxième avantage important\n\n✓  Troisième argument qui rassure\n\n✓  Un dernier point fort", {
      fontSize: fs(b * 0.05, 34, W - m * 2), color: t.fg, fontFamily: t.body, lineHeight: 1.3,
    }),
  ];
  return { recto: sideOf(t.bg, recto), verso: sideOf(t.bg, verso) };
}

function voucherLayout(t: Theme, W: number, H: number): { recto: StudioSide; verso: StudioSide } {
  const b = Math.min(W, H);
  const inset = b * 0.055;
  const m = b * 0.12;
  const fw = W - m * 2;
  const rows = [
    ["Offert à", "…………………………………………"],
    ["Montant", "…………… €"],
    ["Valable jusqu'au", "……… / ……… / ………"],
  ];
  const portrait = H > W;
  const titleSize = Math.min(b * (portrait ? 0.13 : 0.15), fw / (10 * 0.74));
  const top = H * 0.14;
  const rowY = H * (portrait ? 0.43 : 0.5);
  const rowStep = H * (portrait ? 0.1 : 0.12);
  const recto: StudioElement[] = [
    rect("frame", inset, inset, W - inset * 2, H - inset * 2, "transparent", { stroke: t.accent, strokeWidth: Math.max(0.3, b * 0.004) }),
    text("title", m, top, fw, lineH(titleSize), "BON CADEAU", {
      fontSize: titleSize * PX, fontWeight: "800", color: t.accent === t.bg ? t.fg : t.accent, textAlign: "center", fontFamily: t.head, letterSpacing: 3,
    }),
    text("sub", m, top + lineH(titleSize) + b * 0.01, fw, lineH(b * 0.04), "Offrez un moment d'exception", {
      fontSize: fs(b * 0.04, 30, fw), color: t.muted, textAlign: "center", fontFamily: t.body,
    }),
    ...rows.flatMap(([label, val], i) => [
      text(`lab-${i}`, m, rowY + i * rowStep, fw * 0.38, lineH(b * 0.04), label, {
        fontSize: fs(b * 0.04, 18, fw * 0.38), fontWeight: "600", color: t.fg, fontFamily: t.body,
      }),
      text(`val-${i}`, m + fw * 0.4, rowY + i * rowStep, fw * 0.6, lineH(b * 0.04), val, {
        fontSize: fs(b * 0.04, 26, fw * 0.6), color: t.muted, fontFamily: t.body,
      }),
    ]),
    text("brand", m, H - inset - b * 0.12, fw, lineH(b * 0.035), "VOTRE ENTREPRISE · 06 00 00 00 00 · votre-site.fr", {
      fontSize: fs(b * 0.032, 48, fw), color: t.muted, textAlign: "center", letterSpacing: 1, fontFamily: t.body,
    }),
  ];
  const verso: StudioElement[] = [
    rect("frame", inset, inset, W - inset * 2, H - inset * 2, "transparent", { stroke: t.accent, strokeWidth: Math.max(0.3, b * 0.004) }),
    text("title", m, H * 0.14, fw, lineH(b * 0.07), "Conditions d'utilisation", {
      fontSize: fs(b * 0.065, 24, fw), fontWeight: "800", color: t.fg, fontFamily: t.head,
    }),
    text("body", m, H * 0.14 + lineH(b * 0.07) + b * 0.04, fw, lineH(b * 0.04, 6), "• Bon valable pour une seule utilisation.\n• Non remboursable, non échangeable contre espèces.\n• Sur présentation de ce bon, sur rendez-vous.", {
      fontSize: fs(b * 0.04, 52, fw), color: t.muted, fontFamily: t.body, lineHeight: 1.45,
    }),
  ];
  return { recto: sideOf(t.bg, recto), verso: sideOf(t.bg, verso) };
}

function bannerLayout(t: Theme, W: number, H: number): { recto: StudioSide; verso: StudioSide } {
  const b = Math.min(W, H);
  const m = b * 0.07;
  const fw = W - m * 2;
  const bandH = H * (W >= H ? 0.22 : 0.14);
  const headSize = Math.min(H * (W >= H ? 0.22 : 0.11), fw / (13 * 0.74));
  const elements: StudioElement[] = [
    rect("accent", 0, H - bandH, W, bandH, t.accent),
    rect("stripe", 0, H - bandH - b * 0.012, W, b * 0.012, t.accent2),
    text("title", m, H * 0.12, fw, lineH(headSize, 2), "VOTRE MESSAGE\nEN GRAND", {
      fontSize: headSize * PX, fontWeight: "800", color: t.fg, fontFamily: t.head, lineHeight: 1.05, textAlign: "left",
    }),
    text("sub", m, H * 0.12 + lineH(headSize, 2) + b * 0.03, fw, lineH(headSize * 0.4), "Une phrase d'accroche lisible à distance", {
      fontSize: fs(headSize * 0.36, 40, fw), color: t.muted, fontFamily: t.body,
    }),
    text("contact", m, H - bandH + bandH * 0.3, fw, lineH(bandH * 0.3), "06 00 00 00 00  ·  votre-site.fr", {
      fontSize: fs(bandH * 0.3, 32, fw), fontWeight: "800", color: t.onAccent, fontFamily: t.head,
    }),
  ];
  return { recto: sideOf(t.bg, elements), verso: sideOf("#ffffff", []) };
}

const LAYOUTS = {
  flyers: flyerLayout,
  "bons-cadeaux": voucherLayout,
  baches: bannerLayout,
} as const;

/** Templates sized exactly for the given spec. */
export function getTemplatesFor(spec: StudioSpec): StudioTemplate[] {
  if (spec.productId === "cartes-de-visite") return STUDIO_TEMPLATES;
  const product = getProduct(spec.productId);
  if (!product) return [];
  const layout = LAYOUTS[spec.productId as keyof typeof LAYOUTS];
  const base = createBlankDesign(spec);

  return THEMES.map((theme) => {
    const { recto, verso } = layout(theme, spec.widthMm, spec.heightMm);
    const design: StudioDesign = { ...base, id: `gen-${spec.key}-${theme.id}`, recto, verso: product.hasVerso ? verso : sideOf("#ffffff", []) };
    return {
      id: `gen-${spec.productId}-${theme.id}`,
      name: `${product.shortName} ${theme.name}`,
      category: "promo" as const,
      categoryLabel: theme.label,
      productSlug: product.orderSlug,
      thumbnailUrl: "",
      design,
      formatIds: [spec.formatId],
    };
  });
}

/** Look up a template by id for a spec (generated ones are rebuilt at the right size). */
export function findTemplate(spec: StudioSpec, id: string): StudioTemplate | null {
  return getTemplatesFor(spec).find((t) => t.id === id) ?? null;
}
