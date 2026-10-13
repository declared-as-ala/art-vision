"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import { Download, Upload, Clock, Phone, AlertCircle } from "lucide-react";

interface DaySchedule {
  day: string;
  closed: boolean;
  morning: string; // e.g. "08:30 - 12:30"
  afternoon: string; // e.g. "14:00 - 19:00"
  continuous: boolean; // if true, morning contains full e.g. "08:00 - 18:00"
}

const DEFAULT_DAYS: DaySchedule[] = [
  { day: "Lundi", closed: false, morning: "08:00 - 18:00", afternoon: "", continuous: true },
  { day: "Mardi", closed: false, morning: "08:00 - 18:00", afternoon: "", continuous: true },
  { day: "Mercredi", closed: false, morning: "08:00 - 18:00", afternoon: "", continuous: true },
  { day: "Jeudi", closed: false, morning: "08:00 - 18:00", afternoon: "", continuous: true },
  { day: "Vendredi", closed: false, morning: "08:00 - 18:00", afternoon: "", continuous: true },
  { day: "Samedi", closed: false, morning: "08:00 - 18:00", afternoon: "", continuous: true },
  { day: "Dimanche", closed: true, morning: "", afternoon: "", continuous: true },
];

export default function OpeningHoursStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shopName, setShopName] = useState("Art Vision Studio");
  const [subtitle, setSubtitle] = useState("HORAIRES D'OUVERTURE DE L'AGENCE");
  const [days, setDays] = useState<DaySchedule[]>(DEFAULT_DAYS);
  const [specialNotice, setSpecialNotice] = useState("Accueil sur rendez-vous ou par contact direct.");
  const [phone, setPhone] = useState("+32 490 22 49 05");
  const [accentColor, setAccentColor] = useState("#6C2BD9");
  const [logoSrc, setLogoSrc] = useState<string>("");

  const handleDayChange = (index: number, key: keyof DaySchedule, value: any) => {
    setDays((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setLogoSrc(String(event.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // A4 Vertical Poster: 1000 x 1414 px
    const W = 1000;
    const H = 1414;
    canvas.width = W;
    canvas.height = H;

    // Clean, crisp printable poster background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Outer decorative border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    // Top Header Banner
    ctx.fillStyle = accentColor;
    ctx.fillRect(40, 40, W - 80, 220);

    let logoImg: HTMLImageElement | null = null;
    if (logoSrc) {
      logoImg = await new Promise((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.src = logoSrc;
      });
    }

    if (logoImg) {
      const lH = 75;
      const lW = (logoImg.width / logoImg.height) * lH;
      ctx.drawImage(logoImg, W / 2 - lW / 2, 70, lW, lH);
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 44px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(shopName.toUpperCase(), W / 2, logoImg ? 180 : 135);

    ctx.font = "600 18px Montserrat, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText(subtitle, W / 2, logoImg ? 220 : 185);

    // Schedule Table
    const startY = 320;
    const rowH = 95;
    const tableW = W - 180;
    const startX = 90;

    days.forEach((item, idx) => {
      const y = startY + idx * rowH;

      // Alternating row background
      if (idx % 2 === 0) {
        ctx.fillStyle = "#fcfaff";
        ctx.beginPath();
        ctx.roundRect(startX, y, tableW, rowH - 12, 12);
        ctx.fill();
      }

      // Day Name
      ctx.fillStyle = item.closed ? "#999999" : "#110722";
      ctx.font = "800 28px Montserrat, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(item.day, startX + 35, y + 48);

      // Hours or Closed
      ctx.textAlign = "right";
      if (item.closed) {
        ctx.fillStyle = "#ef4444";
        ctx.font = "700 24px Montserrat, sans-serif";
        ctx.fillText("FERMÉ", startX + tableW - 35, y + 48);
      } else {
        ctx.fillStyle = accentColor;
        ctx.font = "700 26px Montserrat, sans-serif";
        const hourStr = item.continuous
          ? item.morning
          : `${item.morning}  •  ${item.afternoon}`;
        ctx.fillText(hourStr, startX + tableW - 35, y + 48);
      }
    });

    // Notice & Break Box
    const noticeY = startY + days.length * rowH + 20;
    if (specialNotice) {
      ctx.fillStyle = "#faf7fc";
      ctx.beginPath();
      ctx.roundRect(startX, noticeY, tableW, 90, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(108, 43, 217, 0.2)";
      ctx.stroke();

      ctx.fillStyle = "#4b3a60";
      ctx.font = "600 18px Montserrat, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`📌 ${specialNotice}`, W / 2, noticeY + 52);
    }

    // Footer Phone & WhatsApp
    const footerY = H - 120;
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(120, footerY);
    ctx.lineTo(W - 120, footerY);
    ctx.stroke();

    ctx.fillStyle = "#110722";
    ctx.font = "800 22px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`CONTACT & RENSEIGNEMENTS : ${phone}`, W / 2, footerY + 45);

    ctx.font = "500 13px Montserrat, sans-serif";
    ctx.fillStyle = "#888888";
    ctx.fillText("Art Vision • Modèle d'affichage professionnel", W / 2, H - 48);
  }, [shopName, subtitle, days, specialNotice, phone, accentColor, logoSrc]);

  useEffect(() => {
    draw();
  }, [draw]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `affiche-horaires-${shopName.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const downloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
    pdf.save(`affiche-horaires-${shopName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
      {/* Controls without prices */}
      <div className="glassmorphism rounded-2xl p-6 space-y-5 text-left border border-brand-purple/20">
        <div>
          <h2 className="text-base font-bold text-white font-montserrat">Créateur d'Affiche d'Horaires</h2>
          <p className="text-xs text-white/60 mt-0.5">
            Renseignez vos créneaux d'ouverture, pauses et fermetures. Sans champ tarifaire.
          </p>
        </div>

        {/* Shop Name & Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Nom de l'établissement</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Sous-titre d'affiche</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Days Schedules */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="block text-xs font-semibold text-white/90">Grille hebdomadaire</label>
          {days.map((d, idx) => (
            <div key={d.day} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <span className="w-20 text-xs font-bold text-white shrink-0">{d.day}</span>
              <label className="flex items-center gap-1.5 text-xs text-white/70 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={d.closed}
                  onChange={(e) => handleDayChange(idx, "closed", e.target.checked)}
                  className="rounded accent-red-500"
                />
                <span>Fermé</span>
              </label>

              {!d.closed && (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={d.morning}
                    onChange={(e) => handleDayChange(idx, "morning", e.target.value)}
                    placeholder="ex. 08:00 - 18:00"
                    className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Notice & Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Note particulière / Pause</label>
            <input
              type="text"
              value={specialNotice}
              onChange={(e) => setSpecialNotice(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Téléphone de contact</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Color & Logo */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Couleur</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-8 w-10 rounded cursor-pointer bg-white/5"
              />
              <span className="text-xs text-white uppercase">{accentColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Logo</label>
            <label className="flex items-center gap-2 px-3 py-1.5 border border-white/20 rounded-lg cursor-pointer bg-white/5 text-xs text-white/70 hover:bg-white/10 transition">
              <Upload size={13} />
              <span>{logoSrc ? "Changer" : "Importer"}</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Preview & Download */}
      <div className="sticky top-24 space-y-4">
        <div className="glassmorphism rounded-2xl p-4 border border-brand-purple/20 shadow-2xl flex flex-col items-center">
          <canvas
            ref={canvasRef}
            className="w-full aspect-[1000/1414] max-w-[340px] rounded-xl border border-white/10 shadow-inner bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadPng}
            className="flex items-center justify-center gap-2 bg-[#D95200] hover:bg-[#B84200] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Download size={14} /> Image PNG
          </button>
          <button
            onClick={downloadPdf}
            className="flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple/80 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Download size={14} /> Affiche PDF (A4)
          </button>
        </div>
      </div>
    </div>
  );
}
