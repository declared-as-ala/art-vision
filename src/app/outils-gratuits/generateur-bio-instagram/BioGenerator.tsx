"use client";

import { useState } from "react";
import { AtSign as Instagram, Loader2, Copy, Check, Heart, Cpu } from "lucide-react";
import LeadCapture from "@/components/tools/LeadCapture";

const TONES = ["Professionnel", "Premium", "Amical", "Moderne", "Audacieux", "Luxe"];
const inputCls = "w-full rounded-lg px-3 py-2.5 text-xs text-white outline-none";
const LIMIT = 150;

export default function BioGenerator() {
  const [f, setF] = useState({
    businessName: "", activity: "", city: "", services: "", phone: "", website: "", tone: "Moderne",
  });
  const [emojis, setEmojis] = useState(true);
  const [cta, setCta] = useState(true);
  const [loading, setLoading] = useState(false);
  const [bios, setBios] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const generate = async () => {
    if (!f.businessName.trim() || !f.activity.trim()) { setError("Le nom et l'activité sont requis."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "bio", ...f, emojis, cta }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setBios(data.bios); setSource(data.source);
    } catch { setError("Une erreur est survenue. Réessayez."); }
    finally { setLoading(false); }
  };

  const copy = (s: string) => { navigator.clipboard?.writeText(s); setCopied(s); setTimeout(() => setCopied(""), 1500); };
  const toggleFav = (s: string) => setFavorites((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div className="glassmorphism rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-white/70">Nom *</label>
            <input className={inputCls} value={f.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="Ma Marque" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-white/70">Activité *</label>
            <input className={inputCls} value={f.activity} onChange={(e) => set("activity", e.target.value)} placeholder="Salon de coiffure" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-white/70">Ville</label>
            <input className={inputCls} value={f.city} onChange={(e) => set("city", e.target.value)} placeholder="Lyon" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-white/70">Site / lien</label>
            <input className={inputCls} value={f.website} onChange={(e) => set("website", e.target.value)} placeholder="ma-marque.fr" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">Services principaux</label>
          <input className={inputCls} value={f.services} onChange={(e) => set("services", e.target.value)} placeholder="Coupe, couleur, soins" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">Téléphone / WhatsApp</label>
          <input className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+33 6 12 34 56 78" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">Ton</label>
          <div className="grid grid-cols-3 gap-2">
            {TONES.map((t) => (
              <button key={t} onClick={() => set("tone", t)} className={`py-2 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${f.tone === t ? "bg-brand-magenta border-brand-magenta text-white" : "border-brand-purple/25 text-white/65 hover:border-brand-magenta/40"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
            <input type="checkbox" checked={emojis} onChange={(e) => setEmojis(e.target.checked)} className="w-4 h-4 accent-brand-magenta" /> Emojis
          </label>
          <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
            <input type="checkbox" checked={cta} onChange={(e) => setCta(e.target.checked)} className="w-4 h-4 accent-brand-magenta" /> Appel à l'action
          </label>
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        <button onClick={generate} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-60 text-white py-3 rounded-lg text-sm font-bold transition cursor-pointer">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Instagram size={16} />}
          {bios.length ? "Régénérer" : "Générer mes bios"}
        </button>
      </div>

      <div className="space-y-4">
        {bios.length > 0 ? (
          <div className="glassmorphism rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-sora font-bold text-white">{bios.length} bios proposées</h3>
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-white/40">
                <Cpu size={10} /> {source === "ai" ? "Généré par IA" : "Moteur intelligent"}
              </span>
            </div>
            {bios.map((b, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-3.5 space-y-2">
                <p className="text-xs text-white/85 whitespace-pre-line leading-relaxed">{b}</p>
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className={`text-[10px] font-mono ${b.length > LIMIT ? "text-red-400" : "text-white/40"}`}>{b.length}/{LIMIT}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleFav(b)} className="text-white/40 hover:text-brand-magenta transition" aria-label="Favori">
                      <Heart size={13} className={favorites.includes(b) ? "fill-brand-magenta text-brand-magenta" : ""} />
                    </button>
                    <button onClick={() => copy(b)} className="text-[10px] inline-flex items-center gap-1 text-white/50 hover:text-brand-magenta">
                      {copied === b ? <Check size={11} className="text-green-400" /> : <Copy size={11} />} Copier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="glassmorphism rounded-2xl p-10 text-center text-white/45 text-sm">
            <Instagram size={28} className="mx-auto mb-3 text-brand-magenta/50" />
            Générez 3 à 5 bios optimisées pour votre profil Instagram.
          </div>
        )}

        {favorites.length > 0 && (
          <LeadCapture
            payload={{ toolType: "generateur-bio-instagram", inputData: f, outputData: { favorites } }}
            title="Enregistrer vos bios favorites"
            ctaLabel="Enregistrer"
            compact
          />
        )}
      </div>
    </div>
  );
}
