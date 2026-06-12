import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      jobTitle,
      phone,
      email,
      address,
      website,
      socials,
      templateId,
      colors,
      qrData,
    } = body;

    // Check templates exist, if not fetch first template or fallback
    let template = await prisma.businessCardTemplate.findFirst({
      where: { id: templateId }
    });

    if (!template) {
      // Create template if missing
      template = await prisma.businessCardTemplate.create({
        data: {
          id: templateId || "modern-minimalist",
          name: templateId === "creative" ? "Creative Gradient" : "Modern Minimalist",
          layout: colors || "{}",
        }
      });
    }

    const card = await prisma.generatedBusinessCard.create({
      data: {
        templateId: template.id,
        name,
        jobTitle,
        phone,
        email,
        address,
        website,
        socials,
        colors,
        qrData,
      },
    });

    return NextResponse.json({ success: true, cardId: card.id });
  } catch (error) {
    console.error("Error saving business card:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la sauvegarde." },
      { status: 500 }
    );
  }
}
