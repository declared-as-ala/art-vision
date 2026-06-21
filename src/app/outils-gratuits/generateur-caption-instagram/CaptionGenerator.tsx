"use client";

import { useState } from "react";
import { Hash, Loader2, Copy, Check, Cpu } from "lucide-react";
import CopyButton from "@/components/tools/CopyButton";
import LeadCapture from "@/components/tools/LeadCapture";

const POST_TYPES = ["Promotion", "Nouveau produit", "Offre", "Événement", "Ouverture", "Témoignage", "Éducatif"];
const TONES = ["Professionnel", "Premium", "Amical", "Moderne", "Audacieux", "Luxe"];
const inputCls = "w-full rounded-lg px-3 py-2.5 text-xs text-white outline-none";

interface Result {
  caption: string; shortVersion: string; longVersion: string; ctaOptions: string[]; hashtags: string[];
}

export default function CaptionGenerator() {
  const [f, setF] = useState({ businessType: "", postType: "Promotion", tone: "Moderne", city: "", details: "", ctaPreference: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [copiedTags, setCopiedTags] = useState(false);

  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const generate = async () => {
    if (!f.businessType.trim()) { setError("Indiquez votre type d'activité."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "caption", ...f }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setResult(data.result); setSource(data.source);
    } catch { setError("Une erreur est survenue. Réessayez."); }
    finally { setLoading(false); }
  };

  const copyTags = () => {
    if (!result) return;
    navigator.clipboard?.writeText(result.hashtags.join(" "));
    setCopiedTags(true); setTimeout(() => setCopiedTags(false), 1500);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div className="glassmorphism rounded-2xl p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-white/70">Type d'activité *</label>
          <input className={inputCls} value={f.businessType} onChange={(e) => set("businessType", e.target.value)} placeholder="Ex : boulangerie artisanale" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">Type de publication</label>
          <div className="flex flex-wrap gap-2">
            {POST_TYPES.map((t) => (
              <button key={t} onClick={() => set("postType", t)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${f.postType === t ? "bg-brand-magenta border-brand-magenta text-white" : "border-brand-purple/25 text-white/65 hover:border-brand-magenta/40"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-white/70">Ton</label>
            <select className={inputCls} value={f.tone} onChange={(e) => set("tone", e.target.value)}>
              {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-white/70">Ville (option)</label>
            <input className={inputCls} value={f.city} onChange={(e) => set("city", e.target.value)} placeholder="Marseille" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">Détails du produit / service</label>
          <textarea className={`${inputCls} resize-none`} rows={3} value={f.details} onChange={(e) => set("details", e.target.value)} placeholder="Ex : -20% sur toutes les viennoiseries ce week-end" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">Appel à l'action souhaité (option)</label>
          <input className={inputCls} value={f.ctaPreference} onChange={(e) => set("ctaPreference", e.target.value)} placeholder="Ex : réserver, venir en boutique..." />
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        <button onClick={generate} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-60 text-white py-3 rounded-lg text-sm font-bold transition cursor-pointer">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Hash size={16} />}
          {result ? "Régénérer" : "Générer ma légende"}
        </button>
      </div>

      <div className="space-y-4">
        {result ? (
          <>
            <div className="glassmorphism rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-sora font-bold text-white">Votre contenu</h3>
                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-white/40">
                  <Cpu size={10} /> {source === "ai" ? "Généré par IA" : "Moteur intelligent"}
                </span>
              </div>

              {[
                { label: "Légende", value: result.caption },
                { label: "Version courte", value: result.shortVersion },
                { label: "Version longue", value: result.longVersion },
              ].map((block) => (
                <div key={block.label} className="rounded-xl border border-white/10 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-brand-magenta">{block.label}</span>
                    <CopyButton value={block.value} />
                  </div>
                  <p className="text-xs text-white/80 whitespace-pre-line leading-relaxed">{block.value}</p>
                </div>
              ))}

              <div className="rounded-xl border border-white/10 p-3.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-magenta block mb-2">Options d'appel à l'action</span>
                <div className="space-y-1.5">
                  {result.ctaOptions.map((c, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <p className="text-xs text-white/75">{c}</p>
                      <CopyButton value={c} label="" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glassmorphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-magenta">{result.hashtags.length} hashtags</span>
                <button onClick={copyTags} className="text-[11px] inline-flex items-center gap-1 text-white/60 hover:text-brand-magenta">
                  {copiedTags ? <Check size={12} className="text-green-400" /> : <Copy size={12} />} Tout copier
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.hashtags.map((h) => (
                  <span key={h} className="text-[11px] bg-brand-purple/20 border border-brand-purple/30 text-white/80 px-2 py-1 rounded-md">{h}</span>
                ))}
              </div>
            </div>

            <LeadCapture
              payload={{ toolType: "generateur-caption-instagram", inputData: f, outputData: result }}
              title="Recevoir ce contenu par e-mail"
              ctaLabel="Enregistrer"
              compact
            />
          </>
        ) : !loading && (
          <div className="glassmorphism rounded-2xl p-10 text-center text-white/45 text-sm">
            <Hash size={28} className="mx-auto mb-3 text-brand-magenta/50" />
            Générez une légende complète avec 15 à 25 hashtags pertinents.
          </div>
        )}
      </div>
    </div>
  );
}
