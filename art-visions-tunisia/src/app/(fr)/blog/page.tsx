import type { Metadata } from "next";
import { Suspense } from "react";
import { DbCards } from "@/components/site/db-page";
import Link from "next/link";
import { ARTICLES, BLOG_CATEGORIES } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog : logo, print et web pour entreprises tunisiennes | Art Visions",
  description: "Guides pratiques sur le logo, l'identité visuelle, l'impression et le site web, écrits pour les entreprises en Tunisie.",
  alternates: { canonical: "/blog" },
};

const fmt = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function Page() {
  const tones = ["bg-brand", "bg-indigo", "bg-copper"];
  return (
    <>
      <section className="hero-field grain relative overflow-hidden text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <p className="num text-xs uppercase tracking-[0.22em] text-copper">Blog</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold sm:text-7xl">Guides pour votre marque</h1>
          <ul className="mt-8 flex flex-wrap gap-2 text-sm">
            {BLOG_CATEGORIES.map((c) => (<li key={c} className="rounded-full border border-white/25 px-3.5 py-1.5">{c}</li>))}
          </ul>
        </div>
      </section>
      <ul className="mx-auto grid max-w-7xl gap-5 px-5 py-16 sm:px-8 md:grid-cols-2">
        {ARTICLES.map((a) => {
          const tone = tones[BLOG_CATEGORIES.indexOf(a.category as never) % 3];
          return (
            <li key={a.slug}>
              <Link href={`/blog/${a.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-line transition-shadow hover:shadow-xl">
                <div className={`flex h-32 items-end p-6 ${tone} text-white`}><span className="num text-xs uppercase tracking-widest">{a.category}</span></div>
                <div className="flex flex-1 flex-col p-7">
                  <h2 className="text-2xl font-semibold leading-snug">{a.title}</h2>
                  <p className="mt-3 text-sm text-soft">{a.description}</p>
                  <p className="num mt-auto pt-6 text-xs text-soft">{fmt(a.date)} · {a.readMinutes} min</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <Suspense fallback={null}><DbCards kind="article" lang="fr" /></Suspense>
    </>
  );
}
