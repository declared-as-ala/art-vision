import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ArrowLeft, Calendar, User, Clock, Share2, MessageSquare, Tag } from "lucide-react";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { RichContent } from "@/components/cms/RichContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || (post.status !== "PUBLISHED" && !isEnabled)) return {};
  const canonical = `https://art-visions.fr/blog/${slug}`;
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.content.replace(/<[^>]+>/g, "").slice(0, 160),
    alternates: { canonical },
    robots: { index: !isEnabled, follow: !isEnabled },
    openGraph: { title: post.seoTitle || post.title, description: post.seoDescription || undefined, images: [{ url: post.featuredImage }], url: canonical, type: "article" },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  let post: any = null;
  let relatedPosts: any[] = [];

  try {
    post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true }
    });

    if (post) {
      relatedPosts = await prisma.blogPost.findMany({
        where: {
          categoryId: post.categoryId,
          id: { not: post.id },
          status: "PUBLISHED"
        },
        take: 3,
        include: { category: true }
      });
    }
  } catch (error) {
    console.error("Error fetching blog post detail:", error);
  }

  if (!post || (post.status !== "PUBLISHED" && !isPreview)) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const tagsList = post.tags.split(",").filter((tag: string) => tag.trim() !== "");

  return (
    <div className="min-h-screen bg-brand-navy pt-32 pb-20 px-4">
      {/* Glow */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-purple/15 rounded-full filter blur-[100px] -z-10 animate-pulse"></div>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-white/50 hover:text-brand-magenta transition uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          <span>Retour aux articles</span>
        </Link>

        {/* Main Header */}
        <div className="space-y-4 text-left border-b border-brand-purple/20 pb-8">
          <span className="bg-brand-purple/30 border border-brand-purple/40 text-brand-magenta text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category.name}
          </span>
          <h1 className="text-3xl md:text-5xl font-sora font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-xs text-white/60 font-medium pt-2">
            <span className="flex items-center space-x-1.5">
              <Calendar size={14} className="text-brand-orange" />
              <span>Publié le : <strong>{formattedDate}</strong></span>
            </span>
            <span className="flex items-center space-x-1.5">
              <User size={14} className="text-brand-magenta" />
              <span>Auteur : <strong>{post.author}</strong></span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock size={14} className="text-brand-purple" />
              <span>Lecture : <strong>{post.readingTime} min</strong></span>
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-[21/9] bg-brand-purple/20 rounded-2xl overflow-hidden border border-brand-purple/15">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Main Article Content */}
          <div className="lg:col-span-8 space-y-6 text-left leading-relaxed text-sm text-white/80">
            <RichContent html={post.content} />

            {/* Tags */}
            {tagsList.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-6 border-t border-brand-purple/10">
                {tagsList.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="flex items-center space-x-1 bg-brand-purple/20 border border-brand-purple/30 text-white/70 text-[10px] font-semibold px-2.5 py-1 rounded"
                  >
                    <Tag size={10} />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Share Widget */}
            <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 text-left space-y-4">
              <h3 className="font-sora font-bold text-sm text-white flex items-center space-x-2">
                <Share2 size={16} className="text-brand-orange" />
                <span>Partager l'article</span>
              </h3>
              <div className="flex space-x-3">
                <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 text-xs py-2 rounded-lg font-medium transition cursor-pointer">
                  Facebook
                </button>
                <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 text-xs py-2 rounded-lg font-medium transition cursor-pointer">
                  Twitter
                </button>
              </div>
            </div>

            {/* Newsletter / Contact Promo */}
            <div className="glassmorphism rounded-2xl p-6 border border-brand-orange/20 text-center space-y-4">
              <MessageSquare size={24} className="text-brand-orange mx-auto" />
              <h4 className="font-sora font-bold text-sm text-white">Besoin d'un accompagnement ?</h4>
              <p className="text-[11px] text-white/60">Nos experts en communication sont à votre disposition pour concrétiser vos projets visuels.</p>
              <Link
                href="/devis-sur-mesure"
                className="block text-center bg-brand-orange hover:bg-brand-orange/95 text-white py-3 rounded-xl font-bold text-xs transition"
              >
                Discuter de mon projet
              </Link>
            </div>
          </div>
        </div>

        {/* Related articles (Bottom) */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-brand-purple/10 pt-16 space-y-8">
            <h3 className="font-sora font-bold text-xl text-left text-white">Articles recommandés</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  href={`/blog/${rPost.slug}`}
                  className="group block bg-[#1A1238]/40 border border-brand-purple/10 rounded-2xl overflow-hidden hover:border-brand-magenta/40 transition text-left"
                >
                  <div className="aspect-[16/10] bg-brand-purple/20 overflow-hidden relative">
                    <img
                      src={rPost.featuredImage}
                      alt={rPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] text-brand-magenta font-bold uppercase tracking-wider block">
                      {rPost.category.name}
                    </span>
                    <h4 className="font-sora font-bold text-xs text-white group-hover:text-brand-magenta transition line-clamp-2">
                      {rPost.title}
                    </h4>
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
