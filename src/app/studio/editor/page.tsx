"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  StudioDesign,
  StudioElement,
  StudioTemplate,
} from "@/components/studio/studioTypes";
import {
  DEFAULT_BUSINESS_CARD_DESIGN,
  STUDIO_TEMPLATES,
} from "@/components/studio/StudioTemplates";
import StudioCanvas from "@/components/studio/StudioCanvas";
import StudioSidebar from "@/components/studio/StudioSidebar";
import StudioToolbar from "@/components/studio/StudioToolbar";
import StudioPrintModal from "@/components/studio/StudioPrintModal";
import StudioCardPreview from "@/components/studio/StudioCardPreview";
import { X, Loader2 } from "lucide-react";

function StudioEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const productSlug = searchParams.get("product") || "cartes-de-visite";
  const initialTemplateId = searchParams.get("template");

  // Initial design resolution
  const getInitialDesign = (): StudioDesign => {
    if (initialTemplateId) {
      const found = STUDIO_TEMPLATES.find((t) => t.id === initialTemplateId);
      if (found) return JSON.parse(JSON.stringify(found.design));
    }
    return JSON.parse(JSON.stringify(DEFAULT_BUSINESS_CARD_DESIGN));
  };

  const [design, setDesign] = useState<StudioDesign>(getInitialDesign);
  const [activeSide, setActiveSide] = useState<"recto" | "verso">("recto");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showGuides, setShowGuides] = useState(true);
  const [zoom, setZoom] = useState(1.0);

  // Undo / Redo history
  const [history, setHistory] = useState<StudioDesign[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-save flag
  const [isSaved, setIsSaved] = useState(true);

  // Modals
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const LOCAL_STORAGE_KEY = `art_vision_studio_draft_${productSlug}`;

  // 1. Load draft from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && !initialTemplateId) {
        const parsed = JSON.parse(saved);
        if (parsed.recto && parsed.verso) {
          setDesign(parsed);
          setHistory([parsed]);
          setHistoryIndex(0);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load local draft:", e);
    }

    const init = getInitialDesign();
    setDesign(init);
    setHistory([init]);
    setHistoryIndex(0);
  }, [productSlug, initialTemplateId]);

  const persistDraft = useCallback(
    (value: StudioDesign) => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
        setIsSaved(true);
      } catch (e) {
        console.warn("Storage save error:", e);
      }
    },
    [LOCAL_STORAGE_KEY]
  );

  // 2. Save design to state with history snapshot
  const commitDesignChange = useCallback(
    (newDesign: StudioDesign) => {
      setDesign(newDesign);
      setIsSaved(false);

      // Save to localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDesign));
        setIsSaved(true);
      } catch (e) {
        console.warn("Storage save error:", e);
      }

      // Add to history stack
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, JSON.parse(JSON.stringify(newDesign))];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex, LOCAL_STORAGE_KEY]
  );

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const target = history[historyIndex - 1];
      const restored = JSON.parse(JSON.stringify(target));
      setDesign(restored);
      persistDraft(restored);
      setHistoryIndex(historyIndex - 1);
      setSelectedElementId(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const target = history[historyIndex + 1];
      const restored = JSON.parse(JSON.stringify(target));
      setDesign(restored);
      persistDraft(restored);
      setHistoryIndex(historyIndex + 1);
      setSelectedElementId(null);
    }
  };

  // Element actions
  const handleAddElement = (element: StudioElement) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    const side = activeSide === "recto" ? newDesign.recto : newDesign.verso;
    side.elements.push(element);
    commitDesignChange(newDesign);
    setSelectedElementId(element.id);
  };

  const handleUpdateElement = (id: string, updates: Partial<StudioElement>) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    const side = activeSide === "recto" ? newDesign.recto : newDesign.verso;
    const target = side.elements.find((el: StudioElement) => el.id === id);
    if (target) {
      Object.assign(target, updates);
      commitDesignChange(newDesign);
    }
  };

  const handleDeleteElement = (id: string) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    const side = activeSide === "recto" ? newDesign.recto : newDesign.verso;
    side.elements = side.elements.filter((el: StudioElement) => el.id !== id);
    commitDesignChange(newDesign);
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleDuplicateElement = (id: string) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    const side = activeSide === "recto" ? newDesign.recto : newDesign.verso;
    const target = side.elements.find((el: StudioElement) => el.id === id);
    if (target) {
      const copy: StudioElement = {
        ...JSON.parse(JSON.stringify(target)),
        id: `el-${Date.now()}`,
        x: target.x + 3,
        y: target.y + 3,
      };
      side.elements.push(copy);
      commitDesignChange(newDesign);
      setSelectedElementId(copy.id);
    }
  };

  const handleBringForward = (id: string) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    const side = activeSide === "recto" ? newDesign.recto : newDesign.verso;
    const idx = side.elements.findIndex((el: StudioElement) => el.id === id);
    if (idx < side.elements.length - 1) {
      const temp = side.elements[idx];
      side.elements[idx] = side.elements[idx + 1];
      side.elements[idx + 1] = temp;
      commitDesignChange(newDesign);
    }
  };

  const handleSendBackward = (id: string) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    const side = activeSide === "recto" ? newDesign.recto : newDesign.verso;
    const idx = side.elements.findIndex((el: StudioElement) => el.id === id);
    if (idx > 0) {
      const temp = side.elements[idx];
      side.elements[idx] = side.elements[idx - 1];
      side.elements[idx - 1] = temp;
      commitDesignChange(newDesign);
    }
  };

  const handleUpdateBackgroundColor = (color: string) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    if (activeSide === "recto") newDesign.recto.backgroundColor = color;
    else newDesign.verso.backgroundColor = color;
    commitDesignChange(newDesign);
  };

  const handleApplyTemplate = (template: StudioTemplate) => {
    const cloned = JSON.parse(JSON.stringify(template.design));
    commitDesignChange(cloned);
    setSelectedElementId(null);
  };

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Delete, arrows to nudge, Esc to deselect)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetEl = e.target as HTMLElement;
      const tag = targetEl.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || targetEl.isContentEditable) {
        return;
      }
      if (isPrintModalOpen || isPreviewOpen) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementId) {
          e.preventDefault();
          handleDeleteElement(selectedElementId);
        }
      } else if (e.key === "Escape") {
        setSelectedElementId(null);
      } else if (selectedElementId && e.key.startsWith("Arrow")) {
        const side = activeSide === "recto" ? design.recto : design.verso;
        const target = side.elements.find((el) => el.id === selectedElementId);
        if (!target) return;
        e.preventDefault();
        const step = e.shiftKey ? 2 : 0.5;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        handleUpdateElement(selectedElementId, {
          x: Math.round((target.x + dx) * 10) / 10,
          y: Math.round((target.y + dy) * 10) / 10,
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyIndex, history, selectedElementId, design, activeSide, isPrintModalOpen, isPreviewOpen]);

  return (
    <div className="flex flex-col h-dvh w-screen overflow-hidden bg-[#070512]">
      {/* 1. Header Toolbar */}
      <StudioToolbar
        design={design}
        activeSide={activeSide}
        onSwitchSide={(side) => {
          setActiveSide(side);
          setSelectedElementId(null);
        }}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isSaved={isSaved}
        onContinueToPrint={() => setIsPrintModalOpen(true)}
        onPreview={() => setIsPreviewOpen(true)}
      />

      {/* 2. Main Workspace: Sidebar (Left) + Interactive Canvas (Center) */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden relative">
        <StudioSidebar
          design={design}
          activeSide={activeSide}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onAddElement={handleAddElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onUpdateBackgroundColor={handleUpdateBackgroundColor}
          onApplyTemplate={handleApplyTemplate}
        />

        <StudioCanvas
          design={design}
          activeSide={activeSide}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          showGuides={showGuides}
          onToggleGuides={() => setShowGuides(!showGuides)}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      </div>

      {/* 3. Print Options & Order Modal */}
      <StudioPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        design={design}
      />

      {/* 4. Full Preview Modal */}
      {isPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Aperçu recto / verso"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="studio-pop relative w-full max-w-4xl my-auto bg-[#0c081e] border border-white/10 rounded-3xl p-5 md:p-8 space-y-6 shadow-[0_40px_120px_-30px_rgba(108,43,217,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Fermer l'aperçu"
            >
              <X size={20} />
            </button>

            <div className="pr-10">
              <h3 className="text-lg md:text-xl font-bold text-white">Aperçu recto / verso de vos cartes de visite</h3>
              <p className="text-xs text-white/55 mt-1">
                Format fini : {design.widthMm} × {design.heightMm} mm. Vérifiez l&apos;alignement et la lisibilité avant
                impression.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 py-2">
              {(
                [
                  ["Face Recto (A)", "text-av-orange", design.recto],
                  ["Face Verso (B)", "text-av-magenta", design.verso],
                ] as const
              ).map(([title, color, side]) => (
                <div key={title} className="space-y-3">
                  <span className={`text-[11px] font-extrabold uppercase tracking-[0.14em] ${color}`}>{title}</span>
                  <StudioCardPreview
                    side={side}
                    widthMm={design.widthMm}
                    heightMm={design.heightMm}
                    paper
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                Continuer l&apos;édition
              </button>
              <button
                onClick={() => {
                  setIsPreviewOpen(false);
                  setIsPrintModalOpen(true);
                }}
                className="bg-gradient-to-r from-av-orange to-av-magenta hover:brightness-110 text-white px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition active:scale-95 shadow-lg shadow-av-orange/25 cursor-pointer"
              >
                Passer à l&apos;impression →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudioEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh w-screen bg-[#070512] flex items-center justify-center text-white">
          <Loader2 className="animate-spin text-brand-orange mr-2" />
          <span>Chargement du Studio de création...</span>
        </div>
      }
    >
      <StudioEditorContent />
    </Suspense>
  );
}

