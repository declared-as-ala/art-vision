"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, Edit3, X, Save, AlertCircle, Upload, Eye, Image as ImageIcon, Globe, MapPin } from "lucide-react";
import { RichTextEditor } from "@/components/cms/RichTextEditor";

type TabType = "pages" | "landings";

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

interface LandingData {
  id: string;
  title: string;
  slug: string;
  h1: string;
  keyword: string;
  city?: string | null;
  pageType: string;
  intro: string;
  content: string;
  faq?: string | null;
  status: string;
  seoTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  indexable: boolean;
  updatedAt: string;
}

export default function AdminPagesPage() {
  const [tab, setTab] = useState<TabType>("pages");

  // ── Static Pages state ──
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);

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
  
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const featuredInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── SEO Landing Pages state ──
  const [landings, setLandings] = useState<LandingData[]>([]);
  const [loadingLandings, setLoadingLandings] = useState(false);
  const [selectedLanding, setSelectedLanding] = useState<LandingData | null>(null);

  const [lTitle, setLTitle] = useState("");
  const [lSlug, setLSlug] = useState("");
  const [lH1, setLH1] = useState("");
  const [lKeyword, setLKeyword] = useState("");
  const [lCity, setLCity] = useState("");
  const [lPageType, setLPageType] = useState("GENERIC");
  const [lIntro, setLIntro] = useState("");
  const [lContent, setLContent] = useState("");
  const [lFaq, setLFaq] = useState("");
  const [lStatus, setLStatus] = useState("PUBLISHED");
  const [lSeoTitle, setLSeoTitle] = useState("");
  const [lMetaDesc, setLMetaDesc] = useState("");
  const [lCanonicalUrl, setLCanonicalUrl] = useState("");
  const [lIndexable, setLIndexable] = useState(true);

  const [landingSearch, setLandingSearch] = useState("");
  const [landingErrorMsg, setLandingErrorMsg] = useState("");

  // ── Fetch Static Pages ──
  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (data.success) setPages(data.pages);
    } catch (e) {
      console.error("Fetch pages error:", e);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch SEO Landings ──
  const fetchLandings = async () => {
    setLoadingLandings(true);
    try {
      const res = await fetch("/api/admin/seo/landings");
      const data = await res.json();
      if (data.success) setLandings(data.landingPages);
    } catch (e) {
      console.error("Fetch landings error:", e);
    } finally {
      setLoadingLandings(false);
    }
  };

  useEffect(() => {
    if (tab === "pages") fetchPages();
    else fetchLandings();
  }, [tab]);

  // ── Static Pages CRUD ──

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
    setTitle(""); setSlug(""); setContent("");
    setIsActive(true);
    setSeoTitle(""); setSeoDescription(""); setOgImage(""); setCanonicalUrl("");
    setIsNew(true);
    setErrorMsg("");
    setUploadedImages([]);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(
        val.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
          .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) { setErrorMsg("Veuillez renseigner le titre et le slug."); return; }
    setSaving(true);
    setErrorMsg("");
    const contentJson = JSON.stringify({ html: content, blocks: [] });
    const method = isNew ? "POST" : "PUT";
    const bodyData = isNew
      ? { title, slug, contentJson, contentHtml: content, status: isActive ? "PUBLISHED" : "DRAFT", isActive, seoTitle, seoDescription, ogImage, canonicalUrl }
      : { id: selectedPage?.id, title, slug, contentJson, contentHtml: content, status: isActive ? "PUBLISHED" : "DRAFT", isActive, seoTitle, seoDescription, ogImage, canonicalUrl };
    try {
      const res = await fetch("/api/admin/pages", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyData) });
      const data = await res.json();
      if (data.success) { fetchPages(); setSelectedPage(null); }
      else setErrorMsg(data.error || "Erreur d'enregistrement.");
    } catch (e) { setErrorMsg("Erreur réseau."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Voulez-vous supprimer cette page ? Cette action est irréversible.")) return;
    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchPages();
      else alert(data.error || "Erreur de suppression");
    } catch (e) { console.error(e); }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData(); formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      return data.success ? data.url : null;
    } catch { return null; }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingFeatured(true);
    const url = await uploadFile(file);
    if (url) setOgImage(url);
    setUploadingFeatured(false);
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingContent(true);
    const url = await uploadFile(file);
    if (url) {
      setUploadedImages(prev => [...prev, url!]);
      const tag = `\n![${file.name.split(".")[0]}](${url})\n`;
      const ta = textareaRef.current;
      if (ta) {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        setContent(ta.value.substring(0, start) + tag + ta.value.substring(end));
        setTimeout(() => { ta.focus(); ta.setSelectionRange(start + tag.length, start + tag.length); }, 10);
      } else setContent(prev => prev + tag);
    }
    setUploadingContent(false);
  };

  const filtered = pages.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── SEO Landing Pages CRUD ──

  const resetLandingForm = () => {
    setLTitle(""); setLSlug(""); setLH1(""); setLKeyword(""); setLCity("");
    setLPageType("GENERIC"); setLIntro(""); setLContent(""); setLFaq("");
    setLStatus("PUBLISHED"); setLSeoTitle(""); setLMetaDesc("");
    setLCanonicalUrl(""); setLIndexable(true);
    setSelectedLanding(null); setLandingErrorMsg("");
  };

  const handleOpenNewLanding = () => {
    resetLandingForm();
  };

  const handleOpenEditLanding = (landing: LandingData) => {
    setSelectedLanding(landing);
    setLTitle(landing.title);
    setLSlug(landing.slug);
    setLH1(landing.h1);
    setLKeyword(landing.keyword);
    setLCity(landing.city || "");
    setLPageType(landing.pageType);
    setLIntro(landing.intro);
    setLContent(landing.content);
    setLFaq(landing.faq || "");
    setLStatus(landing.status);
    setLSeoTitle(landing.seoTitle || "");
    setLMetaDesc(landing.metaDescription || "");
    setLCanonicalUrl(landing.canonicalUrl || "");
    setLIndexable(landing.indexable);
    setLandingErrorMsg("");
  };

  const handleTitleChangeLanding = (val: string) => {
    setLTitle(val);
    if (!selectedLanding) {
      const autoSlug = val.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      setLSlug(autoSlug);
      setLH1(val);
    }
  };

  const handleSaveLanding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lTitle || !lSlug || !lH1 || !lKeyword) {
      setLandingErrorMsg("Titre, slug, H1 et mot-clé sont requis.");
      return;
    }
    setSaving(true);
    setLandingErrorMsg("");
    const isNewLanding = !selectedLanding;
    const method = isNewLanding ? "POST" : "PUT";
    const bodyData: any = {
      title: lTitle, slug: lSlug, h1: lH1, keyword: lKeyword,
      city: lCity || null, pageType: lPageType, intro: lIntro, content: lContent,
      faq: lFaq ? (() => { try { return JSON.parse(lFaq); } catch { return lFaq; } })() : [],
      status: lStatus, seoTitle: lSeoTitle || null,
      metaDescription: lMetaDesc || null, canonicalUrl: lCanonicalUrl || null,
      ogImage: null, indexable: lIndexable
    };
    if (!isNewLanding) bodyData.id = selectedLanding.id;

    try {
      const res = await fetch("/api/admin/seo/landings", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyData)
      });
      const data = await res.json();
      if (data.success) { fetchLandings(); setSelectedLanding(null); }
      else setLandingErrorMsg(data.error || "Erreur d'enregistrement.");
    } catch { setLandingErrorMsg("Erreur réseau."); }
    finally { setSaving(false); }
  };

  const handleDeleteLanding = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Voulez-vous supprimer cette landing page ?")) return;
    try {
      const res = await fetch(`/api/admin/seo/landings?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchLandings();
      else alert(data.error || "Erreur de suppression");
    } catch (e) { console.error(e); }
  };

  const filteredLandings = landings.filter(l =>
    l.title.toLowerCase().includes(landingSearch.toLowerCase()) ||
    l.slug.toLowerCase().includes(landingSearch.toLowerCase()) ||
    l.keyword.toLowerCase().includes(landingSearch.toLowerCase()) ||
    (l.city || "").toLowerCase().includes(landingSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left relative">

      {/* ═══ Tabs ═══ */}
      <div className="flex gap-1 bg-[#1A1238]/40 border border-brand-purple/15 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("pages")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            tab === "pages"
              ? "bg-brand-magenta text-white shadow-lg shadow-brand-magenta/20"
              : "text-white/60 hover:text-white"
          }`}
        >
          Pages Statiques
        </button>
        <button
          onClick={() => setTab("landings")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            tab === "landings"
              ? "bg-brand-magenta text-white shadow-lg shadow-brand-magenta/20"
              : "text-white/60 hover:text-white"
          }`}
        >
          <Globe size={14} />
          Landings SEO
        </button>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* TAB: Static Pages                            */}
      {/* ════════════════════════════════════════════ */}
      {tab === "pages" && (
      <>
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
                        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <a href={p.isActive ? `/${p.slug}` : `/api/admin/preview?path=/${p.slug}`}
                         target="_blank" rel="noreferrer"
                         className="text-white/45 hover:text-white transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block" title="Visualiser">
                        <Eye size={14} />
                      </a>
                      <button onClick={() => handleOpenEdit(p)}
                        className="text-white/45 hover:text-brand-orange transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block" title="Modifier">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={(e) => handleDelete(p.id, e)}
                        className="text-white/45 hover:text-red-400 transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block" title="Supprimer">
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
      </> 
      )}

      {/* ════════════════════════════════════════════ */}
      {/* TAB: SEO Landings                            */}
      {/* ════════════════════════════════════════════ */}
      {tab === "landings" && (
      <>
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white">
            Landings SEO
          </h1>
          <p className="text-xs text-white/50">Gérez vos pages d'atterrissage optimisées pour le référencement local et national.</p>
        </div>
        <button
          onClick={handleOpenNewLanding}
          className="bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer shrink-0"
        >
          <Plus size={14} />
          <span>Créer une landing SEO</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par titre, slug, mot-clé ou ville..."
          value={landingSearch}
          onChange={(e) => setLandingSearch(e.target.value)}
          className="w-full bg-[#1A1238]/60 border border-brand-purple/20 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
        />
      </div>

      <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
        {loadingLandings ? (
          <div className="text-center py-16 text-white/45">Chargement...</div>
        ) : filteredLandings.length === 0 ? (
          <div className="text-center py-16 text-white/45">Aucune landing page trouvée.</div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-purple/20 text-white/50 uppercase font-semibold text-[10px]">
                  <th className="p-4">Titre / URL</th>
                  <th className="p-4">Mot-clé</th>
                  <th className="p-4 text-center">Ville</th>
                  <th className="p-4 text-center">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-purple/10">
                {filteredLandings.map((l) => (
                  <tr key={l.id} className="hover:bg-brand-purple/10 transition">
                    <td className="p-4">
                      <strong className="text-white block">{l.title}</strong>
                      <span className="text-[10px] text-brand-orange font-mono block">/{l.slug}</span>
                    </td>
                    <td className="p-4 text-white/70 font-medium">{l.keyword}</td>
                    <td className="p-4 text-center">
                      {l.city ? (
                        <span className="inline-flex items-center gap-1 text-white/70 text-[10px]">
                          <MapPin size={11} className="text-brand-magenta" />
                          {l.city}
                        </span>
                      ) : (
                        <span className="text-white/30 text-[10px]">National</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        l.status === "PUBLISHED"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        {l.status === "PUBLISHED" ? "Publiée" : "Brouillon"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <a href={`/${l.slug}`} target="_blank" rel="noreferrer"
                         className="text-white/45 hover:text-white transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block" title="Visualiser">
                        <Eye size={14} />
                      </a>
                      <button onClick={() => handleOpenEditLanding(l)}
                        className="text-white/45 hover:text-brand-orange transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block" title="Modifier">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={(e) => handleDeleteLanding(l.id, e)}
                        className="text-white/45 hover:text-red-400 transition p-1.5 rounded hover:bg-white/5 cursor-pointer inline-block" title="Supprimer">
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
      </> 
      )}

      {/* ════════════════════════════════════════════ */}
      {/* MODAL: Static Page                           */}
      {/* ════════════════════════════════════════════ */}
      {tab === "pages" && selectedPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl h-full bg-[#08051F] border-l border-brand-purple/20 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
            <button type="button" onClick={() => setSelectedPage(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition">
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
                    <AlertCircle size={14} /><span>{errorMsg}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Titre de la page</label>
                    <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Slug (URL)</label>
                    <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. nouvelle-page"
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/70 font-semibold block">Image principale / SEO (og:image)</label>
                  <div className="flex items-center space-x-4">
                    {ogImage && (
                      <div className="w-16 h-16 rounded-lg border border-brand-purple/20 overflow-hidden shrink-0 bg-[#050314] flex items-center justify-center relative group">
                        <img src={ogImage} alt="Featured" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setOgImage("")}
                          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-red-400 font-bold text-xs">Retirer</button>
                      </div>
                    )}
                    <button type="button" onClick={() => featuredInputRef.current?.click()}
                      className="flex items-center space-x-2 bg-brand-purple/10 hover:bg-brand-purple/25 text-white border border-brand-purple/30 px-4 py-2 rounded-lg text-xs transition cursor-pointer">
                      <Upload size={14} /><span>{uploadingFeatured ? "Téléchargement..." : "Télécharger une image"}</span>
                    </button>
                    <input type="file" ref={featuredInputRef} onChange={handleFeaturedImageUpload} accept="image/*" className="hidden" />
                    {!ogImage && <span className="text-[10px] text-white/40">Aucune image sélectionnée</span>}
                  </div>
                </div>
                <div className="space-y-1.5 flex-1 flex flex-col">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-white/70 font-semibold">Contenu de la page</label>
                    <div>
                      <button type="button" onClick={() => contentInputRef.current?.click()}
                        className="flex items-center space-x-1.5 text-[11px] text-brand-orange hover:text-brand-orange/80 transition cursor-pointer font-sans">
                        <ImageIcon size={12} /><span>{uploadingContent ? "Insertion..." : "Insérer une image"}</span>
                      </button>
                      <input type="file" ref={contentInputRef} onChange={handleContentImageUpload} accept="image/*" className="hidden" />
                    </div>
                  </div>
                  <RichTextEditor value={content} onChange={setContent} label="Contenu de la page" />
                </div>
                <div className="border-t border-brand-purple/15 pt-4 space-y-4">
                  <h3 className="text-xs font-sora font-semibold text-brand-magenta uppercase tracking-wider">Paramètres SEO de la page</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-white/70 font-semibold">Titre SEO (Meta Title)</label>
                      <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Utilise le titre par défaut"
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/70 font-semibold">URL Canonique</label>
                      <input type="text" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="https://..."
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Description SEO (Meta Description)</label>
                    <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" />
                  </div>
                </div>
                <div className="flex items-center space-x-3 pt-2">
                  <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-brand-purple/30 text-brand-magenta focus:ring-brand-magenta bg-brand-navy accent-brand-magenta" />
                  <label htmlFor="isActive" className="text-xs text-white/70 select-none cursor-pointer font-sans">
                    Publier immédiatement cette page (rendre active)
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 border-t border-brand-purple/20 pt-4 mt-6">
                <button type="button" onClick={() => setSelectedPage(null)}
                  className="px-4 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/5 text-xs transition cursor-pointer font-sans">Annuler</button>
                <button type="submit" disabled={saving}
                  className="bg-brand-orange hover:bg-brand-orange/95 disabled:bg-brand-orange/50 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer font-sans">
                  <Save size={14} /><span>{saving ? "Enregistrement..." : "Enregistrer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* MODAL: SEO Landing Page                      */}
      {/* ════════════════════════════════════════════ */}
      {tab === "landings" && selectedLanding !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl h-full bg-[#08051F] border-l border-brand-purple/20 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
            <button type="button" onClick={() => { setSelectedLanding(null); }}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition">
              <X size={20} />
            </button>
            <form onSubmit={handleSaveLanding} className="space-y-4 pt-4 text-left flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-brand-purple/20 pb-4">
                  <h2 className="text-xl font-sora font-extrabold text-white">
                    {!selectedLanding ? "Créer une landing SEO" : "Modifier la landing SEO"}
                  </h2>
                  <p className="text-[10px] text-white/50">Configurez les paramètres de votre page d'atterrissage optimisée SEO.</p>
                </div>
                {landingErrorMsg && (
                  <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/25 text-red-400 p-3 rounded-lg text-xs font-semibold">
                    <AlertCircle size={14} /><span>{landingErrorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Titre</label>
                    <input type="text" value={lTitle} onChange={(e) => handleTitleChangeLanding(e.target.value)}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Slug (URL)</label>
                    <input type="text" value={lSlug} onChange={(e) => setLSlug(e.target.value)} placeholder="e.g. agence-graphique-paris"
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold">H1 (Titre principal de la page)</label>
                  <input type="text" value={lH1} onChange={(e) => setLH1(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" required />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Mot-clé principal</label>
                    <input type="text" value={lKeyword} onChange={(e) => setLKeyword(e.target.value)}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Ville (optionnel)</label>
                    <input type="text" value={lCity} onChange={(e) => setLCity(e.target.value)} placeholder="Ex: Paris"
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Type</label>
                    <select value={lPageType} onChange={(e) => setLPageType(e.target.value)}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta cursor-pointer">
                      <option value="GENERIC">National</option>
                      <option value="LOCAL">Local</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold">Introduction</label>
                  <textarea value={lIntro} onChange={(e) => setLIntro(e.target.value)} rows={2}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold">Contenu (HTML)</label>
                  <textarea value={lContent} onChange={(e) => setLContent(e.target.value)} rows={8}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-magenta" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold">FAQ (JSON, optionnel)</label>
                  <textarea value={lFaq} onChange={(e) => setLFaq(e.target.value)} rows={3} placeholder='[{"question":"...","answer":"..."}]'
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-magenta" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">Statut</label>
                    <select value={lStatus} onChange={(e) => setLStatus(e.target.value)}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta cursor-pointer">
                      <option value="PUBLISHED">Publiée</option>
                      <option value="DRAFT">Brouillon</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold">URL Canonique</label>
                    <input type="text" value={lCanonicalUrl} onChange={(e) => setLCanonicalUrl(e.target.value)} placeholder="https://..."
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" />
                  </div>
                </div>

                <div className="border-t border-brand-purple/15 pt-4 space-y-4">
                  <h3 className="text-xs font-sora font-semibold text-brand-magenta uppercase tracking-wider">Paramètres SEO</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-white/70 font-semibold">Titre SEO (Meta Title)</label>
                      <input type="text" value={lSeoTitle} onChange={(e) => setLSeoTitle(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/70 font-semibold">Description SEO (Meta Description)</label>
                      <textarea value={lMetaDesc} onChange={(e) => setLMetaDesc(e.target.value)} rows={2}
                        className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-magenta font-sans" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 pt-2">
                    <input type="checkbox" id="lIndexable" checked={lIndexable} onChange={(e) => setLIndexable(e.target.checked)}
                      className="w-4 h-4 rounded border-brand-purple/30 text-brand-magenta focus:ring-brand-magenta bg-brand-navy accent-brand-magenta" />
                    <label htmlFor="lIndexable" className="text-xs text-white/70 select-none cursor-pointer font-sans">
                      Indexable par Google
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 border-t border-brand-purple/20 pt-4 mt-6">
                <button type="button" onClick={() => { setSelectedLanding(null); }}
                  className="px-4 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/5 text-xs transition cursor-pointer font-sans">Annuler</button>
                <button type="submit" disabled={saving}
                  className="bg-brand-orange hover:bg-brand-orange/95 disabled:bg-brand-orange/50 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer font-sans">
                  <Save size={14} /><span>{saving ? "Enregistrement..." : "Enregistrer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
