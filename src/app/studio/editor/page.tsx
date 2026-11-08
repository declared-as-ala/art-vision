"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { StudioDesign, StudioElement, StudioTemplate } from "@/components/studio/studioTypes";
import {
  buildSpec,
  createBlankDesign,
  designHasContent,
  getProduct,
  previousDraftKey,
  readDraft,
  specFromParams,
  specToQuery,
  writeDraft,
  type StudioSpec,
} from "@/components/studio/studioProducts";
import { findTemplate, getTemplatesFor } from "@/components/studio/StudioTemplateGenerators";
import StudioCanvas from "@/components/studio/StudioCanvas";
import StudioSidebar from "@/components/studio/StudioSidebar";
import StudioToolbar, { type SaveState } from "@/components/studio/StudioToolbar";
import StudioPrintModal from "@/components/studio/StudioPrintModal";
import StudioCardPreview from "@/components/studio/StudioCardPreview";
import { resolveArchiveAssets } from "@/components/studio/studioArchive";
import { X, Loader2, History } from "lucide-react";

/** Normalise a design so it always carries the metadata of the spec it belongs to. */
function withSpec(design: StudioDesign, spec: StudioSpec): StudioDesign {
  const product = getProduct(spec.productId)!;
  return {
    ...design,
    productSlug: product.orderSlug,
    productName: product.name,
    formatName: `${spec.title} — ${spec.dimensionsLabel}`,
    widthMm: spec.widthMm,
    heightMm: spec.heightMm,
    bleedMm: spec.bleedMm,
    safeMarginMm: spec.safeMarginMm,
    formatId: spec.formatId,
    orientation: spec.orientation,
    singleSided: !spec.hasVerso,
  };
}

interface Resolved {
  key: string;
  design: StudioDesign;
  notice: "replaced" | null;
  spec?: StudioSpec;
  archiveOf?: string;
  versionRef?: string | null;
}

