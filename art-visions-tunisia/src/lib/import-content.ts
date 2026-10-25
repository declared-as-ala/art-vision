import "server-only";
import { newBlock, type Block, type BlockType } from "@/lib/blocks";
import type { Kind, Lang } from "@/lib/content-kinds";
import { SERVICES } from "@/content/services";
import { ARTICLES, ARTICLE_KEYWORDS } from "@/content/blog";
import { PROJECTS } from "@/content/portfolio";

/**
 * Turns code-defined pages into editable builder blocks. The copy is created as a DRAFT:
 * the code version stays live until the editor publishes their version, which then takes over.
 */

export type Importable = { group: string; label: string; kind: Kind; lang: Lang; slug: string; publicPath: string };
export type Imported = { title: string; blocks: Block[]; seoTitle: string; metaDescription: string; keyword: string; category?: string; schemaType: string };

const mk = (type: BlockType, data: Record<string, unknown> = {}, bg?: Block["style"]["bg"]): Block => {
  const b = newBlock(type);
  Object.assign(b.data, data);
  if (bg) b.style.bg = bg;
  return b;
};

export function listImportables(): Importable[] {
  const out: Importable[] = [
    { group: "Pages principales", label: "Accueil (FR)", kind: "page", lang: "fr", slug: "home", publicPath: "/" },
    { group: "Pages principales", label: "Accueil (AR)", kind: "page", lang: "ar", slug: "home", publicPath: "/ar" },
    { group: "Pages principales", label: "Contact / devis (FR)", kind: "page", lang: "fr", slug: "contact", publicPath: "/contact" },
    { group: "Pages principales", label: "Contact / devis (AR)", kind: "page", lang: "ar", slug: "contact", publicPath: "/ar/contact" },
  ];
  for (const s of SERVICES) {
    out.push({ group: "Services", label: `${s.fr.name} (FR)`, kind: "service", lang: "fr", slug: s.slugs.fr, publicPath: `/services/${s.slugs.fr}` });
    out.push({ group: "Services", label: `${s.ar.name} (AR)`, kind: "service", lang: "ar", slug: s.slugs.ar, publicPath: `/ar/services/${s.slugs.ar}` });
  }
  for (const a of ARTICLES) out.push({ group: "Articles de blog", label: a.title, kind: "article", lang: "fr", slug: a.slug, publicPath: `/blog/${a.slug}` });
  for (const p of PROJECTS) out.push({ group: "Portfolio", label: p.title, kind: "project", lang: "fr", slug: p.slug, publicPath: `/portfolio/${p.slug}` });
  return out;
}

