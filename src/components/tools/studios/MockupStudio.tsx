"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import { Download, Upload, RefreshCw, ZoomIn, Move } from "lucide-react";

type MockupSupport = "carte" | "tshirt" | "mug" | "totebag" | "enseigne";

export default function MockupStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [support, setSupport] = useState<MockupSupport>("carte");
  const [supportColor, setSupportColor] = useState("#FFFFFF");
  const [logoSrc, setLogoSrc] = useState<string>("");
  const [brandText, setBrandText] = useState("VOTRE MARQUE");
  const [scale, setScale] = useState(100); // 20 - 200%
  const [offsetX, setOffsetX] = useState(0); // -150 to +150
  const [offsetY, setOffsetY] = useState(0); // -150 to +150

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoSrc(String(event.target?.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1000;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    // Background studio setting
    const studioGrad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, 600);
    studioGrad.addColorStop(0, "#221336");
    studioGrad.addColorStop(1, "#0d0417");
    ctx.fillStyle = studioGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle surface / floor line
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, height * 0.72, width, height * 0.28);

    // Load logo if present
    let logoImg: HTMLImageElement | null = null;
    if (logoSrc) {
      logoImg = await new Promise((res) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = () => res(null);
        img.src = logoSrc;
      });
    }

    const cx = width / 2;
    const cy = height / 2 - 20;

    // 1. Draw Support based on type
    if (support === "carte") {
      // Realistic Business Card Mockup (85x55 ratio, tilted perspective)
      const cw = 480;
      const ch = 310;
      const x = cx - cw / 2;
      const y = cy - ch / 2;

      // Card shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 25;

      // Card surface
      ctx.fillStyle = supportColor;
      ctx.beginPath();
      ctx.roundRect(x, y, cw, ch, 14);
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = "transparent";

      // Card bevel / sheen
      const sheen = ctx.createLinearGradient(x, y, x + cw, y + ch);
      sheen.addColorStop(0, "rgba(255,255,255,0.15)");
      sheen.addColorStop(0.5, "rgba(255,255,255,0.0)");
      sheen.addColorStop(1, "rgba(0,0,0,0.15)");
      ctx.fillStyle = sheen;
      ctx.beginPath();
      ctx.roundRect(x, y, cw, ch, 14);
      ctx.fill();

      // Card border
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Render logo / text on card
      const targetX = cx + offsetX;
      const targetY = cy + offsetY;

      if (logoImg) {
        const baseW = 160 * (scale / 100);
        const aspect = logoImg.height / logoImg.width;
        const baseH = baseW * aspect;
        ctx.drawImage(logoImg, targetX - baseW / 2, targetY - baseH / 2, baseW, baseH);
      } else {
        ctx.fillStyle = supportColor === "#FFFFFF" || supportColor === "#f5f5f5" ? "#171625" : "#ffffff";
        ctx.font = "800 28px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(brandText, targetX, targetY);
        ctx.font = "500 13px Montserrat, sans-serif";
        ctx.fillStyle = supportColor === "#FFFFFF" ? "#666" : "rgba(255,255,255,0.7)";
        ctx.fillText("CRÉATEUR DE MOCKUP ART VISION", targetX, targetY + 36);
        ctx.textAlign = "left";
      }
    } else if (support === "tshirt") {
      // Realistic T-shirt Mockup
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 20;

      // Draw T-shirt shape
      ctx.fillStyle = supportColor;
      ctx.beginPath();
      // Collar
      ctx.moveTo(cx - 70, cy - 220);
      ctx.quadraticCurveTo(cx, cy - 160, cx + 70, cy - 220);
      // Right shoulder & sleeve
      ctx.lineTo(cx + 260, cy - 140);
      ctx.lineTo(cx + 210, cy - 20);
      ctx.lineTo(cx + 160, cy - 50);
      // Right body
      ctx.lineTo(cx + 175, cy + 240);
      // Bottom
      ctx.quadraticCurveTo(cx, cy + 255, cx - 175, cy + 240);
      // Left body
      ctx.lineTo(cx - 160, cy - 50);
      ctx.lineTo(cx - 210, cy - 20);
      // Left sleeve & shoulder
      ctx.lineTo(cx - 260, cy - 140);
      ctx.closePath();
      ctx.fill();

      ctx.shadowColor = "transparent";

      // Fabric shading / wrinkles
      const fabricGrad = ctx.createLinearGradient(cx - 200, cy, cx + 200, cy);
      fabricGrad.addColorStop(0, "rgba(0,0,0,0.18)");
      fabricGrad.addColorStop(0.3, "rgba(255,255,255,0.06)");
      fabricGrad.addColorStop(0.7, "rgba(255,255,255,0.0)");
      fabricGrad.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = fabricGrad;
      ctx.fill();

      // Collar ribbed line
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy - 230, 85, 0.25 * Math.PI, 0.75 * Math.PI);
      ctx.stroke();

      // Logo placement on chest
      const targetX = cx + offsetX;
      const targetY = cy - 40 + offsetY;

      if (logoImg) {
        const baseW = 150 * (scale / 100);
        const aspect = logoImg.height / logoImg.width;
        const baseH = baseW * aspect;
        ctx.drawImage(logoImg, targetX - baseW / 2, targetY - baseH / 2, baseW, baseH);
      } else {
        ctx.fillStyle = supportColor === "#FFFFFF" ? "#171625" : "#ffffff";
        ctx.font = "800 24px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(brandText, targetX, targetY);
        ctx.textAlign = "left";
      }
    } else if (support === "mug") {
      // Ceramic Coffee Mug Mockup
      const mw = 260;
      const mh = 320;
      const x = cx - mw / 2 - 20;
      const y = cy - mh / 2;

      // Handle
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;

      ctx.strokeStyle = supportColor;
      ctx.lineWidth = 44;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(x + mw + 20, cy + 10, 85, -0.4 * Math.PI, 0.4 * Math.PI);
      ctx.stroke();

      // Mug body
      ctx.fillStyle = supportColor;
      ctx.beginPath();
      ctx.roundRect(x, y, mw, mh, [10, 10, 40, 40]);
      ctx.fill();

      ctx.shadowColor = "transparent";

      // Cylindrical light reflection
      const cyl = ctx.createLinearGradient(x, y, x + mw, y);
      cyl.addColorStop(0, "rgba(0,0,0,0.28)");
      cyl.addColorStop(0.2, "rgba(255,255,255,0.45)");
      cyl.addColorStop(0.5, "rgba(255,255,255,0.0)");
      cyl.addColorStop(0.85, "rgba(0,0,0,0.1)");
      cyl.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = cyl;
      ctx.beginPath();
      ctx.roundRect(x, y, mw, mh, [10, 10, 40, 40]);
      ctx.fill();

      // Rim top
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.beginPath();
      ctx.ellipse(x + mw / 2, y + 8, mw / 2 - 6, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Logo placement
      const targetX = x + mw / 2 + offsetX;
      const targetY = cy + offsetY;

      if (logoImg) {
        const baseW = 120 * (scale / 100);
        const aspect = logoImg.height / logoImg.width;
        const baseH = baseW * aspect;
        ctx.drawImage(logoImg, targetX - baseW / 2, targetY - baseH / 2, baseW, baseH);
      } else {
        ctx.fillStyle = supportColor === "#FFFFFF" ? "#171625" : "#ffffff";
        ctx.font = "800 22px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(brandText, targetX, targetY);
        ctx.textAlign = "left";
      }
    } else if (support === "totebag") {
      // Canvas Tote Bag Mockup
      const bw = 360;
      const bh = 380;
      const x = cx - bw / 2;
      const y = cy - bh / 2 + 50;

      // Straps
      ctx.strokeStyle = supportColor;
      ctx.lineWidth = 32;
      ctx.beginPath();
      ctx.moveTo(cx - 75, y);
      ctx.quadraticCurveTo(cx - 75, y - 220, cx, y - 220);
      ctx.quadraticCurveTo(cx + 75, y - 220, cx + 75, y);
      ctx.stroke();

      // Bag Body
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 20;

      ctx.fillStyle = supportColor;
      ctx.beginPath();
      ctx.roundRect(x, y, bw, bh, [10, 10, 25, 25]);
      ctx.fill();

      ctx.shadowColor = "transparent";

      // Fabric weave texture shading
      const weave = ctx.createLinearGradient(x, y, x + bw, y);
      weave.addColorStop(0, "rgba(0,0,0,0.15)");
      weave.addColorStop(0.5, "rgba(255,255,255,0.08)");
      weave.addColorStop(1, "rgba(0,0,0,0.15)");
      ctx.fillStyle = weave;
      ctx.beginPath();
      ctx.roundRect(x, y, bw, bh, [10, 10, 25, 25]);
      ctx.fill();

      // Stitching line
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(x + 12, y + 12, bw - 24, bh - 24);
      ctx.setLineDash([]);

      // Logo placement
      const targetX = cx + offsetX;
      const targetY = y + bh / 2 + offsetY;

      if (logoImg) {
        const baseW = 160 * (scale / 100);
        const aspect = logoImg.height / logoImg.width;
        const baseH = baseW * aspect;
        ctx.drawImage(logoImg, targetX - baseW / 2, targetY - baseH / 2, baseW, baseH);
      } else {
        ctx.fillStyle = supportColor === "#FFFFFF" || supportColor === "#f5ecd7" ? "#171625" : "#ffffff";
        ctx.font = "800 24px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(brandText, targetX, targetY);
        ctx.textAlign = "left";
      }
    } else if (support === "enseigne") {
      // Storefront Signboard Mockup (Circular Backlit Sign)
      const radius = 200;

      // Wall background texture
      ctx.fillStyle = "#1b1424";
      ctx.fillRect(cx - 380, cy - 280, 760, 560);

      // Sign bracket / wall mount
      ctx.fillStyle = "#33333b";
      ctx.fillRect(cx - radius - 55, cy - 25, 60, 50);

      // Ambient backlight glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.35);
      glow.addColorStop(0, "rgba(215, 40, 136, 0.45)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Sign circular rim
      ctx.fillStyle = "#2a2730";
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 14, 0, Math.PI * 2);
      ctx.fill();

      // Sign illuminated face
      ctx.fillStyle = supportColor;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner glass sheen
      const signSheen = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      signSheen.addColorStop(0, "rgba(255,255,255,0.22)");
      signSheen.addColorStop(0.5, "rgba(255,255,255,0.0)");
      signSheen.addColorStop(1, "rgba(0,0,0,0.1)");
      ctx.fillStyle = signSheen;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Logo placement
      const targetX = cx + offsetX;
      const targetY = cy + offsetY;

      if (logoImg) {
        const baseW = 190 * (scale / 100);
        const aspect = logoImg.height / logoImg.width;
        const baseH = baseW * aspect;
        ctx.drawImage(logoImg, targetX - baseW / 2, targetY - baseH / 2, baseW, baseH);
      } else {
        ctx.fillStyle = supportColor === "#FFFFFF" ? "#171625" : "#ffffff";
        ctx.font = "800 26px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(brandText, targetX, targetY);
        ctx.textAlign = "left";
      }
    }

    // Watermark tag
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "500 13px Montserrat, sans-serif";
    ctx.fillText("Art Vision • Aperçu Mockup Studio", 40, height - 35);
  }, [support, supportColor, logoSrc, brandText, scale, offsetX, offsetY]);

  useEffect(() => {
    draw();
  }, [draw]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `mockup-${support}-art-vision.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const downloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1000, 800] });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 1000, 800);
    pdf.save(`mockup-${support}-art-vision.pdf`);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
      {/* Controls */}
      <div className="glassmorphism rounded-2xl p-6 space-y-6 text-left border border-brand-purple/20">
        <div>
          <h2 className="text-base font-bold text-white font-montserrat">Configuration du support</h2>
          <p className="text-xs text-white/60 mt-0.5">Choisissez le support à simuler et ajustez le placement de votre logo.</p>
        </div>

        {/* Support Selection */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-2">Support de présentation</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: "carte", label: "Carte de visite" },
              { id: "tshirt", label: "T-shirt textile" },
              { id: "mug", label: "Mug céramique" },
              { id: "totebag", label: "Tote bag coton" },
              { id: "enseigne", label: "Enseigne lumineuse" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSupport(item.id as MockupSupport);
                  if (item.id === "totebag") setSupportColor("#f3eedf");
                  else if (item.id === "enseigne") setSupportColor("#ffffff");
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition ${
                  support === item.id
                    ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20"
                    : "bg-white/5 text-white/70 border-white/10 hover:border-brand-magenta/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Support Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">Couleur du support</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={supportColor}
                onChange={(e) => setSupportColor(e.target.value)}
                className="h-10 w-14 rounded-lg cursor-pointer bg-white/5 border border-white/10"
              />
              <span className="text-xs text-white/60 uppercase">{supportColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">Texte de marque (si pas de logo)</label>
            <input
              type="text"
              value={brandText}
              onChange={(e) => setBrandText(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-magenta"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-2">Import du logo (PNG transparent conseillé)</label>
          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-white/20 hover:border-brand-magenta/60 rounded-xl cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition text-xs text-white/70">
            <Upload size={16} />
            <span>{logoSrc ? "Remplacer le logo importé" : "Importer mon fichier logo"}</span>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>

        {/* Adjustments: Scale & Position */}
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Échelle du logo : {scale}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-brand-orange"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-white/70 mb-1">Position horizontale : {offsetX}px</span>
              <input
                type="range"
                min="-150"
                max="150"
                value={offsetX}
                onChange={(e) => setOffsetX(Number(e.target.value))}
                className="w-full accent-brand-magenta"
              />
            </div>
            <div>
              <span className="block text-xs text-white/70 mb-1">Position verticale : {offsetY}px</span>
              <input
                type="range"
                min="-150"
                max="150"
                value={offsetY}
                onChange={(e) => setOffsetY(Number(e.target.value))}
                className="w-full accent-brand-magenta"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setScale(100);
              setOffsetX(0);
              setOffsetY(0);
            }}
            className="text-xs text-white/50 hover:text-white flex items-center gap-1.5 transition"
          >
            <RefreshCw size={12} /> Réinitialiser position & taille
          </button>
        </div>
      </div>

      {/* Preview & Export */}
      <div className="sticky top-24 space-y-4">
        <div className="glassmorphism rounded-2xl p-4 border border-brand-purple/20 shadow-2xl">
          <canvas
            ref={canvasRef}
            className="w-full aspect-[1000/800] rounded-xl border border-white/10 shadow-inner bg-black"
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
            <Download size={14} /> Exporter PDF
          </button>
        </div>
      </div>
    </div>
  );
}
