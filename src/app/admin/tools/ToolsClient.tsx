"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Download, Trash2, Eye, X, Inbox, Loader2 } from "lucide-react";
import { tools } from "@/lib/tools";

interface Submission {
  id: string; toolType: string; name: string | null; email: string | null;
  phone: string | null; consentMarketing: boolean; status: string; notes: string | null;
  inputData: string; outputData: string; createdAt: string;
}

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];
const STATUS_LABEL: Record<string, string> = { NEW: "Nouveau", CONTACTED: "Contacté", QUALIFIED: "Qualifié", WON: "Gagné", LOST: "Perdu" };
const STATUS_COLOR: Record<string, string> = {
  NEW: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  CONTACTED: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  QUALIFIED: "bg-brand-purple/20 text-brand-purple border-brand-purple/30",
  WON: "bg-green-500/15 text-green-300 border-green-500/25",
  LOST: "bg-red-500/15 text-red-300 border-red-500/25",
};
const labelFor = (slug: string) => tools.find((t) => t.slug === slug)?.title || slug;

export default function ToolsClient({ initial }: { initial: Submission[] }) {
  const [items, setItems] = useState<Submission[]>(initial);
  const [toolType, setToolType] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<Submission | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (toolType !== "all") params.set("toolType", toolType);
      if (status !== "all") params.set("status", status);
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/admin/tools/submissions?${params}`);
      const data = await res.json();
      if (data.success) setItems(data.items);
    } finally { setLoading(false); }
  }, [toolType, status, q]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const updateStatus = async (id: string, newStatus: string) => {
    setItems((p) => p.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
    await fetch("/api/admin/tools/submissions", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
  };

  const saveNotes = async (id: string, notes: string) => {
    await fetch("/api/admin/tools/submissions", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, notes }),
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette soumission ?")) return;
    setItems((p) => p.filter((i) => i.id !== id));
    await fetch(`/api/admin/tools/submissions?id=${id}`, { method: "DELETE" });
  };

  return (
    <div className="glassmorphism rounded-2xl p-5 border border-brand-purple/15 space-y-4">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
        <h3 className="font-sora font-bold text-base text-white">Soumissions & leads</h3>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher email / nom"
              className="pl-8 pr-3 py-2 rounded-lg text-xs text-white outline-none w-52" />
          </div>
          <select value={toolType} onChange={(e) => setToolType(e.target.value)} className="rounded-lg px-3 py-2 text-xs text-white outline-none">
            <option value="all">Tous les outils</option>
            {tools.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg px-3 py-2 text-xs text-white outline-none">
            <option value="all">Tous statuts</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
          <a href={`/api/admin/tools/export${toolType !== "all" ? `?toolType=${toolType}` : ""}`}
            className="inline-flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple/90 text-white px-3 py-2 rounded-lg text-xs font-semibold transition">
            <Download size={13} /> CSV
          </a>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-brand-purple/15 text-white/35 uppercase font-bold text-[10px] tracking-widest">
              <th className="pb-3 pr-4">Contact</th>
              <th className="pb-3 pr-4">Outil</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Statut</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && items.length === 0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-white/40"><Loader2 className="animate-spin mx-auto" /></td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-white/30 text-xs">
                <Inbox size={30} className="mx-auto mb-3 opacity-30" /> Aucune soumission.
              </td></tr>
            ) : items.map((i) => (
              <tr key={i.id} className="hover:bg-white/[0.03] transition group">
                <td className="py-3 pr-4">
                  <strong className="text-white block">{i.name || "—"}</strong>
                  <span className="text-[10px] text-white/40 block">{i.email || "Sans email"}</span>
                  {i.phone && <span className="text-[10px] text-white/30 block">{i.phone}</span>}
                </td>
                <td className="py-3 pr-4 text-white/70">{labelFor(i.toolType)}</td>
                <td className="py-3 pr-4 text-white/50">{new Date(i.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="py-3 pr-4">
                  <select value={i.status} onChange={(e) => updateStatus(i.id, e.target.value)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border outline-none cursor-pointer ${STATUS_COLOR[i.status] || ""}`}>
                    {STATUSES.map((s) => <option key={s} value={s} className="bg-brand-navy text-white">{STATUS_LABEL[s]}</option>)}
                  </select>
                </td>
                <td className="py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button onClick={() => setView(i)} className="p-1.5 text-white/40 hover:text-brand-magenta transition" aria-label="Voir"><Eye size={14} /></button>
                    <button onClick={() => remove(i.id)} className="p-1.5 text-white/40 hover:text-red-400 transition" aria-label="Supprimer"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {view && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setView(null)}>
          <div className="bg-brand-navy border border-brand-purple/30 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto no-scrollbar p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-sora font-bold text-white">{labelFor(view.toolType)}</h4>
                <p className="text-[11px] text-white/40">{new Date(view.createdAt).toLocaleString("fr-FR")}</p>
              </div>
              <button onClick={() => setView(null)} className="text-white/50 hover:text-white"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <Info label="Nom" value={view.name} />
              <Info label="Email" value={view.email} />
              <Info label="Téléphone" value={view.phone} />
              <Info label="Consentement" value={view.consentMarketing ? "Oui" : "Non"} />
            </div>
            <Json label="Données saisies" raw={view.inputData} />
            <Json label="Résultat généré" raw={view.outputData} />
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Notes internes</label>
              <textarea defaultValue={view.notes || ""} onBlur={(e) => saveNotes(view.id, e.target.value)} rows={3}
                className="w-full rounded-lg px-3 py-2 text-xs text-white outline-none resize-none" placeholder="Ajouter une note (sauvegarde auto)..." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <span className="text-[9px] uppercase tracking-wider text-white/35 block">{label}</span>
      <span className="text-white/80 break-words">{value || "—"}</span>
    </div>
  );
}

function Json({ label, raw }: { label: string; raw: string }) {
  let pretty = raw;
  try { pretty = JSON.stringify(JSON.parse(raw), null, 2); } catch {}
  return (
    <div className="space-y-1.5">
      <span className="text-[10px] uppercase tracking-wider font-bold text-white/40">{label}</span>
      <pre className="text-[10px] text-white/60 bg-black/30 border border-white/10 rounded-lg p-3 overflow-x-auto max-h-40 no-scrollbar">{pretty}</pre>
    </div>
  );
}
