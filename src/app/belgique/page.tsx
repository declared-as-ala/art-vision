import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  PenTool,
  Printer,
  CreditCard,
  Globe,
  Truck,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqAccordion from "@/components/seo/FaqAccordion";

export const metadata: Metadata = {
  title: "Agence Créative & Imprimerie pour la Belgique | Art Vision",
  description:
    "Art Vision accompagne les indépendants et entreprises en Belgique : création de logo, identité visuelle, impression professionnelle et création de site internet. Livraison express Bruxelles, Wallonie et Flandres.",
  alternates: {
    canonical: "https://art-visions.fr/belgique",
  },
  openGraph: {
    title: "Agence Créative & Imprimerie pour la Belgique | Art Vision",
    description:
      "Logos sur-mesure, cartes de visite, imprimés publicitaires et sites internet professionnels pour le marché belge. Facturation intracommunautaire sans TVA pour professionnels assujettis.",
    url: "https://art-visions.fr/belgique",
    type: "website",
    images: [{ url: "https://art-visions.fr/logo.png" }],
  },
};

const BELGIUM_SERVICES = [
  {
    title: "Création de Logo Professionnel",
    slug: "/belgique/creation-logo",
    icon: PenTool,
    description:
      "Logos vectoriels uniques créés sur-mesure pour indépendants, starters et PME belges. Fichiers complets (AI, SVG, PDF, PNG) et cession intégrale des droits.",
    badge: "Branding & Marque",
  },
  {
    title: "Impression Professionnelle & En Ligne",
    slug: "/belgique/impression",
    icon: Printer,
    description:
      "Flyers, affiches, dépliants, bâches et roll-up expédiés directement en Belgique. Contrôle PAO gratuit de vos fichiers et emballage renforcé.",
    badge: "Livraison Belgique",
  },
  {
    title: "Impression Cartes de Visite",
    slug: "/belgique/carte-de-visite",
    icon: CreditCard,
    description:
      "Cartes de visite 85×55 mm sur papier 350g ou 400g couché, vernis 3D sélectif et pelliculage Soft Touch. Livraison suivie partout en Belgique.",
    badge: "Finition Premium",
  },
  {
    title: "Création de Site Internet & Webdesign",
    slug: "/belgique/creation-site-internet",
    icon: Globe,
    description:
      "Sites vitrines et boutiques e-commerce rapides, responsives et optimisés pour le référencement naturel sur Google.be.",
    badge: "Web & E-Commerce",
  },
];

const BELGIUM_FAQS = [
  {
    question: "Comment se déroule la collaboration à distance avec des clients en Belgique ?",
    answer:
      "Nous travaillons de façon 100% digitalisée et réactive : brief initial en visioconférence ou par téléphone, échanges continus par WhatsApp ou email, présentation des planches créatives interactives et validation par Bon à Tirer (BAT) électronique.",
  },
  {
    question: "Quelles sont les règles de facturation et de TVA pour les entreprises belges ?",
    answer:
      "Pour toute entreprise ou indépendant belge disposant d'un numéro de TVA intracommunautaire valide (ex: BE 0XXX.XXX.XXX), la facturation est émise hors taxe (autoliquidation de la TVA au titre des livraisons/prestations intracommunautaires conformément aux directives européennes). Pour les particuliers, la TVA standard s'applique.",
  },
  {
    question: "Quels sont les délais et modalités de livraison pour les impressions en Belgique ?",
    answer:
      "Tous nos produits d'impression (cartes de visite, flyers, brochures, bâches) sont acheminés vers Bruxelles, Liège, Namur, Charleroi, Mons, Tournai, Anvers et toute la Belgique sous 3 à 5 jours ouvrés via nos partenaires transporteurs express (DPD, UPS, Colissimo International) avec lien de suivi colis.",
  },
  {
    question: "Les prix sont-ils en euros ?",
    answer:
      "Oui, tous nos tarifs et devis sont systématiquement libellés en Euros (€) sans aucun frais de change ni mauvaise surprise.",
  },
];

