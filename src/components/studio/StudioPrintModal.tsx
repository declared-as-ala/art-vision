"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { StudioDesign, StudioOrderSubmission } from "./studioTypes";
import { generatePrintPdf, getExportDpi } from "./StudioPdfExport";
import StudioCardPreview from "./StudioCardPreview";
import { formatEuro } from "./studioUtils";
import { getProduct, type StudioSpec } from "./studioProducts";
import studioCatalogRaw from "@/data/studio-catalog.json";
import {
  X,
  Printer,
  CheckCircle,
  Truck,
  FileCheck,
  Loader2,
  Check,
  ShieldCheck,
  Clock,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface StudioPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: StudioDesign;
  spec: StudioSpec;
}

/* ───────────── Catalog data (src/data/studio-catalog.json, derived from the print catalog) ───────────── */

interface CatalogPaper {
  id: string;
  name: string;
  fullName: string;
  sides: "recto" | "recto-verso";
  quantities: string[];
  rows: Record<string, Record<string, number>>;
}
interface FileGuidelines {
  acceptedFormats: string[];
  quality: string;
  bleed: string;
  technicalCheck: string;
  production: string;
  shipping: string;
  express: string;
}
interface CatalogEntry {
  catalogSlug: string;
  fileGuidelines: FileGuidelines;
  papers?: CatalogPaper[];
  material?: string;
  brackets?: { label: string; fromM2: number; toM2: number; minPerM2: number | null; maxPerM2: number | null }[];
}
const CATALOG = studioCatalogRaw as unknown as Record<string, CatalogEntry>;

type Finish = "softtouch" | "satin" | "rigid" | "spotuv" | "kraft";

