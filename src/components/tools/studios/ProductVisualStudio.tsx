"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Download, Upload, Sparkles, Tag, ArrowRight } from "lucide-react";

export default function ProductVisualStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [productTitle, setProductTitle] = useState("Veste Oversize Minimalist");
  const [subtitle, setSubtitle] = useState("Collection Automne-Hiver • Coton biologique");
  const [price, setPrice] = useState("49 €");
  const [oldPrice, setOldPrice] = useState("79 €");
  const [badgeText, setBadgeText] = useState("-35% FLASH");
  const [ctaText, setCtaText] = useState("COMMANDER EN LIGNE");
  const [brandName, setBrandName] = useState("ART VISION ATELIER");
  const [format, setFormat] = useState<"carre" | "story">("carre");
  const [accentColor, setAccentColor] = useState("#D72888");

  const [productImgSrc, setProductImgSrc] = useState<string>("");
  const [logoImgSrc, setLogoImgSrc] = useState<string>("");

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setProductImgSrc(String(event.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setLogoImgSrc(String(event.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions
    const W = 1080;
    const H = format === "carre" ? 1080 : 1920;
    canvas.width = W;
    canvas.height = H;

    // Background gradient: sleek dark luxury advertising aesthetic
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#190827");
    bg.addColorStop(0.5, "#0b0314");
    bg.addColorStop(1, "#06010a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Ambient radial lighting behind product
    const ambientY = format === "carre" ? 480 : 750;
    const ambient = ctx.createRadialGradient(W / 2, ambientY, 80, W / 2, ambientY, 500);
    ambient.addColorStop(0, `${accentColor}44`);
    ambient.addColorStop(0.8, "transparent");
    ctx.fillStyle = ambient;
    ctx.fillRect(0, 0, W, H);

    // Top Header: Brand Name / Logo
    let logoImg: HTMLImageElement | null = null;
    if (logoImgSrc) {
      logoImg = await new Promise((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.src = logoImgSrc;
      });
    }

    if (logoImg) {
      const lW = 140;
      const lH = (logoImg.height / logoImg.width) * lW;
      ctx.drawImage(logoImg, 70, 60, lW, lH);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 24px Montserrat, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(brandName.toUpperCase(), 70, 90);
    }

    // Top Right Category Tag
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.roundRect(W - 280, 55, 210, 48, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 13px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("OFFRE EXCLUSIVE", W - 175, 84);

    // Product Image or Showcase Box
    const boxW = W - 140;
    const boxH = format === "carre" ? 480 : 800;
    const boxX = 70;
    const boxY = 140;

    let prodImg: HTMLImageElement | null = null;
    if (productImgSrc) {
      prodImg = await new Promise((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.src = productImgSrc;
      });
    }

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 28);
    ctx.clip();

    if (prodImg) {
      // Draw product image contained/covered nicely with soft shadow
      const scale = Math.max(boxW / prodImg.width, boxH / prodImg.height);
      const iw = prodImg.width * scale;
      const ih = prodImg.height * scale;
      ctx.drawImage(prodImg, boxX + (boxW - iw) / 2, boxY + (boxH - ih) / 2, iw, ih);

      // Dark subtle vignette at bottom of photo
      const photoGrad = ctx.createLinearGradient(0, boxY + boxH * 0.6, 0, boxY + boxH);
      photoGrad.addColorStop(0, "transparent");
      photoGrad.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = photoGrad;
      ctx.fillRect(boxX, boxY, boxW, boxH);
    } else {
      // Placeholder product showcase
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "bold 26px Montserrat, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Importez la photo de votre produit", W / 2, boxY + boxH / 2);
    }
    ctx.restore();

    // Discount Badge floating over image
    if (badgeText) {
      const bw = 200;
      const bh = 54;
      const bx = boxX + 24;
      const by = boxY + 24;

      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 14);
      ctx.fill();

      // Badge shadow
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 20;

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 18px Montserrat, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(badgeText, bx + bw / 2, by + 34);

      ctx.shadowColor = "transparent";
    }

    // Bottom Content Card (Title, Prices, CTA)
    const contentY = boxY + boxH + 40;

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 44px Montserrat, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(productTitle, 70, contentY);

    // Subtitle
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "500 20px Montserrat, sans-serif";
    ctx.fillText(subtitle, 70, contentY + 44);

    // Pricing Row
    const priceY = contentY + 110;

    // New Price
    ctx.fillStyle = accentColor;
    ctx.font = "900 64px Montserrat, sans-serif";
    ctx.fillText(price, 70, priceY);

    // Old Price with strikethrough line
    if (oldPrice) {
      const oldX = 70 + ctx.measureText(price).width + 30;
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "700 38px Montserrat, sans-serif";
      ctx.fillText(oldPrice, oldX, priceY - 10);

      const oldW = ctx.measureText(oldPrice).width;
      ctx.strokeStyle = "#e11d48";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(oldX - 4, priceY - 22);
      ctx.lineTo(oldX + oldW + 4, priceY - 22);
      ctx.stroke();
    }

    // CTA Button (Full or Right-aligned)
    const ctaW = format === "carre" ? 360 : W - 140;
    const ctaH = 75;
    const ctaX = format === "carre" ? W - 70 - ctaW : 70;
    const ctaY = format === "carre" ? priceY - 60 : priceY + 60;

    ctx.fillStyle = "#D95200"; // Brand Orange CTA
    ctx.beginPath();
    ctx.roundRect(ctaX, ctaY, ctaW, ctaH, 38);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 18px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(ctaText, ctaX + ctaW / 2, ctaY + 44);

    // Watermark
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "500 12px Montserrat, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Design publicitaire • Art Vision Studio", 70, H - 35);
  }, [productTitle, subtitle, price, oldPrice, badgeText, ctaText, brandName, format, accentColor, productImgSrc, logoImgSrc]);

  useEffect(() => {
    draw();
  }, [draw]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `visuel-produit-${format}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const downloadJpg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `visuel-produit-${format}.jpg`;
    a.href = canvas.toDataURL("image/jpeg", 0.95);
    a.click();
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
      {/* Controls */}
      <div className="glassmorphism rounded-2xl p-6 space-y-5 text-left border border-brand-purple/20">
        <div>
          <h2 className="text-base font-bold text-white font-montserrat">Créateur de Visuel Produit</h2>
          <p className="text-xs text-white/60 mt-0.5">
            Générez un visuel publicitaire impactant pour Instagram, Facebook ou Story.
          </p>
        </div>

        {/* Format toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormat("carre")}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
              format === "carre"
                ? "bg-brand-orange text-white border-brand-orange"
                : "bg-white/5 text-white/70 border-white/10"
            }`}
          >
            Carré Instagram (1080 × 1080)
          </button>
          <button
            type="button"
            onClick={() => setFormat("story")}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
              format === "story"
                ? "bg-brand-orange text-white border-brand-orange"
                : "bg-white/5 text-white/70 border-white/10"
            }`}
          >
            Story / Reel (1080 × 1920)
          </button>
        </div>

        {/* Distinct Uploads: Product Photo & Logo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">Photo du produit</label>
            <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-white/20 hover:border-brand-magenta/60 rounded-xl cursor-pointer bg-white/5 text-xs text-white/70 hover:bg-white/10 transition">
              <Upload size={14} />
              <span>{productImgSrc ? "Changer photo" : "Importer photo"}</span>
              <input type="file" accept="image/*" onChange={handleProductUpload} className="hidden" />
            </label>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">Logo de marque</label>
            <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-white/20 hover:border-brand-magenta/60 rounded-xl cursor-pointer bg-white/5 text-xs text-white/70 hover:bg-white/10 transition">
              <Upload size={14} />
              <span>{logoImgSrc ? "Changer logo" : "Importer logo"}</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Text Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Nom du produit</label>
            <input
              type="text"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Sous-titre / Caractéristique clé</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        {/* Pricing & Discount */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Prix promo</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Ancien prix</label>
            <input
              type="text"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white/60 line-through"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Badge remise</label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        {/* CTA & Brand Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Bouton d'action (CTA)</label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Couleur d'accent</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-9 w-12 rounded cursor-pointer bg-white/5"
              />
              <span className="text-xs text-white/60 uppercase">{accentColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview & Download */}
      <div className="sticky top-24 space-y-4">
        <div className="glassmorphism rounded-2xl p-4 border border-brand-purple/20 shadow-2xl flex flex-col items-center">
          <canvas
            ref={canvasRef}
            style={{
              maxHeight: format === "carre" ? "380px" : "480px",
              maxWidth: "100%",
            }}
            className="rounded-xl border border-white/10 shadow-inner bg-black"
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
            onClick={downloadJpg}
            className="flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple/80 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Download size={14} /> Télécharger JPG
          </button>
        </div>
      </div>
    </div>
  );
}
