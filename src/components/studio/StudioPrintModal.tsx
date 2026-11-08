"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { StudioDesign, StudioOrderSubmission } from "./studioTypes";
import { generatePrintPdf } from "./StudioPdfExport";
import StudioCardPreview from "./StudioCardPreview";
import { formatEuro } from "./studioUtils";
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
}

type Finish = "softtouch" | "satin" | "rigid" | "spotuv" | "kraft";

interface Paper {
  id: string;
  name: string;
  short: string;
  badge: string;
  touch: string;
  finish: Finish;
  description: string;
  sides: string;
  prices: Record<string, number>;
}

// Real price matrix from Art Vision catalog for Cartes de visite
const PAPERS: Paper[] = [
  {
    id: "300-grs-pelliculage-soft-touch-recto-verso",
    name: "300g FSC + Pelliculage Soft-Touch (Effet Velours)",
    short: "Soft-Touch Velours",
    badge: "300 g · Premium",
    touch: "Toucher peau de pêche, anti-traces",
    finish: "softtouch",
    description: "Toucher peau de pêche luxueux, haute résistance aux rayures.",
    sides: "recto-verso",
    prices: { "250 ex": 70, "500 ex": 75, "1000 ex": 103, "2500 ex": 128 },
  },
  {
    id: "300grs-m-fsc",
    name: "300g FSC Couché Satiné Standard",
    short: "Couché satiné",
    badge: "300 g · FSC",
    touch: "Lisse, légèrement soyeux",
    finish: "satin",
    description: "Support éco-responsable certifié, excellent rendu des contrastes.",
    sides: "both",
    prices: { "500 ex": 46, "1000 ex": 62, "2500 ex": 75, "5000 ex": 110 },
  },
  {
    id: "400grs-m-fsc",
    name: "400g FSC Cartonné Extra-Rigide",
    short: "Cartonné extra-rigide",
    badge: "400 g · Rigide",
    touch: "Épais et ferme, tenue parfaite",
    finish: "rigid",
    description: "Grande rigidité haut de gamme, tenue parfaite en main.",
    sides: "both",
    prices: { "500 ex": 52, "1000 ex": 70, "2500 ex": 85, "5000 ex": 120 },
  },
  {
    id: "400-gr-m2-vernis-selectif",
    name: "400g Pelliculage Mat + Vernis Sélectif Brillant 3D",
    short: "Vernis 3D sélectif",
    badge: "400 g · Effet 3D",
    touch: "Fond mat, reliefs brillants en surépaisseur",
    finish: "spotuv",
    description: "Contraste spectaculaire entre fond mat et zones vernies brillantes.",
    sides: "recto-verso",
    prices: { "250 ex": 89, "500 ex": 99, "1000 ex": 135, "2000 ex": 175 },
  },
  {
    id: "eco-300-gr-carton-recycle",
    name: "300g Carton Recyclé Kraft Naturel",
    short: "Kraft recyclé",
    badge: "300 g · Éco",
    touch: "Brut et chaleureux, fibres visibles",
    finish: "kraft",
    description: "Look écologique authentique, idéal pour éco-entreprises et artisans.",
    sides: "both",
    prices: { "500 ex": 49, "1000 ex": 66, "2500 ex": 82, "5000 ex": 118 },
  },
];

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const FINISH_STYLE: Record<
  Finish,
  { background: string; glare: number; glareSize: number; grain: number; ink: string; edge: string }
