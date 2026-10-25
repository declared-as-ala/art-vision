import type { Metadata } from "next";
import { SERVICES, getService } from "@/content/services";
import { ServiceDetail } from "@/components/site/services-pages";
import { alternates } from "@/lib/seo";
import { dbMetadata, DbPageView } from "@/components/site/db-page";
import { getLive } from "@/lib/pages";

// Resolve builder content before streaming so unknown URLs return a real 404 (not a soft 404).
export const instant = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slugs.ar }));
}

export async function generateMetadata({ params }: PageProps<"/ar/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const dbMeta = await dbMetadata("service", "ar", slug);
  if (dbMeta) return dbMeta;
  const s = getService(slug, "ar");
  if (!s) return {};
  return {
    title: s.ar.seoTitle,
    description: s.ar.seoDescription,
    alternates: alternates({ fr: `/services/${s.slugs.fr}`, ar: `/ar/services/${s.slugs.ar}` }, "ar"),
    openGraph: { title: s.ar.seoTitle, description: s.ar.seoDescription },
  };
}

export default async function Page({ params }: PageProps<"/ar/services/[slug]">) {
  const { slug } = await params;
  if (await getLive("service", "ar", slug)) return <DbPageView kind="service" lang="ar" slug={slug} />;
  const s = getService(slug, "ar");
  if (!s) return <DbPageView kind="service" lang="ar" slug={slug} />;
  return <ServiceDetail service={s} locale="ar" />;
}
