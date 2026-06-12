import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeSlug, revalidateContent, slugExists } from "@/lib/cms";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: { packages: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("GET services error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, icon, image, description, detailedBody, benefits, process, status } = body;
    const slug = normalizeSlug(body.slug || name);
    
    // Check if slug exists
    if (await slugExists(slug)) {
      return NextResponse.json({ success: false, error: "Un service avec ce slug (URL) existe déjà." }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: {
        name,
        slug,
        icon: icon || "Palette",
        image: image || null,
        description,
        detailedBody: detailedBody || "Description détaillée de la prestation.",
        benefits: benefits || "Avantage 1;Avantage 2;Avantage 3",
        process: process || "Cadrage & Briefing;Direction Artistique;Validation & BAT;Livraison",
        status: status || "PUBLISHED",
      }
    });
    revalidateContent("SERVICE", slug);
    return NextResponse.json({ success: true, service: newService });
  } catch (error) {
    console.error("POST service error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, icon, image, description, detailedBody, benefits, process, status } = body;
    const slug = normalizeSlug(body.slug || name);
    const previous = await prisma.service.findUnique({ where: { id } });
    if (await slugExists(slug, { type: "SERVICE", id })) return NextResponse.json({ success: false, error: "Ce slug est déjà utilisé." }, { status: 400 });
    const updated = await prisma.service.update({
      where: { id },
      data: {
        name,
        slug,
        icon,
        image,
        description,
        detailedBody,
        benefits,
        process,
        status: status || "PUBLISHED"
      }
    });
    revalidateContent("SERVICE", slug, previous?.slug);
    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("PUT service error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    
    const service = await prisma.service.delete({
      where: { id }
    });
    revalidateContent("SERVICE", service.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE service error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
