"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit3, X, Save, AlertCircle, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  message: string;
  image?: string;
  displayOrder: number;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (e) {
      console.error("Fetch testimonials error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setName(testimonial.name);
    setRole(testimonial.role);
    setRating(testimonial.rating);
    setMessage(testimonial.message);
    setImage(testimonial.image || "");
    setDisplayOrder(testimonial.displayOrder);
    setIsNew(false);
    setErrorMsg("");
  };

  const handleOpenNew = () => {
    setSelectedTestimonial({} as Testimonial);
    setName("");
    setRole("");
    setRating(5);
    setMessage("");
    setImage("");
    setDisplayOrder(0);
    setIsNew(true);
    setErrorMsg("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !message) {
      setErrorMsg("Veuillez renseigner le nom, le rôle et le message.");
      return;
    }
    setSaving(true);
    setErrorMsg("");

    const method = isNew ? "POST" : "PUT";
    const bodyData = isNew 
      ? { name, role, rating: Number(rating), message, image, displayOrder: Number(displayOrder) }
      : { id: selectedTestimonial?.id, name, role, rating: Number(rating), message, image, displayOrder: Number(displayOrder) };

    try {
      const response = await fetch("/api/admin/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      if (data.success) {
        fetchTestimonials();
        setSelectedTestimonial(null);
      } else {
        setErrorMsg(data.error || "Erreur d'enregistrement.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Voulez-vous supprimer cet avis client ? Cette action est irréversible.")) return;

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        fetchTestimonials();
      } else {
        alert(data.error || "Erreur de suppression");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = testimonials.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 text-left relative">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white">
            Gestion des Témoignages
          </h1>
          <p className="text-xs text-white/50">Gérez les avis clients affichés sur la page d'accueil.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer shrink-0"
        >
          <Plus size={14} />
          <span>Ajouter un avis</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1A1238]/60 border border-brand-purple/20 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
        />
      </div>

      <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-white/45">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/45">Aucun témoignage trouvé.</div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-purple/20 text-white/50 uppercase font-semibold text-[10px]">
                  <th className="p-4">Client</th>
                  <th className="p-4">Poste / Rôle</th>
                  <th className="p-4 text-center">Note</th>
                  <th className="p-4">Message</th>
                  <th className="p-4 text-center">Ordre d'affichage</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-purple/10">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-brand-purple/10 transition">
                    <td className="p-4 font-bold text-white">{t.name}</td>
                    <td className="p-4 text-white/80">{t.role}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center space-x-0.5 text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded border border-brand-orange/15 font-bold">
                        <span>{t.rating}</span>
                        <Star size={10} className="fill-current" />
                      </span>
                    </td>
                    <td className="p-4 text-white/60 italic max-w-sm truncate">« {t.message} »</td>
                    <td className="p-4 text-center text-white/75 font-semibold">{t.displayOrder}</td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="text-white/45 hover:text-brand-orange transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(t.id, e)}
                        className="text-white/45 hover:text-red-400 transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block"
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

      {/* CRUD MODAL */}
      {selectedTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg h-full bg-[#08051F] border-l border-brand-purple/20 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-left">
              <div className="border-b border-brand-purple/20 pb-4">
                <h2 className="text-xl font-sora font-extrabold text-white">
                  {isNew ? "Ajouter un avis" : "Modifier l'avis"}
                </h2>
                <p className="text-[10px] text-white/50">Gérez le retour client affiché sur le site.</p>
              </div>

              {errorMsg && (
                <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/25 text-red-400 p-3 rounded-lg text-xs font-semibold">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Nom du Client</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Poste / Rôle</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. CEO de TechStart"
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Note (Étoiles)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Lien Photo Avatar (URL)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Optionnel"
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Avis / Message du client</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-magenta resize-none"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-6 border-t border-brand-purple/20">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange/95 text-white py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Save size={14} />
                  <span>{saving ? "Sauvegarde..." : "Enregistrer"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTestimonial(null)}
                  className="bg-white/10 hover:bg-white/20 text-white py-2.5 px-4 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
