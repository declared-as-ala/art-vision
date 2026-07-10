import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeSlug, revalidateContent, sanitizeHtml, slugExists } from "@/lib/cms";

// Resolve a category reference (real id, slug, or label) to a valid
// BlogCategory.id, creating one if needed — prevents FK failures when the
// client sends a slug-like id that doesn't exist.
async function resolveCategoryId(input?: string, label?: string): Promise<string> {
  const raw = (input || "").trim();
  if (raw) {
    const byId = await prisma.blogCategory.findUnique({ where: { id: raw } });
    if (byId) return byId.id;
    const bySlug = await prisma.blogCategory.findUnique({ where: { slug: normalizeSlug(raw) } });
    if (bySlug) return bySlug.id;
    const byName = await prisma.blogCategory.findFirst({ where: { name: label || raw } });
    if (byName) return byName.id;
    const created = await prisma.blogCategory.create({
      data: { name: label || raw, slug: normalizeSlug(raw) },
    });
    return created.id;
  }
  const first = await prisma.blogCategory.findFirst();
  if (first) return first.id;
  const fallback = await prisma.blogCategory.create({ data: { name: "Design", slug: "design" } });
  return fallback.id;
}

export async function GET() {
  try {
    const [posts, categories] = await Promise.all([
      prisma.blogPost.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
      prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    ]);
    return NextResponse.json({ success: true, posts, categories });
  } catch (error) {
    console.error("GET posts error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, featuredImage, author, status, tags, readingTime, categoryId, categoryName, customHtml } = body;
    const slug = normalizeSlug(body.slug || title);

    // Check if slug exists
    if (await slugExists(slug, { type: "POST" })) {
      return NextResponse.json({ success: false, error: "Un article avec ce slug (URL) existe déjà." }, { status: 400 });
    }

    const catId = await resolveCategoryId(categoryId, categoryName);

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content: sanitizeHtml(content || "Contenu de l'article."),
        featuredImage: featuredImage || "/logo.png",
        author: author || "Admin",
        status: status || "DRAFT",
        tags: tags || "design",
        readingTime: Number(readingTime) || 5,
        customHtml: customHtml ? sanitizeHtml(String(customHtml)) : null,
        categoryId: catId
      }
    });
    revalidateContent("POST", slug);
    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("POST post error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, content, featuredImage, author, status, tags, readingTime, categoryId, categoryName, customHtml } = body;
    const slug = normalizeSlug(body.slug || title);
    const previous = await prisma.blogPost.findUnique({ where: { id } });
    if (await slugExists(slug, { type: "POST", id })) return NextResponse.json({ success: false, error: "Ce slug est déjà utilisé." }, { status: 400 });

    const catId = await resolveCategoryId(categoryId, categoryName);

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        content: sanitizeHtml(content),
        featuredImage,
        author,
        status,
        tags,
        readingTime: Number(readingTime),
        ...(customHtml !== undefined ? { customHtml: customHtml ? sanitizeHtml(String(customHtml)) : null } : {}),
        categoryId: catId
      }
    });
    revalidateContent("POST", slug, previous?.slug);
    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("PUT post error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    
    const post = await prisma.blogPost.delete({
      where: { id }
    });
    revalidateContent("POST", post.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE post error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
