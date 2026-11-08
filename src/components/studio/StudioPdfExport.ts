import { jsPDF } from "jspdf";
import { StudioDesign, StudioSide, StudioElement } from "./studioTypes";

// High-definition render factor (300 DPI = ~11.81 pixels per mm)
const DPI_SCALE = 300 / 25.4;

export async function renderSideToCanvas(
  side: StudioSide,
  widthMm: number,
  heightMm: number,
  includeBleed: boolean,
  bleedMm: number = 2
): Promise<HTMLCanvasElement> {
  const totalWidthMm = includeBleed ? widthMm + bleedMm * 2 : widthMm;
  const totalHeightMm = includeBleed ? heightMm + bleedMm * 2 : heightMm;

  const canvasWidth = Math.round(totalWidthMm * DPI_SCALE);
  const canvasHeight = Math.round(totalHeightMm * DPI_SCALE);

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossible d'initialiser le contexte Canvas 2D");

  // Fill background
  ctx.fillStyle = side.backgroundColor || "#ffffff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Offset if bleed is included so elements placed at x=0 start after bleed
  const offsetX = includeBleed ? bleedMm * DPI_SCALE : 0;
  const offsetY = includeBleed ? bleedMm * DPI_SCALE : 0;

  ctx.save();
  ctx.translate(offsetX, offsetY);

  // Preload and draw all elements
  for (const el of side.elements) {
    await renderElement(ctx, el);
  }

  ctx.restore();
  return canvas;
}

async function renderElement(ctx: CanvasRenderingContext2D, el: StudioElement) {
  const x = el.x * DPI_SCALE;
  const y = el.y * DPI_SCALE;
  const w = el.width * DPI_SCALE;
  const h = el.height * DPI_SCALE;

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
      const r = el.borderRadius * DPI_SCALE;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
      if (el.stroke && el.strokeWidth) {
        ctx.strokeStyle = el.stroke;
        ctx.lineWidth = el.strokeWidth * DPI_SCALE;
        ctx.stroke();
      }
    } else {
      ctx.fillRect(x, y, w, h);
      if (el.stroke && el.strokeWidth) {
        ctx.strokeStyle = el.stroke;
        ctx.lineWidth = el.strokeWidth * DPI_SCALE;
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
      ctx.lineWidth = el.strokeWidth * DPI_SCALE;
      ctx.stroke();
    }
  } else if (el.type === "line") {
    ctx.strokeStyle = el.stroke || "#000000";
    ctx.lineWidth = (el.strokeWidth || 1) * DPI_SCALE;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
  } else if (el.type === "text" && el.text) {
    const fontSizePx = (el.fontSize || 12) * (DPI_SCALE / 3.78);
    const weight = el.fontWeight || "normal";
    const style = el.fontStyle || "normal";
    const family = el.fontFamily || "Montserrat, sans-serif";
    ctx.font = `${style} ${weight} ${fontSizePx}px ${family}`;
    ctx.fillStyle = el.color || "#000000";
    ctx.textBaseline = "top";

    if (el.letterSpacing) {
      (ctx as any).letterSpacing = `${el.letterSpacing * (DPI_SCALE / 8)}px`;
    }

    const lines = el.text.split("\n");
    const lineHeightPx = fontSizePx * (el.lineHeight || 1.3);

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
      ctx.fillText(line, renderX, y + lineIndex * lineHeightPx);
    });
  } else if (el.type === "image" && el.src) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, x, y, w, h);
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

/**
 * Generate a 300 DPI Print-Ready PDF with Recto and Verso pages.
 */
export async function generatePrintPdf(
  design: StudioDesign,
  includeBleed: boolean = true
): Promise<{ pdfBlob: Blob; previewRecto: string; previewVerso: string }> {
  const bleedMm = includeBleed ? design.bleedMm : 0;
  const totalW = design.widthMm + bleedMm * 2;
  const totalH = design.heightMm + bleedMm * 2;

  // 1. Render Recto
  const canvasRecto = await renderSideToCanvas(
    design.recto,
    design.widthMm,
    design.heightMm,
    includeBleed,
    design.bleedMm
  );
  const dataUrlRecto = canvasRecto.toDataURL("image/jpeg", 0.95);

  // 2. Render Verso
  const canvasVerso = await renderSideToCanvas(
    design.verso,
    design.widthMm,
    design.heightMm,
    includeBleed,
    design.bleedMm
  );
  const dataUrlVerso = canvasVerso.toDataURL("image/jpeg", 0.95);

  // 3. Create PDF with jsPDF (exact mm dimensions)
  const orientation = totalW >= totalH ? "landscape" : "portrait";
  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: [totalW, totalH],
  });

  // Page 1: Recto
  pdf.addImage(dataUrlRecto, "JPEG", 0, 0, totalW, totalH);

  // Page 2: Verso (if it has elements or non-default background)
  if (design.verso.elements.length > 0 || design.verso.backgroundColor) {
    pdf.addPage([totalW, totalH], orientation);
    pdf.addImage(dataUrlVerso, "JPEG", 0, 0, totalW, totalH);
  }

  const pdfBlob = pdf.output("blob");

  return {
    pdfBlob,
    previewRecto: dataUrlRecto,
    previewVerso: dataUrlVerso,
  };
}
