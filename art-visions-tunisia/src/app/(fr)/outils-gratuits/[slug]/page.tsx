import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS, getTool } from "@/content/tools";
import { SITE } from "@/lib/site";
import { PaletteTool } from "@/components/tools/palette-tool";
import { QrTool } from "@/components/tools/qr-tool";
import { BriefTool } from "@/components/tools/brief-tool";
import { SloganTool } from "@/components/tools/slogan-tool";

const UI: Record<string, React.ComponentType> = {
  "generateur-palette-couleurs": PaletteTool,
  "generateur-qr-code": QrTool,
  "generateur-brief-logo": BriefTool,
  "generateur-slogan": SloganTool,
};

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/outils-gratuits/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) return {};
  return { title: t.seoTitle, description: t.seoDescription, alternates: { canonical: `/outils-gratuits/${t.slug}` } };
}

export default async function Page({ params }: PageProps<"/outils-gratuits/[slug]">) {
  const { slug } = await params;
  const t = getTool(slug);
  const Tool = UI[slug];
  if (!t || !Tool) notFound();
  const ld = { "@context": "https://schema.org", "@type": "WebApplication", name: t.name, description: t.seoDescription, applicationCategory: "DesignApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "TND" }, url: `${SITE.url}/outils-gratuits/${t.slug}` };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className={`${t.tone} text-white`}>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <nav aria-label="Fil d'Ariane" className="num text-xs opacity-75"><Link href="/outils-gratuits" className="hover:underline">Outils gratuits</Link></nav>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold sm:text-6xl">{t.name}</h1>
          <p className="mt-4 max-w-2xl text-lg opacity-90">{t.text}</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><Tool /></div>
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <h2 className="text-2xl font-semibold text-indigo">À propos de cet outil</h2>
        <p className="mt-3 leading-7 text-soft">{t.about}</p>
        <Link href="/contact" className="mt-8 inline-block rounded-full bg-brand px-6 py-3.5 font-medium text-white hover:bg-brand-ink">Besoin d&apos;un professionnel ? Demander un devis</Link>
      </section>
    </>
  );
}
