import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  FileText,
  Mail,
  Phone,
  Printer,
  Truck,
  MessageCircle,
  Sparkles,
  CreditCard,
  QrCode,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import catalog from "@/data/impression-catalog.json";
import products from "@/data/impression-products.json";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqAccordion from "@/components/seo/FaqAccordion";

type PriceRow = { format: string; dimension: string; prices: Record<string, string | null> };
type PriceCategory = { id: string; title: string; name: string; quantities: string[]; rows: PriceRow[] };
type ProductData = {
  title: string;
  source: string;
  scrapedAt: string;
  fileGuidelines: {
    acceptedFormats: string[];
    quality: string;
    bleed: string;
    technicalCheck: string;
    production: string;
    shipping: string;
    express: string;
  };
  categories: PriceCategory[];
};

const productData = products as Record<string, ProductData>;

// Mapping aliases: singular requested SEO URLs -> catalog data keys
const ALIAS_MAP: Record<
  string,
  {
    catalogSlug: string;
    canonicalSlug: string;
    label: string;
    h1: string;
    intro: string;
    faqs?: { question: string; answer: string }[];
  }
> = {
  "carte-de-visite": {
    catalogSlug: "cartes-de-visite",
    canonicalSlug: "carte-de-visite",
    label: "Cartes de Visite Professionnelles",
    h1: "Impression de Carte de Visite Professionnelle & Personnalisée",
    intro:
      "Faites une première impression marquante. Impression haute fidélité sur papier 350g ou 400g couché, finitions luxe (pelliculage Soft Touch, vernis sélectif 3D, dorure) au format standard 85×55 mm.",
    faqs: [
      {
        question: "Quel papier choisir pour une carte de visite professionnelle ?",
        answer:
          "Le papier 350g couché demi-mat est le standard de référence pour un équilibre parfait entre rigidité et élégance. Pour un toucher ultra-luxueux, optez pour le 400g avec pelliculage Soft Touch (effet peau de pêche).",
      },
      {
        question: "Quel format respecter pour l'impression en France ?",
        answer:
          "Le format carte bancaire standard en France et en Europe est de 85 × 55 mm. Prévoyez 2 mm de fond perdu tout autour (fichier fourni à 89 × 59 mm) et conservez vos textes à 3 mm du bord de coupe.",
      },
      {
        question: "Puis-je commander une impression après avoir créé ma maquette sur votre outil gratuit ?",
        answer:
          "Oui, absolument ! Exportez votre maquette ou PDF haute définition depuis notre générateur gratuit de carte de visite, puis transmettez-la à notre atelier. Nos graphistes effectuent un contrôle PAO gratuit avant lancement.",
      },
    ],
  },
  "cartes-de-visite": {
    catalogSlug: "cartes-de-visite",
    canonicalSlug: "carte-de-visite",
    label: "Cartes de Visite Professionnelles",
    h1: "Impression de Cartes de Visite Professionnelles",
    intro:
      "Impression de cartes de visite de haute qualité. Formats 85×55 mm, papiers 350g/400g, finitions vernis 3D et dorure avec contrôle PAO inclus.",
  },
  flyer: {
    catalogSlug: "flyers",
    canonicalSlug: "flyer",
    label: "Flyers & Prospectus Publicitaires",
    h1: "Impression de Flyers Publicitaires au Meilleur Prix",
    intro:
      "Communiquez massivement avec des flyers A6, A5 ou A4 sur papier 135g à 300g couché brillant ou mat. Contrôle PAO gratuit et livraison express partout en France.",
    faqs: [
      {
        question: "Quel grammage choisir pour un flyer ?",
        answer:
          "Le 135g couché brillant est idéal pour la distribution en boîte aux lettres ou le street-marketing économique. Le 170g apporte plus de tenue en présentoir, et le 250g/300g est parfait pour des tracts publicitaires haut de gamme.",
      },
      {
        question: "Quels sont les délais de livraison pour les flyers ?",
        answer:
          "La production standard est de 2 à 3 jours ouvrables après validation du BAT, suivie d'une expédition sous 24 à 48h.",
      },
    ],
  },
  affiche: {
    catalogSlug: "affiches",
    canonicalSlug: "affiche",
    label: "Affiches & Posters Publicitaires",
    h1: "Impression d'Affiches Publicitaires Haute Définition",
    intro:
      "Impression d'affiches intérieures et extérieures en formats A3, A2, A1 et A0. Rendu couleur éclatant et papier résistant 135g à 250g.",
  },
  brochure: {
    catalogSlug: "brochures",
    canonicalSlug: "brochure",
    label: "Brochures & Plaquettes d'Entreprise",
    h1: "Impression de Brochures et Plaquettes Commerciales",
    intro:
      "Présentez vos services avec des brochures reliées par piqûre à cheval ou dos carré collé. Papiers de 135g à 250g avec couverture pelliculée.",
  },
  depliant: {
    catalogSlug: "depliants",
    canonicalSlug: "depliant",
    label: "Dépliants Publicitaires 2 & 3 Volets",
    h1: "Impression de Dépliants Publicitaires 2 ou 3 Volets",
    intro:
      "Dépliants A4 ou A5 avec pli simple, pli roulé ou pli accordéon. Idéal pour menus de restaurant, fiches techniques et plaquettes d'offres.",
  },
  catalogue: {
    catalogSlug: "brochures",
    canonicalSlug: "catalogue",
    label: "Catalogues Produits & Magalogs",
    h1: "Impression de Catalogues Produits Multi-Pages",
    intro:
      "Catalogues d'entreprise multi-pages haute pagination. Façonnage robuste, couleurs fidèles et finitions soignées pour sublimer vos collections.",
  },
  bache: {
    catalogSlug: "baches",
    canonicalSlug: "bache",
    label: "Bâches & Banderoles Publicitaires",
    h1: "Impression de Bâches & Banderoles avec Œillets",
    intro:
      "Bâches publicitaires résistantes aux intempéries (PVC 500g ou micro-perforé Mesh). Œillets de fixation en laiton renforcé tous les 50 cm inclus.",
  },
  panneau: {
    catalogSlug: "panneaux",
    canonicalSlug: "panneau",
    label: "Panneaux Publicitaires & Signalétique",
    h1: "Impression de Panneaux Publicitaires Akilux & Alu Dibond",
    intro:
      "Panneaux de chantier légers en polypropylène alvéolaire Akilux, panneaux rigides PVC Forex ou plaques de façade en Alu Dibond inaltérables.",
  },
  "roll-up": {
    catalogSlug: "roll-up",
    canonicalSlug: "roll-up",
    label: "Roll-Up & Kakemonos Enrouleurs",
    h1: "Impression de Roll-Up Publicitaire & Totem Enrouleur",
    intro:
      "Structure aluminium légère avec housse de transport rembourrée. Toile anti-reflet et anti-incurvation pour vos salons, foires et événements.",
  },
  kakemono: {
    catalogSlug: "roll-up",
    canonicalSlug: "kakemono",
    label: "Kakemonos Publicitaires & Bannières Suspendues",
    h1: "Impression de Kakemonos & Bannières Événementielles",
    intro:
      "Supports verticaux élégants suspendus ou autoportants pour points de vente, salons professionnels et showrooms d'entreprise.",
  },
};

