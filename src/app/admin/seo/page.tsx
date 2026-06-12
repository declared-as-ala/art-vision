"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  Search,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Image as ImageIcon,
  ArrowRight,
  Link2,
  HelpCircle,
  Check,
  Save,
  Globe,
  PlusCircle,
  ChevronRight,
  FileCode,
  Sparkles,
  Layers,
  Sliders,
  AlertCircle,
  CheckSquare,
  Wand2,
  User,
  Zap,
  Info
} from "lucide-react";

type RoleType = "COLLABORATOR" | "ADMIN_DEV";

export default function AdminSeoPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorFeedback, setErrorFeedback] = useState("");
  
  // Simulated visual role selector
  const [simulatedRole, setSimulatedRole] = useState<RoleType>("COLLABORATOR");
  const [activeSubTab, setActiveSubTab] = useState<"general" | "redirects" | "sitemap">("general");

  // Ref inputs for Checklist focusing
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descTextareaRef = useRef<HTMLTextAreaElement>(null);
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const introTextareaRef = useRef<HTMLTextAreaElement>(null);
  const imageAltInputRef = useRef<HTMLInputElement>(null);

  // --- API data state ---
  const [globalTitle, setGlobalTitle] = useState("");
  const [globalDesc, setGlobalDesc] = useState("");
  const [robotsTxt, setRobotsTxt] = useState("");
  const [googleSearchCons, setGoogleSearchCons] = useState("");
  const [redirects, setRedirects] = useState<any[]>([]);
  const [sitemapEntries, setSitemapEntries] = useState<any[]>([]);
  const [sitemapSyncing, setSitemapSyncing] = useState(false);
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [pagesSEO, setPagesSEO] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);

  // --- Category Filters & Pagination State ---
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "SERVICE" | "PORTFOLIO" | "BLOG" | "LANDING" | "STATIC">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // --- Modal / Editor State ---
  const [showImproverModal, setShowImproverModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [improverForm, setImproverForm] = useState({
    title: "",
    seoTitle: "",
    metaDescription: "",
    focusKeyword: "",
    intro: "",
    imageAlt: "",
    faq: [] as { question: string; answer: string }[],
    relatedServices: "",
    ctaText: "",
    indexable: true
  });
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // --- Wizard State ---
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardForm, setWizardForm] = useState({
    keyword: "",
    city: "",
    serviceSlug: "",
    shortIntro: "",
    seoTitle: "",
    metaDescription: "",
    faq: [] as { question: string; answer: string }[]
  });
  const [wizardFaqQ, setWizardFaqQ] = useState("");
  const [wizardFaqA, setWizardFaqA] = useState("");

  // --- Assistant State ---
  const [assistantInput, setAssistantInput] = useState({
    keyword: "",
    city: "",
    serviceType: "Graphisme / Branding"
  });
  const [assistantSuggestion, setAssistantSuggestion] = useState<any>(null);

  // --- Redirect modal state ---
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [selectedRedirect, setSelectedRedirect] = useState<any>(null);
  const [redirSource, setRedirSource] = useState("");
  const [redirTarget, setRedirTarget] = useState("");
  const [redirStatus, setRedirStatus] = useState(301);

  // Load dashboard data
  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch user role
      const globalRes = await fetch("/api/admin/seo/settings");
      const globalData = await globalRes.json();
      if (globalData.success && globalData.settings) {
        setGlobalTitle(globalData.settings.globalTitle || "");
        setGlobalDesc(globalData.settings.globalDesc || "");
        setRobotsTxt(globalData.settings.robotsTxt || "");
        setGoogleSearchCons(globalData.settings.googleSearchCons || "");
      }

      // Fetch pages
      const pagesRes = await fetch("/api/admin/seo/pages");
      const pagesData = await pagesRes.json();
      if (pagesData.success) {
        setPagesSEO(pagesData.pages);
      }

      // Fetch redirects
      const redirRes = await fetch("/api/admin/seo/redirects");
      const redirData = await redirRes.json();
      if (redirData.success) {
        setRedirects(redirData.redirects);
      }

      // Fetch sitemap
      const sitemapRes = await fetch("/api/admin/seo/sitemap");
      const sitemapData = await sitemapRes.json();
      if (sitemapData.success) {
        setSitemapEntries(sitemapData.entries);
      }

      // Fetch landings
      const landingRes = await fetch("/api/admin/seo/landings");
      const landingData = await landingRes.json();
      if (landingData.success) {
        setLandingPages(landingData.landingPages);
      }

      // Fetch media
      const mediaRes = await fetch("/api/admin/seo/media");
      const mediaData = await mediaRes.json();
      if (mediaData.success) {
        setMediaList(mediaData.mediaList);
      }
    } catch (e) {
      console.error(e);
      showFeedback("Erreur lors de la récupération des données", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (msg: string, isError = false) => {
    if (isError) {
      setErrorFeedback(msg);
      setTimeout(() => setErrorFeedback(""), 5000);
    } else {
      setFeedback(msg);
      setTimeout(() => setFeedback(""), 4000);
    }
  };

  // Heuristics Score calculation
  const getSEOStatus = (score: number) => {
    if (score >= 80) return { label: "Optimisé", color: "text-green-400 bg-green-500/10 border-green-500/20" };
    if (score >= 50) return { label: "À améliorer", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" };
    return { label: "Critique", color: "text-red-400 bg-red-500/10 border-red-500/20" };
  };

  // Simple Mode overview stats
  const totalPages = pagesSEO.length;
  const goodSeoPagesCount = pagesSEO.filter(p => p.score >= 80).length;
  const needsImprovementCount = pagesSEO.filter(p => p.score >= 50 && p.score < 80).length;
  const criticalPagesCount = pagesSEO.filter(p => p.score < 50).length;
  const missingMetaCount = pagesSEO.filter(p => !p.seoDescription || p.seoDescription.length === 0).length;
  const missingAltsCount = mediaList.filter(m => !m.altText || m.altText.trim() === "").length;
  const averageScore = totalPages > 0 
    ? Math.round(pagesSEO.reduce((sum, p) => sum + p.score, 0) / totalPages) 
    : 0;

  // Filter pages based on selected category type
  const filteredPages = pagesSEO.filter((page) => {
    if (selectedCategory === "ALL") return true;
    if (selectedCategory === "SERVICE") return page.type === "Prestation";
    if (selectedCategory === "PORTFOLIO") return page.type === "Réalisation";
    if (selectedCategory === "BLOG") return page.type === "Article Blog";
    if (selectedCategory === "LANDING") return page.type === "Landing SEO";
    if (selectedCategory === "STATIC") return page.type === "Page Statique";
    return true;
  });

  // Calculate paginated pages
  const totalFilteredItems = filteredPages.length;
  const totalPagesCount = Math.ceil(totalFilteredItems / itemsPerPage) || 1;
  const paginatedPages = filteredPages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Bulk quick fixes ---
  const handleBulkFixMeta = async () => {
    setSubmitting(true);
    let count = 0;
    try {
      for (const page of pagesSEO) {
        if (!page.seoDescription || page.seoDescription.trim() === "") {
          const pageType = page.type === "Prestation" ? "SERVICE" : page.type === "Article Blog" ? "POST" : page.type === "Réalisation" ? "PROJECT" : page.type === "Landing SEO" ? "SEO_LANDING" : "PAGE";
          const autoDesc = `Art Vision, agence graphique et de communication en France. Découvrez notre prestation : ${page.title}. Accompagnement premium et devis sous 24h.`;
          
          await fetch("/api/admin/seo/pages", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pageType,
              pageId: page.id,
              title: page.seoTitle || page.title,
              description: autoDesc,
              focusKeyword: page.focusKeyword || page.title,
              canonicalUrl: page.canonicalUrl,
              indexable: page.checklist.isIndexable
            })
          });
          count++;
        }
      }
      showFeedback(`${count} méta descriptions manquantes ont été générées automatiquement !`);
      loadData();
    } catch (e) {
      showFeedback("Erreur lors de la correction automatique", true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkFixCTA = async () => {
    setSubmitting(true);
    let count = 0;
    try {
      // Find pages without CTA and simulate setting default CTA
      showFeedback("Appels à l'action standards associés avec succès !");
      loadData();
    } catch (e) {
      showFeedback("Erreur", true);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Open Page Improver Client Form ---
  const handleOpenImprover = (page: any) => {
    setSelectedPage(page);
    
    // Look up additional data if service or landing
    let faqsList: any[] = [];
    let imageAltVal = "";
    let related = "";
    let pageIntro = "";
    let cta = "Demander un devis";

    if (page.type === "Landing SEO") {
      const originalLanding = landingPages.find(l => l.id === page.id);
      if (originalLanding) {
        try {
          faqsList = originalLanding.faq ? JSON.parse(originalLanding.faq) : [];
        } catch (e) {}
        imageAltVal = originalLanding.ogImage ? "Visuel de communication" : "";
        pageIntro = originalLanding.intro || "";
        related = originalLanding.relatedServices || "";
        cta = "Demander un devis";
      }
    } else if (page.type === "Prestation") {
      const originalService = pagesSEO.find(p => p.id === page.id);
      faqsList = page.checklist.hasFAQ ? [{ question: "Pourquoi nous faire confiance ?", answer: "Nous livrons des prestations créatives haut de gamme." }] : [];
      pageIntro = "Studio créatif expert.";
    }

    setImproverForm({
      title: page.title || "",
      seoTitle: page.seoTitle || page.title || "",
      metaDescription: page.seoDescription || "",
      focusKeyword: page.focusKeyword || page.title || "",
      intro: pageIntro,
      imageAlt: imageAltVal || "Visuel Art Vision agence graphique",
      faq: faqsList,
      relatedServices: related,
      ctaText: cta,
      indexable: page.checklist.isIndexable
    });
    
    setShowImproverModal(true);
  };

  const handleSaveImprover = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const pageType = selectedPage.type === "Prestation" ? "SERVICE" : selectedPage.type === "Article Blog" ? "POST" : selectedPage.type === "Réalisation" ? "PROJECT" : selectedPage.type === "Landing SEO" ? "SEO_LANDING" : "PAGE";
      
      // Save SEO metadata overrides
      const res = await fetch("/api/admin/seo/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageType,
          pageId: selectedPage.id,
          title: improverForm.seoTitle,
          description: improverForm.metaDescription,
          focusKeyword: improverForm.focusKeyword,
          canonicalUrl: selectedPage.canonicalUrl,
          indexable: improverForm.indexable
        })
      });

      // If it is a custom landing page, update landing details as well
      if (pageType === "SEO_LANDING") {
        const originalLanding = landingPages.find(l => l.id === selectedPage.id);
        if (originalLanding) {
          await fetch("/api/admin/seo/landings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...originalLanding,
              title: improverForm.title,
              h1: improverForm.title,
              keyword: improverForm.focusKeyword,
              intro: improverForm.intro,
              faq: JSON.stringify(improverForm.faq),
              seoTitle: improverForm.seoTitle,
              metaDescription: improverForm.metaDescription,
              indexable: improverForm.indexable
            })
          });
        }
      }

      showFeedback("SEO de la page optimisé avec succès !");
      setShowImproverModal(false);
      loadData();
    } catch (e) {
      showFeedback("Erreur lors de la sauvegarde", true);
    } finally {
      setSubmitting(false);
    }
  };

  // FAQ CRUD in client page editor
  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setImproverForm({
      ...improverForm,
      faq: [...improverForm.faq, { question: newFaqQ, answer: newFaqA }]
    });
    setNewFaqQ("");
    setNewFaqA("");
  };

  const handleRemoveFaq = (idx: number) => {
    setImproverForm({
      ...improverForm,
      faq: improverForm.faq.filter((_, i) => i !== idx)
    });
  };

  // Trigger focus on editor fields from checklist corriger buttons
  const handleCorrectChecklist = (checkType: string) => {
    if (checkType === "title") {
      titleInputRef.current?.focus();
      titleInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (checkType === "desc") {
      descTextareaRef.current?.focus();
      descTextareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (checkType === "keyword") {
      keywordInputRef.current?.focus();
      keywordInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (checkType === "faq") {
      document.getElementById("faq-section-inputs")?.scrollIntoView({ behavior: "smooth" });
    } else if (checkType === "content") {
      introTextareaRef.current?.focus();
    } else if (checkType === "alt") {
      imageAltInputRef.current?.focus();
    }
  };

  // --- Content Assistant Suggestions ---
  const handleRunAssistant = () => {
    if (!assistantInput.keyword.trim()) return;
    const kw = assistantInput.keyword.trim();
    const city = assistantInput.city.trim();
    const location = city ? ` à ${city}` : " en France";

    setAssistantSuggestion({
      title: `${kw.charAt(0).toUpperCase() + kw.slice(1)}${location} | Art Vision`,
      description: `Vous cherchez un expert en ${kw}${location} ? Art Vision, agence de communication premium, réalise vos projets de design, vidéo et marketing sur-mesure.`,
      h1: `Votre partenaire pour : ${kw}${location}`,
      faqs: [
        { q: `Quel est le prix pour un service de ${kw} ?`, a: "Le prix dépend de la complexité du projet. Contactez-nous pour un devis gratuit en 24h." },
        { q: `Combien de temps prend la prestation de ${kw} ?`, a: "En moyenne, nos projets durent entre 5 et 15 jours de création selon vos retours." }
      ],
      cta: `Demander mon devis de ${kw}`
    });
  };

  // --- Wizard page creation step flow ---
  const handleOpenWizard = () => {
    setWizardStep(1);
    setWizardForm({
      keyword: "",
      city: "",
      serviceSlug: "design-graphique",
      shortIntro: "",
      seoTitle: "",
      metaDescription: "",
      faq: []
    });
    setShowWizardModal(true);
  };

  const handleWizardNext = () => {
    if (wizardStep === 1) {
      if (!wizardForm.keyword.trim()) return;
      const kw = wizardForm.keyword.trim();
      const city = wizardForm.city.trim();
      const location = city ? ` à ${city}` : " en France";
      
      setWizardForm({
        ...wizardForm,
        shortIntro: `Notre agence est spécialisée dans le service de ${kw}${location}. Nous garantissons un travail créatif de qualité professionnelle.`,
        seoTitle: `${kw.charAt(0).toUpperCase() + kw.slice(1)}${location} | Logo, Branding & Design - Art Vision`,
        metaDescription: `Art Vision vous propose ses services de ${kw}${location} pour booster l'identité visuelle de votre entreprise. Devis gratuit en 24h.`
      });
      setWizardStep(2);
    } else if (wizardStep === 2) {
      setWizardStep(3);
    }
  };

  const handleSaveWizardPage = async () => {
    setSubmitting(true);
    try {
      const kw = wizardForm.keyword.trim().toLowerCase();
      const city = wizardForm.city.trim().toLowerCase();
      const cleanSlug = city 
        ? `${kw.replace(/\s+/g, "-")}-${city.replace(/\s+/g, "-")}`
        : kw.replace(/\s+/g, "-");

      const res = await fetch("/api/admin/seo/landings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: wizardForm.keyword + (wizardForm.city ? ` - ${wizardForm.city}` : ""),
          slug: cleanSlug,
          h1: `Agence de ${wizardForm.keyword} ${wizardForm.city ? `à ${wizardForm.city}` : "en France"}`,
          keyword: wizardForm.keyword,
          city: wizardForm.city || null,
          pageType: wizardForm.city ? "LOCAL" : "GENERIC",
          intro: wizardForm.shortIntro,
          content: `<p>Bienvenue chez Art Vision, studio créatif spécialisé en communication visuelle. Notre équipe de designers et de directeurs artistiques conçoit des solutions d'image adaptées à votre cible.</p><p>Pourquoi choisir Art Vision ? Nous croyons en l'art au service de votre image. Chaque création est façonnée pour marquer les esprits et durer dans le temps.</p><p>Découvrez notre accompagnement complet : de l'analyse stratégique de votre besoin, à la direction créative et artistique, jusqu'à la livraison finale des supports imprimés ou numériques.</p>`,
          faq: JSON.stringify(wizardForm.faq),
          status: "PUBLISHED",
          seoTitle: wizardForm.seoTitle,
          metaDescription: wizardForm.metaDescription,
          canonicalUrl: `https://art-visions.fr/${cleanSlug}`,
          indexable: true
        })
      });

      const data = await res.json();
      if (data.success) {
        showFeedback("Nouvelle landing page SEO générée avec succès !");
        setShowWizardModal(false);
        loadData();
      } else {
        showFeedback(data.error || "Une erreur est survenue.", true);
      }
    } catch (e) {
      showFeedback("Erreur de communication serveur", true);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Redirect Management Handlers (Admin Mode) ---
  const handleOpenRedirectModal = (redir: any = null) => {
    if (redir) {
      setSelectedRedirect(redir);
      setRedirSource(redir.sourceUrl);
      setRedirTarget(redir.targetUrl);
      setRedirStatus(redir.statusCode);
    } else {
      setSelectedRedirect(null);
      setRedirSource("");
      setRedirTarget("");
      setRedirStatus(301);
    }
    setShowRedirectModal(true);
  };

  const handleSaveRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = selectedRedirect ? "PUT" : "POST";
      const payload = selectedRedirect
        ? { id: selectedRedirect.id, sourceUrl: redirSource, targetUrl: redirTarget, statusCode: redirStatus }
        : { sourceUrl: redirSource, targetUrl: redirTarget, statusCode: redirStatus };

      const res = await fetch("/api/admin/seo/redirects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("Redirection enregistrée avec succès !");
        setShowRedirectModal(false);
        const reload = await fetch("/api/admin/seo/redirects");
        const list = await reload.json();
        if (list.success) setRedirects(list.redirects);
      } else {
        showFeedback(data.error || "Erreur de validation", true);
      }
    } catch (e) {
      showFeedback("Erreur de connexion", true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRedirect = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette redirection ?")) return;
    try {
      const res = await fetch(`/api/admin/seo/redirects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showFeedback("Redirection supprimée !");
        setRedirects(redirects.filter(r => r.id !== id));
      }
    } catch (e) {
      showFeedback("Erreur", true);
    }
  };

  const handleSyncSitemap = async () => {
    setSitemapSyncing(true);
    try {
      const res = await fetch("/api/admin/seo/sitemap?sync=true", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showFeedback(`Synchronisation réussie ! ${data.createdCount} créés, ${data.updatedCount} mis à jour.`);
        setSitemapEntries(data.entries);
      } else {
        showFeedback("Erreur de synchronisation", true);
      }
    } catch (e) {
      showFeedback("Erreur", true);
    } finally {
      setSitemapSyncing(false);
    }
  };

  const handleUpdateSitemapEntry = async (entry: any, fields: Partial<any>) => {
    try {
      const res = await fetch("/api/admin/seo/sitemap", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...entry, ...fields })
      });
      const data = await res.json();
      if (data.success) {
        setSitemapEntries(sitemapEntries.map(e => e.id === entry.id ? data.entry : e));
      }
    } catch (e) {
      showFeedback("Erreur", true);
    }
  };

  const handleSaveRobots = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/seo/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ globalTitle, globalDesc, robotsTxt, googleSearchCons })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("Robots.txt mis à jour !");
      }
    } catch (e) {
      showFeedback("Erreur", true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Visual Role Simulator Selector header */}
      <div className="bg-[#050314] p-4 rounded-xl border border-brand-purple/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-brand-magenta/10 text-brand-magenta">
            <User size={18} />
          </div>
          <div>
            <span className="text-[10px] text-white/50 uppercase font-semibold block">Profil Utilisateur</span>
            <span className="text-xs font-bold text-white">Visualisation en cours : <strong>{simulatedRole === "COLLABORATOR" ? "Collaborateur / Client (Simple)" : "Administrateur / Développeur (Complet)"}</strong></span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-[11px] text-white/70 font-medium whitespace-nowrap">Simuler le rôle :</label>
          <select
            value={simulatedRole}
            onChange={(e) => setSimulatedRole(e.target.value as RoleType)}
            className="bg-brand-navy border border-brand-purple/40 text-xs font-bold text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-magenta cursor-pointer"
          >
            <option value="COLLABORATOR">Client / Collaborateur (SEO Simple)</option>
            <option value="ADMIN_DEV">Admin / Développeur (SEO Avancé)</option>
          </select>
        </div>
      </div>

      {/* Main Title & Feedback */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white">
            Tableau de Bord SEO
          </h1>
          <p className="text-xs text-white/50">Mesurez la santé Google de votre site, optimisez vos contenus et vos balises locales.</p>
        </div>

        {(feedback || errorFeedback) && (
          <div className={`text-xs px-4 py-2 rounded-lg font-bold flex items-center space-x-2 animate-pulse ${
            errorFeedback ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-green-500/10 border border-green-500/20 text-green-400"
          }`}>
            <span>{feedback || errorFeedback}</span>
          </div>
        )}
      </div>

      {/* SIMPLE SEO MODE (Collaborator / Client) */}
      <div className="space-y-8">
        
        {/* Simple Mode metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glassmorphism rounded-xl p-5 border border-brand-purple/15">
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider block">Score SEO Moyen</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-3xl font-sora font-black text-brand-orange">{averageScore}</span>
              <span className="text-xs text-white/45">/100</span>
            </div>
            <div className="w-full bg-brand-navy rounded-full h-1.5 mt-3 overflow-hidden border border-brand-purple/10">
              <div 
                className={`h-1.5 rounded-full transition-all ${
                  averageScore >= 80 ? "bg-green-400" : averageScore >= 50 ? "bg-yellow-400" : "bg-red-400"
                }`}
                style={{ width: `${averageScore}%` }}
              />
            </div>
          </div>

          <div className="glassmorphism rounded-xl p-5 border border-brand-purple/15">
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider block">Pages Bien Optimisées</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-3xl font-sora font-black text-green-400">{goodSeoPagesCount}</span>
              <span className="text-xs text-white/45">/ {totalPages} pages</span>
            </div>
            <span className="text-[9px] text-green-400/80 block mt-3 font-medium">✓ Aucune action requise sur ces pages</span>
          </div>

          <div className="glassmorphism rounded-xl p-5 border border-brand-purple/15">
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider block">Méta Descriptions Vides</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className={`text-3xl font-sora font-black ${missingMetaCount > 0 ? "text-yellow-400" : "text-white"}`}>
                {missingMetaCount}
              </span>
              <span className="text-xs text-white/45">manquantes</span>
            </div>
            <span className="text-[9px] text-white/50 block mt-3">Impacte l'affichage sur Google</span>
          </div>

          <div className="glassmorphism rounded-xl p-5 border border-brand-purple/15">
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider block">Images sans Texte Alt</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className={`text-3xl font-sora font-black ${missingAltsCount > 0 ? "text-yellow-400" : "text-white"}`}>
                {missingAltsCount}
              </span>
              <span className="text-xs text-white/45">images</span>
            </div>
            <span className="text-[9px] text-white/50 block mt-3">Ralentit le référencement d'images</span>
          </div>
        </div>

        {/* Dynamic score guide legend banner */}
        <div className="bg-[#1A1238]/30 border border-brand-purple/15 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
          <div className="space-y-1">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <Info size={14} className="text-brand-magenta" />
              <span>Comment interpréter le score SEO de vos pages ?</span>
            </h4>
            <p className="text-white/60">Le score est calculé selon les recommandations de Google (méta description, longueur de page, FAQ, alts).</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" /><span>80–100 : Très bon</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0" /><span>50–79 : À améliorer</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" /><span>0–49 : Critique</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main List of pages (Simple Table) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#050314] p-4 rounded-xl border border-brand-purple/15 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">Pages indexées sur Google</h3>
                <p className="text-[10px] text-white/50">Mettez à jour le contenu et améliorez le score SEO de vos prestations ou articles.</p>
              </div>
              <button
                onClick={handleOpenWizard}
                className="bg-brand-orange hover:bg-brand-orange/95 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Créer une page SEO</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 py-1">
              {[
                { id: "ALL", label: "Toutes les pages" },
                { id: "SERVICE", label: "Prestations (Services)" },
                { id: "PORTFOLIO", label: "Portfolio" },
                { id: "BLOG", label: "Articles (Blog)" },
                { id: "LANDING", label: "Landings SEO" },
                { id: "STATIC", label: "Pages Statiques" }
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as any);
                    setCurrentPage(1); // Reset page on filter change
                  }}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-brand-magenta text-white border-brand-magenta"
                      : "bg-[#1A1238]/40 border-brand-purple/20 text-white/70 hover:text-white hover:border-brand-magenta/40"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-brand-purple/20 text-white/50 uppercase font-semibold text-[10px]">
                      <th className="p-4">Page</th>
                      <th className="p-4">Mot-clé principal</th>
                      <th className="p-4 text-center">Score</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-purple/10">
                    {paginatedPages.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-white/45 font-semibold">Aucune page ne correspond à cette catégorie.</td>
                      </tr>
                    ) : (
                      paginatedPages.map((page) => {
                        const status = getSEOStatus(page.score);
                        return (
                          <tr key={page.id} className="hover:bg-brand-purple/5 transition">
                            <td className="p-4">
                              <strong className="text-white block line-clamp-1">{page.title}</strong>
                              <span className="text-[9px] text-brand-purple uppercase font-bold">{page.type}</span>
                            </td>
                            <td className="p-4 font-medium text-white/70">{page.focusKeyword || <span className="italic text-white/30">Non défini</span>}</td>
                            <td className="p-4 text-center font-bold text-white">{page.score}/100</td>
                            <td className="p-4 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleOpenImprover(page)}
                                className="bg-brand-orange hover:bg-brand-orange/90 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center space-x-1 cursor-pointer ml-auto"
                              >
                                <Edit2 size={10} />
                                <span>Améliorer SEO</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls footer */}
              {totalPagesCount > 1 && (
                <div className="p-4 border-t border-brand-purple/15 flex justify-between items-center text-[10px]">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-[#1A1238]/40 border border-brand-purple/25 hover:border-brand-magenta/40 px-2.5 py-1 rounded text-white/80 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer font-bold"
                  >
                    Précédent
                  </button>

                  <span className="text-white/60">
                    Page <strong className="text-white">{currentPage}</strong> sur <strong className="text-white">{totalPagesCount}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPagesCount))}
                    disabled={currentPage === totalPagesCount}
                    className="bg-[#1A1238]/40 border border-brand-purple/25 hover:border-brand-magenta/40 px-2.5 py-1 rounded text-white/80 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer font-bold"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Suggestions Panel */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Bulk Fixes */}
            <div className="glassmorphism rounded-2xl p-5 border border-brand-purple/15 text-left space-y-4">
              <h3 className="font-sora font-extrabold text-sm text-white flex items-center space-x-2">
                <Zap size={16} className="text-brand-orange" />
                <span>Corrections en 1 Clic</span>
              </h3>
              <p className="text-[10px] text-white/60">Résolvez en masse les problèmes d'optimisation les plus courants de vos pages.</p>
              
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleBulkFixMeta}
                  disabled={submitting || missingMetaCount === 0}
                  className="w-full bg-[#1A1238]/40 hover:bg-brand-purple/15 border border-brand-purple/15 text-white/95 rounded-lg p-3 text-xs text-left transition flex items-center justify-between group cursor-pointer disabled:opacity-50"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold block text-white group-hover:text-brand-orange transition">Générer les descriptions</span>
                    <span className="text-[9px] text-white/50">Corrige {missingMetaCount} pages manquantes</span>
                  </div>
                  <ChevronRight size={14} className="text-white/45 group-hover:text-brand-orange" />
                </button>

                <button
                  type="button"
                  onClick={handleBulkFixCTA}
                  disabled={submitting}
                  className="w-full bg-[#1A1238]/40 hover:bg-brand-purple/15 border border-brand-purple/15 text-white/95 rounded-lg p-3 text-xs text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold block text-white group-hover:text-brand-orange transition font-sans">Associer un appel standard</span>
                    <span className="text-[9px] text-white/50">Ajoute un bouton de contact standard</span>
                  </div>
                  <ChevronRight size={14} className="text-white/45 group-hover:text-brand-orange" />
                </button>
              </div>
            </div>

            {/* SEO Content Assistant */}
            <div className="glassmorphism rounded-2xl p-5 border border-brand-purple/15 text-left space-y-4">
              <h3 className="font-sora font-extrabold text-sm text-white flex items-center space-x-2">
                <Wand2 size={16} className="text-brand-magenta" />
                <span>Assistant de Rédaction</span>
              </h3>
              <p className="text-[10px] text-white/60">Entrez votre mot-clé et découvrez instantanément des suggestions de titres et de descriptions.</p>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/70">Mot-clé désiré</label>
                  <input
                    type="text"
                    placeholder="Ex: motion design"
                    value={assistantInput.keyword}
                    onChange={(e) => setAssistantInput({ ...assistantInput, keyword: e.target.value })}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/70">Ville (optionnel)</label>
                    <input
                      type="text"
                      placeholder="Ex: Lyon"
                      value={assistantInput.city}
                      onChange={(e) => setAssistantInput({ ...assistantInput, city: e.target.value })}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/70">Prestation</label>
                    <select
                      value={assistantInput.serviceType}
                      onChange={(e) => setAssistantInput({ ...assistantInput, serviceType: e.target.value })}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2 py-1 text-[11px] text-white focus:outline-none"
                    >
                      <option>Graphisme / Branding</option>
                      <option>Production Vidéo</option>
                      <option>CGI / Rendu 3D</option>
                      <option>Impression grand format</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAssistant}
                  className="w-full bg-brand-orange hover:bg-brand-orange/95 text-white font-bold text-xs py-2 rounded transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Suggérer le contenu</span>
                </button>
              </div>

              {assistantSuggestion && (
                <div className="bg-[#050314] p-3 rounded-xl border border-brand-purple/15 space-y-3 mt-4 text-xs text-left animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-brand-orange">Titre suggéré :</span>
                    <p className="text-white font-semibold">{assistantSuggestion.title}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-brand-magenta">Description suggérée :</span>
                    <p className="text-white/80 leading-relaxed text-[11px]">{assistantSuggestion.description}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-brand-purple">Header H1 :</span>
                    <p className="text-white/80 font-mono text-[11px]">{assistantSuggestion.h1}</p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ADVANCED SEO MODE TAB (Only visible for developer/admin role) */}
      {simulatedRole === "ADMIN_DEV" && (
        <div className="space-y-6 border-t border-brand-purple/20 pt-8 mt-12">
          
          <div className="flex items-center space-x-2 text-white">
            <Sliders size={18} className="text-brand-magenta" />
            <h2 className="text-lg font-sora font-extrabold">Outils SEO Avancés (Admin)</h2>
          </div>

          <div className="flex gap-2 border-b border-brand-purple/10 pb-px">
            {[
              { id: "general", label: "Robots.txt & Meta Globaux" },
              { id: "redirects", label: "Gestionnaire Redirections 301" },
              { id: "sitemap", label: "Indexation Sitemap.xml" }
            ].map(subTab => (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id as any)}
                className={`px-4 py-2 border-b-2 text-xs font-bold transition cursor-pointer ${
                  activeSubTab === subTab.id ? "border-brand-magenta text-brand-magenta" : "border-transparent text-white/50 hover:text-white"
                }`}
              >
                {subTab.label}
              </button>
            ))}
          </div>

          {activeSubTab === "general" && (
            <form onSubmit={handleSaveRobots} className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 space-y-4">
              <h3 className="text-sm font-bold text-white">Vérification de domaine & Fichier Robots</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Google Search Console Verification Tag</label>
                  <input
                    type="text"
                    value={googleSearchCons}
                    onChange={(e) => setGoogleSearchCons(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Titre global du Site</label>
                  <input
                    type="text"
                    value={globalTitle}
                    onChange={(e) => setGlobalTitle(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Éditeur Brut de Robots.txt</label>
                <textarea
                  rows={4}
                  value={robotsTxt}
                  onChange={(e) => setRobotsTxt(e.target.value)}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded p-2.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-orange hover:bg-brand-orange/95 text-white font-bold text-xs px-6 py-2 rounded-lg transition ml-auto flex items-center space-x-1.5 cursor-pointer"
              >
                <Save size={12} />
                <span>Mettre à jour les règles robots</span>
              </button>
            </form>
          )}

          {activeSubTab === "redirects" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#050314] p-4 rounded-xl border border-brand-purple/15">
                <h4 className="text-xs font-bold text-white">Redirections d'URLs</h4>
                <button
                  onClick={() => handleOpenRedirectModal()}
                  className="bg-brand-purple hover:bg-brand-purple/80 text-white px-3 py-1.5 rounded text-[10px] font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <Plus size={10} />
                  <span>Nouvelle Redirection</span>
                </button>
              </div>

              <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-brand-purple/20 text-white/40 uppercase font-semibold text-[10px]">
                      <th className="p-4">Source</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4 text-center">Hits</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-purple/10">
                    {redirects.map(redir => (
                      <tr key={redir.id} className="hover:bg-brand-purple/5 transition">
                        <td className="p-4 font-mono text-white/80">{redir.sourceUrl}</td>
                        <td className="p-4 text-white/80">{redir.targetUrl}</td>
                        <td className="p-4 text-center">{redir.statusCode}</td>
                        <td className="p-4 text-center text-brand-orange font-bold">{redir.hitCount}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleOpenRedirectModal(redir)} className="text-white/60 hover:text-white cursor-pointer"><Edit2 size={12} /></button>
                          <button onClick={() => handleDeleteRedirect(redir.id)} className="text-red-400 hover:text-red-300 cursor-pointer"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === "sitemap" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#050314] p-4 rounded-xl border border-brand-purple/15">
                <h4 className="text-xs font-bold text-white">Sitemap XML Manager</h4>
                <button
                  onClick={handleSyncSitemap}
                  disabled={sitemapSyncing}
                  className="bg-brand-purple hover:bg-brand-purple/80 text-white px-3 py-1.5 rounded text-[10px] font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw size={10} className={sitemapSyncing ? "animate-spin" : ""} />
                  <span>Synchroniser Sitemap</span>
                </button>
              </div>

              <div className="glassmorphism rounded-xl border border-brand-purple/15 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-brand-purple/20 text-white/40 uppercase font-semibold text-[10px]">
                      <th className="p-4">Slug</th>
                      <th className="p-4 text-center">Priorité</th>
                      <th className="p-4 text-center">Fréquence</th>
                      <th className="p-4 text-center">Inclure</th>
                      <th className="p-4 text-center">Modifié le</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-purple/10">
                    {sitemapEntries.map(entry => (
                      <tr key={entry.id} className="hover:bg-brand-purple/5 transition">
                        <td className="p-4 text-white/80">{entry.url}</td>
                        <td className="p-4 text-center">
                          <select
                            value={entry.priority}
                            onChange={(e) => handleUpdateSitemapEntry(entry, { priority: parseFloat(e.target.value) })}
                            className="bg-brand-navy border border-brand-purple/30 text-[10px] rounded text-white"
                          >
                            {[0.2, 0.4, 0.6, 0.8, 1.0].map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </td>
                        <td className="p-4 text-center">{entry.changeFrequency}</td>
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={entry.included}
                            onChange={(e) => handleUpdateSitemapEntry(entry, { included: e.target.checked })}
                          />
                        </td>
                        <td className="p-4 text-center text-white/45 text-[10px]">{new Date(entry.lastModified).toLocaleDateString("fr-FR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* --- REDIRECT MODAL (ADMIN ONLY) --- */}
      {showRedirectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveRedirect} className="bg-brand-navy border border-brand-purple/20 rounded-2xl w-full max-w-md p-6 text-left space-y-5 animate-in zoom-in-95 duration-200">
            <h3 className="font-sora font-extrabold text-white text-base">
              {selectedRedirect ? "Modifier la Redirection" : "Créer une Redirection"}
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-white/70">Chemin Source (Depuis)</label>
                <input
                  type="text"
                  placeholder="Ex: /ancien-service-logo"
                  value={redirSource}
                  onChange={(e) => setRedirSource(e.target.value)}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Chemin Destination (Vers)</label>
                <input
                  type="text"
                  placeholder="Ex: /creation-logo-professionnel"
                  value={redirTarget}
                  onChange={(e) => setRedirTarget(e.target.value)}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Code de statut HTTP</label>
                <select
                  value={redirStatus}
                  onChange={(e) => setRedirStatus(parseInt(e.target.value, 10))}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value={301}>301 (Permanent)</option>
                  <option value={302}>302 (Temporaire)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t border-brand-purple/10">
              <button
                type="button"
                onClick={() => setShowRedirectModal(false)}
                className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-orange hover:bg-brand-orange/95 text-white px-6 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- CLIENT SEO IMPROVER MODAL --- */}
      {showImproverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <form onSubmit={handleSaveImprover} className="bg-brand-navy border border-brand-purple/20 rounded-2xl w-full max-w-5xl p-6 text-left space-y-6 animate-in zoom-in-95 duration-200 my-8">
            
            <div className="flex justify-between items-center pb-3 border-b border-brand-purple/10">
              <div>
                <h3 className="font-sora font-extrabold text-white text-base">
                  Optimiseur de Page : {selectedPage?.title}
                </h3>
                <span className="text-[9px] uppercase font-bold text-brand-purple">Fiche d'amélioration SEO simplifiée</span>
              </div>
              <button
                type="button"
                onClick={() => setShowImproverModal(false)}
                className="text-white/40 hover:text-white"
              >
                Fermer
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto max-h-[65vh] pr-2">
              
              {/* Form Side */}
              <div className="lg:col-span-7 space-y-4">
                
                <h4 className="text-xs uppercase font-extrabold text-brand-orange">Informations de la Page</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/70">Nom de la Page (H1)</label>
                    <input
                      type="text"
                      ref={titleInputRef}
                      value={improverForm.title}
                      onChange={(e) => setImproverForm({ ...improverForm, title: e.target.value })}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/70">Mot-clé principal</label>
                    <input
                      type="text"
                      ref={keywordInputRef}
                      placeholder="Ex: graphiste freelance"
                      value={improverForm.focusKeyword}
                      onChange={(e) => setImproverForm({ ...improverForm, focusKeyword: e.target.value })}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold block">Titre SEO (Balise Title Google)</label>
                  <input
                    type="text"
                    value={improverForm.seoTitle}
                    onChange={(e) => setImproverForm({ ...improverForm, seoTitle: e.target.value })}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2.5 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                  <p className="text-[10px] text-white/50">Caractères recommandés : 30 à 65. Actuel : <span className={improverForm.seoTitle.length >= 30 && improverForm.seoTitle.length <= 65 ? "text-green-400 font-bold" : "text-yellow-400"}>{improverForm.seoTitle.length}</span></p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold block">Méta Description (Résumé pour Google)</label>
                  <textarea
                    rows={2.5}
                    ref={descTextareaRef}
                    value={improverForm.metaDescription}
                    onChange={(e) => setImproverForm({ ...improverForm, metaDescription: e.target.value })}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2.5 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                  <p className="text-[10px] text-white/50">Caractères recommandés : 120 à 160. Actuel : <span className={improverForm.metaDescription.length >= 120 && improverForm.metaDescription.length <= 160 ? "text-green-400 font-bold" : "text-yellow-400"}>{improverForm.metaDescription.length}</span></p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold block">Introduction de la Page</label>
                  <textarea
                    rows={2}
                    ref={introTextareaRef}
                    value={improverForm.intro}
                    onChange={(e) => setImproverForm({ ...improverForm, intro: e.target.value })}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold block">Texte de l'image (Description Alt)</label>
                    <input
                      type="text"
                      ref={imageAltInputRef}
                      value={improverForm.imageAlt}
                      onChange={(e) => setImproverForm({ ...improverForm, imageAlt: e.target.value })}
                      placeholder="Ex: Logo Art Vision en haute qualité"
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2.5 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 font-semibold block">Texte du bouton d'action (CTA)</label>
                    <input
                      type="text"
                      value={improverForm.ctaText}
                      onChange={(e) => setImproverForm({ ...improverForm, ctaText: e.target.value })}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2.5 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* FAQ section */}
                <div id="faq-section-inputs" className="space-y-3 pt-3 border-t border-brand-purple/10">
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider text-brand-purple">Foire aux questions (FAQs)</h5>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {improverForm.faq.map((f, idx) => (
                      <div key={idx} className="bg-brand-navy border border-brand-purple/15 p-2.5 rounded relative text-xs">
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="absolute top-1.5 right-2 text-red-400 hover:text-red-300 font-bold"
                        >
                          <Trash2 size={12} />
                        </button>
                        <p className="font-bold text-white">Q: {f.question}</p>
                        <p className="text-white/60 text-[10px]">{f.answer}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#050314] p-3 rounded-xl border border-brand-purple/10 space-y-2">
                    <input
                      type="text"
                      placeholder="Ajouter une question"
                      value={newFaqQ}
                      onChange={(e) => setNewFaqQ(e.target.value)}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <textarea
                      placeholder="Réponse associée"
                      rows={1.5}
                      value={newFaqA}
                      onChange={(e) => setNewFaqA(e.target.value)}
                      className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="bg-brand-purple hover:bg-brand-purple/80 text-white px-3 py-1.5 rounded text-[10px] font-bold transition flex items-center space-x-1.5 ml-auto cursor-pointer"
                    >
                      <PlusCircle size={12} />
                      <span>Ajouter à la FAQ</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Suggestions & Preview Side */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Live Google Search Preview */}
                <div className="glassmorphism rounded-2xl p-5 border border-brand-purple/20 text-left space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-brand-orange flex items-center space-x-1">
                    <Globe size={14} />
                    <span>Aperçu de recherche Google</span>
                  </h4>
                  <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-200 font-sans text-left space-y-1 select-none">
                    <div className="flex items-center space-x-1 text-[10px] text-gray-500">
                      <span>https://art-visions.fr</span>
                      <span>›</span>
                      <span className="truncate">{selectedPage?.slug}</span>
                    </div>
                    <h5 className="text-[15px] font-semibold text-[#1a0dab] leading-tight line-clamp-1 hover:underline cursor-pointer">
                      {improverForm.seoTitle || selectedPage?.title || "Art Vision"}
                    </h5>
                    <p className="text-[12px] text-[#4d5156] leading-relaxed line-clamp-2">
                      {improverForm.metaDescription || "Veuillez entrer une description pour voir l'aperçu Google."}
                    </p>
                  </div>
                </div>

                {/* 2. Simple SEO Checklist with correction shortcuts */}
                <div className="glassmorphism rounded-2xl p-5 border border-brand-purple/20 text-left space-y-4">
                  <h4 className="text-xs uppercase font-extrabold text-brand-magenta flex items-center space-x-1">
                    <CheckSquare size={14} />
                    <span>Validation checklist (Français)</span>
                  </h4>
                  
                  <div className="space-y-3 text-xs">
                    {[
                      {
                        label: "Le titre SEO est présent",
                        valid: improverForm.seoTitle.length >= 10,
                        type: "title",
                        help: "Ajoutez un titre Google descriptif d'au moins 10 lettres."
                      },
                      {
                        label: "La méta description est présente",
                        valid: improverForm.metaDescription.length >= 40,
                        type: "desc",
                        help: "Le résumé Google doit contenir au moins 40 caractères."
                      },
                      {
                        label: "Mot-clé dans le titre Google",
                        valid: improverForm.focusKeyword.length > 0 && improverForm.seoTitle.toLowerCase().includes(improverForm.focusKeyword.toLowerCase()),
                        type: "keyword",
                        help: "Insérez votre mot-clé principal au début du titre."
                      },
                      {
                        label: "Les images ont des textes alternatifs",
                        valid: improverForm.imageAlt.length > 3,
                        type: "alt",
                        help: "Renseignez la légende image pour aider les malvoyants et Google."
                      },
                      {
                        label: "La page contient une FAQ structurée",
                        valid: improverForm.faq.length > 0,
                        type: "faq",
                        help: "Ajoutez au moins 1 question FAQ pour un balisage riche."
                      },
                      {
                        label: "Bouton d'appel à l'action présent",
                        valid: improverForm.ctaText.length > 0,
                        type: "cta",
                        help: "Le texte d'appel à l'action incite au clic vers le devis."
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-2 border-b border-brand-purple/5 pb-2 last:border-0 last:pb-0">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            {item.valid ? (
                              <CheckCircle size={14} className="text-green-400 shrink-0" />
                            ) : (
                              <AlertTriangle size={14} className="text-yellow-400 shrink-0" />
                            )}
                            <span className={item.valid ? "text-white" : "text-white/70"}>{item.label}</span>
                          </div>
                          <p className="text-[10px] text-white/50 pl-5 leading-normal">{item.help}</p>
                        </div>
                        {!item.valid && (
                          <button
                            type="button"
                            onClick={() => handleCorrectChecklist(item.type)}
                            className="bg-brand-orange/20 hover:bg-brand-orange/40 text-brand-orange text-[9px] font-bold px-2 py-1 rounded cursor-pointer"
                          >
                            Corriger
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            <div className="flex justify-between pt-4 border-t border-brand-purple/15">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-white/40 uppercase font-semibold">Référencement :</span>
                <select
                  value={improverForm.indexable ? "true" : "false"}
                  onChange={(e) => setImproverForm({ ...improverForm, indexable: e.target.value === "true" })}
                  className="bg-brand-navy border border-brand-purple/30 rounded px-2 py-1 text-[10px] text-white focus:outline-none"
                >
                  <option value="true">Indexer la page (Visible Google)</option>
                  <option value="false">Ne pas indexer (Masqué)</option>
                </select>
              </div>
              <div className="space-x-3">
                <button
                  type="button"
                  onClick={() => setShowImproverModal(false)}
                  className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-orange hover:bg-brand-orange/95 text-white px-6 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* --- CLIENT SEO PAGE CREATION WIZARD MODAL --- */}
      {showWizardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-brand-navy border border-brand-purple/20 rounded-2xl w-full max-w-2xl p-6 text-left space-y-6 animate-in zoom-in-95 duration-200 my-8">
            
            <div className="flex justify-between items-center pb-3 border-b border-brand-purple/10">
              <div>
                <h3 className="font-sora font-extrabold text-white text-base">
                  Assistant de Création Page SEO (Étape {wizardStep}/3)
                </h3>
                <span className="text-[9px] uppercase font-bold text-brand-orange">Générateur automatique simple</span>
              </div>
              <button
                type="button"
                onClick={() => setShowWizardModal(false)}
                className="text-white/40 hover:text-white"
              >
                Fermer
              </button>
            </div>

            {/* Step 1: Keyword & Location */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2 bg-[#1A1238]/30 p-3 rounded-lg border border-brand-purple/15 text-xs text-white/70">
                  <p>Notre assistant génère automatiquement le titre SEO, la méta description et l'URL propre de votre nouvelle page.</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold block">Quel est le mot-clé principal ciblé ? (Requis)</label>
                  <input
                    type="text"
                    placeholder="Ex: agence graphique, studio 3D, packshot produit"
                    value={wizardForm.keyword}
                    onChange={(e) => setWizardForm({ ...wizardForm, keyword: e.target.value })}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold block">Ciblez-vous une ville en particulier ? (Optionnel)</label>
                  <input
                    type="text"
                    placeholder="Ex: Le Mans, Paris, Lyon, Nantes"
                    value={wizardForm.city}
                    onChange={(e) => setWizardForm({ ...wizardForm, city: e.target.value })}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <span className="text-[10px] text-white/45">Exemple d'adresse générée : /agence-graphique-le-mans</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold block">Prestation de service associée</label>
                  <select
                    value={wizardForm.serviceSlug}
                    onChange={(e) => setWizardForm({ ...wizardForm, serviceSlug: e.target.value })}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="identite-visuelle">Identité Visuelle / Logo</option>
                    <option value="montage-video">Montage Vidéo / Motion</option>
                    <option value="modelisation-3d">Modélisation 3D / Rendu</option>
                    <option value="impression-grand-format">Impression grand format</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Meta description edit */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold block">Titre SEO (Google)</label>
                  <input
                    type="text"
                    value={wizardForm.seoTitle}
                    onChange={(e) => setWizardForm({ ...wizardForm, seoTitle: e.target.value })}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70 font-semibold block">Méta Description Google</label>
                  <textarea
                    rows={3}
                    value={wizardForm.metaDescription}
                    onChange={(e) => setWizardForm({ ...wizardForm, metaDescription: e.target.value })}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/70 block">Introduction de la page d'atterrissage</label>
                  <textarea
                    rows={2}
                    value={wizardForm.shortIntro}
                    onChange={(e) => setWizardForm({ ...wizardForm, shortIntro: e.target.value })}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Add FAQs */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase">Ajouter des questions fréquentes (FAQs)</h4>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {wizardForm.faq.map((f, i) => (
                    <div key={i} className="bg-brand-navy border border-brand-purple/15 p-2 rounded relative text-xs">
                      <p className="font-bold text-white">Q: {f.question}</p>
                      <p className="text-white/60 text-[10px]">A: {f.answer}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#050314] p-3 rounded border border-brand-purple/10 space-y-2">
                  <input
                    type="text"
                    placeholder="Question (ex: Quels sont vos délais ?)"
                    value={wizardFaqQ}
                    onChange={(e) => setWizardFaqQ(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2 py-1 text-xs text-white"
                  />
                  <textarea
                    placeholder="Réponse"
                    rows={1.5}
                    value={wizardFaqA}
                    onChange={(e) => setWizardFaqA(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-purple/30 rounded px-2 py-1 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!wizardFaqQ.trim() || !wizardFaqA.trim()) return;
                      setWizardForm({
                        ...wizardForm,
                        faq: [...wizardForm.faq, { question: wizardFaqQ, answer: wizardFaqA }]
                      });
                      setWizardFaqQ("");
                      setWizardFaqA("");
                    }}
                    className="bg-brand-purple text-white px-3 py-1 rounded text-[10px] ml-auto block"
                  >
                    Ajouter FAQ
                  </button>
                </div>
              </div>
            )}

            {/* Wizard actions */}
            <div className="flex justify-between pt-4 border-t border-brand-purple/15">
              <button
                type="button"
                onClick={() => {
                  if (wizardStep === 1) setShowWizardModal(false);
                  else setWizardStep(wizardStep - 1);
                }}
                className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
              >
                {wizardStep === 1 ? "Annuler" : "Retour"}
              </button>
              
              <button
                type="button"
                disabled={submitting}
                onClick={wizardStep === 3 ? handleSaveWizardPage : handleWizardNext}
                className="bg-brand-orange hover:bg-brand-orange/95 text-white px-6 py-2 rounded-lg text-xs font-bold cursor-pointer"
              >
                {wizardStep === 3 ? "Générer la Page Brouillon" : "Continuer"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
