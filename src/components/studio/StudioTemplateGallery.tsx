"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { STUDIO_TEMPLATES } from "./StudioTemplates";
import StudioCardPreview from "./StudioCardPreview";

const FILTERS = [
  { id: "all", label: "Tous" },
  { id: "artisan", label: "Artisans" },
  { id: "restaurant", label: "Restaurants" },
  { id: "commerce", label: "Commerces" },
  { id: "beaute", label: "Beauté" },
  { id: "freelance", label: "Studios" },
] as const;

/** Interactive template gallery with animated category filters. */
export default function StudioTemplateGallery() {
  const [active, setActive] = useState<string>("all");

  const visible = STUDIO_TEMPLATES.filter((t) => active === "all" || t.category === active);
  const count = (id: string) =>
    id === "all" ? STUDIO_TEMPLATES.length : STUDIO_TEMPLATES.filter((t) => t.category === id).length;

  return (
    <div className="space-y-8">
      <div
        role="tablist"
        aria-label="Filtrer les modèles par métier"
        className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
      >
        {FILTERS.map((f) => {
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(f.id)}
              className={`relative shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                isActive
                  ? "text-white border-transparent"
                  : "text-white/60 border-white/10 bg-white/[0.03] hover:text-white hover:bg-white/[0.07]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="hub-filter-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-av-violet to-av-magenta shadow-lg shadow-av-magenta/25"
                />
              )}
              <span className="relative">{f.label}</span>
              <span
                className={`relative text-[10px] font-extrabold rounded-full px-1.5 py-px ${
                  isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/50"
                }`}
              >
                {count(f.id)}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {visible.map((tpl) => (
            <motion.article
              key={tpl.id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="group relative rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-av-orange/60 p-4 transition-colors duration-300 hover:shadow-[0_24px_60px_-24px_rgba(255,106,0,0.4)]"
            >
              {/* Card stage: recto → verso on hover */}
              <div className="relative rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(108,43,217,0.25),transparent_70%)] p-5 sm:p-6">
                <div className="relative transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[-1.5deg] group-hover:scale-[1.03]">
                  <StudioCardPreview
                    side={tpl.design.recto}
                    widthMm={tpl.design.widthMm}
                    heightMm={tpl.design.heightMm}
                    paper
                    className="w-full"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <StudioCardPreview
                      side={tpl.design.verso}
                      widthMm={tpl.design.widthMm}
                      heightMm={tpl.design.heightMm}
                      paper
                      className="w-full h-full"
                    />
                  </div>
                  <span className="absolute -bottom-2.5 right-3 text-[9px] font-extrabold uppercase tracking-wider rounded-full bg-[#120c28] border border-white/15 px-2 py-0.5 text-white/80">
                    <span className="group-hover:hidden">Recto</span>
                    <span className="hidden group-hover:inline text-av-orange">Verso</span>
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 pt-4 px-1">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white group-hover:text-av-orange transition-colors truncate">
                    {tpl.name}
                  </h3>
                  <span className="text-[11px] text-white/45">{tpl.categoryLabel}</span>
                </div>
              </div>

              <Link
                href={`/studio/editor?product=${tpl.productSlug}&template=${tpl.id}`}
                className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-white/[0.05] group-hover:bg-gradient-to-r group-hover:from-av-orange group-hover:to-av-magenta border border-white/10 group-hover:border-transparent text-white text-xs font-bold py-2.5 transition-all active:scale-[0.98]"
              >
                Utiliser ce modèle
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
