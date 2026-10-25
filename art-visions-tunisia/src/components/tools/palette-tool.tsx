"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

function hslToHex(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return "#" + [f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function hexToHsl(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s * 100, l * 100];
}
function lum(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const MODES = {
  Complémentaire: [0, 180],
  Analogue: [-30, 0, 30],
  Triadique: [0, 120, 240],
  "Complémentaire divisée": [0, 150, 210],
  Tétradique: [0, 90, 180, 270],
} as const;

export function PaletteTool() {
  const [base, setBase] = useState("#ba3184");
  const [mode, setMode] = useState<keyof typeof MODES>("Triadique");
  const [copied, setCopied] = useState("");

  const colors = useMemo(() => {
    const [h, s, l] = hexToHsl(base);
    const main = MODES[mode].map((d) => hslToHex(h + d, s, l));
    return [...main, hslToHex(h, Math.min(s, 20), 95), hslToHex(h, Math.min(s, 40), 12)];
  }, [base, mode]);

  function copy(c: string) {
    navigator.clipboard?.writeText(c);
    setCopied(c);
    setTimeout(() => setCopied(""), 1200);
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end gap-6 rounded-3xl bg-white p-6 ring-1 ring-line">
        <label className="grid gap-2 text-sm font-medium">Couleur de base
          <span className="flex items-center gap-3">
            <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-12 w-16 cursor-pointer rounded-lg border border-line bg-transparent" aria-label="Couleur de base" />
            <span className="num text-sm uppercase">{base}</span>
          </span>
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Type d'harmonie">
          {(Object.keys(MODES) as (keyof typeof MODES)[]).map((m) => (
            <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m} className={`rounded-full px-4 py-2 text-sm transition-colors ${mode === m ? "bg-indigo text-white" : "bg-tint-violet text-indigo hover:bg-indigo/10"}`}>{m}</button>
          ))}
        </div>
      </div>
      <ul className="grid overflow-hidden rounded-3xl sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        {colors.map((c, i) => {
          const fg = contrast(c, "#ffffff") >= contrast(c, "#000000") ? "#fff" : "#000";
          return (
            <li key={c + i}>
              <button onClick={() => copy(c)} style={{ background: c, color: fg }} className="flex h-44 w-full flex-col justify-between p-4 text-start transition-[filter] hover:brightness-110">
                <span className="self-end">{copied === c ? <Check size={16} /> : <Copy size={16} />}</span>
                <span className="num text-sm uppercase">{c}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="rounded-3xl bg-white p-6 ring-1 ring-line">
        <h2 className="text-lg font-semibold">Contraste du texte</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {colors.slice(0, 4).map((c) => {
            const r = contrast(c, "#ffffff");
            return (
              <li key={c} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm" style={{ background: c, color: "#fff" }}>
                <span>Texte blanc</span>
                <span className="num rounded-full bg-black/25 px-2 py-0.5 text-xs">{r.toFixed(1)}:1 {r >= 4.5 ? "AA ✓" : "faible"}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-soft">Un rapport d&apos;au moins 4,5:1 est recommandé pour le texte courant (WCAG AA).</p>
      </div>
    </div>
  );
}
