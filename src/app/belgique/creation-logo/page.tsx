import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PenTool, Check, ShieldCheck, Sparkles, FileText, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqAccordion from "@/components/seo/FaqAccordion";

export const metadata: Metadata = {
  title: "Création de Logo Professionnel en Belgique | Art Vision",
  description:
    "Création de logos sur-mesure pour entreprises, indépendants et starters en Belgique (Bruxelles, Liège, Namur, Charleroi, Mons). Fichiers vectoriels complets, cession des droits et devis gratuit.",
  alternates: { canonical: "https://art-visions.fr/belgique/creation-logo" },
  openGraph: {
    title: "Création de Logo Professionnel en Belgique | Art Vision",
    description:
      "Votre logotype vectoriel unique créé par nos designers pour le marché belge. Facturation intracommunautaire HT disponible.",
    url: "https://art-visions.fr/belgique/creation-logo",
    type: "website",
  },
};

const LOGO_FAQS = [
  {
    question: "Quels fichiers sont livrés pour mon logo en Belgique ?",
    answer:
      "Vous recevez un pack vectoriel exhaustif : formats AI (Adobe Illustrator), SVG, PDF haute définition pour l'impression, ainsi que PNG transparents et JPG pour vos réseaux sociaux et site web.",
  },
  {
    question: "Les droits de propriété intellectuelle sont-ils cédés ?",
    answer:
      "Oui. Dès le règlement final de la prestation, vous devenez l'unique propriétaire de votre logo avec une cession formelle des droits d'exploitation commerciale.",
  },
  {
    question: "Comment se déroulent les allers-retours de retouches ?",
    answer:
      "Nous présentons plusieurs pistes graphiques distinctes. Vous choisissez votre direction préférée et nous procédons aux ajustements nécessaires (couleurs, typographie, espacements) jusqu'à validation complète.",
  },
];

export default function BelgiqueCreationLogoPage() {
  return (
    <div className="min-h-screen hero-gradient pt-32 pb-24 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <Breadcrumbs
          items={[
            { name: "Belgique", url: "/belgique" },
            { name: "Création de Logo" },
          ]}
        />

        <div className="space-y-6">
          <span className="bg-brand-purple/30 border border-brand-purple/40 text-brand-orange text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            🇧🇪 Marché Belge • Logotypes & Branding
          </span>
          <h1 className="text-3xl sm:text-5xl font-montserrat font-extrabold tracking-tight text-white leading-tight">
            Création de Logo Professionnel & Vectoriel en{" "}
            <span className="text-brand-magenta">Belgique</span>
          </h1>
          <p className="text-base text-white/75 leading-relaxed max-w-3xl">
            Donnez à votre entreprise en Belgique une image solide et distinctive. Nous concevons des logos sur-mesure adaptés à votre secteur d'activité, que vous soyez établi à Bruxelles, en Wallonie ou en Flandre.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/devis-sur-mesure?service=creation-logo&region=belgique"
              className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-brand-orange/20"
            >
              Demander une proposition
            </Link>
            <Link
              href="/outils-gratuits/generateur-brief-logo"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition"
            >
              Remplir un brief en ligne
            </Link>
          </div>
        </div>

        {/* Value props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-brand-purple/15">
          <div className="bg-[#1A1238]/40 border border-brand-purple/20 p-6 rounded-2xl space-y-3">
            <Sparkles size={20} className="text-brand-magenta" />
            <h3 className="font-montserrat font-bold text-sm text-white">100% Vectoriel & Unique</h3>
            <p className="text-xs text-white/65 leading-relaxed">
              Aucun clip-art ou modèle préfabriqué. Votre logo est dessiné sur-mesure et s'agrandit sans aucune perte de netteté.
            </p>
          </div>
          <div className="bg-[#1A1238]/40 border border-brand-purple/20 p-6 rounded-2xl space-y-3">
            <FileText size={20} className="text-brand-orange" />
            <h3 className="font-montserrat font-bold text-sm text-white">Facturation B2B Conforme</h3>
            <p className="text-xs text-white/65 leading-relaxed">
              Pour les entreprises belges avec numéro de TVA valide, facturation intracommunautaire hors taxes.
            </p>
          </div>
          <div className="bg-[#1A1238]/40 border border-brand-purple/20 p-6 rounded-2xl space-y-3">
            <ShieldCheck size={20} className="text-green-400" />
            <h3 className="font-montserrat font-bold text-sm text-white">Cession des Droits</h3>
            <p className="text-xs text-white/65 leading-relaxed">
              Pleine propriété intellectuelle transférée dès livraison finale pour une exploitation libre et protégée.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion
          title="Questions Fréquentes — Logo Belgique"
          items={LOGO_FAQS}
        />

        {/* Linking */}
        <div className="pt-8 border-t border-brand-purple/15 text-left space-y-3">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-magenta">Services Associés</h4>
          <div className="flex flex-wrap gap-2">
            <Link href="/identite-visuelle" className="text-xs bg-[#1A1238]/60 border border-brand-purple/20 px-3.5 py-1.5 rounded-full hover:border-brand-magenta hover:text-white transition text-white/80">Identité visuelle complète</Link>
            <Link href="/charte-graphique" className="text-xs bg-[#1A1238]/60 border border-brand-purple/20 px-3.5 py-1.5 rounded-full hover:border-brand-magenta hover:text-white transition text-white/80">Charte graphique</Link>
            <Link href="/belgique/carte-de-visite" className="text-xs bg-[#1A1238]/60 border border-brand-purple/20 px-3.5 py-1.5 rounded-full hover:border-brand-magenta hover:text-white transition text-white/80">Cartes de visite Belgique</Link>
            <Link href="/belgique/creation-site-internet" className="text-xs bg-[#1A1238]/60 border border-brand-purple/20 px-3.5 py-1.5 rounded-full hover:border-brand-magenta hover:text-white transition text-white/80">Création site web Belgique</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
