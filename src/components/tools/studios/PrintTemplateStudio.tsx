"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import { Download, Ruler, HelpCircle, Layers, Check } from "lucide-react";

interface ProductTemplate {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
}

const TEMPLATES: ProductTemplate[] = [
  { id: "carte", name: "Carte de visite standard", widthMm: 85, heightMm: 55 },
  { id: "flyer-a6", name: "Flyer A6", widthMm: 105, heightMm: 148 },
  { id: "flyer-a5", name: "Flyer A5", widthMm: 148, heightMm: 210 },
  { id: "affiche-a4", name: "Affiche / Document A4", widthMm: 210, heightMm: 297 },
  { id: "affiche-a3", name: "Affiche A3", widthMm: 297, heightMm: 420 },
  { id: "depliant-a5", name: "Dépliant 2 volets A5 ouvert", widthMm: 297, heightMm: 210 },
  { id: "marque-page", name: "Marque-page", widthMm: 52, heightMm: 148 },
  { id: "carre-14", name: "Format Carré", widthMm: 140, heightMm: 140 },
];

export default function PrintTemplateStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [templateId, setTemplateId] = useState<string>("carte");
  const [orientation, setOrientation] = useState<"paysage" | "portrait">("paysage");
  const [bleedMm, setBleedMm] = useState<number>(3); // 2, 3 or 5mm
  const [marginMm, setMarginMm] = useState<number>(4); // 3, 4 or 5mm
  const [showCropMarks, setShowCropMarks] = useState<boolean>(true);

  const product = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];

  // Adjust for orientation
  const isLandscape = orientation === "paysage";
  const finalW = isLandscape ? Math.max(product.widthMm, product.heightMm) : Math.min(product.widthMm, product.heightMm);
  const finalH = isLandscape ? Math.min(product.widthMm, product.heightMm) : Math.max(product.widthMm, product.heightMm);

  const totalW = finalW + bleedMm * 2;
  const totalH = finalH + bleedMm * 2;
  const safeW = finalW - marginMm * 2;
  const safeH = finalH - marginMm * 2;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasW = 900;
    const canvasH = 650;
    canvas.width = canvasW;
    canvas.height = canvasH;

    // Dark technical backdrop
    ctx.fillStyle = "#12091f";
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvasW; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasH);
      ctx.stroke();
    }
    for (let y = 0; y < canvasH; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasW, y);
      ctx.stroke();
    }

    // Scale calculation to fit canvas comfortably
    const maxDrawW = 560;
    const maxDrawH = 460;
    const scale = Math.min(maxDrawW / totalW, maxDrawH / totalH);

    const cx = canvasW / 2 - 40;
    const cy = canvasH / 2;

    const drawTotalW = totalW * scale;
    const drawTotalH = totalH * scale;
    const drawFinalW = finalW * scale;
    const drawFinalH = finalH * scale;
    const drawSafeW = safeW * scale;
    const drawSafeH = safeH * scale;

    const startX = cx - drawTotalW / 2;
    const startY = cy - drawTotalH / 2;

    // 1. Zone fond perdu (Bleed area: outer box)
    ctx.fillStyle = "rgba(14, 165, 233, 0.12)";
    ctx.fillRect(startX, startY, drawTotalW, drawTotalH);
    ctx.strokeStyle = "#0ea5e9";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(startX, startY, drawTotalW, drawTotalH);
    ctx.setLineDash([]);

    // 2. Zone de coupe / Format fini (Trim line)
    const trimX = startX + bleedMm * scale;
    const trimY = startY + bleedMm * scale;
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(trimX, trimY, drawFinalW, drawFinalH);
    ctx.strokeStyle = "#e11d48"; // Rose / Magenta coupe
    ctx.lineWidth = 2.5;
    ctx.strokeRect(trimX, trimY, drawFinalW, drawFinalH);

    // 3. Zone tranquille / Marge de sécurité (Safe zone)
    const safeX = trimX + marginMm * scale;
    const safeY = trimY + marginMm * scale;
    ctx.fillStyle = "rgba(16, 185, 129, 0.08)";
    ctx.fillRect(safeX, safeY, drawSafeW, drawSafeH);
    ctx.strokeStyle = "#10b981"; // Vert sécurité
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 3]);
    ctx.strokeRect(safeX, safeY, drawSafeW, drawSafeH);
    ctx.setLineDash([]);

    // 4. Traits de coupe (Crop marks at trim corners traversing bleed)
    if (showCropMarks) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.8;
      const rightX = trimX + drawFinalW;
      const bottomY = trimY + drawFinalH;

      ctx.beginPath();
      // Top-Left
      ctx.moveTo(trimX, startY);
      ctx.lineTo(trimX, trimY);
      ctx.moveTo(startX, trimY);
      ctx.lineTo(trimX, trimY);

      // Top-Right
      ctx.moveTo(rightX, startY);
      ctx.lineTo(rightX, trimY);
      ctx.moveTo(rightX, trimY);
      ctx.lineTo(startX + drawTotalW, trimY);

      // Bottom-Left
      ctx.moveTo(trimX, bottomY);
      ctx.lineTo(trimX, startY + drawTotalH);
      ctx.moveTo(startX, bottomY);
      ctx.lineTo(trimX, bottomY);

      // Bottom-Right
      ctx.moveTo(rightX, bottomY);
      ctx.lineTo(rightX, startY + drawTotalH);
      ctx.moveTo(rightX, bottomY);
      ctx.lineTo(startX + drawTotalW, bottomY);

      ctx.stroke();
    }

    // 5. Annotations textuelles & dimensions
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${finalW} mm (Format fini)`, cx, startY - 14);

    ctx.save();
    ctx.translate(startX - 16, cy);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${finalH} mm`, 0, 0);
    ctx.restore();

    ctx.font = "12px Montserrat, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(
      `Format total avec fonds perdus : ${totalW.toFixed(1)} × ${totalH.toFixed(1)} mm`,
      cx,
      startY + drawTotalH + 28
    );

    // 6. Technical Legend in canvas corner
    const legX = canvasW - 240;
    const legY = 40;
    ctx.fillStyle = "rgba(20, 10, 35, 0.85)";
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.strokeRect(legX, legY, 215, 170);
    ctx.fillRect(legX, legY, 215, 170);

    ctx.textAlign = "left";
    ctx.font = "bold 12px Montserrat, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("REPÈRES D'IMPRESSION", legX + 14, legY + 24);

    // Bleed legend item
    ctx.strokeStyle = "#0ea5e9";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);
    ctx.strokeRect(legX + 14, legY + 44, 16, 12);
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "11px Montserrat, sans-serif";
    ctx.fillText(`Fond perdu (+${bleedMm}mm)`, legX + 38, legY + 54);

    // Trim legend item
    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 2;
    ctx.strokeRect(legX + 14, legY + 76, 16, 12);
    ctx.fillText(`Ligne de coupe (${finalW}x${finalH})`, legX + 38, legY + 86);

    // Safe legend item
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);
    ctx.strokeRect(legX + 14, legY + 108, 16, 12);
    ctx.setLineDash([]);
    ctx.fillText(`Zone de sécurité (-${marginMm}mm)`, legX + 38, legY + 118);

    // Resolution note
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "10px Montserrat, sans-serif";
    ctx.fillText("Norme : 300 DPI • CMJN", legX + 14, legY + 150);
  }, [finalW, finalH, bleedMm, marginMm, totalW, totalH, safeW, safeH, showCropMarks]);

  useEffect(() => {
    draw();
  }, [draw]);

  const downloadPdf = () => {
    const pdf = new jsPDF({
      orientation: isLandscape ? "landscape" : "portrait",
      unit: "mm",
      format: [totalW, totalH],
    });

    // Bleed line
    pdf.setDrawColor(14, 165, 233);
    pdf.setLineDashPattern([2, 2], 0);
    pdf.rect(0, 0, totalW, totalH);

    // Trim line
    pdf.setDrawColor(225, 29, 72);
    pdf.setLineDashPattern([], 0);
    pdf.rect(bleedMm, bleedMm, finalW, finalH);

    // Safe zone line
    pdf.setDrawColor(16, 185, 129);
    pdf.setLineDashPattern([3, 2], 0);
    pdf.rect(bleedMm + marginMm, bleedMm + marginMm, safeW, safeH);

    // Repères de coupe d'angles (Crop marks)
    if (showCropMarks) {
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.35);
      pdf.setLineDashPattern([], 0);
      const rightX = bleedMm + finalW;
      const bottomY = bleedMm + finalH;

      // Coin Haut-Gauche
      pdf.line(bleedMm, 0, bleedMm, bleedMm);
      pdf.line(0, bleedMm, bleedMm, bleedMm);
      // Coin Haut-Droit
      pdf.line(rightX, 0, rightX, bleedMm);
      pdf.line(rightX, bleedMm, totalW, bleedMm);
      // Coin Bas-Gauche
      pdf.line(bleedMm, bottomY, bleedMm, totalH);
      pdf.line(0, bottomY, bleedMm, bottomY);
      // Coin Bas-Droit
      pdf.line(rightX, bottomY, rightX, totalH);
      pdf.line(rightX, bottomY, totalW, bottomY);
    }

    // Text in center
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Gabarit Art Vision : ${product.name} (${finalW} x ${finalH} mm)`, totalW / 2, totalH / 2, { align: "center" });

    pdf.save(`gabarit-${product.id}-${finalW}x${finalH}mm.pdf`);
  };

  const downloadSvg = () => {
    const rightX = bleedMm + finalW;
    const bottomY = bleedMm + finalH;
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${totalW}mm" height="${totalH}mm" viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg">
  <!-- Art Vision Gabarit Technique Impression -->
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="#f8fafc" stroke="#0ea5e9" stroke-width="0.5" stroke-dasharray="2,2"/>
  <rect x="${bleedMm}" y="${bleedMm}" width="${finalW}" height="${finalH}" fill="#ffffff" stroke="#e11d48" stroke-width="0.8"/>
  <rect x="${bleedMm + marginMm}" y="${bleedMm + marginMm}" width="${safeW}" height="${safeH}" fill="none" stroke="#10b981" stroke-width="0.5" stroke-dasharray="3,1.5"/>
  ${showCropMarks ? `
  <!-- Repères de coupe d'angles (Crop marks) -->
  <g id="crop-marks" stroke="#000000" stroke-width="0.35">
    <!-- Coin Haut-Gauche -->
    <line x1="${bleedMm}" y1="0" x2="${bleedMm}" y2="${bleedMm}" />
    <line x1="0" y1="${bleedMm}" x2="${bleedMm}" y2="${bleedMm}" />
    <!-- Coin Haut-Droit -->
    <line x1="${rightX}" y1="0" x2="${rightX}" y2="${bleedMm}" />
    <line x1="${rightX}" y1="${bleedMm}" x2="${totalW}" y2="${bleedMm}" />
    <!-- Coin Bas-Gauche -->
    <line x1="${bleedMm}" y1="${bottomY}" x2="${bleedMm}" y2="${totalH}" />
    <line x1="0" y1="${bottomY}" x2="${bleedMm}" y2="${bottomY}" />
    <!-- Coin Bas-Droit -->
    <line x1="${rightX}" y1="${bottomY}" x2="${rightX}" y2="${totalH}" />
    <line x1="${rightX}" y1="${bottomY}" x2="${totalW}" y2="${bottomY}" />
  </g>` : ""}
  <text x="${totalW / 2}" y="${totalH / 2}" font-family="sans-serif" font-size="3" text-anchor="middle" fill="#64748b">
    GABARIT IMPRESSION ART VISION - ${product.name} (${finalW}x${finalH} mm)
  </text>
</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `gabarit-${product.id}-${finalW}x${finalH}mm.svg`;
    a.click();
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
      {/* Controls */}
      <div className="glassmorphism rounded-2xl p-6 space-y-6 text-left border border-brand-purple/20">
        <div>
          <h2 className="text-base font-bold text-white font-montserrat">Paramètres du gabarit</h2>
          <p className="text-xs text-white/60 mt-0.5">
            Générez un gabarit technique certifié conforme avec repères de coupe, fonds perdus et marge tranquille.
          </p>
        </div>

        {/* Product selector */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-2">Support & format</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`p-3 rounded-xl text-left border transition ${
                  templateId === t.id
                    ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20"
                    : "bg-white/5 text-white/70 border-white/10 hover:border-brand-magenta/40"
                }`}
              >
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  {t.widthMm} × {t.heightMm} mm
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">Orientation</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOrientation("paysage")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                  orientation === "paysage" ? "bg-white/20 border-white text-white" : "border-white/10 text-white/60"
                }`}
              >
                Paysage
              </button>
              <button
                type="button"
                onClick={() => setOrientation("portrait")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                  orientation === "portrait" ? "bg-white/20 border-white text-white" : "border-white/10 text-white/60"
                }`}
              >
                Portrait
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">Traits de coupe</label>
            <label className="flex items-center gap-2 text-xs text-white/80 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCropMarks}
                onChange={(e) => setShowCropMarks(e.target.checked)}
                className="h-4 w-4 rounded accent-brand-orange"
              />
              <span>Afficher les repères d'angles</span>
            </label>
          </div>
        </div>

        {/* Bleed & Safe Margin */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Fonds perdus (Bleed)</label>
            <select
              value={bleedMm}
              onChange={(e) => setBleedMm(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value={2} className="bg-[#12091f]">2 mm (Cartes & stickers)</option>
              <option value={3} className="bg-[#12091f]">3 mm (Standard recommandé)</option>
              <option value={5} className="bg-[#12091f]">5 mm (Affiches & grands formats)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Marge de sécurité</label>
            <select
              value={marginMm}
              onChange={(e) => setMarginMm(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value={3} className="bg-[#12091f]">3 mm</option>
              <option value={4} className="bg-[#12091f]">4 mm (Recommandé)</option>
              <option value={5} className="bg-[#12091f]">5 mm (Bord sécurisé)</option>
            </select>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 space-y-1">
          <p className="font-semibold text-white">Règles techniques de fabrication :</p>
          <p>• Le fond de votre visuel doit s'étendre jusqu'au <strong>fond perdu bleu</strong>.</p>
          <p>• Les textes et logos essentiels doivent rester à l'intérieur de la <strong>zone verte</strong>.</p>
        </div>
      </div>

      {/* Preview & Download */}
      <div className="sticky top-24 space-y-4">
        <div className="glassmorphism rounded-2xl p-4 border border-brand-purple/20 shadow-2xl flex flex-col items-center">
          <canvas
            ref={canvasRef}
            className="w-full aspect-[900/650] rounded-xl border border-white/10 shadow-inner bg-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadPdf}
            className="flex items-center justify-center gap-2 bg-[#D95200] hover:bg-[#B84200] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Download size={14} /> Gabarit PDF
          </button>
          <button
            onClick={downloadSvg}
            className="flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple/80 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Download size={14} /> Gabarit SVG
          </button>
        </div>
      </div>
    </div>
  );
}
