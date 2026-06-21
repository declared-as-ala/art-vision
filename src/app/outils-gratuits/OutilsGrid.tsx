"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { toolsByOrder, toolCategories, toolUrl, type ToolCategory } from "@/lib/tools";
import ToolIcon from "@/components/tools/ToolIcon";

export default function OutilsGrid() {
  const [filter, setFilter] = useState<ToolCategory | "Tous">("Tous");
  const reduce = useReducedMotion();

  const filtered =
    filter === "Tous" ? toolsByOrder : toolsByOrder.filter((t) => t.category === filter);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {(["Tous", ...toolCategories] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer border ${
              filter === cat
                ? "bg-brand-magenta border-brand-magenta text-white"
                : "border-white/15 text-white/65 hover:text-white hover:border-brand-magenta/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tool, i) => (
          <motion.div
            key={tool.slug}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
          >
            <Link
              href={toolUrl(tool.slug)}
              className="group relative flex flex-col h-full rounded-2xl border border-brand-purple/20 bg-brand-purple-dark/40 backdrop-blur-md p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-magenta/40"
            >
              {/* hover glow */}
              <div
                className="absolute -top-16 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                style={{ background: tool.accent }}
                aria-hidden
              />

              {/* badges */}
              <div className="relative flex items-center justify-between mb-5">
                <div
                  className="p-3 rounded-xl border border-white/10"
                  style={{ background: `${tool.accent}22`, color: tool.accent }}
                >
                  <ToolIcon name={tool.icon} size={24} />
                </div>
                <span className="inline-flex items-center gap-1 bg-green-500/15 border border-green-500/30 text-green-300 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  <Sparkles size={9} /> Gratuit
                </span>
              </div>

              <div className="relative flex-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                  {tool.category}
                </span>
                <h3 className="text-lg font-sora font-extrabold text-white mt-1 group-hover:text-brand-magenta transition">
                  {tool.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed mt-2">{tool.shortDesc}</p>
                <p className="text-[11px] text-white/40 leading-relaxed mt-3 line-clamp-2">
                  {tool.seoText}
                </p>
              </div>

              <span className="relative inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange mt-5 group-hover:gap-2.5 transition-all">
                Utiliser l'outil <ArrowRight size={14} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
