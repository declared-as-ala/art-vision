import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: List all sitemap entries
export async function GET() {
  try {
    const entries = await prisma.sitemapEntry.findMany({
      orderBy: { url: "asc" }
    });
    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error("GET sitemap entries error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch sitemap entries" }, { status: 500 });
  }
}

// POST: Add new entry OR sync database routes
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sync = searchParams.get("sync") === "true";

    if (sync) {
      // 1. Compile all standard system routes
      const staticRoutes = [
        "/",
        "/portfolio",
        "/blog",
        "/contact",
        "/devis-sur-mesure",
        "/carte-de-visite-gratuite",
        "/cv-modeles-gratuits",
        "/impression"
      ];

      // 2. Fetch service slugs
      const services = await prisma.service.findMany({ select: { slug: true } });
      const serviceRoutes = services.map(s => `/${s.slug}`);

      // 3. Fetch published blog slugs
      const blogPosts = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true }
      });
      const blogRoutes = blogPosts.map(b => `/blog/${b.slug}`);

      // 4. Fetch portfolio project slugs
      const portfolioProjects = await prisma.portfolioProject.findMany({ select: { slug: true } });
      const portfolioRoutes = portfolioProjects.map(p => `/portfolio/${p.slug}`);

      // 5. Fetch landing page slugs
      const landings = await prisma.seoLandingPage.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true }
      });
      const landingRoutes = landings.map(l => `/${l.slug}`);

      // Combine all routes
      const allPaths = [
        ...staticRoutes,
        ...serviceRoutes,
        ...blogRoutes,
        ...portfolioRoutes,
        ...landingRoutes
      ];

      let createdCount = 0;
      let updatedCount = 0;

      // Upsert into database
      for (const path of allPaths) {
        const priority = path === "/" ? 1.0 : (staticRoutes.includes(path) || serviceRoutes.includes(path)) ? 0.8 : 0.6;
        const changeFrequency = path === "/" ? "daily" : "weekly";

        const existing = await prisma.sitemapEntry.findUnique({
          where: { url: path }
        });

        if (existing) {
          await prisma.sitemapEntry.update({
            where: { id: existing.id },
            data: { lastModified: new Date() }
          });
          updatedCount++;
        } else {
          await prisma.sitemapEntry.create({
            data: {
              url: path,
              priority,
              changeFrequency,
              included: true,
              lastModified: new Date()
            }
          });
          createdCount++;
        }
      }

      const entries = await prisma.sitemapEntry.findMany({ orderBy: { url: "asc" } });
      return NextResponse.json({ success: true, createdCount, updatedCount, entries });
    }

    // Standard manual entry creation
    const body = await request.json();
    const { url, priority, changeFrequency, included } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: "URL path is required" }, { status: 400 });
    }

    const cleanUrl = "/" + url.replace(/^\/+/, ""); // Standardize leading slash

    const existing = await prisma.sitemapEntry.findUnique({
      where: { url: cleanUrl }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "This sitemap entry already exists." }, { status: 400 });
    }

    const entry = await prisma.sitemapEntry.create({
      data: {
        url: cleanUrl,
        priority: parseFloat(priority) || 0.5,
        changeFrequency: changeFrequency || "weekly",
        included: included !== undefined ? included : true,
        lastModified: new Date()
      }
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error("POST sitemap entry error:", error);
    return NextResponse.json({ success: false, error: "Failed to process sitemap sync/creation" }, { status: 500 });
  }
}

// PUT: Update sitemap entry parameters
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, url, priority, changeFrequency, included } = body;

    if (!id || !url) {
      return NextResponse.json({ success: false, error: "ID and URL are required" }, { status: 400 });
    }

    const cleanUrl = "/" + url.replace(/^\/+/, "");

    const existing = await prisma.sitemapEntry.findFirst({
      where: {
        url: cleanUrl,
        NOT: { id }
      }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Another entry already uses this URL path." }, { status: 400 });
    }

    const entry = await prisma.sitemapEntry.update({
      where: { id },
      data: {
        url: cleanUrl,
        priority: parseFloat(priority) || 0.5,
        changeFrequency: changeFrequency || "weekly",
        included: included !== undefined ? included : true,
        lastModified: new Date()
      }
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error("PUT sitemap entry error:", error);
    return NextResponse.json({ success: false, error: "Failed to update sitemap entry" }, { status: 500 });
  }
}

// DELETE: Remove a manual or static entry from sitemap list
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Sitemap entry ID is required" }, { status: 400 });
    }

    await prisma.sitemapEntry.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE sitemap entry error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete sitemap entry" }, { status: 500 });
  }
}