const HOME = {
  fr: {
    hero: { eyebrow: "Agence créative · Tunisie", line1: "Des marques tunisiennes", line2: "qu'on remarque,", line3: "et qu'on retient.", text: "Art Visions conçoit votre logo, votre identité visuelle, vos supports imprimés et votre site web. Un seul interlocuteur, une image cohérente.", ctaLabel: "Demander un devis gratuit", ctaHref: "/contact", cta2Label: "Voir les services", cta2Href: "/services", flagCaption: "Conçu en Tunisie,\npour la Tunisie" },
    marquee: ["Restaurants & cafés", "Boutiques de mode", "Salons de beauté", "Startups", "Artisans", "Hôtels", "Cabinets & cliniques", "E-commerce"],
    servicesTitle: "Ce que nous faisons pour votre marque",
    processTitle: "Une méthode simple, des livrables clairs.",
    process: [["Brief", "Nous cadrons votre activité, votre cible et votre budget."], ["Création", "Des propositions concrètes, testées sur de vrais supports."], ["Ajustements", "Vos retours intégrés jusqu'à validation."], ["Livraison", "Fichiers organisés, prêts pour l'imprimeur et le web."]],
    cta: { title: "Parlez-nous de votre projet.", label: "Demander un devis", href: "/contact" },
    seoTitle: "Art Visions Tunisie — Agence de création graphique et digitale",
    seoDescription: "Logo, identité visuelle, supports imprimés et sites web pour les entreprises tunisiennes. Demandez votre devis gratuit.",
  },
  ar: {
    hero: { eyebrow: "وكالة إبداعية · تونس", line1: "علامات تونسية", line2: "تلفت الأنظار،", line3: "وتبقى في الذاكرة.", text: "تصمّم Art Visions شعاركم وهويتكم البصرية ومطبوعاتكم وموقعكم الإلكتروني. مُحاوِر واحد وصورة متناسقة.", ctaLabel: "اطلب عرض سعر مجاني", ctaHref: "/ar/contact", cta2Label: "اكتشفوا الخدمات", cta2Href: "/ar/services", flagCaption: "صُمّم في تونس،\nلتونس" },
    marquee: ["مطاعم ومقاهي", "محلات الأزياء", "صالونات التجميل", "شركات ناشئة", "حرفيون", "فنادق", "عيادات ومكاتب مهنية", "تجارة إلكترونية"],
    servicesTitle: "ما نقدّمه لعلامتكم",
    processTitle: "منهجية بسيطة ومخرجات واضحة.",
    process: [["الملخّص", "نحدّد نشاطكم وجمهوركم وميزانيتكم."], ["الإبداع", "مقترحات ملموسة مُجرَّبة على دعائم حقيقية."], ["التعديلات", "ملاحظاتكم مدمجة حتى الاعتماد النهائي."], ["التسليم", "ملفات منظّمة جاهزة للمطبعة والويب."]],
    cta: { title: "حدّثونا عن مشروعكم.", label: "اطلب عرض سعر", href: "/ar/contact" },
    seoTitle: "Art Visions تونس — وكالة تصميم جرافيك ورقمنة",
    seoDescription: "شعارات وهوية بصرية ومطبوعات ومواقع إلكترونية للشركات التونسية. اطلبوا عرض سعر مجاني.",
  },
} as const;

function home(lang: Lang): Imported {
  const h = HOME[lang];
  const blocks = [
    mk("homehero", h.hero),
    mk("marquee", { items: h.marquee.join("\n") }, "brand"),
    // The services grid links to French pages; for Arabic use plain cards with Arabic names.
    lang === "fr"
      ? mk("services", { title: h.servicesTitle })
      : mk("features", { title: h.servicesTitle, items: SERVICES.map((s) => ({ title: s.ar.name, text: s.ar.short })) }),
    mk("process", { title: h.processTitle, items: h.process.map(([title, text]) => ({ title, text })) }, "violet"),
    ...(lang === "fr" ? [mk("portfolio", { title: "Réalisations" }), mk("tools", { eyebrow: "Outils gratuits", title: "Avancez avant même de nous contacter." }), mk("related", { title: "Conseils pratiques pour vos supports." })] : []),
    mk("cta", { title: h.cta.title, text: "", label: h.cta.label, href: h.cta.href }, "brand"),
  ];
  return { title: lang === "fr" ? "Accueil" : "الرئيسية", blocks, seoTitle: h.seoTitle, metaDescription: h.seoDescription, keyword: "agence graphique Tunisie", schemaType: "WebPage" };
}

function contact(lang: Lang): Imported {
  const fr = lang === "fr";
  return {
    title: fr ? "Demander un devis" : "اطلب عرض سعر",
    blocks: [
      mk("hero", { title: fr ? "Demander un devis" : "اطلب عرض سعر", text: fr ? "Quelques lignes sur votre activité et votre besoin suffisent pour démarrer." : "بضعة أسطر عن نشاطكم وحاجتكم تكفي للانطلاق.", ctaLabel: "", ctaHref: "" }),
      mk("contact", { title: "", text: "" }),
    ],
    seoTitle: fr ? "Demander un devis gratuit | Art Visions Tunisie" : "اطلب عرض سعر مجاني | Art Visions تونس",
    metaDescription: fr ? "Décrivez votre projet de logo, identité visuelle, support imprimé ou site web et recevez une proposition d'Art Visions." : "صِفوا مشروعكم: شعار أو هوية بصرية أو مطبوعات أو موقع إلكتروني، وستصلكم من Art Visions رسالة بمقترح مناسب.",
    keyword: "", schemaType: "ContactPage",
  };
}

