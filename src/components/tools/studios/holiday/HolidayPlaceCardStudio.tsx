"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Utensils, Download, Sparkles, Printer, ArrowRight } from "lucide-react";

export default function HolidayPlaceCardStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [guestsInput, setGuestsInput] = useState("Alexandre\nSophie\nThomas\nCamille\nJulien\nÉléonore");
  const [occasionTitle, setOccasionTitle] = useState("Réveillon de Noël");
  const [accentColor, setAccentColor] = useState("#CD7942");
  const [theme, setTheme] = useState<"dark" | "craft" | "white">("dark");

  const drawPlaceCards = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // A4 Portrait
    const width = 1414;
    const height = 2000;
    canvas.width = width;
    canvas.height = height;

    // Fond de page A4
    ctx.fillStyle = theme === "craft" ? "#E8D8C3" : theme === "dark" ? "#0D0420" : "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // Titre d'en-tête de planche
    ctx.fillStyle = theme === "dark" ? "#FFFFFF" : "#1B0B2E";
    ctx.font = "700 22px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MARQUE-PLACES DE FÊTE — PLANCHE A4 PLIABLE (FORMAT CHEVALET)", width / 2, 65);

    ctx.font = "400 15px Montserrat, sans-serif";
    ctx.fillStyle = theme === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(27, 11, 46, 0.6)";
    ctx.fillText("Découpez le long des pointillés extérieurs, puis pliez chaque marque-place en deux au centre.", width / 2, 95);

    // Liste des prénoms
    const names = guestsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    // 2 colonnes x 3 rangées = 6 marque-places par planche
    const cols = 2;
    const rows = 3;
    const startX = 100;
    const startY = 140;
    const cardW = 570;
    const cardH = 560; // 2 volets de 280 chacun
    const gapX = 74;
    const gapY = 40;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const x = startX + c * (cardW + gapX);
        const y = startY + r * (cardH + gapY);
        const guestName = names[idx] || `Invité ${idx + 1}`;

        ctx.save();

        // Fond du marque-place
        ctx.fillStyle = theme === "dark" ? "#19082B" : theme === "craft" ? "#D9C3A3" : "#FAF5FF";
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, cardW, cardH);
        ctx.strokeRect(x, y, cardW, cardH);

        // Ligne de pliure centrale en pointillés
        const midY = y + cardH / 2;
        ctx.strokeStyle = "rgba(205, 121, 66, 0.4)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(x, midY);
        ctx.lineTo(x + cardW, midY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Volet supérieur (Face arrière ou petit mot festif)
        ctx.textAlign = "center";
        ctx.fillStyle = theme === "dark" ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)";
        ctx.font = "600 16px Montserrat, sans-serif";
        // Orientation inversée pour la face arrière (ou simple texte décoratif)
        ctx.fillText(`✦ ${occasionTitle.toUpperCase()} ✦`, x + cardW / 2, y + 150);

        // Volet inférieur (Face avant visible avec le prénom)
        ctx.fillStyle = accentColor;
        ctx.font = "28px serif";
        ctx.fillText("✦  🌲  ✦", x + cardW / 2, midY + 70);

        // Prénom de l'invité
        ctx.fillStyle = theme === "dark" ? "#FFFFFF" : "#1B0B2E";
        ctx.font = "800 36px Montserrat, sans-serif";
        ctx.fillText(guestName, x + cardW / 2, midY + 140);

        // Filet décoratif sous le prénom
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + 120, midY + 175);
        ctx.lineTo(x + cardW - 120, midY + 175);
        ctx.stroke();

        ctx.fillStyle = accentColor;
        ctx.font = "600 14px Montserrat, sans-serif";
        ctx.fillText("Joyeuses Fêtes", x + cardW / 2, midY + 215);

        ctx.restore();
      }
    }
  }, [guestsInput, occasionTitle, accentColor, theme]);

  useEffect(() => {
    drawPlaceCards();
  }, [drawPlaceCards]);

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
    pdf.save("marque-places-noel-A4.pdf");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
      {/* Contrôles */}
      <div className="lg:col-span-5 space-y-5 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CD7942]">
          <Utensils size={16} /> Marque-places de Réveillon
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/70 block mb-1">Thème visuel</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#BA3184]"
            >
              <option value="dark" className="bg-[#150933]">Nuit Sombre & Or</option>
              <option value="craft" className="bg-[#150933]">Papier Kraft Rustique</option>
              <option value="white" className="bg-[#150933]">Blanc & Champagne</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Couleur d'accent</label>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs text-white/70 font-mono">{accentColor}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-white/70 block mb-1">Occasion / Événement</label>
          <input
            type="text"
            value={occasionTitle}
            onChange={(e) => setOccasionTitle(e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
          />
        </div>

        <div>
          <label className="text-xs text-white/70 block mb-1">
            Liste des invités (1 prénom par ligne)
          </label>
          <textarea
            rows={6}
            value={guestsInput}
            onChange={(e) => setGuestsInput(e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-sm leading-relaxed text-white focus:outline-none focus:border-[#BA3184]"
          />
          <p className="text-[11px] text-white/50 mt-1">
            Chaque planche A4 génère 6 marque-places au format chevalet pliable.
          </p>
        </div>

        <div className="pt-3 border-t border-white/10 space-y-3">
          <button
            onClick={downloadPDF}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#CD7942] hover:bg-[#b86733] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#CD7942]/20"
          >
            <Download size={15} /> Télécharger la Planche A4 PDF
          </button>

          <a
            href="/impression?produit=menus-restaurant"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#BA3184] hover:bg-[#9f256d] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#BA3184]/30"
          >
            <Printer size={15} /> Commander vos menus & papeterie de table <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Aperçu */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/30 p-4 sm:p-6 rounded-3xl border border-white/10">
        <div className="w-full flex items-center justify-between mb-3 text-xs text-white/50">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles size={13} className="text-[#CD7942]" /> Planche A4 avec repères de pliure
          </span>
          <span>Prêt à imprimer & plier</span>
        </div>
        <div className="w-full max-w-[480px] aspect-[1414/2000] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}