function resolveSlug(slug: string) {
  const alias = ALIAS_MAP[slug];
  const catalogSlug = alias ? alias.catalogSlug : slug;
  const product = catalog.products.find((item) => item.slug === catalogSlug);
  const data = productData[catalogSlug];
  return { alias, product, data, effectiveSlug: catalogSlug };
}

export function generateStaticParams() {
  const fromCatalog = catalog.products.map((p) => ({ slug: p.slug }));
  const fromAliases = Object.keys(ALIAS_MAP).map((slug) => ({ slug }));
  return [...fromCatalog, ...fromAliases];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { alias, product, data } = resolveSlug(slug);
  if (!product || !data) return {};

  const title = alias
    ? `${alias.label} | Tarifs Impression Art Vision`
    : `${product.label} personnalisés | Tarifs impression Art Vision`;
  const description = alias
    ? `${alias.intro.slice(0, 155)}... Découvrez nos tarifs dégressifs et configurez votre devis en ligne.`
    : `Tables de prix pour ${product.label.toLowerCase()} : formats, dimensions, quantités, fichiers 300 DPI CMJN et demande de devis Art Vision.`;
  const canonicalSlug = alias ? alias.canonicalSlug : slug;

  return {
    title,
    description,
    alternates: { canonical: `https://art-visions.fr/impression/${canonicalSlug}` },
    openGraph: {
      title,
      description,
      url: `https://art-visions.fr/impression/${canonicalSlug}`,
      type: "website",
      images: [{ url: "https://art-visions.fr/logo.png" }],
    },
  };
}

