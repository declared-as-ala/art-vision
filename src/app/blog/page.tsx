// Render at request time (data from the DB); avoids build-time DB access.
export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Sparkles, Clock, ArrowRight, Wand2 } from "lucide-react";
import BlogIndex, { type BlogCardPost } from "./BlogIndex";
import NewsletterCTA from "@/components/blog/NewsletterCTA";

export const revalidate = 60;
const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";

export const metadata: Metadata = {
  title: "Blog créatif : design, branding, vidéo & impression | Art Vision",
  description:
    "Conseils d'experts en design graphique, identité visuelle, logo, vidéo, 3D, impression et réseaux sociaux. Le journal créatif d'Art Vision pour développer votre image de marque.",
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    title: "Blog créatif : design, branding, vidéo & impression | Art Vision",
    description: "Conseils d'experts en design, branding, vidéo, 3D, impression et réseaux sociaux par Art Vision.",
    url: `${BASE}/blog`,
    type: "website",
  },
};

const fmt = (d: Date) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function BlogPage() {
  let posts: any[] = [];
  let categories: any[] = [];

  try {
    posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    categories = await prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    console.error("Error fetching blog data:", error);
  }

  const featured = posts.find((p) => p.isPillar) || posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  const cardPosts: BlogCardPost[] = rest.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || p.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160),
    featuredImage: p.featuredImage,
    featuredImageAlt: p.featuredImageAlt || p.title,
    author: p.author,
    readingTime: p.readingTime,
    date: fmt(p.publishedAt || p.createdAt),
    categoryName: p.category.name,
    categorySlug: p.category.slug,
  }));

  const chipCats = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <div className="min-h-screen hero-gradient pt-32 pb-20 px-4">
      <div className="absolute top-20 right-10 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-14">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-brand-white uppercase">
            <Sparkles size={14} className="text-brand-orange" /> Notre journal créatif
          </div>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold tracking-tight">
            Conseils design, branding & <span className="text-brand-magenta">communication</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            Des guides pratiques et l'expertise du studio Art Vision pour développer l'image de marque de votre entreprise.
          </p>
        </div>

        {/* Featured article */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block rounded-3xl overflow-hidden border border-brand-purple/20 hover:border-brand-magenta/40 transition bg-[#1A1238]/40">
            <div className="grid md:grid-cols-2">
              <div className="aspect-[16/10] md:aspect-auto bg-brand-purple/20 overflow-hidden relative">
                <img src={featured.featuredImage} alt={featured.featuredImageAlt || featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <span className="absolute top-4 left-4 bg-brand-magenta text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">À la une</span>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center space-y-4 text-left">
                <span className="text-[10px] text-brand-magenta font-bold uppercase tracking-widest">{featured.category.name}</span>
                <h2 className="text-2xl md:text-3xl font-sora font-extrabold text-white group-hover:text-brand-magenta transition leading-tight">{featured.title}</h2>
                <p className="text-sm text-white/65 leading-relaxed line-clamp-3">
                  {featured.excerpt || featured.content.replace(/<[^>]+>/g, " ").slice(0, 200)}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-white/50 pt-1">
                  <span className="flex items-center gap-1"><Clock size={12} /> {featured.readingTime} min</span>
                  <span>{fmt(featured.publishedAt || featured.createdAt)}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-brand-orange font-bold text-sm pt-1">Lire l'article <ArrowRight size={15} /></span>
              </div>
            </div>
          </Link>
        )}

        {/* Filterable grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16 text-white/40">Aucun article publié pour le moment.</div>
        ) : (
          <BlogIndex posts={cardPosts} categories={chipCats} />
        )}

        {/* CTA row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-3xl border border-brand-orange/25 p-8 text-left" style={{ background: "linear-gradient(135deg, rgba(255,106,0,0.15), rgba(108,43,217,0.18))" }}>
            <Wand2 size={26} className="text-brand-orange mb-3" />
            <h3 className="text-xl font-sora font-extrabold text-white">Des outils gratuits pour passer à l'action</h3>
            <p className="text-sm text-white/65 mt-2 mb-4">CV, carte de visite, QR code, palette de couleurs, slogan, flyer… créez vos supports en quelques clics.</p>
            <Link href="/outils-gratuits" className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-5 py-3 rounded-full text-sm font-bold transition">
              Découvrir les outils <ArrowRight size={15} />
            </Link>
          </div>
          <NewsletterCTA source="blog-home" />
        </div>
      </div>
    </div>
  );
}
