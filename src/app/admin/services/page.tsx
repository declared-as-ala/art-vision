"use client";

import React, { useState, useEffect, useRef } from "react";
import { Briefcase, Search, Plus, Trash2, Edit3, X, Save, AlertCircle, Upload } from "lucide-react";

interface PricingPackage {
  id: string;
  name: string;
  price: string;
}

interface MediaImg { url: string; alt: string }
interface MediaVid { url: string; title: string }

interface Service {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image?: string;
  heroTagline?: string;
  introHeading?: string;
  description: string;
  detailedBody: string;
  benefits: string;
  process: string;
  gallery?: string;
  videos?: string;
  packages: PricingPackage[];
}

const parseArr = (v?: string): any[] => {
  try { const a = JSON.parse(v || "[]"); return Array.isArray(a) ? a : []; } catch { return []; }
};
const normImgs = (v?: string): MediaImg[] =>
  parseArr(v).map((x) => (typeof x === "string" ? { url: x, alt: "" } : { url: x.url, alt: x.alt || "" }));
const normVids = (v?: string): MediaVid[] =>
  parseArr(v).map((x) => (typeof x === "string" ? { url: x, title: "" } : { url: x.url, title: x.title || "" }));

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Modal form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [detailedBody, setDetailedBody] = useState("");
  const [benefits, setBenefits] = useState("");
  const [process, setProcess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New media + intro fields
  const [heroTagline, setHeroTagline] = useState("");
  const [introHeading, setIntroHeading] = useState("");
  const [gallery, setGallery] = useState<MediaImg[]>([]);
  const [videos, setVideos] = useState<MediaVid[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setGalleryUploading(true);
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.success) setGallery((g) => [...g, { url: data.url, alt: "" }]);
        else alert(data.error || "Erreur d'upload");
      } catch {
        alert("Erreur de connexion lors de l'upload");
      }
    }
    setGalleryUploading(false);
    e.target.value = "";
  };

  const addVideo = () => {
    const url = newVideoUrl.trim();
    if (!url) return;
    setVideos((v) => [...v, { url, title: newVideoTitle.trim() }]);
    setNewVideoUrl("");
    setNewVideoTitle("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.url);
      } else {
        alert(data.error || "Erreur d'upload");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Erreur de connexion lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (e) {
      console.error("Fetch services error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenEdit = (service: Service) => {
    setSelectedService(service);
    setName(service.name);
    setSlug(service.slug);
    setIcon(service.icon);
    setImage(service.image || "");
    setHeroTagline(service.heroTagline || "");
    setIntroHeading(service.introHeading || "");
    setGallery(normImgs(service.gallery));
    setVideos(normVids(service.videos));
    setDescription(service.description);
    setDetailedBody(service.detailedBody || "");
    setBenefits(service.benefits || "");
    setProcess(service.process || "");
    setIsNew(false);
    setErrorMsg("");
  };

  const handleOpenNew = () => {
    setSelectedService({} as Service);
    setName("");
    setSlug("");
    setIcon("Palette");
    setImage("");
    setHeroTagline("L'Âme de Votre Marque");
    setIntroHeading("De l'idée à la réalisation");
    setGallery([]);
    setVideos([]);
    setDescription("");
    setDetailedBody("");
    setBenefits("");
    setProcess("");
    setIsNew(true);
    setErrorMsg("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      setErrorMsg("Veuillez renseigner le nom et le slug.");
      return;
    }
    setSaving(true);
    setErrorMsg("");

    const method = isNew ? "POST" : "PUT";
    const media = {
      heroTagline,
      introHeading,
      gallery: JSON.stringify(gallery),
      videos: JSON.stringify(videos),
    };
    const bodyData = isNew
      ? { name, slug, icon, image, description, detailedBody, benefits, process, ...media }
      : { id: selectedService?.id, name, slug, icon, image, description, detailedBody, benefits, process, ...media };

    try {
      const response = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      if (data.success) {
        fetchServices();
        setSelectedService(null);
      } else {
        setErrorMsg(data.error || "Une erreur s'est produite lors de l'enregistrement.");
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
    if (!confirm("Voulez-vous vraiment supprimer ce service ? Cette action est irréversible.")) return;

    try {
      const response = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        fetchServices();
      } else {
        alert(data.error || "Erreur de suppression");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 text-left relative">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white">
            Gestion des Services
          </h1>
          <p className="text-xs text-white/50">Gérez le catalogue des services de communication affichés sur le site.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer shrink-0"
        >
          <Plus size={14} />
          <span>Ajouter un service</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher un service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1A1238]/60 border border-brand-purple/20 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
        />
      </div>

      <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-white/45">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/45">Aucun service trouvé.</div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-purple/20 text-white/50 uppercase font-semibold text-[10px]">
                  <th className="p-4">Nom</th>
                  <th className="p-4">Slug (URL)</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-center">Packages</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-purple/10">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-brand-purple/10 transition">
                    <td className="p-4">
                      <strong className="text-white block">{s.name}</strong>
                    </td>
                    <td className="p-4 text-brand-orange font-mono text-[10px]">/{s.slug}</td>
                    <td className="p-4 text-white/60 truncate max-w-xs">{s.description}</td>
                    <td className="p-4 text-center">
                      <span className="text-[10px] bg-brand-purple/30 text-white border border-brand-purple/40 px-2 py-0.5 rounded-full font-bold">
                        {s.packages?.length || 0}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="text-white/45 hover:text-brand-orange transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(s.id, e)}
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
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg h-full bg-[#08051F] border-l border-brand-purple/20 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-left">
              <div className="border-b border-brand-purple/20 pb-4">
                <h2 className="text-xl font-sora font-extrabold text-white">
                  {isNew ? "Créer un service" : "Modifier le service"}
                </h2>
                <p className="text-[10px] text-white/50">Configurez les paramètres publics de la prestation.</p>
              </div>

              {errorMsg && (
                <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/25 text-red-400 p-3 rounded-lg text-xs font-semibold">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Nom du service</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Slug (URL)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. site-vitrine"
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Nom de l'icône Lucide</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Palette, PenTool, Printer, Video, Box, Globe, Users..."
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Tagline (au-dessus du titre)</label>
                  <input
                    type="text"
                    value={heroTagline}
                    onChange={(e) => setHeroTagline(e.target.value)}
                    placeholder="L'Âme de Votre Marque"
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Titre de la présentation</label>
                  <input
                    type="text"
                    value={introHeading}
                    onChange={(e) => setIntroHeading(e.target.value)}
                    placeholder="De l'idée à l'identité"
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/70 block font-semibold">Image du service (vignette)</label>
                <div className="flex items-center space-x-4">
                  {image && (
                    <div className="w-16 h-16 rounded-lg border border-brand-purple/20 overflow-hidden shrink-0 bg-[#050314] flex items-center justify-center relative group">
                      <img src={image} alt="Service" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-red-400 font-bold text-xs"
                      >
                        Retirer
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 bg-brand-purple/10 hover:bg-brand-purple/25 text-white border border-brand-purple/30 px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                  >
                    <Upload size={14} />
                    <span>{uploading ? "Téléchargement..." : "Télécharger l'image"}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {!image && (
                    <span className="text-[10px] text-white/40">Aucune image sélectionnée</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Courte description d'accroche</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-magenta resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Présentation Détaillée (Corps de Page)</label>
                <textarea
                  value={detailedBody}
                  onChange={(e) => setDetailedBody(e.target.value)}
                  rows={4}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-magenta resize-none"
                />
              </div>

              {/* Gallery manager */}
              <div className="space-y-2 border-t border-brand-purple/20 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-white/70 font-semibold">Galerie d'images ({gallery.length})</label>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex items-center space-x-1.5 bg-brand-purple/10 hover:bg-brand-purple/25 text-white border border-brand-purple/30 px-3 py-1.5 rounded-lg text-[11px] transition cursor-pointer"
                  >
                    <Upload size={12} />
                    <span>{galleryUploading ? "Téléchargement..." : "Ajouter des images"}</span>
                  </button>
                  <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                </div>
                {gallery.length === 0 ? (
                  <p className="text-[10px] text-white/40">Aucune image. Importez des visuels pour la galerie publique.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {gallery.map((img, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="aspect-[4/3] rounded-lg border border-brand-purple/20 overflow-hidden relative group bg-[#050314]">
                          <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setGallery((g) => g.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-red-400 font-bold text-[10px]"
                          >
                            Retirer
                          </button>
                        </div>
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) => setGallery((g) => g.map((m, i) => (i === idx ? { ...m, alt: e.target.value } : m)))}
                          placeholder="Texte alternatif (SEO)"
                          className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-brand-magenta"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video manager */}
              <div className="space-y-2 border-t border-brand-purple/20 pt-4">
                <label className="text-xs text-white/70 font-semibold block">Vidéos ({videos.length})</label>
                <p className="text-[10px] text-white/40">Collez un lien YouTube, Vimeo ou un fichier .mp4.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="flex-1 bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                  />
                  <input
                    type="text"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    placeholder="Titre (option)"
                    className="w-28 bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                  />
                  <button
                    type="button"
                    onClick={addVideo}
                    className="bg-brand-purple/20 hover:bg-brand-purple/40 border border-brand-purple/30 text-white px-3 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {videos.length > 0 && (
                  <div className="space-y-1.5">
                    {videos.map((v, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-brand-navy/60 border border-brand-purple/20 rounded-lg px-3 py-1.5">
                        <span className="text-[10px] text-white/70 truncate flex-1">{v.title || v.url}</span>
                        <button
                          type="button"
                          onClick={() => setVideos((vs) => vs.filter((_, i) => i !== idx))}
                          className="text-white/40 hover:text-red-400 transition shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60 block">Avantages Clés (Séparés par des points-virgules)</label>
                <input
                  type="text"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="Livrable vectoriel;BAT de contrôle;Support réactif"
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60 block">Processus (Séparés par des points-virgules)</label>
                <input
                  type="text"
                  value={process}
                  onChange={(e) => setProcess(e.target.value)}
                  placeholder="Audit & Brief;Concepts & Planches;BAT & Validation"
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
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
                  onClick={() => setSelectedService(null)}
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
