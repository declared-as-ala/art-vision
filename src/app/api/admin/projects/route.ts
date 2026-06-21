import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeSlug, revalidateContent, slugExists } from "@/lib/cms";

export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, client, industry, objective, challenge, solution, result, images, categoryId, status } = body;
    const slug = normalizeSlug(body.slug || title);
    
    // Check if slug exists
    if (await slugExists(slug, { type: "PROJECT" })) {
      return NextResponse.json({ success: false, error: "Un projet avec ce slug (URL) existe déjà." }, { status: 400 });
    }

    // Default category fallback
    let catId = categoryId;
    if (!catId) {
      const cat = await prisma.portfolioCategory.findFirst();
      if (cat) {
        catId = cat.id;
      } else {
        // Create dynamic category
        const newCat = await prisma.portfolioCategory.create({
          data: { name: "Branding", slug: "branding" }
        });
        catId = newCat.id;
      }
    }

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
    const { id, title, client, industry, objective, challenge, solution, result, images, categoryId, status } = body;
    const slug = normalizeSlug(body.slug || title);
    const previous = await prisma.portfolioProject.findUnique({ where: { id } });
    if (await slugExists(slug, { type: "PROJECT", id })) return NextResponse.json({ success: false, error: "Ce slug est déjà utilisé." }, { status: 400 });
    
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
        categoryId,
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
