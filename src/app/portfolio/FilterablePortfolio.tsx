"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Play, Pause, Film } from "lucide-react";

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

function isVideoUrl(url: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)($|\?)/i.test(url);
}

function ProjectCard({ project }: { project: Project }) {
  const firstMedia = project.images.split(";")[0] || "/images/placeholder.jpg";
  const isVideo = isVideoUrl(firstMedia) || project.category.slug.includes("video") || project.category.slug.includes("motion");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleVideoPlayback = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay prevented:", err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block bg-[#1A1238]/40 border border-brand-purple/15 rounded-2xl overflow-hidden hover:border-brand-magenta/40 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20"
    >
      <div className="aspect-[4/3] bg-brand-navy/60 overflow-hidden relative">
        {isVideo ? (
          <div className="relative w-full h-full bg-[#070514]">
            <video
              ref={videoRef}
              src={firstMedia}
              playsInline
              muted
              loop
              preload="metadata"
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Interactive Play/Pause Button overlay */}
            <button
              type="button"
              onClick={toggleVideoPlayback}
              aria-label={isPlaying ? "Mettre en pause la vidéo" : "Lire la vidéo du projet"}
              className={`absolute inset-0 m-auto w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer z-10 ${
                isPlaying
                  ? "bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:scale-110"
                  : "bg-brand-magenta/90 text-white opacity-100 hover:bg-brand-magenta hover:scale-110 shadow-lg shadow-brand-magenta/30"
              }`}
            >
              {isPlaying ? (
                <Pause size={22} />
              ) : (
                <Play size={22} className="ml-1" fill="currentColor" />
              )}
            </button>
            {/* Video label badge */}
            <span className="absolute bottom-3 right-3 bg-black/80 text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none flex items-center gap-1">
              <Film size={12} className="text-brand-magenta" /> Vidéo
            </span>
          </div>
        ) : (
          <img
            src={firstMedia}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <span className="absolute top-4 left-4 bg-brand-navy/85 text-brand-magenta text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm pointer-events-none z-10">
          {project.category.name}
        </span>
      </div>
      <div className="p-6 space-y-3 text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-montserrat font-bold text-sm text-white group-hover:text-brand-magenta transition">
              {project.title}
            </h3>
            <p className="text-[10px] text-white/50 pt-0.5">Client : {project.client}</p>
          </div>
          <div className="bg-brand-purple/10 p-2 rounded-lg text-brand-magenta group-hover:bg-brand-magenta group-hover:text-white transition shrink-0">
            <ArrowUpRight size={14} />
          </div>
        </div>
        <p className="text-[11px] text-brand-magenta/90 font-medium flex items-center gap-1 group-hover:underline">
          Voir la fiche du projet <ArrowRight size={12} />
        </p>
      </div>
    </Link>
  );
}

export default function FilterablePortfolio({
  initialProjects,
  categories,
}: FilterablePortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProjects =
    selectedCategory === "all"
      ? initialProjects
      : initialProjects.filter((p) => p.category.slug === selectedCategory);

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
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
