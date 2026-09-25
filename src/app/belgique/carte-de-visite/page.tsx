import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Check, Sparkles, Truck, QrCode } from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqAccordion from "@/components/seo/FaqAccordion";

export const metadata: Metadata = {
  title: "Impression Carte de Visite en Belgique | Tarifs & Livraison Rapide - Art Vision",
  description:
    "Imprimez vos cartes de visite professionnelles en Belgique : papier 350g/400g, format 85×55 mm, vernis 3D et pelliculage Soft Touch. Livraison suivie à Bruxelles, Liège, Namur, Charleroi et partout en Belgique.",
  alternates: { canonical: "https://art-visions.fr/belgique/carte-de-visite" },
  openGraph: {
    title: "Impression Carte de Visite Professionnelle en Belgique | Art Vision",
    description:
      "Cartes de visite de qualité supérieure livrées en Belgique. Papiers rigides, finitions luxueuses et vérification PAO gratuite.",
    url: "https://art-visions.fr/belgique/carte-de-visite",
    type: "website",
  },
};

export default function BelgiqueCarteDeVisitePage() {
  return (
    <div className="min-h-screen hero-gradient pt-32 pb-24 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <Breadcrumbs
          items={[
            { name: "Belgique", url: "/belgique" },
            { name: "Cartes de Visite" },
          ]}
        />

        <div className="space-y-6">
          <span className="bg-brand-purple/30 border border-brand-purple/40 text-brand-orange text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            🇧🇪 Papier Rigide 350g / 400g • Format 85×55 mm
          </span>
          <h1 className="text-3xl sm:text-5xl font-montserrat font-extrabold tracking-tight text-white leading-tight">
            Impression de Carte de Visite Professionnelle en{" "}
            <span className="text-brand-magenta">Belgique</span>
          </h1>
          <p className="text-base text-white/75 leading-relaxed max-w-3xl">
            Remettez une carte à la hauteur de votre réputation professionnelle. Impression offset et numérique de prestige sur papier couché rigide avec pelliculage mat, brillant ou Soft Touch (toucher velours) et vernis sélectif en surbrillance.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/devis-sur-mesure?prefill=impression&product=Cartes%20de%20visite&region=belgique"
              className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-brand-orange/20"
            >
              Demander mon devis cartes
            </Link>
            <Link
              href="/outils-gratuits/carte-de-visite-gratuite"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-brand-magenta" />
              Créateur gratuit en ligne
            </Link>
          </div>
        </div>

        {/* Paper tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-brand-purple/15">
          <div className="glassmorphism p-6 rounded-2xl border border-brand-purple/20 space-y-3">
            <span className="text-xs uppercase font-extrabold text-brand-orange tracking-wider">Standard Pro</span>
            <h3 className="font-montserrat font-bold text-lg text-white">350g Couché Mat</h3>
            <p className="text-xs text-white/65 leading-relaxed">
              Excellente rigidité, écriture manuscrite possible, idéal pour les cartes de fidélité ou cartes de rendez-vous.
            </p>
          </div>
          <div className="glassmorphism p-6 rounded-2xl border border-brand-magenta/30 space-y-3 relative">
            <span className="text-xs uppercase font-extrabold text-brand-magenta tracking-wider">Le Choix Populaire</span>
            <h3 className="font-montserrat font-bold text-lg text-white">350g Soft Touch</h3>
            <p className="text-xs text-white/65 leading-relaxed">
              Toucher peau de pêche ultra-doux et rendu feutré incomparable. Protège les aplats de couleurs sombres des rayures.
            </p>
          </div>
          <div className="glassmorphism p-6 rounded-2xl border border-brand-purple/20 space-y-3">
            <span className="text-xs uppercase font-extrabold text-purple-400 tracking-wider">Luxe Ultime</span>
            <h3 className="font-montserrat font-bold text-lg text-white">400g Vernis 3D</h3>
            <p className="text-xs text-white/65 leading-relaxed">
              Finition avec vernis transparent en relief sur votre logo et vos textes pour un impact tactile inoubliable.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion
          title="Questions Fréquentes — Cartes de Visite Belgique"
          items={[
            {
              question: "Quel format pour mes cartes en Belgique ?",
              answer: "Le format standard européen est 85 × 55 mm. Nous acceptons aussi les formats carrés (55 × 55 mm) et les coins arrondis sur devis.",
            },
            {
              question: "Combien de temps faut-il pour recevoir mes cartes ?",
              answer: "Comptez 3 à 5 jours ouvrables pour l'impression et la livraison directe à votre adresse en Belgique.",
            },
            {
              question: "Puis-je intégrer un QR Code vCard ?",
              answer: "Oui, nous pouvons générer et intégrer un QR code dynamique ou statique permettant à vos contacts d'enregistrer votre numéro d'un simple scan.",
            },
          ]}
        />
      </div>
    </div>
  );
}
