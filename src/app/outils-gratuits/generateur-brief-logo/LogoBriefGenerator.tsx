"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { ChevronLeft, ChevronRight, Download, PenTool, Check } from "lucide-react";
import LeadCapture from "@/components/tools/LeadCapture";

const inputCls = "w-full rounded-lg px-3 py-2.5 text-xs text-white outline-none";

const STYLES = ["Minimaliste", "Moderne", "Classique", "Luxe", "Ludique", "Tech", "Vintage", "Artisanal"];
const PERSONALITIES = ["Sérieux", "Chaleureux", "Audacieux", "Élégant", "Innovant", "Accessible", "Premium", "Dynamique"];
const BUDGETS = ["< 300 €", "300 – 600 €", "600 – 1200 €", "> 1200 €", "À définir"];

interface BriefData {
  businessName: string; industry: string; audience: string;
  personality: string[]; style: string[]; colors: string;
  competitors: string; inspiration: string; products: string;
  budget: string; deadline: string;
}

const empty: BriefData = {
  businessName: "", industry: "", audience: "", personality: [], style: [],
  colors: "", competitors: "", inspiration: "", products: "", budget: "À définir", deadline: "",
};

const STEPS = ["Entreprise", "Marque", "Style", "Contexte"];

export default function LogoBriefGenerator() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<BriefData>(empty);
  const [done, setDone] = useState(false);

  const set = (k: keyof BriefData, v: any) => setD((p) => ({ ...p, [k]: v }));
  const toggle = (k: "personality" | "style", v: string) =>
    setD((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  const canNext =
    (step === 0 && d.businessName.trim() && d.industry.trim()) ||
    (step === 1) || (step === 2) || step === 3;

  const generatePdf = () => {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const m = 18; let y = 24;
    pdf.setFillColor(8, 5, 31); pdf.rect(0, 0, 210, 14, "F");
    pdf.setTextColor(255); pdf.setFontSize(11); pdf.text("ART VISION — Brief de création de logo", m, 9);
    pdf.setTextColor(20, 20, 30);

    const line = (label: string, value: string) => {
      if (y > 270) { pdf.addPage(); y = 24; }
      pdf.setFontSize(10); pdf.setTextColor(150, 40, 130); pdf.text(label.toUpperCase(), m, y);
      y += 5; pdf.setFontSize(11); pdf.setTextColor(40, 40, 50);
      const lines = pdf.splitTextToSize(value || "—", 174);
      pdf.text(lines, m, y); y += lines.length * 5.5 + 5;
    };

    pdf.setFontSize(20); pdf.setTextColor(20, 20, 35);
    pdf.text(d.businessName || "Brief de logo", m, y); y += 12;

    line("Secteur d'activité", d.industry);
    line("Cible / audience", d.audience);
    line("Personnalité de marque", d.personality.join(", "));
    line("Styles préférés", d.style.join(", "));
    line("Couleurs souhaitées", d.colors);
    line("Produits / services", d.products);
    line("Concurrents", d.competitors);
    line("Liens d'inspiration", d.inspiration);
    line("Budget", d.budget);
    line("Délai souhaité", d.deadline);

    pdf.setFontSize(8); pdf.setTextColor(150);
    pdf.text("Brief généré gratuitement sur art-visions.fr — partagez-le avec votre designer.", m, 287);
    pdf.save(`brief-logo-${(d.businessName || "art-vision").toLowerCase().replace(/\s+/g, "-")}.pdf`);
    setDone(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center gap-2 ${i <= step ? "text-brand-magenta" : "text-white/35"}`}>
              <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold border ${i < step ? "bg-brand-magenta border-brand-magenta text-white" : i === step ? "border-brand-magenta" : "border-white/20"}`}>
                {i < step ? <Check size={13} /> : i + 1}
              </span>
              <span className="text-[11px] font-semibold hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-brand-magenta/50" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      <div className="glassmorphism rounded-2xl p-6 space-y-4 min-h-[320px]">
        {step === 0 && (
          <>
            <Field label="Nom de l'entreprise *"><input className={inputCls} value={d.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="Ex : Maison Lumière" /></Field>
            <Field label="Secteur d'activité *"><input className={inputCls} value={d.industry} onChange={(e) => set("industry", e.target.value)} placeholder="Ex : pâtisserie haut de gamme" /></Field>
            <Field label="Cible / audience"><input className={inputCls} value={d.audience} onChange={(e) => set("audience", e.target.value)} placeholder="Ex : familles, 30-55 ans, premium" /></Field>
            <Field label="Produits / services"><textarea rows={2} className={`${inputCls} resize-none`} value={d.products} onChange={(e) => set("products", e.target.value)} placeholder="Ce que vous proposez" /></Field>
          </>
        )}
        {step === 1 && (
          <>
            <Field label="Personnalité de marque (plusieurs choix)">
              <Chips options={PERSONALITIES} selected={d.personality} onToggle={(v) => toggle("personality", v)} />
            </Field>
            <Field label="Couleurs souhaitées"><input className={inputCls} value={d.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Ex : bordeaux, doré, crème" /></Field>
          </>
        )}
        {step === 2 && (
          <>
            <Field label="Styles préférés (plusieurs choix)">
              <Chips options={STYLES} selected={d.style} onToggle={(v) => toggle("style", v)} />
            </Field>
            <Field label="Liens d'inspiration"><textarea rows={2} className={`${inputCls} resize-none`} value={d.inspiration} onChange={(e) => set("inspiration", e.target.value)} placeholder="URLs de logos/marques que vous aimez" /></Field>
          </>
        )}
        {step === 3 && (
          <>
            <Field label="Concurrents"><input className={inputCls} value={d.competitors} onChange={(e) => set("competitors", e.target.value)} placeholder="Marques concurrentes" /></Field>
            <Field label="Budget">
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <button key={b} onClick={() => set("budget", b)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${d.budget === b ? "bg-brand-magenta border-brand-magenta text-white" : "border-brand-purple/25 text-white/65 hover:border-brand-magenta/40"}`}>{b}</button>
                ))}
              </div>
            </Field>
            <Field label="Délai souhaité"><input className={inputCls} value={d.deadline} onChange={(e) => set("deadline", e.target.value)} placeholder="Ex : sous 3 semaines" /></Field>
          </>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between mt-5">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white disabled:opacity-30 transition">
          <ChevronLeft size={15} /> Précédent
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext} className="inline-flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple/90 disabled:opacity-40 text-white px-5 py-2.5 rounded-full text-xs font-bold transition cursor-pointer">
            Suivant <ChevronRight size={15} />
          </button>
        ) : (
          <button onClick={generatePdf} className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange/90 text-white px-5 py-2.5 rounded-full text-xs font-bold transition cursor-pointer">
            <Download size={15} /> Télécharger le brief PDF
          </button>
        )}
      </div>

      {done && (
        <div className="mt-6">
          <LeadCapture
            payload={{ toolType: "generateur-brief-logo", inputData: d, outputData: { generated: true } }}
            title="Recevez une proposition pour votre logo"
            description="Envoyez votre brief à Art Vision et recevez une proposition adaptée à votre projet."
            ctaLabel="Envoyer mon brief à Art Vision"
          />
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-white/70 font-medium">{label}</label>
      {children}
    </div>
  );
}

function Chips({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => onToggle(o)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${selected.includes(o) ? "bg-brand-magenta border-brand-magenta text-white" : "border-brand-purple/25 text-white/65 hover:border-brand-magenta/40"}`}>{o}</button>
      ))}
    </div>
  );
}
