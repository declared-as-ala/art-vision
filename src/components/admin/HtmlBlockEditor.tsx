"use client";

import { useState } from "react";
import { Code2, Eye, RotateCcw, Maximize2, Minimize2 } from "lucide-react";

// Lightweight HTML block editor: code view + live (lightly sanitized) preview.
// Final sanitization happens server-side on save and on render.
function previewSanitize(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/javascript:/gi, "");
}

export default function HtmlBlockEditor({
  value,
  onChange,
  label = "Bloc HTML personnalisé",
  hint = "Headings, paragraphes, listes, liens, images, tableaux… Le code est nettoyé automatiquement (scripts interdits).",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  hint?: string;
}) {
  const [mode, setMode] = useState<"code" | "preview">("code");
  const [full, setFull] = useState(false);

  return (
    <div className={`space-y-2 ${full ? "fixed inset-0 z-[60] bg-[#08051F] p-6 overflow-auto" : ""}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs text-white/70 font-semibold">{label}</label>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setMode("code")} className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold transition cursor-pointer ${mode === "code" ? "bg-brand-magenta text-white" : "bg-white/5 text-white/60 hover:text-white"}`}>
            <Code2 size={12} /> Code
          </button>
          <button type="button" onClick={() => setMode("preview")} className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold transition cursor-pointer ${mode === "preview" ? "bg-brand-magenta text-white" : "bg-white/5 text-white/60 hover:text-white"}`}>
            <Eye size={12} /> Aperçu
          </button>
          {value && (
            <button type="button" onClick={() => { if (confirm("Vider ce bloc HTML ?")) onChange(""); }} title="Réinitialiser" className="px-2 py-1 rounded text-white/40 hover:text-red-400 transition cursor-pointer">
              <RotateCcw size={12} />
            </button>
          )}
          <button type="button" onClick={() => setFull((f) => !f)} title="Plein écran" className="px-2 py-1 rounded text-white/40 hover:text-brand-magenta transition cursor-pointer">
            {full ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>

      {mode === "code" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          rows={full ? 24 : 8}
          placeholder={'<section class="...">\n  <h2>Titre</h2>\n  <p>Votre contenu HTML…</p>\n</section>'}
          className="w-full bg-[#050314] border border-brand-purple/30 rounded-lg p-3 text-xs text-green-200 font-mono focus:outline-none focus:border-brand-magenta resize-y leading-relaxed"
        />
      ) : (
        <div className="bg-white rounded-lg p-4 min-h-[160px] overflow-auto cms-rich-content text-[#1a1a22]">
          {value.trim() ? (
            <div dangerouslySetInnerHTML={{ __html: previewSanitize(value) }} />
          ) : (
            <p className="text-gray-400 text-xs">Aucun contenu — l'aperçu s'affichera ici.</p>
          )}
        </div>
      )}

      <p className="text-[10px] text-white/40 leading-relaxed">{hint}</p>
    </div>
  );
}
