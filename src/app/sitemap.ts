import { headers } from "next/headers";
import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { toolsByOrder } from "@/lib/tools";
import impressionCatalog from "@/data/impression-catalog.json";

const PRODUCTION_URL = "https://art-visions.fr";

function getBaseUrl(host: string | null): string {
  if (host && (host === "art-visions.fr" || host.endsWith(".art-visions.fr"))) {
    return `https://${host}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL || process.env.SITE_URL || PRODUCTION_URL;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let host: string | null = null;
  try {
    const headersList = await headers();
    host = headersList.get("host");
  } catch {
    // Falls back safely during static build / script execution
  }
  const baseUrl = getBaseUrl(host);

  // 1. Static Core Public Routes (excluding redirects & admin)
  const staticRoutes = [
    "",
    "/portfolio",
    "/blog",
    "/contact",
    "/devis-sur-mesure",
    "/impression",
    "/outils-gratuits",
    "/belgique",
    "/belgique/creation-logo",
    "/belgique/impression",
    "/belgique/carte-de-visite",
    "/belgique/creation-site-internet",
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/politique-de-cookies-ue",
  ];

  const legalRoutes = new Set([
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/politique-de-cookies-ue",
  ]);

  const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : legalRoutes.has(route) ? "monthly" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/belgique") ? 0.85 : 0.8,
  }));

  // 2. Database Services
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const services = await prisma.service.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    serviceRoutes = services.map((s) => ({
      url: `${baseUrl}/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch (e) {
    console.error("Sitemap service fetch error:", e);
  }

  // 3. Database Pages
  let pageRoutes: MetadataRoute.Sitemap = [];
  try {
    const pages = await prisma.page.findMany({
      where: { status: "PUBLISHED", isActive: true },
      select: { slug: true, updatedAt: true },
    });
    pageRoutes = pages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (e) {}

  // 4. Database Blog Posts
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    postRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch (e) {
    console.error("Sitemap blog post fetch error:", e);
  }

  // 5. Portfolio Projects
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await prisma.portfolioProject.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (e) {}

  // 6. Commercial SEO Landing Pages
  let landingRoutes: MetadataRoute.Sitemap = [];
  try {
    const landings = await prisma.seoLandingPage.findMany({
      where: { status: "PUBLISHED", indexable: true },
      select: { slug: true, updatedAt: true },
    });
    landingRoutes = landings.map((l) => ({
      url: `${baseUrl}/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch (e) {
    console.error("Sitemap landing page fetch error:", e);
  }

  // 7. Free Tools Pages
  const toolRoutes: MetadataRoute.Sitemap = toolsByOrder.map((t) => ({
    url: `${baseUrl}/outils-gratuits/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // 8. Printing Product Pages (Singular & Catalog Products)
  const dedicatedPrintingSlugs = [
    "/impression/carte-de-visite",
    "/impression/flyer",
    "/impression/affiche",
    "/impression/brochure",
    "/impression/depliant",
    "/impression/catalogue",
    "/impression/bache",
    "/impression/panneau",
    "/impression/roll-up",
    "/impression/kakemono",
  ];

  const dedicatedPrintingRoutes: MetadataRoute.Sitemap = dedicatedPrintingSlugs.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const catalogImpressionRoutes: MetadataRoute.Sitemap = impressionCatalog.products.map((product) => ({
    url: `${baseUrl}${product.url}`,
    lastModified: new Date(),
    changeFrequency: (product.tableCount > 0 ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: product.tableCount > 0 ? 0.8 : 0.6,
  }));

  // 9. Custom DB entries if configured
  let customRoutes: MetadataRoute.Sitemap = [];
  try {
    const dbEntries = await prisma.sitemapEntry.findMany({
      where: { included: true },
    });
    if (dbEntries.length > 0) {
      customRoutes = dbEntries.map((entry) => ({
        url: entry.url.startsWith("http") ? entry.url : `${baseUrl}${entry.url}`,
        lastModified: entry.lastModified,
        changeFrequency: entry.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
        priority: entry.priority,
      }));
    }
  } catch (error) {}

  // Consolidate & Deduplicate
  const allRoutes = [
    ...routes,
    ...dedicatedPrintingRoutes,
    ...catalogImpressionRoutes,
    ...toolRoutes,
    ...serviceRoutes,
    ...landingRoutes,
    ...postRoutes,
    ...projectRoutes,
    ...pageRoutes,
    ...customRoutes,
  ];

  // Exclude legacy redirects, admin, api, drafts, and deduplicate by URL
  const excludedPatterns = [
    "/carte-de-visite-gratuite",
    "/cv-modeles-gratuits",
    "/impression-publicitaire",
    "/agence-graphique-france",
    "/studio-graphique-france",
    "/graphiste-freelance-france",
    "/creation-site-vitrine",
    "/impression-cartes-de-visite",
    "/impression-flyers",
    "/impression-affiches",
    "/impression-baches",
    "/impression-catalogues",
    "/impression-panneaux-publicitaires",
    "/seo/",
    "/services/",
    "/admin",
    "/api",
  ];

  const map = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of allRoutes) {
    if (!entry.url.startsWith(baseUrl)) continue;
    const path = entry.url.replace(baseUrl, "");
    if (excludedPatterns.some((pattern) => path === pattern || path.startsWith(`${pattern}/`))) {
      continue;
    }
    map.set(entry.url, entry);
  }

  return Array.from(map.values());
}
