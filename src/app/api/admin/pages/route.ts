import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeSlug, revalidateContent, sanitizeHtml, slugExists } from "@/lib/cms";

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" }
    });
    return NextResponse.json({ success: true, pages });
  } catch (error) {
    console.error("GET pages error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, contentJson, contentHtml, excerpt, layout, status, isActive, seoTitle, seoDescription, focusKeyword, ogImage, canonicalUrl } = body;
    const slug = normalizeSlug(body.slug || title);

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: "Le titre et le slug sont requis." }, { status: 400 });
    }

    // Check if slug exists
    if (await slugExists(slug)) {
      return NextResponse.json({ success: false, error: "Une page avec ce slug (URL) existe déjà." }, { status: 400 });
    }

    const newPage = await prisma.page.create({
      data: {
        title,
        slug,
        contentJson: contentJson || JSON.stringify({ sections: [] }),
        contentHtml: sanitizeHtml(contentHtml || ""),
        excerpt: excerpt || null,
        layout: layout || "FULL_WIDTH",
        status: status || (isActive === false ? "DRAFT" : "PUBLISHED"),
        focusKeyword: focusKeyword || null,
        isActive: isActive !== undefined ? isActive : true,
        seoTitle,
        seoDescription,
        ogImage,
        canonicalUrl,
      }
    });
    revalidateContent("PAGE", slug);

    // Also register in SEOSettings if desired
    try {
      await prisma.sEOSettings.create({
        data: {
          slug,
          pageType: "PAGE",
          pageId: newPage.id,
          title: seoTitle || title,
          description: seoDescription || "",
          ogImage: ogImage || "",
          indexable: true,
          follow: true
        }
      });
    } catch (seoErr) {
      console.warn("Failed to create SEO settings for new page:", seoErr);
    }

    return NextResponse.json({ success: true, page: newPage });
  } catch (error) {
    console.error("POST page error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, contentJson, contentHtml, excerpt, layout, status, isActive, seoTitle, seoDescription, focusKeyword, ogImage, canonicalUrl } = body;
    const slug = normalizeSlug(body.slug || title);

    if (!id || !title || !slug) {
      return NextResponse.json({ success: false, error: "L'identifiant, le titre et le slug sont requis." }, { status: 400 });
    }

    const previous = await prisma.page.findUnique({ where: { id } });
    if (await slugExists(slug, { type: "PAGE", id })) {
      return NextResponse.json({ success: false, error: "Ce slug est déjà utilisé par un autre contenu." }, { status: 400 });
    }
    const updated = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        contentJson: contentJson || JSON.stringify({ sections: [] }),
        contentHtml: sanitizeHtml(contentHtml || ""),
        excerpt: excerpt || null,
        layout: layout || "FULL_WIDTH",
        status: status || (isActive === false ? "DRAFT" : "PUBLISHED"),
        focusKeyword: focusKeyword || null,
        isActive: isActive !== undefined ? isActive : true,
        seoTitle,
        seoDescription,
        ogImage,
        canonicalUrl,
      }
    });
    revalidateContent("PAGE", slug, previous?.slug);

    // Update SEOSettings if it exists, or create it
    try {
      const seo = await prisma.sEOSettings.findFirst({ where: { pageId: id } });
      if (seo) {
        await prisma.sEOSettings.update({
          where: { id: seo.id },
          data: {
            slug,
            title: seoTitle || title,
            description: seoDescription || "",
            ogImage: ogImage || "",
          }
        });
      } else {
        await prisma.sEOSettings.create({
          data: {
            slug,
            pageType: "PAGE",
            pageId: id,
            title: seoTitle || title,
            description: seoDescription || "",
            ogImage: ogImage || "",
          }
        });
      }
    } catch (seoErr) {
      console.warn("Failed to update SEO settings for page:", seoErr);
    }

    return NextResponse.json({ success: true, page: updated });
  } catch (error) {
    console.error("PUT page error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });

    // Find page to delete its SEOSettings first if needed
    const page = await prisma.page.findUnique({ where: { id } });
    if (page) {
      try {
        await prisma.sEOSettings.deleteMany({ where: { pageId: id } });
      } catch (seoErr) {
        console.warn("Failed to delete associated SEO settings:", seoErr);
      }
    }

    await prisma.page.delete({
      where: { id }
    });
    if (page) revalidateContent("PAGE", page.slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE page error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
