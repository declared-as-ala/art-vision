import { headers } from "next/headers";
import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { toolsByOrder } from "@/lib/tools";
import flyerPricing from "@/data/flyer-pricing.json";
import impressionCatalog from "@/data/impression-catalog.json";

const PRODUCTION_URL = "https://art-visions.fr";

function getBaseUrl(host: string | null): string {
  if (host && (host === "art-visions.fr" || host === "www.art-visions.fr")) {
    return `https://${host}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL || process.env.SITE_URL || PRODUCTION_URL;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host");
  const baseUrl = getBaseUrl(host);

  let customRoutes: MetadataRoute.Sitemap = [];
  try {
    const dbEntries = await prisma.sitemapEntry.findMany({
      where: { included: true }
    });
    if (dbEntries.length > 0) {
      customRoutes = dbEntries.map((entry) => ({
        url: entry.url.startsWith("http") ? entry.url : `${baseUrl}${entry.url}`,
        lastModified: entry.lastModified,
        changeFrequency: entry.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
        priority: entry.priority,
      }));
    }
  } catch (error) {
    console.error("Error fetching db sitemaps, running fallback crawling:", error);
  }

  const staticRoutes = [
    "", "/portfolio", "/blog", "/contact", "/devis-sur-mesure",
    "/carte-de-visite-gratuite", "/cv-modeles-gratuits", "/impression",
    "/mentions-legales", "/politique-de-confidentialite", "/politique-de-cookies-ue",
  ];

  const legalRoutes = new Set(["/mentions-legales", "/politique-de-confidentialite", "/politique-de-cookies-ue"]);

  const routes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" || legalRoutes.has(route) ? "monthly" : "weekly") as "monthly" | "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const services = await prisma.service.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } });
    serviceRoutes = services.map((s) => ({ url: `${baseUrl}/services/${s.slug}`, lastModified: s.updatedAt, changeFrequency: "monthly" as const, priority: 0.8 }));
  } catch (e) {}

  let pageRoutes: MetadataRoute.Sitemap = [];
  try {
    const pages = await prisma.page.findMany({ where: { status: "PUBLISHED", isActive: true }, select: { slug: true, updatedAt: true } });
    pageRoutes = pages.map((page) => ({ url: `${baseUrl}/${page.slug}`, lastModified: page.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 }));
  } catch (e) {}

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } });
    postRoutes = posts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 }));
  } catch (e) {}

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await prisma.portfolioProject.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } });
    projectRoutes = projects.map((project) => ({ url: `${baseUrl}/portfolio/${project.slug}`, lastModified: project.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 }));
  } catch (e) {}

  let landingRoutes: MetadataRoute.Sitemap = [];
  try {
    const landings = await prisma.seoLandingPage.findMany({ where: { status: "PUBLISHED", indexable: true }, select: { slug: true, updatedAt: true } });
    landingRoutes = landings.map((l) => ({ url: `${baseUrl}/seo/${l.slug}`, lastModified: l.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 }));
  } catch (e) {}

  const impressionRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/impression`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    ...impressionCatalog.products.map((product) => ({
      url: `${baseUrl}${product.url}`,
      lastModified: new Date(),
      changeFrequency: (product.tableCount > 0 ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: product.tableCount > 0 ? 0.8 : 0.6,
    })),
  ];
  const flyerRoutes = flyerPricing.categories.map((category) => ({
    url: `${baseUrl}/impression/flyers#${category.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const toolRoutes = toolsByOrder.map((t) => ({
    url: `${baseUrl}/outils-gratuits/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const allRoutes = [...routes, ...impressionRoutes, { url: `${baseUrl}/impression/flyers`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 }, ...flyerRoutes, { url: `${baseUrl}/outils-gratuits`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 }, ...toolRoutes, ...customRoutes, ...pageRoutes, ...serviceRoutes, ...postRoutes, ...projectRoutes, ...landingRoutes];

  return Array.from(
    new Map(
      allRoutes
        .filter((entry) => entry.url.startsWith(baseUrl))
        .map((entry) => [entry.url, entry])
    ).values()
  );
}
