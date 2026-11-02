"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Gift, Download, Sparkles, Printer, ArrowRight, Stamp } from "lucide-react";

export default function HolidayGiftLabelStudio({ isSticker = false }: { isSticker?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [fromName, setFromName] = useState("Le Père Noël & la famille");
  const [toName, setToName] = useState("Pour toi");
  const [shortGreeting, setShortGreeting] = useState(isSticker ? "Joyeuses Fêtes ✦ Fait avec amour" : "Joyeux Noël & Meilleurs Vœux !");
  const [tagShape, setTagShape] = useState<"luggage" | "round" | "rectangle">(isSticker ? "round" : "luggage");
  const [palette, setPalette] = useState<"craft" | "white" | "luxury">("luxury");
  const [accentColor, setAccentColor] = useState("#CD7942");

  const drawLabels = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Format A4 portrait
    const width = 1414;
    const height = 2000;
    canvas.width = width;
    canvas.height = height;

    // Fond blanc / kraft de la feuille A4
    ctx.fillStyle = palette === "craft" ? "#EAD9C3" : "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // En-tête de la planche A4
    ctx.fillStyle = "#2D124D";
    ctx.font = "700 24px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      isSticker
        ? "PLANCHE D'AUTOCOLLANTS DE NOËL ART VISIONS — FORMAT A4 PRÊT À DÉCOUPER"
        : "PLANCHE D'ÉTIQUETTES CADEAUX DE NOËL ART VISIONS — FORMAT A4 PRÊT À DÉCOUPER",
      width / 2,
      70
    );

    ctx.font = "400 16px Montserrat, sans-serif";
    ctx.fillStyle = "rgba(45, 18, 77, 0.6)";
    ctx.fillText("Imprimez sur papier épais (250g-300g) ou papier adhésif A4, puis découpez le long des repères.", width / 2, 105);

    // Grille 2 colonnes x 4 rangées = 8 grandes étiquettes
    const cols = 2;
    const rows = 4;
    const startX = 110;
    const startY = 160;
    const labelW = 560;
    const labelH = 410;
    const gapX = 74;
    const gapY = 46;

    const MOTIFS = ["❄", "★", "🌲", "🦌", "✦", "🎁", "🔔", "⛄"];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const x = startX + c * (labelW + gapX);
        const y = startY + r * (labelH + gapY);

        ctx.save();

        if (tagShape === "round") {
          // Sticker rond
          const radius = labelH / 2 - 15;
          const cx = x + labelW / 2;
          const cy = y + labelH / 2;

          ctx.fillStyle = palette === "luxury" ? "#1B0B2E" : palette === "craft" ? "#DFCBAC" : "#FAF5FF";
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Cercle intérieur en pointillés
          ctx.strokeStyle = "rgba(205, 121, 66, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.arc(cx, cy, radius - 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Contenu sticker
          ctx.textAlign = "center";
          ctx.fillStyle = accentColor;
          ctx.font = "44px serif";
          ctx.fillText(MOTIFS[idx % MOTIFS.length], cx, cy - 65);

          ctx.fillStyle = palette === "luxury" ? "#FFFFFF" : "#1B0B2E";
          ctx.font = "800 24px Montserrat, sans-serif";
          ctx.fillText(shortGreeting.toUpperCase(), cx, cy);

          ctx.fillStyle = accentColor;
          ctx.font = "600 20px Montserrat, sans-serif";
          ctx.fillText(`De : ${fromName}`, cx, cy + 50);
          ctx.fillText(`Pour : ${toName}`, cx, cy + 85);
        } else {
          // Étiquette bagage biseautée ou rectangle
          const cornerCut = tagShape === "luggage" ? 45 : 12;

          ctx.fillStyle = palette === "luxury" ? "#1B0B2E" : palette === "craft" ? "#D9C3A3" : "#FAF5FF";
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 2.5;

          ctx.beginPath();
          if (tagShape === "luggage") {
            // Forme étiquette de voyage avec coins supérieurs biseautés
            ctx.moveTo(x + cornerCut, y);
            ctx.lineTo(x + labelW - cornerCut, y);
            ctx.lineTo(x + labelW, y + cornerCut);
            ctx.lineTo(x + labelW, y + labelH);
            ctx.lineTo(x, y + labelH);
            ctx.lineTo(x, y + cornerCut);
            ctx.closePath();
          } else {
            ctx.roundRect(x, y, labelW, labelH, 16);
          }
          ctx.fill();
          ctx.stroke();

          // Trou de perforation (cercle pour ficelle)
          const holeX = x + labelW / 2;
          const holeY = y + 36;
          ctx.fillStyle = "#FFFFFF";
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(holeX, holeY, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Motif décoratif
          ctx.textAlign = "center";
          ctx.fillStyle = accentColor;
          ctx.font = "52px serif";
          ctx.fillText(MOTIFS[idx % MOTIFS.length], x + labelW / 2, y + 125);

          // Salutation
          ctx.fillStyle = palette === "luxury" ? "#FFFFFF" : "#1B0B2E";
          ctx.font = "800 22px Montserrat, sans-serif";
          ctx.fillText(shortGreeting, x + labelW / 2, y + 175);

          // Filet séparateur
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x + 70, y + 205);
          ctx.lineTo(x + labelW - 70, y + 205);
          ctx.stroke();

          // Champs "Pour" & "De la part de"
          ctx.textAlign = "left";
          ctx.font = "700 20px Montserrat, sans-serif";
          ctx.fillStyle = accentColor;
          ctx.fillText("POUR :", x + 60, y + 260);
          ctx.font = "500 22px Montserrat, sans-serif";
          ctx.fillStyle = palette === "luxury" ? "#FFFFFF" : "#222222";
          ctx.fillText(toName, x + 155, y + 260);

          ctx.font = "700 20px Montserrat, sans-serif";
          ctx.fillStyle = accentColor;
          ctx.fillText("DE :", x + 60, y + 315);
          ctx.font = "500 22px Montserrat, sans-serif";
          ctx.fillStyle = palette === "luxury" ? "#FFFFFF" : "#222222";
          ctx.fillText(fromName, x + 120, y + 315);

          // Repère de découpe
          ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(x - 5, y - 5, labelW + 10, labelH + 10);
          ctx.setLineDash([]);
        }

        ctx.restore();
      }
    }
  }, [fromName, toName, shortGreeting, tagShape, palette, accentColor, isSticker]);

  useEffect(() => {
    drawLabels();
  }, [drawLabels]);

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
    pdf.save(isSticker ? "stickers-noel-planche-A4.pdf" : "etiquettes-cadeaux-noel-A4.pdf");
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = isSticker ? "stickers-noel-A4.png" : "etiquettes-cadeaux-A4.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
      {/* Contrôles */}
      <div className="lg:col-span-5 space-y-5 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CD7942]">
          {isSticker ? <Stamp size={16} /> : <Gift size={16} />} Personnalisation des {isSticker ? "Stickers" : "Étiquettes"}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/70 block mb-1">Forme</label>
            <select
              value={tagShape}
              onChange={(e) => setTagShape(e.target.value as any)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#BA3184]"
            >
              <option value="luggage" className="bg-[#150933]">Étiquette biseautée</option>
              <option value="round" className="bg-[#150933]">Sticker rond</option>
              <option value="rectangle" className="bg-[#150933]">Rectangle chic</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Thème matière</label>
            <select
              value={palette}
              onChange={(e) => setPalette(e.target.value as any)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#BA3184]"
            >
              <option value="luxury" className="bg-[#150933]">Nuit Sombre & Or</option>
              <option value="craft" className="bg-[#150933]">Papier Kraft Naturel</option>
              <option value="white" className="bg-[#150933]">Blanc Épuré</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/70 block mb-1">De la part de (expéditeur)</label>
            <input
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
            />
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Pour (destinataire)</label>
            <input
              type="text"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
            />
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Message d'en-tête</label>
            <input
              type="text"
              value={shortGreeting}
              onChange={(e) => setShortGreeting(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
            />
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Couleur d'accent festif</label>
            <div className="flex items-center gap-2">
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

        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadPDF}
              className="inline-flex items-center justify-center gap-1.5 bg-[#CD7942] hover:bg-[#b86733] text-white py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#CD7942]/20"
            >
              <Download size={14} /> Télécharger Planche A4
            </button>
            <button
              onClick={downloadPNG}
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              <Download size={14} /> Image PNG
            </button>
          </div>

          <a
            href="/impression?produit=stickers-etiquettes"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#BA3184] hover:bg-[#9f256d] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#BA3184]/30"
          >
            <Printer size={15} /> Commander en rouleaux ou adhésif découpé <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Aperçu */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/30 p-4 sm:p-6 rounded-3xl border border-white/10">
        <div className="w-full flex items-center justify-between mb-3 text-xs text-white/50">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles size={13} className="text-[#CD7942]" /> Planche A4 complète avec repères de découpe
          </span>
          <span>8 étiquettes haute définition</span>
        </div>
        <div className="w-full max-w-[480px] aspect-[1414/2000] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}

