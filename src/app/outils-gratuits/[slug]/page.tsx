import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ToolPageFrame from "@/components/tools/ToolPageFrame";
import UniversalToolStudio from "@/components/tools/UniversalToolStudio";
import { getLandingContent } from "@/lib/expanded-tool-content";
import { getTool, toolsByOrder, toolUrl } from "@/lib/tools";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";
const EXISTING_STATIC_TOOL_SLUGS = new Set([
  "calculateur-impression",
  "carte-de-visite-gratuite",
  "creer-flyer",
  "cv-gratuit",
  "generateur-bio-instagram",
  "generateur-brief-logo",
  "generateur-caption-instagram",
  "generateur-palette-couleurs",
  "generateur-qr-code",
  "generateur-slogan",
]);

export function generateStaticParams() {
  return toolsByOrder
    .filter((tool) => !EXISTING_STATIC_TOOL_SLUGS.has(tool.slug))
    .map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const url = `${BASE}${toolUrl(tool.slug)}`;

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const content = getLandingContent(slug);

  return (
    <ToolPageFrame
      tool={tool}
      seoContent={
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-montserrat font-bold text-white">Comment utiliser cet outil</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5">
              {content.howItWorks.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-montserrat font-bold text-white">Cas d'usage fréquents</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {content.useCases.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-montserrat font-bold text-white">Exemples et bénéfices</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple-dark/30 p-5">
                <h3 className="font-bold text-white">Exemples</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  {content.examples.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple-dark/30 p-5">
                <h3 className="font-bold text-white">Bénéfices</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  {content.benefits.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-montserrat font-bold text-white">Conseils pratiques avant d'exporter</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {content.advice.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-montserrat font-bold text-white">Recherche et intention SEO</h2>
            <p className="mt-4">
              Cette page cible principalement <strong className="text-white">{content.search.primaryKeyword}</strong>, avec des intentions proches comme {content.search.secondaryKeywords.join(", ")}.
              Les recherches observées en France et en Belgique francophone privilégient les outils gratuits, l'export immédiat et les modèles simples à adapter.
            </p>
            <p>
              Notre angle : {content.search.gap} Pour aller plus loin, vous pouvez aussi consulter nos services de{" "}
              <Link className="text-brand-orange underline" href="/design-graphique">création graphique</Link>,{" "}
              <Link className="text-brand-orange underline" href="/impression">impression</Link> et{" "}
              <Link className="text-brand-orange underline" href="/identite-visuelle">identité visuelle</Link>.
            </p>
          </section>
        </div>
      }
    >
      <UniversalToolStudio tool={tool} />
    </ToolPageFrame>
  );
}
