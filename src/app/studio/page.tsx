import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowRight, BadgeCheck, Clock, ShieldCheck, Truck } from "lucide-react";
import catalog from "@/data/impression-catalog.json";
import { STUDIO_PRODUCTS } from "@/components/studio/studioProducts";
import StudioDrafts from "@/components/studio/StudioDrafts";

export const metadata: Metadata = {
  title: "Studio de création graphique en ligne | Art Vision",
  description:
    "Choisissez votre support (cartes de visite, flyers, bons cadeaux, bâches), personnalisez-le en ligne et commandez votre impression professionnelle chez Art Vision.",
  alternates: {
    canonical: "https://art-visions.fr/studio",
  },
  openGraph: {
    title: "Studio de création graphique en ligne | Art Vision",
    description:
      "Créez votre visuel en ligne, on s'occupe de l'impression professionnelle : cartes de visite, flyers, bons cadeaux, bâches.",
    url: "https://art-visions.fr/studio",
    type: "website",
  },
};

type CatalogProduct = { slug: string; label: string; image: string; startingPrice: { display: string } };
const CATALOG = catalog.products as CatalogProduct[];

const FORMATS_LABEL: Record<string, string> = {
  "cartes-de-visite": "85 × 55 mm",
  flyers: "A6 · A5 · A4 · A3 · US",
  "bons-cadeaux": "A6 · US · A5",
  baches: "Dimensions sur mesure (cm)",
};

const TRUST = [
  { icon: Clock, title: "BAT sous 24h", text: "Bon à tirer numérique par e-mail" },
  { icon: ShieldCheck, title: "Contrôle PAO offert", text: "Fonds perdus et résolution vérifiés" },
  { icon: BadgeCheck, title: "Paiement après BAT", text: "Vous payez une fois le BAT validé" },
  { icon: Truck, title: "Livraison suivie", text: "1 à 3 jours ouvrables après production" },
];

const SUPPORTED_SLUGS = new Set(STUDIO_PRODUCTS.map((p) => p.catalogSlug));
const OTHERS = CATALOG.filter((p) => !SUPPORTED_SLUGS.has(p.slug)).slice(0, 14);

export default function StudioHubPage() {
  return (
    <main className="min-h-screen bg-av-night text-white pt-28 pb-20 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-[8%] w-[480px] h-[480px] bg-av-violet/20 rounded-full blur-[140px]" />
        <div className="absolute top-32 right-[6%] w-[420px] h-[420px] bg-av-magenta/15 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Step 1 — support */}
        <section className="space-y-8">
          <header className="space-y-2 max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-av-orange">
              Étape 1 sur 5 · Support
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Quel support souhaitez-vous créer ?
            </h1>
            <p className="text-sm text-white/60">
              Vous choisirez ensuite le format, puis un modèle ou une page blanche. Création en ligne incluse avec votre
              impression.
            </p>
          </header>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STUDIO_PRODUCTS.map((p) => {
              const cat = CATALOG.find((c) => c.slug === p.catalogSlug);
              return (
                <li key={p.id}>
                  <Link
                    href={`/studio/nouveau?product=${p.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:border-av-orange/70 hover:bg-white/[0.07] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(255,106,0,0.45)] transition-all duration-200"
                  >
                    <div className="relative aspect-[16/11] rounded-xl overflow-hidden bg-[radial-gradient(ellipse_at_50%_60%,rgba(108,43,217,0.35),#120c28_70%)] border border-white/5">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h2 className="mt-4 text-base font-bold text-white">{p.name}</h2>
                    <p className="text-[11px] font-semibold text-av-orange mt-1">{FORMATS_LABEL[p.id]}</p>
                    <p className="text-xs text-white/55 mt-2 leading-snug flex-1">{p.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[11px] text-white/50">{cat?.startingPrice.display}</span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-av-orange transition-colors">
                        Choisir <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <StudioDrafts />

        {/* Other catalog products: quote requests rather than a mismatched editor */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">Un autre support ?</h2>
            <p className="text-xs text-white/55 mt-1">
              L&apos;éditeur en ligne n&apos;est pas encore disponible pour ces produits. Envoyez-nous votre fichier ou
              demandez un devis adapté.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {OTHERS.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/impression/${o.slug}`}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:border-av-orange/60 hover:text-white transition"
                >
                  {o.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/devis-sur-mesure"
                className="inline-flex items-center gap-1.5 rounded-full bg-av-orange px-4 py-1.5 text-xs font-bold text-white hover:brightness-110 transition"
              >
                Demander un devis <ArrowRight size={13} />
              </Link>
            </li>
          </ul>
        </section>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10">
          {TRUST.map((t) => {
            const Icon = t.icon;
            return (
              <li key={t.title} className="flex items-center gap-3 bg-[#0c081e] p-4">
                <span className="shrink-0 w-9 h-9 rounded-xl bg-av-violet/25 border border-white/10 flex items-center justify-center text-av-orange">
                  <Icon size={17} />
                </span>
                <span className="min-w-0">
                  <strong className="block text-xs font-bold text-white">{t.title}</strong>
                  <span className="block text-[11px] text-white/50 leading-snug">{t.text}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
