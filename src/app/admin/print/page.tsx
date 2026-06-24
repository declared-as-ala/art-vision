"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Printer, Plus, Trash2, Edit3, X, Save, Search, Download, Upload, Table2,
  Package, ClipboardList, Percent, Loader2,
} from "lucide-react";
import { centsToInput, formatEuros } from "@/lib/money";

type Tab = "products" | "prices" | "orders";

interface POption { id?: string; type: string; name: string; value?: string; sortOrder?: number }
interface Product {
  id: string; slug: string; name: string; description?: string; image?: string; active: boolean;
  mode: string; productionTime?: string; deliveryTime?: string; fileGuidelines?: string;
  minQuantity: number; sides: string; vatNote?: string; seoTitle?: string; metaDescription?: string;
  sortOrder: number; options: POption[]; _count?: { prices: number };
}
interface PriceRow {
  id: string; paper: string; format: string; finish: string; side: string; quantity: number;
  priceHtCents: number; priceTtcCents: number; promoTtcCents: number | null; productionDays: number; active: boolean;
}
interface Order {
  id: string; productName?: string; name?: string; email?: string; phone?: string;
  options: string; estimatedTtcCents?: number; status: string; notes?: string; createdAt: string;
}

const STATUS_LABEL: Record<string, string> = { NEW: "Nouveau", CONTACTED: "Contacté", CONFIRMED: "Confirmé", IN_PRODUCTION: "En production", DELIVERED: "Livré", CANCELLED: "Annulé" };
const input = "w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta";