function finishOf(name: string): Finish {
  const n = name.toLowerCase();
  if (n.includes("soft")) return "softtouch";
  if (n.includes("vernis")) return "spotuv";
  if (n.includes("recycl") || n.includes("eco")) return "kraft";
  if (/\b400/.test(n)) return "rigid";
  return "satin";
}
function weightOf(name: string): string | null {
  const m = name.match(/(\d{2,3})\s*gr?s?\b/i);
  return m ? `${m[1]} g` : null;
}
function describePaper(name: string): string {
  const n = name.toLowerCase();
  const parts: string[] = [];
  if (n.includes("soft")) parts.push("Pelliculage Soft-Touch (toucher velours)");
  if (n.includes("sélectif") || n.includes("selectif")) parts.push("pelliculage mat + vernis sélectif");
  else if (n.includes("vernis uv")) parts.push("Vernis UV brillant");
  if (n.includes("chromolux")) parts.push("papier nacré ChromoLux Pearl");
  if (n.includes("magic chrome")) parts.push("effet métallique au recto");
  if (n.includes("inscriptible")) parts.push("surface inscriptible");
  if (n.includes("recycl")) parts.push("matière recyclée");
  if (n.includes("fsc")) parts.push("papier certifié FSC");
  if (!parts.length) return "Papier professionnel.";
  const text = parts.join(" · ");
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const FINISH_STYLE: Record<Finish, { background: string; glare: number; glareSize: number; grain: number; ink: string; edge: string }> = {
  softtouch: { background: "linear-gradient(145deg,#33206a 0%,#1a0f3d 60%,#120a2b 100%)", glare: 0.16, glareSize: 75, grain: 0.22, ink: "#cdbcff", edge: "0 1px 0 #2a1a5c,0 2px 0 #1f1347" },
  satin: { background: "linear-gradient(145deg,#fbfaff 0%,#e6e1f5 60%,#d3cde8 100%)", glare: 0.55, glareSize: 55, grain: 0.05, ink: "#3b3470", edge: "0 1px 0 #cfc9e3,0 2px 0 #bdb6d6" },
  rigid: { background: "linear-gradient(145deg,#34343f 0%,#1d1d26 100%)", glare: 0.14, glareSize: 60, grain: 0.1, ink: "#d8d8e6", edge: "0 1px 0 #e9e6f2,0 2px 0 #cfcbe0,0 3px 0 #bbb6d2,0 4px 0 #a6a0c4,0 5px 0 #8f89b0" },
  spotuv: { background: "linear-gradient(145deg,#15102b 0%,#0a0718 100%)", glare: 0.2, glareSize: 70, grain: 0.14, ink: "#8a6bff", edge: "0 1px 0 #1c1536,0 2px 0 #120c28" },
  kraft: { background: "linear-gradient(145deg,#cfa86f 0%,#b48a52 55%,#a37b45 100%)", glare: 0.06, glareSize: 80, grain: 0.3, ink: "#4a3217", edge: "0 1px 0 #96703d,0 2px 0 #82622f" },
};

/** Smoothly counts from the previous value to the new one. */
function AnimatedNumber({ value, className = "" }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(from.current, value, {
      duration: 0.55,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => {
        from.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, reduce]);

  return <span className={`tabular-nums ${className}`}>{formatEuro(reduce ? value : display)}</span>;
}

/** Tactile paper sample: the sheen follows the finger / cursor to simulate the finish. */
function PaperSwatch({ finish }: { finish: Finish }) {
  const ref = useRef<HTMLDivElement>(null);
  const f = FINISH_STYLE[finish];

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    el.style.setProperty("--glare-on", "1");
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "-30%");
    el.style.setProperty("--glare-on", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      onPointerCancel={leave}
      className="relative h-[72px] rounded-lg overflow-hidden"
      style={{ background: f.background, boxShadow: f.edge, "--mx": "50%", "--my": "-30%", "--glare-on": "0" } as React.CSSProperties}
    >
      <div className="absolute inset-0 mix-blend-overlay" style={{ backgroundImage: GRAIN, backgroundSize: "120px 120px", opacity: f.grain }} />
      {finish === "kraft" && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(100deg,rgba(80,50,20,0.35) 0 1px,transparent 1px 7px),repeating-linear-gradient(80deg,rgba(255,230,180,0.25) 0 1px,transparent 1px 11px)",
          }}
        />
      )}
      <div className="absolute inset-0 flex flex-col justify-center px-3.5 gap-1">
        {finish === "spotuv" ? (
          <>
            <span
              className="text-[17px] leading-none font-extrabold tracking-tight"
              style={{
                backgroundImage: "radial-gradient(circle at var(--mx) var(--my), #ffffff 0%, #b9a4ff 18%, #6a3df0 42%, #2a1a6e 75%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              ART VISION
            </span>
            <span className="text-[8px] tracking-[0.2em] text-white/30">VERNIS</span>
          </>
        ) : (
          <>
            <span className="text-[14px] leading-none font-extrabold tracking-tight" style={{ color: f.ink }}>
              Art Vision
            </span>
            <span className="text-[8px] tracking-[0.2em]" style={{ color: f.ink, opacity: 0.55 }}>
              ÉCHANTILLON
            </span>
          </>
        )}
      </div>
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: "var(--glare-on)",
          background: `radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,${f.glare}) 0%, transparent ${f.glareSize}%)`,
        }}
      />
    </div>
  );
}

const COUNTRIES = ["France", "Belgique", "Luxembourg", "Suisse", "Allemagne", "Espagne", "Italie", "Pays-Bas", "Autre pays (précisez en remarque)"];

const inputCls =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-av-magenta focus:bg-white/[0.06] transition";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[11px] text-white/65 block mb-1">{label}</span>
      {children}
    </label>
  );
}

