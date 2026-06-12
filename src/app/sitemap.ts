import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";
  let customRoutes: MetadataRoute.Sitemap = [];

  try {
    // 1. Fetch included sitemap entries from database
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

  // 2. Always merge database-managed content with manually curated entries.
  const routes = [
    "",
    "/portfolio",
    "/blog",
    "/contact",
    "/devis-sur-mesure",
    "/carte-de-visite-gratuite",
    "/cv-modeles-gratuits",
    "/impression-publicitaire",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const services = await prisma.service.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } });
    serviceRoutes = services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
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
    landingRoutes = landings.map((l) => ({
      url: `${baseUrl}/seo/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (e) {}

  const merged = [...routes, ...customRoutes, ...pageRoutes, ...serviceRoutes, ...postRoutes, ...projectRoutes, ...landingRoutes];
  return Array.from(new Map(merged.map((entry) => [entry.url, entry])).values());
}
