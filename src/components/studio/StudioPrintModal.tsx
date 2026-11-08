"use client";

import React, { useState } from "react";
import { StudioDesign, StudioOrderSubmission } from "./studioTypes";
import { generatePrintPdf } from "./StudioPdfExport";
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle,
  Truck,
  CreditCard,
  FileCheck,
  Loader2,
  Sparkles,
} from "lucide-react";

interface StudioPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: StudioDesign;
}

// Real price matrix from Art Vision catalog for Cartes de visite
const PAPERS = [
  {
    id: "300-grs-pelliculage-soft-touch-recto-verso",
    name: "300g FSC + Pelliculage Soft-Touch (Effet Velours)",
    description: "Toucher peau de pêche luxueux, haute résistance aux rayures.",
    sides: "recto-verso",
    prices: {
      "250 ex": 70,
      "500 ex": 75,
      "1000 ex": 103,
      "2500 ex": 128,
    },
  },
  {
    id: "300grs-m-fsc",
    name: "300g FSC Couché Satiné Standard",
    description: "Support éco-responsable certifié, excellent rendu des contrastes.",
    sides: "both",
    prices: {
      "500 ex": 46,
      "1000 ex": 62,
      "2500 ex": 75,
      "5000 ex": 110,
    },
  },
  {
    id: "400grs-m-fsc",
    name: "400g FSC Cartonné Extra-Rigide",
    description: "Grande rigidité haut de gamme, tenue parfaite en main.",
    sides: "both",
    prices: {
      "500 ex": 52,
      "1000 ex": 70,
      "2500 ex": 85,
      "5000 ex": 120,
    },
  },
  {
    id: "400-gr-m2-vernis-selectif",
    name: "400g Pelliculage Mat + Vernis Sélectif Brillant 3D",
    description: "Contraste spectaculaire entre fond mat et zones vernies brillantes.",
    sides: "recto-verso",
    prices: {
      "250 ex": 89,
      "500 ex": 99,
      "1000 ex": 135,
      "2000 ex": 175,
    },
  },
  {
    id: "eco-300-gr-carton-recycle",
    name: "300g Carton Recyclé Kraft Naturel",
    description: "Look écologique authentique, idéal pour éco-entreprises et artisans.",
    sides: "both",
    prices: {
      "500 ex": 49,
      "1000 ex": 66,
      "2500 ex": 82,
      "5000 ex": 118,
    },
  },
];

