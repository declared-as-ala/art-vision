"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Undo2, Redo2, Check, Printer, Sparkles, Eye } from "lucide-react";
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
    <header className="h-16 bg-[#080518] border-b border-brand-purple/20 px-4 md:px-6 flex items-center justify-between z-30 select-none">
      {/* Left: Back & Product Info */}
      <div className="flex items-center gap-3 md:gap-4">
        <Link
          href="/studio"
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition px-2 py-1.5 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Quitter le Studio</span>
        </Link>

        <div className="h-5 w-[1px] bg-brand-purple/25 hidden sm:block" />

        <div className="text-left">
          <h1 className="text-xs md:text-sm font-bold text-white font-montserrat flex items-center gap-2">
            <span>{design.productName}</span>
            <span className="text-[10px] bg-brand-purple/30 text-brand-orange px-2 py-0.5 rounded-full border border-brand-purple/40 font-mono">
              {design.widthMm} × {design.heightMm} mm
            </span>
          </h1>
          <p className="text-[10px] text-white/40 hidden md:block">
            Création en ligne incluse avec votre commande d'impression
          </p>
        </div>
      </div>

      {/* Center: Recto / Verso Selector & Undo/Redo */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-[#140e2b] p-1 rounded-xl border border-brand-purple/20">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg transition ${
              canUndo ? "text-white/80 hover:text-white hover:bg-white/10 cursor-pointer" : "text-white/20 cursor-not-allowed"
            }`}
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg transition ${
              canRedo ? "text-white/80 hover:text-white hover:bg-white/10 cursor-pointer" : "text-white/20 cursor-not-allowed"
            }`}
            title="Rétablir (Ctrl+Y)"
          >
            <Redo2 size={15} />
          </button>
        </div>

        {/* Recto / Verso Toggle Tabs */}
        <div className="flex bg-[#140e2b] p-1 rounded-xl border border-brand-purple/20 text-xs">
          <button
            onClick={() => onSwitchSide("recto")}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSide === "recto"
                ? "bg-gradient-to-r from-brand-purple to-brand-magenta text-white shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>Recto (Face A)</span>
          </button>

          <button
            onClick={() => onSwitchSide("verso")}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSide === "verso"
                ? "bg-gradient-to-r from-brand-purple to-brand-magenta text-white shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>Verso (Face B)</span>
          </button>
        </div>

        {/* Auto-save Status */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-emerald-400/80 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <Check size={12} />
          <span>Brouillon synchronisé</span>
        </div>
      </div>

      {/* Right: Preview & Main Print CTA */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPreview}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition cursor-pointer"
        >
          <Eye size={14} />
          <span>Aperçu</span>
        </button>

        <button
          onClick={onContinueToPrint}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FF6A00] to-[#D72888] hover:from-[#e55f00] hover:to-[#c22077] text-white px-4 md:px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-brand-orange/25 transform hover:scale-105 cursor-pointer"
        >
          <Printer size={15} />
          <span>Continuer vers l'impression</span>
        </button>
      </div>
    </header>
  );
}
