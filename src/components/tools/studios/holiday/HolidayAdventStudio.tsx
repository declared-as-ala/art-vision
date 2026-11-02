"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { PanelsTopLeft, Download, Sparkles, Printer, ArrowRight } from "lucide-react";

const DEFAULT_DAYS = [
  "Préparer un bon chocolat chaud à la cannelle",
  "Écouter sa playlist de chants de Noël préférée",
  "Écrire la lettre au Père Noël",
  "Faire un don ou un geste solidaire",
  "Décorer le sapin en famille",
  "Regarder un film de Noël sous un plaid",
  "Cuisiner des sablés aux épices",
  "Faire une balade pour voir les illuminations",
  "Créer une carte de vœux pour un proche",
  "Allumer une bougie parfumée d'hiver",
  "Partager un souvenir marquant de l'année",
  "Offrir un compliment sincère à un collègue",
  "Lire un conte ou une belle histoire d'hiver",
  "Organiser une soirée jeux de société",
  "Emballer un premier cadeau avec soin",
  "Faire un tri pour donner des jouets/vêtements",
  "Prendre une photo souvenir festive",
  "Préparer une orange piquée de clous de girofle",
  "Déguster un thé de Noël aux agrumes",
  "Créer des étiquettes cadeaux personnalisées",
  "Appeler un ami que l'on n'a pas vu depuis longtemps",
  "Mettre la table avec les marque-places festifs",
  "Écouter le feu de cheminée ou une musique douce",
  "Célébrer le réveillon avec ceux qu'on aime !",
];

export default function HolidayAdventStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [title, setTitle] = useState("Mon Calendrier de l'Avent 2026");
  const [days, setDays] = useState<string[]>(DEFAULT_DAYS);
  const [accentColor, setAccentColor] = useState("#CD7942");

  const updateDay = (index: number, val: string) => {
    const updated = [...days];
    updated[index] = val;
    setDays(updated);
  };

  const drawAdvent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // A4 Format
    const width = 1414;
    const height = 2000;
    canvas.width = width;
    canvas.height = height;

    // Fond nuit étoilée
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#140624");
    bgGrad.addColorStop(0.5, "#200E38");
    bgGrad.addColorStop(1, "#0A0214");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Cadre doré
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(35, 35, width - 70, height - 70);

    // Titre
    ctx.textAlign = "center";
    ctx.fillStyle = accentColor;
    ctx.font = "600 22px Montserrat, sans-serif";
    ctx.fillText("✦  24 JOURS DE DOUCEUR ET D'INSPIRATION  ✦", width / 2, 80);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 48px Montserrat, sans-serif";
    ctx.fillText(title.toUpperCase(), width / 2, 140);

    // Grille 4 colonnes x 6 rangées = 24 cases
    const cols = 4;
    const rows = 6;
    const startX = 65;
    const startY = 175;
    const cardW = 300;
    const cardH = 285;
    const gapX = 28;
    const gapY = 18;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const num = r * cols + c + 1;
        const x = startX + c * (cardW + gapX);
        const y = startY + r * (cardH + gapY);

        ctx.save();

        // Fond case
        const is24 = num === 24;
        ctx.fillStyle = is24 ? "rgba(205, 121, 66, 0.25)" : "rgba(255, 255, 255, 0.04)";
        ctx.strokeStyle = is24 ? accentColor : "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = is24 ? 2.5 : 1;
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 12);
        ctx.fill();
        ctx.stroke();

        // Numéro de la case
        ctx.fillStyle = is24 ? "#FFAE73" : accentColor;
        ctx.font = "800 32px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${num}`, x + cardW / 2, y + 45);

        // Filet séparateur
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 40, y + 60);
        ctx.lineTo(x + cardW - 40, y + 60);
        ctx.stroke();

        // Texte de l'action / surprise (avec retour à la ligne)
        const text = days[num - 1] || "";
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "400 16px Montserrat, sans-serif";
        ctx.textAlign = "center";

        const words = text.split(" ");
        let line = "";
        let curY = y + 105;
        const maxTextW = cardW - 36;

        for (let i = 0; i < words.length; i++) {
          const test = line + words[i] + " ";
          if (ctx.measureText(test).width > maxTextW && i > 0) {
            ctx.fillText(line, x + cardW / 2, curY);
            line = words[i] + " ";
            curY += 26;
          } else {
            line = test;
          }
        }
        ctx.fillText(line, x + cardW / 2, curY);

        ctx.restore();
      }
    }
  }, [title, days, accentColor]);

  useEffect(() => {
    drawAdvent();
  }, [drawAdvent]);

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
    pdf.save("calendrier-avent-2026-A4.pdf");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
      {/* Contrôles */}
      <div className="lg:col-span-5 space-y-5 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CD7942]">
          <PanelsTopLeft size={16} /> Personnaliser les 24 cases de l'Avent
        </div>

        <div>
          <label className="text-xs text-white/70 block mb-1">Titre du calendrier</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

        <div>
          <label className="text-xs text-white/70 block mb-2">
            Édition rapide des cases (24 jours)
          </label>
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {days.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#CD7942] w-6 shrink-0 text-center">
                  J{i + 1}
                </span>
                <input
                  type="text"
                  value={d}
                  onChange={(e) => updateDay(i, e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#BA3184]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 space-y-3">
          <button
            onClick={downloadPDF}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#CD7942] hover:bg-[#b86733] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#CD7942]/20"
          >
            <Download size={15} /> Télécharger le Calendrier de l'Avent PDF A4
          </button>

          <a
            href="/devis-sur-mesure"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#BA3184] hover:bg-[#9f256d] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#BA3184]/30"
          >
            <Printer size={15} /> Créer un calendrier de l'Avent packaging sur-mesure <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Aperçu */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/30 p-4 sm:p-6 rounded-3xl border border-white/10">
        <div className="w-full flex items-center justify-between mb-3 text-xs text-white/50">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles size={13} className="text-[#CD7942]" /> Calendrier A4 complet prêt à afficher
          </span>
          <span>24 cases personnalisées</span>
        </div>
        <div className="w-full max-w-[480px] aspect-[1414/2000] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#140624]">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}

