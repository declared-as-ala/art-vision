import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Sparkles, Calendar, User, Clock, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function BlogPage() {
  let posts: any[] = [];
  let categories: any[] = [];

  try {
    posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });
    categories = await prisma.blogCategory.findMany({
      orderBy: { name: "asc" }
    });
  } catch (error) {
    console.error("Error fetching blog data:", error);
  }

  return (
    <div className="min-h-screen bg-brand-navy pt-32 pb-20 px-4">
      {/* Glow */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-[100px] -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-brand-white uppercase animate-pulse">
            <Sparkles size={14} className="text-brand-orange" />
            <span>Notre Journal Créatif</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold tracking-tight">
            Conseils design, branding & <span className="text-brand-magenta">communication</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            Découvrez nos articles, astuces d'experts et conseils pratiques pour booster l'image de marque de votre entreprise.
          </p>
        </div>

        {/* Category List */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-brand-purple/15 pb-6">
            <span className="text-xs bg-brand-magenta text-white px-4 py-2 rounded-full font-semibold">Tous</span>
            {categories.map((cat) => (
              <span key={cat.id} className="text-xs bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-full font-semibold hover:bg-white/10 transition cursor-default">
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <p>Aucun article publié pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric"
              });

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block bg-[#1A1238]/40 border border-brand-purple/10 rounded-2xl overflow-hidden hover:border-brand-magenta/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] bg-brand-purple/20 overflow-hidden relative">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-brand-navy/85 text-brand-magenta text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {post.category.name}
                    </span>
                  </div>

                  <div className="p-6 space-y-4 text-left">
                    {/* Meta */}
                    <div className="flex items-center space-x-4 text-[10px] text-white/50 font-medium">
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{formattedDate}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{post.readingTime} min de lecture</span>
                      </span>
                    </div>

                    <h3 className="font-sora font-bold text-sm text-white group-hover:text-brand-magenta transition line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-xs text-white/60 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>

                    <div className="border-t border-brand-purple/10 pt-4 flex items-center justify-between text-xs font-semibold text-brand-orange">
                      <span className="flex items-center space-x-1.5 text-white/70 font-medium">
                        <User size={12} className="text-brand-magenta" />
                        <span className="text-[10px]">{post.author}</span>
                      </span>
                      <span className="flex items-center space-x-1 group-hover:text-white transition">
                        <span>Lire la suite</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