export default function BelgiqueHubPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://art-visions.fr" },
          { "@type": "ListItem", position: 2, name: "Belgique", item: "https://art-visions.fr/belgique" },
        ],
      },
      {
        "@type": "Service",
        name: "Services Graphiques & Impression pour la Belgique",
        provider: {
          "@type": "Organization",
          name: "Art Vision",
          url: "https://art-visions.fr",
          logo: "https://art-visions.fr/logo.png",
          address: {
            "@type": "PostalAddress",
            streetAddress: "5 Rue de Constantine",
            addressLocality: "Le Mans",
            postalCode: "72000",
            addressCountry: "FR",
          },
        },
        description:
          "Studio graphique et imprimerie en ligne pour les entreprises belges. Création de logos, identités visuelles, impressions publicitaires et sites internet.",
        areaServed: {
          "@type": "Country",
          name: "Belgium",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen hero-gradient pt-32 pb-24 text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={[{ name: "Services Belgique" }]} />

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-flex items-center gap-2 bg-brand-purple/30 border border-brand-purple/40 text-brand-orange text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <span>🇧🇪</span>
              <span>Marché Belge • Bruxelles & Régions</span>
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-montserrat font-extrabold tracking-tight text-white leading-[1.1]">
              Votre Partenaire Créatif & Imprimerie pour la{" "}
              <span className="text-brand-magenta">Belgique</span>
            </h1>
            <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl">
              Art Vision met son savoir-faire créatif au service des entrepreneurs, indépendants et sociétés établis en Belgique. Conception de logotypes uniques, supports imprimés haute définition livrés à votre adresse, et sites web taillés pour convertir.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/devis-sur-mesure?region=belgique"
                className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-brand-orange/20"
              >
                Demander un devis (Prix en EUR)
              </Link>
              <a
                href="https://wa.me/32490224905?text=Bonjour%2C%20je%20suis%20en%20Belgique%20et%20souhaite%20un%20devis"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600/80 hover:bg-emerald-600 text-white px-7 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition flex items-center gap-2"
              >
                <MessageCircle size={15} />
                Échanger sur WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#1A1238]/60 border border-brand-purple/20 rounded-3xl p-6 md:p-8 space-y-5">
            <h3 className="font-montserrat font-bold text-lg text-white">Avantages Clients en Belgique</h3>
            <ul className="text-xs sm:text-sm text-white/75 space-y-3.5">
              <li className="flex items-start gap-2.5">
                <FileCheck size={18} className="text-brand-magenta shrink-0 mt-0.5" />
                <span><strong>Facturation B2B HT :</strong> Exonération de TVA pour les assujettis avec numéro de TVA intracommunautaire valide.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Truck size={18} className="text-brand-orange shrink-0 mt-0.5" />
                <span><strong>Livraison Express 3-5j :</strong> Expédition directe vers Bruxelles, Liège, Namur, Mons, Charleroi et toute la Flandre.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-green-400 shrink-0 mt-0.5" />
                <span><strong>Suivi Personnalisé :</strong> Validation par Bon à Tirer (BAT) et visio sous 24h ouvrées.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pillars Services Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-magenta">Nos Solutions en Belgique</span>
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white">4 Pôles d'Expertise Dédiés</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BELGIUM_SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={i}
                  href={svc.slug}
                  className="group bg-[#1A1238]/40 border border-brand-purple/20 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-magenta/40 transition hover:-translate-y-1 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-brand-purple/20 text-brand-magenta rounded-xl group-hover:scale-105 transition-transform">
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider bg-white/5 px-2.5 py-1 rounded-full">
                        {svc.badge}
                      </span>
                    </div>
                    <h3 className="font-montserrat font-bold text-base text-white group-hover:text-brand-magenta transition">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-white/65 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-brand-orange group-hover:translate-x-1 transition-transform">
                    <span>En savoir plus</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Working Process */}
        <section className="bg-[#1A1238]/30 border border-brand-purple/15 rounded-3xl p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-orange">Processus Simple & Rapide</span>
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white">Comment travaillons-nous ensemble ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Brief en ligne ou visio", desc: "Vous décrivez vos besoins via notre formulaire ou lors d'un échange vidéo." },
              { num: "02", title: "Proposition chiffrée", desc: "Devis clair en euros (€) avec mention de la TVA intracommunautaire sous 24h." },
              { num: "03", title: "Conception & BAT", desc: "Création graphique, allers-retours et validation formelle de la maquette." },
              { num: "04", title: "Livraison en Belgique", desc: "Fichiers livrés en ligne ou expédition suivie de vos imprimés à votre adresse." },
            ].map((step, idx) => (
              <div key={idx} className="bg-brand-navy/60 border border-brand-purple/20 p-5 rounded-2xl space-y-2 relative">
                <span className="text-3xl font-montserrat font-extrabold text-brand-purple/25 absolute top-3 right-3">{step.num}</span>
                <h4 className="font-montserrat font-bold text-sm text-white pt-2">{step.title}</h4>
                <p className="text-xs text-white/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <FaqAccordion
          title="Questions Fréquentes — Clients en Belgique"
          subtitle="Toutes les réponses relatives aux délais, à la facturation et aux expéditions en Belgique."
          items={BELGIUM_FAQS}
        />

        {/* Call to Action */}
        <section className="glassmorphism rounded-3xl p-8 md:p-12 border border-brand-orange/30 text-center space-y-6">
          <h3 className="font-montserrat font-bold text-2xl md:text-4xl text-white">
            Prêt à lancer votre projet en Belgique ?
          </h3>
          <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
            Profitez de l'exigence d'un studio créatif reconnu avec la flexibilité d'une gestion 100% en ligne et des tarifs compétitifs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/devis-sur-mesure?region=belgique"
              className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-brand-orange/20"
            >
              Demander mon devis gratuit
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition"
            >
              Poser une question
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
