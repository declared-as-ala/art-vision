"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Eye, EyeOff, Magnet, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { StudioDesign, StudioElement, StudioSide } from "./studioTypes";
import { MM_TO_PX } from "./studioUtils";
import StudioFloatingInspector from "./StudioFloatingInspector";

interface StudioCanvasProps {
  design: StudioDesign;
  activeSide: "recto" | "verso";
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<StudioElement>) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  onBringForward?: (id: string) => void;
  onSendBackward?: (id: string) => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

type Handle = "nw" | "ne" | "sw" | "se";
interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface Guide {
  axis: "x" | "y";
  pos: number; // mm
  kind: "center" | "edge";
}
interface Target {
  pos: number;
  kind: "center" | "edge";
}

const HANDLES: { id: Handle; cursor: string; style: (hs: number) => React.CSSProperties }[] = [
  { id: "nw", cursor: "nwse-resize", style: (hs) => ({ left: -hs / 2, top: -hs / 2 }) },
  { id: "ne", cursor: "nesw-resize", style: (hs) => ({ right: -hs / 2, top: -hs / 2 }) },
  { id: "sw", cursor: "nesw-resize", style: (hs) => ({ left: -hs / 2, bottom: -hs / 2 }) },
  { id: "se", cursor: "nwse-resize", style: (hs) => ({ right: -hs / 2, bottom: -hs / 2 }) },
];

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Find the closest snapping target for the left / centre / right (or top / middle / bottom) of a box. */
function snapAxis(pos: number, size: number, targets: Target[], threshold: number) {
  let best: { delta: number; target: Target } | null = null;
  for (const offset of [0, size / 2, size]) {
    for (const target of targets) {
      const delta = target.pos - (pos + offset);
      if (Math.abs(delta) <= threshold && (!best || Math.abs(delta) < Math.abs(best.delta))) {
        best = { delta, target };
      }
    }
  }
  return best;
}

function resizeRect(o: Rect, handle: Handle, dx: number, dy: number, lockRatio: boolean): Rect {
  const west = handle.includes("w");
  const north = handle.includes("n");
  let w = o.width + (west ? -dx : dx);
  let h = o.height + (north ? -dy : dy);
  if (lockRatio) {
    const ratio = o.width / o.height;
    if (Math.abs(dx) >= Math.abs(dy) * ratio) h = w / ratio;
    else w = h * ratio;
    if (w < 5) {
      w = 5;
      h = w / ratio;
    }
    if (h < 3) {
      h = 3;
      w = h * ratio;
    }
  } else {
    w = Math.max(5, w);
    h = Math.max(3, h);
  }
  return {
    width: round1(w),
    height: round1(h),
    x: round1(west ? o.x + (o.width - w) : o.x),
    y: round1(north ? o.y + (o.height - h) : o.y),
  };
}

