import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeSlug, revalidateContent, slugExists, sanitizeHtml } from "@/lib/cms";

// Resolve a category reference (real id, slug, or human label) to a valid
// PortfolioCategory.id, creating one when needed. Prevents FK failures when the
// client sends a slug-like id that doesn't exist yet.
async function resolveCategoryId(input?: string, label?: string): Promise<string> {
  const raw = (input || "").trim();
  if (raw) {
    const byId = await prisma.portfolioCategory.findUnique({ where: { id: raw } });
    if (byId) return byId.id;
    const bySlug = await prisma.portfolioCategory.findUnique({ where: { slug: normalizeSlug(raw) } });
    if (bySlug) return bySlug.id;
    const byName = await prisma.portfolioCategory.findFirst({ where: { name: label || raw } });
    if (byName) return byName.id;
    // Create a category from the provided reference so nothing is lost.
    const created = await prisma.portfolioCategory.create({
      data: { name: label || raw, slug: normalizeSlug(raw) },
    });
    return created.id;
  }
  const first = await prisma.portfolioCategory.findFirst();
  if (first) return first.id;
  const fallback = await prisma.portfolioCategory.create({ data: { name: "Branding", slug: "branding" } });
  return fallback.id;
}

export async function GET() {
  try {
    const [projects, categories] = await Promise.all([
      prisma.portfolioProject.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
      prisma.portfolioCategory.findMany({ orderBy: { name: "asc" } }),
    ]);
    return NextResponse.json({ success: true, projects, categories });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, client, industry, objective, challenge, solution, result, images, categoryId, categoryName, status } = body;
    const slug = normalizeSlug(body.slug || title);

    // Check if slug exists
    if (await slugExists(slug, { type: "PROJECT" })) {
      return NextResponse.json({ success: false, error: "Un projet avec ce slug (URL) existe déjà." }, { status: 400 });
    }

    // Always resolve to a real category id (handles slug-like or unknown values).
    const catId = await resolveCategoryId(categoryId, categoryName);

    const newProject = await prisma.portfolioProject.create({
      data: {
        title,
        slug,
        client,
        industry,
        objective: objective || "Objectif du projet.",
        challenge: challenge || "Défi rencontré.",
        solution: solution || "Solution proposée.",
        result: result || "Résultat du projet.",
        images: images || "/logo.png",
        categoryId: catId,
        status: status || "PUBLISHED",
      }
    });
    revalidateContent("PROJECT", slug);
    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    console.error("POST project error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, client, industry, objective, challenge, solution, result, images, categoryId, categoryName, status, customHtml } = body;
    const slug = normalizeSlug(body.slug || title);
    const previous = await prisma.portfolioProject.findUnique({ where: { id } });
    if (await slugExists(slug, { type: "PROJECT", id })) return NextResponse.json({ success: false, error: "Ce slug est déjà utilisé." }, { status: 400 });

    const catId = await resolveCategoryId(categoryId, categoryName);

    const updated = await prisma.portfolioProject.update({
      where: { id },
      data: {
        title,
        slug,
        client,
        industry,
        objective,
        challenge,
        solution,
        result,
        images,
        categoryId: catId,
        ...(customHtml !== undefined ? { customHtml: customHtml ? sanitizeHtml(String(customHtml)) : null } : {}),
        status: status || "PUBLISHED"
      }
    });
    revalidateContent("PROJECT", slug, previous?.slug);
    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("PUT project error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    
    const project = await prisma.portfolioProject.delete({
      where: { id }
    });
    revalidateContent("PROJECT", project.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE project error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
