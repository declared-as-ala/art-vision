import { jsPDF } from "jspdf";
import { StudioDesign, StudioSide, StudioElement } from "./studioTypes";

/** Target print resolution. Very large formats are rendered at a lower, still proportional, resolution. */
const TARGET_DPI = 300;
const MAX_PIXELS_PER_SIDE = 14_000_000;
const MAX_SIDE_PX = 9000;

type LetterSpacingCtx = CanvasRenderingContext2D & { letterSpacing?: string };

/** Largest DPI (≤ 300) that keeps the canvas inside browser limits for a given page size. */
export function getExportDpi(totalWidthMm: number, totalHeightMm: number): number {
  const wIn = totalWidthMm / 25.4;
  const hIn = totalHeightMm / 25.4;
  let dpi = TARGET_DPI;
  while ((wIn * dpi) * (hIn * dpi) > MAX_PIXELS_PER_SIDE || wIn * dpi > MAX_SIDE_PX || hIn * dpi > MAX_SIDE_PX) {
    dpi *= 0.92;
    if (dpi < 10) break;
  }
  return Math.round(dpi * 10) / 10;
}

export async function renderSideToCanvas(
  side: StudioSide,
  widthMm: number,
  heightMm: number,
  includeBleed: boolean,
  bleedMm: number = 2,
  dpi?: number
): Promise<HTMLCanvasElement> {
  const totalWidthMm = includeBleed ? widthMm + bleedMm * 2 : widthMm;
  const totalHeightMm = includeBleed ? heightMm + bleedMm * 2 : heightMm;
  const scale = (dpi ?? getExportDpi(totalWidthMm, totalHeightMm)) / 25.4; // px per mm

  const canvasWidth = Math.round(totalWidthMm * scale);
  const canvasHeight = Math.round(totalHeightMm * scale);

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossible d'initialiser le contexte Canvas 2D");

  // Fill background (also covers the bleed area)
  ctx.fillStyle = side.backgroundColor || "#ffffff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Offset if bleed is included so elements placed at x=0 start after bleed
  const offset = includeBleed ? bleedMm * scale : 0;

  ctx.save();
  ctx.translate(offset, offset);
  for (const el of side.elements) {
    await renderElement(ctx, el, scale);
  }
  ctx.restore();
  return canvas;
}

function wrapParagraph(ctx: CanvasRenderingContext2D, paragraph: string, maxWidth: number): string[] {
  if (!paragraph) return [""];
  const words = paragraph.split(/(\s+)/).filter((w) => w.length > 0);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current + word;
    if (current && ctx.measureText(candidate.trimEnd()).width > maxWidth) {
      lines.push(current.trimEnd());
      current = word.trimStart();
    } else {
      current = candidate;
    }
  }
  lines.push(current.trimEnd());
  return lines;
}

