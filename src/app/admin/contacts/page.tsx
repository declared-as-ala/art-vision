"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Download, Inbox, Mail, Phone, Search, Trash2, User, X } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
  isNewsletter: boolean;
}

type Tab = "messages" | "newsletter";

const fmt = (d: string) =>
  new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function AdminContactsPage() {
  const [all, setAll] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("messages");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/contacts");
        const data = await res.json();
        if (data.success) setAll(data.messages);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const messages = useMemo(() => all.filter((m) => !m.isNewsletter), [all]);
  const subscribers = useMemo(() => all.filter((m) => m.isNewsletter), [all]);

  const rows = useMemo(() => {
    const base = tab === "messages" ? messages : subscribers;
    const t = search.trim().toLowerCase();
    if (!t) return base;
    return base.filter(
      (m) => m.name.toLowerCase().includes(t) || m.email.toLowerCase().includes(t) || m.message.toLowerCase().includes(t) || (m.phone || "").includes(t)
    );
  }, [tab, messages, subscribers, search]);

  const remove = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("Supprimer définitivement ce message ?")) return;
    const res = await fetch(`/api/admin/contacts?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) {
      setAll((prev) => prev.filter((m) => m.id !== id));
      setSelected((s) => (s?.id === id ? null : s));
    }
  };

  const exportCsv = () => {
    if (rows.length === 0) return;
    const q = (v: string) => '"' + (v || "").split('"').join('""').split(/\r?\n/).join(" ") + '"';
    const lines = [["Date", "Nom", "Email", "Telephone", "Message"].join(",")];
    for (const m of rows) lines.push([new Date(m.createdAt).toISOString(), q(m.name), q(m.email), q(m.phone || ""), q(m.message)].join(","));
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tab === "messages" ? "Contacts" : "Newsletter"}_ArtVision_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "messages", label: `Messages (${messages.length})` },
    { key: "newsletter", label: `Inscrits newsletter (${subscribers.length})` },
  ];

  return (
    <div className="space-y-8 text-left relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-montserrat font-extrabold text-white">Contacts</h1>
          <p className="text-xs text-white/50">Les personnes qui vous ont écrit via le formulaire de contact du site.</p>
        </div>
        <button
          onClick={exportCsv}
          className="bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer"
        >
          <Download size={14} />
          <span>Exporter en CSV</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex gap-2" role="tablist" aria-label="Type de contacts">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                tab === t.key ? "bg-brand-magenta text-white" : "bg-[#1A1238]/60 border border-brand-purple/20 text-white/70 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative md:w-80">
          <Search size={16} className="text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un nom, un e-mail, un mot…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1238]/60 border border-brand-purple/20 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
          />
        </div>
      </div>

      <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-white/45">Chargement des données...</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-white/45 flex flex-col items-center gap-2">
            <Inbox size={28} className="text-white/30" />
            Aucun contact pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-purple/20 text-white/50 uppercase font-semibold text-[10px]">
                  <th className="p-4">Contact</th>
                  <th className="p-4">{tab === "messages" ? "Message" : "Source"}</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-purple/10">
                {rows.map((m) => (
                  <tr key={m.id} onClick={() => setSelected(m)} className="hover:bg-brand-purple/10 transition cursor-pointer">
                    <td className="p-4">
                      <strong className="text-white block">{m.name}</strong>
                      <span className="text-[10px] text-white/50 block">{m.email}</span>
                      {m.phone && <span className="text-[10px] text-white/40 block">{m.phone}</span>}
                    </td>
                    <td className="p-4 text-white/75 max-w-md">
                      <span className="line-clamp-2">{m.message}</span>
                    </td>
                    <td className="p-4 text-white/60 whitespace-nowrap">{fmt(m.createdAt)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => remove(m.id, e)}
                        aria-label="Supprimer"
                        className="text-white/40 hover:text-red-400 transition p-1.5 rounded-md hover:bg-white/5"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-lg h-full bg-[#08051F] border-l border-brand-purple/20 p-6 md:p-8 overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} aria-label="Fermer" className="absolute top-4 right-4 text-white/60 hover:text-white transition">
              <X size={20} />
            </button>
            <div className="space-y-6 pt-4">
              <div className="border-b border-brand-purple/20 pb-4 space-y-1">
                <h2 className="text-xl font-montserrat font-extrabold text-white">
                  {selected.isNewsletter ? "Inscription newsletter" : "Message de contact"}
                </h2>
                <p className="text-[10px] text-white/50">{fmt(selected.createdAt)}</p>
              </div>
              <div className="space-y-2.5 bg-brand-navy p-4 rounded-xl border border-brand-purple/10 text-xs">
                <p className="flex items-center space-x-2">
                  <User size={12} className="text-brand-magenta" />
                  <span>
                    <strong>Nom :</strong> {selected.name}
                  </span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail size={12} className="text-brand-magenta" />
                  <a href={`mailto:${selected.email}`} className="text-brand-orange hover:underline">
                    {selected.email}
                  </a>
                </p>
                {selected.phone && (
                  <p className="flex items-center space-x-2">
                    <Phone size={12} className="text-brand-magenta" />
                    <a href={`tel:${selected.phone}`} className="text-brand-orange hover:underline">
                      {selected.phone}
                    </a>
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/40 block">Message</span>
                <p className="text-xs text-white/80 bg-brand-navy border border-brand-purple/10 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent("Votre message à Art Vision")}`}
                  className="bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition"
                >
                  Répondre par e-mail
                </a>
                <button
                  onClick={() => remove(selected.id)}
                  className="border border-red-500/40 text-red-300 hover:bg-red-500/10 text-xs font-semibold px-4 py-2.5 rounded-lg transition cursor-pointer"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
