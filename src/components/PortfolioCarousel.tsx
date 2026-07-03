"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselProject {
  id: string;
  slug: string;
  title: string;
  client: string;
  images: string;
  objective: string;
  category: { name: string };
}

// Infinite, auto-scrolling portfolio slider with prev/next arrows.
// Pauses on hover; the arrows nudge one card at a time.
export default function PortfolioCarousel({ projects }: { projects: CarouselProject[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // Triple the list so we can loop seamlessly in both directions.
  const items = [...projects, ...projects, ...projects];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Start in the middle copy so there's room to scroll left and right.
    const third = () => el.scrollWidth / 3;
    el.scrollLeft = third();

    let raf = 0;
    const speed = 0.5; // px per frame
    const step = () => {
      if (!pausedRef.current) el.scrollLeft += speed;
      const t = third();
      if (el.scrollLeft >= t * 2) el.scrollLeft -= t;
      else if (el.scrollLeft <= 0) el.scrollLeft += t;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const pause = () => (pausedRef.current = true);
    const resume = () => (pausedRef.current = false);
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, [projects.length]);

  const nudge = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth || 320) + 24; // card width + gap
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative group/carousel">
      {/* Prev / Next arrows */}
      <button
        type="button"
        aria-label="Précédent"
        onClick={() => nudge(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 hidden sm:flex items-center justify-center w-11 h-11 rounded-full bg-brand-navy/90 border border-brand-purple/40 text-white hover:bg-brand-magenta hover:border-brand-magenta transition shadow-lg cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="Suivant"
        onClick={() => nudge(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 hidden sm:flex items-center justify-center w-11 h-11 rounded-full bg-brand-navy/90 border border-brand-purple/40 text-white hover:bg-brand-magenta hover:border-brand-magenta transition shadow-lg cursor-pointer"
      >
        <ChevronRight size={20} />
      </button>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[#0b0620] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[#0b0620] to-transparent" />

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2"
      >
        {items.map((project, i) => (
          <Link
            key={`${project.id}-${i}`}
            href={`/portfolio/${project.slug}`}
            data-card
            className="group block w-72 sm:w-80 shrink-0 bg-[#1A1238]/40 border border-brand-purple/10 rounded-2xl overflow-hidden hover:border-brand-magenta/40 transition-all duration-300"
          >
            <div className="aspect-[4/3] bg-white overflow-hidden relative flex items-center justify-center">
              <img
                src={project.images.split(";")[0]}
                alt={project.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute top-4 left-4 bg-brand-navy/80 text-brand-magenta text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {project.category.name}
              </span>
            </div>
            <div className="p-5 space-y-2 text-left">
              <h3 className="font-sora font-bold text-sm text-white group-hover:text-brand-magenta transition">
                {project.title}
              </h3>
              <p className="text-[11px] text-white/50">Client : {project.client}</p>
              <p className="text-xs text-white/75 leading-relaxed line-clamp-2">{project.objective}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
