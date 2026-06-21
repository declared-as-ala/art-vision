"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { Upload, Download, RefreshCw, Check, Copy, Palette as PaletteIcon } from "lucide-react";
import LeadCapture from "@/components/tools/LeadCapture";

// ── color helpers ────────────────────────────────────────────────────────────
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
const rgbToHex = (r: number, g: number, b: number) => `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
}
function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function contrastRatio(hex1: string, hex2: string) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  const l1 = luminance(a.r, a.g, a.b), l2 = luminance(b.r, b.g, b.b);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

interface Swatch { role: string; hex: string }

function paletteFromBase(baseHex: string): Swatch[] {
  const { r, g, b } = hexToRgb(baseHex);
  const { h, s } = rgbToHsl(r, g, b);
  return [
    { role: "Primaire", hex: baseHex.toUpperCase() },
    { role: "Secondaire", hex: hslToHex((h + 30) % 360, Math.min(s, 70), 45) },
    { role: "Accent", hex: hslToHex((h + 180) % 360, Math.min(s + 10, 90), 55) },
    { role: "Neutre foncé", hex: hslToHex(h, Math.min(s, 25), 12) },
    { role: "Neutre clair", hex: hslToHex(h, Math.min(s, 18), 96) },
  ];
}

function extractColors(img: HTMLImageElement): string[] {
  const canvas = document.createElement("canvas");
  const w = (canvas.width = 120);
  const h = (canvas.height = Math.max(1, Math.round((img.height / img.width) * 120)));
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const counts = new Map<string, number>();
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 125) continue;
    // quantize to reduce noise
    const r = Math.round(data[i] / 24) * 24;
    const g = Math.round(data[i + 1] / 24) * 24;
    const b = Math.round(data[i + 2] / 24) * 24;
    const key = `${r},${g},${b}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k]) => {
      const [r, g, b] = k.split(",").map(Number);
      return rgbToHex(r, g, b);
    });
}

