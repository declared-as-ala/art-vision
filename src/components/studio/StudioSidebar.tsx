"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StudioDesign, StudioElement, StudioTemplate } from "./studioTypes";
import StudioCardPreview from "./StudioCardPreview";
import {
  DPI_COLORS,
  STUDIO_FONTS,
  STUDIO_PALETTE,
  getImageDpi,
} from "./studioUtils";
import {
  AlertTriangle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Bold,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Copy,
  Image as ImageIcon,
  ImagePlus,
  Italic,
  Layers,
  Minus,
  Palette,
  Plus,
  ShieldCheck,
  Sparkles,
  Square,
  Trash2,
  Type,
} from "lucide-react";

interface StudioSidebarProps {
  design: StudioDesign;
  activeSide: "recto" | "verso";
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onAddElement: (element: StudioElement) => void;
  onUpdateElement: (id: string, updates: Partial<StudioElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onUpdateBackgroundColor: (color: string) => void;
  onApplyTemplate: (template: StudioTemplate) => void;
  /** Templates sized for the document being edited */
  templates: StudioTemplate[];
  /** Virtual keyboard open on a phone: hide the bottom sheet */
  keyboardOpen?: boolean;
}

type SidebarTab = "templates" | "text" | "shapes" | "images" | "background" | "layers";

const TABS: { id: SidebarTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "templates", label: "Modèles", icon: Sparkles },
  { id: "text", label: "Texte", icon: Type },
  { id: "shapes", label: "Formes", icon: Square },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "background", label: "Fond", icon: Palette },
  { id: "layers", label: "Calques", icon: Layers },
];

const CATEGORY_LABELS: Record<string, string> = {
  artisan: "Artisans",
  restaurant: "Restaurants",
  commerce: "Commerces",
  beaute: "Beauté",
  freelance: "Studios",
};
const templateFilterKey = (t: StudioTemplate) => (t.category === "promo" ? t.categoryLabel : t.category);

const BACKGROUNDS = [
  { name: "Nuit pure", color: "#08051F" },
  { name: "Violet sombre", color: "#1A1238" },
  { name: "Noir mat", color: "#121214" },
  { name: "Blanc pur", color: "#ffffff" },
  { name: "Crème doux", color: "#fdf8f5" },
  { name: "Or noir", color: "#1a140f" },
  { name: "Anthracite", color: "#1e1e24" },
  { name: "Bleu nuit", color: "#0f172a" },
];

const field =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-av-magenta focus:bg-white/[0.06] transition";
const label = "text-[10px] font-semibold uppercase tracking-wider text-white/45";

/* ───────────────────────── Sub-components ───────────────────────── */

function Advanced({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition cursor-pointer"
      >
        Options avancées
        <ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && <div className="space-y-4 px-3 pb-3">{children}</div>}
    </div>
  );
}

function PanelTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
      {hint && <p className="text-[11px] text-white/45 mt-0.5 leading-snug">{hint}</p>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-av-orange">{children}</span>
      <span className="flex-1 h-px bg-gradient-to-r from-av-orange/30 to-transparent" />
    </div>
  );
}

function ColorField({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (color: string) => void;
}) {
  const safe = /^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={label}>{title}</span>
        <span className="text-[10px] font-mono text-white/40 uppercase">{value === "transparent" ? "aucun" : value}</span>
      </div>
      <div className="grid grid-cols-8 gap-1.5">
        {STUDIO_PALETTE.map((c) => {
          const active = c.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={c}
              type="button"
              aria-label={`Couleur ${c}`}
              onClick={() => onChange(c)}
              className={`relative aspect-square rounded-full border transition hover:scale-110 active:scale-95 cursor-pointer ${
                active ? "border-white ring-2 ring-av-orange ring-offset-1 ring-offset-[#0a0618]" : "border-white/20"
              }`}
              style={{ backgroundColor: c }}
            >
              {active && (
                <Check
                  size={11}
                  className="absolute inset-0 m-auto"
                  style={{ color: ["#ffffff", "#f59e0b", "#d4af37", "#94a3b8", "#06b6d4", "#10b981"].includes(c) ? "#000" : "#fff" }}
                />
              )}
            </button>
          );
        })}
        <label
          className="relative aspect-square rounded-full cursor-pointer hover:scale-110 transition border border-white/30 overflow-hidden"
          title="Couleur personnalisée"
          style={{
            background:
              "conic-gradient(from 0deg, #ff0044, #ff9900, #ffee00, #22dd66, #00ccff, #6644ff, #ff00cc, #ff0044)",
          }}
        >
          <input
            type="color"
            value={safe}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>
    </div>
  );
}

