"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TEMPLATES: ((a: string, q: string, c: string) => string)[] = [
  (a, q) => `${a} : ${q}, à chaque fois.`,
  (a, q) => `Votre ${a}, version ${q}.`,
  (a, q, c) => `${a} ${q} à ${c}.`,
  (a, q) => `Le ${q} commence ici.`,
  (a, q) => `${a}, c'est ${q}.`,
  (a, q, c) => `${q} et fier de ${c}.`,
  (a, q) => `Parce que ${q} se voit.`,
  (a, q) => `Pensé pour ceux qui aiment le ${q}.`,
];

export function SloganTool() {
  const [activity, setActivity] = useState("Café");
  const [quality, setQuality] = useState("authentique");
  const [city, setCity] = useState("Tunis");
  const [seed, setSeed] = useState(0);

  // Deterministic rotation keeps SSR/CSR consistent; the button advances the offset.
  const ideas = TEMPLATES.map((_, i) => TEMPLATES[(i + seed) % TEMPLATES.length](activity.trim() || "Votre marque", quality.trim() || "qualité", city.trim() || "chez vous")).slice(0, 6);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <div className="grid content-start gap-4 rounded-3xl bg-white p-6 ring-1 ring-line">
        <div className="grid gap-1.5"><Label htmlFor="act">Activité</Label><Input id="act" value={activity} onChange={(e) => setActivity(e.target.value)} /></div>
        <div className="grid gap-1.5"><Label htmlFor="qual">Qualité principale</Label><Input id="qual" value={quality} onChange={(e) => setQuality(e.target.value)} /></div>
        <div className="grid gap-1.5"><Label htmlFor="city">Ville ou région (optionnel)</Label><Input id="city" value={city} onChange={(e) => setCity(e.target.value)} /></div>
        <button onClick={() => setSeed((s) => s + 1)} className="inline-flex items-center justify-center gap-2 rounded-full bg-violet px-5 py-3 text-sm font-medium text-white hover:bg-indigo"><RefreshCw size={16} />Autres idées</button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {ideas.map((s, i) => (
          <li key={s} className={`rounded-3xl p-6 text-xl font-semibold leading-snug ${["bg-tint-violet text-indigo", "bg-tint-brand text-brand-ink", "bg-tint-copper text-copper"][i % 3]}`}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
