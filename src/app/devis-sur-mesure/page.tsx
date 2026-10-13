"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Upload,
  Check,
  AlertCircle,
  FileText,
  X,
  Phone,
  Mail,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

const PRESTATIONS = [
  "Identité visuelle & Logo",
  "Graphisme & Support de communication",
  "Impression publicitaire",
  "Montage vidéo (Rushes fournis ou tournage)",
  "Motion design & Animation",
  "Modélisation & Rendu 3D",
  "Création de site internet",
  "Autre prestation sur mesure",
];

const BUDGET_OPTIONS = [
  "À définir",
  "Moins de 500 €",
  "500 € - 1 500 €",
  "1 500 € - 3 000 €",
  "3 000 € - 5 000 €",
  "Plus de 5 000 €",
];

function SinglePageQuoteForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read query params
  const prefill = searchParams.get("prefill") || "";
  const paramService = searchParams.get("service") || "";
  const paramPackage = searchParams.get("package") || searchParams.get("forfait") || searchParams.get("offre") || "";
  const paramProduct = searchParams.get("product") || "";
  const paramQty = searchParams.get("qty") || "";
  const paramFormat = searchParams.get("format") || "";
  const paramPaper = searchParams.get("paper") || searchParams.get("support") || "";
  const paramFinish = searchParams.get("finish") || searchParams.get("finition") || "";
  const paramTotal = searchParams.get("total") || "";

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(PRESTATIONS[0]);
  const [details, setDetails] = useState("");
  const [budget, setBudget] = useState("À définir");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // Honeypot anti-spam

  // File
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState("");
  const [fileSizeError, setFileSizeError] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientErrors, setClientErrors] = useState<{ [k: string]: string }>({});

  // Has print configuration
  const hasPrintConfig = useMemo(() => {
    return Boolean(paramProduct || paramQty || paramFormat || (prefill && prefill.toLowerCase().includes("print")));
  }, [paramProduct, paramQty, paramFormat, prefill]);

  // Initial detection & pre-filling
  useEffect(() => {
    const rawTarget = (paramService || prefill || "").toLowerCase();

    // Map query to prestation
    if (rawTarget.includes("motion") || rawTarget.includes("vitarena")) {
      setService("Motion design & Animation");
    } else if (rawTarget.includes("video") || rawTarget.includes("vidéo") || rawTarget.includes("montage")) {
      setService("Montage vidéo (Rushes fournis ou tournage)");
    } else if (rawTarget.includes("print") || rawTarget.includes("impression") || rawTarget.includes("flyer") || rawTarget.includes("carte") || paramProduct) {
      setService("Impression publicitaire");
    } else if (rawTarget.includes("logo") || rawTarget.includes("branding") || rawTarget.includes("identit")) {
      setService("Identité visuelle & Logo");
    } else if (rawTarget.includes("web") || rawTarget.includes("site")) {
      setService("Création de site internet");
    } else if (rawTarget.includes("3d")) {
      setService("Modélisation & Rendu 3D");
    }

    // Build default description if parameters exist
    if (paramProduct || paramQty || paramFormat || paramTotal) {
      const parts: string[] = [];
      if (paramProduct) parts.push(`Produit : ${paramProduct}`);
      if (paramFormat) parts.push(`Format : ${paramFormat}`);
      if (paramQty) parts.push(`Quantité : ${paramQty} ex.`);
      if (paramPaper) parts.push(`Support/Papier : ${paramPaper}`);
      if (paramFinish) parts.push(`Finitions : ${paramFinish}`);
      if (paramTotal) parts.push(`Estimation indicative : ${paramTotal} € TTC`);

      const printSummary = parts.join("\n");
      setDetails((prev) => {
        if (!prev) return `Configuration d'impression souhaitée :\n${printSummary}\n\nPrécisions sur vos fichiers ou votre projet : `;
        return prev;
      });
    } else if (paramPackage) {
      setDetails((prev) => {
        if (!prev) return `Demande concernant l'offre / formule : ${paramPackage}.\n\nPrécisions sur votre projet : `;
        return prev;
      });
    }
  }, [prefill, paramService, paramPackage, paramProduct, paramQty, paramFormat, paramPaper, paramFinish, paramTotal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileSizeError("");
    if (!file) return;

    if (file.size > 7 * 1024 * 1024) {
      setFileSizeError("Le fichier dépasse 7 Mo. Vous pourrez nous le transmettre par WeTransfer ou e-mail après validation.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFileData(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setFileName("");
    setFileData("");
    setFileSizeError("");
  };

  const validateForm = () => {
    const errs: { [k: string]: string } = {};

    if (!name.trim()) {
      errs.name = "Veuillez renseigner votre nom ou le nom de votre entreprise.";
    }

    if (!email.trim()) {
      errs.email = "Veuillez renseigner votre adresse e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Format d'e-mail invalide (ex: contact@exemple.fr).";
    }

    if (!details.trim()) {
      errs.details = "Merci de décrire brièvement votre besoin ou votre projet.";
    }

    if (!consent) {
      errs.consent = "Veuillez accepter la politique de confidentialité pour transmettre votre demande.";
    }

    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          service,
          details: details.trim(),
          budget,
          fileData: fileData || undefined,
          fileName: fileName || undefined,
          consent: true,
          website: website || undefined,
          sourceUrl: window.location.href,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMessage(
          data.error ||
            "Une erreur est survenue lors de l'enregistrement de votre demande. Veuillez vérifier vos informations ou nous contacter directement."
        );
      }
    } catch (err) {
      console.error("Quote submit error:", err);
      setErrorMessage(
        "Impossible de contacter le serveur. Veuillez vérifier votre connexion ou nous contacter directement au +32 490 22 49 05."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="glassmorphism rounded-3xl p-8 md:p-14 border border-emerald-500/30 text-center max-w-2xl mx-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-lg shadow-emerald-500/10">
          <Check size={42} className="stroke-[2.5]" />
        </div>
        <h2 className="font-montserrat font-extrabold text-2xl md:text-3xl text-white">
          Demande de devis transmise avec succès !
        </h2>
        <p className="mt-4 text-white/80 leading-relaxed text-sm md:text-base">
          Merci <strong className="text-white">{name}</strong>. Votre demande pour la prestation{" "}
          <strong className="text-brand-magenta">{service}</strong> a bien été enregistrée par notre équipe.
        </p>
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs md:text-sm text-white/70 space-y-1">
          <p className="flex items-center justify-center gap-2">
            <Clock size={16} className="text-brand-orange" />
            <span>Réponse personnalisée sous <strong>24h ouvrées</strong> (du lundi au samedi, 8h-18h).</span>
          </p>
          <p className="text-white/60">
            Un récapitulatif complet a été envoyé à <strong>{email}</strong>.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-[#D95200] hover:bg-[#B84200] text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition shadow-lg shadow-[#D95200]/25 text-center"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/portfolio"
            className="w-full sm:w-auto border border-white/20 hover:border-brand-magenta hover:bg-brand-magenta/10 text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition text-center"
          >
            Voir nos réalisations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Print Configuration Alert banner if configured */}
      {hasPrintConfig && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-brand-purple/30 to-brand-magenta/20 border border-brand-magenta/40 flex items-start gap-3">
          <Printer size={22} className="text-brand-magenta shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm">
            <p className="font-bold text-white">Configuration d'impression pré-remplie</p>
            <p className="text-white/80 mt-0.5">
              {paramProduct && <span className="mr-2">Produit : <strong className="text-white">{paramProduct}</strong></span>}
              {paramFormat && <span className="mr-2">• Format : <strong className="text-white">{paramFormat}</strong></span>}
              {paramQty && <span className="mr-2">• Quantité : <strong className="text-white">{paramQty} ex.</strong></span>}
              {paramTotal && <span>• Estimation : <strong className="text-brand-orange">{paramTotal} € TTC</strong></span>}
            </p>
          </div>
        </div>
      )}

      {/* Package Alert banner if selected */}
      {!hasPrintConfig && paramPackage && (
        <div className="mb-6 p-4 rounded-2xl bg-brand-purple/30 border border-brand-purple/40 flex items-start gap-3">
          <Sparkles size={20} className="text-brand-orange shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm">
            <p className="font-bold text-white">Offre sélectionnée : <span className="text-brand-magenta">{paramPackage}</span></p>
            <p className="text-white/70 mt-0.5">Vos préférences ont été automatiquement incluses dans votre demande ci-dessous.</p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="glassmorphism rounded-3xl p-6 sm:p-10 border border-brand-purple/25 shadow-2xl space-y-6 text-left"
        noValidate
      >
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-sm flex items-start gap-3 animate-in fade-in">
            <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="font-bold text-white">Une erreur est survenue</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 1. Prestation recherchée */}
        <div>
          <label htmlFor="service-select" className="block text-xs uppercase tracking-wider font-bold text-white/90 mb-2">
            Prestation recherchée <span className="text-brand-orange">*</span>
          </label>
          <select
            id="service-select"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta transition cursor-pointer"
          >
            {PRESTATIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0f041d] text-white">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Nom & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="user-name" className="block text-xs uppercase tracking-wider font-bold text-white/90 mb-2">
              Nom complet / Entreprise <span className="text-brand-orange">*</span>
            </label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (clientErrors.name) setClientErrors((p) => ({ ...p, name: "" }));
              }}
              placeholder="Ex. Alexandre Dupont"
              className={`w-full bg-white/5 border ${
                clientErrors.name ? "border-red-400/80 ring-1 ring-red-400/60" : "border-white/15"
              } rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta transition`}
            />
            {clientErrors.name && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle size={13} /> {clientErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="user-email" className="block text-xs uppercase tracking-wider font-bold text-white/90 mb-2">
              Adresse e-mail <span className="text-brand-orange">*</span>
            </label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (clientErrors.email) setClientErrors((p) => ({ ...p, email: "" }));
              }}
              placeholder="contact@exemple.fr"
              className={`w-full bg-white/5 border ${
                clientErrors.email ? "border-red-400/80 ring-1 ring-red-400/60" : "border-white/15"
              } rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta transition`}
            />
            {clientErrors.email && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle size={13} /> {clientErrors.email}
              </p>
            )}
          </div>
        </div>

        {/* 3. Téléphone (facultatif) & Budget (facultatif) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label htmlFor="user-phone" className="text-xs uppercase tracking-wider font-bold text-white/90">
                Téléphone
              </label>
              <span className="text-[11px] text-white/50 italic">Facultatif</span>
            </div>
            <input
              id="user-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex. +33 6 12 34 56 78"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label htmlFor="budget-select" className="text-xs uppercase tracking-wider font-bold text-white/90">
                Budget estimatif
              </label>
              <span className="text-[11px] text-white/50 italic">Facultatif</span>
            </div>
            <select
              id="budget-select"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta transition cursor-pointer"
            >
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#0f041d] text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Description du besoin */}
        <div>
          <label htmlFor="project-details" className="block text-xs uppercase tracking-wider font-bold text-white/90 mb-2">
            Description de votre projet ou besoin <span className="text-brand-orange">*</span>
          </label>
          <textarea
            id="project-details"
            rows={5}
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
              if (clientErrors.details) setClientErrors((p) => ({ ...p, details: "" }));
            }}
            placeholder="Décrivez vos attentes, vos formats souhaités, votre public cible, vos inspirations ou les détails de votre commande..."
            className={`w-full bg-white/5 border ${
              clientErrors.details ? "border-red-400/80 ring-1 ring-red-400/60" : "border-white/15"
            } rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-magenta focus:ring-1 focus:ring-brand-magenta transition resize-y`}
          ></textarea>
          {clientErrors.details && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle size={13} /> {clientErrors.details}
            </p>
          )}
        </div>

        {/* 5. Pièce jointe facultative */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs uppercase tracking-wider font-bold text-white/90">
              Pièce jointe (logo, brief, exemple, maquette)
            </span>
            <span className="text-[11px] text-white/50 italic">Facultatif • Max 7 Mo</span>
          </div>

          {!fileName ? (
            <label className="border-2 border-dashed border-white/20 hover:border-brand-magenta/60 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition group">
              <Upload size={18} className="text-white/60 group-hover:text-brand-magenta transition" />
              <span className="text-xs text-white/70 group-hover:text-white transition">
                Cliquez pour joindre un fichier (PDF, PNG, JPG, AI, ZIP)
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.zip,.ai,.psd,.svg"
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-brand-purple/20 border border-brand-purple/40">
              <div className="flex items-center gap-2 overflow-hidden text-xs text-white">
                <FileText size={18} className="text-brand-orange shrink-0" />
                <span className="truncate font-medium">{fileName}</span>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-white/60 hover:text-red-400 transition p-1 cursor-pointer"
                title="Supprimer la pièce jointe"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {fileSizeError && (
            <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
              <AlertCircle size={13} /> {fileSizeError}
            </p>
          )}
        </div>

        {/* Honeypot field (anti-spam) */}
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* RGPD Consent */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (clientErrors.consent) setClientErrors((p) => ({ ...p, consent: "" }));
              }}
              className="mt-1 h-4 w-4 rounded border-white/20 text-brand-orange focus:ring-brand-orange/40 bg-white/10"
            />
            <span className="text-xs text-white/70 leading-relaxed">
              J'accepte que les informations saisies soient traitées par Art Vision dans le cadre exclusif de ma
              demande de devis, conformément à la politique de confidentialité.
            </span>
          </label>
          {clientErrors.consent && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle size={13} /> {clientErrors.consent}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#D95200] hover:bg-[#B84200] disabled:bg-white/20 disabled:cursor-not-allowed text-white py-4 px-8 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#D95200]/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Transmission en cours...</span>
              </>
            ) : (
              <>
                <span>Envoyer ma demande de devis</span>
                <Send size={16} />
              </>
            )}
          </button>
        </div>

        {/* Reassurance footer */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/60">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            Devis gratuit & sans engagement
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-brand-purple" />
            Réponse sous 24h ouvrées
          </span>
          <span className="flex items-center gap-1.5">
            <Phone size={14} className="text-brand-magenta" />
            Assistance directe : +32 490 22 49 05
          </span>
        </div>
      </form>
    </div>
  );
}

export default function DevisSurMesurePage() {
  return (
    <div className="min-h-screen hero-gradient pt-32 pb-20 px-4">
      {/* Background glow */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-brand-white uppercase">
          <Sparkles size={14} className="text-brand-orange" />
          <span>Formulaire simplifié</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-extrabold text-white tracking-tight">
          Demande de <span className="text-brand-magenta">Devis Sur-Mesure</span>
        </h1>
        <p className="text-white/70 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
          Complétez ce formulaire en 1 minute. Notre équipe étudie vos besoins et vous transmet une estimation précise sous 24h ouvrées.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="max-w-3xl mx-auto glassmorphism rounded-3xl p-12 text-center text-white/60">
            Chargement du formulaire...
          </div>
        }
      >
        <SinglePageQuoteForm />
      </Suspense>
    </div>
  );
}
