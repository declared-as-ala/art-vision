import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Printer, ArrowRight, Truck, FileCheck2, Sparkles } from "lucide-react";
import { LOCAL_CITIES } from "@/data/local-cities";

export const metadata: Metadata = {
  title: "Zones desservies en France | Impression & Création Graphique - Art Vision",
  description:
    "Découvrez les 20 grandes villes françaises desservies par Art Vision (Paris, Lyon, Marseille, Toulouse, Bordeaux, Lille, Nantes...) et notre siège au Mans : impression 48 supports et design graphique.",
  alternates: {
    canonical: "https://art-visions.fr/zones-desservies",
  },
  openGraph: {
    title: "Zones desservies en France | Art Vision",
    description:
      "Impression professionnelle et création graphique partout en France avec livraison en 1 à 3 jours ouvrables après production.",
    url: "https://art-visions.fr/zones-desservies",
    type: "website",
  },
};

export default function ZonesDesserviesPage() {
  const hq = LOCAL_CITIES.find((c) => c.isHeadquarters);
  const cities = LOCAL_CITIES.filter((c) => !c.isHeadquarters);

  return (
    <div className="min-h-screen hero-gradient text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Hero */}
        <header className="max-w-4xl space-y-5">
          <nav aria-label="Fil d'Ariane" className="text-xs text-white/60 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition">Accueil</Link>
            <span>/</span>
            <span className="text-white">Zones desservies</span>
          </nav>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/25 border border-brand-purple/40 text-brand-orange text-xs font-bold uppercase tracking-wider">
            <MapPin size={13} />
            Couverture nationale France
          </span>

          <h1 className="text-3xl sm:text-5xl font-montserrat font-extrabold leading-tight">
            Impression & création graphique dans toute la France
          </h1>
          <p className="text-base sm:text-lg text-white/75 leading-relaxed">
            Basée au Mans (72000), l&apos;agence Art Vision accompagne les commerçants, artisans, restaurants, associations et entreprises dans les principales métropoles françaises : création de maquettes en ligne ou sur devis, contrôle technique PAO gratuit et livraison en 1 à 3 jours ouvrables après production.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-2">
            <Link
              href="/impression"
              className="px-7 py-3.5 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition inline-flex items-center gap-2"
            >
              <Printer size={16} />
              <span>Voir le catalogue impression</span>
            </Link>
            <Link
              href="/devis-sur-mesure"
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transition"
            >
              Demander un devis gratuit
            </Link>
          </div>
        </header>

        {/* Key guarantees */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/20 space-y-2">
            <FileCheck2 size={20} className="text-brand-magenta" />
            <h2 className="font-montserrat font-bold text-base">Contrôle PAO gratuit</h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Vérification de la résolution (300 DPI), colorimétrie CMJN et bords perdus de 2 mm avant chaque tirage.
            </p>
          </div>
          <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/20 space-y-2">
            <Truck size={20} className="text-brand-orange" />
            <h2 className="font-montserrat font-bold text-base">Production 2j + Livraison 1–3j</h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Production standard en 2 jours ouvrables (+2 jours avec vernis ou pelliculage), puis expédition suivie partout en France.
            </p>
          </div>
          <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/20 space-y-2">
            <Sparkles size={20} className="text-purple-300" />
            <h2 className="font-montserrat font-bold text-base">Studio en ligne & sur mesure</h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Personnalisez votre support directement sur notre Studio (/studio) ou confiez votre création graphique à nos designers.
            </p>
          </div>
        </section>

        {/* HQ Highlight */}
        {hq && (
          <section className="rounded-3xl bg-[#160c2e]/90 border border-brand-orange/35 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
            <img
              src={hq.photo.path}
              alt={hq.photo.alt}
              width={hq.photo.width}
              height={hq.photo.height}
              className="w-full md:w-72 h-48 object-cover rounded-2xl border border-white/15 shrink-0"
            />
            <div className="space-y-3 flex-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-orange">
                Siège France • 5 Rue de Constantine, 72000 Le Mans
              </span>
              <h2 className="font-montserrat font-extrabold text-2xl text-white">
                Agence Art Vision — {hq.city}
              </h2>
              <p className="text-sm text-white/75 leading-relaxed">{hq.intro}</p>
              <Link
                href={`/${hq.slug}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-xs font-bold uppercase tracking-wider text-white transition"
              >
                <span>Découvrir la page {hq.city}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}

        {/* 20 Cities Grid */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-white">
              Les 20 villes principales desservies
            </h2>
            <p className="text-sm text-white/70">
              Sélectionnez votre ville pour découvrir les supports d&apos;impression recommandés et obtenir un devis adapté à votre secteur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="group glassmorphism rounded-2xl border border-brand-purple/20 hover:border-brand-magenta/50 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="relative h-36 bg-[#120826] overflow-hidden">
                  <img
                    src={c.photo.path}
                    alt={c.photo.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-3 font-montserrat font-extrabold text-base text-white">
                    {c.city}
                  </span>
                  <span className="absolute top-2.5 right-2.5 text-[10px] px-2 py-0.5 rounded-full bg-black/60 border border-white/15 text-white/85">
                    {c.department}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-white/70 line-clamp-2">{c.editorialAngle}</p>
                  <span className="text-[11px] font-bold text-brand-orange inline-flex items-center gap-1">
                    <span>Voir les offres {c.preposition}</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
