"use client";

import { useEffect, useMemo, useState } from "react";
import { Info, Clock, Calculator, Loader2, CheckCircle2, Send } from "lucide-react";
import { formatEuros } from "@/lib/money";

interface POption { type: string; name: string }
interface PriceRow { paper: string; format: string; finish: string; side: string; quantity: number; priceHtCents: number; priceTtcCents: number; promoTtcCents: number | null; productionDays: number }
interface Product { slug: string; name: string; description?: string; mode: string; options: POption[]; prices: PriceRow[] }

const inputCls = "w-full rounded-lg px-3 py-2.5 text-xs text-white outline-none";

export default function PrintCalculator() {
  const [products, setProducts] = useState<{ slug: string; name: string }[]>([]);
  const [slug, setSlug] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [paper, setPaper] = useState("");
  const [format, setFormat] = useState("");
  const [finish, setFinish] = useState("");
  const [side, setSide] = useState("recto");
  const [quantity, setQuantity] = useState<number | null>(null);

  // Lead form
  const [lead, setLead] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/print/catalog").then((r) => r.json()).then((d) => {
      if (d.success) { setProducts(d.products); if (d.products[0]) setSlug(d.products[0].slug); }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/print/catalog?slug=${slug}`).then((r) => r.json()).then((d) => {
      if (d.success) {
        setProduct(d.product);
        const opt = (t: string) => d.product.options.filter((o: POption) => o.type === t).map((o: POption) => o.name);
        setPaper(opt("paper")[0] || "");
        setFormat(opt("format")[0] || "");
        setFinish("");
        setSide("recto");
      }
    });
  }, [slug]);

  const opt = (t: string) => product?.options.filter((o) => o.type === t).map((o) => o.name) || [];

  // Quantities available for the current paper/format combo.
  const quantities = useMemo(() => {
    if (!product) return [];
    const qs = product.prices.filter((p) => p.paper === paper && p.format === format).map((p) => p.quantity);
    return Array.from(new Set(qs)).sort((a, b) => a - b);
  }, [product, paper, format]);

  useEffect(() => { if (quantities.length && !quantities.includes(quantity || 0)) setQuantity(quantities[0]); }, [quantities]); // eslint-disable-line

  const match = useMemo(() => {
    if (!product || !quantity) return null;
    return product.prices.find((p) => p.paper === paper && p.format === format && (p.finish === finish || (!p.finish && !finish)) && p.side === side && p.quantity === quantity)
      || product.prices.find((p) => p.paper === paper && p.format === format && p.quantity === quantity && p.side === side)
      || null;
  }, [product, paper, format, finish, side, quantity]);

  const isQuoteMode = product?.mode === "quote";
  const ttc = match ? (match.promoTtcCents ?? match.priceTtcCents) : null;

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) { setErr("E-mail invalide."); return; }
    setSending(true); setErr("");
    const r = await fetch("/api/print/quote", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug: slug, productName: product?.name, options: { paper, format, finish, side, quantity }, estimatedTtcCents: ttc ?? undefined, ...lead }),
    }).then((x) => x.json()).catch(() => ({ success: false }));
    setSending(false);
    if (r.success) setSent(true); else setErr("Une erreur est survenue.");
  };

  if (loading) return <div className="py-20 text-center text-white/50"><Loader2 className="animate-spin mx-auto" /></div>;
  if (!products.length) return <div className="glassmorphism rounded-2xl p-10 text-center text-white/60 text-sm">Le catalogue d'impression sera bientôt disponible. <a href="/devis-sur-mesure" className="text-brand-orange underline">Demander un devis</a>.</div>;

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Form */}
      <div className="glassmorphism rounded-2xl p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-white/55">Produit</label>
          <div className="grid grid-cols-2 gap-2">
            {products.map((p) => (
              <button key={p.slug} onClick={() => setSlug(p.slug)} className={`py-2.5 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${slug === p.slug ? "bg-brand-magenta border-brand-magenta text-white" : "border-brand-purple/25 text-white/65 hover:border-brand-magenta/40"}`}>{p.name}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Papier / support"><select className={inputCls} value={paper} onChange={(e) => setPaper(e.target.value)}>{opt("paper").map((o) => <option key={o} value={o}>{o}</option>)}</select></Field>
          <Field label="Format"><select className={inputCls} value={format} onChange={(e) => setFormat(e.target.value)}>{opt("format").map((o) => <option key={o} value={o}>{o}</option>)}</select></Field>
          {opt("finish").length > 0 && <Field label="Finition"><select className={inputCls} value={finish} onChange={(e) => setFinish(e.target.value)}><option value="">Sans finition</option>{opt("finish").filter((f) => f.toLowerCase() !== "sans finition").map((o) => <option key={o} value={o}>{o}</option>)}</select></Field>}
          <Field label="Impression"><select className={inputCls} value={side} onChange={(e) => setSide(e.target.value)}><option value="recto">Recto</option><option value="recto-verso">Recto-verso</option></select></Field>
          <Field label="Quantité">
            {quantities.length ? (
              <select className={inputCls} value={quantity || ""} onChange={(e) => setQuantity(Number(e.target.value))}>{quantities.map((qn) => <option key={qn} value={qn}>{qn}</option>)}</select>
            ) : <input className={inputCls} disabled value="—" />}
          </Field>
        </div>
      </div>

      {/* Estimate + quote */}
      <div className="space-y-4">
        <div className="glassmorphism rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1 text-white/55 text-xs"><Calculator size={14} className="text-brand-magenta" /> Estimation</div>
          {isQuoteMode || !match ? (
            <div className="space-y-2">
              <p className="text-2xl font-sora font-black text-brand-orange">Sur devis</p>
              <p className="text-[11px] text-white/55">Cette configuration nécessite un devis personnalisé. Remplissez le formulaire ci-dessous.</p>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-2 flex-wrap">
                <span className="text-4xl font-sora font-black text-brand-orange">{formatEuros(ttc)}</span>
                <span className="text-xs text-white/50 mb-1.5">TTC</span>
                {match.promoTtcCents != null && <span className="text-xs text-white/40 line-through mb-1.5">{formatEuros(match.priceTtcCents)}</span>}
              </div>
              <p className="text-[11px] text-white/50 mt-1">Soit {formatEuros(match.priceHtCents)} HT · TVA 20% incluse · {quantity} ex.</p>
              <div className="flex items-center gap-2 text-[11px] text-white/65 mt-4 bg-white/5 border border-white/10 rounded-lg px-3 py-2"><Clock size={13} className="text-brand-magenta" /> Production estimée : <strong className="text-white">{match.productionDays} jours ouvrés</strong></div>
            </>
          )}
          <div className="flex items-start gap-2 text-[11px] text-amber-300 mt-3 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2.5">
            <Info size={14} className="shrink-0 mt-0.5" /><span><strong>Estimation indicative</strong> — devis final après validation de votre fichier.</span>
          </div>
        </div>

        {/* Quote / order form */}
        {sent ? (
          <div className="rounded-2xl border border-green-500/25 bg-green-500/10 p-5 flex items-center gap-3">
            <CheckCircle2 className="text-green-400 shrink-0" size={22} />
            <div><p className="text-sm font-semibold text-green-300">Demande envoyée, merci !</p><p className="text-xs text-white/60">Notre équipe revient vers vous avec un devis ferme.</p></div>
          </div>
        ) : (
          <form onSubmit={submitQuote} className="glassmorphism rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-sora font-bold text-white">Recevoir mon devis impression</h3>
            <div className="grid sm:grid-cols-3 gap-2">
              <input className={inputCls} placeholder="Nom" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
              <input className={inputCls} placeholder="E-mail *" type="email" required value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
              <input className={inputCls} placeholder="Téléphone" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
            </div>
            <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Précisions (quantité exacte, délai, livraison…)" value={lead.message} onChange={(e) => setLead({ ...lead, message: e.target.value })} />
            {err && <p className="text-[11px] text-red-400">{err}</p>}
            <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-60 text-white py-2.5 rounded-lg text-xs font-bold transition cursor-pointer">
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Recevoir mon devis
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1"><label className="text-xs text-white/70">{label}</label>{children}</div>;
}
