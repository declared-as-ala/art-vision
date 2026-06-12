"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  images: string;
  category: Category;
}

interface FilterablePortfolioProps {
  initialProjects: Project[];
  categories: Category[];
}

export default function FilterablePortfolio({
  initialProjects,
  categories
}: FilterablePortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProjects = selectedCategory === "all"
    ? initialProjects
    : initialProjects.filter(p => p.category.slug === selectedCategory);

  return (
    <div className="space-y-12">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-brand-purple/20 pb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition uppercase cursor-pointer ${
            selectedCategory === "all"
              ? "bg-brand-magenta text-white shadow-md shadow-brand-magenta/15"
              : "bg-white/5 border border-white/10 hover:bg-white/10 text-white/80"
          }`}
        >
          Tous les projets
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition uppercase cursor-pointer ${
              selectedCategory === cat.slug
                ? "bg-brand-magenta text-white shadow-md shadow-brand-magenta/15"
                : "bg-white/5 border border-white/10 hover:bg-white/10 text-white/80"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <p>Aucun projet disponible dans cette catégorie pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const firstImage = project.images.split(";")[0] || "/images/placeholder.jpg";
            return (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="group block bg-[#1A1238]/40 border border-brand-purple/10 rounded-2xl overflow-hidden hover:border-brand-magenta/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] bg-brand-purple/20 overflow-hidden relative">
                  <img
                    src={firstImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-brand-navy/85 text-brand-magenta text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {project.category.name}
                  </span>
                </div>
                <div className="p-6 space-y-3 text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-sora font-bold text-sm text-white group-hover:text-brand-magenta transition">
                        {project.title}
                      </h3>
                      <p className="text-[10px] text-white/50 pt-0.5">Client : {project.client}</p>
                    </div>
                    <div className="bg-brand-purple/10 p-2 rounded-lg text-brand-magenta group-hover:bg-brand-magenta group-hover:text-white transition">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
