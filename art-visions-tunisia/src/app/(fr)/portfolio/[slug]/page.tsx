import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS, getProject } from "@/content/portfolio";
import { ProjectCover } from "@/components/site/project-cover";
import { dbMetadata, DbPageView } from "@/components/site/db-page";
import { getLive } from "@/lib/pages";

// Resolve builder content before streaming so unknown URLs return a real 404 (not a soft 404).
export const instant = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const dbMeta = await dbMetadata("project", "fr", slug);
  if (dbMeta) return dbMeta;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} | Réalisation Art Visions`,
    description: p.objective,
    alternates: { canonical: `/portfolio/${p.slug}` },
    robots: p.verified ? undefined : { index: false, follow: true },
  };
}

export default async function Page({ params }: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  if (await getLive("project", "fr", slug)) return <DbPageView kind="project" lang="fr" slug={slug} />;
  const p = getProject(slug);
  if (!p) return <DbPageView kind="project" lang="fr" slug={slug} />;
  const blocks = [["Objectif", p.objective], ["Défi", p.challenge], ["Solution", p.solution]];
  return (
    <>
      <section className="bg-night text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <nav aria-label="Fil d'Ariane" className="num text-xs text-white/50"><Link href="/portfolio" className="hover:text-white">Réalisations</Link> / {p.category}</nav>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold sm:text-7xl">{p.title}</h1>
          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 text-sm">
            <div><dt className="num text-xs uppercase tracking-widest text-copper">Client</dt><dd className="mt-1">{p.client}</dd></div>
            <div><dt className="num text-xs uppercase tracking-widest text-copper">Secteur</dt><dd className="mt-1">{p.industry}</dd></div>
            <div><dt className="num text-xs uppercase tracking-widest text-copper">Type</dt><dd className="mt-1">{p.category}</dd></div>
          </dl>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="aspect-[16/9] overflow-hidden rounded-3xl"><ProjectCover project={p} /></div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {blocks.map(([t, v], i) => (
            <section key={t} className={`rounded-3xl p-7 ${["bg-tint-violet", "bg-tint-brand", "bg-tint-copper"][i]}`}>
              <h2 className="num text-xs uppercase tracking-widest text-brand-ink">{t}</h2>
              <p className="mt-3 leading-relaxed">{v}</p>
            </section>
          ))}
        </div>
        <Link href={`/contact`} className="mt-12 inline-block rounded-full bg-brand px-7 py-4 font-medium text-white hover:bg-brand-ink">Un projet similaire ? Demander un devis</Link>
      </div>
    </>
  );
}
