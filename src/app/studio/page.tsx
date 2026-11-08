import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  Sparkles,
  CreditCard,
  FileText,
  Gift,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  Palette,
  Layers,
  Clock,
  BadgeCheck,
  Star,
} from "lucide-react";
import { STUDIO_TEMPLATES } from "@/components/studio/StudioTemplates";
import StudioHeroCard from "@/components/studio/StudioHeroCard";
import StudioTemplateGallery from "@/components/studio/StudioTemplateGallery";

export const metadata: Metadata = {
  title: "Studio de création graphique en ligne | Art Vision",
  description:
    "Personnalisez gratuitement vos cartes de visite, flyers et supports de communication en ligne avec aperçu temps réel. Impression professionnelle et livraison rapide par Art Vision.",
  alternates: {
    canonical: "https://art-visions.fr/studio",
  },
  openGraph: {
    title: "Studio de création graphique en ligne | Art Vision",
    description:
      "Créez votre visuel en ligne, on s'occupe de l'impression professionnelle. Modèles personnalisables pour artisans, commerces, restaurants et indépendants.",
    url: "https://art-visions.fr/studio",
    type: "website",
  },
};

const PRODUCTS = [
  {
    id: "cartes-de-visite",
    slug: "cartes-de-visite",
    title: "Cartes de visite professionnelles",
    format: "85 × 55 mm",
    sides: "Recto / Verso",
    badge: "Le plus populaire",
    badgeIcon: Star,
    description:
      "Le support incontournable pour vos rendez-vous. Formats standard, papier 300g à 400g, finitions Soft-Touch et vernis sélectif.",
    image: "/images/impression/16-cartes-de-visite-art-vision.webp",
    icon: CreditCard,
    startingPrice: "Dès 46 € HT",
    chips: ["Soft-Touch velours", "Vernis 3D sélectif", "Kraft recyclé", "300 g → 400 g"],
  },
  {
    id: "flyers",
    slug: "flyers",
    title: "Flyers & Prospectus publicitaires",
    format: "A5 (148 × 210 mm) & A6",
    sides: "Recto / Verso",
    badge: "Grand impact",
    badgeIcon: Sparkles,
    description:
      "Faites la promotion de vos événements, ouvertures ou menus. Papiers couché brillant ou mat de 130g à 350g.",
    image: "/images/impression/29-flyers-art-vision.webp",
    icon: FileText,
    startingPrice: "Dès 49 € HT",
    chips: ["Couché brillant ou mat", "130 g → 350 g", "A5 & A6", "Recto / Verso"],
  },
  {
    id: "bons-cadeaux",
    slug: "cartes-de-visite", // shares the studio card engine
    title: "Bons & Chèques cadeaux",
    format: "210 × 100 mm & A6",
    sides: "Recto / Verso",
    badge: "Fêtes & Boutiques",
    badgeIcon: Gift,
    description:
      "Idéal pour instituts, boutiques, restaurants et spas. Papier inscriptible pour montant et message personnalisé.",
    image: "/images/impression/17-cartes-de-voeux-art-vision.webp",
    icon: Gift,
    startingPrice: "Dès 55 € HT",
    chips: ["Papier inscriptible", "210 × 100 mm", "A6", "Recto / Verso"],
  },
];

const TRUST = [
  { icon: Clock, title: "BAT sous 24h", text: "Votre Bon à Tirer numérique par e-mail" },
  { icon: ShieldCheck, title: "Contrôle PAO offert", text: "Fonds perdus et résolution vérifiés" },
  { icon: BadgeCheck, title: "Impression certifiée", text: "Papiers FSC et fichiers aux normes PAO" },
  { icon: Truck, title: "Livraison suivie", text: "France et Europe, numéro de suivi inclus" },
];

const HERO_TEMPLATE =
  STUDIO_TEMPLATES.find((t) => t.id === "template-freelance-premium") ?? STUDIO_TEMPLATES[0];