function FontPicker({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = STUDIO_FONTS.find((f) => f.name === value) || STUDIO_FONTS[0];

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div ref={ref} className="space-y-1.5">
      <span className={label}>Typographie</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`${field} flex items-center justify-between !py-2.5 cursor-pointer hover:border-white/25`}
      >
        <span className="flex items-baseline gap-2 min-w-0">
          <span className="text-lg leading-none truncate" style={{ fontFamily: `"${current.name}", sans-serif` }}>
            {current.label}
          </span>
          <span className="text-[10px] text-white/35 shrink-0">{current.tag}</span>
        </span>
        <ChevronDown size={14} className={`text-white/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden rounded-xl border border-white/10 bg-[#120c28]"
          >
            {STUDIO_FONTS.map((f) => {
              const active = f.name === current.name;
              return (
                <li key={f.name}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(f.name);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition cursor-pointer ${
                      active ? "bg-av-violet/25" : "hover:bg-white/5"
                    }`}
                  >
                    <span>
                      <span className="block text-xl leading-tight text-white" style={{ fontFamily: `"${f.name}", sans-serif` }}>
                        {f.sample}
                      </span>
                      <span className="text-[10px] text-white/40">
                        {f.label} · {f.tag}
                      </span>
                    </span>
                    {active && <Check size={14} className="text-av-orange shrink-0" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function DpiGauge({ element, compact = false }: { element: StudioElement; compact?: boolean }) {
  const isVector = element.src?.startsWith("data:image/svg");
  const report = getImageDpi(element);

  if (isVector) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-300">
        <ShieldCheck size={14} className="shrink-0" />
        <span>Logo vectoriel (SVG) — netteté parfaite à toutes les tailles.</span>
      </div>
    );
  }
  if (!report) return null;
  const colors = DPI_COLORS[report.level];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
      <div className="flex items-end justify-between">
        <span className={label}>Qualité PAO</span>
        <span className={`text-lg font-extrabold tabular-nums leading-none ${colors.text}`}>
          {report.dpi} <span className="text-[10px] font-semibold opacity-70">DPI</span>
        </span>
      </div>
      <div className="relative h-2 rounded-full overflow-hidden bg-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          initial={false}
          animate={{ width: `${report.percent}%`, backgroundColor: colors.bar }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          style={{ boxShadow: `0 0 12px ${colors.glow}` }}
        />
        {/* threshold ticks: 150 DPI / 300 DPI */}
        <span className="absolute top-0 bottom-0 left-1/2 w-px bg-black/50" />
      </div>
      {!compact && (
        <>
          <div className="flex justify-between text-[9px] text-white/30 font-medium">
            <span>0</span>
            <span>150</span>
            <span>300 DPI</span>
          </div>
          <p className={`text-[11px] leading-snug flex items-start gap-1.5 ${colors.text}`}>
            {report.level === "excellent" ? (
              <Check size={13} className="shrink-0 mt-px" />
            ) : (
              <AlertTriangle size={13} className="shrink-0 mt-px" />
            )}
            <span>{report.label}</span>
          </p>
        </>
      )}
    </div>
  );
}

function RangeField({
  title,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  title: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className={label}>{title}</span>
        <span className="text-[11px] font-bold text-white tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[#D72888] cursor-pointer"
      />
    </div>
  );
}

/* ───────────────────────── Main component ───────────────────────── */