function priceNumber(price: string | null) {
  if (!price) return undefined;
  const parsed = Number(price.replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function schemaFor(slug: string, label: string, data: ProductData, canonicalSlug: string) {
  const offers = data.categories.flatMap((category) =>
    category.rows.flatMap((row) =>
      category.quantities.map((quantity) => {
        const price = priceNumber(row.prices[quantity]);
        return price
          ? {
              "@type": "Offer",
              name: `${category.name} - ${row.format} - ${quantity} ex.`,
              price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url: `https://art-visions.fr/impression/${canonicalSlug}#${category.id}`,
            }
          : null;
      })
    )
  ).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Impression ${label}`,
    provider: { "@type": "Organization", name: "Art Vision", url: "https://art-visions.fr" },
    serviceType: `Impression ${label}`,
    areaServed: ["France", "Belgique"],
    offers,
  };
}

function PriceTable({ category, slug }: { category: PriceCategory; slug: string }) {
  const waNum = "32490224905";
  return (
    <section id={category.id} className="scroll-mt-28 rounded-xl border border-brand-purple/15 bg-[#1A1238]/40 shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-brand-purple/20 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">Tarifs Dégressifs</p>
          <h2 className="mt-1 text-xl font-bold text-white font-montserrat">{category.title}</h2>
        </div>
        <Link
          href={`/devis-sur-mesure?prefill=impression&product=${encodeURIComponent(slug)}&paper=${encodeURIComponent(category.name)}`}
          className="inline-flex items-center gap-2 rounded-full bg-brand-orange hover:bg-brand-orange/95 text-white px-5 py-2.5 text-sm font-semibold transition-all shadow-md shadow-brand-orange/20"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Quantité personnalisée
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <caption className="sr-only">Prix hors TVA pour {category.title}</caption>
          <thead>
            <tr className="bg-brand-purple/40 text-white">
              <th scope="col" className="w-[30%] px-4 py-3 font-bold">Format</th>
              {category.quantities.map((quantity) => (
                <th key={quantity} scope="col" className="px-4 py-3 text-center font-bold tabular-nums">{quantity}</th>
              ))}
              <th scope="col" className="px-4 py-3 text-center font-bold">Devis</th>
            </tr>
          </thead>
          <tbody>
            {category.rows.map((row, index) => {
              const waMsg = encodeURIComponent(`Bonjour, je souhaite un devis pour impression ${slug} - ${row.format} (${row.dimension})`);
              return (
                <tr key={`${category.id}-${row.format}-${index}`} className={index % 2 === 0 ? "bg-white/5" : "bg-white/10"}>
                  <th scope="row" className="border-t border-brand-purple/10 px-4 py-3 font-semibold text-white">
                    <span className="block text-brand-magenta">{row.format}</span>
                    <span className="block text-xs font-normal text-white/50">{row.dimension}</span>
                  </th>
                  {category.quantities.map((quantity) => (
                    <td key={quantity} className="border-t border-brand-purple/10 px-4 py-3 text-center font-bold tabular-nums text-white">
                      {row.prices[quantity] ?? "-"}
                    </td>
                  ))}
                  <td className="border-t border-brand-purple/10 px-4 py-3 text-center">
                    <a
                      href={`https://wa.me/${waNum}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Devis WhatsApp pour ${row.format}`}
                      className="inline-flex items-center gap-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full transition"
                    >
                      <MessageCircle size={12} />
                      Devis
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-brand-purple/20 px-4 py-3 text-xs font-semibold text-white/50 sm:px-6">
        Tous les prix sont affichés hors TVA. Frais de port calculés à la validation du devis.
      </p>
    </section>
  );
}

export default async function ImpressionProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { alias, product, data } = resolveSlug(slug);

  if (!product || !data) notFound();

  const label = alias?.label || product.label;
  const heading = alias?.h1 || `Impression ${product.label}`;
  const introText = alias?.intro || `Découvrez nos tarifs d'impression professionnelle pour vos ${product.label.toLowerCase()}. Finition soignée, respect des normes PAO et livraison suivie.`;
  const canonicalSlug = alias?.canonicalSlug || slug;
  const isBusinessCard = canonicalSlug === "carte-de-visite";

  return (
    <div className="relative hero-gradient min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFor(slug, label, data, canonicalSlug)) }}
      />

      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,43,217,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,43,217,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <Breadcrumbs
            items={[
              { name: "Impression", url: "/impression" },
              { name: label },
            ]}
          />

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-purple/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wide border border-brand-purple/30 text-brand-magenta">
                <Printer size={15} aria-hidden="true" />
                <span>Atelier Impression Professionnelle</span>
              </div>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl text-white font-montserrat">
                {heading}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/75">
                {introText}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/devis-sur-mesure?prefill=impression&product=${encodeURIComponent(label)}`}
                  className="bg-brand-orange hover:bg-brand-orange/95 text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-brand-orange/20"
                >
                  Demander un devis immédiat
                </Link>
                {isBusinessCard && (
                  <Link
                    href="/outils-gratuits/carte-de-visite-gratuite"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5"
                  >
                    <Sparkles size={14} className="text-brand-magenta" />
                    Créer ma maquette gratuite
                  </Link>
                )}
              </div>
            </div>

            <div className="glassmorphism rounded-2xl p-6 border border-brand-purple/15 space-y-4">
              <h2 className="text-lg font-bold text-white font-montserrat flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-400" />
                <span>Conformité Fichiers & Délais</span>
              </h2>
              <dl className="grid gap-3 text-xs sm:text-sm">
                <div className="flex gap-3">
                  <FileText className="mt-0.5 shrink-0 text-brand-magenta" size={16} aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">Formats acceptés</dt>
                    <dd className="text-white/60">{data.fileGuidelines.acceptedFormats.join(", ")}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-brand-magenta" size={16} aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">Contrôle PAO</dt>
                    <dd className="text-white/60">300 DPI, couleurs CMJN, 2 mm de fond perdu, textes vectorisés.</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Truck className="mt-0.5 shrink-0 text-brand-magenta" size={16} aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">Délais réels</dt>
                    <dd className="text-white/60">{data.fileGuidelines.production} (Livraison suivie : {data.fileGuidelines.shipping})</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Tables */}
      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 space-y-12">
        {/* Funnel Banner for Business Cards */}
        {isBusinessCard && (
          <div className="bg-gradient-to-r from-brand-purple/40 via-brand-magenta/30 to-brand-orange/20 border border-brand-magenta/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Outil en ligne gratuit</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-montserrat text-white">
                Pas encore de maquette prête pour l'imprimeur ?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
                Utilisez notre générateur de carte de visite gratuit avec QR code vCard intégré pour concevoir votre fichier au gabarit exact (85×55 mm), puis confiez-nous son impression.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/outils-gratuits/carte-de-visite-gratuite"
                className="bg-brand-magenta hover:bg-brand-magenta/90 text-white px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-1.5"
              >
                <CreditCard size={14} />
                Créer ma carte gratuite
              </Link>
              <Link
                href="/outils-gratuits/generateur-qr-code"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5"
              >
                <QrCode size={14} />
                Générer un QR Code
              </Link>
            </div>
          </div>
        )}

        {/* Quick Access Nav */}
        {data.categories.length > 0 && (
          <nav aria-label={`Catégories ${label}`} className="rounded-xl border border-brand-purple/15 bg-[#1A1238]/40 p-5 shadow-sm">
            <p className="text-sm font-bold text-white">Grammages et finitions disponibles :</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.categories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="rounded-full border border-brand-purple/20 bg-brand-purple/10 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-brand-magenta/40 hover:text-brand-magenta hover:bg-brand-magenta/10"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* Price Tables */}
        {data.categories.length > 0 ? (
          <div className="space-y-10">
            {data.categories.map((category) => (
              <PriceTable key={category.id} category={category} slug={canonicalSlug} />
            ))}
          </div>
        ) : (
          <section className="glassmorphism rounded-2xl p-8 border border-brand-purple/15">
            <h2 className="text-2xl font-bold text-white font-montserrat">Tarification sur-mesure</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Pour ce produit grand format ou cette configuration spéciale, notre atelier calcule votre devis personnalisé en fonction du métrage exact, des œillets et du mode de livraison.
            </p>
            <Link
              href={`/devis-sur-mesure?prefill=impression&product=${encodeURIComponent(label)}`}
              className="mt-5 inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md shadow-brand-orange/20"
            >
              <span>Demander une estimation personnalisée</span>
              <ChevronRight size={16} />
            </Link>
          </section>
        )}

        {/* FAQ Accordion */}
        {alias?.faqs && alias.faqs.length > 0 && (
          <FaqAccordion
            title={`Questions Fréquentes — ${label}`}
            items={alias.faqs}
          />
        )}

        {/* Cross-linking to related print products */}
        <section className="pt-10 border-t border-brand-purple/15 space-y-4 text-left">
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-brand-magenta">Autres supports imprimés recommandés</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Cartes de visite", href: "/impression/carte-de-visite" },
              { label: "Flyers", href: "/impression/flyer" },
              { label: "Affiches", href: "/impression/affiche" },
              { label: "Dépliants", href: "/impression/depliant" },
              { label: "Brochures", href: "/impression/brochure" },
              { label: "Bâches publicitaires", href: "/impression/bache" },
              { label: "Panneaux signalétiques", href: "/impression/panneau" },
              { label: "Roll-up", href: "/impression/roll-up" },
              { label: "Impression pas cher", href: "/impression-pas-cher" },
              { label: "Impression rapide", href: "/impression-rapide" },
            ]
              .filter((item) => item.href !== `/impression/${canonicalSlug}`)
              .map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="text-xs bg-[#1A1238]/60 border border-brand-purple/20 px-3.5 py-1.5 rounded-full hover:border-brand-magenta hover:text-white transition text-white/80"
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="glassmorphism rounded-3xl p-8 md:p-10 border border-brand-magenta/30 text-center space-y-6">
          <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-white">
            Besoin d'un accompagnement pour vos {label.toLowerCase()} ?
          </h3>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            Vérification de vos repères de coupe, conseil sur les finitions pelliculées et livraison sous emballage renforcé.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/devis-sur-mesure?prefill=impression&product=${encodeURIComponent(label)}`}
              className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-brand-orange/20"
            >
              Demander mon devis gratuit
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition"
            >
              Contacter un conseiller
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