/** Decides which document to open (draft / template / blank) for the requested support. */
function StudioEditorLoader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const spec = useMemo(() => specFromParams(searchParams), [searchParams]);
  const templateId = searchParams.get("template");
  const blank = searchParams.get("blank") === "1";
  const productParam = searchParams.get("product");
  const archiveId = searchParams.get("archive");
  const archiveToken = searchParams.get("t");
  const [resolved, setResolved] = useState<Resolved | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  // Archived project of an order (print shop / customer link): opened as a local copy, never written back
  useEffect(() => {
    if (!archiveId) return;
    let cancelled = false;
    (async () => {
      try {
        const q = archiveToken ? `?t=${encodeURIComponent(archiveToken)}` : "";
        const res = await fetch(`/api/studio/files/${archiveId}/project${q}`);
        if (!res.ok) throw new Error(res.status === 404 ? "Projet introuvable ou accès non autorisé." : "Projet illisible.");
        const project = await res.json();
        const product = getProduct(project.spec?.productId);
        const aSpec = product
          ? buildSpec(product, project.spec.formatId, project.spec.orientation, product.custom ? { w: project.spec.widthMm / 10, h: project.spec.heightMm / 10 } : undefined)
          : null;
        if (!aSpec) throw new Error("Format du projet non reconnu.");
        const design = resolveArchiveAssets(project.design as StudioDesign, (name) => `/api/studio/files/${archiveId}/asset/${encodeURIComponent(name)}${q}`);
        if (!cancelled) setResolved({ key: `archive:${archiveId}`, design: withSpec(design, aSpec), notice: null, spec: aSpec, archiveOf: archiveId, versionRef: project.versionRef ?? null });
      } catch (e) {
        if (!cancelled) setArchiveError(e instanceof Error ? e.message : "Projet illisible.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [archiveId, archiveToken]);

  const specKey = spec?.key ?? null;
  useEffect(() => {
    if (archiveId) return;
    if (!spec) {
      // Incomplete link (e.g. old /studio/editor?product=flyers): go choose the format
      router.replace(getProduct(productParam) ? `/studio/nouveau?product=${productParam}` : "/studio");
      return;
    }
    const existing = readDraft(spec);

    let design: StudioDesign | null = null;
    let notice: Resolved["notice"] = null;

    if (templateId || blank) {
      const template = templateId ? findTemplate(spec, templateId) : null;
      if (templateId && !template) {
        // Unknown / mismatching template for this format: never silently open the wrong document
        router.replace(`/studio/nouveau?${specToQuery(spec)}`);
        return;
      }
      design = withSpec(JSON.parse(JSON.stringify(template ? template.design : createBlankDesign(spec))), spec);
      if (existing && designHasContent(existing)) {
        // Keep a copy of the creation that is about to be replaced
        try {
          localStorage.setItem(previousDraftKey(spec), JSON.stringify({ design: existing, savedAt: Date.now() }));
          notice = "replaced";
        } catch {
          /* storage full: nothing to keep */
        }
      }
      writeDraft(spec, design);
      // Clean the URL so a refresh restores the draft instead of re-applying the template
      router.replace(`/studio/editor?${specToQuery(spec)}`);
    } else if (existing) {
      design = withSpec(existing, spec);
    } else {
      router.replace(`/studio/nouveau?${specToQuery(spec)}`);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolved({ key: spec.key, design, notice });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specKey, templateId, blank, archiveId]);

  if (archiveId) {
    if (archiveError) {
      return (
        <div className="h-dvh w-screen bg-[#070512] flex flex-col items-center justify-center gap-3 text-white p-6 text-center">
          <p className="font-bold">{archiveError}</p>
          <a href="/admin/print?tab=orders" className="text-av-orange text-sm underline">Retour aux commandes</a>
        </div>
      );
    }
    if (!resolved?.archiveOf || !resolved.spec) {
      return (
        <div className="h-dvh w-screen bg-[#070512] flex items-center justify-center text-white">
          <Loader2 className="animate-spin text-av-orange mr-2" />
          <span>Ouverture du projet archivé…</span>
        </div>
      );
    }
    return <StudioEditor key={resolved.key} spec={resolved.spec} initialDesign={resolved.design} initialNotice={null} archiveOf={resolved.archiveOf} versionRef={resolved.versionRef ?? null} />;
  }

  if (!spec || !resolved || resolved.key !== spec.key) {
    return (
      <div className="h-dvh w-screen bg-[#070512] flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-av-orange mr-2" />
        <span>Chargement du Studio de création...</span>
      </div>
    );
  }
  return <StudioEditor key={resolved.key} spec={spec} initialDesign={resolved.design} initialNotice={resolved.notice} />;
}

function StudioEditor({
  spec,
  initialDesign,
  initialNotice,
  archiveOf,
  versionRef,
}: {
  spec: StudioSpec;
  initialDesign: StudioDesign;
  initialNotice: "replaced" | null;
  archiveOf?: string;
  versionRef?: string | null;
}) {
  const [design, setDesign] = useState<StudioDesign>(initialDesign);
  const [activeSide, setActiveSide] = useState<"recto" | "verso">("recto");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showGuides, setShowGuides] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [notice, setNotice] = useState<"replaced" | null>(initialNotice);

  // Undo / Redo history
  const [history, setHistory] = useState<StudioDesign[]>([initialDesign]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Real save state
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Modals
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Virtual keyboard (phones): follow the visual viewport so the document stays visible
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => setViewportHeight(vv.height < window.innerHeight - 120 ? vv.height : null);
    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, []);

  const templates = useMemo(() => getTemplatesFor(spec), [spec]);
  const product = getProduct(spec.productId)!;

  const persistDraft = useCallback(
    (value: StudioDesign) => {
      if (archiveOf) {
        // archived order project: local working copy only, never saved over the customer's draft or the order
        setSaveState("archive");
        return;
      }
      const ok = writeDraft(spec, value);
      setSaveState(ok ? "saved" : "error");
      if (ok) setSavedAt(Date.now());
    },
    [spec, archiveOf]
  );

  // Save design to state with a history snapshot
  const commitDesignChange = useCallback(
    (newDesign: StudioDesign) => {
      setDesign(newDesign);
      persistDraft(newDesign);
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, JSON.parse(JSON.stringify(newDesign))];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex, persistDraft]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const restored = JSON.parse(JSON.stringify(history[historyIndex - 1]));
      setDesign(restored);
      persistDraft(restored);
      setHistoryIndex(historyIndex - 1);
      setSelectedElementId(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const restored = JSON.parse(JSON.stringify(history[historyIndex + 1]));
      setDesign(restored);
      persistDraft(restored);
      setHistoryIndex(historyIndex + 1);
      setSelectedElementId(null);
    }
  };

  const sideKey = activeSide === "recto" ? "recto" : "verso";

  // Element actions
  const handleAddElement = (element: StudioElement) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    newDesign[sideKey].elements.push(element);
    commitDesignChange(newDesign);
    setSelectedElementId(element.id);
  };

  const handleUpdateElement = (id: string, updates: Partial<StudioElement>) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    const target = newDesign[sideKey].elements.find((el: StudioElement) => el.id === id);
    if (target) {
      Object.assign(target, updates);
      commitDesignChange(newDesign);
    }
  };

  const handleDeleteElement = (id: string) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    newDesign[sideKey].elements = newDesign[sideKey].elements.filter((el: StudioElement) => el.id !== id);
    commitDesignChange(newDesign);
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleDuplicateElement = (id: string) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    const target = newDesign[sideKey].elements.find((el: StudioElement) => el.id === id);
    if (target) {
      const offset = Math.max(2, Math.min(design.widthMm, design.heightMm) * 0.04);
      const copy: StudioElement = {
        ...JSON.parse(JSON.stringify(target)),
        id: `el-${Date.now()}`,
        x: target.x + offset,
        y: target.y + offset,
      };
      newDesign[sideKey].elements.push(copy);
      commitDesignChange(newDesign);
      setSelectedElementId(copy.id);
    }
  };

  const moveLayer = (id: string, delta: 1 | -1) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    const els: StudioElement[] = newDesign[sideKey].elements;
    const idx = els.findIndex((el) => el.id === id);
    const to = idx + delta;
    if (idx < 0 || to < 0 || to >= els.length) return;
    [els[idx], els[to]] = [els[to], els[idx]];
    commitDesignChange(newDesign);
  };

  const handleUpdateBackgroundColor = (color: string) => {
    const newDesign = JSON.parse(JSON.stringify(design));
    newDesign[sideKey].backgroundColor = color;
    commitDesignChange(newDesign);
  };

  const handleApplyTemplate = (template: StudioTemplate) => {
    const cloned = withSpec(JSON.parse(JSON.stringify(template.design)), spec);
    commitDesignChange(cloned);
    setSelectedElementId(null);
  };

  const handleCopyRectoToVerso = () => {
    const newDesign = JSON.parse(JSON.stringify(design)) as StudioDesign;
    newDesign.verso = JSON.parse(JSON.stringify(newDesign.recto));
    newDesign.verso.elements = newDesign.verso.elements.map((el, i) => ({ ...el, id: `v${i}-${Date.now()}-${el.id}` }));
    commitDesignChange(newDesign);
    setActiveSide("verso");
    setSelectedElementId(null);
  };

  const handleRestorePrevious = () => {
    try {
      const raw = localStorage.getItem(previousDraftKey(spec));
      const prev = raw ? (JSON.parse(raw) as { design?: StudioDesign }).design : null;
      if (prev) {
        commitDesignChange(withSpec(prev, spec));
        localStorage.removeItem(previousDraftKey(spec));
        setSelectedElementId(null);
      }
    } catch {
      /* ignore */
    }
    setNotice(null);
  };

  // Keyboard shortcuts — ignored while typing in a field or directly on the document
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetEl = e.target as HTMLElement;
      const tag = targetEl.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || targetEl.isContentEditable) return;
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
        const target = design[sideKey].elements.find((el) => el.id === selectedElementId);
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

  const keyboardOpen = viewportHeight !== null;

  return (
    <div
      className="flex flex-col h-dvh w-screen overflow-hidden bg-[#070512]"
      style={keyboardOpen ? { height: viewportHeight ?? undefined } : undefined}
    >
      <StudioToolbar
        design={design}
        spec={spec}
        activeSide={activeSide}
        onSwitchSide={(side) => {
          setActiveSide(side);
          setSelectedElementId(null);
        }}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        saveState={saveState}
        savedAt={savedAt}
        onContinueToPrint={() => setIsPrintModalOpen(true)}
        onPreview={() => setIsPreviewOpen(true)}
        onCopyRectoToVerso={handleCopyRectoToVerso}
        hasVerso={spec.hasVerso}
        rectoHasContent={design.recto.elements.length > 0}
      />

      {archiveOf && (
        <div role="status" className="shrink-0 flex flex-wrap items-center gap-2 bg-av-violet/20 border-b border-av-violet/40 px-4 py-2 text-xs text-white">
          <History size={14} className="text-av-orange shrink-0" />
          <span>
            Projet archivé de la commande{versionRef ? <strong className="font-mono"> {versionRef}</strong> : null}. Copie de travail : vos modifications ne sont
            pas enregistrées et ne changent pas la version commandée.
          </span>
        </div>
      )}

      {notice === "replaced" && (
        <div role="status" className="shrink-0 flex flex-wrap items-center justify-between gap-2 bg-av-orange/15 border-b border-av-orange/30 px-4 py-2 text-xs text-white">
          <span className="flex items-center gap-2">
            <History size={14} className="text-av-orange shrink-0" />
            Votre précédente création pour ce format a été conservée.
          </span>
          <span className="flex items-center gap-2">
            <button onClick={handleRestorePrevious} className="font-bold text-av-orange hover:text-white transition cursor-pointer">
              Restaurer la version précédente
            </button>
            <button onClick={() => setNotice(null)} className="p-1 text-white/60 hover:text-white cursor-pointer" aria-label="Fermer">
              <X size={14} />
            </button>
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden relative">
        <StudioSidebar
          design={design}
          activeSide={activeSide}
          selectedElementId={selectedElementId}
          templates={templates}
          keyboardOpen={keyboardOpen}
          onSelectElement={setSelectedElementId}
          onAddElement={handleAddElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onBringForward={(id) => moveLayer(id, 1)}
          onSendBackward={(id) => moveLayer(id, -1)}
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
          onBringForward={(id) => moveLayer(id, 1)}
          onSendBackward={(id) => moveLayer(id, -1)}
          showGuides={showGuides}
          onToggleGuides={() => setShowGuides(!showGuides)}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      </div>

      <StudioPrintModal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} design={design} spec={spec} />

      {/* Clean preview: no guides, no selection */}
      {isPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Aperçu"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="studio-pop relative flex max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-3rem)] w-full max-w-4xl flex-col bg-[#0c081e] border border-white/10 rounded-3xl shadow-[0_40px_120px_-30px_rgba(108,43,217,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-5 md:px-8 md:pt-6 shrink-0">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">Aperçu · {spec.title}</h3>
                <p className="text-xs text-white/55 mt-1">
                  Format fini : {spec.dimensionsLabel}. Sans repères techniques, tel qu&apos;imprimé.
                </p>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
                aria-label="Fermer l'aperçu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 md:px-8 pb-4">
              <div className={`grid gap-6 md:gap-8 py-2 ${spec.hasVerso ? "md:grid-cols-2" : "grid-cols-1"}`}>
                {(
                  [
                    ["Recto", "text-av-orange", design.recto],
                    ...(spec.hasVerso ? [["Verso", "text-av-magenta", design.verso] as const] : []),
                  ] as const
                ).map(([title, color, side]) => (
                  <div key={title} className="space-y-3 flex flex-col items-center">
                    <span className={`text-[11px] font-extrabold uppercase tracking-[0.14em] ${color}`}>{title}</span>
                    <div className={design.heightMm > design.widthMm ? "w-[min(100%,320px)]" : "w-full"}>
                      <StudioCardPreview side={side} widthMm={design.widthMm} heightMm={design.heightMm} paper className="w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 p-4 md:px-8 border-t border-white/10 shrink-0">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-5 h-11 rounded-full text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                Continuer l&apos;édition
              </button>
              <button
                onClick={() => {
                  setIsPreviewOpen(false);
                  setIsPrintModalOpen(true);
                }}
                className="h-11 px-6 rounded-full bg-gradient-to-r from-av-orange to-av-magenta hover:brightness-110 text-white text-xs font-extrabold uppercase tracking-wider transition active:scale-95 shadow-lg shadow-av-orange/25 cursor-pointer"
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
          <Loader2 className="animate-spin text-av-orange mr-2" />
          <span>Chargement du Studio de création...</span>
        </div>
      }
    >
      <StudioEditorLoader />
    </Suspense>
  );
}
