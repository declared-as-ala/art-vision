"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import { Download, Gift, Sparkles, Upload, RefreshCw } from "lucide-react";

export default function GiftVoucherStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [recipient, setRecipient] = useState("Sophie Martin");
  const [offeredBy, setOfferedBy] = useState("L'équipe Art Vision");
  const [value, setValue] = useState("100 €");
  const [service, setService] = useState("Séance Créative ou Impression");
  const [message, setMessage] = useState("Un moment d'inspiration rien que pour vous. Profitez-en pleinement !");
  const [validity, setValidity] = useState("Valable 12 mois à compter de l'émission");
  const [terms, setTerms] = useState("Utilisable en une fois. Non remboursable, non échangeable contre des espèces.");
  const [shopName, setShopName] = useState("Maison & Studio Art Vision");
  const [shopContact, setShopContact] = useState("+32 490 22 49 05 • contact@art-visions.fr • www.art-visions.fr");
  const [code, setCode] = useState("BC-2026-8492");
  const [theme, setTheme] = useState<"gold" | "rose" | "dark" | "purple">("purple");
  const [logoSrc, setLogoSrc] = useState<string>("");

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

    // Standard Voucher dimensions: 210 x 105 mm ratio (1050 x 525 px)
    const W = 1050;
    const H = 525;
    canvas.width = W;
    canvas.height = H;

    // Theme palettes
    const themes = {
      purple: {
        bg: "#0d0417",
        cardBg: "#170828",
        border: "#9333ea",
        accent: "#d946ef",
        text: "#ffffff",
        subtext: "rgba(255,255,255,0.75)",
        badgeBg: "rgba(217, 70, 239, 0.15)",
      },
      gold: {
        bg: "#11100f",
        cardBg: "#1a1815",
        border: "#d4af37",
        accent: "#e5c158",
        text: "#ffffff",
        subtext: "rgba(255,255,255,0.8)",
        badgeBg: "rgba(212, 175, 55, 0.18)",
      },
      rose: {
        bg: "#180c14",
        cardBg: "#22111c",
        border: "#e11d48",
        accent: "#fb7185",
        text: "#ffffff",
        subtext: "rgba(255,255,255,0.8)",
        badgeBg: "rgba(225, 29, 72, 0.18)",
      },
      dark: {
        bg: "#09090b",
        cardBg: "#18181b",
        border: "#52525b",
        accent: "#ffffff",
        text: "#ffffff",
        subtext: "rgba(255,255,255,0.7)",
        badgeBg: "rgba(255, 255, 255, 0.1)",
      },
    };

    const t = themes[theme];

    // Background
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, W, H);

    // Inner Card with padding
    const p = 25;
    ctx.fillStyle = t.cardBg;
    ctx.beginPath();
    ctx.roundRect(p, p, W - p * 2, H - p * 2, 20);
    ctx.fill();

    // Elegant double border
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.strokeRect(p + 8, p + 8, W - p * 2 - 16, H - p * 2 - 16);

    // Corner decorative flourishes
    const drawCorner = (x: number, y: number) => {
      ctx.strokeStyle = t.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.stroke();
    };
    drawCorner(p + 20, p + 20);
    drawCorner(W - p - 20, p + 20);
    drawCorner(p + 20, H - p - 20);
    drawCorner(W - p - 20, H - p - 20);

    // Header : Shop Name & Voucher Title
    ctx.fillStyle = t.accent;
    ctx.font = "bold 13px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(shopName.toUpperCase(), W / 2, p + 42);

    ctx.fillStyle = t.text;
    ctx.font = "800 36px Montserrat, sans-serif";
    ctx.fillText("BON CADEAU", W / 2, p + 85);

    // Decorative divider
    const divW = 180;
    ctx.strokeStyle = t.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - divW / 2, p + 102);
    ctx.lineTo(W / 2 + divW / 2, p + 102);
    ctx.stroke();

    // Value badge (Large right badge or center pill)
    const badgeW = 280;
    const badgeH = 75;
    const bx = W / 2 - badgeW / 2;
    const by = p + 120;

    ctx.fillStyle = t.badgeBg;
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeW, badgeH, 16);
    ctx.fill();
    ctx.strokeStyle = t.accent;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = t.accent;
    ctx.font = "800 38px Montserrat, sans-serif";
    ctx.fillText(value, W / 2, by + 46);

    if (service) {
      ctx.font = "600 12px Montserrat, sans-serif";
      ctx.fillStyle = t.text;
      ctx.fillText(service, W / 2, by + 68);
    }

    // Beneficiary block: Left side
    ctx.textAlign = "left";
    const infoY = by + badgeH + 30;

    ctx.fillStyle = t.subtext;
    ctx.font = "500 12px Montserrat, sans-serif";
    ctx.fillText("OFFERT À :", p + 50, infoY);

    ctx.fillStyle = t.text;
    ctx.font = "bold 20px Montserrat, sans-serif";
    ctx.fillText(recipient, p + 50, infoY + 24);

    if (offeredBy) {
      ctx.fillStyle = t.subtext;
      ctx.font = "500 11px Montserrat, sans-serif";
      ctx.fillText(`De la part de : ${offeredBy}`, p + 50, infoY + 46);
    }

    // Message block: Right side
    ctx.textAlign = "right";
    ctx.fillStyle = t.subtext;
    ctx.font = "italic 13px Montserrat, sans-serif";
    ctx.fillText(`« ${message} »`, W - p - 50, infoY + 20);

    // Divider line before footer
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p + 40, H - p - 65);
    ctx.lineTo(W - p - 40, H - p - 65);
    ctx.stroke();

    // Footer: Validity, Code & Terms
    ctx.textAlign = "left";
    ctx.font = "500 10.5px Montserrat, sans-serif";
    ctx.fillStyle = t.subtext;
    ctx.fillText(`📅 ${validity}`, p + 50, H - p - 44);
    ctx.fillText(`⚠️ ${terms}`, p + 50, H - p - 26);

    ctx.textAlign = "right";
    ctx.font = "bold 11px Montserrat, sans-serif";
    ctx.fillStyle = t.accent;
    ctx.fillText(`RÉFÉRENCE : ${code}`, W - p - 50, H - p - 44);

    ctx.font = "500 10px Montserrat, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText(shopContact, W - p - 50, H - p - 26);

    // Optional Logo on top left corner
    if (logoSrc) {
      try {
        const img = await new Promise<HTMLImageElement>((resolve) => {
          const i = new Image();
          i.onload = () => resolve(i);
          i.src = logoSrc;
        });
        const lsize = 60;
        ctx.drawImage(img, p + 45, p + 35, lsize, (img.height / img.width) * lsize);
      } catch {}
    }
  }, [recipient, offeredBy, value, service, message, validity, terms, shopName, shopContact, code, theme, logoSrc]);

  useEffect(() => {
    draw();
  }, [draw]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `bon-cadeau-${code}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const downloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [210, 105] });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 105);
    pdf.save(`bon-cadeau-${code}.pdf`);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
      {/* Controls */}
      <div className="glassmorphism rounded-2xl p-6 space-y-5 text-left border border-brand-purple/20">
        <div>
          <h2 className="text-base font-bold text-white font-montserrat">Créateur de Bon Cadeau</h2>
          <p className="text-xs text-white/60 mt-0.5">Personnalisez votre bon ou chèque cadeau prêt à imprimer (format 210 × 105 mm).</p>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-2">Thème visuel</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "purple", label: "Art Vision" },
              { id: "gold", label: "Or Luxe" },
              { id: "rose", label: "Rose Élégant" },
              { id: "dark", label: "Noir Minimal" },
            ].map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setTheme(th.id as any)}
                className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition ${
                  theme === th.id
                    ? "bg-brand-orange text-white border-brand-orange"
                    : "bg-white/5 text-white/70 border-white/10 hover:border-brand-magenta/40"
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* Value & Service */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Montant offert</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Prestation offerte (ou intitulé)</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        {/* Beneficiary & Giver */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Bénéficiaire (Pour :)</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Offert par (De la part de :)</label>
            <input
              type="text"
              value={offeredBy}
              onChange={(e) => setOfferedBy(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">Message personnalisé</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>

        {/* Validity & Terms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Date de validité</label>
            <input
              type="text"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Numéro / Référence</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">Conditions d'utilisation</label>
          <input
            type="text"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>

        {/* Establishment Info */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Nom de l'établissement</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Coordonnées (Tél, web...)</label>
            <input
              type="text"
              value={shopContact}
              onChange={(e) => setShopContact(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">Logo (facultatif)</label>
          <label className="flex items-center gap-2 px-3 py-2.5 border border-white/20 rounded-xl cursor-pointer bg-white/5 text-xs text-white/70 hover:bg-white/10 transition">
            <Upload size={14} />
            <span>{logoSrc ? "Changer le logo" : "Importer un logo"}</span>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Preview & Download */}
      <div className="sticky top-24 space-y-4">
        <div className="glassmorphism rounded-2xl p-4 border border-brand-purple/20 shadow-2xl flex flex-col items-center">
          <canvas
            ref={canvasRef}
            className="w-full aspect-[1050/525] rounded-xl border border-white/10 shadow-inner bg-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadPng}
            className="flex items-center justify-center gap-2 bg-[#D95200] hover:bg-[#B84200] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Download size={14} /> Télécharger PNG
          </button>
          <button
            onClick={downloadPdf}
            className="flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple/80 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Download size={14} /> Exporter PDF (A5/Carte)
          </button>
        </div>
      </div>
    </div>
  );
}
