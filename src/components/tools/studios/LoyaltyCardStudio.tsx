"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import { Download, Upload, Stamp, RefreshCw, Layers } from "lucide-react";

export default function LoyaltyCardStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [side, setSide] = useState<"recto" | "verso">("verso");
  const [stampsCount, setStampsCount] = useState<number>(10);
  const [shopName, setShopName] = useState("Le Café des Créateurs");
  const [tagline, setTagline] = useState("Votre fidélité récompensée");
  const [reward, setReward] = useState("10e passage offert !");
  const [conditionText, setConditionText] = useState("1 tampon par tranche de 15 € d'achat. Valable 1 an.");
  const [contact, setContact] = useState("Tél : +32 490 22 49 05 • contact@art-visions.fr");
  const [accentColor, setAccentColor] = useState("#D72888");
  const [logoSrc, setLogoSrc] = useState<string>("");

  // Reconcile reward automatically when stamps count changes, but let user edit
  const handleStampsChange = (count: number) => {
    setStampsCount(count);
    if (count === 5) setReward("5e passage : -20% sur votre commande !");
    else if (count === 6) setReward("6e passage : un cadeau ou boisson offerte !");
    else if (count === 8) setReward("8e passage : un produit signature offert !");
    else if (count === 10) setReward("10e passage offert !");
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

    // Standard business/loyalty card ratio (85 x 55 mm): 850 x 550 px
    const W = 850;
    const H = 550;
    canvas.width = W;
    canvas.height = H;

    let logoImg: HTMLImageElement | null = null;
    if (logoSrc) {
      logoImg = await new Promise((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.src = logoSrc;
      });
    }

    if (side === "recto") {
      // ─────────────────────────────────────────
      // RECTO : Elegant Brand Presentation Card
      // ─────────────────────────────────────────
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#190827");
      bg.addColorStop(1, "#07020d");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Card border
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, W - 40, H - 40);

      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(28, 28, W - 56, H - 56);

      // Logo or Brand Title in Center
      if (logoImg) {
        const lW = 180;
        const lH = (logoImg.height / logoImg.width) * lW;
        ctx.drawImage(logoImg, W / 2 - lW / 2, H / 2 - lH / 2 - 35, lW, lH);
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 38px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(shopName, W / 2, H / 2 - 20);
      }

      ctx.font = "600 16px Montserrat, sans-serif";
      ctx.fillStyle = accentColor;
      ctx.textAlign = "center";
      ctx.fillText(tagline.toUpperCase(), W / 2, H / 2 + 55);

      ctx.font = "500 12px Montserrat, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("CARTE DE FIDÉLITÉ PRIVILÈGE", W / 2, H / 2 + 85);

      ctx.font = "500 11px Montserrat, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillText(contact, W / 2, H - 42);
    } else {
      // ─────────────────────────────────────────
      // VERSO : Stamp Grid & Reward Card
      // ─────────────────────────────────────────
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);

      // Top Header band
      ctx.fillStyle = "#110722";
      ctx.fillRect(0, 0, W, 85);

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 22px Montserrat, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(shopName, 40, 42);

      ctx.font = "600 13px Montserrat, sans-serif";
      ctx.fillStyle = accentColor;
      ctx.fillText("CARTE DE FIDÉLITÉ", 40, 66);

      if (logoImg) {
        const lH = 48;
        const lW = (logoImg.width / logoImg.height) * lH;
        ctx.drawImage(logoImg, W - 40 - lW, 18, lW, lH);
      }

      // Stamps Grid
      const cols = stampsCount === 5 ? 5 : stampsCount === 6 ? 3 : stampsCount === 8 ? 4 : 5;
      const rows = stampsCount === 6 ? 2 : stampsCount === 8 ? 2 : stampsCount === 10 ? 2 : 1;

      const gridStartX = 50;
      const gridStartY = 115;
      const gridWidth = W - 100;
      const cellW = (gridWidth - (cols - 1) * 16) / cols;
      const cellH = rows === 1 ? 120 : 85;

      for (let i = 0; i < stampsCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = gridStartX + col * (cellW + 16);
        const cy = gridStartY + row * (cellH + 16);
        const isLast = i === stampsCount - 1;

        if (isLast) {
          // Last winning stamp (Gift / Reward Highlight)
          ctx.fillStyle = `${accentColor}18`;
          ctx.beginPath();
          ctx.roundRect(cx, cy, cellW, cellH, 12);
          ctx.fill();

          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = accentColor;
          ctx.font = "800 24px Montserrat, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("🎁", cx + cellW / 2, cy + cellH / 2 - 6);

          ctx.font = "700 10.5px Montserrat, sans-serif";
          ctx.fillText("OFFERT !", cx + cellW / 2, cy + cellH / 2 + 18);
        } else {
          // Regular stamp boxes
          ctx.fillStyle = "#faf7fc";
          ctx.beginPath();
          ctx.roundRect(cx, cy, cellW, cellH, 12);
          ctx.fill();

          ctx.strokeStyle = "rgba(0,0,0,0.12)";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = "#a89eb5";
          ctx.font = "700 20px Montserrat, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(String(i + 1), cx + cellW / 2, cy + cellH / 2 + 7);
        }
      }

      // Reward Banner at bottom
      const botY = H - 120;
      ctx.fillStyle = "#faf7fc";
      ctx.beginPath();
      ctx.roundRect(40, botY, W - 80, 52, 10);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.stroke();

      ctx.fillStyle = "#110722";
      ctx.font = "800 14px Montserrat, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`RÉCOMPENSE : ${reward}`, 60, botY + 31);

      // Terms & Conditions Footer
      ctx.font = "500 10.5px Montserrat, sans-serif";
      ctx.fillStyle = "#777";
      ctx.fillText(conditionText, 40, H - 35);

      ctx.textAlign = "right";
      ctx.fillText(contact, W - 40, H - 35);
    }
  }, [side, stampsCount, shopName, tagline, reward, conditionText, contact, accentColor, logoSrc]);

  useEffect(() => {
    draw();
  }, [draw]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `carte-fidelite-${side}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const downloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [85, 55] });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 85, 55);
    pdf.save(`carte-fidelite-${side}.pdf`);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
      {/* Controls */}
      <div className="glassmorphism rounded-2xl p-6 space-y-5 text-left border border-brand-purple/20">
        <div>
          <h2 className="text-base font-bold text-white font-montserrat">Créateur de Carte de Fidélité</h2>
          <p className="text-xs text-white/60 mt-0.5">
            Format standard carte 85 × 55 mm avec aperçu recto-verso et cohérence du nombre de tampons.
          </p>
        </div>

        {/* Recto / Verso Selector */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-2">Face à éditer & prévisualiser</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSide("verso")}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                side === "verso"
                  ? "bg-brand-orange text-white border-brand-orange"
                  : "bg-white/5 text-white/70 border-white/10"
              }`}
            >
              Verso (Cases & Tampons)
            </button>
            <button
              type="button"
              onClick={() => setSide("recto")}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                side === "recto"
                  ? "bg-brand-orange text-white border-brand-orange"
                  : "bg-white/5 text-white/70 border-white/10"
              }`}
            >
              Recto (Présentation / Logo)
            </button>
          </div>
        </div>

        {/* Stamps Count Selection */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-2">Nombre de cases tampons</label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 6, 8, 10].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleStampsChange(n)}
                className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition ${
                  stampsCount === n
                    ? "bg-brand-magenta text-white border-brand-magenta"
                    : "bg-white/5 text-white/70 border-white/10"
                }`}
              >
                {n} cases
              </button>
            ))}
          </div>
        </div>

        {/* Shop Name & Tagline */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Nom du commerce</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Slogan</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Reward */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">
            Récompense offerte ({stampsCount}e passage)
          </label>
          <input
            type="text"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white font-bold"
          />
        </div>

        {/* Terms & Contacts */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Conditions</label>
            <input
              type="text"
              value={conditionText}
              onChange={(e) => setConditionText(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Coordonnées</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Accent Color & Logo */}
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
            className="w-full aspect-[850/550] rounded-xl border border-white/10 shadow-inner bg-black"
          />
          <div className="mt-2 text-xs text-white/50 text-center">
            Aperçu {side === "verso" ? "Verso (Tampons)" : "Recto (Visuel)"} • Format 85 × 55 mm
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadPng}
            className="flex items-center justify-center gap-2 bg-[#D95200] hover:bg-[#B84200] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Download size={14} /> PNG {side.toUpperCase()}
          </button>
          <button
            onClick={downloadPdf}
            className="flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple/80 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Download size={14} /> PDF {side.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
