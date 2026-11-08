"use client";

import React, { useRef, useState, useEffect } from "react";
import { StudioDesign, StudioElement, StudioSide } from "./studioTypes";
import { Eye, EyeOff, ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";

interface StudioCanvasProps {
  design: StudioDesign;
  activeSide: "recto" | "verso";
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<StudioElement>) => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export default function StudioCanvas({
  design,
  activeSide,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  showGuides,
  onToggleGuides,
  zoom,
  onZoomChange,
}: StudioCanvasProps) {
  const currentSide: StudioSide = activeSide === "recto" ? design.recto : design.verso;
  const containerRef = useRef<HTMLDivElement>(null);

  // Conversion: mm to screen pixels at 100% zoom (1 mm ~ 3.78 px at standard screen 96 DPI)
  const MM_TO_PX = 3.7795275591;
  const cardWidthPx = design.widthMm * MM_TO_PX;
  const cardHeightPx = design.heightMm * MM_TO_PX;
  const bleedPx = design.bleedMm * MM_TO_PX;
  const safeMarginPx = design.safeMarginMm * MM_TO_PX;

  // Dragging and resizing state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; elX: number; elY: number } | null>(null);
  const [isResizing, setIsResizing] = useState<string | null>(null); // "se", "sw", "ne", "nw"
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; elW: number; elH: number; elX: number; elY: number } | null>(null);

  const selectedElement = currentSide.elements.find((el) => el.id === selectedElementId) || null;

  // Handle click outside to deselect
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.elementId) return;
    onSelectElement(null);
  };

  // Drag handling
  const handleMouseDownOnElement = (e: React.MouseEvent, el: StudioElement) => {
    e.stopPropagation();
    onSelectElement(el.id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elX: el.x,
      elY: el.y,
    });
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (!selectedElement) return;
    setIsResizing(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      elW: selectedElement.width,
      elH: selectedElement.height,
      elX: selectedElement.x,
      elY: selectedElement.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStart && selectedElementId) {
        const deltaX_mm = (e.clientX - dragStart.x) / (MM_TO_PX * zoom);
        const deltaY_mm = (e.clientY - dragStart.y) / (MM_TO_PX * zoom);

        const newX = Math.round((dragStart.elX + deltaX_mm) * 10) / 10;
        const newY = Math.round((dragStart.elY + deltaY_mm) * 10) / 10;

        onUpdateElement(selectedElementId, {
          x: Math.max(-10, Math.min(design.widthMm + 10, newX)),
          y: Math.max(-10, Math.min(design.heightMm + 10, newY)),
        });
      } else if (isResizing && resizeStart && selectedElementId) {
        const deltaX_mm = (e.clientX - resizeStart.x) / (MM_TO_PX * zoom);
        const deltaY_mm = (e.clientY - resizeStart.y) / (MM_TO_PX * zoom);

        if (isResizing === "se") {
          const newW = Math.max(5, Math.round((resizeStart.elW + deltaX_mm) * 10) / 10);
          const newH = Math.max(3, Math.round((resizeStart.elH + deltaY_mm) * 10) / 10);
          onUpdateElement(selectedElementId, { width: newW, height: newH });
        } else if (isResizing === "sw") {
          const newW = Math.max(5, Math.round((resizeStart.elW - deltaX_mm) * 10) / 10);
          const newH = Math.max(3, Math.round((resizeStart.elH + deltaY_mm) * 10) / 10);
          const newX = Math.round((resizeStart.elX + deltaX_mm) * 10) / 10;
          onUpdateElement(selectedElementId, { width: newW, height: newH, x: newX });
        } else if (isResizing === "ne") {
          const newW = Math.max(5, Math.round((resizeStart.elW + deltaX_mm) * 10) / 10);
          const newH = Math.max(3, Math.round((resizeStart.elH - deltaY_mm) * 10) / 10);
          const newY = Math.round((resizeStart.elY + deltaY_mm) * 10) / 10;
          onUpdateElement(selectedElementId, { width: newW, height: newH, y: newY });
        } else if (isResizing === "nw") {
          const newW = Math.max(5, Math.round((resizeStart.elW - deltaX_mm) * 10) / 10);
          const newH = Math.max(3, Math.round((resizeStart.elH - deltaY_mm) * 10) / 10);
          const newX = Math.round((resizeStart.elX + deltaX_mm) * 10) / 10;
          const newY = Math.round((resizeStart.elY + deltaY_mm) * 10) / 10;
          onUpdateElement(selectedElementId, { width: newW, height: newH, x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
      setIsResizing(null);
      setResizeStart(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, isResizing, resizeStart, selectedElementId, zoom, MM_TO_PX, design.widthMm, design.heightMm, onUpdateElement]);

  return (
    <div
      ref={containerRef}
      onClick={handleBackgroundClick}
      className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-auto bg-[#070512] select-none min-h-[500px]"
    >
      {/* Zoom and Guides Floating Control Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#140e2b]/90 border border-brand-purple/20 px-3 py-1.5 rounded-full shadow-lg backdrop-blur">
        <button
          onClick={onToggleGuides}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium transition cursor-pointer ${
            showGuides ? "bg-brand-magenta text-white shadow-sm" : "text-white/60 hover:text-white"
          }`}
          title="Afficher/Masquer les repères PAO (coupe et zone de sécurité)"
        >
          {showGuides ? <Eye size={12} /> : <EyeOff size={12} />}
          <span className="hidden sm:inline">Repères PAO</span>
        </button>

        <div className="w-[1px] h-4 bg-white/20" />

        <button
          onClick={() => onZoomChange(Math.max(0.6, zoom - 0.1))}
          className="p-1 text-white/60 hover:text-white transition cursor-pointer"
          title="Zoom arrière"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-xs font-semibold text-white/80 min-w-[42px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))}
          className="p-1 text-white/60 hover:text-white transition cursor-pointer"
          title="Zoom avant"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => onZoomChange(1.0)}
          className="p-1 text-white/60 hover:text-white transition cursor-pointer"
          title="Taille réelle (100%)"
        >
          <Maximize2 size={13} />
        </button>
      </div>

      {/* Main Canvas Container with Scale */}
      <div
        className="relative transition-transform duration-100 ease-out flex items-center justify-center"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* Bleed Container (Visible if showGuides is true) */}
        <div
          className="relative transition-all duration-300"
          style={{
            width: `${cardWidthPx + (showGuides ? bleedPx * 2 : 0)}px`,
            height: `${cardHeightPx + (showGuides ? bleedPx * 2 : 0)}px`,
            padding: showGuides ? `${bleedPx}px` : "0px",
            backgroundColor: showGuides ? "rgba(239, 68, 68, 0.08)" : "transparent",
            border: showGuides ? "1px dashed rgba(239, 68, 68, 0.5)" : "none",
            borderRadius: "4px",
          }}
        >
          {/* Bleed Label (outside) */}
          {showGuides && (
            <div className="absolute -top-6 left-0 text-[10px] font-semibold text-red-400 flex items-center gap-1">
              <span>Fond perdu (+{design.bleedMm} mm)</span>
            </div>
          )}

          {/* Actual Finished Document (Card Face) */}
          <div
            className="relative shadow-2xl rounded-sm overflow-hidden"
            style={{
              width: `${cardWidthPx}px`,
              height: `${cardHeightPx}px`,
              backgroundColor: currentSide.backgroundColor,
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.7), 0 0 20px rgba(108,43,217,0.2)",
            }}
          >
            {/* Safety Margin Indicator (Zone Tranquille 3mm) */}
            {showGuides && (
              <div
                className="absolute pointer-events-none z-10 border border-dashed border-emerald-400/60 rounded-xs"
                style={{
                  top: `${safeMarginPx}px`,
                  left: `${safeMarginPx}px`,
                  right: `${safeMarginPx}px`,
                  bottom: `${safeMarginPx}px`,
                }}
              >
                <span className="absolute bottom-1 right-1 text-[8px] font-bold text-emerald-400/70 bg-black/40 px-1 rounded">
                  Zone sécurité ({design.safeMarginMm} mm)
                </span>
              </div>
            )}

            {/* Elements Layer */}
            {currentSide.elements.map((el) => {
              const isSelected = el.id === selectedElementId;
              const elLeftPx = el.x * MM_TO_PX;
              const elTopPx = el.y * MM_TO_PX;
              const elWidthPx = el.width * MM_TO_PX;
              const elHeightPx = el.height * MM_TO_PX;

              return (
                <div
                  key={el.id}
                  data-element-id={el.id}
                  onMouseDown={(e) => handleMouseDownOnElement(e, el)}
                  className={`absolute group cursor-move select-none ${
                    isSelected ? "ring-2 ring-brand-orange ring-offset-1 ring-offset-transparent z-30" : "hover:ring-1 hover:ring-brand-magenta/50"
                  }`}
                  style={{
                    left: `${elLeftPx}px`,
                    top: `${elTopPx}px`,
                    width: `${elWidthPx}px`,
                    height: `${elHeightPx}px`,
                    opacity: el.opacity ?? 1,
                    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                  }}
                >
                  {/* Element Body Render */}
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
                          el.textAlign === "center" ? "center" : el.textAlign === "right" ? "flex-end" : "flex-start",
                      }}
                    >
                      {el.text}
                    </div>
                  )}

                  {el.type === "image" && (
                    <img
                      src={el.src}
                      alt={el.alt || "Studio image"}
                      className="w-full h-full object-contain pointer-events-none select-none"
                      draggable={false}
                    />
                  )}

                  {/* Resize Handles (Active only when selected) */}
                  {isSelected && (
                    <>
                      <div
                        onMouseDown={(e) => handleResizeStart(e, "nw")}
                        className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-brand-orange border border-white rounded-full cursor-nwse-resize z-40"
                      />
                      <div
                        onMouseDown={(e) => handleResizeStart(e, "ne")}
                        className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-brand-orange border border-white rounded-full cursor-nesw-resize z-40"
                      />
                      <div
                        onMouseDown={(e) => handleResizeStart(e, "sw")}
                        className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-brand-orange border border-white rounded-full cursor-nesw-resize z-40"
                      />
                      <div
                        onMouseDown={(e) => handleResizeStart(e, "se")}
                        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-brand-orange border border-white rounded-full cursor-nwse-resize z-40"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Side Switcher Pill */}
      <div className="mt-8 text-center">
        <p className="text-[11px] text-white/50">
          Format fini : <strong className="text-white font-semibold">{design.widthMm} × {design.heightMm} mm</strong>
          {showGuides && <span> • Avec fond perdu : <strong className="text-red-400 font-semibold">{design.widthMm + design.bleedMm * 2} × {design.heightMm + design.bleedMm * 2} mm</strong></span>}
        </p>
      </div>
    </div>
  );
}