export default function StudioSidebar({
  design,
  activeSide,
  selectedElementId,
  onSelectElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  onUpdateBackgroundColor,
  onApplyTemplate,
  templates,
  keyboardOpen = false,
}: StudioSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("templates");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false); // mobile bottom sheet
  const [pendingTemplate, setPendingTemplate] = useState<StudioTemplate | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const currentSide = activeSide === "recto" ? design.recto : design.verso;
  const selectedElement = currentSide.elements.find((el) => el.id === selectedElementId) || null;

  // Selecting an element opens its properties automatically
  const [lastSelected, setLastSelected] = useState<string | null>(null);
  if (lastSelected !== selectedElementId) {
    setLastSelected(selectedElementId);
    if (selectedElement) {
      setActiveTab(selectedElement.type === "text" ? "text" : selectedElement.type === "image" ? "images" : "shapes");
    }
  }

  const filterKeys = Array.from(new Set(templates.map(templateFilterKey)));
  const imageElements = currentSide.elements.filter((el) => el.type === "image");

  // Image import (click or drag & drop)
  const processFile = (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Format non pris en charge. Importez un fichier PNG, JPG, SVG ou WebP.");
      return;
    }
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const isSvg = file.type === "image/svg+xml";
        const aspect = img.width && img.height ? img.width / img.height : 1;
        const defaultWidth = Math.min(30, design.widthMm - 10);
        const defaultHeight = defaultWidth / aspect;

        onAddElement({
          id: `img-${Date.now()}`,
          type: "image",
          x: (design.widthMm - defaultWidth) / 2,
          y: (design.heightMm - defaultHeight) / 2,
          width: Math.round(defaultWidth),
          height: Math.round(defaultHeight),
          src,
          naturalWidth: isSvg ? undefined : img.width,
          naturalHeight: isSvg ? undefined : img.height,
        });
      };
      img.onerror = () => setUploadError("Impossible de lire cette image. Essayez un autre fichier.");
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const openTab = (tab: SidebarTab) => {
    setActiveTab(tab);
    setSheetOpen(true);
  };

  const shapeBtn =
    "group p-3 bg-white/[0.04] hover:bg-av-violet/25 border border-white/10 hover:border-av-violet/60 rounded-2xl flex flex-col items-center gap-2 text-[11px] font-semibold text-white/85 transition active:scale-95 cursor-pointer";

  return (
    <aside
      className={`order-2 md:order-1 shrink-0 flex flex-col md:flex-row bg-[#0a0618] border-t md:border-t-0 md:border-r border-white/10 z-20 overflow-hidden
        md:h-full md:w-[340px]
        max-md:transition-[height] max-md:duration-300 max-md:ease-[cubic-bezier(0.32,0.72,0,1)]
        ${keyboardOpen ? "max-md:hidden" : sheetOpen ? "max-md:h-[52dvh]" : "max-md:h-[92px]"}`}
      aria-label="Outils de création"
    >
      {/* Mobile drag handle */}
      <motion.button
        type="button"
        aria-label={sheetOpen ? "Replier le panneau" : "Déplier le panneau"}
        onTap={() => setSheetOpen((v) => !v)}
        onPanEnd={(_, info) => {
          if (info.offset.y < -24) setSheetOpen(true);
          else if (info.offset.y > 24) setSheetOpen(false);
        }}
        style={{ touchAction: "none" }}
        className="md:hidden flex items-center justify-center h-6 shrink-0 cursor-grab"
      >
        <span className="w-10 h-1 rounded-full bg-white/25" />
      </motion.button>

      {/* Tab rail: vertical on desktop, horizontal on mobile */}
      <nav
        className="flex md:flex-col shrink-0 md:w-[68px] gap-0.5 md:gap-1 px-1.5 md:px-2 py-1 md:py-3 md:border-r border-white/10 bg-[#07040f] overflow-x-auto md:overflow-y-auto no-scrollbar"
        role="tablist"
        aria-label="Outils"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => openTab(tab.id)}
              className={`relative flex-1 md:flex-none min-w-[54px] py-2 md:py-2.5 flex flex-col items-center gap-1 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                isActive ? "text-white" : "text-white/50 hover:text-white/90"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="studio-tab-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-av-violet/40 to-av-magenta/25 border border-av-violet/50 shadow-[0_0_20px_-4px_rgba(108,43,217,0.7)]"
                />
              )}
              <motion.span
                className="relative"
                animate={{ scale: isActive ? 1.12 : 1, y: isActive ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
              >
                <Icon size={18} className={isActive ? "text-av-orange" : ""} />
              </motion.span>
              <span className="relative">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Panel */}
      <div className="flex-1 min-w-0 min-h-0 overflow-y-auto overscroll-contain p-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-y-4 text-left"
        >
          {/* ── TEMPLATES ── */}
          {activeTab === "templates" && (
            <>
              <PanelTitle title="Modèles pour ce format" hint={`Dimensions exactes : ${design.widthMm / 10 >= 100 ? design.widthMm / 10 + " × " + design.heightMm / 10 + " cm" : design.widthMm + " × " + design.heightMm + " mm"}. Appliquer un modèle remplace votre création (annulable).`} />

              <div className="flex flex-wrap gap-1.5">
                {(filterKeys.length > 1 ? ["all", ...filterKeys] : []).map((id) => ({ id, label: id === "all" ? "Tous" : CATEGORY_LABELS[id] ?? id })).map((c) => {
                  const active = selectedCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategory(c.id)}
                      className={`relative px-3 py-1.5 text-[11px] rounded-full font-semibold transition-colors cursor-pointer ${
                        active ? "text-white" : "text-white/55 bg-white/[0.04] hover:bg-white/10"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="studio-cat-pill"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-av-violet to-av-magenta"
                        />
                      )}
                      <span className="relative">{c.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {pendingTemplate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-av-orange/40 bg-av-orange/10 p-3 space-y-2.5">
                      <p className="text-xs text-white/90 leading-snug">
                        Appliquer « <strong>{pendingTemplate.name}</strong> » ? Votre création actuelle sera remplacée
                        (annulable avec Ctrl+Z).
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onApplyTemplate(pendingTemplate);
                            setPendingTemplate(null);
                          }}
                          className="flex-1 py-2 rounded-lg bg-gradient-to-r from-av-orange to-av-magenta text-[11px] font-extrabold text-white cursor-pointer active:scale-95 transition"
                        >
                          Appliquer
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingTemplate(null)}
                          className="px-4 py-2 rounded-lg bg-white/10 text-[11px] font-semibold text-white/80 hover:bg-white/15 cursor-pointer transition"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 gap-3">
                {templates.filter((t) => selectedCategory === "all" || templateFilterKey(t) === selectedCategory).map(
                  (t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPendingTemplate(t)}
                      className="group text-left rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 hover:border-av-orange/70 hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(255,106,0,0.35)] transition-all duration-200 cursor-pointer"
                    >
                      <div className={`flex justify-center ${t.design.heightMm > t.design.widthMm ? "py-1" : ""}`}>
                        <StudioCardPreview
                          side={t.design.recto}
                          widthMm={t.design.widthMm}
                          heightMm={t.design.heightMm}
                          paper
                          className={t.design.heightMm > t.design.widthMm ? "w-[55%]" : "w-full"}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-2.5 px-0.5">
                        <span className="text-xs font-bold text-white group-hover:text-av-orange transition truncate">
                          {t.name}
                        </span>
                        <span className="text-[9px] text-white/45 bg-white/5 px-2 py-0.5 rounded-full shrink-0">
                          {t.categoryLabel.split(/[&,]/)[0].trim()}
                        </span>
                      </div>
                    </button>
                  )
                )}
              </div>
            </>
          )}

          {/* ── TEXT ── */}
          {activeTab === "text" && (
            <>
              <PanelTitle title="Ajouter du texte" hint="Double-cliquez sur un texte du document pour l'écrire directement." />

              <div className="space-y-2">
                {[
                  {
                    title: "Titre principal",
                    size: 15,
                    cls: "text-lg font-extrabold",
                    el: {
                      y: 15,
                      height: 8,
                      text: "VOTRE TITRE ICI",
                      fontSize: 15,
                      fontWeight: "bold" as const,
                      color: "#ffffff",
                    },
                  },
                  {
                    title: "Sous-titre",
                    size: 9,
                    cls: "text-sm font-semibold text-av-orange",
                    el: {
                      y: 25,
                      height: 6,
                      text: "Sous-titre ou activité",
                      fontSize: 9,
                      fontWeight: "600" as const,
                      color: "#FF6A00",
                    },
                  },
                  {
                    title: "Coordonnées / texte",
                    size: 7.5,
                    cls: "text-xs text-white/80",
                    el: {
                      y: 35,
                      height: 5,
                      text: "+33 6 00 00 00 00 • contact@email.fr",
                      fontSize: 7.5,
                      color: "#e2e8f0",
                    },
                  },
                ].map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() =>
                      onAddElement({
                        id: `text-${Date.now()}`,
                        type: "text",
                        x: 10,
                        width: 65,
                        fontFamily: "Montserrat",
                        textAlign: "center",
                        ...preset.el,
                      })
                    }
                    className="w-full px-3 py-3 bg-white/[0.04] hover:bg-av-violet/25 border border-white/10 hover:border-av-violet/60 rounded-2xl text-left flex items-center justify-between transition active:scale-[0.98] cursor-pointer"
                  >
                    <span className={preset.cls}>{preset.title}</span>
                    <span className="flex items-center gap-1.5 text-[10px] text-white/40 shrink-0">
                      {preset.size} pt <Plus size={13} className="text-av-orange" />
                    </span>
                  </button>
                ))}
              </div>

              {selectedElement && selectedElement.type === "text" && (
                <div className="pt-3 space-y-4">
                  <SectionLabel>Propriétés du texte</SectionLabel>

                  <div className="space-y-1.5">
                    <span className={label}>Contenu (synchronisé avec le document)</span>
                    <textarea
                      rows={2}
                      value={selectedElement.text || ""}
                      onChange={(e) => onUpdateElement(selectedElement.id, { text: e.target.value })}
                      className={`${field} resize-none`}
                    />
                  </div>

                  <FontPicker
                    value={selectedElement.fontFamily || "Montserrat"}
                    onChange={(name) => onUpdateElement(selectedElement.id, { fontFamily: name })}
                  />

                  <RangeField
                    title="Taille"
                    value={selectedElement.fontSize || 12}
                    min={4}
                    max={40}
                    step={0.5}
                    suffix=" pt"
                    onChange={(v) => onUpdateElement(selectedElement.id, { fontSize: v })}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex bg-white/[0.04] border border-white/10 rounded-xl p-1">
                      {(
                        [
                          ["left", AlignLeft],
                          ["center", AlignCenter],
                          ["right", AlignRight],
                        ] as const
                      ).map(([v, Icon]) => (
                        <button
                          key={v}
                          type="button"
                          aria-label={`Alignement ${v}`}
                          onClick={() => onUpdateElement(selectedElement.id, { textAlign: v })}
                          className={`flex-1 py-1.5 rounded-lg flex justify-center transition cursor-pointer ${
                            (selectedElement.textAlign || "left") === v
                              ? "bg-gradient-to-br from-av-violet to-av-magenta text-white"
                              : "text-white/55 hover:text-white"
                          }`}
                        >
                          <Icon size={14} />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        aria-label="Gras"
                        onClick={() =>
                          onUpdateElement(selectedElement.id, {
                            fontWeight: selectedElement.fontWeight === "bold" ? "normal" : "bold",
                          })
                        }
                        className={`flex-1 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                          selectedElement.fontWeight === "bold"
                            ? "bg-gradient-to-br from-av-violet to-av-magenta border-transparent text-white"
                            : "bg-white/[0.04] border-white/10 text-white/60 hover:text-white"
                        }`}
                      >
                        <Bold size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Italique"
                        onClick={() =>
                          onUpdateElement(selectedElement.id, {
                            fontStyle: selectedElement.fontStyle === "italic" ? "normal" : "italic",
                          })
                        }
                        className={`flex-1 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                          selectedElement.fontStyle === "italic"
                            ? "bg-gradient-to-br from-av-violet to-av-magenta border-transparent text-white"
                            : "bg-white/[0.04] border-white/10 text-white/60 hover:text-white"
                        }`}
                      >
                        <Italic size={14} />
                      </button>
                    </div>
                  </div>

                  <ColorField
                    title="Couleur du texte"
                    value={selectedElement.color || "#ffffff"}
                    onChange={(c) => onUpdateElement(selectedElement.id, { color: c })}
                  />

                  <Advanced>
                    <RangeField
                      title="Interligne"
                      value={selectedElement.lineHeight ?? 1.3}
                      min={0.9}
                      max={2}
                      step={0.05}
                      onChange={(v) => onUpdateElement(selectedElement.id, { lineHeight: Math.round(v * 100) / 100 })}
                    />
                    <RangeField
                      title="Espacement des lettres"
                      value={selectedElement.letterSpacing ?? 0}
                      min={0}
                      max={8}
                      step={0.5}
                      onChange={(v) => onUpdateElement(selectedElement.id, { letterSpacing: v })}
                    />
                    <RangeField
                      title="Opacité"
                      value={Math.round((selectedElement.opacity ?? 1) * 100)}
                      min={10}
                      max={100}
                      step={5}
                      suffix=" %"
                      onChange={(v) => onUpdateElement(selectedElement.id, { opacity: v / 100 })}
                    />
                  </Advanced>
                </div>
              )}
            </>
          )}

          {/* ── SHAPES ── */}
          {activeTab === "shapes" && (
            <>
              <PanelTitle title="Formes géométriques" hint="Blocs, séparateurs et cadres décoratifs." />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onAddElement({
                      id: `rect-${Date.now()}`,
                      type: "rect",
                      x: 10,
                      y: 10,
                      width: 30,
                      height: 20,
                      fill: "#6C2BD9",
                    })
                  }
                  className={shapeBtn}
                >
                  <Square size={26} className="text-av-magenta group-hover:scale-110 transition" fill="currentColor" fillOpacity={0.25} />
                  Rectangle
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onAddElement({
                      id: `circle-${Date.now()}`,
                      type: "circle",
                      x: 25,
                      y: 15,
                      width: 20,
                      height: 20,
                      fill: "#FF6A00",
                    })
                  }
                  className={shapeBtn}
                >
                  <Circle size={26} className="text-av-orange group-hover:scale-110 transition" fill="currentColor" fillOpacity={0.25} />
                  Cercle
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onAddElement({
                      id: `line-${Date.now()}`,
                      type: "line",
                      x: 10,
                      y: 27,
                      width: 40,
                      height: 1,
                      stroke: "#ffffff",
                      strokeWidth: 0.5,
                    })
                  }
                  className={shapeBtn}
                >
                  <Minus size={26} className="text-white group-hover:scale-110 transition" />
                  Ligne
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onAddElement({
                      id: `frame-${Date.now()}`,
                      type: "rect",
                      x: 4,
                      y: 4,
                      width: design.widthMm - 8,
                      height: design.heightMm - 8,
                      fill: "transparent",
                      stroke: "#D72888",
                      strokeWidth: 0.5,
                    })
                  }
                  className={shapeBtn}
                >
                  <Square size={26} className="text-av-magenta group-hover:scale-110 transition" />
                  Cadre
                </button>
              </div>

              {selectedElement &&
                (selectedElement.type === "rect" ||
                  selectedElement.type === "circle" ||
                  selectedElement.type === "line") && (
                  <div className="pt-3 space-y-4">
                    <SectionLabel>Propriétés de la forme</SectionLabel>

                    {selectedElement.type !== "line" && (
                      <ColorField
                        title="Couleur de fond"
                        value={selectedElement.fill || "#6C2BD9"}
                        onChange={(c) => onUpdateElement(selectedElement.id, { fill: c })}
                      />
                    )}

                    <ColorField
                      title="Contour"
                      value={selectedElement.stroke || "#ffffff"}
                      onChange={(c) => onUpdateElement(selectedElement.id, { stroke: c })}
                    />

                    <Advanced>
                      <RangeField
                      title="Épaisseur du contour"
                      value={selectedElement.strokeWidth || 0}
                      min={0}
                      max={5}
                      step={0.5}
                      suffix=" mm"
                      onChange={(v) => onUpdateElement(selectedElement.id, { strokeWidth: v })}
                    />

                      <RangeField
                      title="Opacité"
                      value={Math.round((selectedElement.opacity ?? 1) * 100)}
                      min={10}
                      max={100}
                      step={5}
                      suffix=" %"
                      onChange={(v) => onUpdateElement(selectedElement.id, { opacity: v / 100 })}
                    />
                    </Advanced>
                  </div>
                )}
            </>
          )}

          {/* ── IMAGES ── */}
          {activeTab === "images" && (
            <>
              <PanelTitle title="Logo & images" hint="PNG transparent, JPG, SVG ou WebP. Glissez-déposez ou cliquez." />

              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  processFile(e.dataTransfer.files?.[0]);
                }}
                className={`relative block w-full rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 overflow-hidden border-2 border-dashed ${
                  dragOver
                    ? "border-av-orange bg-av-orange/10 scale-[1.02] shadow-[0_0_40px_-10px_rgba(255,106,0,0.6)]"
                    : "border-av-violet/40 hover:border-av-magenta/70 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <motion.div
                  animate={dragOver ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
                  className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-gradient-to-br from-av-violet to-av-magenta flex items-center justify-center shadow-lg shadow-av-magenta/30"
                >
                  <ImagePlus size={22} className="text-white" />
                </motion.div>
                <span className="text-xs font-bold text-white block">
                  {dragOver ? "Déposez pour importer" : "Glissez votre logo ici"}
                </span>
                <span className="text-[10px] text-white/45 block mt-1">ou cliquez pour parcourir vos fichiers</span>
                <span className="inline-block mt-3 text-[10px] font-semibold text-av-orange bg-av-orange/10 border border-av-orange/20 rounded-full px-2.5 py-0.5">
                  Idéal : 300 DPI minimum
                </span>
              </label>

              {uploadError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 text-red-300 text-xs">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                  <p>{uploadError}</p>
                </div>
              )}

              {selectedElement && selectedElement.type === "image" && (
                <div className="space-y-3">
                  <SectionLabel>Image sélectionnée</SectionLabel>
                  <DpiGauge element={selectedElement} />
                  <RangeField
                    title="Opacité"
                    value={Math.round((selectedElement.opacity ?? 1) * 100)}
                    min={10}
                    max={100}
                    step={5}
                    suffix=" %"
                    onChange={(v) => onUpdateElement(selectedElement.id, { opacity: v / 100 })}
                  />
                </div>
              )}

              {imageElements.length > 0 && (
                <div className="space-y-2">
                  <SectionLabel>Sur cette face ({imageElements.length})</SectionLabel>
                  {imageElements.map((el) => {
                    const report = getImageDpi(el);
                    const active = el.id === selectedElementId;
                    return (
                      <button
                        key={el.id}
                        type="button"
                        onClick={() => onSelectElement(el.id)}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl border text-left transition cursor-pointer ${
                          active
                            ? "border-av-orange/60 bg-av-orange/10"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={el.src}
                          alt=""
                          className="w-10 h-10 rounded-lg object-contain bg-[repeating-conic-gradient(#1c1535_0%_25%,#120c28_0%_50%)] bg-[length:10px_10px]"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="block text-[11px] font-semibold text-white truncate">Image / Logo</span>
                          <span
                            className={`block text-[10px] font-bold ${
                              report ? DPI_COLORS[report.level].text : "text-emerald-300"
                            }`}
                          >
                            {report ? `${report.dpi} DPI` : "Vectoriel"}
                          </span>
                        </span>
                        {report && (
                          <span className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden shrink-0">
                            <span
                              className="block h-full rounded-full"
                              style={{ width: `${report.percent}%`, backgroundColor: DPI_COLORS[report.level].bar }}
                            />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── BACKGROUND ── */}
          {activeTab === "background" && (
            <>
              <PanelTitle title={`Arrière-plan (${activeSide})`} hint="Modifiez la couleur de fond de cette face." />

              <label className="flex items-center justify-between p-3 bg-white/[0.04] rounded-2xl border border-white/10 cursor-pointer hover:bg-white/[0.07] transition">
                <span className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-xl border border-white/25 shadow-inner"
                    style={{ backgroundColor: currentSide.backgroundColor }}
                  />
                  <span>
                    <span className="block text-xs font-semibold text-white">Couleur personnalisée</span>
                    <span className="block text-[10px] font-mono text-white/40 uppercase">
                      {currentSide.backgroundColor}
                    </span>
                  </span>
                </span>
                <input
                  type="color"
                  value={currentSide.backgroundColor}
                  onChange={(e) => onUpdateBackgroundColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
              </label>

              <div className="space-y-2">
                <span className={label}>Palettes Art Vision</span>
                <div className="grid grid-cols-4 gap-2">
                  {BACKGROUNDS.map((b) => {
                    const active = currentSide.backgroundColor.toLowerCase() === b.color.toLowerCase();
                    return (
                      <button
                        key={b.name}
                        type="button"
                        onClick={() => onUpdateBackgroundColor(b.color)}
                        className="group flex flex-col items-center gap-1.5 cursor-pointer"
                      >
                        <span
                          className={`relative w-full aspect-[85/55] rounded-lg border transition group-hover:scale-105 group-active:scale-95 ${
                            active ? "border-av-orange ring-2 ring-av-orange/50" : "border-white/20"
                          }`}
                          style={{ backgroundColor: b.color }}
                        >
                          {active && (
                            <Check
                              size={13}
                              className="absolute inset-0 m-auto"
                              style={{ color: ["#ffffff", "#fdf8f5"].includes(b.color) ? "#000" : "#fff" }}
                            />
                          )}
                        </span>
                        <span className="text-[9px] text-white/50 truncate w-full text-center">{b.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── LAYERS ── */}
          {activeTab === "layers" && (
            <>
              <PanelTitle
                title={`Calques (${activeSide})`}
                hint={`${currentSide.elements.length} élément(s) · le plus haut est au premier plan.`}
              />

              {currentSide.elements.length === 0 && (
                <p className="text-xs text-white/40 text-center py-8 border border-dashed border-white/10 rounded-2xl">
                  Cette face est vide. Ajoutez du texte, une forme ou un logo.
                </p>
              )}

              <div className="space-y-1.5">
                {[...currentSide.elements]
                  .map((el, idx) => ({ el, idx }))
                  .reverse()
                  .map(({ el, idx }) => {
                    const isSelected = el.id === selectedElementId;
                    const TypeIcon =
                      el.type === "text" ? Type : el.type === "image" ? ImageIcon : el.type === "circle" ? Circle : el.type === "line" ? Minus : Square;
                    return (
                      <div
                        key={el.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectElement(el.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") onSelectElement(el.id);
                        }}
                        className={`flex items-center justify-between gap-2 p-2 rounded-xl text-xs transition cursor-pointer border ${
                          isSelected
                            ? "bg-gradient-to-r from-av-orange/20 to-av-magenta/15 border-av-orange/50 text-white"
                            : "bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/[0.07]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-av-orange text-white" : "bg-white/5 text-white/50"
                            }`}
                          >
                            <TypeIcon size={13} />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold">
                              {el.type === "text"
                                ? el.text?.slice(0, 22) || "Texte"
                                : el.type === "image"
                                ? "Image / Logo"
                                : el.type === "rect"
                                ? "Rectangle"
                                : el.type === "circle"
                                ? "Cercle"
                                : "Ligne"}
                            </span>
                            <span className="text-[10px] text-white/35">Calque {idx + 1}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-0.5 shrink-0">
                          {(
                            [
                              ["Monter d'un niveau", ArrowUp, onBringForward],
                              ["Descendre d'un niveau", ArrowDown, onSendBackward],
                              ["Dupliquer", Copy, onDuplicateElement],
                            ] as const
                          ).map(([title, Icon, action]) => (
                            <button
                              key={title}
                              type="button"
                              title={title}
                              onClick={(e) => {
                                e.stopPropagation();
                                action(el.id);
                              }}
                              className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
                            >
                              <Icon size={12} />
                            </button>
                          ))}
                          <button
                            type="button"
                            title="Supprimer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteElement(el.id);
                            }}
                            className="p-1.5 rounded-md text-white/50 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </aside>
  );
}
