"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  Download,
  Trash2,
  Check,
  X,
  FileText,
  Clock,
  User,
  Phone,
  Mail,
  Building
} from "lucide-react";

interface Quote {
  id: string;
  service: string;
  details: string;
  budget: string;
  deadline: string;
  fileUrl: string | null;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Modal edit states
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/quotes");
      const data = await res.json();
      if (data.success) {
        setQuotes(data.quotes);
        setFilteredQuotes(data.quotes);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Filter handlers
  useEffect(() => {
    let result = quotes;

    if (selectedService !== "all") {
      result = result.filter((q) => q.service.toLowerCase() === selectedService.toLowerCase());
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (q) =>
          q.name.toLowerCase().includes(term) ||
          q.email.toLowerCase().includes(term) ||
          (q.company && q.company.toLowerCase().includes(term))
      );
    }

    setFilteredQuotes(result);
  }, [selectedService, searchTerm, quotes]);

  const handleOpenDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setEditStatus(quote.status);
    setEditNotes(quote.notes || "");
  };

  const handleSaveDetails = async () => {
    if (!selectedQuote) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/quotes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedQuote.id,
          status: editStatus,
          notes: editNotes
        })
      });
      const data = await response.json();
      if (data.success) {
        // Update local state
        setQuotes(
          quotes.map((q) =>
            q.id === selectedQuote.id ? { ...q, status: editStatus, notes: editNotes } : q
          )
        );
        setSelectedQuote(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal opening
    if (!confirm("Voulez-vous vraiment supprimer cette demande de devis ?")) return;

    try {
      const response = await fetch(`/api/admin/quotes?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        setQuotes(quotes.filter((q) => q.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredQuotes.length === 0) return;
    const headers = ["ID", "Service", "Nom", "Email", "Telephone", "Entreprise", "Budget", "Delai", "Status", "Date"];
    const csvRows = [headers.join(",")];

    for (const q of filteredQuotes) {
      const values = [
        q.id,
        `"${q.service}"`,
        `"${q.name}"`,
        q.email,
        q.phone,
        `"${q.company || ""}"`,
        `"${q.budget}"`,
        `"${q.deadline}"`,
        q.status,
        new Date(q.createdAt).toISOString()
      ];
      csvRows.push(values.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Devis_ArtVision_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get distinct service list from quotes
  const servicesList = Array.from(new Set(quotes.map((q) => q.service)));

  return (
    <div className="space-y-8 text-left relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white">
            Demandes de Devis (Leads)
          </h1>
          <p className="text-xs text-white/50">Gérez les demandes de devis sur-mesure de vos prospects.</p>
        </div>
        
        <button
          onClick={handleExportCSV}
          className="bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer"
        >
          <Download size={14} />
          <span>Exporter en CSV</span>
        </button>
      </div>

      {/* Filters grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1238]/60 border border-brand-purple/20 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-[#1A1238]/60 border border-brand-purple/20 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta cursor-pointer"
          >
            <option value="all">Tous les services</option>
            {servicesList.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-white/45">Chargement des données...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-16 text-white/45">Aucun devis ne correspond aux critères.</div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-purple/20 text-white/50 uppercase font-semibold text-[10px]">
                  <th className="p-4">Nom / Entreprise</th>
                  <th className="p-4">Service Demandé</th>
                  <th className="p-4">Budget Indicatif</th>
                  <th className="p-4">Date de dépôt</th>
                  <th className="p-4 text-center">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-purple/10">
                {filteredQuotes.map((q) => {
                  const formattedDate = new Date(q.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  });

                  return (
                    <tr
                      key={q.id}
                      onClick={() => handleOpenDetails(q)}
                      className="hover:bg-brand-purple/10 transition cursor-pointer"
                    >
                      <td className="p-4">
                        <strong className="text-white block">{q.name}</strong>
                        <span className="text-[10px] text-white/40 block">{q.company || "Individuel"}</span>
                      </td>
                      <td className="p-4 text-white/80 font-medium">{q.service}</td>
                      <td className="p-4 text-brand-orange font-bold">{q.budget}</td>
                      <td className="p-4 text-white/60">{formattedDate}</td>
                      <td className="p-4 text-center">
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          q.status === "NEW" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : ""
                        } ${
                          q.status === "CONTACTED" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : ""
                        } ${
                          q.status === "IN_PROGRESS" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : ""
                        } ${
                          q.status === "WON" ? "bg-green-500/20 text-green-400 border border-green-500/30" : ""
                        } ${
                          q.status === "LOST" ? "bg-red-500/20 text-red-400 border border-red-500/30" : ""
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => handleDelete(q.id, e)}
                          className="text-white/40 hover:text-red-400 transition p-1.5 rounded-md hover:bg-white/5"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal Drawer */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg h-full bg-[#08051F] border-l border-brand-purple/20 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <div className="space-y-6 pt-4 text-left">
              {/* Header */}
              <div className="border-b border-brand-purple/20 pb-4 space-y-2">
                <span className="text-[10px] bg-brand-orange/20 text-brand-orange border border-brand-orange/30 px-2.5 py-1 rounded-full font-bold uppercase">
                  {selectedQuote.service}
                </span>
                <h2 className="text-xl font-sora font-extrabold text-white">Détails de la demande</h2>
                <p className="text-[10px] text-white/50">ID : {selectedQuote.id}</p>
              </div>

              {/* Prospect coordinates */}
              <div className="space-y-2.5 bg-brand-navy p-4 rounded-xl border border-brand-purple/10">
                <h3 className="text-xs uppercase font-bold text-white/60 tracking-wider">Prospect</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <p className="flex items-center space-x-2">
                    <User size={12} className="text-brand-magenta" />
                    <span><strong>Nom :</strong> {selectedQuote.name}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Building size={12} className="text-brand-magenta" />
                    <span><strong>Entreprise :</strong> {selectedQuote.company || "Individuel"}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Mail size={12} className="text-brand-magenta" />
                    <span><strong>Email :</strong> <a href={`mailto:${selectedQuote.email}`} className="hover:text-brand-orange underline">{selectedQuote.email}</a></span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Phone size={12} className="text-brand-magenta" />
                    <span><strong>Tél :</strong> <a href={`tel:${selectedQuote.phone}`} className="hover:text-brand-orange underline">{selectedQuote.phone}</a></span>
                  </p>
                </div>
              </div>

              {/* Project settings details */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-brand-navy p-3 rounded-lg border border-brand-purple/10">
                    <span className="text-[9px] uppercase font-bold text-white/40 block">Budget</span>
                    <strong className="text-brand-orange text-sm">{selectedQuote.budget}</strong>
                  </div>
                  <div className="bg-brand-navy p-3 rounded-lg border border-brand-purple/10">
                    <span className="text-[9px] uppercase font-bold text-white/40 block">Délai souhaité</span>
                    <strong className="text-white text-sm">{selectedQuote.deadline}</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-white/40 block">Description du besoin</span>
                  <p className="text-xs text-white/80 bg-brand-navy border border-brand-purple/10 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
                    {selectedQuote.details}
                  </p>
                </div>

                {selectedQuote.fileUrl && (
                  <div className="flex items-center space-x-2 bg-brand-purple/10 border border-brand-purple/20 p-3 rounded-lg text-xs">
                    <FileText size={16} className="text-brand-orange" />
                    <span>Fichier attaché : <strong>{selectedQuote.fileUrl}</strong></span>
                  </div>
                )}
              </div>

              {/* EDIT STATUS AND NOTES FORM */}
              <div className="border-t border-brand-purple/20 pt-6 space-y-4">
                <h3 className="font-sora font-bold text-sm text-white">Actions Administrateur</h3>
                
                {/* Status selector */}
                <div className="space-y-1">
                  <label className="text-xs text-white/60">Statut du dossier</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta cursor-pointer"
                  >
                    <option value="NEW">Nouveau (NEW)</option>
                    <option value="CONTACTED">Contacté (CONTACTED)</option>
                    <option value="IN_PROGRESS">En Cours (IN_PROGRESS)</option>
                    <option value="WON">Gagné (WON)</option>
                    <option value="LOST">Perdu (LOST)</option>
                  </select>
                </div>

                {/* Internal admin notes */}
                <div className="space-y-1">
                  <label className="text-xs text-white/60">Notes internes (Non visible par le client)</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={4}
                    placeholder="Ajouter des annotations..."
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-magenta resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex space-x-3 pt-6 border-t border-brand-purple/20">
              <button
                onClick={handleSaveDetails}
                disabled={saving}
                className="flex-1 bg-brand-magenta hover:bg-brand-magenta/95 text-white py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
              </button>
              <button
                onClick={() => setSelectedQuote(null)}
                className="bg-white/10 hover:bg-white/20 text-white py-2.5 px-4 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
