import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeSlug, revalidateContent, sanitizeHtml, slugExists } from "@/lib/cms";

// GET: Fetch all SEO Landing Pages
export async function GET() {
  try {
    const landingPages = await prisma.seoLandingPage.findMany({
      orderBy: { slug: "asc" }
    });
    return NextResponse.json({ success: true, landingPages });
  } catch (error) {
    console.error("GET landing pages error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch landing pages" }, { status: 500 });
  }
}

// POST: Create a new SEO Landing Page
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      h1,
      keyword,
      city,
      pageType,
      intro,
      content,
      faq,
      relatedServices,
      relatedPortfolio,
      status,
      seoTitle,
      metaDescription,
      canonicalUrl,
      ogImage,
      indexable
    } = body;

    if (!title || !slug || !h1 || !keyword) {
      return NextResponse.json({ success: false, error: "Title, slug, H1, and keyword are required." }, { status: 400 });
    }

    // Clean and validate slug
    const cleanSlug = normalizeSlug(slug || title);

    if (await slugExists(cleanSlug, { type: "SEO_LANDING" })) {
      return NextResponse.json({ success: false, error: "A page with this URL slug already exists." }, { status: 400 });
    }

    const newPage = await prisma.seoLandingPage.create({
      data: {
        title,
        slug: cleanSlug,
        h1,
        keyword,
        city: city || null,
        pageType: pageType || "GENERIC",
        intro,
        content: sanitizeHtml(content || ""),
        faq: faq ? JSON.stringify(faq) : "[]",
        relatedServices: relatedServices || "",
        relatedPortfolio: relatedPortfolio || "",
        status: status || "PUBLISHED",
        seoTitle: seoTitle || null,
        metaDescription: metaDescription || null,
        canonicalUrl: canonicalUrl || null,
        ogImage: ogImage || null,
        indexable: indexable !== undefined ? indexable : true
      }
    });
    revalidateContent("SEO_LANDING", cleanSlug);

    return NextResponse.json({ success: true, landingPage: newPage });
  } catch (error) {
    console.error("POST landing page error:", error);
    return NextResponse.json({ success: false, error: "Failed to create SEO landing page" }, { status: 500 });
  }
}

// PUT: Update an existing SEO Landing Page
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      h1,
      keyword,
      city,
      pageType,
      intro,
      content,
      faq,
      relatedServices,
      relatedPortfolio,
      status,
      seoTitle,
      metaDescription,
      canonicalUrl,
      ogImage,
      indexable
    } = body;

    if (!id || !title || !slug || !h1 || !keyword) {
      return NextResponse.json({ success: false, error: "ID, Title, slug, H1, and keyword are required." }, { status: 400 });
    }

    const cleanSlug = normalizeSlug(slug || title);
    const previous = await prisma.seoLandingPage.findUnique({ where: { id } });

    if (await slugExists(cleanSlug, { type: "SEO_LANDING", id })) {
      return NextResponse.json({ success: false, error: "Another page with this URL slug already exists." }, { status: 400 });
    }

    const updatedPage = await prisma.seoLandingPage.update({
      where: { id },
      data: {
        title,
        slug: cleanSlug,
        h1,
        keyword,
        city: city || null,
        pageType: pageType || "GENERIC",
        intro,
        content: sanitizeHtml(content || ""),
        faq: faq ? (typeof faq === "string" ? faq : JSON.stringify(faq)) : "[]",
        relatedServices: relatedServices || "",
        relatedPortfolio: relatedPortfolio || "",
        status: status || "PUBLISHED",
        seoTitle: seoTitle || null,
        metaDescription: metaDescription || null,
        canonicalUrl: canonicalUrl || null,
        ogImage: ogImage || null,
        indexable: indexable !== undefined ? indexable : true
      }
    });
    revalidateContent("SEO_LANDING", cleanSlug, previous?.slug);

    return NextResponse.json({ success: true, landingPage: updatedPage });
  } catch (error) {
    console.error("PUT landing page error:", error);
    return NextResponse.json({ success: false, error: "Failed to update SEO landing page" }, { status: 500 });
  }
}

// DELETE: Remove an SEO Landing Page
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Page ID is required" }, { status: 400 });
    }

    const page = await prisma.seoLandingPage.delete({
      where: { id }
    });
    revalidateContent("SEO_LANDING", page.slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE landing page error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete SEO landing page" }, { status: 500 });
  }
}