export default function AdminPrintPage() {
  const [tab, setTab] = useState<Tab>("products");
  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white flex items-center gap-2">
          <Printer className="text-brand-magenta" size={24} /> Impression & Tarifs
        </h1>
        <p className="text-xs text-white/50">Gérez vos produits d'impression, vos grilles tarifaires et les demandes de devis.</p>
      </div>
      <div className="flex gap-2 border-b border-brand-purple/15">
        {([["products", "Produits", Package], ["prices", "Tarifs", Table2], ["orders", "Devis", ClipboardList]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer ${tab === id ? "border-brand-magenta text-brand-magenta" : "border-transparent text-white/55 hover:text-white"}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
      {tab === "products" && <ProductsTab />}
      {tab === "prices" && <PricesTab />}
      {tab === "orders" && <OrdersTab />}
    </div>
  );
}

// ── PRODUCTS ─────────────────────────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/print/products").then((x) => x.json()).catch(() => ({}));
    if (r.success) setProducts(r.products);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const blank = (): Product => ({ id: "", slug: "", name: "", active: true, mode: "instant", minQuantity: 1, sides: "both", sortOrder: products.length, options: [] });

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce produit et tous ses prix ?")) return;
    await fetch(`/api/admin/print/products?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setEdit(blank()); setIsNew(true); }} className="bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer">
          <Plus size={14} /> Ajouter un produit
        </button>
      </div>
      <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
        {loading ? <div className="py-12 text-center text-white/40"><Loader2 className="animate-spin mx-auto" /></div> : products.length === 0 ? (
          <div className="py-12 text-center text-white/40 text-sm">Aucun produit. Cliquez sur « Ajouter un produit ».</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead><tr className="border-b border-brand-purple/15 text-white/40 uppercase text-[10px] tracking-wider">
              <th className="p-4">Produit</th><th className="p-4">Slug</th><th className="p-4 text-center">Options</th><th className="p-4 text-center">Prix</th><th className="p-4 text-center">Mode</th><th className="p-4 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.03]">
                  <td className="p-4"><strong className="text-white">{p.name}</strong>{!p.active && <span className="ml-2 text-[9px] text-red-400">(inactif)</span>}</td>
                  <td className="p-4 text-brand-orange font-mono text-[10px]">/impression/{p.slug}</td>
                  <td className="p-4 text-center text-white/60">{p.options.length}</td>
                  <td className="p-4 text-center"><span className="text-[10px] bg-brand-purple/25 px-2 py-0.5 rounded-full">{p._count?.prices || 0}</span></td>
                  <td className="p-4 text-center text-white/60">{p.mode === "quote" ? "Devis" : "Prix"}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => { setEdit(p); setIsNew(false); }} className="text-white/45 hover:text-brand-orange p-1.5 cursor-pointer"><Edit3 size={14} /></button>
                    <button onClick={() => remove(p.id)} className="text-white/45 hover:text-red-400 p-1.5 cursor-pointer"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {edit && <ProductModal product={edit} isNew={isNew} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} />}
    </div>
  );
}

function ProductModal({ product, isNew, onClose, onSaved }: { product: Product; isNew: boolean; onClose: () => void; onSaved: () => void }) {
  const [p, setP] = useState<Product>(product);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof Product, v: any) => setP((s) => ({ ...s, [k]: v }));

  const optsOf = (type: string) => p.options.filter((o) => o.type === type).map((o) => o.name).join("\n");
  const setOpts = (type: string, text: string) => {
    const others = p.options.filter((o) => o.type !== type);
    const items = text.split("\n").map((s) => s.trim()).filter(Boolean).map((name, i) => ({ type, name, sortOrder: i }));
    setP((s) => ({ ...s, options: [...others, ...items] }));
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd }).then((x) => x.json());
    if (r.success) set("image", r.url);
  };

  const save = async () => {
    if (!p.name) { setErr("Le nom est requis."); return; }
    setSaving(true); setErr("");
    const r = await fetch("/api/admin/print/products", {
      method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, minQuantity: Number(p.minQuantity) || 1, sortOrder: Number(p.sortOrder) || 0 }),
    }).then((x) => x.json()).catch(() => ({ success: false }));
    setSaving(false);
    if (r.success) onSaved(); else setErr(r.error || "Erreur.");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-xl h-full bg-[#08051F] border-l border-brand-purple/20 p-6 overflow-y-auto no-scrollbar space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-brand-purple/20 pb-3">
          <h2 className="text-lg font-sora font-extrabold text-white">{isNew ? "Nouveau produit" : "Modifier le produit"}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={18} /></button>
        </div>
        {err && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded">{err}</p>}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Nom"><input className={input} value={p.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Slug (URL)"><input className={input} value={p.slug} onChange={(e) => set("slug", e.target.value)} placeholder="flyers" /></Field>
        </div>
        <Field label="Description"><textarea rows={2} className={`${input} resize-none`} value={p.description || ""} onChange={(e) => set("description", e.target.value)} /></Field>

        <Field label="Image">
          <div className="flex items-center gap-3">
            {p.image && <img src={p.image} alt="" className="w-12 h-12 rounded object-cover border border-white/10" />}
            <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 bg-brand-purple/15 border border-brand-purple/30 text-white text-xs px-3 py-2 rounded-lg cursor-pointer"><Upload size={13} /> Importer</button>
            <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} className="hidden" />
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Mode"><select className={input} value={p.mode} onChange={(e) => set("mode", e.target.value)}><option value="instant">Prix instantané</option><option value="quote">Sur devis uniquement</option></select></Field>
          <Field label="Impression"><select className={input} value={p.sides} onChange={(e) => set("sides", e.target.value)}><option value="both">Recto & Recto-verso</option><option value="recto">Recto seul</option><option value="recto-verso">Recto-verso seul</option></select></Field>
          <Field label="Quantité min."><input type="number" className={input} value={p.minQuantity} onChange={(e) => set("minQuantity", e.target.value)} /></Field>
          <Field label="Ordre"><input type="number" className={input} value={p.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} /></Field>
          <Field label="Délai production"><input className={input} value={p.productionTime || ""} onChange={(e) => set("productionTime", e.target.value)} placeholder="3 à 5 jours" /></Field>
          <Field label="Délai livraison"><input className={input} value={p.deliveryTime || ""} onChange={(e) => set("deliveryTime", e.target.value)} /></Field>
        </div>
        <Field label="Consignes de fichier"><textarea rows={2} className={`${input} resize-none`} value={p.fileGuidelines || ""} onChange={(e) => set("fileGuidelines", e.target.value)} placeholder="Fond perdu 3mm, CMJN, 300 dpi…" /></Field>
        <Field label="Mention TVA"><input className={input} value={p.vatNote || ""} onChange={(e) => set("vatNote", e.target.value)} placeholder="Prix TTC, TVA 20% incluse" /></Field>

        <div className="border-t border-brand-purple/20 pt-3 space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Options (une par ligne)</p>
          {(["paper", "format", "finish"] as const).map((t) => (
            <Field key={t} label={t === "paper" ? "Types de papier" : t === "format" ? "Formats" : "Finitions"}>
              <textarea rows={3} className={`${input} resize-none font-mono`} value={optsOf(t)} onChange={(e) => setOpts(t, e.target.value)} placeholder={t === "paper" ? "135g brillant\n350g mat" : t === "format" ? "A6\nA5\nA4" : "Sans finition\nPelliculage mat"} />
            </Field>
          ))}
        </div>

        <div className="border-t border-brand-purple/20 pt-3 grid grid-cols-1 gap-3">
          <Field label="SEO — Titre"><input className={input} value={p.seoTitle || ""} onChange={(e) => set("seoTitle", e.target.value)} /></Field>
          <Field label="SEO — Meta description"><textarea rows={2} className={`${input} resize-none`} value={p.metaDescription || ""} onChange={(e) => set("metaDescription", e.target.value)} /></Field>
        </div>

        <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer"><input type="checkbox" checked={p.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-brand-magenta" /> Produit actif (visible publiquement)</label>

        <div className="flex gap-3 pt-4 border-t border-brand-purple/20">
          <button onClick={save} disabled={saving} className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"><Save size={14} /> {saving ? "Sauvegarde…" : "Enregistrer"}</button>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white py-2.5 px-4 rounded-lg text-xs font-semibold cursor-pointer">Annuler</button>
        </div>
      </div>
    </div>
  );
}

// ── PRICE MATRIX ─────────────────────────────────────────────────────────────
function PricesTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const csvRef = useRef<HTMLInputElement>(null);
  const product = products.find((p) => p.id === productId);

  useEffect(() => { fetch("/api/admin/print/products").then((x) => x.json()).then((r) => { if (r.success) { setProducts(r.products); if (r.products[0]) setProductId(r.products[0].id); } }); }, []);

  const loadRows = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    const r = await fetch(`/api/admin/print/prices?productId=${productId}`).then((x) => x.json()).catch(() => ({}));
    if (r.success) setRows(r.rows);
    setLoading(false);
  }, [productId]);
  useEffect(() => { loadRows(); }, [loadRows]);

  const opts = (t: string) => product?.options.filter((o) => o.type === t).map((o) => o.name) || [];

  const addRow = async () => {
    const paper = opts("paper")[0] || "";
    const format = opts("format")[0] || "";
    await fetch("/api/admin/print/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, paper, format, finish: "", side: "recto", quantity: 100, priceHt: "0" }) });
    loadRows();
  };
  const saveRow = async (row: PriceRow, patch: Partial<Record<string, any>>) => {
    await fetch("/api/admin/print/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, paper: row.paper, format: row.format, finish: row.finish, side: row.side, quantity: row.quantity, ...patch }) });
    loadRows();
  };
  const delRow = async (id: string) => { await fetch(`/api/admin/print/prices?id=${id}`, { method: "DELETE" }); loadRows(); };

  const bulkAdjust = async () => {
    const pct = prompt("Augmentation en % (ex: 5 ou -10) ?", "5");
    if (pct === null) return;
    await fetch("/api/admin/print/prices", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "adjust", productId, percent: Number(pct) || 0, target: "both" }) });
    loadRows();
  };

  const importCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const text = await f.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const head = lines[0].split(",").map((s) => s.replace(/^"|"$/g, "").trim().toLowerCase());
    const idx = (k: string) => head.indexOf(k);
    const parsed = lines.slice(1).map((ln) => {
      const c = ln.match(/("([^"]|"")*"|[^,]*)/g)?.filter((_, i) => i % 2 === 0).map((s) => s.replace(/^"|"$/g, "").replace(/""/g, '"')) || [];
      return { paper: c[idx("paper")] || "", format: c[idx("format")] || "", finish: c[idx("finish")] || "", side: c[idx("side")] || "recto", quantity: Number(c[idx("quantity")]) || 0, priceHT: c[idx("priceht")] || "0", priceTTC: c[idx("pricettc")] || "", promoTTC: c[idx("promottc")] || "", productionDays: c[idx("productiondays")] || "5", active: c[idx("active")] !== "0" };
    });
    await fetch("/api/admin/print/prices", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "import", productId, rows: parsed }) });
    e.target.value = ""; loadRows();
  };

  const filtered = rows.filter((r) => !q || `${r.paper} ${r.format} ${r.finish} ${r.quantity}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <select className={`${input} w-auto`} value={productId} onChange={(e) => setProductId(e.target.value)}>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="flex flex-wrap gap-2">
          <div className="relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer…" className={`${input} pl-8 w-44`} /></div>
          <button onClick={bulkAdjust} className="flex items-center gap-1.5 bg-brand-purple/20 border border-brand-purple/30 text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"><Percent size={13} /> Ajuster</button>
          <button onClick={() => csvRef.current?.click()} className="flex items-center gap-1.5 bg-brand-purple/20 border border-brand-purple/30 text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"><Upload size={13} /> Importer CSV</button>
          <input ref={csvRef} type="file" accept=".csv" onChange={importCsv} className="hidden" />
          <a href={`/api/admin/print/prices?productId=${productId}&format=csv`} className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple/90 text-white px-3 py-2 rounded-lg text-xs font-semibold"><Download size={13} /> Export CSV</a>
          <button onClick={addRow} className="flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange/90 text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer"><Plus size={13} /> Ligne</button>
        </div>
      </div>

      <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-x-auto no-scrollbar">
        {loading ? <div className="py-12 text-center text-white/40"><Loader2 className="animate-spin mx-auto" /></div> : filtered.length === 0 ? (
          <div className="py-12 text-center text-white/40 text-sm">Aucun tarif. Ajoutez une ligne ou importez un CSV.</div>
        ) : (
          <table className="w-full text-left text-xs min-w-[820px]">
            <thead><tr className="border-b border-brand-purple/15 text-white/40 uppercase text-[10px] tracking-wider">
              <th className="p-2">Papier</th><th className="p-2">Format</th><th className="p-2">Finition</th><th className="p-2">Face</th><th className="p-2">Qté</th><th className="p-2">Prix HT</th><th className="p-2">Prix TTC</th><th className="p-2">Promo TTC</th><th className="p-2">Délai</th><th className="p-2">Actif</th><th className="p-2"></th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02]">
                  <td className="p-1.5"><EditCell value={r.paper} options={opts("paper")} onSave={(v) => saveRow(r, { paper: v })} /></td>
                  <td className="p-1.5"><EditCell value={r.format} options={opts("format")} onSave={(v) => saveRow(r, { format: v })} /></td>
                  <td className="p-1.5"><EditCell value={r.finish} options={["", ...opts("finish")]} onSave={(v) => saveRow(r, { finish: v })} /></td>
                  <td className="p-1.5"><EditCell value={r.side} options={["recto", "recto-verso"]} onSave={(v) => saveRow(r, { side: v })} /></td>
                  <td className="p-1.5"><NumCell value={r.quantity} onSave={(v) => saveRow(r, { quantity: v })} /></td>
                  <td className="p-1.5"><MoneyCell cents={r.priceHtCents} onSave={(v) => saveRow(r, { priceHt: v })} /></td>
                  <td className="p-1.5"><MoneyCell cents={r.priceTtcCents} onSave={(v) => saveRow(r, { priceTtc: v })} /></td>
                  <td className="p-1.5"><MoneyCell cents={r.promoTtcCents} onSave={(v) => saveRow(r, { promoTtc: v })} placeholder="—" /></td>
                  <td className="p-1.5 w-16"><NumCell value={r.productionDays} onSave={(v) => saveRow(r, { productionDays: v })} /></td>
                  <td className="p-1.5 text-center"><input type="checkbox" checked={r.active} onChange={(e) => saveRow(r, { active: e.target.checked })} className="w-4 h-4 accent-brand-magenta" /></td>
                  <td className="p-1.5 text-right"><button onClick={() => delRow(r.id)} className="text-white/40 hover:text-red-400 cursor-pointer"><Trash2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="text-[10px] text-white/40">💡 Prix stockés en centimes (précision garantie). Une combinaison sans prix affiche « Demandez un devis personnalisé » côté public.</p>
    </div>
  );
}

function EditCell({ value, options, onSave }: { value: string; options: string[]; onSave: (v: string) => void }) {
  return <select value={value} onChange={(e) => onSave(e.target.value)} className="bg-brand-navy border border-brand-purple/20 rounded px-1.5 py-1 text-[11px] text-white w-full">{options.map((o) => <option key={o} value={o}>{o || "—"}</option>)}</select>;
}
function NumCell({ value, onSave }: { value: number; onSave: (v: number) => void }) {
  const [v, setV] = useState(String(value));
  useEffect(() => setV(String(value)), [value]);
  return <input value={v} onChange={(e) => setV(e.target.value)} onBlur={() => Number(v) !== value && onSave(Number(v) || 0)} className="bg-brand-navy border border-brand-purple/20 rounded px-1.5 py-1 text-[11px] text-white w-16" />;
}
function MoneyCell({ cents, onSave, placeholder }: { cents: number | null; onSave: (v: string) => void; placeholder?: string }) {
  const [v, setV] = useState(centsToInput(cents));
  useEffect(() => setV(centsToInput(cents)), [cents]);
  return <input value={v} onChange={(e) => setV(e.target.value)} onBlur={() => onSave(v)} placeholder={placeholder} className="bg-brand-navy border border-brand-purple/20 rounded px-1.5 py-1 text-[11px] text-white w-20" />;
}

// ── ORDERS ───────────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch(`/api/admin/print/orders?status=${status}`).then((x) => x.json()).catch(() => ({}));
    if (r.success) setOrders(r.orders);
    setLoading(false);
  }, [status]);
  useEffect(() => { load(); }, [load]);

  const upd = async (id: string, patch: any) => { await fetch("/api/admin/print/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) }); load(); };
  const del = async (id: string) => { if (!confirm("Supprimer cette demande ?")) return; await fetch(`/api/admin/print/orders?id=${id}`, { method: "DELETE" }); load(); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between flex-wrap gap-2">
        <select className={`${input} w-auto`} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Tous statuts</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <a href={`/api/admin/print/orders?format=csv${status !== "all" ? `&status=${status}` : ""}`} className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple/90 text-white px-3 py-2 rounded-lg text-xs font-semibold"><Download size={13} /> Export CSV</a>
      </div>
      <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-x-auto no-scrollbar">
        {loading ? <div className="py-12 text-center text-white/40"><Loader2 className="animate-spin mx-auto" /></div> : orders.length === 0 ? (
          <div className="py-12 text-center text-white/40 text-sm">Aucune demande de devis.</div>
        ) : (
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead><tr className="border-b border-brand-purple/15 text-white/40 uppercase text-[10px] tracking-wider"><th className="p-3">Contact</th><th className="p-3">Produit</th><th className="p-3">Estimation</th><th className="p-3">Date</th><th className="p-3">Statut</th><th className="p-3"></th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] align-top">
                  <td className="p-3"><strong className="text-white block">{o.name || "—"}</strong><span className="text-[10px] text-white/40 block">{o.email}</span><span className="text-[10px] text-white/30">{o.phone}</span></td>
                  <td className="p-3 text-white/70">{o.productName}<details className="mt-1"><summary className="text-[10px] text-brand-magenta cursor-pointer">options</summary><pre className="text-[9px] text-white/50 mt-1 max-w-[200px] whitespace-pre-wrap">{(() => { try { return JSON.stringify(JSON.parse(o.options), null, 1); } catch { return o.options; } })()}</pre></details></td>
                  <td className="p-3 text-brand-orange font-bold">{formatEuros(o.estimatedTtcCents)}</td>
                  <td className="p-3 text-white/50">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="p-3"><select value={o.status} onChange={(e) => upd(o.id, { status: e.target.value })} className="bg-brand-navy border border-brand-purple/25 rounded px-2 py-1 text-[10px] text-white">{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></td>
                  <td className="p-3 text-right"><button onClick={() => del(o.id)} className="text-white/40 hover:text-red-400 cursor-pointer"><Trash2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1"><label className="text-[11px] text-white/60">{label}</label>{children}</div>;
}
