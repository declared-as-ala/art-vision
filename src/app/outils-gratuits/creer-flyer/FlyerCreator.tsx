"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { jsPDF } from "jspdf";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import LeadCapture from "@/components/tools/LeadCapture";

type TemplateId = "promo" | "ouverture" | "evenement" | "nouveaute";

const TEMPLATES: { id: TemplateId; label: string; bg: [string, string]; accent: string }[] = [
  { id: "promo", label: "Promotion", bg: ["#1A0633", "#3B0A52"], accent: "#FF6A00" },
  { id: "ouverture", label: "Grande ouverture", bg: ["#08051F", "#1A1238"], accent: "#E0B65C" },
  { id: "evenement", label: "Événement", bg: ["#2A0A4A", "#6C2BD9"], accent: "#D72888" },
  { id: "nouveaute", label: "Nouveauté", bg: ["#0B132B", "#1C2541"], accent: "#5BC0BE" },
];

const inputCls = "w-full rounded-lg px-3 py-2.5 text-xs text-white outline-none";
const W = 1000, H = 1414;

interface FlyerData {
  title: string; subtitle: string; offer: string; date: string;
  location: string; phone: string; cta: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export default function FlyerCreator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tpl, setTpl] = useState<TemplateId>("promo");
  const [accent, setAccent] = useState(TEMPLATES[0].accent);
  const [bgImage, setBgImage] = useState("");
  const [logo, setLogo] = useState("");
  const [d, setD] = useState<FlyerData>({
    title: "Offre spéciale", subtitle: "Profitez de notre promotion", offer: "-30%",
    date: "Du 1 au 15 juin", location: "12 rue des Arts, Paris", phone: "01 23 45 67 89", cta: "Réservez maintenant",
  });

  const set = (k: keyof FlyerData, v: string) => setD((p) => ({ ...p, [k]: v }));
  const selectTpl = (id: TemplateId) => { setTpl(id); setAccent(TEMPLATES.find((t) => t.id === id)!.accent); };

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const template = TEMPLATES.find((t) => t.id === tpl)!;

    // background
    if (bgImage) {
      try {
        const img = await loadImage(bgImage);
        const scale = Math.max(W / img.width, H / img.height);
        const w = img.width * scale, h = img.height * scale;
        ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
        ctx.fillStyle = "rgba(8,5,31,0.62)"; ctx.fillRect(0, 0, W, H);
      } catch { /* fall through to gradient */ }
    } else {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, template.bg[0]); grad.addColorStop(1, template.bg[1]);
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    }

    // accent glow corner
    const glow = ctx.createRadialGradient(W, 0, 0, W, 0, 600);
    glow.addColorStop(0, `${accent}55`); glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    // accent bar
    ctx.fillStyle = accent; ctx.fillRect(80, 250, 120, 10);

    // title
    ctx.textBaseline = "top";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 92px Sora, sans-serif";
    const titleLines = wrap(ctx, d.title.toUpperCase(), W - 160);
    let y = 300;
    titleLines.slice(0, 3).forEach((l) => { ctx.fillText(l, 80, y); y += 100; });

    // subtitle
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.font = "40px Inter, sans-serif";
    wrap(ctx, d.subtitle, W - 160).slice(0, 2).forEach((l) => { ctx.fillText(l, 80, y); y += 52; });

    // offer badge
    if (d.offer) {
      const badgeY = 760;
      ctx.fillStyle = accent;
      ctx.beginPath();
      // rounded rect
      const bw = Math.min(560, 200 + ctx.measureText(d.offer).width);
      roundRect(ctx, 80, badgeY, bw, 150, 24); ctx.fill();
      ctx.fillStyle = "#0b0820"; ctx.font = "bold 96px Sora, sans-serif";
      ctx.fillText(d.offer, 110, badgeY + 26);
    }

    // info block
    ctx.font = "34px Inter, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    let iy = 990;
    const info = [d.date && `📅  ${d.date}`, d.location && `📍  ${d.location}`, d.phone && `📞  ${d.phone}`].filter(Boolean) as string[];
    info.forEach((l) => { ctx.fillText(l, 80, iy); iy += 56; });

    // CTA bar
    if (d.cta) {
      const cy = H - 200;
      ctx.fillStyle = accent; roundRect(ctx, 80, cy, W - 160, 110, 18); ctx.fill();
      ctx.fillStyle = "#0b0820"; ctx.font = "bold 46px Sora, sans-serif";
      ctx.textAlign = "center"; ctx.fillText(d.cta, W / 2, cy + 30); ctx.textAlign = "left";
    }

    // logo
    if (logo) {
      try {
        const img = await loadImage(logo);
        const lw = 160, lh = (img.height / img.width) * 160;
        ctx.drawImage(img, W - lw - 80, 80, lw, lh);
      } catch { /* ignore */ }
    }

    // footer brand
    ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.font = "22px Inter, sans-serif";
    ctx.fillText("Créé avec Art Vision", 80, H - 60);
  }, [tpl, accent, bgImage, logo, d]);

  useEffect(() => { draw(); }, [draw]);

  const onFile = (setter: (v: string) => void, maxMb: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxMb * 1024 * 1024) { alert(`Fichier trop lourd (max ${maxMb} Mo).`); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const downloadPng = async () => {
    await draw();
    const canvas = canvasRef.current!;
    const a = document.createElement("a");
    a.download = "flyer-art-vision.png"; a.href = canvas.toDataURL("image/png"); a.click();
  };
  const downloadPdf = async () => {
    await draw();
    const canvas = canvasRef.current!;
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
    pdf.save("flyer-art-vision.pdf");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Controls */}
      <div className="glassmorphism rounded-2xl p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-white/55">Modèle</label>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => selectTpl(t.id)} className={`py-2.5 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${tpl === t.id ? "bg-brand-magenta border-brand-magenta text-white" : "border-brand-purple/25 text-white/65 hover:border-brand-magenta/40"}`}>{t.label}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Titre"><input className={inputCls} value={d.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="Offre / prix"><input className={inputCls} value={d.offer} onChange={(e) => set("offer", e.target.value)} placeholder="-30%" /></Field>
        </div>
        <Field label="Sous-titre"><input className={inputCls} value={d.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date"><input className={inputCls} value={d.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <Field label="Téléphone"><input className={inputCls} value={d.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        </div>
        <Field label="Lieu"><input className={inputCls} value={d.location} onChange={(e) => set("location", e.target.value)} /></Field>
        <Field label="Bouton / appel à l'action"><input className={inputCls} value={d.cta} onChange={(e) => set("cta", e.target.value)} /></Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Couleur d'accent">
            <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent" />
          </Field>
          <Field label="Image de fond">
            <label className="flex items-center justify-center gap-2 h-10 rounded-lg border border-brand-purple/30 text-xs text-white/75 cursor-pointer hover:border-brand-magenta/40">
              <Upload size={13} /> {bgImage ? "Changer" : "Importer"}
              <input type="file" accept="image/*" onChange={onFile(setBgImage, 6)} className="hidden" />
            </label>
          </Field>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-brand-purple/30 text-xs text-white/75 cursor-pointer hover:border-brand-magenta/40">
            <ImageIcon size={13} /> {logo ? "Changer le logo" : "Importer un logo"}
            <input type="file" accept="image/*" onChange={onFile(setLogo, 2)} className="hidden" />
          </label>
          {(bgImage || logo) && (
            <button onClick={() => { setBgImage(""); setLogo(""); }} className="text-[11px] text-red-400 hover:text-red-300">Réinitialiser</button>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <div className="glassmorphism rounded-2xl p-6 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="w-full max-w-[340px] rounded-xl shadow-2xl border border-white/10"
            aria-label="Aperçu du flyer"
          />
          <div className="grid grid-cols-2 gap-2 w-full max-w-[340px] mt-5">
            <button onClick={downloadPng} className="flex items-center justify-center gap-1.5 bg-brand-orange hover:bg-brand-orange/90 text-white py-2.5 rounded-lg text-xs font-bold transition cursor-pointer">
              <Download size={13} /> PNG
            </button>
            <button onClick={downloadPdf} className="flex items-center justify-center gap-1.5 bg-brand-purple hover:bg-brand-purple/90 text-white py-2.5 rounded-lg text-xs font-bold transition cursor-pointer">
              <Download size={13} /> PDF
            </button>
          </div>
        </div>

        <LeadCapture
          payload={{ toolType: "creer-flyer", inputData: { template: tpl, ...d }, outputData: { generated: true } }}
          title="Demander une version professionnelle"
          description="Notre studio peut peaufiner ce flyer et préparer l'impression."
          ctaLabel="Demander une version pro"
          compact
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-white/70">{label}</label>
      {children}
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
