import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Printer, Truck, Check, ShieldCheck, ChevronRight, MessageCircle } from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqAccordion from "@/components/seo/FaqAccordion";

export const metadata: Metadata = {
  title: "Imprimerie en Ligne & Impression Professionnelle en Belgique | Art Vision",
  description:
    "Impression professionnelle livrée en Belgique : cartes de visite, flyers, affiches, brochures, bâches et roll-up. Contrôle PAO gratuit, livraison rapide 3-5j à Bruxelles, Liège, Namur, Mons, Charleroi.",
  alternates: { canonical: "https://art-visions.fr/belgique/impression" },
  openGraph: {
    title: "Impression Professionnelle & Imprimerie en Belgique | Art Vision",
    description:
      "Tous vos imprimés publicitaires et institutionnels livrés en Belgique. Prix dégressifs et vérification gratuite de vos fichiers.",
    url: "https://art-visions.fr/belgique/impression",
    type: "website",
  },
};

const PRINT_PRODUCTS = [
  { name: "Cartes de visite", href: "/belgique/carte-de-visite", desc: "Format 85×55 mm, 350g/400g, Soft Touch et vernis 3D." },
  { name: "Flyers & Dépliants", href: "/impression/flyer", desc: "A6, A5, A4, couchés mat ou brillant pour street-marketing et salons." },
  { name: "Affiches Publicitaires", href: "/impression/affiche", desc: "Grands formats A3 à A0 haute définition pour vitrines et événements." },
  { name: "Brochures & Catalogues", href: "/impression/brochure", desc: "Plaquettes piquées ou dos carré collé avec finitions élégantes." },
  { name: "Bâches & Banderoles", href: "/impression/bache", desc: "Bâches extérieures avec œillets renforcés résistant aux intempéries." },
  { name: "Roll-up & Kakemonos", href: "/impression/roll-up", desc: "Totems enrouleurs avec structure alu et housse de transport." },
];

export default function BelgiqueImpressionPage() {
  return (
    <div className="min-h-screen hero-gradient pt-32 pb-24 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <Breadcrumbs
          items={[
            { name: "Belgique", url: "/belgique" },
            { name: "Impression Professionnelle" },
          ]}
        />

        <div className="space-y-6">
          <span className="bg-brand-purple/30 border border-brand-purple/40 text-brand-orange text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            🇧🇪 Livraison Belgique • Délais 3 à 5 jours
          </span>
          <h1 className="text-3xl sm:text-5xl font-montserrat font-extrabold tracking-tight text-white leading-tight">
            Imprimerie en Ligne & Impression Professionnelle en{" "}
            <span className="text-brand-magenta">Belgique</span>
          </h1>
          <p className="text-base text-white/75 leading-relaxed max-w-3xl">
            Commandez vos imprimés publicitaires en toute simplicité. Nos ateliers équipés de presses numériques et offset de pointe assurent un rendu couleur fidèle et une livraison directe dans toute la Belgique.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/devis-sur-mesure?prefill=impression&region=belgique"
              className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-brand-orange/20"
            >
              Demander un devis impression
            </Link>
            <Link
              href="/impression"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition"
            >
              Consulter le catalogue complet
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-brand-purple/15">
          {PRINT_PRODUCTS.map((prod, idx) => (
            <Link
              key={idx}
              href={prod.href}
              className="group bg-[#1A1238]/40 border border-brand-purple/20 p-5 rounded-2xl hover:border-brand-magenta/40 transition block space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-montserrat font-bold text-sm text-white group-hover:text-brand-magenta transition">
                  {prod.name}
                </h3>
                <ChevronRight size={14} className="text-white/40 group-hover:text-brand-magenta group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{prod.desc}</p>
            </Link>
          ))}
        </div>

        {/* Delivery & B2B Notice */}
        <div className="bg-[#1A1238]/60 border border-brand-purple/20 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider">
            <Truck size={18} />
            <span>Expédition Rapide & Facturation Sécurisée</span>
          </div>
          <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
            Nous expédions quotidiennement vers Bruxelles, Liège, Namur, Charleroi, Mons, Tournai, Anvers et Gand. Chaque colis est préparé sous double emballage avec coins renforcés. Les assujettis à la TVA en Belgique bénéficient de la facturation intracommunautaire HT en renseignant leur numéro d'entreprise.
          </p>
        </div>

        {/* FAQs */}
        <FaqAccordion
          title="Questions Fréquentes — Impression en Belgique"
          items={[
            {
              question: "Effectuez-vous un contrôle de mon fichier avant tirage ?",
              answer: "Oui, systématiquement. Nous vérifions les fonds perdus (2 mm), la résolution (300 DPI), le mode colorimétrique (CMJN) et la vectorisation des polices.",
            },
            {
              question: "Quels sont les frais de livraison pour la Belgique ?",
              answer: "Les frais d'expédition sont calculés au plus juste selon le poids total de votre commande et sont clairement indiqués sur votre devis en euros sans frais cachés.",
            },
          ]}
        />
      </div>
    </div>
  );
}
