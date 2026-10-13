"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Link from "next/link";
import { Copy, Download, Check, Sparkles, Send, FileText, ArrowRight } from "lucide-react";

export default function WebBriefStudio() {
  const [copied, setCopied] = useState(false);

  // Questionnaire state
  const [projectName, setProjectName] = useState("L'Atelier d'Alexandre");
  const [activity, setActivity] = useState("Rénovation intérieure & menuiserie sur-mesure");
  const [siteType, setSiteType] = useState("Site Vitrine Professionnel (Artisan / PME)");
  const [objective, setObjective] = useState("Générer des demandes de devis qualifiées et valoriser nos réalisations");

  const [selectedPages, setSelectedPages] = useState<string[]>([
    "Page d'accueil impactante",
    "Présentation des services détaillés",
    "Galerie / Portfolio de réalisations",
    "Page À propos & Savoir-faire",
    "Formulaire de demande de devis sur-mesure",
    "Contact & Coordonnées",
  ]);

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "Formulaire de devis avec pièces jointes",
    "Optimisation pour le référencement local (SEO)",
    "Bouton WhatsApp direct",
    "Avis clients & témoignages vérifiés",
    "Interface 100% adaptée mobile et tablette",
  ]);

  const [languages, setLanguages] = useState("Français uniquement");
  const [existingContent, setExistingContent] = useState("Logo et photos existants, textes à affiner ensemble");
  const [references, setReferences] = useState("Sites modernes et sobres dans l'artisanat haut de gamme");
  const [budget, setBudget] = useState("1 500 € - 3 000 €");
  const [deadline, setDeadline] = useState("Sous 1 à 2 mois");

  const togglePage = (page: string) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  const toggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  // Generate full comprehensive brief text without any "à préciser"
  const generatedBrief = `=====================================================
CAHIER DES CHARGES / BRIEF CRÉATION DE SITE INTERNET
=====================================================
PROJET : ${projectName}
ACTIVITÉ : ${activity}
DATE D'ÉMISSION : ${new Date().toLocaleDateString("fr-FR")}

1. TYPE DE PROJET & OBJECTIF PRINCIPAL
-----------------------------------------------------
• Type de site souhaité : ${siteType}
• Objectif prioritaire : ${objective}

2. STRUCTURE & ARBORESCENCE ATTENDUE
-----------------------------------------------------
${selectedPages.map((p) => `• ${p}`).join("\n")}

3. FONCTIONNALITÉS & MODULES INDISPENSABLES
-----------------------------------------------------
${selectedFeatures.map((f) => `• ${f}`).join("\n")}

4. LANGUES & MARCHÉ CIBLE
-----------------------------------------------------
• Langue(s) du site : ${languages}

5. ÉTAT DES RESSOURCES & CONTENUS DISPONIBLES
-----------------------------------------------------
• Contenus existants : ${existingContent}
• Références & inspirations visuelles : ${references}

6. CADRE DU PROJET (BUDGET & DÉLAI)
-----------------------------------------------------
• Budget indicatif alloué : ${budget}
• Délai de livraison souhaité : ${deadline}

=====================================================
Document généré via Art Vision Studio
Besoin d'un accompagnement ? Devis en 24h sur https://art-visions.fr/devis-sur-mesure
=====================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedBrief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = () => {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(108, 43, 217);
    pdf.text("CAHIER DES CHARGES - SITE INTERNET", 20, 20);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);

    const splitText = pdf.splitTextToSize(generatedBrief, 170);
    pdf.text(splitText, 20, 30);
    pdf.save(`brief-site-web-${projectName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Questionnaire Form */}
      <div className="glassmorphism rounded-3xl p-6 sm:p-10 border border-brand-purple/20 shadow-2xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-montserrat">Questionnaire de Cadrage Web</h2>
          <p className="text-xs text-white/60 mt-1">
            Répondez aux étapes ci-dessous pour générer un cahier des charges clair, complet et exploitable immédiatement.
          </p>
        </div>

        {/* 1. Identity & Objective */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Nom du projet / Entreprise</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Activité & Spécialité</label>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>
        </div>

        {/* Type & Objective */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Type de site internet</label>
            <select
              value={siteType}
              onChange={(e) => setSiteType(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
            >
              <option value="Site Vitrine Professionnel (Artisan / PME)" className="bg-[#12091f]">Site Vitrine Professionnel (Artisan / PME)</option>
              <option value="Site Vitrine Corporate B2B & Génération de Leads" className="bg-[#12091f]">Site Vitrine Corporate B2B & Génération de Leads</option>
              <option value="Boutique E-commerce & Vente en ligne" className="bg-[#12091f]">Boutique E-commerce & Vente en ligne</option>
              <option value="Site One-Page / Landing page événementielle" className="bg-[#12091f]">Site One-Page / Landing page</option>
              <option value="Portfolio & Book Créatif" className="bg-[#12091f]">Portfolio & Book Créatif</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Objectif prioritaire</label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
            >
              <option value="Générer des demandes de devis qualifiées et valoriser nos réalisations" className="bg-[#12091f]">Générer des demandes de devis qualifiées</option>
              <option value="Vendre des produits directement en ligne" className="bg-[#12091f]">Vendre des produits directement en ligne</option>
              <option value="Crédibiliser l'entreprise et rassurer les clients potentiels" className="bg-[#12091f]">Crédibiliser l'entreprise et asseoir sa notoriété</option>
              <option value="Faciliter la prise de rendez-vous en ligne" className="bg-[#12091f]">Faciliter la prise de rendez-vous en ligne</option>
            </select>
          </div>
        </div>

        {/* Pages expected */}
        <div className="pt-2 border-t border-white/10">
          <label className="block text-xs font-semibold text-white/90 mb-2">Pages souhaitées sur le site</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              "Page d'accueil impactante",
              "Présentation des services détaillés",
              "Galerie / Portfolio de réalisations",
              "Page À propos & Savoir-faire",
              "Formulaire de demande de devis sur-mesure",
              "Contact & Coordonnées",
              "Espace Blog & Actualités",
              "Foire aux questions (FAQ)",
              "Tarifs & Forfaits indicatifs",
            ].map((p) => {
              const active = selectedPages.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePage(p)}
                  className={`p-2.5 text-left rounded-xl text-xs font-medium border transition flex items-center justify-between ${
                    active ? "bg-brand-purple/40 border-brand-purple text-white" : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                  }`}
                >
                  <span>{p}</span>
                  {active && <Check size={14} className="text-brand-magenta shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Features expected */}
        <div className="pt-2 border-t border-white/10">
          <label className="block text-xs font-semibold text-white/90 mb-2">Fonctionnalités & Modules essentiels</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              "Formulaire de devis avec pièces jointes",
              "Optimisation pour le référencement local (SEO)",
              "Bouton WhatsApp direct",
              "Avis clients & témoignages vérifiés",
              "Interface 100% adaptée mobile et tablette",
              "Module de prise de RDV en ligne (Calendly / custom)",
              "Module multilingue",
              "Paiement sécurisé par CB / Stripe",
            ].map((f) => {
              const active = selectedFeatures.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFeature(f)}
                  className={`p-2.5 text-left rounded-xl text-xs font-medium border transition flex items-center justify-between ${
                    active ? "bg-brand-magenta/30 border-brand-magenta text-white" : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                  }`}
                >
                  <span>{f}</span>
                  {active && <Check size={14} className="text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Languages, Content & References */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Langues du site</label>
            <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Contenus disponibles</label>
            <input
              type="text"
              value={existingContent}
              onChange={(e) => setExistingContent(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Inspirations / Références</label>
            <input
              type="text"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Budget & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Budget prévisionnel</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="Moins de 1 000 €" className="bg-[#12091f]">Moins de 1 000 €</option>
              <option value="1 000 € - 2 500 €" className="bg-[#12091f]">1 000 € - 2 500 €</option>
              <option value="2 500 € - 5 000 €" className="bg-[#12091f]">2 500 € - 5 000 €</option>
              <option value="Plus de 5 000 €" className="bg-[#12091f]">Plus de 5 000 €</option>
              <option value="À définir selon vos recommandations" className="bg-[#12091f]">À définir selon vos recommandations</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Délai souhaité</label>
            <select
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="Urgent (Moins de 3 semaines)" className="bg-[#12091f]">Urgent (Moins de 3 semaines)</option>
              <option value="Sous 1 à 2 mois" className="bg-[#12091f]">Sous 1 à 2 mois (Recommandé)</option>
              <option value="Sous 2 à 3 mois" className="bg-[#12091f]">Sous 2 à 3 mois</option>
              <option value="Pas de date limite précise" className="bg-[#12091f]">Pas de date limite précise</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated Brief Box & Actions */}
      <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-emerald-400" />
            <h3 className="font-bold text-white text-base font-montserrat">Cahier des charges généré en direct</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Copié !" : "Copier le texte"}</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-full bg-brand-purple hover:bg-brand-purple/80 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Télécharger PDF</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-white/80 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
          {generatedBrief}
        </pre>

        {/* Bridge to Quote Form */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-purple/30 to-brand-magenta/20 border border-brand-magenta/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/80">
            <strong className="text-white block">Envoyer ce brief à notre équipe pour chiffrage direct</strong>
            Nous pouvons concevoir votre site web sur-mesure à partir de ces éléments.
          </div>
          <Link
            href={`/devis-sur-mesure?service=Création de site internet&package=${encodeURIComponent(siteType)}`}
            className="shrink-0 bg-[#D95200] hover:bg-[#B84200] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <span>Demander un devis avec ce brief</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
