"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, Edit3, X, Save, AlertCircle, ExternalLink, Upload } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  objective: string;
  challenge: string;
  solution: string;
  result: string;
  images: string;
  categoryId: string;
  category?: Category;
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [client, setClient] = useState("");
  const [industry, setIndustry] = useState("");
  const [objective, setObjective] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState("");
  const [images, setImages] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          uploadedUrls.push(data.url);
        } else {
          alert(data.error || "Erreur d'upload");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Erreur de connexion lors de l'upload");
      }
    }

    if (uploadedUrls.length > 0) {
      const currentList = images ? images.split(";").filter(Boolean) : [];
      const newList = [...currentList, ...uploadedUrls];
      setImages(newList.join(";"));
    }
    setUploading(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const currentList = images ? images.split(";").filter(Boolean) : [];
    const newList = currentList.filter((_, idx) => idx !== indexToRemove);
    setImages(newList.join(";"));
  };

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (e) {
      console.error("Fetch projects error:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/contact"); // In our DB, we can fetch all or seed
      // For simplicity let's make a mock query or hardcode standard category list if no dedicated API
      setCategories([
        { id: "branding", name: "Branding" },
        { id: "motion-design", name: "Motion Design" },
        { id: "creation-web", name: "Création Web" },
        { id: "modelisation-3d", name: "Modélisation 3D" }
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchCategories();
  }, []);

  const handleOpenEdit = (project: Project) => {
    setSelectedProject(project);
    setTitle(project.title);
    setSlug(project.slug);
    setClient(project.client);
    setIndustry(project.industry);
    setObjective(project.objective || "");
    setChallenge(project.challenge || "");
    setSolution(project.solution || "");
    setResult(project.result || "");
    setImages(project.images || "");
    setCategoryId(project.categoryId || "");
    setIsNew(false);
    setErrorMsg("");
  };

  const handleOpenNew = () => {
    setSelectedProject({} as Project);
    setTitle("");
    setSlug("");
    setClient("");
    setIndustry("");
    setObjective("");
    setChallenge("");
    setSolution("");
    setResult("");
    setImages("");
    setCategoryId(categories[0]?.id || "branding");
    setIsNew(true);
    setErrorMsg("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !client) {
      setErrorMsg("Veuillez renseigner le titre, le slug et le client.");
      return;
    }
    setSaving(true);
    setErrorMsg("");

    const method = isNew ? "POST" : "PUT";
    const bodyData = isNew 
      ? { title, slug, client, industry, objective, challenge, solution, result, images, categoryId }
      : { id: selectedProject?.id, title, slug, client, industry, objective, challenge, solution, result, images, categoryId };

    try {
      const response = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      if (data.success) {
        fetchPortfolio();
        setSelectedProject(null);
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
    if (!confirm("Voulez-vous supprimer ce projet ? Cette action est irréversible.")) return;

    try {
      const response = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        fetchPortfolio();
      } else {
        alert(data.error || "Erreur de suppression");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left relative">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white">
            Gestion du Portfolio
          </h1>
          <p className="text-xs text-white/50">Gérez les projets et études de cas créatives de l'agence.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer shrink-0"
        >
          <Plus size={14} />
          <span>Ajouter un projet</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par titre, client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1A1238]/60 border border-brand-purple/20 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
        />
      </div>

      <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-white/45">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/45">Aucun projet trouvé.</div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-purple/20 text-white/50 uppercase font-semibold text-[10px]">
                  <th className="p-4">Titre du Projet</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Secteur</th>
                  <th className="p-4">Objectif principal</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-purple/10">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-purple/10 transition">
                    <td className="p-4">
                      <strong className="text-white block">{p.title}</strong>
                      <span className="text-[10px] text-brand-orange font-mono block">/{p.slug}</span>
                    </td>
                    <td className="p-4 text-white/80">{p.client}</td>
                    <td className="p-4 text-white/60">{p.industry}</td>
                    <td className="p-4 text-white/50 truncate max-w-xs">{p.objective}</td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="text-white/45 hover:text-brand-orange transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(p.id, e)}
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
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg h-full bg-[#08051F] border-l border-brand-purple/20 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-left">
              <div className="border-b border-brand-purple/20 pb-4">
                <h2 className="text-xl font-sora font-extrabold text-white">
                  {isNew ? "Ajouter un projet" : "Modifier le projet"}
                </h2>
                <p className="text-[10px] text-white/50">Configurez l'étude de cas du portfolio.</p>
              </div>

              {errorMsg && (
                <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/25 text-red-400 p-3 rounded-lg text-xs font-semibold">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Titre du Projet</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    placeholder="e.g. oleapure-branding"
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Client</label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Secteur / Industrie</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Agroalimentaire"
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Catégorie</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-brand-navy">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/70 block font-semibold">Images du Projet</label>
                <div className="grid grid-cols-4 gap-2">
                  {images && images.split(";").filter(Boolean).map((imgUrl, index) => (
                    <div key={index} className="w-full aspect-square rounded-lg border border-brand-purple/20 overflow-hidden bg-[#050314] flex items-center justify-center relative group">
                      <img src={imgUrl} alt={`Project ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-red-400 font-bold text-xs"
                      >
                        Retirer
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-square rounded-lg border border-dashed border-brand-purple/30 bg-brand-purple/5 hover:bg-brand-purple/10 flex flex-col items-center justify-center space-y-1 text-white/60 hover:text-white transition cursor-pointer"
                  >
                    <Upload size={16} />
                    <span className="text-[9px] font-semibold text-center leading-tight">
                      {uploading ? "Upload..." : "Ajouter"}
                    </span>
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImagesUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Objectif du projet</label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  rows={2}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-magenta resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Le Défi</label>
                  <textarea
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    rows={2}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-magenta resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70">La Solution</label>
                  <textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    rows={2}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-magenta resize-none"
                  />
                </div>
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
                  onClick={() => setSelectedProject(null)}
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
