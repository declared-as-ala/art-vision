"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Calendar, Clock, User, ArrowRight } from "lucide-react";

export interface BlogCardPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  readingTime: number;
  date: string;
  categoryName: string;
  categorySlug: string;
}

export interface CategoryChip { slug: string; name: string }

const PAGE_SIZE = 9;

export default function BlogIndex({ posts, categories }: { posts: BlogCardPost[]; categories: CategoryChip[] }) {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchCat = active === "all" || p.categorySlug === active;
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [posts, active, query]);

  const shown = filtered.slice(0, visible);

  // Only show categories that actually have published posts.
  const liveCats = categories.filter((c) => posts.some((p) => p.categorySlug === c.slug));

  return (
    <div className="space-y-10">
      {/* Search + filters */}
      <div className="space-y-5">
        <div className="max-w-md mx-auto relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
            placeholder="Rechercher un article…"
            className="w-full pl-11 pr-4 py-3 rounded-full text-sm text-white outline-none"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <FilterChip label="Tous" active={active === "all"} onClick={() => { setActive("all"); setVisible(PAGE_SIZE); }} />
          {liveCats.map((c) => (
            <FilterChip key={c.slug} label={c.name} active={active === c.slug} onClick={() => { setActive(c.slug); setVisible(PAGE_SIZE); }} />
          ))}
        </div>
      </div>

      {/* Grid */}
      {shown.length === 0 ? (
        <div className="text-center py-16 text-white/40 text-sm">Aucun article ne correspond à votre recherche.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shown.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block bg-[#1A1238]/40 border border-brand-purple/10 rounded-2xl overflow-hidden hover:border-brand-magenta/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[16/10] bg-brand-purple/20 overflow-hidden relative">
                <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 bg-brand-navy/85 text-brand-magenta text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{post.categoryName}</span>
              </div>
              <div className="p-6 space-y-4 text-left">
                <div className="flex items-center gap-4 text-[10px] text-white/50 font-medium">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.readingTime} min</span>
                </div>
                <h3 className="font-sora font-bold text-base text-white group-hover:text-brand-magenta transition line-clamp-2">{post.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed line-clamp-3">{post.excerpt}</p>
                <div className="border-t border-brand-purple/10 pt-4 flex items-center justify-between text-xs font-semibold text-brand-orange">
                  <span className="flex items-center gap-1.5 text-white/70 font-medium">
                    <User size={12} className="text-brand-magenta" /> <span className="text-[10px]">{post.author}</span>
                  </span>
                  <span className="flex items-center gap-1 group-hover:text-white transition">Lire la suite <ArrowRight size={12} /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {visible < filtered.length && (
        <div className="text-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/15 hover:border-brand-magenta/40 text-white px-6 py-3 rounded-full text-sm font-semibold transition cursor-pointer"
          >
            Charger plus d'articles
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-4 py-2 rounded-full font-semibold transition cursor-pointer border ${
        active ? "bg-brand-magenta border-brand-magenta text-white" : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-brand-magenta/40"
      }`}
    >
      {label}
    </button>
  );
}
