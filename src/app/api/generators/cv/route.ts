import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      profession,
      phone,
      email,
      address,
      about,
      skills,
      languages,
      experiences,
      education,
      projects,
      templateId,
      photoUrl,
    } = body;

    let template = await prisma.cVTemplate.findFirst({
      where: { id: templateId }
    });

    if (!template) {
      template = await prisma.cVTemplate.create({
        data: {
          id: templateId || "creative-agency",
          name: templateId === "tech" ? "Modern Tech" : "Creative Agency",
          layout: "{}",
        }
      });
    }

    const cv = await prisma.generatedCV.create({
      data: {
        templateId: template.id,
        name,
        profession,
        phone,
        email,
        address,
        about,
        skills,
        languages,
        experiences,
        education,
        projects,
        photoUrl,
      },
    });

    return NextResponse.json({ success: true, cvId: cv.id });
  } catch (error) {
    console.error("Error saving CV:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la sauvegarde." },
      { status: 500 }
    );
  }
}