async function renderElement(ctx: CanvasRenderingContext2D, el: StudioElement, scale: number) {
  const x = el.x * scale;
  const y = el.y * scale;
  const w = el.width * scale;
  const h = el.height * scale;

  ctx.save();

  if (el.opacity !== undefined) {
    ctx.globalAlpha = el.opacity;
  }

  // Handle rotation
  if (el.rotation) {
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.translate(-(x + w / 2), -(y + h / 2));
  }

  if (el.type === "rect") {
    ctx.fillStyle = el.fill || "transparent";
    if (el.borderRadius) {
      const r = el.borderRadius * scale;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
      if (el.stroke && el.strokeWidth) {
        ctx.strokeStyle = el.stroke;
        ctx.lineWidth = el.strokeWidth * scale;
        ctx.stroke();
      }
    } else {
      ctx.fillRect(x, y, w, h);
      if (el.stroke && el.strokeWidth) {
        ctx.strokeStyle = el.stroke;
        ctx.lineWidth = el.strokeWidth * scale;
        ctx.strokeRect(x, y, w, h);
      }
    }
  } else if (el.type === "circle") {
    ctx.fillStyle = el.fill || "transparent";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    if (el.stroke && el.strokeWidth) {
      ctx.strokeStyle = el.stroke;
      ctx.lineWidth = el.strokeWidth * scale;
      ctx.stroke();
    }
  } else if (el.type === "line") {
    ctx.strokeStyle = el.stroke || "#000000";
    ctx.lineWidth = (el.strokeWidth || 1) * scale;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
  } else if (el.type === "text" && el.text) {
    // Editor font sizes are CSS px at 3.78 px/mm; scale them to the export resolution
    const fontSizePx = (el.fontSize || 12) * (scale / 3.78);
    const weight = el.fontWeight || "normal";
    const style = el.fontStyle || "normal";
    const family = el.fontFamily ? `"${el.fontFamily}", sans-serif` : "Montserrat, sans-serif";
    ctx.font = `${style} ${weight} ${fontSizePx}px ${family}`;
    ctx.fillStyle = el.color || "#000000";
    ctx.textBaseline = "top";

    if (el.letterSpacing) {
      (ctx as LetterSpacingCtx).letterSpacing = `${el.letterSpacing * 0.5 * (scale / 3.78)}px`;
    }

    const lineHeightRatio = el.lineHeight || 1.3;
    const lineHeightPx = fontSizePx * lineHeightRatio;
    // CSS centres the glyphs inside the line box (half-leading)
    const halfLeading = ((lineHeightRatio - 1) * fontSizePx) / 2;

    // Same wrapping as the editor (box width), explicit line breaks preserved
    const lines = el.text.split("\n").flatMap((p) => wrapParagraph(ctx, p, w));

    lines.forEach((line, lineIndex) => {
      let renderX = x;
      if (el.textAlign === "center") {
        ctx.textAlign = "center";
        renderX = x + w / 2;
      } else if (el.textAlign === "right") {
        ctx.textAlign = "right";
        renderX = x + w;
      } else {
        ctx.textAlign = "left";
      }
      ctx.fillText(line, renderX, y + halfLeading + lineIndex * lineHeightPx);
    });
  } else if (el.type === "image" && el.src) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // object-contain, like the editor
        const ratio = img.width && img.height ? img.width / img.height : w / h;
        let dw = w;
        let dh = w / ratio;
        if (dh > h) {
          dh = h;
          dw = h * ratio;
        }
        ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
        resolve();
      };
      img.onerror = () => {
        // Draw placeholder if image fails to load
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(x, y, w, h);
        resolve();
      };
      img.src = el.src!;
    });
  }

  ctx.restore();
}

/** Make sure every typeface used by the design is loaded before drawing on canvas. */
async function ensureFontsLoaded(design: StudioDesign) {
  if (typeof document === "undefined" || !document.fonts) return;
  const used = new Set<string>();
  for (const side of [design.recto, design.verso]) {
    for (const el of side.elements) {
      if (el.type === "text") used.add(el.fontFamily || "Montserrat");
    }
  }
  try {
    await Promise.all(
      Array.from(used).flatMap((f) => [
        document.fonts.load(`400 24px "${f}"`),
        document.fonts.load(`700 24px "${f}"`),
        document.fonts.load(`800 24px "${f}"`),
      ])
    );
  } catch {
    // fall back to system fonts if a face fails to load
  }
}

/** JPEG data URL kept under a byte budget (quality, then resolution, are reduced as needed). */
function encodeUnder(canvas: HTMLCanvasElement, maxBytes: number): { url: string; width: number; height: number } {
  const qualities = [0.92, 0.85, 0.78, 0.7, 0.6, 0.5];
  let source = canvas;
  for (let pass = 0; pass < 3; pass++) {
    for (const q of qualities) {
      const url = source.toDataURL("image/jpeg", q);
      if ((url.length * 3) / 4 <= maxBytes) return { url, width: source.width, height: source.height };
    }
    const smaller = document.createElement("canvas");
    smaller.width = Math.round(source.width * 0.8);
    smaller.height = Math.round(source.height * 0.8);
    smaller.getContext("2d")!.drawImage(source, 0, 0, smaller.width, smaller.height);
    source = smaller;
  }
  return { url: source.toDataURL("image/jpeg", 0.5), width: source.width, height: source.height };
}

