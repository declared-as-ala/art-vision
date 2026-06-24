// Render at request time (data from the DB); avoids build-time DB access.
export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  ArrowLeft, Calendar, RefreshCw, User, Clock, Tag, ListTree,
  ChevronRight, Home, ArrowRight, HelpCircle, Wrench, Briefcase, FolderKanban,
} from "lucide-react";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { RichContent } from "@/components/cms/RichContent";
import { withHeadingIds, parseFaq, resolveServices, resolveTools, resolvePortfolio } from "@/lib/blog";
import { sanitizeHtml } from "@/lib/cms";
import ShareButtons from "@/components/blog/ShareButtons";
import NewsletterCTA from "@/components/blog/NewsletterCTA";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";
export const revalidate = 60;

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || (post.status !== "PUBLISHED" && !isEnabled)) return {};
  const canonical = `${BASE}/blog/${slug}`;
  const description = post.seoDescription || post.excerpt || stripHtml(post.content).slice(0, 160);
  const ogImage = post.ogImage || post.featuredImage;
  return {
    title: post.seoTitle || post.title,
    description,
    keywords: post.focusKeyword || undefined,
    alternates: { canonical },
    robots: { index: post.status === "PUBLISHED" && !isEnabled, follow: true },
    openGraph: {
      title: post.ogTitle || post.seoTitle || post.title,
      description: post.ogDescription || description,
      images: [{ url: ogImage }],
      url: canonical,
      type: "article",
      publishedTime: (post.publishedAt || post.createdAt).toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.ogTitle || post.seoTitle || post.title,
      description: post.ogDescription || description,
      images: [ogImage],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  let post: any = null;
  let relatedPosts: any[] = [];

  try {
    post = await prisma.blogPost.findUnique({ where: { slug }, include: { category: true } });
    if (post) {
      relatedPosts = await prisma.blogPost.findMany({
        where: { categoryId: post.categoryId, id: { not: post.id }, status: "PUBLISHED" },
        take: 3,
        orderBy: { publishedAt: "desc" },
        include: { category: true },
      });
    }
  } catch (error) {
    console.error("Error fetching blog post detail:", error);
  }

  if (!post || (post.status !== "PUBLISHED" && !isPreview)) notFound();

  const fmt = (d: Date) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const publishedDate = fmt(post.publishedAt || post.createdAt);
  const updatedDate = fmt(post.updatedAt);
  const showUpdated = new Date(post.updatedAt).getTime() - new Date(post.publishedAt || post.createdAt).getTime() > 86400000;

  const tagsList = post.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
  const { html, toc } = withHeadingIds(post.content);
  const faq = parseFaq(post.faqJson);
  const services = resolveServices(post.relatedServices);
  const tools = resolveTools(post.relatedTools);
  const portfolio = resolvePortfolio(post.relatedPortfolio);
  const canonical = `${BASE}/blog/${slug}`;
  const description = post.seoDescription || post.excerpt || stripHtml(post.content).slice(0, 160);

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      headline: post.title,
      description,
      image: [post.ogImage || post.featuredImage],
      datePublished: (post.publishedAt || post.createdAt).toISOString(),
      dateModified: post.updatedAt.toISOString(),
      author: { "@type": "Organization", name: "Art Vision" },
      publisher: { "@type": "Organization", name: "Art Vision", logo: { "@type": "ImageObject", url: `${BASE}/logo.png` } },
      mainEntityOfPage: canonical,
      articleSection: post.category?.name,
      inLanguage: "fr",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: canonical },
      ],
    },
  ];
  if (faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    });
  }

  return (
    <div className="min-h-screen hero-gradient pt-28 pb-20 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-purple/15 rounded-full filter blur-[100px] -z-10" />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane">
          <ol className="flex items-center gap-1.5 text-[11px] text-white/50 flex-wrap">
            <li><Link href="/" className="hover:text-brand-magenta inline-flex items-center gap-1"><Home size={11} /> Accueil</Link></li>
            <ChevronRight size={11} className="opacity-40" />
            <li><Link href="/blog" className="hover:text-brand-magenta">Blog</Link></li>
            <ChevronRight size={11} className="opacity-40" />
            <li className="text-white/80 font-semibold line-clamp-1">{post.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="space-y-4 text-left border-b border-brand-purple/20 pb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[11px] font-semibold text-white/50 hover:text-brand-magenta transition uppercase tracking-wider">
            <ArrowLeft size={13} /> Retour aux articles
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-brand-purple/30 border border-brand-purple/40 text-brand-magenta text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category.name}
            </span>
            {post.isPillar && (
              <span className="bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Article pilier</span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-sora font-extrabold tracking-tight text-white leading-tight">{post.title}</h1>
          {post.excerpt && <p className="text-white/65 text-sm md:text-base max-w-3xl">{post.excerpt}</p>}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60 font-medium pt-1">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-brand-orange" /> Publié le <strong>{publishedDate}</strong></span>
            {showUpdated && <span className="flex items-center gap-1.5"><RefreshCw size={13} className="text-brand-purple" /> Mis à jour le <strong>{updatedDate}</strong></span>}
            <span className="flex items-center gap-1.5"><User size={14} className="text-brand-magenta" /> <strong>{post.author}</strong></span>
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-brand-purple" /> <strong>{post.readingTime} min</strong></span>
          </div>
        </header>

        {/* Featured image */}
        <div className="aspect-[21/9] bg-brand-purple/20 rounded-2xl overflow-hidden border border-brand-purple/15">
          <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} className="w-full h-full object-cover" />
        </div>

        {/* Body + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          <article className="lg:col-span-8 space-y-8 text-left">
            {/* Table of contents */}
            {toc.length > 2 && (
              <nav className="glassmorphism rounded-2xl p-5 border border-brand-purple/15">
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2 mb-3">
                  <ListTree size={14} className="text-brand-magenta" /> Sommaire
                </h2>
                <ul className="space-y-1.5">
                  {toc.map((t) => (
                    <li key={t.id} className={t.level === 3 ? "pl-4" : ""}>
                      <a href={`#${t.id}`} className="text-xs text-white/70 hover:text-brand-magenta transition">{t.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="cms-rich-content text-sm text-white/80 leading-relaxed scroll-smooth">
              <RichContent html={html} />
            </div>

            {/* Custom HTML block (admin-managed, sanitized) */}
            {post.customHtml && (
              <div
                className="cms-rich-content text-sm text-white/80 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.customHtml) }}
              />
            )}

            {/* Related services / tools / portfolio */}
            {(services.length > 0 || tools.length > 0 || portfolio.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {services.length > 0 && (
                  <RelatedBlock title="Services associés" icon={<Briefcase size={15} />} items={services} />
                )}
                {tools.length > 0 && (
                  <RelatedBlock title="Outils gratuits" icon={<Wrench size={15} />} items={tools} accent />
                )}
                {portfolio.length > 0 && (
                  <RelatedBlock title="Réalisations" icon={<FolderKanban size={15} />} items={portfolio} />
                )}
              </div>
            )}

            {/* CTA block */}
            {(post.ctaTitle || post.ctaLabel) && (
              <div className="relative overflow-hidden rounded-2xl border border-brand-magenta/25 p-7" style={{ background: "linear-gradient(135deg, rgba(108,43,217,0.25), rgba(215,40,136,0.18))" }}>
                <div className="absolute -top-16 -right-8 w-56 h-56 rounded-full bg-brand-magenta/20 blur-[80px]" aria-hidden />
                <div className="relative">
                  <h3 className="text-xl font-sora font-extrabold text-white">{post.ctaTitle || "Passez à l'action avec Art Vision"}</h3>
                  {post.ctaText && <p className="text-white/65 text-sm mt-2 max-w-xl">{post.ctaText}</p>}
                  <Link href={post.ctaHref || "/devis-sur-mesure"} className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-5 py-3 rounded-full text-sm font-bold transition mt-4">
                    {post.ctaLabel || "Demander un devis"} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {/* FAQ */}
            {faq.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-2xl font-sora font-extrabold text-white flex items-center gap-2">
                  <HelpCircle size={20} className="text-brand-magenta" /> Questions fréquentes
                </h2>
                {faq.map((f, i) => (
                  <details key={i} className="group rounded-xl border border-brand-purple/20 bg-brand-purple-dark/40 px-5 py-4">
                    <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-white list-none">
                      {f.question}
                      <ChevronRight size={16} className="text-brand-magenta transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="text-xs text-white/65 leading-relaxed mt-3">{f.answer}</p>
                  </details>
                ))}
              </section>
            )}

            {/* Tags */}
            {tagsList.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-brand-purple/10">
                {tagsList.map((tag: string, idx: number) => (
                  <span key={idx} className="flex items-center gap-1 bg-brand-purple/20 border border-brand-purple/30 text-white/70 text-[10px] font-semibold px-2.5 py-1 rounded">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Author */}
            <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-magenta to-brand-purple grid place-items-center text-white font-sora font-extrabold">
                  {post.author.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong className="text-sm text-white block">{post.author}</strong>
                  <span className="text-[11px] text-white/50">Studio Art Vision</span>
                </div>
              </div>
              <p className="text-[11px] text-white/55 leading-relaxed mt-3">
                L'équipe créative d'Art Vision partage ses conseils en design, branding et communication.
              </p>
            </div>

            <ShareButtons url={canonical} title={post.title} />
            <NewsletterCTA source={`blog:${slug}`} compact />

            {/* Free tools promo */}
            <div className="glassmorphism rounded-2xl p-6 border border-brand-orange/20 text-center space-y-3">
              <h3 className="font-sora font-bold text-sm text-white">Outils gratuits Art Vision</h3>
              <p className="text-[11px] text-white/60">CV, carte de visite, QR code, palette, flyer… créez vos supports en quelques clics.</p>
              <Link href="/outils-gratuits" className="block bg-brand-orange hover:bg-brand-orange/90 text-white py-2.5 rounded-xl font-bold text-xs transition">
                Découvrir les outils
              </Link>
            </div>
          </aside>
        </div>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-brand-purple/10 pt-14 space-y-8">
            <h2 className="font-sora font-extrabold text-xl text-left text-white">Articles recommandés</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <Link key={rPost.id} href={`/blog/${rPost.slug}`} className="group block bg-[#1A1238]/40 border border-brand-purple/10 rounded-2xl overflow-hidden hover:border-brand-magenta/40 transition text-left">
                  <div className="aspect-[16/10] bg-brand-purple/20 overflow-hidden relative">
                    <img src={rPost.featuredImage} alt={rPost.featuredImageAlt || rPost.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] text-brand-magenta font-bold uppercase tracking-wider block">{rPost.category.name}</span>
                    <h3 className="font-sora font-bold text-xs text-white group-hover:text-brand-magenta transition line-clamp-2">{rPost.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RelatedBlock({ title, icon, items, accent }: { title: string; icon: React.ReactNode; items: { label: string; href: string }[]; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-brand-orange/25 bg-brand-orange/5" : "border-brand-purple/20 bg-brand-purple-dark/30"}`}>
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 flex items-center gap-2 mb-3">
        <span className={accent ? "text-brand-orange" : "text-brand-magenta"}>{icon}</span> {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="text-xs text-white/75 hover:text-brand-magenta inline-flex items-center gap-1 transition">
              <ChevronRight size={12} /> {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
