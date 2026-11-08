"use client";

import React, { useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Bold,
  Copy,
  Italic,
  Minus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import type { StudioElement } from "./studioTypes";
import { STUDIO_PALETTE, getColorKey, getElementColor, getImageDpi, DPI_COLORS } from "./studioUtils";

interface StudioFloatingInspectorProps {
  element: StudioElement;
  onUpdate: (updates: Partial<StudioElement>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  /** Start in-place text editing (text elements). */
  onEditText?: () => void;
  /** Phone layout: wraps instead of overflowing, popovers open upwards. */
  compact?: boolean;
}

const btn =
  "h-8 min-w-8 px-1.5 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 active:scale-90 transition cursor-pointer";
const btnOn = "bg-gradient-to-br from-av-violet to-av-magenta !text-white shadow-md shadow-av-magenta/30";

function Divider() {
  return <span className="w-px h-5 bg-white/10 mx-0.5 shrink-0" />;
}

/** Compact contextual toolbar floating above the selected canvas element. */
export default function StudioFloatingInspector({
  element,
  onUpdate,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onEditText,
  compact = false,
}: StudioFloatingInspectorProps) {
  const [colorOpen, setColorOpen] = useState(false);
  const colorKey = getColorKey(element);
  const color = getElementColor(element);
  const dpi = getImageDpi(element);

  return (
    <div
      className={`studio-pop relative flex items-center gap-0.5 p-1 rounded-2xl ${compact ? "flex-wrap justify-center max-w-[calc(100vw-1rem)]" : ""} bg-[#120c28]/90 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.8),0_0_0_1px_rgba(108,43,217,0.25)] text-white select-none touch-none`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {element.type === "text" && (
        <>
          {onEditText && (
            <>
              <button
                type="button"
                className={`${btn} gap-1.5 px-2.5 text-[11px] font-bold ${compact ? "!bg-gradient-to-br from-av-violet to-av-magenta !text-white" : ""}`}
                title="Modifier le texte (double-clic)"
                onClick={onEditText}
              >
                <Pencil size={13} />
                <span className={compact ? "" : "hidden xl:inline"}>Modifier le texte</span>
              </button>
              <Divider />
            </>
          )}
          <div className="flex items-center">
            <button
              type="button"
              className={btn}
              title="Réduire la taille"
              onClick={() => onUpdate({ fontSize: Math.max(4, (element.fontSize || 12) - 0.5) })}
            >
              <Minus size={13} />
            </button>
            <span className="w-9 text-center text-[11px] font-bold tabular-nums">
              {element.fontSize || 12}
              <span className="text-white/40 font-medium">pt</span>
            </span>
            <button
              type="button"
              className={btn}
              title="Augmenter la taille"
              onClick={() => onUpdate({ fontSize: Math.min(60, (element.fontSize || 12) + 0.5) })}
            >
              <Plus size={13} />
            </button>
          </div>
          <Divider />
          <button
            type="button"
            className={`${btn} ${element.fontWeight === "bold" ? btnOn : ""}`}
            title="Gras"
            onClick={() => onUpdate({ fontWeight: element.fontWeight === "bold" ? "normal" : "bold" })}
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            className={`${btn} ${element.fontStyle === "italic" ? btnOn : ""}`}
            title="Italique"
            onClick={() => onUpdate({ fontStyle: element.fontStyle === "italic" ? "normal" : "italic" })}
          >
            <Italic size={14} />
          </button>
          <Divider />
          {(
            [
              ["left", AlignLeft],
              ["center", AlignCenter],
              ["right", AlignRight],
            ] as const
          ).map(([value, Icon]) => (
            <button
              key={value}
              type="button"
              className={`${btn} ${(element.textAlign || "left") === value ? btnOn : ""}`}
              title={`Aligner : ${value === "left" ? "gauche" : value === "center" ? "centre" : "droite"}`}
              onClick={() => onUpdate({ textAlign: value })}
            >
              <Icon size={14} />
            </button>
          ))}
          <Divider />
        </>
      )}

      {element.type !== "image" && (
        <>
          <div className="relative">
            <button
              type="button"
              className={btn}
              title="Couleur"
              onClick={() => setColorOpen((v) => !v)}
              aria-expanded={colorOpen}
            >
              <span
                className="w-5 h-5 rounded-full border-2 border-white/80 shadow-inner"
                style={{ backgroundColor: color }}
              />
            </button>
            {colorOpen && (
              <div className={`studio-pop absolute left-1/2 -translate-x-1/2 ${compact ? "bottom-full mb-2" : "top-full mt-2"} w-[196px] p-2.5 rounded-2xl bg-[#120c28]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50`}>
                <div className="grid grid-cols-7 gap-1.5">
                  {STUDIO_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Couleur ${c}`}
                      onClick={() => {
                        onUpdate({ [colorKey]: c } as Partial<StudioElement>);
                        setColorOpen(false);
                      }}
                      className={`w-5 h-5 rounded-full border transition hover:scale-125 cursor-pointer ${
                        c.toLowerCase() === color.toLowerCase()
                          ? "border-white ring-2 ring-av-orange"
                          : "border-white/25"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <label className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-white/5 px-2 py-1.5 text-[10px] text-white/60 cursor-pointer hover:bg-white/10">
                  <span>Couleur personnalisée</span>
                  <input
                    type="color"
                    value={/^#[0-9a-f]{6}$/i.test(color) ? color : "#ffffff"}
                    onChange={(e) => onUpdate({ [colorKey]: e.target.value } as Partial<StudioElement>)}
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                </label>
              </div>
            )}
          </div>
          <Divider />
        </>
      )}

      {dpi && (
        <>
          <span
            className={`px-2 text-[10px] font-extrabold tabular-nums ${DPI_COLORS[dpi.level].text}`}
            title={dpi.label}
          >
            {dpi.dpi} DPI
          </span>
          <Divider />
        </>
      )}

      <button type="button" className={btn} title="Monter d'un niveau" onClick={onBringForward}>
        <ArrowUp size={14} />
      </button>
      <button type="button" className={btn} title="Descendre d'un niveau" onClick={onSendBackward}>
        <ArrowDown size={14} />
      </button>
      <button type="button" className={btn} title="Dupliquer" onClick={onDuplicate}>
        <Copy size={14} />
      </button>
      <button
        type="button"
        className={`${btn} hover:!text-red-400 hover:!bg-red-500/10`}
        title="Supprimer"
        onClick={onDelete}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