function thumbnail(canvas: HTMLCanvasElement, maxDim = 640): string {
  const ratio = Math.min(1, maxDim / Math.max(canvas.width, canvas.height));
  const t = document.createElement("canvas");
  t.width = Math.max(1, Math.round(canvas.width * ratio));
  t.height = Math.max(1, Math.round(canvas.height * ratio));
  t.getContext("2d")!.drawImage(canvas, 0, 0, t.width, t.height);
  return t.toDataURL("image/jpeg", 0.75);
}

export interface PrintExportInfo {
  pageWidthMm: number;
  pageHeightMm: number;
  pages: number;
  dpi: number;
  pixelWidth: number;
  pixelHeight: number;
  bleedMm: number;
  bytes: number;
}

export interface GeneratePdfOptions {
  /** Export the verso page (defaults to true unless the design is single-sided). */
  includeVerso?: boolean;
  /** Raw byte budget for all embedded images (keeps the order request under the host limit). */
  maxImageBytes?: number;
}

/**
 * Generate a print-ready PDF (page size = finished size + bleed, in real mm).
 * Resolution is 300 DPI whenever the format allows it.
 */
export async function generatePrintPdf(
  design: StudioDesign,
  includeBleed: boolean = true,
  options: GeneratePdfOptions = {}
): Promise<{ pdfBlob: Blob; previewRecto: string; previewVerso: string; info: PrintExportInfo }> {
  await ensureFontsLoaded(design);
  const withVerso = options.includeVerso ?? !design.singleSided;
  const bleedMm = includeBleed ? design.bleedMm : 0;
  const totalW = design.widthMm + bleedMm * 2;
  const totalH = design.heightMm + bleedMm * 2;
  const dpi = getExportDpi(totalW, totalH);
  const budget = (options.maxImageBytes ?? 2_600_000) / (withVerso ? 2 : 1);

  const canvasRecto = await renderSideToCanvas(design.recto, design.widthMm, design.heightMm, includeBleed, design.bleedMm, dpi);
  const encodedRecto = encodeUnder(canvasRecto, budget);
  const dataUrlRecto = encodedRecto.url;
  const previewRecto = thumbnail(canvasRecto);

  let dataUrlVerso = "";
  let previewVerso = "";
  if (withVerso) {
    const canvasVerso = await renderSideToCanvas(design.verso, design.widthMm, design.heightMm, includeBleed, design.bleedMm, dpi);
    dataUrlVerso = encodeUnder(canvasVerso, budget).url;
    previewVerso = thumbnail(canvasVerso);
  }

  const orientation = totalW >= totalH ? "landscape" : "portrait";
  const pdf = new jsPDF({ orientation, unit: "mm", format: [totalW, totalH], compress: true });
  pdf.addImage(dataUrlRecto, "JPEG", 0, 0, totalW, totalH);
  if (withVerso) {
    pdf.addPage([totalW, totalH], orientation);
    pdf.addImage(dataUrlVerso, "JPEG", 0, 0, totalW, totalH);
  }

  const pdfBlob = pdf.output("blob");
  return {
    pdfBlob,
    previewRecto,
    previewVerso,
    info: {
      pageWidthMm: Math.round(totalW * 10) / 10,
      pageHeightMm: Math.round(totalH * 10) / 10,
      pages: withVerso ? 2 : 1,
      // effective resolution of the image actually embedded in the PDF
      dpi: Math.round((encodedRecto.width / (totalW / 25.4)) * 10) / 10,
      pixelWidth: encodedRecto.width,
      pixelHeight: encodedRecto.height,
      bleedMm,
      bytes: pdfBlob.size,
    },
  };
}
