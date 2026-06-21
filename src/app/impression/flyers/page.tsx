import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronRight, FileText, Mail, Phone, Printer, Truck, MessageCircle } from "lucide-react";
import flyerPricing from "@/data/flyer-pricing.json";

type FlyerRow = {
  format: string;
  dimension: string;
  prices: Record<string, string | null>;
};

type FlyerCategory = {
  id: string;
  title: string;
  name: string;
  quantities: string[];
  rows: FlyerRow[];
};

const categories = flyerPricing.categories as FlyerCategory[];
const faqItems = [
  {
    question: "Quels fichiers sont acceptés pour l'impression de flyers ?",
    answer: "Nous acceptons les fichiers PDF, JPG, TIF, EPS, AI et BMP. Les textes des fichiers EPS et AI doivent être vectorisés.",
  },
  {
    question: "Quelle qualité faut-il prévoir ?",
    answer: "Les fichiers doivent idéalement être en 300 DPI et en couleurs CMJN pour limiter les écarts de rendu à l'impression.",
  },
  {
    question: "Quels sont les délais de production ?",
    answer: "Le délai standard est de 2 jours ouvrables. Les vernis et pelliculages ajoutent généralement 2 jours ouvrables. La livraison prend 1 à 3 jours ouvrables.",
  },
  {
    question: "Faut-il ajouter des bords perdus ?",
    answer: "Oui. Prévoyez idéalement 2 mm de bord perdu et placez les textes à au moins 3 mm de chaque bord.",
  },
  {
    question: "Les prix affichés incluent-ils la TVA ?",
    answer: "Non. Les prix de chaque tableau sont affichés hors TVA.",
  },
];

export const metadata: Metadata = {
  title: "Impression flyers personnalisés | Tarifs flyers Art Vision",
  description:
    "Impression de flyers recto verso : tarifs par papier, formats A7, A6, A5, A4, carrés et ronds, fichiers 300 DPI CMJN, production rapide et devis sur mesure.",
  alternates: {
    canonical: "/impression/flyers",
  },
  openGraph: {
    title: "Impression flyers personnalisés | Art Vision",
    description:
      "Comparez les prix d'impression de flyers par grammage, format et quantité. Tables de prix HT et demande de devis rapide.",
    url: "/impression/flyers",
    type: "website",
  },
};