> = {
  softtouch: {
    background: "linear-gradient(145deg,#33206a 0%,#1a0f3d 60%,#120a2b 100%)",
    glare: 0.16,
    glareSize: 75,
    grain: 0.22,
    ink: "#cdbcff",
    edge: "0 1px 0 #2a1a5c,0 2px 0 #1f1347",
  },
  satin: {
    background: "linear-gradient(145deg,#fbfaff 0%,#e6e1f5 60%,#d3cde8 100%)",
    glare: 0.55,
    glareSize: 55,
    grain: 0.05,
    ink: "#3b3470",
    edge: "0 1px 0 #cfc9e3,0 2px 0 #bdb6d6",
  },
  rigid: {
    background: "linear-gradient(145deg,#34343f 0%,#1d1d26 100%)",
    glare: 0.14,
    glareSize: 60,
    grain: 0.1,
    ink: "#d8d8e6",
    edge: "0 1px 0 #e9e6f2,0 2px 0 #cfcbe0,0 3px 0 #bbb6d2,0 4px 0 #a6a0c4,0 5px 0 #8f89b0",
  },
  spotuv: {
    background: "linear-gradient(145deg,#15102b 0%,#0a0718 100%)",
    glare: 0.2,
    glareSize: 70,
    grain: 0.14,
    ink: "#8a6bff",
    edge: "0 1px 0 #1c1536,0 2px 0 #120c28",
  },
  kraft: {
    background: "linear-gradient(145deg,#cfa86f 0%,#b48a52 55%,#a37b45 100%)",
    glare: 0.06,
    glareSize: 80,
    grain: 0.3,
    ink: "#4a3217",
    edge: "0 1px 0 #96703d,0 2px 0 #82622f",
  },
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
      className="relative h-[84px] rounded-lg overflow-hidden touch-none"
      style={
        {
          background: f.background,
          boxShadow: f.edge,
          "--mx": "50%",
          "--my": "-30%",
          "--glare-on": "0",
        } as React.CSSProperties
      }
    >
      {/* material grain */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "120px 120px", opacity: f.grain }}
      />
      {finish === "kraft" && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(100deg,rgba(80,50,20,0.35) 0 1px,transparent 1px 7px),repeating-linear-gradient(80deg,rgba(255,230,180,0.25) 0 1px,transparent 1px 11px)",
          }}
        />
      )}

      {/* artwork */}
      <div className="absolute inset-0 flex flex-col justify-center px-3.5 gap-1">
        {finish === "spotuv" ? (
          <>
            <span
              className="text-[19px] leading-none font-extrabold tracking-tight"
              style={{
                backgroundImage:
                  "radial-gradient(circle at var(--mx) var(--my), #ffffff 0%, #b9a4ff 18%, #6a3df0 42%, #2a1a6e 75%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.6))",
              }}
            >
              ART VISION
            </span>
            <span className="h-px w-14 bg-white/10" />
            <span className="text-[8px] tracking-[0.2em] text-white/30">VERNIS SÉLECTIF 3D</span>
          </>
        ) : (
          <>
            <span className="text-[15px] leading-none font-extrabold tracking-tight" style={{ color: f.ink }}>
              Art Vision
            </span>
            <span className="h-px w-10" style={{ backgroundColor: f.ink, opacity: 0.35 }} />
            <span className="text-[8px] tracking-[0.2em]" style={{ color: f.ink, opacity: 0.55 }}>
              ÉCHANTILLON
            </span>
          </>
        )}
      </div>

      {/* light reflection following the pointer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: "var(--glare-on)",
          background: `radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,${f.glare}) 0%, transparent ${f.glareSize}%)`,
        }}
      />
      {finish === "spotuv" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.08) 48%, transparent 56%)",
          }}
        />
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-av-magenta focus:bg-white/[0.06] transition";

export default function StudioPrintModal({ isOpen, onClose, design }: StudioPrintModalProps) {
  const [step, setStep] = useState<"options" | "details" | "confirmation">("options");
  const [selectedPaperId, setSelectedPaperId] = useState<string>(PAPERS[0].id);
  const [selectedSides, setSelectedSides] = useState<"recto" | "recto-verso">("recto-verso");
  const [selectedQuantity, setSelectedQuantity] = useState<string>("500 ex");

  // Client form state
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Close on Escape + lock page scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const currentPaper = PAPERS.find((p) => p.id === selectedPaperId) || PAPERS[0];
  const availableQuantities = Object.keys(currentPaper.prices);
  const effectiveQuantity = availableQuantities.includes(selectedQuantity)
    ? selectedQuantity
    : availableQuantities[0];

  const priceHt = currentPaper.prices[effectiveQuantity] || 75;
  const tva = Math.round(priceHt * 0.2 * 100) / 100;
  const priceTtc = Math.round((priceHt + tva) * 100) / 100;
  const quantityNumber = parseInt(effectiveQuantity, 10) || 1;
  const unitPrice = priceHt / quantityNumber;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !street || !city || !zipCode) {
      setError("Veuillez renseigner tous les champs obligatoires pour la livraison et le suivi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Generate print-ready PDF and previews
      const { pdfBlob, previewRecto, previewVerso } = await generatePrintPdf(design, true);

      // Convert PDF to base64 for submission
      const pdfBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(pdfBlob);
      });

      const submission: StudioOrderSubmission = {
        productSlug: design.productSlug,
        productName: design.productName,
        format: `${design.widthMm} × ${design.heightMm} mm`,
        sides: selectedSides,
        paperId: currentPaper.id,
        paperTitle: currentPaper.name,
        quantity: effectiveQuantity,
        priceHtCents: Math.round(priceHt * 100),
        priceTtcCents: Math.round(priceTtc * 100),
        vatRate: 0.2,
        deliveryCents: 0, // Included in promotion
        previewRecto,
        previewVerso,
        designData: design,
        client: {
          name,
          email,
          phone,
          company,
          shippingAddress: {
            street,
            zipCode,
            city,
            country: "France",
          },
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

  const steps = [
    { id: "options", label: "Options" },
    { id: "details", label: "Livraison" },
    { id: "confirmation", label: "Confirmation" },
  ] as const;
  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Options d'impression et commande"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={() => !loading && onClose()}
    >
      <div
        className="studio-pop relative w-full max-w-5xl bg-[#0c081e] border border-white/10 rounded-3xl shadow-[0_40px_120px_-30px_rgba(108,43,217,0.65)] text-left my-2 sm:my-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-av-magenta/70 to-transparent" />

        {/* Header: stepper + close */}
        <div className="flex items-center justify-between gap-4 px-5 md:px-8 pt-5 md:pt-6">
          <ol className="flex items-center gap-2 text-[11px] font-semibold">
            {steps.map((s, i) => {
              const done = i < stepIndex;
              const current = i === stepIndex;
              return (
                <li key={s.id} className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all duration-300 ${
                      done
                        ? "bg-emerald-500 text-white"
                        : current
                        ? "bg-gradient-to-br from-av-orange to-av-magenta text-white shadow-md shadow-av-magenta/40 scale-110"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {done ? <Check size={12} /> : i + 1}
                  </span>
                  <span className={`hidden sm:inline ${current ? "text-white" : "text-white/40"}`}>{s.label}</span>
                  {i < steps.length - 1 && (
                    <span className="w-6 sm:w-10 h-px bg-white/10 relative overflow-hidden">
                      <span
                        className="absolute inset-y-0 left-0 bg-av-orange transition-all duration-500"
                        style={{ width: done ? "100%" : "0%" }}
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer disabled:opacity-40"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`grid gap-6 md:gap-8 p-5 md:p-8 ${
            step === "confirmation" ? "grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_340px]"
          }`}
        >
          {/* ───────── Left: step content ───────── */}
          <div className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              {/* STEP 1: OPTIONS */}
              {step === "options" && (
                <motion.div
                  key="options"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-av-orange/15 border border-av-orange/30 text-av-orange text-[11px] font-bold uppercase tracking-wider mb-2">
                      <Printer size={13} />
                      <span>Options d&apos;impression professionnelles</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                      Configurez l&apos;impression de vos cartes de visite
                    </h2>
                    <p className="text-xs text-white/55 mt-1">
                      Création en ligne incluse avec votre commande d&apos;impression Art Vision.
                    </p>
                  </div>

                  {/* Sides */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
                      Impression des faces
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          ["recto-verso", "Recto / Verso", "Recommandé : contacts et présentation."],
                          ["recto", "Recto seul", "Verso blanc non imprimé."],
                        ] as const
                      ).map(([value, title, hint]) => {
                        const active = selectedSides === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedSides(value)}
                            className={`relative p-3.5 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                              active
                                ? "bg-av-violet/20 border-av-orange shadow-[0_0_0_1px_#FF6A00,0_10px_30px_-12px_rgba(255,106,0,0.45)]"
                                : "bg-white/[0.03] border-white/10 hover:border-white/25"
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

                  {/* Paper swatches */}
                  <div className="space-y-2">
                    <div className="flex items-end justify-between">
                      <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
                        Papier &amp; finition
                      </span>
                      <span className="text-[10px] text-white/35">Touchez / survolez pour sentir la matière</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PAPERS.map((p) => {
                        const active = selectedPaperId === p.id;
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
                              active
                                ? "bg-av-violet/20 border-av-magenta shadow-[0_0_0_1px_#D72888,0_14px_36px_-14px_rgba(215,40,136,0.55)]"
                                : "bg-white/[0.03] border-white/10 hover:border-white/25 hover:-translate-y-0.5"
                            }`}
                          >
                            <PaperSwatch finish={p.finish} />
                            <div className="pt-2.5 px-1 pb-0.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-white">{p.short}</span>
                                <span className="text-[9px] font-bold text-av-orange bg-av-orange/10 border border-av-orange/20 rounded-full px-2 py-0.5 shrink-0">
                                  {p.badge}
                                </span>
                              </div>
                              <p className="text-[10px] text-white/50 leading-snug mt-1">{p.description}</p>
                              <p className="text-[10px] text-white/35 italic mt-1">{p.touch}</p>
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

                  {/* Quantity */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
                      Quantité souhaitée
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {availableQuantities.map((q) => {
                        const price = currentPaper.prices[q];
                        const isSelected = effectiveQuantity === q;
                        return (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setSelectedQuantity(q)}
                            className={`relative p-3 rounded-2xl border text-center transition-all active:scale-95 cursor-pointer ${
                              isSelected
                                ? "bg-gradient-to-br from-av-orange to-av-magenta text-white border-transparent shadow-lg shadow-av-orange/25 -translate-y-0.5"
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

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-av-orange to-av-magenta hover:brightness-110 text-white px-8 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition active:scale-95 shadow-lg shadow-av-orange/25 cursor-pointer"
                    >
                      Valider mes options <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: DETAILS */}
              {step === "details" && (
                <motion.form
                  key="details"
                  onSubmit={handleSubmitOrder}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => setStep("options")}
                      className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition cursor-pointer mb-2"
                    >
                      <ArrowLeft size={13} /> Modifier les options
                    </button>
                    <span className="text-[11px] font-bold text-av-orange uppercase tracking-wider block">
                      Étape 2 / 2 — Coordonnées &amp; Livraison
                    </span>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mt-1">
                      Finalisez votre demande d&apos;impression
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-white/65 block mb-1">Nom &amp; Prénom *</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/65 block mb-1">Entreprise / Marque (optionnel)</label>
                      <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Mon Entreprise SAS" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/65 block mb-1">Email pour le Bon à Tirer (BAT) *</label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@monentreprise.fr" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/65 block mb-1">Téléphone de suivi *</label>
                      <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-white/65 block mb-1">Adresse de livraison (Rue, N°) *</label>
                      <input type="text" required value={street} onChange={(e) => setStreet(e.target.value)} placeholder="14 Rue des Créateurs" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/65 block mb-1">Code Postal *</label>
                      <input type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="75001" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/65 block mb-1">Ville *</label>
                      <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Paris" className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-white/65 block mb-1">Remarques ou instructions PAO spécifiques</label>
                      <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex : vernis uniquement sur le logo recto" className={inputCls} />
                    </div>
                  </div>

                  <div className="p-3.5 bg-white/[0.04] rounded-2xl border border-white/10 space-y-2 text-[11px] text-white/70">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <FileCheck size={14} className="text-emerald-400" /> Processus de commande Art Vision :
                    </span>
                    <ol className="space-y-1.5">
                      {[
                        ["Contrôle technique PAO", " gratuit de votre création par notre atelier."],
                        ["Envoi de votre Bon à Tirer (BAT) numérique", " par e-mail sous 24h ouvrées."],
                        ["Règlement sécurisé", " uniquement après votre validation du BAT."],
                        ["Lancement en impression", " et expédition suivie."],
                      ].map(([strong, rest], i) => (
                        <li key={strong} className="flex gap-2">
                          <span className="w-4 h-4 rounded-full bg-av-violet/30 text-[9px] font-bold text-av-orange flex items-center justify-center shrink-0 mt-px">
                            {i + 1}
                          </span>
                          <span>
                            <strong className="text-white/90">{strong}</strong>
                            {rest}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {error && (
                    <div role="alert" className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-av-orange to-av-magenta hover:brightness-110 disabled:opacity-60 disabled:cursor-wait text-white py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition active:scale-[0.98] shadow-lg shadow-av-orange/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Génération du BAT &amp; envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Printer size={16} />
                        <span>Envoyer ma commande à l&apos;atelier ({formatEuro(priceTtc)} € TTC)</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {/* STEP 3: CONFIRMATION */}
              {step === "confirmation" && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="text-center py-6 space-y-5"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                    className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400"
                  >
                    <CheckCircle size={36} />
                  </motion.div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Commande transmise avec succès !</h2>
                    <p className="text-xs text-white/70 max-w-md mx-auto">
                      Votre création a été enregistrée sous la référence{" "}
                      <strong className="text-av-orange">#{orderId || "AV-STUDIO"}</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <StudioCardPreview side={design.recto} widthMm={design.widthMm} heightMm={design.heightMm} paper className="w-full" />
                    <StudioCardPreview side={design.verso} widthMm={design.widthMm} heightMm={design.heightMm} paper className="w-full" />
                  </div>

                  <div className="p-4 bg-white/[0.04] rounded-2xl border border-white/10 max-w-lg mx-auto text-left text-xs space-y-2 text-white/80">
                    <h4 className="font-bold uppercase text-[11px] tracking-wider text-av-magenta">Prochaines étapes :</h4>
                    <p>• Notre service PAO vérifie vos repères de coupe et la résolution de vos images.</p>
                    <p>
                      • Vous recevrez votre <strong>Bon à Tirer (BAT) numérique</strong> à l&apos;adresse{" "}
                      <strong>{email}</strong> sous 24h ouvrées.
                    </p>
                    <p>• Le lien de paiement sécurisé vous sera envoyé dès validation finale de votre maquette.</p>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={onClose}
                      className="bg-av-violet hover:brightness-110 text-white px-7 py-2.5 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer"
                    >
                      Retourner à mon projet
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ───────── Right: order recap ───────── */}
          {step !== "confirmation" && (
            <aside className="lg:sticky lg:top-6 self-start space-y-4 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">Votre commande</span>
                <span className="text-[10px] text-white/40">{design.widthMm} × {design.heightMm} mm</span>
              </div>

              {/* Recto / Verso side by side */}
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ["Recto", design.recto, true],
                    ["Verso", design.verso, selectedSides === "recto-verso"],
                  ] as const
                ).map(([title, side, printed]) => (
                  <div key={title} className="space-y-1.5">
                    <div className="relative">
                      <StudioCardPreview
                        side={side}
                        widthMm={design.widthMm}
                        heightMm={design.heightMm}
                        paper
                        className={`w-full transition-all duration-300 ${printed ? "" : "opacity-30 grayscale"}`}
                      />
                      {!printed && (
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold uppercase tracking-wider text-white/80">
                          Non imprimé
                        </span>
                      )}
                    </div>
                    <span className="block text-center text-[10px] font-semibold text-white/50">{title}</span>
                  </div>
                ))}
              </div>

              {/* Lines */}
              <dl className="space-y-1.5 text-[11px] border-t border-white/10 pt-3">
                <div className="flex justify-between gap-3">
                  <dt className="text-white/45">Papier</dt>
                  <dd className="text-white/90 font-semibold text-right">{currentPaper.short}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/45">Faces</dt>
                  <dd className="text-white/90 font-semibold">{selectedSides === "recto-verso" ? "Recto / Verso" : "Recto seul"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/45">Quantité</dt>
                  <dd className="text-white/90 font-semibold">
                    {effectiveQuantity}
                    <span className="text-white/35 font-normal"> · {formatEuro(unitPrice)} €/ex</span>
                  </dd>
                </div>
              </dl>

              {/* Animated totals */}
              <div className="border-t border-white/10 pt-3 space-y-1.5">
                <div className="flex justify-between text-xs text-white/65">
                  <span>Total HT</span>
                  <span className="font-semibold text-white">
                    <AnimatedNumber value={priceHt} /> €
                  </span>
                </div>
                <div className="flex justify-between text-xs text-white/65">
                  <span>TVA (20 %)</span>
                  <span className="font-semibold text-white/90">
                    <AnimatedNumber value={tva} /> €
                  </span>
                </div>
                <div className="flex items-end justify-between pt-1.5">
                  <span className="text-xs font-bold text-white">Total TTC</span>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-av-orange to-av-magenta bg-clip-text text-transparent leading-none">
                    <AnimatedNumber value={priceTtc} /> €
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5 text-[10px] text-white/55 pt-1">
                <li className="flex items-center gap-2">
                  <Truck size={13} className="text-av-orange shrink-0" /> Livraison suivie gratuite incluse · ateliers 3 à 5 jours
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={13} className="text-av-orange shrink-0" /> BAT numérique sous 24h ouvrées
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-av-orange shrink-0" /> Paiement uniquement après votre accord
                </li>
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
