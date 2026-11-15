import type { Metadata } from "next";
import catalog from "@/data/impression-catalog.json";
import ProductPageView from "@/components/impression/ProductPageView";
import { ALIAS_MAP, resolveSlug } from "@/lib/print-aliases";

export function generateStaticParams() {
  const fromCatalog = catalog.products.map((p) => ({ slug: p.slug }));
  const fromAliases = Object.keys(ALIAS_MAP).map((slug) => ({ slug }));
  return [...fromCatalog, ...fromAliases];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { alias, product, data } = resolveSlug(slug);
  if (!product || !data) return {};

  const title = alias
    ? `${alias.label} | Tarifs Impression Art Vision`
    : `${product.label} personnalisés | Tarifs impression Art Vision`;
  const description = alias
    ? `${alias.intro.slice(0, 155)}... Découvrez nos tarifs dégressifs et configurez votre devis en ligne.`
    : `Tables de prix pour ${product.label.toLowerCase()} : formats, dimensions, quantités, fichiers 300 DPI CMJN et demande de devis Art Vision.`;
  const canonicalSlug = alias ? alias.canonicalSlug : slug;

  return {
    title,
    description,
    alternates: { canonical: `https://art-visions.fr/impression/${canonicalSlug}` },
    openGraph: {
      title,
      description,
      url: `https://art-visions.fr/impression/${canonicalSlug}`,
      type: "website",
      images: [
        {
          url: (product as any).image
            ? `https://art-visions.fr${(product as any).image}`
            : "https://art-visions.fr/logo.png",
        },
      ],
    },
  };
}

export default async function ImpressionProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductPageView slug={slug} />;
}
