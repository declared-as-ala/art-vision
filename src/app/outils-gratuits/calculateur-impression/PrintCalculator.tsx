"use client";

import { useMemo, useState } from "react";
import { Info, Clock, Truck, Calculator } from "lucide-react";
import { PRINT_PRODUCTS, estimatePrice } from "@/lib/print-pricing";
import LeadCapture from "@/components/tools/LeadCapture";

const inputCls = "w-full rounded-lg px-3 py-2.5 text-xs text-white outline-none";

export default function PrintCalculator() {
  const [productId, setProductId] = useState(PRINT_PRODUCTS[0].id);
  const product = PRINT_PRODUCTS.find((p) => p.id === productId)!;
  const [format, setFormat] = useState(product.formats[0]);
  const [quantity, setQuantity] = useState(product.quantities[1]);
  const [paperId, setPaperId] = useState(product.papers[0].id);
  const [finishId, setFinishId] = useState(product.finishes[0].id);
  const [doubleSided, setDoubleSided] = useState(false);
  const [delivery, setDelivery] = useState(false);

  const onProduct = (id: string) => {
    const p = PRINT_PRODUCTS.find((x) => x.id === id)!;
    setProductId(id);
    setFormat(p.formats[0]); setQuantity(p.quantities[1] || p.quantities[0]);
    setPaperId(p.papers[0].id); setFinishId(p.finishes[0].id); setDoubleSided(false);
  };

  const result = useMemo(
    () => estimatePrice({ productId, format, quantity, paperId, finishId, doubleSided, delivery }),
    [productId, format, quantity, paperId, finishId, doubleSided, delivery]
  );

  const summary = {
    Produit: product.name, Format: format, Quantité: quantity,
    Papier: product.papers.find((p) => p.id === paperId)?.label,
    Finition: product.finishes.find((f) => f.id === finishId)?.label,
    Impression: product.sides ? (doubleSided ? "Recto-verso" : "Recto") : "—",
    Livraison: delivery ? "Oui" : "Retrait",
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Form */}
      <div className="glassmorphism rounded-2xl p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-white/55">Produit</label>
          <div className="grid grid-cols-2 gap-2">
            {PRINT_PRODUCTS.map((p) => (
              <button key={p.id} onClick={() => onProduct(p.id)} className={`py-2.5 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${productId === p.id ? "bg-brand-magenta border-brand-magenta text-white" : "border-brand-purple/25 text-white/65 hover:border-brand-magenta/40"}`}>{p.name}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-white/70">Format</label>
            <select className={inputCls} value={format} onChange={(e) => setFormat(e.target.value)}>
              {product.formats.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-white/70">Quantité</label>
            <select className={inputCls} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
              {product.quantities.map((q) => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-white/70">Papier / support</label>
            <select className={inputCls} value={paperId} onChange={(e) => setPaperId(e.target.value)}>
              {product.papers.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-white/70">Finition</label>
            <select className={inputCls} value={finishId} onChange={(e) => setFinishId(e.target.value)}>
              {product.finishes.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-1">
          {product.sides && (
            <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
              <input type="checkbox" checked={doubleSided} onChange={(e) => setDoubleSided(e.target.checked)} className="w-4 h-4 accent-brand-magenta" /> Recto-verso
            </label>
          )}
          <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
            <input type="checkbox" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} className="w-4 h-4 accent-brand-magenta" /> Livraison
          </label>
        </div>
      </div>

      {/* Estimate */}
      <div className="space-y-4">
        <div className="glassmorphism rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1 text-white/55 text-xs">
            <Calculator size={14} className="text-brand-magenta" /> Estimation
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-sora font-black text-brand-orange">{result?.low}</span>
            <span className="text-2xl font-sora font-black text-white/50 mb-0.5">– {result?.high} {result?.currency}</span>
          </div>
          <p className="text-[11px] text-white/50 mt-1">Prix HT indicatif pour {quantity} {product.name.toLowerCase()}.</p>

          <div className="flex items-center gap-2 text-[11px] text-white/65 mt-4 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <Clock size={13} className="text-brand-magenta" /> Délai estimé : <strong className="text-white">{result?.leadTimeDays} jours ouvrés</strong>
          </div>

          {/* Important indicative notice */}
          <div className="flex items-start gap-2 text-[11px] text-amber-300 mt-3 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2.5">
            <Info size={14} className="shrink-0 mt-0.5" />
            <span><strong>Estimation indicative</strong> — le devis final est établi après validation de votre fichier et de vos options exactes.</span>
          </div>

          {/* Summary */}
          <div className="mt-4 space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-white/40">Récapitulatif</span>
            {Object.entries(summary).map(([k, v]) => (
              <div key={k} className="flex justify-between text-[11px] border-b border-white/5 py-1.5">
                <span className="text-white/50">{k}</span>
                <span className="text-white/85 font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <LeadCapture
          payload={{ toolType: "calculateur-impression", inputData: summary, outputData: result }}
          title="Recevoir mon devis impression"
          description="Recevez un devis ferme et personnalisé sous 24h ouvrées."
          ctaLabel="Recevoir mon devis"
        />
      </div>
    </div>
  );
}