function service(slug: string, lang: Lang): Imported | null {
  const s = SERVICES.find((x) => x.slugs[lang] === slug);
  if (!s) return null;
  const c = s[lang];
  const fr = lang === "fr";
  return {
    title: c.name,
    blocks: [
      mk("hero", { title: c.h1, text: c.intro, ctaLabel: fr ? "Demander un devis" : "اطلب عرض سعر", ctaHref: fr ? `/contact?service=${s.slugs.fr}` : `/ar/contact?service=${s.slugs.ar}` }, undefined),
      mk("features", { title: fr ? "Ce que vous recevez" : "ما ستحصلون عليه", items: c.deliverables.map((d) => ({ title: d, text: "" })) }),
      mk("text", { body: `## ${fr ? "Pour qui ?" : "لمن؟"}\n\n${c.useCases.map((u) => `- ${u}`).join("\n")}` }),
      mk("process", { title: fr ? "Notre processus" : "مراحل العمل", items: c.process.map((p) => ({ title: p.title, text: p.text })) }, "violet"),
      mk("faq", { title: fr ? "Questions fréquentes" : "الأسئلة الشائعة", items: c.faqs.map((f) => ({ q: f.q, a: f.a })) }),
      ...(fr ? [mk("services", { title: "Autres services" })] : []),
      mk("cta", { title: fr ? "Parlons de votre projet" : "حدّثونا عن مشروعكم", text: "", label: fr ? "Demander un devis" : "اطلب عرض سعر", href: fr ? "/contact" : "/ar/contact" }, "brand"),
    ],
    seoTitle: c.seoTitle, metaDescription: c.seoDescription, keyword: s.keyword, schemaType: "Service",
  };
}

function article(slug: string): Imported | null {
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return null;
  const blocks: Block[] = [mk("hero", { title: a.title, text: a.description, ctaLabel: "", ctaHref: "" })];
  for (const b of a.body) {
    if (b.t === "h2") blocks.push(mk("heading", { text: b.v, level: "2" }));
    else if (b.t === "p") blocks.push(mk("text", { body: b.v }));
    else if (b.t === "tip") blocks.push(mk("text", { body: `Conseil : ${b.v}` }, "violet"));
    else blocks.push(mk("text", { body: b.v.map((x) => `- ${x}`).join("\n") }));
  }
  const svc = SERVICES.find((s) => s.id === a.service);
  if (svc) blocks.push(mk("cta", { title: svc.fr.name, text: svc.fr.short, label: "En savoir plus", href: `/services/${svc.slugs.fr}` }, "indigo"));
  blocks.push(mk("cta", { title: "Un projet en tête ?", text: "", label: "Demander un devis", href: "/contact" }, "brand"));
  return { title: a.title, blocks, seoTitle: a.seoTitle, metaDescription: a.description, keyword: ARTICLE_KEYWORDS[a.slug] ?? "", category: a.category, schemaType: "Article" };
}

function project(slug: string): Imported | null {
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return null;
  return {
    title: p.title,
    blocks: [
      mk("hero", { eyebrow: `${p.category} · ${p.industry}`, title: p.title, text: p.objective, ctaLabel: "", ctaHref: "" }),
      mk("image"),
      mk("text", { body: `## Défi\n\n${p.challenge}\n\n## Solution\n\n${p.solution}` }),
      mk("cta", { title: "Un projet similaire ?", text: "", label: "Demander un devis", href: "/contact" }, "brand"),
    ],
    seoTitle: `${p.title} | Réalisation Art Visions`, metaDescription: p.objective, keyword: "", schemaType: "WebPage",
  };
}

export function buildImport(kind: Kind, lang: Lang, slug: string): Imported | null {
  if (kind === "page" && slug === "home") return home(lang);
  if (kind === "page" && slug === "contact") return contact(lang);
  if (kind === "service") return service(slug, lang);
  if (kind === "article") return article(slug);
  if (kind === "project") return project(slug);
  return null;
}
