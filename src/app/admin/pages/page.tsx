"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, Edit3, X, Save, AlertCircle, Upload, Eye, Image as ImageIcon } from "lucide-react";
import { RichTextEditor } from "@/components/cms/RichTextEditor";

interface PageData {
  id: string;
  slug: string;
  title: string;
  contentJson: string;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  updatedAt: string;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState(""); 
  const [isActive, setIsActive] = useState(true);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  
  // Image uploading states
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const featuredInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (data.success) {
        setPages(data.pages);
      }
    } catch (e) {
      console.error("Fetch pages error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleOpenEdit = (page: PageData) => {
    setSelectedPage(page);
    setTitle(page.title);
    setSlug(page.slug);
    
    let bodyContent = "";
    try {
      const parsed = JSON.parse(page.contentJson);
      bodyContent = parsed.html || parsed.body || parsed.content || "";
    } catch (e) {
      bodyContent = page.contentJson;
    }
    
    setContent(bodyContent);
    setIsActive(page.isActive);
    setSeoTitle(page.seoTitle || "");
    setSeoDescription(page.seoDescription || "");
    setOgImage(page.ogImage || "");
    setCanonicalUrl(page.canonicalUrl || "");
    setIsNew(false);
    setErrorMsg("");
    setUploadedImages([]);
  };

  const handleOpenNew = () => {
    setSelectedPage({} as PageData);
    setTitle("");
    setSlug("");
    setContent("");
    setIsActive(true);
    setSeoTitle("");
    setSeoDescription("");
    setOgImage("");
    setCanonicalUrl("");
    setIsNew(true);
    setErrorMsg("");
    setUploadedImages([]);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(
        val
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      setErrorMsg("Veuillez renseigner le titre et le slug.");
      return;
    }
    setSaving(true);
    setErrorMsg("");

    const contentJson = JSON.stringify({ html: content, blocks: [] });
    const method = isNew ? "POST" : "PUT";
    const bodyData = isNew
      ? { title, slug, contentJson, contentHtml: content, status: isActive ? "PUBLISHED" : "DRAFT", isActive, seoTitle, seoDescription, ogImage, canonicalUrl }
      : { id: selectedPage?.id, title, slug, contentJson, contentHtml: content, status: isActive ? "PUBLISHED" : "DRAFT", isActive, seoTitle, seoDescription, ogImage, canonicalUrl };

    try {
      const response = await fetch("/api/admin/pages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      if (data.success) {
        fetchPages();
        setSelectedPage(null);
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
    if (!confirm("Voulez-vous supprimer cette page ? Cette action est irréversible.")) return;

    try {
      const response = await fetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        fetchPages();
      } else {
        alert(data.error || "Erreur de suppression");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        return data.url;
      } else {
        alert(data.error || "Erreur lors de l'upload");
        return null;
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Erreur de connexion lors de l'upload");
      return null;
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFeatured(true);
    const url = await uploadFile(file);
    if (url) {
      setOgImage(url);
    }
    setUploadingFeatured(false);
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingContent(true);
    const url = await uploadFile(file);
    if (url) {
      setUploadedImages((prev) => [...prev, url]);
      const imageTag = `\n![${file.name.split(".")[0]}](${url})\n`;
      
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        setContent(before + imageTag + after);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + imageTag.length, start + imageTag.length);
        }, 10);
      } else {
        setContent((prev) => prev + imageTag);
      }
    }
    setUploadingContent(false);
  };

  const filtered = pages.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left relative">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white">
            Pages du Site
          </h1>
          <p className="text-xs text-white/50">Gérez le contenu des pages statiques de votre site.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer shrink-0"
        >
          <Plus size={14} />
          <span>Créer une page</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par titre ou URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1A1238]/60 border border-brand-purple/20 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
        />
      </div>

      <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-white/45">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/45">Aucune page trouvée.</div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-purple/20 text-white/50 uppercase font-semibold text-[10px]">
                  <th className="p-4">Titre / URL</th>
                  <th className="p-4 text-center">Statut</th>
                  <th className="p-4 text-center">Dernière modification</th>
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
                    <td className="p-4 text-center">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        p.isActive
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}>
                        {p.isActive ? "Active" : "Brouillon"}
                      </span>
                    </td>
                    <td className="p-4 text-center text-white/60">
                      {new Date(p.updatedAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <a
                        href={p.isActive ? `/${p.slug}` : `/api/admin/preview?path=/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white/45 hover:text-white transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block"
                        title="Visualiser"
                      >
                        <Eye size={14} />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="text-white/45 hover:text-brand-orange transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block"
                        title="Modifier"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(p.id, e)}
                        className="text-white/45 hover:text-red-400 transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block"
                        title="Supprimer"
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
      {selectedPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl h-full bg-[#08051F] border-l border-brand-purple/20 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedPage(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-left flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-brand-purple/20 pb-4">
                  <h2 className="text-xl font-sora font-extrabold text-white">
                    {isNew ? "Créer une nouvelle page" : "Modifier la page"}
                  </h2>
                  <p className="text-[10px] text-white/50">Configurez et éditez le contenu de votre page statique.</p>
                </div>

                {errorMsg && (
                  <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/25 text-red-400 p-3 rounded-lg text-xs font-semibold">
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Titre de la page</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Slug (URL)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. nouvelle-page"
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-white/70 font-semibold block">Image principale / SEO (og:image)</label>
                  <div className="flex items-center space-x-4">
                    {ogImage && (
                      <div className="w-16 h-16 rounded-lg border border-brand-purple/20 overflow-hidden shrink-0 bg-[#050314] flex items-center justify-center relative group">
                        <img src={ogImage} alt="Featured" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setOgImage("")}
                          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-red-400 font-bold text-xs"
                        >
                          Retirer
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => featuredInputRef.current?.click()}
                      className="flex items-center space-x-2 bg-brand-purple/10 hover:bg-brand-purple/25 text-white border border-brand-purple/30 px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>{uploadingFeatured ? "Téléchargement..." : "Télécharger une image"}</span>
                    </button>
                    <input
                      type="file"
                      ref={featuredInputRef}
                      onChange={handleFeaturedImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {!ogImage && (
                      <span className="text-[10px] text-white/40">Aucune image sélectionnée</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 flex flex-col">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-white/70 font-semibold">Contenu de la page</label>
                    <div>
                      <button
                        type="button"
                        onClick={() => contentInputRef.current?.click()}
                        className="flex items-center space-x-1.5 text-[11px] text-brand-orange hover:text-brand-orange/80 transition cursor-pointer font-sans"
                      >
                        <ImageIcon size={12} />
                        <span>{uploadingContent ? "Insertion..." : "Insérer une image"}</span>
                      </button>
                      <input
                        type="file"
                        ref={contentInputRef}
                        onChange={handleContentImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                  <RichTextEditor value={content} onChange={setContent} label="Contenu de la page" />
                </div>

                <div className="border-t border-brand-purple/15 pt-4 space-y-4">
                  <h3 className="text-xs font-sora font-semibold text-brand-magenta uppercase tracking-wider">
                    Paramètres SEO de la page
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-white/70 font-semibold">Titre SEO (Meta Title)</label>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="Utilise le titre par défaut"
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/70 font-semibold">URL Canonique</label>
                      <input
                        type="text"
                        value={canonicalUrl}
                        onChange={(e) => setCanonicalUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Description SEO (Meta Description)</label>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      rows={2}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-brand-purple/30 text-brand-magenta focus:ring-brand-magenta bg-brand-navy accent-brand-magenta"
                  />
                  <label htmlFor="isActive" className="text-xs text-white/70 select-none cursor-pointer font-sans">
                    Publier immédiatement cette page (rendre active)
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 border-t border-brand-purple/20 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedPage(null)}
                  className="px-4 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/5 text-xs transition cursor-pointer font-sans"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-orange hover:bg-brand-orange/95 disabled:bg-brand-orange/50 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer font-sans"
                >
                  <Save size={14} />
                  <span>{saving ? "Enregistrement..." : "Enregistrer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