export default function StudioPrintModal({ isOpen, onClose, design, spec }: StudioPrintModalProps) {
  const product = getProduct(spec.productId)!;
  const entry = CATALOG[product.catalogKey];
  const isQuote = product.mode === "quote";

  const [step, setStep] = useState<"options" | "details" | "confirmation">("options");
  const [selectedSides, setSelectedSides] = useState<"recto" | "recto-verso">(product.hasVerso ? "recto-verso" : "recto");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<string>("500 ex");
  const [bacheQty, setBacheQty] = useState(1);

  // Client form state
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");
  const [notes, setNotes] = useState("");
  const [billingDifferent, setBillingDifferent] = useState(false);
  const [bName, setBName] = useState("");
  const [bStreet, setBStreet] = useState("");
  const [bZip, setBZip] = useState("");
  const [bCity, setBCity] = useState("");
  const [bCountry, setBCountry] = useState("France");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape + lock page scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, loading, onClose]);

  // Papers that exist for exactly this format (and both side variants if any)
  const papersForFormat = useMemo(() => (entry.papers ?? []).filter((p) => p.rows[spec.formatId]), [entry, spec.formatId]);
  const hasBothSides =
    product.hasVerso && papersForFormat.some((p) => p.sides === "recto") && papersForFormat.some((p) => p.sides === "recto-verso");
  const sidesInUse: "recto" | "recto-verso" = !product.hasVerso
    ? "recto"
    : hasBothSides
    ? selectedSides
    : papersForFormat[0]?.sides ?? "recto-verso";
  const papers = papersForFormat.filter((p) => p.sides === sidesInUse);
  const currentPaper = papers.find((p) => p.id === selectedPaperId) ?? papers[0] ?? null;

  const priceRow = currentPaper?.rows[spec.formatId] ?? {};
  const availableQuantities = (currentPaper?.quantities ?? []).filter((q) => priceRow[q] != null);
  const effectiveQuantity = availableQuantities.includes(selectedQuantity)
    ? selectedQuantity
    : availableQuantities.find((q) => parseInt(q, 10) >= 500) ?? availableQuantities[0] ?? "";

  // Bâche: per-m² tariff bracket × cumulated surface
  const areaM2 = (spec.widthMm / 1000) * (spec.heightMm / 1000);
  const totalAreaM2 = areaM2 * bacheQty;
  const bracket =
    entry.brackets?.find((b) => totalAreaM2 >= b.fromM2 && totalAreaM2 <= b.toM2) ?? entry.brackets?.[entry.brackets.length - 1];
  const bacheMin = bracket?.minPerM2 != null ? Math.round(totalAreaM2 * bracket.minPerM2 * 100) / 100 : 0;
  const bacheMax = bracket?.maxPerM2 != null ? Math.round(totalAreaM2 * bracket.maxPerM2 * 100) / 100 : bacheMin;

  const priceHt = isQuote ? bacheMin : priceRow[effectiveQuantity] ?? 0;
  const tva = Math.round(priceHt * 0.2 * 100) / 100;
  const priceTtc = Math.round((priceHt + tva) * 100) / 100;
  const quantityNumber = isQuote ? bacheQty : parseInt(effectiveQuantity, 10) || 1;
  const unitPrice = priceHt / quantityNumber;

  const withVerso = product.hasVerso && sidesInUse === "recto-verso";
  const totalW = design.widthMm + design.bleedMm * 2;
  const totalH = design.heightMm + design.bleedMm * 2;
  const exportDpi = Math.round(getExportDpi(totalW, totalH));
  const fmtMm = (n: number) => String(Math.round(n * 10) / 10).replace(".", ",");
  const fileInfoLabel = `${fmtMm(totalW)} × ${fmtMm(totalH)} mm (fond perdu ${design.bleedMm} mm inclus) · ${exportDpi} DPI`;
  const guidelines = entry.fileGuidelines;
  const deliveryNote = `Production : ${guidelines.production} Livraison : ${guidelines.shipping} Frais de livraison confirmés avec votre BAT.`;

  const missingCatalog = !isQuote && (!currentPaper || !effectiveQuantity);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !street || !city || !zipCode || !country) {
      setError("Veuillez renseigner tous les champs obligatoires pour la livraison et le suivi.");
      return;
    }
    if (billingDifferent && (!bName || !bStreet || !bZip || !bCity)) {
      setError("Complétez l'adresse de facturation ou décochez « Adresse de facturation différente ».");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Print-ready PDF (real size + bleed) and small previews
      const { pdfBlob, previewRecto, previewVerso, info } = await generatePrintPdf(design, true, { includeVerso: withVerso });

      const pdfBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(pdfBlob);
      });

      const paperTitle = isQuote ? entry.material || "Bâche PVC 510 g" : currentPaper!.fullName;
      const quantityLabel = isQuote
        ? `${bacheQty} bâche${bacheQty > 1 ? "s" : ""} (${totalAreaM2.toFixed(2).replace(".", ",")} m²)`
        : effectiveQuantity;

      const submission: StudioOrderSubmission = {
        productSlug: design.productSlug,
        productName: design.productName,
        format: `${spec.title} — ${spec.dimensionsLabel}`,
        formatId: spec.formatId,
        orientation: spec.orientation,
        orderMode: isQuote ? "quote" : "instant",
        sides: withVerso ? "recto-verso" : "recto",
        paperId: isQuote ? "baches-pvc-510g" : currentPaper!.id,
        paperTitle,
        quantity: quantityLabel,
        priceHtCents: Math.max(1, Math.round(priceHt * 100)),
        priceTtcCents: Math.max(1, Math.round(priceTtc * 100)),
        vatRate: 0.2,
        deliveryCents: 0, // delivery fees are confirmed with the BAT
        deliveryNote,
        exportInfo: `PDF ${info.pages} page${info.pages > 1 ? "s" : ""} · ${fmtMm(info.pageWidthMm)} × ${fmtMm(info.pageHeightMm)} mm · ${Math.round(info.dpi)} DPI`,
        previewRecto,
        previewVerso,
        designData: design,
        client: {
          name,
          email,
          phone,
          company,
          shippingAddress: { street, zipCode, city, country },
          billingAddress: billingDifferent ? { name: bName, street: bStreet, zipCode: bZip, city: bCity, country: bCountry } : undefined,
          notes,
        },
      };

      const res = await fetch("/api/studio/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...submission, pdfBase64 }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Une erreur est survenue lors de l'enregistrement de votre commande.");
      }

      setOrderId(data.orderId);
      setStep("confirmation");
    } catch (err: unknown) {
      console.error("Order submission error:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la commande.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const steps = [
    { id: "options", label: "Options" },
    { id: "details", label: "Livraison" },
    { id: "confirmation", label: "Confirmation" },
  ] as const;
  const stepIndex = steps.findIndex((s) => s.id === step);

  const previewSides = [
    { title: "Recto", side: design.recto, printed: true },
    ...(product.hasVerso ? [{ title: "Verso", side: design.verso, printed: withVerso }] : []),
  ];
  const portrait = design.heightMm > design.widthMm;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md"
      onClick={() => !loading && onClose()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="studio-pop relative flex flex-col w-full max-w-5xl max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-3rem)] bg-[#0c081e] border border-white/10 rounded-3xl shadow-[0_40px_120px_-30px_rgba(108,43,217,0.65)] text-left overflow-hidden outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-av-magenta/70 to-transparent" />

        {/* Header — always visible */}
        <div className="shrink-0 flex items-start justify-between gap-4 px-4 sm:px-8 pt-4 sm:pt-5 pb-3 border-b border-white/10">
          <div className="min-w-0 space-y-2">
            <ol className="flex items-center gap-2 text-[11px] font-semibold" aria-label="Progression de la commande">
              {steps.map((s, i) => {
                const done = i < stepIndex;
                const current = i === stepIndex;
                return (
                  <li key={s.id} className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all duration-300 ${
                        done ? "bg-emerald-500 text-white" : current ? "bg-gradient-to-br from-av-orange to-av-magenta text-white scale-110" : "bg-white/10 text-white/40"
                      }`}
                    >
                      {done ? <Check size={11} /> : i + 1}
                    </span>
                    <span className={`${current ? "text-white" : "text-white/40 hidden sm:inline"}`}>{s.label}</span>
                    {i < steps.length - 1 && <span className="w-4 sm:w-8 h-px bg-white/15" />}
                  </li>
                );
              })}
            </ol>
            <h2 id="print-modal-title" className="text-base sm:text-xl font-extrabold text-white tracking-tight truncate">
              {step === "confirmation"
                ? "Commande transmise"
                : step === "details"
                ? isQuote
                  ? "Votre demande de devis"
                  : "Livraison et coordonnées"
                : isQuote
                ? "Options de votre bâche"
                : "Options d'impression"}{" "}
              <span className="text-white/45 font-semibold text-sm sm:text-base">· {spec.title}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="shrink-0 p-2 -mr-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer disabled:opacity-40"
            aria-label="Fermer la fenêtre"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className={`grid gap-6 lg:gap-8 p-4 sm:p-8 ${step === "confirmation" ? "grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_320px]"}`}>
            <div className="min-w-0">
              <AnimatePresence mode="wait" initial={false}>
                {/* STEP 1 — options */}
                {step === "options" && (
                  <motion.div key="options" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-6">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 font-semibold text-white">
                        {spec.title} · {spec.dimensionsLabel}
                      </span>
                      <span className="text-white/45">Création incluse avec votre impression.</span>
                    </div>

                    {isQuote ? (
                      <>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-2 text-xs text-white/75 leading-relaxed">
                          <strong className="text-white text-sm block">{entry.material}</strong>
                          <p>
                            Dimensions : <strong className="text-white">{spec.dimensionsLabel}</strong> · surface unitaire{" "}
                            <strong className="text-white">{areaM2.toFixed(2).replace(".", ",")} m²</strong>.
                          </p>
                          <p>
                            Le tarif catalogue est au m² (dégressif selon la surface cumulée). Le montant ci-contre est une{" "}
                            <strong className="text-white">estimation</strong> : votre devis définitif vous est envoyé avec le BAT.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Nombre de bâches identiques</span>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setBacheQty((q) => Math.max(1, q - 1))} className="h-11 w-11 rounded-xl border border-white/15 bg-white/[0.05] text-lg font-bold text-white hover:bg-white/10 cursor-pointer" aria-label="Moins">
                              −
                            </button>
                            <span className="w-12 text-center text-lg font-extrabold text-white tabular-nums">{bacheQty}</span>
                            <button type="button" onClick={() => setBacheQty((q) => Math.min(100, q + 1))} className="h-11 w-11 rounded-xl border border-white/15 bg-white/[0.05] text-lg font-bold text-white hover:bg-white/10 cursor-pointer" aria-label="Plus">
                              +
                            </button>
                          </div>
                        </div>
                      </>
                    ) : missingCatalog ? (
                      <div role="alert" className="rounded-2xl border border-av-orange/40 bg-av-orange/10 p-4 text-xs text-white/85 leading-relaxed">
                        Aucun tarif catalogue n&apos;est publié pour ce format ({spec.title} {spec.dimensionsLabel}). Envoyez-nous votre demande :
                        un devis sur mesure vous sera adressé.
                      </div>
                    ) : (
                      <>
                        {hasBothSides && (
                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Impression des faces</span>
                            <div className="grid grid-cols-2 gap-3">
                              {(
                                [
                                  ["recto-verso", "Recto / Verso", "Les deux faces sont imprimées."],
                                  ["recto", "Recto seul", "Verso non imprimé."],
                                ] as const
                              ).map(([value, title, hint]) => {
                                const active = sidesInUse === value;
                                return (
                                  <button
                                    key={value}
                                    type="button"
                                    onClick={() => setSelectedSides(value)}
                                    className={`relative p-3.5 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                                      active ? "bg-av-violet/20 border-av-orange shadow-[0_0_0_1px_#FF6A00]" : "bg-white/[0.03] border-white/10 hover:border-white/25"
                                    }`}
                                  >
                                    <strong className="block text-xs font-bold text-white">{title}</strong>
                                    <span className="text-[11px] text-white/50">{hint}</span>
                                    {active && (
                                      <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-av-orange flex items-center justify-center">
                                        <Check size={10} className="text-white" />
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-end justify-between gap-3">
                            <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Papier &amp; finition</span>
                            <span className="text-[10px] text-white/35 hidden sm:inline">Survolez pour sentir la matière</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Papier et finition">
                            {papers.map((p) => {
                              const active = currentPaper?.id === p.id;
                              const w = weightOf(p.name);
                              return (
                                <motion.div
                                  key={p.id}
                                  role="radio"
                                  aria-checked={active}
                                  tabIndex={0}
                                  whileTap={{ scale: 0.975 }}
                                  onClick={() => setSelectedPaperId(p.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      setSelectedPaperId(p.id);
                                    }
                                  }}
                                  className={`relative p-2.5 rounded-2xl border text-left transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-av-orange ${
                                    active ? "bg-av-violet/20 border-av-magenta shadow-[0_0_0_1px_#D72888]" : "bg-white/[0.03] border-white/10 hover:border-white/25"
                                  }`}
                                >
                                  <PaperSwatch finish={finishOf(p.name)} />
                                  <div className="pt-2.5 px-1 pb-0.5">
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="text-xs font-bold text-white leading-snug">{p.name}</span>
                                      {w && (
                                        <span className="text-[9px] font-bold text-av-orange bg-av-orange/10 border border-av-orange/20 rounded-full px-2 py-0.5 shrink-0">
                                          {w}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-white/50 leading-snug mt-1">{describePaper(p.name)}</p>
                                  </div>
                                  {active && (
                                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-av-orange to-av-magenta flex items-center justify-center shadow-lg">
                                      <Check size={12} className="text-white" />
                                    </span>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Quantité</span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {availableQuantities.map((q) => {
                              const price = priceRow[q];
                              const isSelected = effectiveQuantity === q;
                              return (
                                <button
                                  key={q}
                                  type="button"
                                  onClick={() => setSelectedQuantity(q)}
                                  className={`relative p-3 rounded-2xl border text-center transition-all active:scale-95 cursor-pointer ${
                                    isSelected
                                      ? "bg-gradient-to-br from-av-orange to-av-magenta text-white border-transparent shadow-lg shadow-av-orange/25"
                                      : "bg-white/[0.03] border-white/10 text-white/80 hover:bg-white/[0.07]"
                                  }`}
                                >
                                  <span className="block text-sm font-extrabold">{q}</span>
                                  <span className="text-[11px] opacity-80 mt-0.5 block">{formatEuro(price)} € HT</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-[11px] text-white/65 space-y-1.5 leading-relaxed">
                      <p className="flex gap-2"><Clock size={13} className="text-av-orange shrink-0 mt-0.5" /> <span><strong className="text-white/90">Production :</strong> {guidelines.production}</span></p>
                      <p className="flex gap-2"><Truck size={13} className="text-av-orange shrink-0 mt-0.5" /> <span><strong className="text-white/90">Livraison :</strong> {guidelines.shipping} Frais de livraison confirmés avec votre BAT.</span></p>
                      <p className="flex gap-2"><ShieldCheck size={13} className="text-av-orange shrink-0 mt-0.5" /> <span>{guidelines.technicalCheck}</span></p>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 — details */}
                {step === "details" && (
                  <motion.form
                    id="studio-order-form"
                    key="details"
                    onSubmit={handleSubmitOrder}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <p className="text-[11px] font-bold text-av-orange uppercase tracking-wider">Étape 2 sur 3 — Coordonnées et livraison</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Nom et prénom *"><input type="text" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Jean Dupont" className={inputCls} /></Field>
                      <Field label="Entreprise / marque (optionnel)"><input type="text" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" placeholder="Mon Entreprise SAS" className={inputCls} /></Field>
                      <Field label="E-mail pour le Bon à Tirer (BAT) *"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="contact@monentreprise.fr" className={inputCls} /></Field>
                      <Field label="Téléphone de suivi *"><input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="06 12 34 56 78" className={inputCls} /></Field>
                      <Field label="Adresse de livraison (rue, n°) *" className="sm:col-span-2"><input type="text" required value={street} onChange={(e) => setStreet(e.target.value)} autoComplete="street-address" placeholder="14 rue des Créateurs" className={inputCls} /></Field>
                      <Field label="Code postal *"><input type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} autoComplete="postal-code" placeholder="75001" className={inputCls} /></Field>
                      <Field label="Ville *"><input type="text" required value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" placeholder="Paris" className={inputCls} /></Field>
                      <Field label="Pays de livraison *" className="sm:col-span-2">
                        <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls} autoComplete="country-name">
                          {COUNTRIES.map((c) => (<option key={c} value={c} className="bg-[#120c28]">{c}</option>))}
                        </select>
                      </Field>

                      <label className="sm:col-span-2 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white/80 cursor-pointer">
                        <input type="checkbox" checked={billingDifferent} onChange={(e) => setBillingDifferent(e.target.checked)} className="h-4 w-4 accent-[#D72888]" />
                        Adresse de facturation différente
                      </label>

                      {billingDifferent && (
                        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                          <Field label="Nom / société à facturer *" className="sm:col-span-2"><input type="text" value={bName} onChange={(e) => setBName(e.target.value)} className={inputCls} /></Field>
                          <Field label="Adresse de facturation *" className="sm:col-span-2"><input type="text" value={bStreet} onChange={(e) => setBStreet(e.target.value)} className={inputCls} /></Field>
                          <Field label="Code postal *"><input type="text" value={bZip} onChange={(e) => setBZip(e.target.value)} className={inputCls} /></Field>
                          <Field label="Ville *"><input type="text" value={bCity} onChange={(e) => setBCity(e.target.value)} className={inputCls} /></Field>
                          <Field label="Pays *" className="sm:col-span-2">
                            <select value={bCountry} onChange={(e) => setBCountry(e.target.value)} className={inputCls}>
                              {COUNTRIES.map((c) => (<option key={c} value={c} className="bg-[#120c28]">{c}</option>))}
                            </select>
                          </Field>
                        </div>
                      )}

                      <Field label="Remarques ou instructions PAO" className="sm:col-span-2"><input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex : vernis uniquement sur le logo recto" className={inputCls} /></Field>
                    </div>

                    <div className="p-3.5 bg-white/[0.04] rounded-2xl border border-white/10 space-y-2 text-[11px] text-white/70">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <FileCheck size={14} className="text-emerald-400" /> Ce qui se passe ensuite :
                      </span>
                      <ol className="space-y-1.5">
                        {[
                          ["Contrôle du fichier", " par notre atelier PAO (fonds perdus, résolution)."],
                          ["Validation du BAT", " : vous recevez votre Bon à Tirer numérique par e-mail sous 24h ouvrées."],
                          ["Règlement", " uniquement après votre validation du BAT."],
                          ["Production", " puis expédition suivie."],
                        ].map(([strong, rest], i) => (
                          <li key={strong} className="flex gap-2">
                            <span className="w-4 h-4 rounded-full bg-av-violet/30 text-[9px] font-bold text-av-orange flex items-center justify-center shrink-0 mt-px">{i + 1}</span>
                            <span><strong className="text-white/90">{strong}</strong>{rest}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {error && (
                      <div role="alert" className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300">
                        {error}
                      </div>
                    )}
                  </motion.form>
                )}

                {/* STEP 3 — confirmation */}
                {step === "confirmation" && (
                  <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="text-center py-4 space-y-5">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }} className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle size={36} />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-extrabold text-white tracking-tight">
                        {isQuote ? "Demande de devis transmise !" : "Commande transmise avec succès !"}
                      </h3>
                      <p className="text-xs text-white/70 max-w-md mx-auto">
                        Référence : <strong className="text-av-orange">#{orderId || "AV-STUDIO"}</strong>
                      </p>
                    </div>
                    <div className="flex justify-center gap-4 max-w-md mx-auto">
                      {previewSides.map((p) => (
                        <div key={p.title} className={portrait ? "w-[38%]" : "w-1/2"}>
                          <StudioCardPreview side={p.side} widthMm={design.widthMm} heightMm={design.heightMm} paper className="w-full" />
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-white/[0.04] rounded-2xl border border-white/10 max-w-lg mx-auto text-left text-xs space-y-2 text-white/80">
                      <h4 className="font-bold uppercase text-[11px] tracking-wider text-av-magenta">Prochaines étapes</h4>
                      <p>• Contrôle de votre fichier par notre service PAO (repères de coupe, résolution).</p>
                      <p>• Vous recevez votre <strong>BAT numérique</strong> à <strong>{email}</strong> sous 24h ouvrées.</p>
                      <p>• Le règlement est demandé uniquement après votre validation du BAT, puis la production démarre.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order recap */}
            {step !== "confirmation" && (
              <aside className="lg:sticky lg:top-0 self-start space-y-4 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">Votre commande</span>
                  <span className="text-[10px] text-white/40">{spec.dimensionsLabel}</span>
                </div>

                <div className={`grid gap-3 ${previewSides.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {previewSides.map((p) => (
                    <div key={p.title} className="space-y-1.5">
                      <div className="relative flex justify-center">
                        <div className={portrait || previewSides.length === 1 ? "w-[78%]" : "w-full"}>
                          <StudioCardPreview side={p.side} widthMm={design.widthMm} heightMm={design.heightMm} paper className={`w-full transition-all duration-300 ${p.printed ? "" : "opacity-30 grayscale"}`} />
                        </div>
                        {!p.printed && (
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold uppercase tracking-wider text-white/80">Non imprimé</span>
                        )}
                      </div>
                      <span className="block text-center text-[10px] font-semibold text-white/50">{p.title}</span>
                    </div>
                  ))}
                </div>

                <dl className="space-y-1.5 text-[11px] border-t border-white/10 pt-3">
                  <div className="flex justify-between gap-3"><dt className="text-white/45">Support</dt><dd className="text-white/90 font-semibold text-right">{spec.title}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-white/45">Format</dt><dd className="text-white/90 font-semibold text-right">{spec.dimensionsLabel}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-white/45">Matière</dt><dd className="text-white/90 font-semibold text-right">{isQuote ? "PVC 510 g" : currentPaper?.name ?? "—"}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-white/45">Faces</dt><dd className="text-white/90 font-semibold">{withVerso ? "Recto / Verso" : "Recto seul"}</dd></div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-white/45">Quantité</dt>
                    <dd className="text-white/90 font-semibold text-right">
                      {isQuote ? `${bacheQty} (${totalAreaM2.toFixed(2).replace(".", ",")} m²)` : effectiveQuantity || "—"}
                      {!isQuote && effectiveQuantity && <span className="text-white/35 font-normal"> · {formatEuro(unitPrice)} €/ex</span>}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3"><dt className="text-white/45">Fichier</dt><dd className="text-white/70 text-right">{fileInfoLabel}</dd></div>
                </dl>

                <div className="border-t border-white/10 pt-3 space-y-1.5">
                  {isQuote && <p className="text-[10px] font-bold uppercase tracking-wider text-av-orange">Estimation indicative</p>}
                  <div className="flex justify-between text-xs text-white/65">
                    <span>Total HT{isQuote ? " (dès)" : ""}</span>
                    <span className="font-semibold text-white"><AnimatedNumber value={priceHt} /> €</span>
                  </div>
                  {isQuote && bacheMax > bacheMin && (
                    <p className="text-[10px] text-white/45">Jusqu&apos;à {formatEuro(bacheMax)} € HT selon les finitions.</p>
                  )}
                  <div className="flex justify-between text-xs text-white/65">
                    <span>TVA (20 %)</span>
                    <span className="font-semibold text-white/90"><AnimatedNumber value={tva} /> €</span>
                  </div>
                  <div className="flex items-end justify-between pt-1.5">
                    <span className="text-xs font-bold text-white">Total TTC</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-av-orange to-av-magenta bg-clip-text text-transparent leading-none">
                      <AnimatedNumber value={priceTtc} /> €
                    </span>
                  </div>
                  <p className="text-[10px] text-white/45 leading-snug pt-1">Livraison : frais confirmés avec votre BAT. Paiement après validation du BAT.</p>
                </div>
              </aside>
            )}
          </div>
        </div>

        {/* Footer — action buttons always reachable */}
        <div className="shrink-0 border-t border-white/10 bg-[#0c081e] px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
          {step === "options" && (
            <>
              <div className="min-w-0 leading-tight">
                <span className="block text-[10px] text-white/45">{isQuote ? "Estimation TTC" : "Total TTC"}</span>
                <span className="text-lg font-extrabold text-white tabular-nums">{formatEuro(priceTtc)} €</span>
              </div>
              <button
                type="button"
                onClick={() => setStep("details")}
                className="h-11 px-5 sm:px-8 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-to-r from-av-orange to-av-magenta hover:brightness-110 text-white rounded-full text-xs font-extrabold uppercase tracking-wider transition active:scale-95 shadow-lg shadow-av-orange/25 cursor-pointer"
              >
                {isQuote || missingCatalog ? "Continuer" : "Valider mes options"} <ArrowRight size={15} />
              </button>
            </>
          )}
          {step === "details" && (
            <>
              <button
                type="button"
                onClick={() => setStep("options")}
                disabled={loading}
                className="h-11 px-4 inline-flex items-center gap-1.5 rounded-full text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer disabled:opacity-40"
              >
                <ArrowLeft size={14} /> <span className="hidden sm:inline">Modifier les options</span><span className="sm:hidden">Retour</span>
              </button>
              <button
                type="submit"
                form="studio-order-form"
                disabled={loading}
                className="h-11 px-5 sm:px-8 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-to-r from-av-orange to-av-magenta hover:brightness-110 disabled:opacity-60 disabled:cursor-wait text-white rounded-full text-xs font-extrabold uppercase tracking-wider transition active:scale-[0.98] shadow-lg shadow-av-orange/25 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Envoi en cours…</span>
                  </>
                ) : (
                  <>
                    <Printer size={16} />
                    <span className="hidden sm:inline">{isQuote ? "Envoyer ma demande de devis" : `Envoyer ma commande (${formatEuro(priceTtc)} € TTC)`}</span>
                    <span className="sm:hidden">{isQuote ? "Envoyer ma demande" : "Envoyer ma commande"}</span>
                  </>
                )}
              </button>
            </>
          )}
          {step === "confirmation" && (
            <button
              onClick={onClose}
              className="ml-auto h-11 px-7 bg-av-violet hover:brightness-110 text-white rounded-full text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              Retourner à mon projet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
