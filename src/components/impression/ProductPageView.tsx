import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, FileText, MessageCircle, Printer, QrCode, Ruler, ShieldCheck, Truck } from "lucide-react";
import catalog from "@/data/impression-catalog.json";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FaqAccordion, { type FaqItem } from "@/components/seo/FaqAccordion";
import ProductGallery from "./ProductGallery";
import ProductConfigurator from "./ProductConfigurator";
import { resolveSlug, type PriceCategory, type PriceRow, type ProductData } from "@/lib/print-aliases";
import { buildCatalogue, explain, parseAmount, type Offer } from "@/lib/print-config";

const USAGES: Record<string, string[]> = {
  "cartes-de-visite": ["Vous présenter lors d'un rendez-vous, d'un salon ou d'un événement", "Accompagner un colis, une facture ou une commande", "Relayer votre site web ou un QR code"],
  flyers: ["Annoncer une offre, une ouverture ou un événement", "Distribuer en main propre ou en boîte aux lettres", "Poser sur un comptoir ou un présentoir"],
  depliants: ["Présenter une carte, une gamme ou des services", "Remettre un programme ou une plaquette d'information", "Détailler une offre sur plusieurs volets"],
  affiches: ["Promouvoir un événement ou une offre", "Informer à l'intérieur d'un commerce ou d'un établissement", "Afficher en vitrine ou sur un panneau d'affichage"],
  baches: ["Signaler un commerce, un chantier ou un événement", "Habiller une façade ou une clôture", "Communiquer en extérieur, de loin"],
  "roll-up": ["Habiller un stand ou un salon", "Mettre en avant une offre en point de vente", "Installer un message vertical rapidement et le transporter"],
  panneaux: ["Signalétique intérieure et extérieure", "Panneaux de chantier ou d'information", "Plaques de façade ou d'accueil"],
};

const RELATED = [
  { label: "Cartes de visite", href: "/impression/carte-de-visite", slug: "cartes-de-visite" },
  { label: "Flyers", href: "/impression/flyer", slug: "flyers" },
  { label: "Dépliants", href: "/impression/depliant", slug: "depliants" },
  { label: "Affiches", href: "/impression/affiche", slug: "affiches" },
  { label: "Roll-up", href: "/impression/roll-up", slug: "roll-up" },
  { label: "Bâches", href: "/impression/bache", slug: "baches" },
  { label: "Panneaux", href: "/impression/panneau", slug: "panneaux" },
  { label: "Brochures", href: "/impression/brochure", slug: "brochures" },
];

const strip = (s?: string) => (s ?? "").replace(/\.$/, "");

function schemaFor(label: string, data: ProductData, canonicalSlug: string, image?: string) {
  const offers = data.categories
    .flatMap((category) =>
      category.rows.flatMap((row) =>
        category.quantities.map((quantity) => {
          const price = row.prices[quantity] ? parseAmount(row.prices[quantity]!) : undefined;
          return price !== undefined
            ? {
                "@type": "Offer",
                name: `${category.name} - ${row.format} - ${/ex$/i.test(quantity) ? quantity.replace(/ ex$/i, " ex.") : quantity}`,
                price,
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: `https://art-visions.fr/impression/${canonicalSlug}#${category.id}`,
              }
            : null;
        })
      )
    )
    .filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Impression ${label}`,
    image: image ? `https://art-visions.fr${image}` : "https://art-visions.fr/logo.png",
    provider: { "@type": "Organization", name: "Art Vision", url: "https://art-visions.fr" },
    serviceType: `Impression ${label}`,
    areaServed: ["France", "Belgique"],
    offers,
  };
}

/** Complete price table (kept for reference and SEO) — each price opens the quote form with that configuration. */
function quoteHref(productLabel: string, category: PriceCategory, row: PriceRow, quantity: string, price: string | null) {
  const qs = new URLSearchParams({ prefill: "impression", product: productLabel, format: `${row.format} (${row.dimension})`, paper: category.name, src: "product-price-table" });
  const qty = quantity.replace(/\D+/g, "");
  if (/ex\.?$/i.test(quantity.trim()) && qty) qs.set("qty", qty);
  if (price) qs.set("price", `${price.replace(/\s+/g, " ").trim()} HT${/m²/.test(quantity) ? " / m²" : ""}`);
  return `/devis-sur-mesure?${qs.toString()}`;
}