export default function StudioPrintModal({
  isOpen,
  onClose,
  design,
}: StudioPrintModalProps) {
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

  if (!isOpen) return null;

  const currentPaper = PAPERS.find((p) => p.id === selectedPaperId) || PAPERS[0];
  const availableQuantities = Object.keys(currentPaper.prices);
  const effectiveQuantity = availableQuantities.includes(selectedQuantity)
    ? selectedQuantity
    : availableQuantities[0];

  const priceHt = currentPaper.prices[effectiveQuantity as keyof typeof currentPaper.prices] || 75;
  const tva = Math.round(priceHt * 0.2 * 100) / 100;
  const priceTtc = Math.round((priceHt + tva) * 100) / 100;

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
    } catch (err: any) {
      console.error("Order submission error:", err);
      setError(err.message || "Erreur lors de la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0c081e] border border-brand-purple/30 rounded-3xl p-6 md:p-8 shadow-2xl text-left my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* STEP 1: OPTIONS SELECTION */}
        {step === "options" && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
                <Printer size={13} />
                <span>Options d'impression professionnelles</span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white font-montserrat">
                Configurez l'impression de vos cartes de visite
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Création en ligne incluse avec votre commande d'impression Art Vision.
              </p>
            </div>

            {/* Sides selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Impression des faces
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSides("recto-verso")}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    selectedSides === "recto-verso"
                      ? "bg-brand-purple/30 border-brand-orange text-white ring-1 ring-brand-orange"
                      : "bg-[#160f2e] border-brand-purple/20 text-white/70 hover:border-brand-magenta"
                  }`}
                >
                  <strong className="block text-xs font-bold text-white">Recto / Verso (2 faces)</strong>
                  <span className="text-[11px] text-white/50">Recommandé pour afficher contacts et présentation.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSides("recto")}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    selectedSides === "recto"
                      ? "bg-brand-purple/30 border-brand-orange text-white ring-1 ring-brand-orange"
                      : "bg-[#160f2e] border-brand-purple/20 text-white/70 hover:border-brand-magenta"
                  }`}
                >
                  <strong className="block text-xs font-bold text-white">Recto seul (1 face)</strong>
                  <span className="text-[11px] text-white/50">Verso blanc non imprimé.</span>
                </button>
              </div>
            </div>

            {/* Paper & Finish Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Support papier & finition
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {PAPERS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPaperId(p.id)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedPaperId === p.id
                        ? "bg-brand-purple/30 border-brand-magenta text-white ring-1 ring-brand-magenta"
                        : "bg-[#160f2e] border-brand-purple/15 text-white/70 hover:border-white/30"
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">{p.name}</span>
                    <span className="text-[10px] text-white/50 leading-tight block mt-1">
                      {p.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Quantité souhaitée
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableQuantities.map((q) => {
                  const price = currentPaper.prices[q as keyof typeof currentPaper.prices];
                  const isSelected = effectiveQuantity === q;
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setSelectedQuantity(q)}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        isSelected
                          ? "bg-brand-orange text-white border-brand-orange font-bold shadow-md shadow-brand-orange/20"
                          : "bg-[#160f2e] border-brand-purple/20 text-white/80 hover:bg-white/5"
                      }`}
                    >
                      <span className="block text-sm font-extrabold">{q}</span>
                      <span className="text-[11px] opacity-80 mt-0.5 block">{price} € HT</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Summary Bar */}
            <div className="bg-[#140e2b] border border-brand-purple/25 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-white font-montserrat">
                    {priceHt} € <span className="text-xs font-semibold text-white/50">HT</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {priceTtc} € TTC
                  </span>
                </div>
                <p className="text-[11px] text-white/50 flex items-center gap-1.5 justify-center sm:justify-start">
                  <Truck size={13} className="text-brand-orange" />
                  <span>Livraison suivie gratuite incluse • Délais atelier 3 à 5 jours</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep("details")}
                className="w-full sm:w-auto bg-gradient-to-r from-[#FF6A00] to-[#D72888] hover:from-[#e55f00] hover:to-[#c22077] text-white px-8 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition shadow-lg shadow-brand-orange/20 cursor-pointer"
              >
                Valider mes options →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CLIENT DETAILS & RECAPITULATIF */}
        {step === "details" && (
          <form onSubmit={handleSubmitOrder} className="space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                  Étape 2 / 2 — Coordonnées & Livraison
                </span>
                <button
                  type="button"
                  onClick={() => setStep("options")}
                  className="text-xs text-white/50 hover:text-white underline cursor-pointer"
                >
                  ← Modifier les options
                </button>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white font-montserrat mt-1">
                Finalisez votre demande d'impression
              </h2>
            </div>

            {/* Recap Box */}
            <div className="p-3.5 bg-[#140e2b] rounded-xl border border-brand-purple/20 text-xs flex flex-wrap justify-between gap-3 items-center">
              <div>
                <strong className="text-white block">
                  {design.productName} ({effectiveQuantity})
                </strong>
                <span className="text-[11px] text-white/50 block">
                  {currentPaper.name} • {selectedSides === "recto-verso" ? "Recto / Verso" : "Recto seul"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-brand-orange block">{priceTtc} € TTC</span>
                <span className="text-[10px] text-white/40">({priceHt} € HT + TVA 20%)</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div>
                <label className="text-[11px] text-white/70 block mb-1">Nom & Prénom *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full bg-[#160f2e] border border-brand-purple/30 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/70 block mb-1">Entreprise / Marque (optionnel)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Mon Entreprise SAS"
                  className="w-full bg-[#160f2e] border border-brand-purple/30 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/70 block mb-1">Email pour le Bon à Tirer (BAT) *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@monentreprise.fr"
                  className="w-full bg-[#160f2e] border border-brand-purple/30 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/70 block mb-1">Téléphone de suivi *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="w-full bg-[#160f2e] border border-brand-purple/30 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] text-white/70 block mb-1">Adresse de livraison (Rue, N°) *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="14 Rue des Créateurs"
                  className="w-full bg-[#160f2e] border border-brand-purple/30 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/70 block mb-1">Code Postal *</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="75001"
                  className="w-full bg-[#160f2e] border border-brand-purple/30 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/70 block mb-1">Ville *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Paris"
                  className="w-full bg-[#160f2e] border border-brand-purple/30 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] text-white/70 block mb-1">Remarques ou instructions PAO spécifiques</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex : vernis uniquement sur le logo recto"
                  className="w-full bg-[#160f2e] border border-brand-purple/30 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-magenta"
                />
              </div>
            </div>

            {/* Workflow steps announcement */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-[11px] text-white/70">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FileCheck size={14} className="text-emerald-400" /> Processus de commande Art Vision :
              </span>
              <p>
                1. <strong>Contrôle technique PAO</strong> gratuit de votre création par notre atelier.
                <br />
                2. <strong>Envoi de votre Bon à Tirer (BAT) numérique</strong> par e-mail sous 24h ouvrées.
                <br />
                3. <strong>Règlement sécurisé</strong> uniquement après votre validation du BAT.
                <br />
                4. <strong>Lancement en impression</strong> et expédition suivie.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF6A00] to-[#D72888] hover:from-[#e55f00] hover:to-[#c22077] disabled:opacity-50 text-white py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition shadow-lg shadow-brand-orange/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Génération du BAT & Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Printer size={16} />
                  <span>Envoyer ma commande à l'atelier ({priceTtc} € TTC)</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: ORDER CONFIRMATION */}
        {step === "confirmation" && (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white font-montserrat">
                Commande transmise avec succès !
              </h2>
              <p className="text-xs text-white/70 max-w-md mx-auto">
                Votre création a été enregistrée sous la référence{" "}
                <strong className="text-brand-orange">#{orderId || "AV-STUDIO"}</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#140e2b] rounded-2xl border border-brand-purple/20 max-w-lg mx-auto text-left text-xs space-y-2 text-white/80">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-brand-magenta">
                Prochaines étapes :
              </h4>
              <p>
                • Notre service PAO vérifie vos repères de coupe et la résolution de vos images.
              </p>
              <p>
                • Vous recevrez votre <strong>Bon à Tirer (BAT) numérique</strong> à l'adresse <strong>{email}</strong> sous 24h ouvrées.
              </p>
              <p>
                • Le lien de paiement sécurisé vous sera envoyé dès validation finale de votre maquette.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="bg-brand-purple hover:bg-brand-purple/90 text-white px-6 py-2.5 rounded-full text-xs font-bold transition cursor-pointer"
              >
                Retourner à mon projet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
