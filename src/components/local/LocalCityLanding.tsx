import React from "react";
import Link from "next/link";
import {
  Printer,
  ArrowRight,
  Check,
  HelpCircle,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  FileCheck2,
  Truck,
  Palette,
  Layers,
  Clock,
  ShieldCheck,
} from "lucide-react";
import catalog from "@/data/impression-catalog.json";
import type { LocalCityData } from "@/data/local-cities-types";

interface CatalogProduct {
  slug: string;
  label: string;
  url: string;
  image: string;
  alt: string;
  startingPrice?: {
    amount?: string;
    unit?: string;
    display?: string;
    isQuote?: boolean;
  };
}

const CATALOG_MAP = new Map<string, CatalogProduct>(
  (catalog.products as CatalogProduct[]).map((p) => [p.slug, p])
);

const ACCENT_STYLES = {
  orange: {
    badge: "bg-brand-orange/15 border-brand-orange/40 text-brand-orange",
    cta: "bg-brand-orange hover:bg-brand-orange/90 text-white shadow-lg shadow-brand-orange/20",
    highlight: "text-brand-orange",
    borderHover: "hover:border-brand-orange/50",
    pill: "bg-brand-orange/15 text-brand-orange border-brand-orange/30",
  },
  magenta: {
    badge: "bg-brand-magenta/15 border-brand-magenta/40 text-brand-magenta",
    cta: "bg-brand-magenta hover:bg-brand-magenta/90 text-white shadow-lg shadow-brand-magenta/20",
    highlight: "text-brand-magenta",
    borderHover: "hover:border-brand-magenta/50",
    pill: "bg-brand-magenta/15 text-brand-magenta border-brand-magenta/30",
  },
  purple: {
    badge: "bg-brand-purple/25 border-brand-purple/50 text-purple-200",
    cta: "bg-gradient-to-r from-brand-purple to-brand-magenta hover:opacity-95 text-white shadow-lg shadow-brand-purple/25",
    highlight: "text-purple-300",
    borderHover: "hover:border-brand-purple/60",
    pill: "bg-brand-purple/25 text-purple-200 border-brand-purple/40",
  },
};

