"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, FileEdit, Loader2, Plus, RectangleHorizontal, RectangleVertical } from "lucide-react";
import {
  buildSpec,
  customSizeError,
  getProduct,
  orientationLabel,
  readDraft,
  specToQuery,
  designHasContent,
  type Orientation,
  type StudioFormat,
  type StudioProduct,
} from "@/components/studio/studioProducts";
import { getTemplatesFor } from "@/components/studio/StudioTemplateGenerators";
import StudioTemplateGallery from "@/components/studio/StudioTemplateGallery";

const STEPS = ["Support", "Format", "Modèle", "Personnalisation", "Impression"];

function Progress({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-semibold overflow-x-auto no-scrollbar" aria-label="Progression">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                done
                  ? "bg-emerald-500 text-white"
                  : active
                  ? "bg-gradient-to-br from-av-orange to-av-magenta text-white"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {i + 1}
            </span>
            <span className={`${active ? "text-white" : "text-white/40"} ${active ? "" : "hidden sm:inline"}`}>{label}</span>
            {i < STEPS.length - 1 && <span className="w-3 sm:w-6 h-px bg-white/15" />}
          </li>
        );
      })}
    </ol>
  );
}

function FormatShape({ f, active, orientation }: { f: StudioFormat; active: boolean; orientation?: Orientation }) {
  const o = f.orientable ? orientation ?? f.natural : f.natural;
  const swap = o !== f.natural;
  const w = swap ? f.heightMm : f.widthMm;
  const h = swap ? f.widthMm : f.heightMm;
  const max = 52;
  const k = max / Math.max(w, h);
  return (
    <span className="flex items-center justify-center h-14 w-14">
      <span
        className={`rounded-[3px] border transition-colors ${active ? "bg-av-orange/30 border-av-orange" : "bg-white/10 border-white/30"}`}
        style={{ width: w * k, height: h * k }}
      />
    </span>
  );
}