export default function StudioHubPage() {
  return (
    <main className="min-h-screen bg-av-night text-white pt-28 pb-24 relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-[10%] w-[560px] h-[560px] bg-av-violet/25 rounded-full blur-[150px]" />
        <div className="absolute top-40 right-[5%] w-[480px] h-[480px] bg-av-magenta/18 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1.2px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 22%, #000 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 22%, #000 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* 1. HERO */}
        <section className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-8 items-center">
          <div className="space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-av-violet/20 border border-av-violet/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-av-orange backdrop-blur">
              <Sparkles size={14} />
              <span>Nouveau • Studio de création en ligne</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Créez votre visuel,{" "}
              <span className="bg-gradient-to-r from-av-orange via-av-magenta to-av-violet bg-clip-text text-transparent">
                on s&apos;occupe de l&apos;impression.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Personnalisez un modèle ou laissez parler votre créativité. Ajoutez vos textes, votre logo et vos images,
              puis commandez votre support imprimé haute définition chez Art Vision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/studio/editor?product=cartes-de-visite"
                className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-av-orange to-av-magenta px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl shadow-av-orange/25 hover:shadow-av-magenta/40 hover:brightness-110 active:scale-95 transition-all"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-white/25 -skew-x-[18deg] group-hover:animate-[studio-shine_0.9s_ease]" />
                <span className="relative">Créer ma carte maintenant</span>
                <ArrowRight size={15} className="relative transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#modeles"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white/90 transition active:scale-95"
              >
                Voir les modèles
              </a>
            </div>

            <div className="inline-flex items-start gap-3 text-left bg-white/[0.04] backdrop-blur-xl border border-white/10 px-5 py-3.5 rounded-2xl">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  Création en ligne incluse avec votre commande d&apos;impression chez Art Vision.
                </p>
                <span className="text-[11px] text-white/50 block mt-0.5">
                  Sans inscription préalable • Aperçu temps réel • Fichiers certifiés aux normes PAO
                </span>
              </div>
            </div>
          </div>

          <StudioHeroCard design={HERO_TEMPLATE.design} />
        </section>

        {/* 1b. TRUST BAR */}
        <section aria-label="Nos garanties" className="-mt-12">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-white/10 bg-white/10 backdrop-blur-xl">
            {TRUST.map((t) => {
              const Icon = t.icon;
              return (
                <li
                  key={t.title}
                  className="group flex items-center gap-3 sm:gap-4 bg-[#0c081e]/90 hover:bg-[#140d2e] transition-colors p-4 sm:p-5"
                >
                  <span className="shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-av-violet/40 to-av-magenta/20 border border-white/10 flex items-center justify-center text-av-orange group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-xs sm:text-sm font-bold text-white">{t.title}</strong>
                    <span className="block text-[11px] text-white/50 leading-snug">{t.text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 2. PRODUCTS */}
        <section className="space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-av-magenta uppercase tracking-wider">1. Votre support</span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Choisissez ce que vous voulez personnaliser
            </h2>
            <p className="text-sm text-white/60">
              Sélectionnez un produit pour lancer immédiatement l&apos;éditeur interactif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((p) => {
              const Icon = p.icon;
              const BadgeIcon = p.badgeIcon;
              return (
                <article key={p.id} className="group relative">
                  {/* gradient border */}
                  <div className="absolute -inset-px rounded-[28px] bg-gradient-to-br from-white/15 via-white/5 to-white/0 group-hover:from-av-orange group-hover:via-av-magenta group-hover:to-av-violet transition-colors duration-500" />
                  <div className="relative h-full rounded-[27px] bg-[#0e0a22] p-5 flex flex-col group-hover:-translate-y-1.5 group-hover:shadow-[0_30px_70px_-30px_rgba(215,40,136,0.55)] transition-all duration-500">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-av-orange bg-av-orange/10 border border-av-orange/25 px-2.5 py-1 rounded-full group-hover:bg-av-orange group-hover:text-white transition-colors">
                        <BadgeIcon size={11} />
                        {p.badge}
                      </span>
                      <span className="p-2 rounded-xl bg-av-violet/20 text-av-magenta group-hover:bg-av-magenta group-hover:text-white transition-colors">
                        <Icon size={18} />
                      </span>
                    </div>

                    {/* Visual */}
                    <div className="relative mt-4 aspect-[16/10] rounded-2xl overflow-hidden bg-[radial-gradient(ellipse_at_50%_60%,rgba(108,43,217,0.4),#120c28_70%)] border border-white/5">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-2"
                      />
                      {/* light sweep */}
                      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-[18deg] opacity-0 group-hover:opacity-100 group-hover:animate-[studio-shine_1.1s_ease]" />
                    </div>

                    <div className="mt-5 flex-1">
                      <h3 className="text-lg font-bold text-white">{p.title}</h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-semibold text-white/75 bg-white/[0.06] border border-white/10 rounded-full px-2.5 py-0.5 hover:border-av-orange/50 transition-colors">
                          {p.format}
                        </span>
                        <span className="text-[10px] font-semibold text-white/75 bg-white/[0.06] border border-white/10 rounded-full px-2.5 py-0.5 hover:border-av-orange/50 transition-colors">
                          {p.sides}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-3 leading-relaxed">{p.description}</p>

                      {/* hover-revealed spec chips (always visible on touch screens) */}
                      <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500">
                        <div className="overflow-hidden">
                          <div className="flex flex-wrap gap-1.5 pt-3">
                            {p.chips.map((c) => (
                              <span
                                key={c}
                                className="text-[10px] font-medium text-white/70 rounded-full border border-av-violet/40 bg-av-violet/10 px-2 py-0.5"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-white/40 block">Tarif atelier</span>
                        <strong className="text-sm font-extrabold text-white">{p.startingPrice}</strong>
                      </div>
                      <Link
                        href={`/studio/editor?product=${p.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-av-orange to-av-magenta px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-av-orange/20 hover:brightness-110 active:scale-95 transition"
                      >
                        <span>Personnaliser</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. TEMPLATE GALLERY */}
        <section id="modeles" className="space-y-8 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold text-av-magenta uppercase tracking-wider">
                2. Démarrez en quelques secondes
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Ou partez d&apos;un modèle adapté à votre métier
              </h2>
              <p className="text-sm text-white/60">
                Survolez une carte pour voir son verso. Tout reste modifiable dans l&apos;éditeur.
              </p>
            </div>

            <Link
              href="/studio/editor?product=cartes-de-visite"
              className="group text-xs font-bold text-av-orange hover:text-white flex items-center gap-1.5 transition shrink-0"
            >
              <span>Partir d&apos;une page blanche</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <StudioTemplateGallery />
        </section>

        {/* 4. WORKFLOW */}
        <section className="relative rounded-[32px] bg-gradient-to-b from-[#120b2e] to-[#0b0720] border border-white/10 p-7 md:p-12 overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-av-magenta/15 blur-[100px]" />
          <div className="relative max-w-3xl mb-10 space-y-2">
            <span className="text-xs font-bold text-av-orange uppercase tracking-wider">
              Une expérience fluide &amp; professionnelle
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Comment fonctionne le Studio Art Vision ?</h2>
            <p className="text-sm text-white/60">
              De votre idée à la livraison de vos supports d&apos;impression sur votre lieu d&apos;activité.
            </p>
          </div>

          <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                title: "Création intuitive en ligne",
                desc: "Personnalisez textes, typographies, couleurs, importez votre logo et vos visuels sans aucune compétence technique.",
                icon: Palette,
              },
              {
                step: "02",
                title: "Options d'impression réelles",
                desc: "Choisissez votre papier, grammage (300g à 400g), finitions Soft-Touch ou vernis 3D et votre quantité aux tarifs atelier.",
                icon: Layers,
              },
              {
                step: "03",
                title: "Contrôle PAO & BAT offert",
                desc: "Notre atelier graphique vérifie vos fonds perdus et vous envoie votre Bon à Tirer (BAT) numérique par e-mail.",
                icon: ShieldCheck,
              },
              {
                step: "04",
                title: "Impression HD & Livraison",
                desc: "Règlement sécurisé après votre accord. Vos supports sont imprimés et expédiés avec suivi partout en France et en Europe.",
                icon: Truck,
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.step}
                  className="group p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-av-violet/60 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold font-mono bg-gradient-to-br from-av-orange to-av-magenta bg-clip-text text-transparent">
                      {s.step}
                    </span>
                    <span className="w-9 h-9 rounded-xl bg-av-violet/20 flex items-center justify-center text-av-orange group-hover:scale-110 transition-transform">
                      <Icon size={18} />
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </main>
  );
}
