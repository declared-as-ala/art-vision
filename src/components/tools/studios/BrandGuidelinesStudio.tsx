"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import { Download, Upload, SwatchBook, Type, ShieldCheck, Check } from "lucide-react";

export default function BrandGuidelinesStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brandName, setBrandName] = useState("L'Atelier Créatif");
  const [tagline, setTagline] = useState("L'excellence du design & de l'image");

  // Nuancier de 5 couleurs professionnelles
  const [primaryColor, setPrimaryColor] = useState("#6C2BD9");
  const [secondaryColor, setSecondaryColor] = useState("#D72888");
  const [accentColor, setAccentColor] = useState("#FF6A00");
  const [darkNeutral, setDarkNeutral] = useState("#110722");
  const [lightNeutral, setLightNeutral] = useState("#FAF7FC");

  // Typographies
  const [headingFont, setHeadingFont] = useState("Montserrat");
  const [bodyFont, setBodyFont] = useState("Inter");

  // Règles d'usage
  const [clearSpaceRule, setClearSpaceRule] = useState("Conserver une zone de dégagement égale à la hauteur du symbole.");
  const [doRule, setDoRule] = useState("Utiliser le logo en blanc sur les fonds sombres ou photographiques.");
  const [dontRule, setDontRule] = useState("Ne pas déformer, recolorer, incliner ou ajouter d'effet d'ombre portée.");

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

    // Landscape A4 sheet format: 1414 x 1000 px
    const W = 1414;
    const H = 1000;
    canvas.width = W;
    canvas.height = H;

    // Premium background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Header banner with primary brand color
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, W, 140);

    // Header text
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 42px ${headingFont}, Montserrat, sans-serif`;
    ctx.fillText(brandName, 80, 75);

    ctx.font = `500 18px ${bodyFont}, Inter, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(`GUIDE DE STYLE & MINI-CHARTE GRAPHIQUE • ${tagline}`, 80, 112);

    // Watermark Art Vision
    ctx.font = `600 13px Inter, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.textAlign = "right";
    ctx.fillText("Édité avec Art Vision Studio", W - 80, 95);
    ctx.textAlign = "left";

    // ─────────────────────────────────────────────────────────────
    // SECTION 1: LOGO & DÉCLINAISONS (Top Left & Top Right)
    // ─────────────────────────────────────────────────────────────
    const s1Y = 175;
    ctx.fillStyle = "#110722";
    ctx.font = `800 20px ${headingFont}, sans-serif`;
    ctx.fillText("01. LOGO & DÉCLINAISONS", 80, s1Y);

    // Box 1: Version Fond Clair
    const bW = 390;
    const bH = 200;
    const b1X = 80;
    const bY = s1Y + 20;

    ctx.fillStyle = lightNeutral;
    ctx.beginPath();
    ctx.roundRect(b1X, bY, bW, bH, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.stroke();

    ctx.font = "600 11px Inter, sans-serif";
    ctx.fillStyle = "#666";
    ctx.fillText("VERSION PRINCIPALE (FOND CLAIR)", b1X + 20, bY + 30);

    // Box 2: Version Fond Sombre
    const b2X = b1X + bW + 30;
    ctx.fillStyle = darkNeutral;
    ctx.beginPath();
    ctx.roundRect(b2X, bY, bW, bH, 12);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText("VERSION INVERSÉE (FOND SOMBRE)", b2X + 20, bY + 30);

    // Draw uploaded logo in both boxes
    let logoImg: HTMLImageElement | null = null;
    if (logoSrc) {
      logoImg = await new Promise((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.src = logoSrc;
      });
    }

    if (logoImg) {
      const maxW = 200;
      const maxH = 90;
      const aspect = logoImg.width / logoImg.height;
      let drawW = maxW;
      let drawH = drawW / aspect;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = drawH * aspect;
      }
      // On light box
      ctx.drawImage(logoImg, b1X + (bW - drawW) / 2, bY + (bH - drawH) / 2 + 10, drawW, drawH);
      // On dark box
      ctx.drawImage(logoImg, b2X + (bW - drawW) / 2, bY + (bH - drawH) / 2 + 10, drawW, drawH);
    } else {
      // Mock logo text
      ctx.font = `800 26px ${headingFont}, sans-serif`;
      ctx.fillStyle = primaryColor;
      ctx.textAlign = "center";
      ctx.fillText(brandName, b1X + bW / 2, bY + bH / 2 + 15);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(brandName, b2X + bW / 2, bY + bH / 2 + 15);
      ctx.textAlign = "left";
    }

    // Box 3: Règles de dégagement
    const b3X = b2X + bW + 30;
    const b3W = W - b3X - 80;
    ctx.fillStyle = "#fdfaff";
    ctx.beginPath();
    ctx.roundRect(b3X, bY, b3W, bH, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(108, 43, 217, 0.2)";
    ctx.stroke();

    ctx.font = `bold 13px ${headingFont}, sans-serif`;
    ctx.fillStyle = primaryColor;
    ctx.fillText("ZONE DE PROTECTION", b3X + 20, bY + 30);

    ctx.font = `500 12px ${bodyFont}, sans-serif`;
    ctx.fillStyle = "#444";
    ctx.fillText(clearSpaceRule, b3X + 20, bY + 60);

    ctx.fillStyle = "#10b981";
    ctx.fillText(`✓ À FAIRE : ${doRule}`, b3X + 20, bY + 110);

    ctx.fillStyle = "#ef4444";
    ctx.fillText(`✗ À ÉVITER : ${dontRule}`, b3X + 20, bY + 145);

    // ─────────────────────────────────────────────────────────────
    // SECTION 2: NUANCIER OFFICIEL (Palette 5 couleurs)
    // ─────────────────────────────────────────────────────────────
    const s2Y = 445;
    ctx.fillStyle = "#110722";
    ctx.font = `800 20px ${headingFont}, sans-serif`;
    ctx.fillText("02. PALETTE DE COULEURS OFFICIELLE", 80, s2Y);

    const colors = [
      { name: "Primaire", hex: primaryColor, role: "Dominante de marque" },
      { name: "Secondaire", hex: secondaryColor, role: "Accompagnement & supports" },
      { name: "Accent", hex: accentColor, role: "Call-to-action & badges" },
      { name: "Neutre Foncé", hex: darkNeutral, role: "Textes & fonds sombres" },
      { name: "Neutre Clair", hex: lightNeutral, role: "Arrière-plans & aérations" },
    ];

    const swatchW = (W - 160 - 4 * 24) / 5;
    const swatchH = 150;

    colors.forEach((c, idx) => {
      const swX = 80 + idx * (swatchW + 24);
      const swY = s2Y + 20;

      // Color swatch block
      ctx.fillStyle = c.hex;
      ctx.beginPath();
      ctx.roundRect(swX, swY, swatchW, swatchH - 45, 12);
      ctx.fill();

      // Border around light colors
      if (c.hex.toLowerCase() === "#ffffff" || c.hex.toLowerCase() === "#faf7fc") {
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.stroke();
      }

      // Color labels underneath
      ctx.fillStyle = "#110722";
      ctx.font = `700 13px ${headingFont}, sans-serif`;
      ctx.fillText(c.name, swX, swY + swatchH - 22);

      ctx.fillStyle = "#666666";
      ctx.font = `bold 12px Inter, monospace`;
      ctx.fillText(c.hex.toUpperCase(), swX, swY + swatchH - 6);

      ctx.font = `500 10.5px Inter, sans-serif`;
      ctx.fillStyle = "#888888";
      ctx.fillText(c.role, swX, swY + swatchH + 10);
    });

    // ─────────────────────────────────────────────────────────────
    // SECTION 3: TYPOGRAPHIES & HIÉRARCHIE (Bottom)
    // ─────────────────────────────────────────────────────────────
    const s3Y = 675;
    ctx.fillStyle = "#110722";
    ctx.font = `800 20px ${headingFont}, sans-serif`;
    ctx.fillText("03. SYSTÈME TYPOGRAPHIQUE", 80, s3Y);

    // Font 1 Box: Heading Font
    const tW = (W - 160 - 30) / 2;
    const tH = 190;
    const t1X = 80;
    const tY = s3Y + 20;

    ctx.fillStyle = "#fcfbfe";
    ctx.beginPath();
    ctx.roundRect(t1X, tY, tW, tH, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.07)";
    ctx.stroke();

    ctx.fillStyle = primaryColor;
    ctx.font = `bold 12px ${headingFont}, sans-serif`;
    ctx.fillText("TITRES & HEADLINES", t1X + 28, tY + 34);

    ctx.fillStyle = "#110722";
    ctx.font = `800 32px ${headingFont}, Montserrat, sans-serif`;
    ctx.fillText(`${headingFont} (Bold / Black)`, t1X + 28, tY + 76);

    ctx.font = `600 17px ${headingFont}, sans-serif`;
    ctx.fillStyle = "#555";
    ctx.fillText("Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj 0123456789", t1X + 28, tY + 110);

    ctx.font = `500 12px ${bodyFont}, sans-serif`;
    ctx.fillStyle = "#777";
    ctx.fillText("Utilisé pour tous les titres H1, H2, accroches publicitaires et logos.", t1X + 28, tY + 145);

    // Font 2 Box: Body Font
    const t2X = t1X + tW + 30;
    ctx.fillStyle = "#fcfbfe";
    ctx.beginPath();
    ctx.roundRect(t2X, tY, tW, tH, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.07)";
    ctx.stroke();

    ctx.fillStyle = secondaryColor;
    ctx.font = `bold 12px ${bodyFont}, sans-serif`;
    ctx.fillText("TEXTES COURANTS & LABELS", t2X + 28, tY + 34);

    ctx.fillStyle = "#110722";
    ctx.font = `700 28px ${bodyFont}, Inter, sans-serif`;
    ctx.fillText(`${bodyFont} (Regular / Medium)`, t2X + 28, tY + 76);

    ctx.font = `400 17px ${bodyFont}, sans-serif`;
    ctx.fillStyle = "#555";
    ctx.fillText("Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll 0123456789", t2X + 28, tY + 110);

    ctx.font = `500 12px ${bodyFont}, sans-serif`;
    ctx.fillStyle = "#777";
    ctx.fillText("Garantit une excellente lisibilité sur écrans, documents et impressions.", t2X + 28, tY + 145);

    // Footer Copyright
    ctx.fillStyle = "#888888";
    ctx.font = `500 11px Inter, sans-serif`;
    ctx.fillText(`Document de référence d'identité visuelle • Tous droits réservés à ${brandName}.`, 80, H - 40);
  }, [brandName, tagline, primaryColor, secondaryColor, accentColor, darkNeutral, lightNeutral, headingFont, bodyFont, clearSpaceRule, doRule, dontRule, logoSrc]);

  useEffect(() => {
    draw();
  }, [draw]);

  const downloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1414, 1000] });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 1414, 1000);
    pdf.save(`charte-graphique-${brandName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `charte-graphique-${brandName.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
      {/* Controls */}
      <div className="glassmorphism rounded-2xl p-6 space-y-5 text-left border border-brand-purple/20">
        <div>
          <h2 className="text-base font-bold text-white font-montserrat">Créateur de Mini-Charte Graphique</h2>
          <p className="text-xs text-white/60 mt-0.5">
            Configurez votre nuancier officiel, polices et règles d'usage pour générer un guide de style A4 prêt à imprimer.
          </p>
        </div>

        {/* Brand Name & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Nom de la marque</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Slogan / Positionnement</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">Logo de la marque (PNG transparent)</label>
          <label className="flex items-center gap-2 px-3 py-2.5 border border-white/20 rounded-xl cursor-pointer bg-white/5 text-xs text-white/70 hover:bg-white/10 transition">
            <Upload size={14} />
            <span>{logoSrc ? "Changer le logo" : "Importer mon fichier logo"}</span>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>

        {/* Official 5-Color Swatch */}
        <div className="pt-2 border-t border-white/10">
          <label className="block text-xs font-semibold text-white/90 mb-3">Nuancier officiel (5 teintes)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="block text-[11px] text-white/60 mb-1">Primaire</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-8 w-10 rounded cursor-pointer bg-white/5"
                />
                <span className="text-xs text-white uppercase">{primaryColor}</span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] text-white/60 mb-1">Secondaire</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-8 w-10 rounded cursor-pointer bg-white/5"
                />
                <span className="text-xs text-white uppercase">{secondaryColor}</span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] text-white/60 mb-1">Accent (CTA)</span>
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
              <span className="block text-[11px] text-white/60 mb-1">Neutre Foncé</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={darkNeutral}
                  onChange={(e) => setDarkNeutral(e.target.value)}
                  className="h-8 w-10 rounded cursor-pointer bg-white/5"
                />
                <span className="text-xs text-white uppercase">{darkNeutral}</span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] text-white/60 mb-1">Neutre Clair</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={lightNeutral}
                  onChange={(e) => setLightNeutral(e.target.value)}
                  className="h-8 w-10 rounded cursor-pointer bg-white/5"
                />
                <span className="text-xs text-white uppercase">{lightNeutral}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Typography choices */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Typographie Titres</label>
            <select
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="Montserrat" className="bg-[#12091f]">Montserrat (Moderne & géométrique)</option>
              <option value="Playfair Display" className="bg-[#12091f]">Playfair (Élégant & luxe)</option>
              <option value="Oswald" className="bg-[#12091f]">Oswald (Impact & dynamique)</option>
              <option value="Outfit" className="bg-[#12091f]">Outfit (Minimaliste)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Typographie Textes</label>
            <select
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="Inter" className="bg-[#12091f]">Inter (Haute lisibilité)</option>
              <option value="Roboto" className="bg-[#12091f]">Roboto (Universel)</option>
              <option value="Lora" className="bg-[#12091f]">Lora (Sérif chaleureux)</option>
            </select>
          </div>
        </div>

        {/* Usage Rules */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Règle de dégagement</label>
            <input
              type="text"
              value={clearSpaceRule}
              onChange={(e) => setClearSpaceRule(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-1">À faire (Bonne pratique)</label>
            <input
              type="text"
              value={doRule}
              onChange={(e) => setDoRule(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-red-400 mb-1">À éviter (Interdiction)</label>
            <input
              type="text"
              value={dontRule}
              onChange={(e) => setDontRule(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Preview & Download */}
      <div className="sticky top-24 space-y-4">
        <div className="glassmorphism rounded-2xl p-4 border border-brand-purple/20 shadow-2xl flex flex-col items-center">
          <canvas
            ref={canvasRef}
            className="w-full aspect-[1414/1000] rounded-xl border border-white/10 shadow-inner bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadPdf}
            className="flex items-center justify-center gap-2 bg-[#D95200] hover:bg-[#B84200] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Download size={14} /> Télécharger PDF
          </button>
          <button
            onClick={downloadPng}
            className="flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple/80 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Download size={14} /> Exporter Image
          </button>
        </div>
      </div>
    </div>
  );
}
