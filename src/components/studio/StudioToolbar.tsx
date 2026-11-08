"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Eye, Loader2, Printer, Redo2, Undo2 } from "lucide-react";
import { StudioDesign } from "./studioTypes";

interface StudioToolbarProps {
  design: StudioDesign;
  activeSide: "recto" | "verso";
  onSwitchSide: (side: "recto" | "verso") => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isSaved: boolean;
  onContinueToPrint: () => void;
  onPreview: () => void;
}

const iconBtn = (enabled: boolean) =>
  `p-2 rounded-lg transition active:scale-90 ${
    enabled ? "text-white/80 hover:text-white hover:bg-white/10 cursor-pointer" : "text-white/20 cursor-not-allowed"
  }`;

export default function StudioToolbar({
  design,
  activeSide,
  onSwitchSide,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isSaved,
  onContinueToPrint,
  onPreview,
}: StudioToolbarProps) {
  return (
    <header className="relative h-14 shrink-0 bg-[#080518]/95 backdrop-blur-xl border-b border-white/10 px-2 sm:px-4 flex items-center justify-between gap-2 z-30 select-none">
      {/* subtle brand line */}
      <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-av-violet/70 to-transparent" />

      {/* Left: back & product */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <Link
          href="/studio"
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition px-2 py-2 rounded-lg hover:bg-white/5 shrink-0"
          aria-label="Quitter le Studio"
        >
          <ArrowLeft size={16} />
          <span className="hidden lg:inline">Quitter le Studio</span>
        </Link>

        <span className="h-5 w-px bg-white/10 hidden md:block" />

        <div className="hidden md:flex items-center gap-2 min-w-0">
          <h1 className="text-sm font-bold text-white truncate">{design.productName}</h1>
          <span className="text-[10px] bg-av-violet/25 text-av-orange px-2 py-0.5 rounded-full border border-av-violet/40 font-mono shrink-0">
            {design.widthMm} × {design.heightMm} mm
          </span>
        </div>
      </div>

      {/* Center: history + sides + save state */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="flex items-center bg-white/[0.04] p-0.5 rounded-xl border border-white/10">
          <button onClick={onUndo} disabled={!canUndo} className={iconBtn(canUndo)} title="Annuler (Ctrl+Z)" aria-label="Annuler">
            <Undo2 size={15} />
          </button>
          <button onClick={onRedo} disabled={!canRedo} className={iconBtn(canRedo)} title="Rétablir (Ctrl+Y)" aria-label="Rétablir">
            <Redo2 size={15} />
          </button>
        </div>

        <div className="relative flex bg-white/[0.04] p-0.5 rounded-xl border border-white/10 text-xs" role="tablist" aria-label="Face">
          {(
            [
              ["recto", "Recto", "Face A"],
              ["verso", "Verso", "Face B"],
            ] as const
          ).map(([side, name, face]) => {
            const active = activeSide === side;
            return (
              <button
                key={side}
                role="tab"
                aria-selected={active}
                onClick={() => onSwitchSide(side)}
                className={`relative px-2.5 sm:px-3.5 py-1.5 rounded-[10px] font-bold transition-colors cursor-pointer ${
                  active ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="studio-side-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-[10px] bg-gradient-to-r from-av-violet to-av-magenta shadow-md shadow-av-magenta/25"
                  />
                )}
                <span className="relative">
                  {name}
                  <span className="hidden sm:inline font-medium opacity-70"> ({face})</span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          className={`hidden xl:flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
            isSaved
              ? "text-emerald-300/90 bg-emerald-500/10 border-emerald-500/20"
              : "text-amber-300/90 bg-amber-500/10 border-amber-500/20"
          }`}
          aria-live="polite"
        >
          {isSaved ? <Check size={12} /> : <Loader2 size={12} className="animate-spin" />}
          <span>{isSaved ? "Brouillon synchronisé" : "Enregistrement…"}</span>
        </div>
      </div>

      {/* Right: preview & CTA */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onPreview}
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-xs font-semibold text-white/80 hover:text-white bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-full transition active:scale-95 cursor-pointer"
          aria-label="Aperçu"
        >
          <Eye size={15} />
          <span className="hidden sm:inline">Aperçu</span>
        </button>

        <button
          onClick={onContinueToPrint}
          className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-av-orange to-av-magenta text-white pl-3 pr-3 sm:pr-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-av-orange/25 hover:shadow-av-magenta/40 hover:brightness-110 active:scale-95 cursor-pointer"
        >
          <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-white/25 -skew-x-[18deg] group-hover:animate-[studio-shine_0.9s_ease]" />
          <Printer size={15} className="relative" />
          <span className="relative hidden sm:inline">Continuer vers l&apos;impression</span>
          <span className="relative sm:hidden">Imprimer</span>
        </button>
      </div>
    </header>
  );
}