function priceNumber(price: string | null) {
  if (!price) return undefined;
  const parsed = Number(price.replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildSchema() {
  const offers = categories.flatMap((category) =>
    category.rows.flatMap((row) =>
      category.quantities.map((quantity) => {
        const price = priceNumber(row.prices[quantity]);
        return price
          ? {
              "@type": "Offer",
              name: `${category.name} - ${row.format} - ${quantity}`,
              price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url: `https://art-visions.fr/impression/flyers#${category.id}`,
              itemOffered: {
                "@type": "Service",
                name: `Impression flyer ${row.format}`,
                description: `${row.dimension}, ${category.name}, ${quantity}`,
              },
            }
          : null;
      })
    )
  ).filter(Boolean);

  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Impression flyers personnalisés",
      provider: {
        "@type": "Organization",
        name: "Art Vision",
        url: "https://art-visions.fr",
      },
      areaServed: ["France", "Belgique", "Tunisie"],
      serviceType: "Impression de flyers recto verso",
      offers,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}

function CategoryTable({ category }: { category: FlyerCategory }) {
  const waNum = "21655804227";
  return (
    <section id={category.id} className="scroll-mt-28 rounded-xl border border-brand-purple/15 bg-[#1A1238]/40 shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-brand-purple/20 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">Tarifs recto / verso</p>
          <h2 className="mt-1 text-xl font-bold text-white font-sora">{category.title}</h2>
        </div>
        <Link
          href={`/devis-sur-mesure?prefill=flyers&paper=${encodeURIComponent(category.name)}`}
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
                <th key={quantity} scope="col" className="px-4 py-3 text-center font-bold tabular-nums">
                  {quantity}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-center font-bold">Devis</th>
            </tr>
          </thead>
          <tbody>
            {category.rows.map((row, index) => {
              const waMsg = encodeURIComponent(`Bonjour, je souhaite un devis pour flyers - ${row.format} (${row.dimension}) - ${category.name}`);
              return (
                <tr key={`${category.id}-${row.format}`} className={index % 2 === 0 ? "bg-white/5" : "bg-white/10"}>
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
        Tous les prix sont affichés hors TVA.
      </p>
    </section>
  );
}

export default function ImpressionFlyersPage() {
  const schema = buildSchema();
  const totalRows = categories.reduce((count, category) => count + category.rows.length, 0);

  return (
    <div className="relative hero-gradient min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,43,217,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,43,217,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-purple/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wide border border-brand-purple/30 text-brand-magenta">
                <Printer size={15} aria-hidden="true" />
                Impression flyers
              </div>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl text-white font-sora">
                Impression flyers personnalisés, prix par grammage et format
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
                Retrouvez les tarifs d'impression de flyers recto verso par papier, format et quantité. Les tableaux ci-dessous reprennent les catégories et structures de prix scrapées depuis la page source actuelle.
              </p>
            </div>
            <div className="glassmorphism rounded-xl p-6 border border-brand-purple/15">
              <h2 className="text-lg font-bold text-white font-sora">Fichiers et délais</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex gap-3"><FileText className="mt-0.5 shrink-0 text-brand-magenta" size={18} aria-hidden="true" /><div><dt className="font-semibold text-white">Formats acceptés</dt><dd className="text-white/60">{flyerPricing.fileGuidelines.acceptedFormats.join(", ")}</dd></div></div>
                <div className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-brand-magenta" size={18} aria-hidden="true" /><div><dt className="font-semibold text-white">Qualité</dt><dd className="text-white/60">300 DPI, couleurs CMJN, textes vectorisés pour EPS et AI.</dd></div></div>
                <div className="flex gap-3"><Truck className="mt-0.5 shrink-0 text-brand-magenta" size={18} aria-hidden="true" /><div><dt className="font-semibold text-white">Production et livraison</dt><dd className="text-white/60">2 jours ouvrables + 1 à 3 jours de livraison. Vernis ou pelliculage : + 2 jours.</dd></div></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Stats */}
        <section className="grid gap-4 rounded-xl border border-brand-purple/15 bg-[#1A1238]/40 p-5 shadow-sm md:grid-cols-3">
          <div>
            <p className="text-3xl font-extrabold text-brand-magenta">{categories.length}</p>
            <p className="text-sm font-semibold text-white/60">catégories papier</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-brand-magenta">{totalRows}</p>
            <p className="text-sm font-semibold text-white/60">lignes de tarifs scrapées</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-brand-magenta">HT</p>
            <p className="text-sm font-semibold text-white/60">prix affichés hors TVA</p>
          </div>
        </section>

        {/* Quick Access */}
        <nav aria-label="Catégories de flyers" className="mt-8 rounded-xl border border-brand-purple/15 bg-[#1A1238]/40 p-5 shadow-sm">
          <p className="text-sm font-bold text-white">Accès rapide aux grammages</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
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

        {/* Guidelines */}
        <section className="mt-8 rounded-xl border border-brand-purple/15 bg-[#1A1238]/40 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-white font-sora">Consignes de préparation des fichiers</h2>
          <div className="mt-4 grid gap-4 text-sm leading-6 text-white/70 md:grid-cols-2">
            <p>Préparez vos fichiers en PDF, JPG, TIF, EPS, AI ou BMP. Pour les fichiers vectoriels EPS et AI, vectorisez les textes afin d'éviter les substitutions de polices.</p>
            <p>Prévoyez un bord perdu de 2 mm et gardez les textes à 3 mm minimum des bords. Les fichiers sont vérifiés techniquement avant impression.</p>
          </div>
        </section>

        {/* Price Tables */}
        <div className="mt-10 space-y-10">
          {categories.map((category) => (
            <CategoryTable key={category.id} category={category} />
          ))}
        </div>

        {/* FAQ */}
        <section className="mt-14 rounded-xl border border-brand-purple/15 bg-[#1A1238]/40 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-white font-sora">FAQ impression flyers</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqItems.map((item) => (
              <article key={item.question} className="glassmorphism rounded-xl p-5 border border-brand-purple/15">
                <h3 className="font-bold text-white">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-10 glassmorphism rounded-2xl p-8 border border-brand-magenta/20 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white font-sora">Une question ? Un devis flyers sur mesure ?</h2>
            <p className="mt-2 text-sm text-white/70">Contactez Art Vision pour vérifier votre fichier, adapter une quantité ou préparer une commande spéciale.</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <a className="inline-flex items-center gap-2 text-brand-magenta hover:text-white transition" href="tel:+21655804227">
                <Phone size={16} aria-hidden="true" />
                +216 55 804 227
              </a>
              <a className="inline-flex items-center gap-2 text-brand-magenta hover:text-white transition" href="mailto:contact2artvision@gmail.com">
                <Mail size={16} aria-hidden="true" />
                contact2artvision@gmail.com
              </a>
            </div>
          </div>
          <Link
            href="/devis-sur-mesure?prefill=flyers"
            className="mt-6 inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md shadow-brand-orange/20 md:mt-0 shrink-0"
          >
            Demander un devis
            <ChevronRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  );
}
