import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TOOLS } from "@/content/tools";

export const metadata: Metadata = {
  title: "Outils gratuits pour votre marque : QR code, palette, brief logo | Art Visions",
  description: "Outils en ligne gratuits : générateur de QR code, de palette de couleurs, de brief logo et de slogan. Sans inscription.",
  alternates: { canonical: "/outils-gratuits" },
};

export default function Page() {
  return (
    <>
      <section className="hero-field grain relative overflow-hidden text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <p className="num text-xs uppercase tracking-[0.22em] text-copper">Gratuit · sans inscription</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold sm:text-7xl">Outils gratuits</h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">Des outils simples pour avancer sur votre identité et vos supports.</p>
        </div>
      </section>
      <ul className="mx-auto grid max-w-7xl gap-4 px-5 py-16 sm:px-8 md:grid-cols-2">
        {TOOLS.map((t) => (
          <li key={t.slug}>
            <Link href={`/outils-gratuits/${t.slug}`} className={`group relative flex min-h-56 h-full flex-col justify-end rounded-3xl p-8 text-white transition-transform hover:-translate-y-1 ${t.tone}`}>
              <ArrowUpRight className="absolute end-7 top-7 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              <h2 className="text-2xl font-semibold">{t.name}</h2>
              <p className="mt-2 max-w-sm text-sm text-white/85">{t.text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
