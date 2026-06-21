import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeSlug, revalidateContent, sanitizeHtml, slugExists } from "@/lib/cms";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("GET posts error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, featuredImage, author, status, tags, readingTime, categoryId } = body;
    const slug = normalizeSlug(body.slug || title);
    
    // Check if slug exists
    if (await slugExists(slug, { type: "POST" })) {
      return NextResponse.json({ success: false, error: "Un article avec ce slug (URL) existe déjà." }, { status: 400 });
    }

    let catId = categoryId;
    if (!catId) {
      const cat = await prisma.blogCategory.findFirst();
      if (cat) {
        catId = cat.id;
      } else {
        const newCat = await prisma.blogCategory.create({
          data: { name: "Design", slug: "design" }
        });
        catId = newCat.id;
      }
    }

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
    const { id, title, content, featuredImage, author, status, tags, readingTime, categoryId } = body;
    const slug = normalizeSlug(body.slug || title);
    const previous = await prisma.blogPost.findUnique({ where: { id } });
    if (await slugExists(slug, { type: "POST", id })) return NextResponse.json({ success: false, error: "Ce slug est déjà utilisé." }, { status: 400 });
    
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
        categoryId
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
