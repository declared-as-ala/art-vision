"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Calendar, Download, Image as ImageIcon, Sparkles, Printer, ArrowRight, Upload } from "lucide-react";

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];
const DAY_LETTERS = ["L", "M", "M", "J", "V", "S", "D"];

function getEaster(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function getFrenchHolidays(year: number): Set<string> {
  const holidays = new Set<string>();
  const add = (m: number, d: number) => holidays.add(`${m}-${d}`);

  add(0, 1);   // 1er Janvier
  add(4, 1);   // 1er Mai
  add(4, 8);   // 8 Mai
  add(6, 14);  // 14 Juillet
  add(7, 15);  // 15 Août
  add(10, 1);  // 1er Novembre
  add(10, 11); // 11 Novembre
  add(11, 25); // 25 Décembre

  // Paques & dépendants
  const easter = getEaster(year);
  const paquesLundi = new Date(easter);
  paquesLundi.setDate(easter.getDate() + 1);
  add(paquesLundi.getMonth(), paquesLundi.getDate());

  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);
  add(ascension.getMonth(), ascension.getDate());

  const pentecote = new Date(easter);
  pentecote.setDate(easter.getDate() + 50);
  add(pentecote.getMonth(), pentecote.getDate());

  return holidays;
}

export default function HolidayCalendarStudio({ isPhoto = false }: { isPhoto?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [year, setYear] = useState(2027);
  const [layoutMode, setLayoutMode] = useState<"annual" | "monthly">("annual");
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [companyName, setCompanyName] = useState("Art Vision Studio");
  const [tagline, setTagline] = useState("Agence créative & impression professionnelle");
  const [contact, setContact] = useState("contact@art-visions.fr · 01 89 71 34 20 · www.art-visions.fr");
  const [themeColor, setThemeColor] = useState("#BA3184");
  const [accentGold, setAccentGold] = useState("#CD7942");
  const [photoUrl, setPhotoUrl] = useState<string>("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCalendar = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1414;
    const height = 2000;
    canvas.width = width;
    canvas.height = height;

    // Fond luxueux sombre
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#150933");
    bgGradient.addColorStop(0.5, "#1F124A");
    bgGradient.addColorStop(1, "#0D0420");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Bordure élégante dorée
    ctx.strokeStyle = accentGold;
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = "rgba(205, 121, 66, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Header : Titre & Année
    ctx.textAlign = "center";

    // Tagline / Métier
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "600 24px Montserrat, sans-serif";
    ctx.fillText(tagline.toUpperCase(), width / 2, 95);

    // Marque
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 52px Montserrat, sans-serif";
    ctx.fillText(companyName, width / 2, 160);

    // Année dorée prestigieuse
    ctx.fillStyle = accentGold;
    ctx.font = "900 86px Montserrat, sans-serif";
    ctx.fillText(`${year}`, width / 2, 255);

    // Ligne décorative
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 180, 280);
    ctx.lineTo(width / 2 + 180, 280);
    ctx.stroke();

    const holidays = getFrenchHolidays(year);

    if (layoutMode === "annual") {
      // 12 mois en grille 3 colonnes x 4 rangées
      const cols = 3;
      const rows = 4;
      const startX = 70;
      const startY = 320;
      const cardW = 390;
      const cardH = 370;
      const gapX = 52;
      const gapY = 25;

      for (let m = 0; m < 12; m++) {
        const c = m % cols;
        const r = Math.floor(m / cols);
        const x = startX + c * (cardW + gapX);
        const y = startY + r * (cardH + gapY);

        // Fond carte mois
        ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 12);
        ctx.fill();
        ctx.stroke();

        // En-tête mois
        ctx.fillStyle = themeColor;
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, 42, [12, 12, 0, 0]);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "700 20px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(MONTH_NAMES[m].toUpperCase(), x + cardW / 2, y + 28);

        // Jours lettres L M M J V S D
        const cellW = cardW / 7;
        ctx.font = "600 13px Montserrat, sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        for (let d = 0; d < 7; d++) {
          ctx.fillText(DAY_LETTERS[d], x + d * cellW + cellW / 2, y + 66);
        }

        // Grille des jours
        const firstDayIndex = (new Date(year, m, 1).getDay() + 6) % 7;
        const daysInMonth = new Date(year, m + 1, 0).getDate();
        let curCol = firstDayIndex;
        let curRow = 0;

        ctx.font = "600 15px Montserrat, sans-serif";
        for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
          const posX = x + curCol * cellW + cellW / 2;
          const posY = y + 105 + curRow * 43;
          const isHoliday = holidays.has(`${m}-${dayNum}`);
          const isWeekend = curCol === 5 || curCol === 6;

          if (isHoliday) {
            ctx.fillStyle = "rgba(205, 121, 66, 0.25)";
            ctx.beginPath();
            ctx.arc(posX, posY - 5, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#FFAE73";
          } else if (isWeekend) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          }

          ctx.fillText(`${dayNum}`, posX, posY);

          curCol++;
          if (curCol > 6) {
            curCol = 0;
            curRow++;
          }
        }
      }
    } else {
      // Mode Mensuel (Zoom mois sélectionné + Photo éventuelle)
      const contentY = 320;
      const m = selectedMonth;

      // Bandeau mois
      ctx.fillStyle = themeColor;
      ctx.beginPath();
      ctx.roundRect(80, contentY, width - 160, 60, 16);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 32px Montserrat, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${MONTH_NAMES[m].toUpperCase()} ${year}`, width / 2, contentY + 42);

      // Si photo
      if (photoUrl) {
        try {
          const img = new Image();
          img.src = photoUrl;
          await new Promise((res) => {
            img.onload = res;
          });
          const imgH = 460;
          const imgW = width - 160;
          ctx.drawImage(img, 80, contentY + 80, imgW, imgH);
          ctx.strokeStyle = accentGold;
          ctx.lineWidth = 2;
          ctx.strokeRect(80, contentY + 80, imgW, imgH);
        } catch {}
      }

      const gridY = photoUrl ? contentY + 570 : contentY + 100;
      const gridW = width - 160;
      const cellW = gridW / 7;

      // Jours semaine
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fillRect(80, gridY, gridW, 46);

      ctx.font = "700 18px Montserrat, sans-serif";
      ctx.fillStyle = accentGold;
      const FULL_DAYS = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];
      for (let d = 0; d < 7; d++) {
        ctx.fillText(FULL_DAYS[d], 80 + d * cellW + cellW / 2, gridY + 30);
      }

      // Cases du mois
      const firstDayIndex = (new Date(year, m, 1).getDay() + 6) % 7;
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      let curCol = firstDayIndex;
      let curRow = 0;
      const cellH = photoUrl ? 110 : 160;

      for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const cellX = 80 + curCol * cellW;
        const cellY = gridY + 46 + curRow * cellH;
        const isHoliday = holidays.has(`${m}-${dayNum}`);
        const isWeekend = curCol === 5 || curCol === 6;

        ctx.fillStyle = isWeekend ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.04)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.fillRect(cellX, cellY, cellW, cellH);
        ctx.strokeRect(cellX, cellY, cellW, cellH);

        // Numéro jour
        ctx.textAlign = "left";
        ctx.font = "700 24px Montserrat, sans-serif";
        if (isHoliday) {
          ctx.fillStyle = "#FFAE73";
        } else if (isWeekend) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        } else {
          ctx.fillStyle = "#FFFFFF";
        }
        ctx.fillText(`${dayNum}`, cellX + 16, cellY + 36);

        if (isHoliday) {
          ctx.font = "500 12px Montserrat, sans-serif";
          ctx.fillStyle = "#CD7942";
          ctx.fillText("Férié", cellX + 16, cellY + 60);
        }

        curCol++;
        if (curCol > 6) {
          curCol = 0;
          curRow++;
        }
      }
    }

    // Footer Coordonnées
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.font = "500 19px Montserrat, sans-serif";
    ctx.fillText(contact, width / 2, height - 70);

    ctx.fillStyle = "rgba(205, 121, 66, 0.6)";
    ctx.font = "600 14px Montserrat, sans-serif";
    ctx.fillText("✦ Conçu avec l'outil gratuit Art Visions · Impression professionnelle sur art-visions.fr ✦", width / 2, height - 42);
  }, [year, layoutMode, selectedMonth, companyName, tagline, contact, themeColor, accentGold, photoUrl]);

  useEffect(() => {
    drawCalendar();
  }, [drawCalendar]);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `calendrier-${year}-${layoutMode}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

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
    pdf.save(`calendrier-${year}-${layoutMode}-A4.pdf`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
      {/* Contrôles de personnalisation */}
      <div className="lg:col-span-5 space-y-6 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CD7942]">
          <Calendar size={16} /> Configuration du calendrier {year}
        </div>

        {/* Année & Mode */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/70 block mb-1">Année</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#BA3184]"
            >
              <option value={2026} className="bg-[#150933]">2026</option>
              <option value={2027} className="bg-[#150933]">2027</option>
              <option value={2028} className="bg-[#150933]">2028</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Affichage</label>
            <select
              value={layoutMode}
              onChange={(e) => setLayoutMode(e.target.value as "annual" | "monthly")}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#BA3184]"
            >
              <option value="annual" className="bg-[#150933]">Annuel (12 mois A4)</option>
              <option value="monthly" className="bg-[#150933]">Mensuel détaillé</option>
            </select>
          </div>
        </div>

        {layoutMode === "monthly" && (
          <div>
            <label className="text-xs text-white/70 block mb-1">Mois affiché</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#BA3184]"
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={i} value={i} className="bg-[#150933]">
                  {name} {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Upload Photo (spécifique calendrier photo) */}
        {(isPhoto || layoutMode === "monthly") && (
          <div className="border border-dashed border-white/20 p-4 rounded-2xl bg-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#BA3184]">
              <ImageIcon size={15} /> Photo personnalisée (Optionnelle)
            </div>
            <p className="text-[11px] text-white/60">Ajoutez une photo de famille, d'équipe ou de vos réalisations.</p>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="text-xs text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#BA3184] file:text-white hover:file:bg-[#BA3184]/80 cursor-pointer"
            />
          </div>
        )}

        {/* Informations Entreprise / Nom */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/70 block mb-1">Nom / Marque / Entreprise</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
            />
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Slogan ou Activité</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
            />
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Coordonnées (téléphone, e-mail, adresse)</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BA3184]"
            />
          </div>
        </div>

        {/* Couleurs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/70 block mb-1">Couleur primaire</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs text-white/70 font-mono">{themeColor}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/70 block mb-1">Couleur or / accent</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentGold}
                onChange={(e) => setAccentGold(e.target.value)}
                className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs text-white/70 font-mono">{accentGold}</span>
            </div>
          </div>
        </div>

        {/* Boutons d'export immédiat */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadPDF}
              className="inline-flex items-center justify-center gap-2 bg-[#CD7942] hover:bg-[#b86733] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#CD7942]/20"
            >
              <Download size={15} /> Télécharger PDF A4
            </button>
            <button
              onClick={downloadPNG}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              <Download size={15} /> Image PNG HD
            </button>
          </div>

          {/* Liens transactionnels Art Vision */}
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="/impression?produit=calendrier-2027"
              className="inline-flex items-center justify-center gap-2 bg-[#BA3184] hover:bg-[#9f256d] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#BA3184]/30"
            >
              <Printer size={15} /> Faire imprimer nos calendriers pro <ArrowRight size={14} />
            </a>
            <a
              href="/devis-sur-mesure"
              className="text-center text-xs text-white/60 hover:text-white transition py-1"
            >
              Besoin d'une création sur mesure par nos directeurs artistiques ? Demandez un devis →
            </a>
          </div>
        </div>
      </div>

      {/* Aperçu direct en direct */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/30 p-4 sm:p-6 rounded-3xl border border-white/10">
        <div className="w-full flex items-center justify-between mb-3 text-xs text-white/50">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles size={13} className="text-[#CD7942]" /> Aperçu haute fidélité (Format A4 - 300 DPI)
          </span>
          <span>Sans filigrane · 100% Gratuit</span>
        </div>
        <div className="w-full max-w-[500px] aspect-[1414/2000] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#150933]">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}

