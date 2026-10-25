import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES, getArticle } from "@/content/blog";
import { SERVICES } from "@/content/services";
import { TOOLS } from "@/content/tools";
import { SITE } from "@/lib/site";
import { dbMetadata, DbPageView } from "@/components/site/db-page";
import { getLive } from "@/lib/pages";

// Resolve builder content before streaming so unknown URLs return a real 404 (not a soft 404).
export const instant = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const dbMeta = await dbMetadata("article", "fr", slug);
  if (dbMeta) return dbMeta;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.seoTitle,
    description: a.description,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: { type: "article", title: a.seoTitle, description: a.description, publishedTime: a.date },
  };
}

export default async function Page({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  if (await getLive("article", "fr", slug)) return <DbPageView kind="article" lang="fr" slug={slug} />;
  const a = getArticle(slug);
  if (!a) return <DbPageView kind="article" lang="fr" slug={slug} />;
  const service = SERVICES.find((s) => s.id === a.service);
  const tools = TOOLS.filter((t) => a.tools?.includes(t.slug));
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    inLanguage: "fr-TN",
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    mainEntityOfPage: `${SITE.url}/blog/${a.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="bg-indigo text-white">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
          <nav aria-label="Fil d'Ariane" className="num text-xs text-white/60"><Link href="/blog" className="hover:text-white">Blog</Link> / {a.category}</nav>
          <h1 className="mt-6 text-4xl font-semibold sm:text-6xl">{a.title}</h1>
          <p className="num mt-6 text-xs text-white/60">{new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })} · {a.readMinutes} min de lecture</p>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        {a.body.map((b, i) => {
          if (b.t === "h2") return <h2 key={i} className="mb-3 mt-12 text-2xl font-semibold text-indigo sm:text-3xl">{b.v}</h2>;
          if (b.t === "p") return <p key={i} className="mt-4 text-[17px] leading-8">{b.v}</p>;
          if (b.t === "ul") return <ul key={i} className="mt-4 space-y-2">{b.v.map((x) => (<li key={x} className="flex gap-3 text-[17px] leading-7"><span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-brand" />{x}</li>))}</ul>;
          return <aside key={i} className="mt-8 rounded-2xl border-s-4 border-copper bg-tint-copper p-6 text-[16px] leading-7"><strong className="num mb-1 block text-xs uppercase tracking-widest text-copper">Conseil</strong>{b.v}</aside>;
        })}
        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {service && (
            <Link href={`/services/${service.slugs.fr}`} className={`rounded-3xl p-6 ${service.tone.bg} ${service.tone.fg}`}>
              <span className="num text-xs uppercase tracking-widest opacity-75">Service</span>
              <p className="mt-2 text-xl font-semibold">{service.fr.name}</p>
            </Link>
          )}
          {tools.map((t) => (
            <Link key={t.slug} href={`/outils-gratuits/${t.slug}`} className={`rounded-3xl p-6 text-white ${t.tone}`}>
              <span className="num text-xs uppercase tracking-widest opacity-75">Outil gratuit</span>
              <p className="mt-2 text-xl font-semibold">{t.name}</p>
            </Link>
          ))}
        </div>
      </article>
    </>
  );
}
