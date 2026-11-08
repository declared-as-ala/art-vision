"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { StudioTemplate } from "./studioTypes";
import StudioCardPreview from "./StudioCardPreview";

const CATEGORY_LABELS: Record<string, string> = {
  artisan: "Artisans",
  restaurant: "Restaurants",
  commerce: "Commerces",
  beaute: "Beauté",
  freelance: "Studios",
};

const filterKey = (t: StudioTemplate) => (t.category === "promo" ? t.categoryLabel : t.category);
const filterLabel = (key: string) => CATEGORY_LABELS[key] ?? key;

interface Props {
  templates: StudioTemplate[];
  hrefFor: (template: StudioTemplate) => string;
  /** Optional leading element (e.g. the « page blanche » card). */
  leading?: React.ReactNode;
}

/** Interactive template gallery with animated filters, sized to the document being created. */
export default function StudioTemplateGallery({ templates, hrefFor, leading }: Props) {
  const [active, setActive] = useState<string>("all");

  const filters = useMemo(() => {
    const keys: string[] = [];
    for (const t of templates) {
      const k = filterKey(t);
      if (!keys.includes(k)) keys.push(k);
    }
    return keys;
  }, [templates]);

  const visible = templates.filter((t) => active === "all" || filterKey(t) === active);
  const count = (key: string) => (key === "all" ? templates.length : templates.filter((t) => filterKey(t) === key).length);

  return (
    <div className="space-y-6">
      {filters.length > 1 && (
        <div
          role="tablist"
          aria-label="Filtrer les modèles"
          className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
        >
          {["all", ...filters].map((key) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(key)}
                className={`relative shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                  isActive
                    ? "text-white border-transparent"
                    : "text-white/60 border-white/10 bg-white/[0.03] hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="gallery-filter-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-av-violet to-av-magenta shadow-lg shadow-av-magenta/25"
                  />
                )}
                <span className="relative">{key === "all" ? "Tous" : filterLabel(key)}</span>
                <span
                  className={`relative text-[10px] font-extrabold rounded-full px-1.5 py-px ${
                    isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/50"
                  }`}
                >
                  {count(key)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        {leading}
        <AnimatePresence mode="popLayout">
          {visible.map((tpl) => {
            const { widthMm, heightMm } = tpl.design;
            const portrait = heightMm > widthMm;
            return (
              <motion.div
                key={tpl.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <Link
                  href={hrefFor(tpl)}
                  className="group block rounded-2xl border border-white/10 bg-white/[0.04] p-3 hover:border-av-orange/70 hover:bg-white/[0.07] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(255,106,0,0.4)] transition-all duration-200"
                >
                  <div className="relative rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(108,43,217,0.22),transparent_70%)] p-3 flex items-center justify-center min-h-[140px]">
                    <div className={`relative ${portrait ? "w-[62%]" : "w-full"}`}>
                      <StudioCardPreview
                        side={tpl.design.recto}
                        widthMm={widthMm}
                        heightMm={heightMm}
                        paper
                        className="w-full"
                      />
                      {tpl.design.verso.elements.length > 0 && !tpl.design.singleSided && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <StudioCardPreview
                            side={tpl.design.verso}
                            widthMm={widthMm}
                            heightMm={heightMm}
                            paper
                            className="w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 px-0.5">
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-white group-hover:text-av-orange transition-colors truncate">
                        {tpl.name}
                      </span>
                      <span className="block text-[10px] text-white/45 truncate">{tpl.categoryLabel}</span>
                    </span>
                    <ArrowRight size={14} className="shrink-0 text-white/40 group-hover:text-av-orange group-hover:translate-x-0.5 transition" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