export default function LocalCityLanding({ data }: { data: LocalCityData }) {
  const accent = ACCENT_STYLES[data.accent];
  const devisBase = `/devis-sur-mesure?city=${encodeURIComponent(data.city)}&service=impression&source=${encodeURIComponent(`/${data.slug}`)}`;

  const enrichedProducts = data.featuredProducts
    .map((rec) => {
      const prod = CATALOG_MAP.get(rec.slug);
      if (!prod) return null;
      return { ...rec, product: prod };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // Structured Data (100% honest, matching visible content)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://art-visions.fr" },
      { "@type": "ListItem", position: 2, name: "Zones desservies", item: "https://art-visions.fr/zones-desservies" },
      { "@type": "ListItem", position: 3, name: `${data.city}`, item: `https://art-visions.fr/${data.slug}` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": data.isHeadquarters ? "LocalBusiness" : "Service",
    name: data.isHeadquarters
      ? "Art Vision — Agence Graphique & Impression Le Mans"
      : `Impression & Communication Visuelle ${data.preposition} — Art Vision`,
    description: data.metaDescription,
    url: `https://art-visions.fr/${data.slug}`,
    areaServed: {
      "@type": "City",
      name: data.city,
    },
    ...(data.isHeadquarters
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: "5 Rue de Constantine",
            addressLocality: "Le Mans",
            postalCode: "72000",
            addressCountry: "FR",
          },
          telephone: "+32490224905",
          email: "contact@art-visions.fr",
        }
      : {
          provider: {
            "@type": "Organization",
            name: "Art Vision",
            url: "https://art-visions.fr",
            address: {
              "@type": "PostalAddress",
              streetAddress: "5 Rue de Constantine",
              addressLocality: "Le Mans",
              postalCode: "72000",
              addressCountry: "FR",
            },
          },
        }),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const isPanoramicHero =
    data.layoutVariant === "editorial-panoramic" || data.layoutVariant === "refined-atelier";
  const isSplitHero =
    data.layoutVariant === "dynamic-split" || data.layoutVariant === "corporate-asymmetric";
  const showComparisonTable = data.layoutVariant === "b2b-comparison";

  return (
    <div className="min-h-screen hero-gradient text-white pb-24 lg:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ==================== A. HERO SECTION (VARIED BY LAYOUT) ==================== */}
      {isPanoramicHero ? (
        <header className="relative pt-24 sm:pt-28 pb-12 overflow-hidden">
          {/* Background City Photo with dark editorial overlay */}
          <div className="absolute inset-0 -z-10">
            <img
              src={data.photo.path}
              alt={data.photo.alt}
              width={data.photo.width}
              height={data.photo.height}
              className="w-full h-full object-cover opacity-25 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#070312]/80 via-[#0b041c]/85 to-[#080316]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Fil d'Ariane" className="text-xs text-white/60 flex items-center gap-2 mb-6">
              <Link href="/" className="hover:text-white transition">Accueil</Link>
              <span>/</span>
              <Link href="/zones-desservies" className="hover:text-white transition">Zones desservies</Link>
              <span>/</span>
              <span className="text-white font-medium">{data.city}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${accent.badge}`}>
                  <MapPin size={13} />
                  {data.heroBadge}
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-montserrat font-extrabold leading-[1.08] tracking-tight text-white">
                  {data.h1}
                </h1>
                <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
                  {data.heroSubtitle}
                </p>
                <div className="flex flex-wrap gap-3.5 pt-2">
                  <Link
                    href="/impression"
                    data-tracking="print_catalog_click"
                    className={`px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition motion-reduce:transition-none inline-flex items-center gap-2 ${accent.cta}`}
                  >
                    <Printer size={16} />
                    <span>Voir les impressions et tarifs</span>
                  </Link>
                  <Link
                    href={devisBase}
                    data-tracking="devis_click"
                    className="px-7 py-3.5 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-white transition motion-reduce:transition-none inline-flex items-center gap-2"
                  >
                    <span>Demander un devis gratuit</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <figure className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#120826]">
                  <img
                    src={data.photo.path}
                    alt={data.photo.alt}
                    width={data.photo.width}
                    height={data.photo.height}
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  <figcaption className="px-4 py-2.5 text-[11px] text-white/65 bg-black/50 backdrop-blur-md flex items-center justify-between gap-2">
                    <span>{data.photo.caption}</span>
                    <span className="text-white/45 shrink-0">{data.department}</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <header className="relative pt-24 sm:pt-28 pb-12 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Fil d'Ariane" className="text-xs text-white/60 flex items-center gap-2 mb-6">
              <Link href="/" className="hover:text-white transition">Accueil</Link>
              <span>/</span>
              <Link href="/zones-desservies" className="hover:text-white transition">Zones desservies</Link>
              <span>/</span>
              <span className="text-white font-medium">{data.city}</span>
            </nav>

            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isSplitHero ? "" : "lg:gap-10"}`}>
              <div className={`${isSplitHero ? "lg:col-span-6 lg:order-2" : "lg:col-span-7"} space-y-5`}>
                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${accent.badge}`}>
                  <MapPin size={13} />
                  {data.heroBadge}
                </span>
                <h1 className="text-3xl sm:text-5xl font-montserrat font-extrabold leading-[1.1] tracking-tight text-white">
                  {data.h1}
                </h1>
                <p className="text-base text-white/75 leading-relaxed">
                  {data.heroSubtitle}
                </p>

                {/* Quick Print Reassurance Strip */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="glassmorphism rounded-xl p-3 border border-brand-purple/20">
                    <span className={`text-sm font-extrabold block ${accent.highlight}`}>48 supports</span>
                    <span className="text-[11px] text-white/60">catalogue tarifé</span>
                  </div>
                  <div className="glassmorphism rounded-xl p-3 border border-brand-purple/20">
                    <span className={`text-sm font-extrabold block ${accent.highlight}`}>PAO gratuit</span>
                    <span className="text-[11px] text-white/60">fichier vérifié</span>
                  </div>
                  <div className="glassmorphism rounded-xl p-3 border border-brand-purple/20">
                    <span className={`text-sm font-extrabold block ${accent.highlight}`}>1 à 3 j. ouv.</span>
                    <span className="text-[11px] text-white/60">livraison {data.city}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3.5 pt-2">
                  <Link
                    href="/impression"
                    data-tracking="print_catalog_click"
                    className={`px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition motion-reduce:transition-none inline-flex items-center gap-2 ${accent.cta}`}
                  >
                    <Printer size={16} />
                    <span>Voir les impressions et tarifs</span>
                  </Link>
                  <Link
                    href={devisBase}
                    data-tracking="devis_click"
                    className="px-7 py-3.5 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-white transition motion-reduce:transition-none inline-flex items-center gap-2"
                  >
                    <span>Demander un devis gratuit</span>
                  </Link>
                </div>
              </div>

              <div className={`${isSplitHero ? "lg:col-span-6 lg:order-1" : "lg:col-span-5"}`}>
                <figure className="relative rounded-3xl overflow-hidden border border-brand-purple/30 shadow-2xl bg-[#120826]">
                  <img
                    src={data.photo.path}
                    alt={data.photo.alt}
                    width={data.photo.width}
                    height={data.photo.height}
                    className="w-full h-72 sm:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                  <figcaption className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                    <span className="font-semibold">{data.photo.caption}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 border border-white/15 text-[10px]">
                      {data.region}
                    </span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ==================== INTRO EDITORIAL BAR ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="glassmorphism rounded-2xl p-6 sm:p-8 border border-brand-purple/20 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-4xl">
            {data.intro}
          </p>
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto">
            <Link
              href="/studio"
              className="px-5 py-2.5 rounded-xl bg-brand-purple/30 hover:bg-brand-purple/45 border border-brand-purple/40 text-xs font-bold text-white text-center transition inline-flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="text-brand-orange" />
              <span>Studio en ligne : créer mon visuel</span>
            </Link>
            <a
              href="https://wa.me/32490224905"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-xs font-bold text-emerald-300 text-center transition inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} />
              <span>Échanger sur WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== B. SERVICES D'IMPRESSION (70% PRIORITÉ) ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <span className={`text-xs font-extrabold uppercase tracking-widest ${accent.highlight}`}>
              Catalogue Impression • Tarifs HT réels
            </span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-extrabold text-white">
              {data.printSectionTitle}
            </h2>
            <p className="text-sm text-white/70">{data.printSectionIntro}</p>
          </div>
          <Link
            href="/impression"
            className="text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Voir les 48 supports du catalogue</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrichedProducts.map(({ product, customTag, localPitch, recommendedSpec }) => (
            <article
              key={product.slug}
              className={`group rounded-2xl bg-[#150b2b]/80 border border-brand-purple/20 ${accent.borderHover} overflow-hidden flex flex-col transition-all duration-300 motion-reduce:transition-none hover:-translate-y-0.5`}
            >
              <div className="relative aspect-[16/10] bg-[#0e0620] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.alt || product.label}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white uppercase tracking-wider">
                    {customTag}
                  </span>
                </div>
                {product.startingPrice?.display && (
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-extrabold shadow-md">
                      {product.startingPrice.display}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-montserrat font-bold text-lg text-white group-hover:text-brand-orange transition">
                    {product.label}
                  </h3>
                  <p className="text-xs text-white/75 leading-relaxed">{localPitch}</p>
                  <p className="text-[11px] font-semibold text-white/90 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 inline-block">
                    {recommendedSpec}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
                  <Link
                    href={product.url}
                    className="flex-1 text-center py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
                  >
                    Tarifs & formats
                  </Link>
                  <Link
                    href={`/devis-sur-mesure?city=${encodeURIComponent(data.city)}&product=${encodeURIComponent(product.label)}&service=impression&source=${encodeURIComponent(`/${data.slug}`)}`}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition ${accent.cta}`}
                  >
                    Devis
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Optional B2B Comparison Table (Lille, Grenoble, Metz) */}
        {showComparisonTable && (
          <div className="glassmorphism rounded-2xl border border-brand-purple/25 overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-montserrat font-bold text-base text-white">
                Comparatif rapide des supports recommandés {data.preposition}
              </h3>
              <span className="text-[11px] text-white/55">Tarifs indicatifs HT du catalogue</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-white/70 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-5">Support</th>
                    <th className="py-3 px-5">Usage principal</th>
                    <th className="py-3 px-5">Tarif de départ</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {enrichedProducts.map(({ product, customTag, recommendedSpec }) => (
                    <tr key={product.slug} className="hover:bg-white/5 transition">
                      <td className="py-3 px-5 font-bold text-white">{product.label}</td>
                      <td className="py-3 px-5 text-white/75">{customTag}</td>
                      <td className="py-3 px-5 text-brand-orange font-semibold">{recommendedSpec}</td>
                      <td className="py-3 px-5 text-right">
                        <Link href={product.url} className="text-white hover:text-brand-magenta font-semibold underline">
                          Configurer →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ==================== C. IMPRESSION ADAPTÉE AUX PROS DE LA VILLE ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-magenta">
            Conseils métiers {data.preposition}
          </span>
          <h2 className="text-2xl sm:text-3xl font-montserrat font-extrabold text-white">
            {data.sectorsTitle}
          </h2>
          <p className="text-sm text-white/70">{data.sectorsIntro}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {data.localSectors.map((item) => (
            <div
              key={item.sector}
              className="glassmorphism rounded-2xl p-6 border border-brand-purple/20 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${accent.pill}`}>
                  {item.sector}
                </span>
                <h3 className="font-montserrat font-bold text-lg text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">{item.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex flex-wrap gap-1.5">
                  {item.recommendedSupports.map((sup) => (
                    <span
                      key={sup}
                      className="text-[11px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-white/85"
                    >
                      {sup}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-white/65 italic flex items-start gap-2">
                  <FileCheck2 size={14} className="text-brand-orange shrink-0 mt-0.5" />
                  <span>{item.paperTip}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== E. PARCOURS CRÉATION GRAPHIQUE & IMPRESSION ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl bg-[#160c2e]/90 border border-brand-purple/25 p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-orange">
                De la maquette à la livraison
              </span>
              <h2 className="text-2xl font-montserrat font-extrabold text-white">
                Comment se déroule votre commande d&apos;impression ?
              </h2>
              <p className="text-xs sm:text-sm text-white/75">{data.workflowNote}</p>
            </div>
            <Link
              href="/studio"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold uppercase tracking-wider text-white transition shrink-0 text-center"
            >
              Personnaliser mon support
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Support & format", desc: "Choisissez le produit et le grammage adaptés dans le catalogue." },
              { step: "02", title: "Fichier ou création", desc: "Importez votre PDF/AI, utilisez le Studio ou confiez-nous la maquette." },
              { step: "03", title: "Contrôle PAO gratuit", desc: "Vérification 300 DPI, CMJN et 2 mm de bord perdu sans surcoût." },
              { step: "04", title: "Production rapide", desc: "2 jours ouvrables standard (+2 jours si vernis ou pelliculage)." },
              { step: "05", title: `Livraison ${data.city}`, desc: "Expédition suivie en 1 à 3 jours ouvrables à votre adresse." },
            ].map((s) => (
              <div key={s.step} className="bg-black/25 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <span className={`text-xs font-extrabold ${accent.highlight}`}>Étape {s.step}</span>
                <h3 className="font-montserrat font-bold text-sm text-white">{s.title}</h3>
                <p className="text-[11px] text-white/65 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== D. DESIGN & CRÉATION GRAPHIQUE (30% SECONDAIRE) ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-magenta inline-flex items-center gap-1.5">
              <Palette size={14} />
              Studio créatif complémentaire
            </span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-extrabold text-white">
              {data.designSectionTitle}
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">{data.designSectionBody}</p>
            <div className="pt-2">
              <Link
                href={`/devis-sur-mesure?city=${encodeURIComponent(data.city)}&service=design-graphique&source=${encodeURIComponent(`/${data.slug}`)}`}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline"
              >
                <span>Confier mon projet graphique</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.highlightedServices.map((srv) => (
              <Link
                key={srv.href}
                href={srv.href}
                className="group glassmorphism rounded-2xl p-5 border border-brand-purple/20 hover:border-brand-magenta/50 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <Layers size={18} className="text-brand-magenta" />
                  <h3 className="font-montserrat font-bold text-sm text-white group-hover:text-brand-orange transition">
                    {srv.label}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">{srv.pitch}</p>
                </div>
                <span className="text-[11px] font-bold text-brand-magenta inline-flex items-center gap-1">
                  <span>Découvrir</span>
                  <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== F. BLOC DE CONVERSION INTERMÉDIAIRE & TRANSPARENCE GÉO ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Honest Local Service Box */}
          <div className="glassmorphism rounded-2xl p-6 sm:p-8 border border-brand-purple/25 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-orange">
              <ShieldCheck size={16} />
              <span>{data.isHeadquarters ? "Notre Siège Social en France" : `Service à distance & livraison ${data.preposition}`}</span>
            </div>
            <h3 className="font-montserrat font-bold text-xl text-white">
              {data.isHeadquarters
                ? "Art Vision — 5 Rue de Constantine, 72000 Le Mans"
                : `Accompagnement dédié pour les professionnels de ${data.city}`}
            </h3>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
              {data.isHeadquarters
                ? "Notre équipe française est basée au Mans (72000) pour accompagner les entreprises sarthoises et piloter les commandes d'impression partout en France."
                : `Art Vision est une agence basée au Mans (72000) qui accompagne les entreprises de ${data.city} et de ${data.region} à distance : création de maquettes en visio ou en ligne, contrôle PAO gratuit et livraison directe de vos imprimés.`}
            </p>
            <ul className="space-y-2 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-brand-magenta shrink-0" />
                <span>Contrôle technique gratuit des fichiers (300 DPI, CMJN, 2 mm bord perdu)</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck size={14} className="text-brand-magenta shrink-0" />
                <span>Livraison en 1 à 3 jours ouvrables après production</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-brand-magenta shrink-0" />
                <span>Joignable du lundi au samedi, de 8 h à 18 h</span>
              </li>
            </ul>
          </div>

          {/* Strong Conversion Callout */}
          <div className="rounded-2xl bg-gradient-to-br from-[#231048] to-[#130829] border border-brand-orange/35 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-orange">
                Réponse sous 24h ouvrées
              </span>
              <h3 className="font-montserrat font-bold text-2xl text-white">
                Besoin d&apos;un chiffrage précis ou d&apos;un conseil papier ?
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                Consultez nos tarifs directs sur le catalogue, ou envoyez votre demande de devis pré-remplie pour {data.city}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={devisBase}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition ${accent.cta}`}
              >
                {data.ctaSecondaryLabel}
              </Link>
              <Link
                href="/impression"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold uppercase tracking-wider text-white transition"
              >
                {data.ctaPrimaryLabel}
              </Link>
              <Link
                href="/contact"
                className="px-5 py-3 rounded-full bg-transparent hover:bg-white/10 border border-white/15 text-xs font-semibold text-white/90 transition"
              >
                Contacter Art Vision
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== G. FAQ LOCALE ==================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-magenta">
            Questions fréquentes • {data.city}
          </span>
          <h2 className="text-2xl sm:text-3xl font-montserrat font-extrabold text-white">
            Foire aux questions impression {data.preposition}
          </h2>
        </div>

        <div className="space-y-3.5">
          {data.faqs.map((faq) => (
            <details
              key={faq.question}
              className="group glassmorphism rounded-2xl border border-brand-purple/20 p-5 open:border-brand-magenta/40 transition"
            >
              <summary className="list-none cursor-pointer font-montserrat font-semibold text-sm sm:text-base text-white flex items-start justify-between gap-3">
                <span className="flex items-start gap-2.5">
                  <HelpCircle size={18} className="text-brand-magenta shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </span>
                <span className="text-white/50 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="mt-3 pl-7 text-xs sm:text-sm text-white/75 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ==================== H. CTA FINAL & CONTACT DIRECT ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#1f0e3d] via-[#2b124c] to-[#1a0c35] border border-brand-orange/35 p-8 sm:p-12 text-center space-y-5">
          <h2 className="font-montserrat font-extrabold text-2xl sm:text-4xl text-white">
            {data.finalCtaTitle}
          </h2>
          <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto">
            {data.finalCtaSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-3.5 pt-2">
            <Link
              href={devisBase}
              className={`px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition ${accent.cta}`}
            >
              Demander mon devis pour {data.city}
            </Link>
            <Link
              href="/impression"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition"
            >
              Comparer les formats et tarifs
            </Link>
            <a
              href="https://wa.me/32490224905"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-200 transition inline-flex items-center gap-2"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
          </div>
          <div className="pt-4 flex flex-wrap justify-center gap-6 text-xs text-white/70">
            <a href="tel:+32490224905" className="inline-flex items-center gap-1.5 hover:text-white transition">
              <Phone size={13} className="text-brand-magenta" />
              <span>+32 490 22 49 05</span>
            </a>
            <a href="mailto:contact@art-visions.fr" className="inline-flex items-center gap-1.5 hover:text-white transition">
              <Mail size={13} className="text-brand-orange" />
              <span>contact@art-visions.fr</span>
            </a>
            <Link href="/zones-desservies" className="inline-flex items-center gap-1.5 hover:text-white transition">
              <MapPin size={13} className="text-brand-purple" />
              <span>Voir toutes nos zones desservies</span>
            </Link>
          </div>
        </div>

        {/* Discreet Wikimedia Commons Attribution */}
        <p className="text-[11px] text-white/40 text-center">
          Photographie {data.city} :{" "}
          <a
            href={data.photo.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/70"
          >
            {data.photo.author}
          </a>{" "}
          — Licence{" "}
          {data.photo.licenseUrl ? (
            <a
              href={data.photo.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/70"
            >
              {data.photo.license}
            </a>
          ) : (
            data.photo.license
          )}{" "}
          via Wikimedia Commons.
        </p>
      </section>

      {/* ==================== MOBILE STICKY QUICK ACTION BAR ==================== */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0a041a]/95 backdrop-blur-lg border-t border-brand-purple/30 px-3 py-2.5 flex items-center justify-between gap-2">
        <Link
          href="/impression"
          className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 text-center text-xs font-bold text-white"
        >
          Tarifs
        </Link>
        <Link
          href={devisBase}
          className="flex-[1.4] py-2.5 px-3 rounded-xl bg-brand-orange text-center text-xs font-bold text-white"
        >
          Devis {data.city}
        </Link>
        <a
          href="https://wa.me/32490224905"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter Art Vision sur WhatsApp"
          className="py-2.5 px-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/35 text-emerald-300 text-xs font-bold"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
