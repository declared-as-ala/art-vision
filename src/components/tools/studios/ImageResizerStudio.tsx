"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Download, Upload, Crop, ZoomIn, Move, Check } from "lucide-react";

interface Preset {
  id: string;
  name: string;
  w: number;
  h: number;
  desc: string;
}

const PRESETS: Preset[] = [
  { id: "ig-carre", name: "Instagram Carré", w: 1080, h: 1080, desc: "1:1 • Post classique" },
  { id: "ig-portrait", name: "Instagram Portrait", w: 1080, h: 1350, desc: "4:5 • Format recommandé" },
  { id: "ig-story", name: "Instagram Story / TikTok", w: 1080, h: 1920, desc: "9:16 • Plein écran vertical" },
  { id: "fb-post", name: "Facebook Post", w: 1200, h: 630, desc: "1.91:1 • Fil d'actualité" },
  { id: "li-post", name: "LinkedIn Post", w: 1200, h: 627, desc: "B2B • Standard horizontal" },
  { id: "yt-thumb", name: "YouTube Miniature", w: 1280, h: 720, desc: "16:9 • Cover vidéo" },
  { id: "custom", name: "Dimensions sur-mesure", w: 800, h: 800, desc: "Personnalisé en pixels" },
];

export default function ImageResizerStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("ig-carre");
  const [customW, setCustomW] = useState(1200);
  const [customH, setCustomH] = useState(800);
  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [zoom, setZoom] = useState(100); // 100 to 250%
  const [panX, setPanX] = useState(0); // -100 to 100%
  const [panY, setPanY] = useState(0); // -100 to 100%
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageOriginalSize, setImageOriginalSize] = useState<{ w: number; h: number } | null>(null);

  const preset = PRESETS.find((p) => p.id === selectedPreset) || PRESETS[0];
  const targetW = selectedPreset === "custom" ? customW : preset.w;
  const targetH = selectedPreset === "custom" ? customH : preset.h;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = String(event.target?.result || "");
      setImageSrc(src);
      const img = new Image();
      img.onload = () => {
        setImageOriginalSize({ w: img.width, h: img.height });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = targetW;
    canvas.height = targetH;

    // Fill canvas background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetW, targetH);

    if (!imageSrc) {
      // Empty state placeholder on canvas
      ctx.fillStyle = "#1e1330";
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, targetW - 40, targetH - 40);

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "bold 32px Montserrat, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Importez votre image pour redimensionner", targetW / 2, targetH / 2 - 20);
      ctx.font = "20px Montserrat, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText(`${targetW} x ${targetH} px (${preset.name})`, targetW / 2, targetH / 2 + 25);
      ctx.textAlign = "left";
      return;
    }

    const img = await new Promise<HTMLImageElement | null>((res) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => res(null);
      i.src = imageSrc;
    });

    if (!img) return;

    // Calculate dimensions without distortion
    const scaleRatio = zoom / 100;

    if (fitMode === "cover") {
      // Scale so that image completely covers target canvas
      const scale = Math.max(targetW / img.width, targetH / img.height) * scaleRatio;
      const renderW = img.width * scale;
      const renderH = img.height * scale;

      const offsetX = (targetW - renderW) / 2 + (panX / 100) * (renderW - targetW);
      const offsetY = (targetH - renderH) / 2 + (panY / 100) * (renderH - targetH);

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    } else {
      // Contain mode (fits within, background shows around)
      const scale = Math.min(targetW / img.width, targetH / img.height) * scaleRatio;
      const renderW = img.width * scale;
      const renderH = img.height * scale;

      const offsetX = (targetW - renderW) / 2 + (panX / 100) * (targetW / 2);
      const offsetY = (targetH - renderH) / 2 + (panY / 100) * (targetH / 2);

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    }
  }, [imageSrc, targetW, targetH, fitMode, bgColor, zoom, panX, panY, preset.name]);

  useEffect(() => {
    draw();
  }, [draw]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `visuel-${targetW}x${targetH}-${preset.id}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
      {/* Controls */}
      <div className="glassmorphism rounded-2xl p-6 space-y-6 text-left border border-brand-purple/20">
        <div>
          <h2 className="text-base font-bold text-white font-montserrat">Redimensionneur & Recadrage</h2>
          <p className="text-xs text-white/60 mt-0.5">
            Adaptez vos visuels aux formats exacts des réseaux sociaux sans étirement ni déformation.
          </p>
        </div>

        {/* Upload file */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-2">Image source</label>
          <label className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-white/20 hover:border-brand-magenta/60 rounded-xl cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition text-xs text-white/70">
            <Upload size={16} />
            <span>{imageSrc ? "Remplacer l'image chargée" : "Sélectionner une photo / visuel"}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {imageOriginalSize && (
            <p className="text-[11px] text-white/50 mt-1.5">
              Dimensions d'origine : {imageOriginalSize.w} × {imageOriginalSize.h} px
            </p>
          )}
        </div>

        {/* Presets Grid */}
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-2">Format de sortie ciblé</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPreset(p.id)}
                className={`p-3 rounded-xl text-left border transition ${
                  selectedPreset === p.id
                    ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20"
                    : "bg-white/5 text-white/70 border-white/10 hover:border-brand-magenta/40"
                }`}
              >
                <div className="font-bold text-xs">{p.name}</div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  {p.w} × {p.h} px • {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Dimensions if selected */}
        {selectedPreset === "custom" && (
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <label className="block text-xs text-white/70 mb-1">Largeur (px)</label>
              <input
                type="number"
                min={50}
                max={5000}
                value={customW}
                onChange={(e) => setCustomW(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-white/70 mb-1">Hauteur (px)</label>
              <input
                type="number"
                min={50}
                max={5000}
                value={customH}
                onChange={(e) => setCustomH(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        )}

        {/* Framing & Fit Mode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">Mode de cadrage</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFitMode("cover")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                  fitMode === "cover" ? "bg-white/20 border-white text-white" : "border-white/10 text-white/60"
                }`}
              >
                Remplir (Cover)
              </button>
              <button
                type="button"
                onClick={() => setFitMode("contain")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                  fitMode === "contain" ? "bg-white/20 border-white text-white" : "border-white/10 text-white/60"
                }`}
              >
                Ajuster (Contain)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">Couleur de fond (si bordures)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 w-12 rounded-lg cursor-pointer bg-white/5 border border-white/10"
              />
              <span className="text-xs text-white/60 uppercase">{bgColor}</span>
            </div>
          </div>
        </div>

        {/* Zoom & Positioning sliders */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div>
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>Zoom : {zoom}%</span>
            </div>
            <input
              type="range"
              min="100"
              max="250"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-brand-orange"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-white/70 mb-1">Cadrage X : {panX}%</span>
              <input
                type="range"
                min="-100"
                max="100"
                value={panX}
                onChange={(e) => setPanX(Number(e.target.value))}
                className="w-full accent-brand-magenta"
              />
            </div>
            <div>
              <span className="block text-xs text-white/70 mb-1">Cadrage Y : {panY}%</span>
              <input
                type="range"
                min="-100"
                max="100"
                value={panY}
                onChange={(e) => setPanY(Number(e.target.value))}
                className="w-full accent-brand-magenta"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview & Download */}
      <div className="sticky top-24 space-y-4">
        <div className="glassmorphism rounded-2xl p-4 border border-brand-purple/20 shadow-2xl flex flex-col items-center">
          <div className="max-w-full max-h-[420px] overflow-hidden rounded-xl border border-white/10 shadow-lg flex items-center justify-center bg-black/50 p-2">
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: "100%",
                maxHeight: "380px",
                objectFit: "contain",
              }}
              className="rounded shadow"
            />
          </div>
          <div className="mt-3 text-center text-xs text-white/60">
            Export exact : <strong className="text-white">{targetW} × {targetH} px</strong>
          </div>
        </div>

        <button
          onClick={downloadImage}
          disabled={!imageSrc}
          className="w-full flex items-center justify-center gap-2 bg-[#D95200] hover:bg-[#B84200] disabled:bg-white/10 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#D95200]/25 cursor-pointer"
        >
          <Download size={16} /> Télécharger en {targetW}×{targetH} px (PNG)
        </button>
      </div>
    </div>
  );
}
