import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getLive, listLive } from "@/lib/pages";
import { KINDS, pagePath, type Kind, type Lang } from "@/lib/content-kinds";
import { analyseBlocks, type Block } from "@/lib/blocks";
import { SITE } from "@/lib/site";
import { BlockRenderer } from "@/components/blocks/renderer";

type Row = NonNullable<Awaited<ReturnType<typeof getLive>>>;
const abs = (path: string) => `${SITE.url}${path}`;

async function alternatesFor(p: Row) {
  const self = abs(pagePath(p.kind as Kind, p.lang as Lang, p.slug));
  if (!p.translationId) return { canonical: p.canonicalUrl || self };
  const twin = await getDb().page.findUnique({ where: { id: p.translationId } });
  const live = twin && (twin.status === "PUBLISHED" || (twin.status === "SCHEDULED" && !!twin.publishedAt && twin.publishedAt <= new Date()));
  if (!twin || !live) return { canonical: p.canonicalUrl || self };
  const other = abs(pagePath(twin.kind as Kind, twin.lang as Lang, twin.slug));
  const [fr, ar] = p.lang === "fr" ? [self, other] : [other, self];
  return { canonical: p.canonicalUrl || self, languages: { "fr-TN": fr, "ar-TN": ar, "x-default": fr } };
}

export async function dbMetadata(kind: Kind, lang: Lang, slug: string): Promise<Metadata | null> {
  const p = await getLive(kind, lang, slug).catch(() => null);
  if (!p) return null;
  const title = p.seoTitle || p.title;
  const desc = p.metaDescription ?? undefined;
  return {
    title,
    description: desc,
    alternates: await alternatesFor(p),
    robots: { index: !p.noindex, follow: !p.nofollow },
    openGraph: { title: p.ogTitle || title, description: p.ogDescription || desc, url: abs(pagePath(kind, lang, slug)), type: kind === "article" ? "article" : "website", ...(p.ogImage ? { images: [p.ogImage] } : {}) },
    twitter: { card: p.ogImage ? "summary_large_image" : "summary", title: p.ogTitle || title, description: p.ogDescription || desc },
  };
}

/** Renders a builder item, or redirects (301) from a retired slug, or 404s. */
export async function DbPageView({ kind, lang, slug }: { kind: Kind; lang: Lang; slug: string }) {
  const p = await getLive(kind, lang, slug);
  if (!p) {
    const r = await getDb().redirect.findUnique({ where: { fromPath: pagePath(kind, lang, slug) } });
    if (r) permanentRedirect(r.toPath);
    notFound();
  }
  const blocks = p.blocks as unknown as Block[];
  const an = analyseBlocks(blocks);
  const path = pagePath(kind, lang, slug);
  const inLanguage = lang === "ar" ? "ar-TN" : "fr-TN";
  const crumbs = [{ name: lang === "ar" ? "الرئيسية" : "Accueil", item: abs(lang === "ar" ? "/ar" : "") }, ...(KINDS[kind].prefix ? [{ name: KINDS[kind].plural, item: abs(`${lang === "ar" ? "/ar" : ""}${KINDS[kind].prefix}`) }] : []), { name: p.breadcrumbLabel || p.title, item: abs(path) }];
  const ld: Record<string, unknown>[] = [
    kind === "article"
      ? { "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.metaDescription ?? undefined, datePublished: p.publishedAt?.toISOString(), dateModified: p.updatedAt.toISOString(), inLanguage, author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url }, mainEntityOfPage: abs(path), ...(p.ogImage ? { image: p.ogImage } : {}) }
      : { "@context": "https://schema.org", "@type": p.schemaType, name: p.seoTitle || p.title, description: p.metaDescription ?? undefined, url: abs(path), inLanguage },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })) },
  ];
  if (an.hasFaq) ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: an.faqs.filter((f) => f.q && f.a).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <BlockRenderer blocks={blocks} />
    </>
  );
}

/** Cards for builder-created items, appended under the static lists on index pages. */
export async function DbCards({ kind, lang = "fr" }: { kind: Kind; lang?: Lang }) {
  const items = await listLive(kind, lang).catch(() => []);
  if (items.length === 0) return null;
  return (
    <ul className="mx-auto grid max-w-7xl gap-4 px-5 pb-16 sm:px-8 md:grid-cols-2">
      {items.map((i) => (
        <li key={i.slug}>
          <Link href={pagePath(kind, lang, i.slug)} className="block h-full rounded-3xl bg-white p-7 ring-1 ring-line transition-shadow hover:shadow-xl">
            {i.category && <p className="num text-xs uppercase tracking-widest text-brand">{i.category}</p>}
            <h2 className="mt-2 text-2xl font-semibold leading-snug">{i.title}</h2>
            {i.metaDescription && <p className="mt-2 text-sm text-soft">{i.metaDescription}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