function PriceTable({ category, slug, productLabel }: { category: PriceCategory; slug: string; productLabel: string }) {
  const waNum = "32490224905";
  return (
    <section id={category.id} className="scroll-mt-28 overflow-hidden rounded-xl border border-brand-purple/15 bg-[#1A1238]/40">
      <div className="border-b border-brand-purple/20 px-4 py-4 sm:px-6">
        <h3 className="text-base font-bold text-white font-montserrat">{category.title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">Prix hors TVA pour {category.title}</caption>
          <thead>
            <tr className="bg-brand-purple/40 text-white">
              <th scope="col" className="w-[30%] px-4 py-3 font-bold">Format</th>
              {category.quantities.map((q) => (<th key={q} scope="col" className="px-4 py-3 text-center font-bold tabular-nums">{q}</th>))}
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
                  {category.quantities.map((q) => (
                    <td key={q} className="border-t border-brand-purple/10 px-2 py-2 text-center font-bold tabular-nums text-white">
                      {row.prices[q] ? (
                        <Link href={quoteHref(productLabel, category, row, q, row.prices[q])} data-tracking="cta_click" title={`Demander un devis : ${row.format}, ${q}`} className="block rounded-lg px-2 py-2 transition hover:bg-brand-magenta/25">
                          {row.prices[q]}
                        </Link>
                      ) : "-"}
                    </td>
                  ))}
                  <td className="border-t border-brand-purple/10 px-4 py-3 text-center">
                    <a href={`https://wa.me/${waNum}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" aria-label={`Devis WhatsApp pour ${row.format}`} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/80 px-2.5 py-1.5 text-[10px] font-bold text-white transition hover:bg-emerald-600">
                      <MessageCircle size={12} /> Devis
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** One line per material: which grammages, finishes and printing sides really exist. */
function materialsSummary(offers: Offer[]) {
  const map = new Map<string, { grammages: Set<string>; finishes: Set<string>; sides: Set<string> }>();
  for (const o of offers) {
    const e = map.get(o.material) ?? { grammages: new Set(), finishes: new Set(), sides: new Set() };
    if (o.grammage) e.grammages.add(o.grammage);
    if (o.finish) e.finishes.add(o.finish);
    if (o.sides !== "unique") e.sides.add(o.sides === "recto" ? "recto" : "recto verso");
    map.set(o.material, e);
  }
  return [...map.entries()].map(([material, v]) => ({ material, grammages: [...v.grammages], finishes: [...v.finishes], sides: [...v.sides] }));
}

const shortIntro = (t: string) => {
  const first = t.split(/(?<=[.!?])\s+/)[0] ?? t;
  return first.length > 220 ? `${first.slice(0, 217)}…` : first;
};

export default function ProductPageView({ slug, extraFaqs }: { slug: string; extraFaqs?: FaqItem[] }) {
  const { alias, product, data } = resolveSlug(slug);
  if (!product || !data) notFound();

  const p = product as typeof product & { image?: string; alt?: string; intro?: string; startingPrice?: { display: string; unit?: string; isQuote?: boolean } };
  const label = alias?.label || p.label;
  const canonicalSlug = alias?.canonicalSlug || slug;
  const catalogSlug = p.slug;
  const heading = alias?.h1 || `Impression ${p.label}`;
  const intro = alias?.intro || p.intro || `Découvrez nos tarifs d'impression pour vos ${p.label.toLowerCase()}.`;
  const g = data.fileGuidelines;
  const { offers, perSquareMetre } = buildCatalogue(data.categories);
  const image = p.image || "/images/impression/01-affiches-art-vision.webp";
  const usages = USAGES[catalogSlug] ?? [];
  const mats = materialsSummary(offers);
  const isBusinessCard = catalogSlug === "cartes-de-visite";

  const faqs: FaqItem[] = [
    ...(alias?.faqs ?? []),
    ...(extraFaqs ?? []),
    { question: "Quels fichiers puis-je envoyer ?", answer: `Formats acceptés : ${g.acceptedFormats.join(", ")}. ${strip(g.quality)}. ${strip(g.bleed)}.` },
    { question: "Quels sont les délais de production et de livraison ?", answer: `Production : ${strip(g.production)}. Livraison : ${strip(g.shipping)}. ${strip(g.express)}.` },
    { question: "Les prix affichés sont-ils HT ?", answer: "Oui, tous les prix sont affichés hors TVA (HT). Les frais de port sont calculés à la validation du devis." },
    { question: "Mon fichier est-il vérifié avant impression ?", answer: "Oui : un contrôle technique du fichier (format, résolution, fond perdu) est réalisé gratuitement. Si le fichier demande des corrections, elles sont chiffrées sur devis avant tout travail. Une création graphique sur mesure est également possible sur devis." },
    { question: "Que faire si ma configuration n'est pas dans la grille ?", answer: "Demandez un devis : vos choix (format, papier, finition, quantité) sont conservés dans la demande et nous revenons vers vous avec un tarif." },
  ].filter((f, i, arr) => arr.findIndex((x) => x.question === f.question) === i);

  const anchors = [
    ["presentation", "Présentation"],
    ["papiers", "Papiers et finitions"],
    ["technique", "Fichier et gabarits"],
    ["livraison", "Fabrication et livraison"],
    ["faq", "Questions"],
    ["tarifs", "Tous les tarifs"],
  ];

  return (
    <div className="relative hero-gradient min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFor(label, data, canonicalSlug, p.image)) }} />

      {/* ───────── product block: image left, name + options + price right ───────── */}
      <section className="relative pt-28 pb-10 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Impression", url: "/impression" }, { name: label }]} />

          <div className="mt-5 grid gap-x-12 gap-y-5 lg:grid-cols-2 lg:items-start">
            {/* 1 · name (first on mobile) */}
            <div className="lg:col-start-2 lg:row-start-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-purple/30 bg-brand-purple/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-magenta">
                <Printer size={13} aria-hidden /> Impression
              </div>
              <h1 className="mt-3 text-2xl font-extrabold leading-tight text-white font-montserrat sm:text-3xl lg:text-4xl">{heading}</h1>
            </div>

            {/* 2 · visual */}
            <div className="lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:self-start">
              <div className="lg:sticky lg:top-28">
                <ProductGallery images={[{ src: image, alt: p.alt || `Impression ${label} Art Vision` }]} />
                {p.startingPrice && !p.startingPrice.isQuote && (
                  <p className="mt-3 text-center text-xs text-white/50">Repère tarifaire catalogue : {p.startingPrice.display}{p.startingPrice.unit ? ` (${p.startingPrice.unit})` : ""}</p>
                )}
              </div>
            </div>

            {/* 3 · short description */}
            <p className="text-sm leading-relaxed text-white/75 lg:col-start-2 lg:row-start-2">{shortIntro(intro)}</p>

            {/* 4 · configuration, price, actions */}
            <div className="lg:col-start-2 lg:row-start-3">
              {offers.length > 0 ? (
                <ProductConfigurator
                  slug={canonicalSlug}
                  catalogSlug={catalogSlug}
                  productName={label}
                  offers={offers}
                  perSquareMetre={perSquareMetre}
                  production={g.production}
                  shipping={g.shipping}
                  express={g.express}
                />
              ) : (
                <div className="rounded-2xl border border-brand-purple/25 bg-[#1A1238]/60 p-6">
                  <h2 className="text-xl font-bold text-white font-montserrat">Tarification sur mesure</h2>
                  <p className="mt-2 text-sm text-white/70">Ce support est chiffré selon votre projet (dimensions, quantité, finitions). Décrivez-le-nous : nous revenons vers vous avec un devis.</p>
                  <Link href={`/devis-sur-mesure?prefill=impression&product=${encodeURIComponent(label)}`} data-tracking="cta_click" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#D95200] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white">
                    Demander un devis <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── information sections ───────── */}
      <nav aria-label="Sections de la fiche" className="sticky top-[4.25rem] z-30 border-y border-brand-purple/15 bg-[#0b0314]/90 backdrop-blur">
        <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          {anchors.map(([id, text]) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} className="block rounded-full px-3.5 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-brand-purple/30 hover:text-white">{text}</a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto max-w-7xl space-y-14 px-4 pb-32 pt-10 sm:px-6 lg:px-8 lg:pb-24">
        <section id="presentation" className="scroll-mt-32 max-w-3xl space-y-4">
          <h2 className="text-xl font-extrabold text-white font-montserrat sm:text-2xl">Présentation et usages</h2>
          <p className="text-sm leading-relaxed text-white/75">{intro}</p>
          {p.intro && alias?.intro && p.intro !== alias.intro && <p className="text-sm leading-relaxed text-white/60">{p.intro}</p>}
          {usages.length > 0 && (
            <ul className="space-y-1.5 text-sm text-white/75">
              {usages.map((u) => (<li key={u} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-magenta" aria-hidden />{u}</li>))}
            </ul>
          )}
          {isBusinessCard && (
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/outils-gratuits/carte-de-visite-gratuite" className="inline-flex items-center gap-2 rounded-full bg-brand-magenta px-5 py-2.5 text-xs font-bold text-white"><FileText size={14} /> Créer ma carte gratuitement</Link>
              <Link href="/outils-gratuits/generateur-qr-code" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white"><QrCode size={14} /> Générer un QR code</Link>
            </div>
          )}
        </section>

        <section id="papiers" className="scroll-mt-32 space-y-4">
          <h2 className="text-xl font-extrabold text-white font-montserrat sm:text-2xl">Papiers, matériaux et finitions disponibles</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mats.map((m) => {
              const notes = explain(m.material, ...m.finishes);
              return (
                <article key={m.material} className="rounded-xl border border-brand-purple/20 bg-[#1A1238]/40 p-4 text-sm">
                  <h3 className="font-bold text-white">{m.material}</h3>
                  <dl className="mt-2 space-y-1 text-xs text-white/65">
                    {m.grammages.length > 0 && (<div className="flex gap-2"><dt className="text-white/40">Grammage</dt><dd>{m.grammages.join(", ")}</dd></div>)}
                    {m.sides.length > 0 && (<div className="flex gap-2"><dt className="text-white/40">Impression</dt><dd>{m.sides.join(" ou ")}</dd></div>)}
                    {m.finishes.length > 0 && (<div className="flex gap-2"><dt className="text-white/40">Finitions</dt><dd>{m.finishes.join(", ")}</dd></div>)}
                  </dl>
                  {notes.map((n) => (<p key={n} className="mt-2 text-[11px] text-white/50">{n}</p>))}
                </article>
              );
            })}
          </div>
        </section>

        <section id="technique" className="scroll-mt-32 space-y-5">
          <h2 className="text-xl font-extrabold text-white font-montserrat sm:text-2xl">Caractéristiques techniques et préparation du fichier</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <dl className="space-y-3 rounded-xl border border-brand-purple/20 bg-[#1A1238]/40 p-5 text-sm">
              <div><dt className="font-semibold text-white">Formats de fichier acceptés</dt><dd className="text-white/65">{g.acceptedFormats.join(", ")}</dd></div>
              <div><dt className="font-semibold text-white">Qualité</dt><dd className="text-white/65">{g.quality}</dd></div>
              <div><dt className="font-semibold text-white">Fond perdu et marges</dt><dd className="text-white/65">{g.bleed}</dd></div>
            </dl>
            <div className="space-y-3 rounded-xl border border-brand-purple/20 bg-[#1A1238]/40 p-5 text-sm">
              <p className="flex gap-2"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden /><span><strong className="text-white">Vérification technique du fichier : gratuite.</strong> <span className="text-white/65">Format, résolution, fond perdu : nous vous indiquons ce qui doit être corrigé.</span></span></p>
              <p className="flex gap-2"><FileText size={16} className="mt-0.5 shrink-0 text-brand-orange" aria-hidden /><span><strong className="text-white">Corrections du fichier : sur devis.</strong> <span className="text-white/65">Mise aux normes, retouches ou remplacement d&apos;éléments sont chiffrés avant tout travail.</span></span></p>
              <p className="flex gap-2"><Printer size={16} className="mt-0.5 shrink-0 text-brand-magenta" aria-hidden /><span><strong className="text-white">Création graphique sur mesure : sur devis.</strong> <span className="text-white/65">Conception de votre visuel par notre graphiste.</span></span></p>
            </div>
          </div>
          <div id="gabarits" className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
            <Ruler size={18} className="text-brand-magenta" aria-hidden />
            <span>Gabarit avec format final, fond perdu et zone de sécurité : générez-le gratuitement avec notre outil.</span>
            <Link href="/outils-gratuits/gabarit-impression" className="font-semibold text-brand-magenta underline underline-offset-4">Générer un gabarit</Link>
          </div>
        </section>

        <section id="livraison" className="scroll-mt-32 space-y-3">
          <h2 className="text-xl font-extrabold text-white font-montserrat sm:text-2xl">Fabrication et livraison</h2>
          <ul className="grid gap-3 text-sm sm:grid-cols-3">
            <li className="rounded-xl border border-brand-purple/20 bg-[#1A1238]/40 p-4"><strong className="text-white">Production</strong><br /><span className="text-white/65">{g.production}</span></li>
            <li className="rounded-xl border border-brand-purple/20 bg-[#1A1238]/40 p-4"><strong className="flex items-center gap-1.5 text-white"><Truck size={15} aria-hidden /> Livraison</strong><span className="text-white/65">{g.shipping}</span></li>
            <li className="rounded-xl border border-brand-purple/20 bg-[#1A1238]/40 p-4"><strong className="text-white">Express</strong><br /><span className="text-white/65">{g.express}</span></li>
          </ul>
          <p className="text-xs text-white/50">Prix hors TVA (HT). Frais de port calculés à la validation du devis.</p>
        </section>

        <div id="faq" className="scroll-mt-32">
          <FaqAccordion title={`Questions fréquentes — ${label}`} items={faqs} />
        </div>

        <section id="tarifs" className="scroll-mt-32">
          <details className="group rounded-2xl border border-brand-purple/20 bg-[#1A1238]/30 p-4 sm:p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-extrabold text-white font-montserrat sm:text-lg">
              Voir tous les tarifs
              <ChevronRight size={20} className="text-brand-magenta transition-transform group-open:rotate-90" aria-hidden />
            </summary>
            <p className="mt-3 text-xs text-white/55">Grille complète, hors TVA (HT). Cliquez sur un prix pour demander un devis avec cette configuration pré-remplie.</p>
            <div className="mt-4 space-y-6">
              {data.categories.map((category) => (<PriceTable key={category.id} category={category} slug={canonicalSlug} productLabel={label} />))}
            </div>
          </details>
        </section>

        <section aria-labelledby="related-title" className="space-y-4 border-t border-brand-purple/15 pt-10">
          <h2 id="related-title" className="text-xs font-extrabold uppercase tracking-wider text-brand-magenta">Produits complémentaires</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {RELATED.filter((r) => r.slug !== catalogSlug).slice(0, 4).map((r) => {
              const c = catalog.products.find((x) => x.slug === r.slug) as { image?: string } | undefined;
              return (
                <li key={r.href}>
                  <Link href={r.href} className="group block rounded-xl border border-brand-purple/20 bg-[#1A1238]/50 p-3 transition hover:border-brand-magenta/50">
                    {c?.image && <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#120a28]/80 p-1.5"><img src={c.image} alt="" loading="lazy" className="h-full w-full object-contain" /></div>}
                    <span className="mt-2 block text-sm font-bold text-white group-hover:text-brand-magenta">{r.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