export default function PaletteGenerator() {
  const [base, setBase] = useState("#6C2BD9");
  const [palette, setPalette] = useState<Swatch[]>(paletteFromBase("#6C2BD9"));
  const [copied, setCopied] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const regenerate = (hex: string) => { setBase(hex); setPalette(paletteFromBase(hex)); };

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image trop lourde (max 5 Mo)."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const cols = extractColors(img);
        if (cols.length >= 3) {
          const dark = [...cols].sort((a, b) => {
            const x = hexToRgb(a), y = hexToRgb(b);
            return luminance(x.r, x.g, x.b) - luminance(y.r, y.g, y.b);
          });
          setBase(cols[0]);
          setPalette([
            { role: "Primaire", hex: cols[0] },
            { role: "Secondaire", hex: cols[1] || cols[0] },
            { role: "Accent", hex: cols[2] || cols[1] || cols[0] },
            { role: "Neutre foncé", hex: dark[0] },
            { role: "Neutre clair", hex: dark[dark.length - 1] },
          ]);
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(""), 1500);
  };

  const exportPng = () => {
    const c = document.createElement("canvas");
    c.width = 1000; c.height = 420;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#0b0820"; ctx.fillRect(0, 0, 1000, 420);
    const w = 1000 / palette.length;
    palette.forEach((s, i) => {
      ctx.fillStyle = s.hex; ctx.fillRect(i * w, 0, w, 320);
      ctx.fillStyle = "#fff"; ctx.font = "bold 22px sans-serif";
      ctx.fillText(s.hex, i * w + 20, 370);
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "14px sans-serif";
      ctx.fillText(s.role, i * w + 20, 395);
    });
    const a = document.createElement("a");
    a.download = "palette-art-vision.png"; a.href = c.toDataURL("image/png"); a.click();
  };

  const exportPdf = () => {
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
    pdf.setFontSize(18); pdf.text("Palette de couleurs — Art Vision", 15, 20);
    const w = 50;
    palette.forEach((s, i) => {
      const { r, g, b } = hexToRgb(s.hex);
      pdf.setFillColor(r, g, b); pdf.rect(15 + i * w, 35, w - 4, 50, "F");
      pdf.setFontSize(10); pdf.setTextColor(40);
      pdf.text(s.role, 15 + i * w, 95);
      pdf.text(s.hex, 15 + i * w, 101);
    });
    pdf.save("palette-art-vision.pdf");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Controls */}
      <div className="glassmorphism rounded-2xl p-6 space-y-5">
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-white/55 block">Couleur de base</label>
          <div className="flex items-center gap-3">
            <input type="color" value={base} onChange={(e) => regenerate(e.target.value)} className="w-14 h-12 rounded-lg cursor-pointer bg-transparent" />
            <input
              value={base}
              onChange={(e) => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && regenerate(e.target.value)}
              className="flex-1 rounded-lg px-3 py-2.5 text-xs text-white outline-none font-mono"
            />
            <button onClick={() => regenerate(base)} className="p-3 rounded-lg border border-brand-purple/30 text-white/70 hover:text-brand-magenta hover:border-brand-magenta/40 transition cursor-pointer" aria-label="Régénérer">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center"><span className="bg-brand-purple-dark px-3 text-[10px] uppercase tracking-widest text-white/40">ou</span></div>
        </div>

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-brand-purple/40 text-xs font-semibold text-white/70 hover:border-brand-magenta/50 hover:text-white transition cursor-pointer"
        >
          <Upload size={15} /> Extraire les couleurs d'une image
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={onImage} className="hidden" />

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button onClick={exportPng} className="flex items-center justify-center gap-1.5 bg-brand-orange hover:bg-brand-orange/90 text-white py-2.5 rounded-lg text-xs font-bold transition cursor-pointer">
            <Download size={13} /> Export PNG
          </button>
          <button onClick={exportPdf} className="flex items-center justify-center gap-1.5 bg-brand-purple hover:bg-brand-purple/90 text-white py-2.5 rounded-lg text-xs font-bold transition cursor-pointer">
            <Download size={13} /> Export PDF
          </button>
        </div>
      </div>

      {/* Palette result */}
      <div className="space-y-4">
        <div className="glassmorphism rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-sora font-bold text-white flex items-center gap-2 mb-2">
            <PaletteIcon size={16} className="text-brand-magenta" /> Votre palette
          </h3>
          {palette.map((s) => {
            const { r, g, b } = hexToRgb(s.hex);
            const { h, s: sat, l } = rgbToHsl(r, g, b);
            const onWhite = contrastRatio(s.hex, "#FFFFFF");
            const onDark = contrastRatio(s.hex, "#08051F");
            return (
              <div key={s.role} className="flex items-center gap-3 rounded-xl border border-white/10 p-2.5">
                <div className="w-14 h-14 rounded-lg shrink-0 border border-white/10" style={{ background: s.hex }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{s.role}</span>
                    <button onClick={() => copy(s.hex)} className="text-[10px] inline-flex items-center gap-1 text-white/60 hover:text-brand-magenta">
                      {copied === s.hex ? <Check size={11} className="text-green-400" /> : <Copy size={11} />} {s.hex}
                    </button>
                  </div>
                  <div className="text-[10px] text-white/45 font-mono mt-1 space-x-2">
                    <span>RGB {r},{g},{b}</span>
                    <span>HSL {h},{sat}%,{l}%</span>
                  </div>
                  <div className="text-[9px] text-white/40 mt-1">
                    Contraste — blanc&nbsp;
                    <span className={onWhite >= 4.5 ? "text-green-400" : "text-amber-400"}>{onWhite}:1</span>
                    &nbsp;· foncé&nbsp;
                    <span className={onDark >= 4.5 ? "text-green-400" : "text-amber-400"}>{onDark}:1</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <LeadCapture
          payload={{ toolType: "generateur-palette-couleurs", inputData: { base }, outputData: { palette } }}
          title="Recevoir cette palette"
          ctaLabel="Enregistrer la palette"
          compact
        />
      </div>
    </div>
  );
}
