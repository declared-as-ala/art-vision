import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, FileText, Mail, Phone, Printer, Truck, MessageCircle } from "lucide-react";
import catalog from "@/data/impression-catalog.json";
import products from "@/data/impression-products.json";

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

export function generateStaticParams() {
  return catalog.products.filter((product) => product.slug !== "flyers").map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = catalog.products.find((item) => item.slug === slug);
  if (!product) return {};
  return {
    title: `${product.label} personnalisés | Tarifs impression Art Vision`,
    description: `Tables de prix pour ${product.label.toLowerCase()} : formats, dimensions, quantités, fichiers 300 DPI CMJN et demande de devis Art Vision.`,
    alternates: { canonical: `/impression/${slug}` },
  };
}

function priceNumber(price: string | null) {
  if (!price) return undefined;
  const parsed = Number(price.replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function schemaFor(slug: string, product: { label: string }, data: ProductData) {
  const offers = data.categories.flatMap((category) =>
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
              url: `https://art-visions.fr/impression/${slug}#${category.id}`,
            }
          : null;
      })
    )
  ).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Impression ${product.label}`,
    provider: { "@type": "Organization", name: "Art Vision", url: "https://art-visions.fr" },
    serviceType: `Impression ${product.label}`,
    offers,
  };
}

function PriceTable({ category, slug }: { category: PriceCategory; slug: string }) {
  const waNum = "21655804227";
  return (
    <section id={category.id} className="scroll-mt-28 rounded-xl border border-brand-purple/15 bg-[#1A1238]/40 shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-brand-purple/20 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-magenta">Tarifs</p>
          <h2 className="mt-1 text-xl font-bold text-white font-sora">{category.title}</h2>
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
              const waMsg = encodeURIComponent(`Bonjour, je souhaite un devis pour ${slug} - ${row.format} (${row.dimension})`);
              return (
                <tr key={`${category.id}-${row.format}-${index}`} className={index % 2 === 0 ? "bg-white/5" : "bg-white/10"}>
                  <th scope="row" className="border-t border-brand-purple/10 px-4 py-3 font-semibold text-white">
                    <span className="block text-brand-magenta">{row.format}</span>
                    <span className="block text-xs font-normal text-white/50">{row.dimension}</span>
                  </th>
                  {category.quantities.map((quantity) => (
                    <td key={quantity} className="border-t border-brand-purple/10 px-4 py-3 text-center font-bold tabular-nums text-white">{row.prices[quantity] ?? "-"}</td>
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
      <p className="border-t border-brand-purple/20 px-4 py-3 text-xs font-semibold text-white/50 sm:px-6">Tous les prix sont affichés hors TVA.</p>
    </section>
  );
}

export default async function ImpressionProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = catalog.products.find((item) => item.slug === slug);
  const data = productData[slug];
  if (!product || !data) notFound();

  const totalRows = data.categories.reduce((total, category) => total + category.rows.length, 0);

  return (
    <div className="relative hero-gradient min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFor(slug, product, data)) }} />

      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,43,217,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,43,217,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/impression" className="text-sm font-semibold text-brand-magenta underline underline-offset-4 hover:text-white inline-flex items-center gap-1">
            <ChevronRight size={14} className="rotate-180" />
            Retour au catalogue impression
          </Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-purple/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wide border border-brand-purple/30 text-brand-magenta">
                <Printer size={15} aria-hidden="true" />
                Tarifs impression
              </div>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl text-white font-sora">{product.label}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">Tables de prix scrapées depuis la page source actuelle, réorganisées dans le design Art Vision avec accès rapide par grammage et format.</p>
            </div>
            <div className="glassmorphism rounded-xl p-6 border border-brand-purple/15">
              <h2 className="text-lg font-bold text-white font-sora">Fichiers et délais</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex gap-3"><FileText className="mt-0.5 shrink-0 text-brand-magenta" size={18} aria-hidden="true" /><div><dt className="font-semibold text-white">Formats acceptés</dt><dd className="text-white/60">{data.fileGuidelines.acceptedFormats.join(", ")}</dd></div></div>
                <div className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-brand-magenta" size={18} aria-hidden="true" /><div><dt className="font-semibold text-white">Qualité</dt><dd className="text-white/60">300 DPI, couleurs CMJN, textes vectorisés pour EPS et AI.</dd></div></div>
                <div className="flex gap-3"><Truck className="mt-0.5 shrink-0 text-brand-magenta" size={18} aria-hidden="true" /><div><dt className="font-semibold text-white">Production</dt><dd className="text-white/60">{data.fileGuidelines.production} Livraison : {data.fileGuidelines.shipping}</dd></div></div>
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
            <p className="text-3xl font-extrabold text-brand-magenta">{data.categories.length}</p>
            <p className="text-sm font-semibold text-white/60">tables de prix</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-brand-magenta">{totalRows}</p>
            <p className="text-sm font-semibold text-white/60">formats scrapés</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-brand-magenta">HT</p>
            <p className="text-sm font-semibold text-white/60">prix hors TVA</p>
          </div>
        </section>

        {data.categories.length > 0 ? (
          <>
            {/* Quick Access Nav */}
            <nav aria-label={`Catégories ${product.label}`} className="mt-8 rounded-xl border border-brand-purple/15 bg-[#1A1238]/40 p-5 shadow-sm">
              <p className="text-sm font-bold text-white">Accès rapide</p>
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

            {/* Price Tables */}
            <div className="mt-10 space-y-10">
              {data.categories.map((category) => (
                <PriceTable key={category.id} category={category} slug={slug} />
              ))}
            </div>
          </>
        ) : (
          <section className="mt-10 glassmorphism rounded-2xl p-8 border border-brand-purple/15">
            <h2 className="text-2xl font-bold text-white font-sora">Tarif sur devis</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">Cette catégorie ne publie pas de table de prix standard dans la page source. Envoyez-nous votre format, quantité et fichier pour une estimation.</p>
            <Link
              href={`/devis-sur-mesure?prefill=impression&product=${encodeURIComponent(product.label)}`}
              className="mt-5 inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md shadow-brand-orange/20"
            >
              Demander un devis
              <ChevronRight size={16} />
            </Link>
          </section>
        )}

        {/* Final CTA */}
        <section className="mt-10 glassmorphism rounded-2xl p-8 border border-brand-magenta/20 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white font-sora">Une question ? Un devis {product.label.toLowerCase()} ?</h2>
            <p className="mt-2 text-sm text-white/70">Contactez Art Vision pour vérifier votre fichier ou adapter une quantité.</p>
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
            href={`/devis-sur-mesure?prefill=impression&product=${encodeURIComponent(product.label)}`}
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