const PAPER_GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function StudioCanvas({
  design,
  activeSide,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  showGuides,
  onToggleGuides,
  zoom,
  onZoomChange,
}: StudioCanvasProps) {
  const currentSide: StudioSide = activeSide === "recto" ? design.recto : design.verso;
  const containerRef = useRef<HTMLDivElement>(null);

  const cardWidthPx = design.widthMm * MM_TO_PX;
  const cardHeightPx = design.heightMm * MM_TO_PX;
  const bleedPx = design.bleedMm * MM_TO_PX;
  const safeMarginPx = design.safeMarginMm * MM_TO_PX;

  // Stage = bleed area + breathing room (bleed label above, caption below)
  const STAGE_PAD_X = 28;
  const STAGE_TOP = 40;
  const STAGE_BOTTOM = 60;
  const stageW = cardWidthPx + bleedPx * 2 + STAGE_PAD_X * 2;
  const stageH = cardHeightPx + bleedPx * 2 + STAGE_TOP + STAGE_BOTTOM;

  // Auto-fit: keeps the whole card visible on phones, enlarges it on big screens
  const [fit, setFit] = useState(1);
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const availW = el.clientWidth - 16;
      const availH = el.clientHeight - 56; // zoom bar
      if (availW <= 0 || availH <= 0) return;
      setFit(Math.max(0.45, Math.min(1.75, availW / stageW, availH / stageH)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stageW, stageH]);

  const eff = zoom * fit;

  // Live (uncommitted) geometry while dragging / resizing — committed once on release
  const [live, setLive] = useState<({ id: string } & Rect) | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [activeMode, setActiveMode] = useState<"drag" | Handle | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const suppressClick = useRef(false);

  const latest = useRef({ eff, design, elements: currentSide.elements, snapEnabled, onUpdateElement });
  useLayoutEffect(() => {
    latest.current = { eff, design, elements: currentSide.elements, snapEnabled, onUpdateElement };
  });

  const selectedElement = currentSide.elements.find((el) => el.id === selectedElementId) || null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (suppressClick.current) return;
    if ((e.target as HTMLElement).closest("[data-element-id],[data-keep-selection]")) return;
    onSelectElement(null);
  };

  const beginInteraction = useCallback(
    (e: React.PointerEvent, el: StudioElement, mode: "drag" | Handle) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.stopPropagation();
      onSelectElement(el.id);

      const orig: Rect = { x: el.x, y: el.y, width: el.width, height: el.height };
      const startX = e.clientX;
      const startY = e.clientY;
      const lockRatio = el.type === "image";
      let moved = false;
      let last: Rect = orig;
      setActiveMode(mode);

      const onMove = (ev: PointerEvent) => {
        if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 3) return;
        moved = true;
        const { eff: scale, design: d, elements, snapEnabled: snapOn } = latest.current;
        const k = MM_TO_PX * scale;
        const dx = (ev.clientX - startX) / k;
        const dy = (ev.clientY - startY) / k;

        if (mode === "drag") {
          let x = orig.x + dx;
          let y = orig.y + dy;
          const found: Guide[] = [];

          if (snapOn && !ev.altKey) {
            const thr = 6 / k;
            const xTargets: Target[] = [
              { pos: d.widthMm / 2, kind: "center" },
              { pos: 0, kind: "edge" },
              { pos: d.widthMm, kind: "edge" },
              { pos: d.safeMarginMm, kind: "edge" },
              { pos: d.widthMm - d.safeMarginMm, kind: "edge" },
            ];
            const yTargets: Target[] = [
              { pos: d.heightMm / 2, kind: "center" },
              { pos: 0, kind: "edge" },
              { pos: d.heightMm, kind: "edge" },
              { pos: d.safeMarginMm, kind: "edge" },
              { pos: d.heightMm - d.safeMarginMm, kind: "edge" },
            ];
            for (const other of elements) {
              if (other.id === el.id) continue;
              xTargets.push(
                { pos: other.x, kind: "edge" },
                { pos: other.x + other.width / 2, kind: "edge" },
                { pos: other.x + other.width, kind: "edge" }
              );
              yTargets.push(
                { pos: other.y, kind: "edge" },
                { pos: other.y + other.height / 2, kind: "edge" },
                { pos: other.y + other.height, kind: "edge" }
              );
            }
            const sx = snapAxis(x, orig.width, xTargets, thr);
            const sy = snapAxis(y, orig.height, yTargets, thr);
            if (sx) {
              x += sx.delta;
              found.push({ axis: "x", pos: sx.target.pos, kind: sx.target.kind });
            }
            if (sy) {
              y += sy.delta;
              found.push({ axis: "y", pos: sy.target.pos, kind: sy.target.kind });
            }
          }

          last = {
            x: round1(Math.max(-10, Math.min(d.widthMm + 10, x))),
            y: round1(Math.max(-10, Math.min(d.heightMm + 10, y))),
            width: orig.width,
            height: orig.height,
          };
          setGuides(found);
        } else {
          last = resizeRect(orig, mode, dx, dy, lockRatio || ev.shiftKey);
        }
        setLive({ id: el.id, ...last });
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        setLive(null);
        setGuides([]);
        setActiveMode(null);
        if (moved) {
          suppressClick.current = true;
          setTimeout(() => (suppressClick.current = false), 0);
          if (
            last.x !== orig.x ||
            last.y !== orig.y ||
            last.width !== orig.width ||
            last.height !== orig.height
          ) {
            latest.current.onUpdateElement(el.id, last);
          }
        }
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [onSelectElement]
  );

  // Geometry of the selected element (live while interacting)
  const sel: Rect | null = selectedElement
    ? live && live.id === selectedElement.id
      ? live
      : { x: selectedElement.x, y: selectedElement.y, width: selectedElement.width, height: selectedElement.height }
    : null;

  // Counter-scaled UI metrics so handles/labels keep a constant on-screen size
  const hs = 11 / eff;
  const hairline = 1.5 / eff;

  // Inspector placement
  let inspectorStyle: React.CSSProperties | null = null;
  let pillStyle: React.CSSProperties | null = null;
  if (selectedElement && sel) {
    const flip = sel.y * MM_TO_PX * eff < 76 + bleedPx * eff;
    const estWidth = selectedElement.type === "text" ? 448 : selectedElement.type === "image" ? 280 : 232;
    const viewportW = typeof window !== "undefined" ? window.innerWidth : 1280;
    const halfCard = Math.min(estWidth, viewportW * 0.94) / 2 / eff;
    const pad = bleedPx + STAGE_PAD_X - 4;
    const minC = -pad + halfCard;
    const maxC = cardWidthPx + pad - halfCard;
    const centerPx = (sel.x + sel.width / 2) * MM_TO_PX;
    const cx = minC <= maxC ? Math.max(minC, Math.min(maxC, centerPx)) : cardWidthPx / 2;
    const topPx = sel.y * MM_TO_PX;
    const bottomPx = (sel.y + sel.height) * MM_TO_PX;
    const gap = 14 / eff;
    inspectorStyle = flip
      ? {
          left: cx,
          top: bottomPx + gap,
          transform: `translate(-50%, 0) scale(${1 / eff})`,
          transformOrigin: "50% 0%",
        }
      : {
          left: cx,
          top: topPx - gap,
          transform: `translate(-50%, -100%) scale(${1 / eff})`,
          transformOrigin: "50% 100%",
        };
    pillStyle = flip
      ? {
          left: centerPx,
          top: topPx - 10 / eff,
          transform: `translate(-50%, -100%) scale(${1 / eff})`,
          transformOrigin: "50% 100%",
        }
      : {
          left: centerPx,
          top: bottomPx + 10 / eff,
          transform: `translate(-50%, 0) scale(${1 / eff})`,
          transformOrigin: "50% 0%",
        };
  }

  const zoomBtn =
    "p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 active:scale-90 transition cursor-pointer";

  return (
    <div
      ref={containerRef}
      onClick={handleBackgroundClick}
      className="studio-workspace relative flex-1 min-h-0 min-w-0 overflow-auto select-none pt-14 pb-2 px-2 md:px-6 flex"
    >
      {/* Floating zoom & guides control bar */}
      <div
        data-keep-selection
        className="absolute top-3 right-3 z-30 flex items-center gap-0.5 bg-[#120c28]/85 border border-white/10 px-1.5 py-1 rounded-full shadow-[0_8px_30px_-8px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      >
        <button
          type="button"
          onClick={onToggleGuides}
          className={`flex items-center gap-1.5 pl-2 pr-2.5 py-1 text-[11px] rounded-full font-semibold transition cursor-pointer ${
            showGuides
              ? "bg-gradient-to-r from-av-violet to-av-magenta text-white shadow-md shadow-av-magenta/25"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
          title="Afficher/Masquer les repères PAO (fond perdu et zone de sécurité)"
        >
          {showGuides ? <Eye size={13} /> : <EyeOff size={13} />}
          <span className="hidden sm:inline">Repères PAO</span>
        </button>
        <button
          type="button"
          onClick={() => setSnapEnabled((v) => !v)}
          className={`${zoomBtn} ${snapEnabled ? "!text-av-orange" : ""}`}
          title={`Aimantation ${snapEnabled ? "activée" : "désactivée"} (maintenir Alt pour l'ignorer)`}
        >
          <Magnet size={14} />
        </button>

        <span className="w-px h-4 bg-white/15 mx-0.5" />

        <button
          type="button"
          onClick={() => onZoomChange(Math.max(0.5, round1(zoom - 0.1)))}
          className={zoomBtn}
          title="Zoom arrière"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-[11px] font-bold text-white/85 min-w-[40px] text-center tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => onZoomChange(Math.min(2.5, round1(zoom + 0.1)))}
          className={zoomBtn}
          title="Zoom avant"
        >
          <ZoomIn size={14} />
        </button>
        <button type="button" onClick={() => onZoomChange(1.0)} className={zoomBtn} title="Ajuster à l'écran">
          <Maximize2 size={13} />
        </button>
      </div>

      {/* Stage: real layout size follows the zoom so scrolling works */}
      <div className="relative shrink-0 m-auto" style={{ width: stageW * eff, height: stageH * eff }}>
        <div
          className="absolute top-0 left-0 flex flex-col items-center"
          style={{
            width: stageW,
            height: stageH,
            paddingTop: STAGE_TOP,
            transform: `scale(${eff})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Bleed area */}
          <div
            className="relative transition-colors duration-300"
            style={{
              width: cardWidthPx + bleedPx * 2,
              height: cardHeightPx + bleedPx * 2,
              padding: bleedPx,
              backgroundColor: showGuides ? "rgba(239, 68, 68, 0.09)" : "transparent",
              outline: showGuides ? "1px dashed rgba(248, 113, 113, 0.55)" : "1px dashed transparent",
              borderRadius: 4,
            }}
          >
            {showGuides && (
              <div className="absolute -top-6 left-0 text-[10px] font-semibold text-red-400 whitespace-nowrap">
                Fond perdu (+{design.bleedMm} mm)
              </div>
            )}

            {/* Card wrapper (card coordinates) */}
            <div className="relative" style={{ width: cardWidthPx, height: cardHeightPx }}>
              {/* Paper face */}
              <div
                key={activeSide}
                className="studio-paper studio-pop absolute inset-0 overflow-hidden rounded-[3px]"
                style={{ backgroundColor: currentSide.backgroundColor }}
              >
                {currentSide.elements.map((el) => {
                  const isLive = live?.id === el.id;
                  const r: Rect = isLive ? live : el;
                  const isSelected = el.id === selectedElementId;
                  return (
                    <div
                      key={el.id}
                      data-element-id={el.id}
                      onPointerDown={(e) => beginInteraction(e, el, "drag")}
                      className={`absolute touch-none select-none ${
                        activeMode === "drag" && isSelected ? "cursor-grabbing" : "cursor-move"
                      } ${isSelected ? "" : "hover:outline hover:outline-1 hover:outline-av-magenta/70"}`}
                      style={{
                        left: r.x * MM_TO_PX,
                        top: r.y * MM_TO_PX,
                        width: r.width * MM_TO_PX,
                        height: el.type === "line" ? Math.max(r.height * MM_TO_PX, 10) : r.height * MM_TO_PX,
                        opacity: el.opacity ?? 1,
                        transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                      }}
                    >
                      {el.type === "rect" && (
                        <div
                          className="w-full h-full pointer-events-none"
                          style={{
                            backgroundColor: el.fill || "transparent",
                            borderColor: el.stroke,
                            borderWidth: el.strokeWidth ? `${el.strokeWidth * MM_TO_PX}px` : 0,
                            borderStyle: el.stroke ? "solid" : "none",
                            borderRadius: el.borderRadius ? `${el.borderRadius * MM_TO_PX}px` : 0,
                          }}
                        />
                      )}

                      {el.type === "circle" && (
                        <div
                          className="w-full h-full rounded-full pointer-events-none"
                          style={{
                            backgroundColor: el.fill || "transparent",
                            borderColor: el.stroke,
                            borderWidth: el.strokeWidth ? `${el.strokeWidth * MM_TO_PX}px` : 0,
                            borderStyle: el.stroke ? "solid" : "none",
                          }}
                        />
                      )}

                      {el.type === "line" && (
                        <div
                          className="w-full pointer-events-none"
                          style={{
                            height: `${Math.max(1, (el.strokeWidth || 1) * MM_TO_PX)}px`,
                            backgroundColor: el.stroke || "#000000",
                          }}
                        />
                      )}

                      {el.type === "text" && (
                        <div
                          className="w-full h-full pointer-events-none whitespace-pre-wrap leading-tight overflow-visible flex items-start"
                          style={{
                            fontFamily: el.fontFamily || "Montserrat, sans-serif",
                            fontSize: `${(el.fontSize || 12) * (MM_TO_PX / 3.78)}px`,
                            fontWeight: el.fontWeight || "normal",
                            fontStyle: el.fontStyle || "normal",
                            color: el.color || "#000000",
                            textAlign: el.textAlign || "left",
                            letterSpacing: el.letterSpacing ? `${el.letterSpacing * 0.5}px` : undefined,
                            lineHeight: el.lineHeight || 1.3,
                            justifyContent:
                              el.textAlign === "center"
                                ? "center"
                                : el.textAlign === "right"
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          {el.text}
                        </div>
                      )}

                      {el.type === "image" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={el.src}
                          alt={el.alt || "Studio image"}
                          className="w-full h-full object-contain pointer-events-none select-none"
                          draggable={false}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Paper sheen + grain (purely visual, above the artwork) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,0.07) 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
                  style={{ backgroundImage: PAPER_GRAIN, backgroundSize: "160px 160px" }}
                />

                {/* Safe zone */}
                {showGuides && (
                  <div
                    className="absolute pointer-events-none border border-dashed border-emerald-400/70 rounded-[2px]"
                    style={{
                      top: safeMarginPx,
                      left: safeMarginPx,
                      right: safeMarginPx,
                      bottom: safeMarginPx,
                    }}
                  >
                    <span className="absolute bottom-1 right-1 text-[8px] font-bold text-emerald-300/90 bg-black/50 px-1 rounded">
                      Zone sécurité ({design.safeMarginMm} mm)
                    </span>
                  </div>
                )}
              </div>

              {/* Overlay layer (not clipped by the paper): guides, selection, handles, inspector */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Smart snapping guides */}
                {guides.map((g, i) =>
                  g.axis === "x" ? (
                    <div
                      key={`g-${i}`}
                      className="absolute"
                      style={{
                        left: g.pos * MM_TO_PX - hairline / 2,
                        top: -18 / eff,
                        bottom: -18 / eff,
                        width: hairline,
                        background: g.kind === "center" ? "#D72888" : "#FF6A00",
                        boxShadow: `0 0 ${8 / eff}px ${g.kind === "center" ? "#D72888" : "#FF6A00"}`,
                      }}
                    />
                  ) : (
                    <div
                      key={`g-${i}`}
                      className="absolute"
                      style={{
                        top: g.pos * MM_TO_PX - hairline / 2,
                        left: -18 / eff,
                        right: -18 / eff,
                        height: hairline,
                        background: g.kind === "center" ? "#D72888" : "#FF6A00",
                        boxShadow: `0 0 ${8 / eff}px ${g.kind === "center" ? "#D72888" : "#FF6A00"}`,
                      }}
                    />
                  )
                )}

                {selectedElement && sel && (
                  <>
                    {/* Selection frame */}
                    <div
                      className="absolute"
                      style={{
                        left: sel.x * MM_TO_PX,
                        top: sel.y * MM_TO_PX,
                        width: sel.width * MM_TO_PX,
                        height: (selectedElement.type === "line" ? Math.max(sel.height * MM_TO_PX, 10) : sel.height * MM_TO_PX),
                        border: `${hairline}px solid #FF6A00`,
                        boxShadow: `0 0 0 ${hairline}px rgba(255,106,0,0.12), 0 0 ${18 / eff}px rgba(215,40,136,0.35)`,
                        transform: selectedElement.rotation ? `rotate(${selectedElement.rotation}deg)` : undefined,
                      }}
                    >
                      {HANDLES.map((h) => (
                        <div
                          key={h.id}
                          data-keep-selection
                          onPointerDown={(e) => beginInteraction(e, selectedElement, h.id)}
                          className="absolute pointer-events-auto touch-none bg-white rounded-full transition-[border-color,transform] duration-150 hover:scale-125"
                          style={{
                            ...h.style(hs),
                            width: hs,
                            height: hs,
                            cursor: h.cursor,
                            border: `${2 / eff}px solid ${activeMode === h.id ? "#D72888" : "#FF6A00"}`,
                            boxShadow: `0 ${1 / eff}px ${4 / eff}px rgba(0,0,0,0.5)`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Dimension micro-indicator */}
                    {pillStyle && (
                      <div
                        className="absolute whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums text-white bg-gradient-to-r from-av-orange to-av-magenta shadow-lg"
                        style={pillStyle}
                      >
                        {sel.width.toFixed(1)} × {sel.height.toFixed(1)} mm
                      </div>
                    )}

                    {/* Floating inspector */}
                    {!live && inspectorStyle && (
                      <div data-keep-selection className="absolute pointer-events-auto" style={inspectorStyle}>
                        <StudioFloatingInspector
                          element={selectedElement}
                          onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
                          onDelete={() => onDeleteElement?.(selectedElement.id)}
                          onDuplicate={() => onDuplicateElement?.(selectedElement.id)}
                          onBringForward={() => onBringForward?.(selectedElement.id)}
                          onSendBackward={() => onSendBackward?.(selectedElement.id)}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Caption */}
          <p className="mt-5 text-[11px] text-white/45 text-center whitespace-nowrap">
            Format fini :{" "}
            <strong className="text-white/90 font-semibold">
              {design.widthMm} × {design.heightMm} mm
            </strong>
            {showGuides && (
              <span>
                {" "}
                · Avec fond perdu :{" "}
                <strong className="text-red-400 font-semibold">
                  {design.widthMm + design.bleedMm * 2} × {design.heightMm + design.bleedMm * 2} mm
                </strong>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
