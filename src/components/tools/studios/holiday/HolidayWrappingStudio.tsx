"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { SwatchBook, Download, Sparkles, Printer, ArrowRight } from "lucide-react";

export default function HolidayWrappingStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [patternType, setPatternType] = useState<"snowflakes" | "trees" | "stars" | "typography">("trees");
  const [customText, setCustomText] = useState("Joyeux Noël");
  const [bgColor, setBgColor] = useState("#1B0B2E");
  const [iconColor, setIconColor] = useState("#CD7942");

  const drawWrapping = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // A4 Format
    const width = 1414;
    const height = 2000;
    canvas.width = width;
    canvas.height = height;

    // Fond de papier cadeau
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const stepX = 160;
    const stepY = 160;
    const cols = Math.ceil(width / stepX) + 1;
    const rows = Math.ceil(height / stepY) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const offsetX = (r % 2) * (stepX / 2);
        const x = c * stepX + offsetX - 40;
        const y = r * stepY + 40;

        ctx.save();
        ctx.translate(x, y);

        // Dessin selon le motif
        if (patternType === "trees") {
          ctx.fillStyle = iconColor;
          ctx.font = "38px serif";
          ctx.textAlign = "center";
          ctx.fillText("🌲", 0, 0);

          if (customText) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
            ctx.font = "700 12px Montserrat, sans-serif";
            ctx.fillText(customText, 0, 24);
          }
        } else if (patternType === "snowflakes") {
          ctx.fillStyle = iconColor;
          ctx.font = "36px serif";
          ctx.textAlign = "center";
          ctx.fillText("❄", 0, 0);

          // Petites étoiles en décalé
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.font = "14px serif";
          ctx.fillText("✦", 40, -40);

          if (customText) {
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "600 11px Montserrat, sans-serif";
            ctx.fillText(customText, 0, 24);
          }
        } else if (patternType === "stars") {
          ctx.fillStyle = iconColor;
          ctx.font = "32px serif";
          ctx.textAlign = "center";
          ctx.fillText("✦", 0, 0);

          ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
          ctx.font = "18px serif";
          ctx.fillText("★", 45, 35);

          if (customText) {
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "700 12px Montserrat, sans-serif";
            ctx.fillText(customText, 0, 22);
          }
        } else {
          // Typographie répétée en diagonale
          ctx.rotate((-20 * Math.PI) / 180);
          ctx.fillStyle = iconColor;
          ctx.font = "800 18px Montserrat, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(customText.toUpperCase(), 0, 0);

          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.font = "12px serif";
          ctx.fillText("✦ ❄ ✦", 0, 18);
        }

        ctx.restore();
      }
    }
  }, [patternType, customText, bgColor, iconColor]);

  useEffect(() => {
    drawWrapping();
  }, [drawWrapping]);

  const downloadPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save("papier-cadeau-noel-A4.pdf");
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "papier-cadeau-noel-A4.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
      {/* Contrôles */}
      <div className="lg:col-span-5 space-y-5 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CD7942]">
          <SwatchBook size={16} /> Motif de Papier Cadeau
        </div>

        <div>
          <label className="text-xs text-white/70 block mb-1">Style de motif</label>
          <select
            value={patternType}
            onChange={(e) => setPatternType(e.target.value as any)}
            className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#BA3184]"
          >
            <option value="trees" className="bg-[#150933]">Sapins Géométriques</option>
            <option value="snowflakes" className="bg-[#150933]">Flocons Célestes</option>
            <option value="stars" className="bg-[#150933]">Constellation d'Étoiles</option>
            <option value="typography" className="bg-[#150933]">Typographie Festive en Diagonale</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-white/70 block mb-1">
            Texte ou Prénom personnalisé dans le motif
          </label>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/70 block mb-1">Couleur de fond</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs text-white/70 font-mono">{bgColor}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Couleur des motifs</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value)}
                className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs text-white/70 font-mono">{iconColor}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadPDF}
              className="inline-flex items-center justify-center gap-1.5 bg-[#CD7942] hover:bg-[#b86733] text-white py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#CD7942]/20"
            >
              <Download size={14} /> PDF Imprimable A4
            </button>
            <button
              onClick={downloadPNG}
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              <Download size={14} /> Image PNG
            </button>
          </div>

          <a
            href="/impression?produit=packaging-emballages"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#BA3184] hover:bg-[#9f256d] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#BA3184]/30"
          >
            <Printer size={15} /> Imprimer des rouleaux de papier cadeau sur mesure <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Aperçu */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/30 p-4 sm:p-6 rounded-3xl border border-white/10">
        <div className="w-full flex items-center justify-between mb-3 text-xs text-white/50">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles size={13} className="text-[#CD7942]" /> Motifs réguliers pleine page A4
          </span>
          <span>Prêt à emballer vos présents</span>
        </div>
        <div className="w-full max-w-[480px] aspect-[1414/2000] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#1B0B2E]">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}

