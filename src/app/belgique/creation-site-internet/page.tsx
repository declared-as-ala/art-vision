import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Code2, Smartphone, Search, Zap, Check } from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqAccordion from "@/components/seo/FaqAccordion";

export const metadata: Metadata = {
  title: "Création de Site Internet en Belgique | Agence Web & SEO - Art Vision",
  description:
    "Création de sites web professionnels en Belgique (Bruxelles, Liège, Namur, Charleroi, Mons). Sites vitrines, boutiques e-commerce rapides, responsives et optimisés SEO. Devis gratuit sous 24h.",
  alternates: { canonical: "https://art-visions.fr/belgique/creation-site-internet" },
  openGraph: {
    title: "Création de Site Internet Professionnel en Belgique | Art Vision",
    description:
      "Votre site internet sur-mesure pour développer votre activité en Belgique. Design soigné, responsive mobile et visibilité Google.",
    url: "https://art-visions.fr/belgique/creation-site-internet",
    type: "website",
  },
};

export default function BelgiqueCreationSiteInternetPage() {
  return (
    <div className="min-h-screen hero-gradient pt-32 pb-24 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <Breadcrumbs
          items={[
            { name: "Belgique", url: "/belgique" },
            { name: "Création Site Internet" },
          ]}
        />

        <div className="space-y-6">
          <span className="bg-brand-purple/30 border border-brand-purple/40 text-brand-orange text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            🇧🇪 Webdesign & Développement • Google.be Ready
          </span>
          <h1 className="text-3xl sm:text-5xl font-montserrat font-extrabold tracking-tight text-white leading-tight">
            Création de Site Internet Professionnel en{" "}
            <span className="text-brand-magenta">Belgique</span>
          </h1>
          <p className="text-base text-white/75 leading-relaxed max-w-3xl">
            Développez votre clientèle en Belgique grâce à un site web ultra-rapide, moderne et pensé pour convertir. Du site vitrine artisanal à la boutique e-commerce complète, nous vous accompagnons à chaque étape.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/devis-sur-mesure?service=creation-site-internet&region=belgique"
              className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-brand-orange/20"
            >
              Parler de mon projet web
            </Link>
            <Link
              href="/portfolio"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition"
            >
              Voir nos réalisations
            </Link>
          </div>
        </div>

        {/* Web Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-brand-purple/15">
          <div className="bg-[#1A1238]/40 border border-brand-purple/20 p-6 rounded-2xl space-y-3">
            <Zap size={20} className="text-brand-orange" />
            <h3 className="font-montserrat font-bold text-sm text-white">Vitesse & Performance</h3>
            <p className="text-xs text-white/65 leading-relaxed">
              Sites construits sur des technologies modernes (Next.js / WordPress optimisé) pour des temps de chargement éclair sous la seconde.
            </p>
          </div>
          <div className="bg-[#1A1238]/40 border border-brand-purple/20 p-6 rounded-2xl space-y-3">
            <Smartphone size={20} className="text-brand-magenta" />
            <h3 className="font-montserrat font-bold text-sm text-white">100% Mobile Responsive</h3>
            <p className="text-xs text-white/65 leading-relaxed">
              Expérience fluide et intuitive sur smartphone, tablette et écran large pour capturer chaque visiteur.
            </p>
          </div>
          <div className="bg-[#1A1238]/40 border border-brand-purple/20 p-6 rounded-2xl space-y-3">
            <Search size={20} className="text-green-400" />
            <h3 className="font-montserrat font-bold text-sm text-white">Optimisé Google Belgique</h3>
            <p className="text-xs text-white/65 leading-relaxed">
              Balisage sémantique, métadonnées soignées et données structurées Schema.org pour un référencement naturel pérenne.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <FaqAccordion
          title="Questions Fréquentes — Site Internet Belgique"
          items={[
            {
              question: "Mon site sera-t-il multilingue (Français / Néerlandais / Anglais) ?",
              answer: "Oui, nous concevons des architectures multilingues complètes (FR / NL / EN) avec sélecteur de langue fluide pour adresser efficacement l'ensemble du marché belge.",
            },
            {
              question: "Puis-je modifier moi-même les textes et images du site ?",
              answer: "Absolument. Nous mettons à votre disposition une interface d'administration sécurisée et intuitive, et nous vous formons à son utilisation.",
            },
            {
              question: "Quel budget prévoir pour un site internet en Belgique ?",
              answer: "Nos formules pour site vitrine one-page débutent à partir de 120€, et nos packs multipages ou e-commerce sont personnalisés selon vos objectifs.",
            },
          ]}
        />
      </div>
    </div>
  );
}
