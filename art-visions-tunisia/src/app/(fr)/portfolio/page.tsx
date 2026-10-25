import type { Metadata } from "next";
import { Suspense } from "react";
import { DbCards } from "@/components/site/db-page";
import Link from "next/link";
import { PROJECTS } from "@/content/portfolio";
import { ProjectCover } from "@/components/site/project-cover";

export const metadata: Metadata = {
  title: "Réalisations : logos, identités visuelles et supports | Art Visions",
  description: "Découvrez les projets d'identité visuelle, de logo et de design réalisés par Art Visions pour des marques.",
  alternates: { canonical: "/portfolio" },
};

export default function Page() {
  const cats = [...new Set(PROJECTS.map((p) => p.category))];
  return (
    <>
      <section className="hero-field grain relative overflow-hidden text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <p className="num text-xs uppercase tracking-[0.22em] text-copper">Portfolio</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold sm:text-7xl">Nos réalisations</h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">Des projets de branding, de design et de production visuelle.</p>
          <ul className="mt-8 flex flex-wrap gap-2 text-sm">
            {cats.map((c) => (<li key={c} className="rounded-full border border-white/25 px-3.5 py-1.5">{c}</li>))}
          </ul>
        </div>
      </section>
      <ul className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <li key={p.slug}>
            <Link href={`/portfolio/${p.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl transition-transform duration-500 group-hover:scale-[0.985]"><ProjectCover project={p} /></div>
              <p className="num mt-4 text-xs uppercase tracking-widest text-brand">{p.category} · {p.industry}</p>
              <h2 className="mt-1 text-2xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-soft">{p.objective}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Suspense fallback={null}><DbCards kind="project" lang="fr" /></Suspense>
    </>
  );
}
