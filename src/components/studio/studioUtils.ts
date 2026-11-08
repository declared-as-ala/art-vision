import type { StudioElement } from "./studioTypes";

/** 1 mm ≈ 3.78 px at 96 DPI (screen units used by the canvas). */
export const MM_TO_PX = 3.7795275591;

export const STUDIO_FONTS = [
  { name: "Montserrat", label: "Montserrat", tag: "Moderne", sample: "Art Vision" },
  { name: "Playfair Display", label: "Playfair Display", tag: "Élégant", sample: "Art Vision" },
  { name: "Inter", label: "Inter", tag: "Épuré", sample: "Art Vision" },
  { name: "Cinzel", label: "Cinzel", tag: "Classique", sample: "ART VISION" },
  { name: "Oswald", label: "Oswald", tag: "Impact", sample: "ART VISION" },
] as const;

export const STUDIO_PALETTE = [
  "#000000",
  "#ffffff",
  "#08051F",
  "#1A1238",
  "#6C2BD9",
  "#D72888",
  "#FF6A00",
  "#f59e0b",
  "#d4af37",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#ec4899",
  "#94a3b8",
];

/** The CSS Google Fonts stylesheet that provides every studio typeface. */
export const STUDIO_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;600;700;800&family=Montserrat:wght@300;400;600;700;800&family=Oswald:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&display=swap";

/** Which colour property an element type exposes in the quick inspector. */
export function getColorKey(el: StudioElement): "color" | "fill" | "stroke" {
  if (el.type === "text") return "color";
  if (el.type === "line") return "stroke";
  return "fill";
}

export function getElementColor(el: StudioElement): string {
  const key = getColorKey(el);
  const value = el[key];
  if (value && value !== "transparent") return value;
  return key === "color" ? "#ffffff" : "#6C2BD9";
}

export type DpiLevel = "excellent" | "ok" | "low";

export interface DpiReport {
  dpi: number;
  level: DpiLevel;
  label: string;
  /** 0-100 gauge fill (300 DPI = 100 %). */
  percent: number;
}

/**
 * Effective print resolution of an image element:
 * source pixels divided by the printed width in inches.
 */
export function getImageDpi(el: StudioElement): DpiReport | null {
  if (el.type !== "image" || !el.naturalWidth || !el.naturalHeight) return null;
  const printedWidthIn = el.width / 25.4;
  const printedHeightIn = el.height / 25.4;
  if (printedWidthIn <= 0 || printedHeightIn <= 0) return null;
  // object-contain: the limiting axis defines the effective resolution
  const dpi = Math.round(
    Math.min(el.naturalWidth / printedWidthIn, el.naturalHeight / printedHeightIn)
  );
  if (dpi >= 300) {
    return { dpi, level: "excellent", label: "Qualité HD — prêt pour l'impression", percent: 100 };
  }
  if (dpi >= 150) {
    return {
      dpi,
      level: "ok",
      label: "Acceptable — léger manque de finesse",
      percent: Math.max(12, Math.round((dpi / 300) * 100)),
    };
  }
  return {
    dpi,
    level: "low",
    label: "Résolution insuffisante — risque de flou",
    percent: Math.max(8, Math.round((dpi / 300) * 100)),
  };
}

export const DPI_COLORS: Record<DpiLevel, { bar: string; text: string; glow: string }> = {
  excellent: { bar: "#10b981", text: "text-emerald-300", glow: "rgba(16,185,129,0.45)" },
  ok: { bar: "#FF6A00", text: "text-orange-300", glow: "rgba(255,106,0,0.45)" },
  low: { bar: "#ef4444", text: "text-red-300", glow: "rgba(239,68,68,0.45)" },
};

export function formatEuro(value: number): string {
  return value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
