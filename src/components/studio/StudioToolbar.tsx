"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Check, ChevronDown, CopyPlus, Eye, Printer, Redo2, Undo2 } from "lucide-react";
import { StudioDesign } from "./studioTypes";
import { specToQuery, type StudioSpec } from "./studioProducts";

export type SaveState = "saved" | "error" | "archive";

interface StudioToolbarProps {
  design: StudioDesign;
  spec: StudioSpec;
  activeSide: "recto" | "verso";
  onSwitchSide: (side: "recto" | "verso") => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  saveState: SaveState;
  savedAt: number | null;
  onContinueToPrint: () => void;
  onPreview: () => void;
  onCopyRectoToVerso: () => void;
  hasVerso: boolean;
  rectoHasContent: boolean;
}

const iconBtn = (enabled: boolean) =>
  `h-9 w-9 flex items-center justify-center rounded-lg transition active:scale-90 ${
    enabled ? "text-white/80 hover:text-white hover:bg-white/10 cursor-pointer" : "text-white/20 cursor-not-allowed"
  }`;

export default function StudioToolbar({
  design,
  spec,
  activeSide,
  onSwitchSide,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  saveState,
  savedAt,
  onContinueToPrint,
  onPreview,
  onCopyRectoToVerso,
  hasVerso,
  rectoHasContent,
}: StudioToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [menuOpen]);

  const time = savedAt ? new Date(savedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : null;

  return (
    <header className="relative shrink-0 bg-[#080518]/95 backdrop-blur-xl border-b border-white/10 px-2 sm:px-4 py-1.5 md:py-0 md:h-14 flex flex-wrap md:flex-nowrap items-center justify-between gap-x-2 gap-y-1.5 z-30 select-none">
      <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-av-violet/70 to-transparent" />

      {/* Left: back + document identity (always visible) */}
      <div className="flex items-center gap-1.5 md:gap-3 min-w-0">
        <Link
          href="/studio"
          className="h-9 flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition px-2 rounded-lg hover:bg-white/5 shrink-0"
          aria-label="Quitter le Studio"
        >
          <ArrowLeft size={16} />
          <span className="hidden lg:inline">Quitter</span>
        </Link>

        <div className="relative min-w-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="h-9 max-w-full flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] pl-3 pr-2 text-left transition cursor-pointer"
            title="Changer de support ou de format"
          >
            <span className="min-w-0 leading-tight">
              <span className="block text-xs font-bold text-white truncate">{spec.title}</span>
              <span className="block text-[10px] text-av-orange font-mono truncate">{spec.dimensionsLabel}</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-semibold text-white/60 shrink-0">Modifier</span>
            <ChevronDown size={14} className={`text-white/50 shrink-0 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <div
              role="dialog"
              aria-label="Changer de support ou de format"
              className="studio-pop absolute left-0 top-full mt-2 w-[min(92vw,340px)] rounded-2xl border border-white/10 bg-[#120c28]/95 backdrop-blur-xl p-4 shadow-2xl z-50 space-y-3"
            >
              <div>
                <p className="text-xs font-bold text-white">{design.productName}</p>
                <p className="text-[11px] text-white/55 mt-0.5">
                  {spec.title} · {spec.dimensionsLabel}
                  {spec.bleedMm ? ` · fond perdu ${spec.bleedMm} mm` : ""}
                </p>
              </div>
              <p className="text-[11px] text-white/65 leading-relaxed rounded-lg bg-white/[0.05] p-2.5">
                Votre création est enregistrée pour <strong className="text-white">ce support et ce format</strong>. En changer ouvre un
                autre document : celui-ci reste conservé et reste accessible depuis la page Studio (« Reprendre une création en cours »).
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/studio/nouveau?${specToQuery(spec)}`}
                  className="h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-av-orange to-av-magenta text-xs font-extrabold uppercase tracking-wider text-white hover:brightness-110 transition"
                >
                  Changer de format
                </Link>
                <Link
                  href="/studio"
                  className="h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition"
                >
                  Changer de support
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: preview & CTA */}
      <div className="flex items-center gap-1.5 shrink-0 md:order-3">
        <button
          onClick={onPreview}
          className="h-10 w-10 sm:w-auto sm:px-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-full transition active:scale-95 cursor-pointer"
          aria-label="Aperçu"
        >
          <Eye size={15} />
          <span className="hidden sm:inline leading-none">Aperçu</span>
        </button>

        <button
          onClick={onContinueToPrint}
          className="h-10 px-4 xl:px-5 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-to-r from-av-orange to-av-magenta text-white rounded-full text-xs font-extrabold uppercase tracking-wider leading-none transition-all shadow-lg shadow-av-orange/25 hover:shadow-av-magenta/40 hover:brightness-110 active:scale-95 cursor-pointer"
        >
          <Printer size={15} className="shrink-0" />
          <span className="hidden xl:inline">Continuer vers l&apos;impression</span>
          <span className="xl:hidden">Imprimer</span>
        </button>
      </div>

      {/* Center: history + sides + save state (second row on phones) */}
      <div className="order-last md:order-2 w-full md:w-auto flex items-center justify-center md:justify-start gap-1.5 sm:gap-3 min-w-0">
        <div className="flex items-center bg-white/[0.04] p-0.5 rounded-xl border border-white/10 shrink-0">
          <button onClick={onUndo} disabled={!canUndo} className={iconBtn(canUndo)} title="Annuler (Ctrl+Z)" aria-label="Annuler">
            <Undo2 size={15} />
          </button>
          <button onClick={onRedo} disabled={!canRedo} className={iconBtn(canRedo)} title="Rétablir (Ctrl+Y)" aria-label="Rétablir">
            <Redo2 size={15} />
          </button>
        </div>

        {hasVerso && (
          <div className="relative flex bg-white/[0.04] p-0.5 rounded-xl border border-white/10 text-xs shrink-0" role="tablist" aria-label="Face">
            {(
              [
                ["recto", "Recto"],
                ["verso", "Verso"],
              ] as const
            ).map(([side, name]) => {
              const active = activeSide === side;
              return (
                <button
                  key={side}
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSwitchSide(side)}
                  className={`relative h-9 px-3.5 rounded-[10px] font-bold transition-colors cursor-pointer ${
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
                  <span className="relative">{name}</span>
                </button>
              );
            })}
          </div>
        )}

        {hasVerso && rectoHasContent && (
          <button
            onClick={onCopyRectoToVerso}
            className="h-9 px-2.5 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 text-[11px] font-semibold text-white/75 hover:text-white transition active:scale-95 cursor-pointer shrink-0"
            title="Copier le recto vers le verso (remplace le verso, annulable avec Ctrl+Z)"
          >
            <CopyPlus size={14} />
            <span className="hidden lg:inline">Copier le recto vers le verso</span>
            <span className="lg:hidden hidden sm:inline">Recto → verso</span>
          </button>
        )}

        <div
          className={`flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full border shrink-0 ${
            saveState === "saved"
              ? "text-emerald-300/90 bg-emerald-500/10 border-emerald-500/20"
              : saveState === "archive"
              ? "text-sky-300 bg-sky-500/10 border-sky-500/30"
              : "text-red-300 bg-red-500/10 border-red-500/30"
          }`}
          role="status"
          aria-live="polite"
          title={
            saveState === "archive"
              ? "Copie de travail du projet archivé : non enregistrée."
              : saveState === "saved"
              ? time
                ? `Enregistré sur cet appareil à ${time}`
                : "Brouillon enregistré sur cet appareil"
              : "L'enregistrement automatique est impossible (stockage du navigateur plein ou bloqué). Exportez votre travail avant de quitter."
          }
        >
          {saveState === "error" ? <AlertTriangle size={12} /> : <Check size={12} />}
          <span className="hidden sm:inline">
            {saveState === "archive" ? "Copie locale" : saveState === "saved" ? (time ? `Brouillon enregistré à ${time}` : "Brouillon enregistré") : "Non enregistré — stockage bloqué"}
          </span>
        </div>
      </div>
    </header>
  );
}
