"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, Check, Heart, RefreshCw, Cpu } from "lucide-react";
import LeadCapture from "@/components/tools/LeadCapture";

const TONES = ["Professionnel", "Premium", "Amical", "Moderne", "Audacieux", "Luxe"];
const inputCls = "w-full rounded-lg px-3 py-2.5 text-xs text-white outline-none";

export default function SloganGenerator() {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("Moderne");
  const [audience, setAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [slogans, setSlogans] = useState<string[]>([]);
  const [source, setSource] = useState<"ai" | "template" | "">("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    if (!businessName.trim()) { setError("Indiquez le nom de votre entreprise."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "slogan", businessName, industry, tone, audience, keywords }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setSlogans(data.slogans); setSource(data.source);
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally { setLoading(false); }
  };

  const copy = (s: string) => { navigator.clipboard?.writeText(s); setCopied(s); setTimeout(() => setCopied(""), 1500); };
  const toggleFav = (s: string) => setFavorites((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div className="glassmorphism rounded-2xl p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-white/70">Nom de l'entreprise *</label>
          <input className={inputCls} value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ex : Café Lumière" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">Secteur d'activité</label>
          <input className={inputCls} value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Ex : restauration, coiffure, immobilier..." />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">Ton</label>
          <div className="grid grid-cols-3 gap-2">
            {TONES.map((t) => (
              <button key={t} onClick={() => setTone(t)} className={`py-2 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${tone === t ? "bg-brand-magenta border-brand-magenta text-white" : "border-brand-purple/25 text-white/65 hover:border-brand-magenta/40"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-white/70">Cible</label>
            <input className={inputCls} value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex : jeunes actifs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-white/70">Mots-clés</label>
            <input className={inputCls} value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Ex : bio, local, rapide" />
          </div>
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        <button onClick={generate} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-60 text-white py-3 rounded-lg text-sm font-bold transition cursor-pointer">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {slogans.length ? "Régénérer" : "Générer mes slogans"}
        </button>
      </div>

      <div className="space-y-4">
        {slogans.length > 0 && (
          <div className="glassmorphism rounded-2xl p-6 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-sora font-bold text-white">{slogans.length} idées de slogans</h3>
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-white/40">
                <Cpu size={10} /> {source === "ai" ? "Généré par IA" : "Moteur intelligent"}
              </span>
            </div>
            {slogans.map((s) => (
              <div key={s} className="flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-3 group">
                <p className="flex-1 text-sm text-white/85">{s}</p>
                <button onClick={() => toggleFav(s)} aria-label="Favori" className="text-white/40 hover:text-brand-magenta transition">
                  <Heart size={14} className={favorites.includes(s) ? "fill-brand-magenta text-brand-magenta" : ""} />
                </button>
                <button onClick={() => copy(s)} aria-label="Copier" className="text-white/40 hover:text-brand-magenta transition">
                  {copied === s ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
            <button onClick={generate} disabled={loading} className="w-full flex items-center justify-center gap-1.5 text-xs text-white/60 hover:text-white pt-2">
              <RefreshCw size={12} /> Proposer d'autres idées
            </button>
          </div>
        )}

        {slogans.length === 0 && !loading && (
          <div className="glassmorphism rounded-2xl p-10 text-center text-white/45 text-sm">
            <Sparkles size={28} className="mx-auto mb-3 text-brand-magenta/50" />
            Remplissez le formulaire et générez au moins 10 idées de slogans.
          </div>
        )}

        {favorites.length > 0 && (
          <LeadCapture
            payload={{ toolType: "generateur-slogan", inputData: { businessName, industry, tone }, outputData: { favorites } }}
            title={`Enregistrer vos ${favorites.length} slogan(s) favori(s)`}
            ctaLabel="Enregistrer mes favoris"
            compact
          />
        )}
      </div>
    </div>
  );
}