function Wizard() {
  const params = useSearchParams();
  const router = useRouter();
  const product: StudioProduct | null = getProduct(params.get("product"));

  const [formatId, setFormatId] = useState<string | null>(() => {
    const p = getProduct(params.get("product"));
    if (!p) return null;
    return params.get("format") ?? (p.formats.length === 1 ? p.formats[0].id : null);
  });
  const [orientation, setOrientation] = useState<Orientation | undefined>(() => {
    const o = params.get("orientation");
    return o === "portrait" || o === "landscape" ? o : undefined;
  });
  const [wCm, setWCm] = useState(() => params.get("w") ?? "300");
  const [hCm, setHCm] = useState(() => params.get("h") ?? "100");
  const needsFormatStep = !!product && (product.formats.length > 1 || product.formats.some((f) => f.orientable) || !!product.custom);
  const [confirmed, setConfirmed] = useState(() => {
    const p = getProduct(params.get("product"));
    return !!p && !(p.formats.length > 1 || p.formats.some((f) => f.orientable) || p.custom);
  });
  const [draftInfo, setDraftInfo] = useState<{ hasContent: boolean } | null>(null);

  useEffect(() => {
    if (!product) router.replace("/studio");
  }, [product, router]);

  const customError = product?.custom ? customSizeError(product, parseFloat(wCm.replace(",", ".")), parseFloat(hCm.replace(",", "."))) : null;

  const spec = useMemo(() => {
    if (!product) return null;
    if (product.custom) {
      if (customError) return null;
      return buildSpec(product, "custom", undefined, { w: parseFloat(wCm.replace(",", ".")), h: parseFloat(hCm.replace(",", ".")) });
    }
    if (!formatId) return null;
    return buildSpec(product, formatId, orientation);
  }, [product, formatId, orientation, wCm, hCm, customError]);

  // Is there already a draft for this exact support + format?
  useEffect(() => {
    if (!spec) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraftInfo(null);
      return;
    }
    const d = readDraft(spec);
    setDraftInfo(d && designHasContent(d) ? { hasContent: true } : null);
  }, [spec]);

  const templates = useMemo(() => (spec && confirmed ? getTemplatesFor(spec) : []), [spec, confirmed]);

  if (!product) {
    return (
      <div className="min-h-screen bg-av-night flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-av-orange mr-2" /> Chargement…
      </div>
    );
  }

  const editorHref = (extra: string) => `/studio/editor?${spec ? specToQuery(spec) : ""}${extra}`;
  const selectedFormat = product.formats.find((f) => f.id === formatId) ?? null;

  return (
    <main className="min-h-screen bg-av-night text-white pt-28 pb-20 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-[8%] w-[480px] h-[480px] bg-av-violet/20 rounded-full blur-[140px]" />
        <div className="absolute top-32 right-[6%] w-[420px] h-[420px] bg-av-magenta/15 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/studio" className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition w-fit">
            <ArrowLeft size={14} /> Changer de support
          </Link>
          <Progress current={confirmed && spec ? 2 : 1} />
        </div>

        {/* ───────── Step 2 — format & orientation ───────── */}
        {!(confirmed && spec) && (
          <section className="space-y-8" aria-labelledby="format-title">
            <header className="space-y-2 max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-av-orange">
                Étape 2 sur 5 · {product.name}
              </p>
              <h1 id="format-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {product.custom ? "Quelles dimensions pour votre bâche ?" : "Quel format et quelle orientation ?"}
              </h1>
            </header>

            {product.custom ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr] items-start">
                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-white/60">Largeur (cm)</span>
                      <input
                        inputMode="decimal"
                        value={wCm}
                        onChange={(e) => setWCm(e.target.value)}
                        className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-av-magenta"
                        aria-label="Largeur en centimètres"
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-white/60">Hauteur (cm)</span>
                      <input
                        inputMode="decimal"
                        value={hCm}
                        onChange={(e) => setHCm(e.target.value)}
                        className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-av-magenta"
                        aria-label="Hauteur en centimètres"
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["200 × 100", "200", "100"],
                      ["300 × 100", "300", "100"],
                      ["400 × 150", "400", "150"],
                      ["100 × 200", "100", "200"],
                    ].map(([label, w, h]) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setWCm(w);
                          setHCm(h);
                        }}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/75 hover:border-av-orange/60 hover:text-white transition cursor-pointer"
                      >
                        {label} cm
                      </button>
                    ))}
                  </div>
                  {customError ? (
                    <p role="alert" className="text-xs text-red-300 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2">
                      {customError}
                    </p>
                  ) : (
                    <p className="text-xs text-white/55 leading-relaxed">
                      Surface : <strong className="text-white">{((parseFloat(wCm.replace(",", ".")) * parseFloat(hCm.replace(",", "."))) / 10000).toFixed(2).replace(".", ",")} m²</strong>
                      . Fond perdu : {product.bleedMm} mm tout autour. Limites de production : de {product.custom.minCm} à {product.custom.maxCm} cm par côté,
                      {" "}{product.custom.maxAreaM2} m² maximum.
                    </p>
                  )}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex items-center justify-center min-h-[180px]">
                  {spec ? (
                    <div
                      className="rounded border border-av-orange bg-av-orange/15 flex items-center justify-center text-[11px] font-bold text-av-orange"
                      style={{
                        width: spec.widthMm >= spec.heightMm ? 280 : 280 * (spec.widthMm / spec.heightMm),
                        height: spec.widthMm >= spec.heightMm ? 280 * (spec.heightMm / spec.widthMm) : 280,
                      }}
                    >
                      {spec.dimensionsLabel}
                    </div>
                  ) : (
                    <span className="text-xs text-white/40">Aperçu des proportions</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" role="radiogroup" aria-label="Format">
                  {product.formats.map((f) => {
                    const active = formatId === f.id;
                    return (
                      <li key={f.id}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => {
                            setFormatId(f.id);
                            if (!f.orientable) setOrientation(undefined);
                            else if (!orientation) setOrientation(f.natural);
                          }}
                          className={`w-full flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition cursor-pointer ${
                            active
                              ? "border-av-orange bg-av-violet/20 shadow-[0_0_0_1px_#FF6A00]"
                              : "border-white/10 bg-white/[0.04] hover:border-white/30"
                          }`}
                        >
                          <FormatShape f={f} active={active} orientation={active ? orientation : undefined} />
                          <span className="text-sm font-bold text-white">{f.label}</span>
                          <span className="text-[11px] text-white/50">
                            {f.widthMm} × {f.heightMm} mm
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {selectedFormat?.orientable && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">Orientation</span>
                    <div className="flex gap-3">
                      {(
                        [
                          ["portrait", RectangleVertical],
                          ["landscape", RectangleHorizontal],
                        ] as const
                      ).map(([o, Icon]) => {
                        const active = (orientation ?? selectedFormat.natural) === o;
                        return (
                          <button
                            key={o}
                            type="button"
                            onClick={() => setOrientation(o)}
                            className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition cursor-pointer ${
                              active ? "border-av-orange bg-av-violet/20 text-white" : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/30"
                            }`}
                          >
                            <Icon size={18} className={active ? "text-av-orange" : ""} />
                            {orientationLabel(o)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                disabled={!spec}
                onClick={() => setConfirmed(true)}
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-gradient-to-r from-av-orange to-av-magenta text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-av-orange/25 hover:brightness-110 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Continuer <ArrowRight size={15} />
              </button>
              {spec && <span className="text-xs text-white/55">{spec.title} · {spec.dimensionsLabel}</span>}
            </div>
          </section>
        )}

        {/* ───────── Step 3 — template or blank ───────── */}
        {confirmed && spec && (
          <section className="space-y-8" aria-labelledby="tpl-title">
            <header className="space-y-3 max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-av-orange">Étape 3 sur 5 · Modèle</p>
              <h1 id="tpl-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Partir d&apos;un modèle ou d&apos;une page blanche ?
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-semibold text-white">
                  {spec.title} · {spec.dimensionsLabel}
                </span>
                {needsFormatStep && (
                  <button
                    type="button"
                    onClick={() => setConfirmed(false)}
                    className="font-bold text-av-orange hover:text-white transition cursor-pointer"
                  >
                    Modifier le format
                  </button>
                )}
              </div>
            </header>

            {draftInfo && (
              <div className="rounded-2xl border border-av-orange/40 bg-av-orange/10 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-white/85 leading-relaxed">
                  <strong className="text-white flex items-center gap-1.5">
                    <FileEdit size={14} className="text-av-orange" /> Vous avez déjà une création pour ce format.
                  </strong>
                  En choisir une nouvelle ci-dessous la remplacera ; l&apos;ancienne reste récupérable depuis l&apos;éditeur (« Restaurer la version précédente »).
                </div>
                <Link
                  href={editorHref("")}
                  className="shrink-0 inline-flex items-center justify-center h-10 px-5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition"
                >
                  Reprendre ma création
                </Link>
              </div>
            )}

            <StudioTemplateGallery
              templates={templates}
              hrefFor={(t) => editorHref(`&template=${encodeURIComponent(t.id)}`)}
              leading={
                <Link
                  href={editorHref("&blank=1")}
                  className="group flex flex-col rounded-2xl border border-dashed border-white/25 bg-white/[0.03] p-3 hover:border-av-orange/70 hover:bg-white/[0.06] transition"
                >
                  <div className="relative flex min-h-[140px] flex-1 items-center justify-center rounded-xl bg-white/[0.04]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-av-violet to-av-magenta text-white shadow-lg">
                      <Plus size={22} />
                    </span>
                  </div>
                  <span className="pt-3 px-0.5">
                    <span className="block text-xs font-bold text-white group-hover:text-av-orange transition-colors">Page blanche</span>
                    <span className="block text-[10px] text-white/45">Document vide, fond blanc</span>
                  </span>
                </Link>
              }
            />
          </section>
        )}
      </div>
    </main>
  );
}

export default function StudioNewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-av-night flex items-center justify-center text-white">
          <Loader2 className="animate-spin text-av-orange mr-2" /> Chargement…
        </div>
      }
    >
      <Wizard />
    </Suspense>
  );
}
