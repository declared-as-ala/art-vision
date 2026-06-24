"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, Edit3, X, Save, AlertCircle, Upload } from "lucide-react";
import { RichTextEditor } from "@/components/cms/RichTextEditor";
import HtmlBlockEditor from "@/components/admin/HtmlBlockEditor";

interface Category {
  id: string;
  name: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  featuredImage: string;
  author: string;
  status: string;
  tags: string;
  readingTime: number;
  categoryId: string;
  category?: Category;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [tags, setTags] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [categoryId, setCategoryId] = useState("");
  const [customHtml, setCustomHtml] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setFeaturedImage(data.url);
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

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error("Fetch posts error:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategories([
        { id: "design", name: "Design" },
        { id: "branding", name: "Branding" },
        { id: "web-dev", name: "Développement Web" }
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const handleOpenEdit = (post: Post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setFeaturedImage(post.featuredImage || "");
    setAuthor(post.author);
    setStatus(post.status);
    setTags(post.tags || "");
    setReadingTime(post.readingTime);
    setCategoryId(post.categoryId || "");
    setCustomHtml((post as any).customHtml || "");
    setIsNew(false);
    setErrorMsg("");
  };

  const handleOpenNew = () => {
    setSelectedPost({} as Post);
    setTitle("");
    setSlug("");
    setContent("");
    setFeaturedImage("");
    setAuthor("Admin");
    setStatus("DRAFT");
    setTags("");
    setReadingTime(5);
    setCategoryId(categories[0]?.id || "design");
    setCustomHtml("");
    setIsNew(true);
    setErrorMsg("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      setErrorMsg("Veuillez renseigner le titre et le slug.");
      return;
    }
    setSaving(true);
    setErrorMsg("");

    const method = isNew ? "POST" : "PUT";
    const bodyData = isNew
      ? { title, slug, content, featuredImage, author, status, tags, readingTime: Number(readingTime), categoryId, customHtml }
      : { id: selectedPost?.id, title, slug, content, featuredImage, author, status, tags, readingTime: Number(readingTime), categoryId, customHtml };

    try {
      const response = await fetch("/api/admin/posts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      if (data.success) {
        fetchPosts();
        setSelectedPost(null);
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
    if (!confirm("Voulez-vous supprimer cet article ? Cette action est irréversible.")) return;

    try {
      const response = await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        fetchPosts();
      } else {
        alert(data.error || "Erreur de suppression");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 text-left relative">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white">
            Gestion du Blog
          </h1>
          <p className="text-xs text-white/50">Rédigez et organisez vos articles de blog d'actualité design.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer shrink-0"
        >
          <Plus size={14} />
          <span>Créer un article</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par titre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1A1238]/60 border border-brand-purple/20 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
        />
      </div>

      <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-white/45">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/45">Aucun article trouvé.</div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-purple/20 text-white/50 uppercase font-semibold text-[10px]">
                  <th className="p-4">Titre</th>
                  <th className="p-4">Auteur</th>
                  <th className="p-4 text-center">Temps Lecture</th>
                  <th className="p-4 text-center">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-purple/10">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-purple/10 transition">
                    <td className="p-4">
                      <strong className="text-white block">{p.title}</strong>
                      <span className="text-[10px] text-brand-orange font-mono block">/blog/{p.slug}</span>
                    </td>
                    <td className="p-4 text-white/80">{p.author}</td>
                    <td className="p-4 text-center text-white/60">{p.readingTime} min</td>
                    <td className="p-4 text-center">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        p.status === "PUBLISHED"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        {p.status}
                      </span>
                    </td>
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
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg h-full bg-[#08051F] border-l border-brand-purple/20 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-left">
              <div className="border-b border-brand-purple/20 pb-4">
                <h2 className="text-xl font-sora font-extrabold text-white">
                  {isNew ? "Créer un article" : "Modifier l'article"}
                </h2>
                <p className="text-[10px] text-white/50">Rédigez le contenu de votre blog d'actualité.</p>
              </div>

              {errorMsg && (
                <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/25 text-red-400 p-3 rounded-lg text-xs font-semibold">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Titre de l'article</label>
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
                    placeholder="e.g. astuces-design"
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Auteur</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Temps de lecture</label>
                  <input
                    type="number"
                    value={readingTime}
                    onChange={(e) => setReadingTime(Number(e.target.value))}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Statut</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta cursor-pointer"
                  >
                    <option value="DRAFT" className="bg-brand-navy">Brouillon</option>
                    <option value="PUBLISHED" className="bg-brand-navy">Publié</option>
                  </select>
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
                <label className="text-xs text-white/70 block">Image à la Une</label>
                <div className="flex items-center space-x-4">
                  {featuredImage && (
                    <div className="w-16 h-16 rounded-lg border border-brand-purple/20 overflow-hidden shrink-0 bg-[#050314] flex items-center justify-center relative group">
                      <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFeaturedImage("")}
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
                  {!featuredImage && (
                    <span className="text-[10px] text-white/40">Aucune image sélectionnée</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Tags (Séparés par des virgules)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="branding, design, css"
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Contenu de l'article</label>
                <RichTextEditor value={content} onChange={setContent} label="Contenu de l'article" />
              </div>

              <div className="border-t border-brand-purple/20 pt-4">
                <HtmlBlockEditor value={customHtml} onChange={setCustomHtml} hint="Inséré sous l'article. HTML nettoyé automatiquement (scripts interdits)." />
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
                  onClick={() => setSelectedPost(null)}
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
