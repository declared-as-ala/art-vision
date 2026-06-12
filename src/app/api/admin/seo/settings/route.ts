import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.sEOSettings.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        globalTitle: "Art Vision | Agence graphique & Studio créatif en France",
        globalDesc: "Art Vision est une agence de communication visuelle spécialisée en design graphique, branding, logo, vidéo, 3D, impression.",
        robotsTxt: "",
        googleSearchCons: "",
        schemaType: "WebSite"
      }
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET global SEO settings error:", error);
    return NextResponse.json({ success: false, error: "Database query error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { globalTitle, globalDesc, robotsTxt, googleSearchCons } = body;

    const settings = await prisma.sEOSettings.upsert({
      where: { id: "default" },
      update: {
        globalTitle,
        globalDesc,
        robotsTxt,
        googleSearchCons
      },
      create: {
        id: "default",
        globalTitle: globalTitle || "Art Vision | Agence graphique & Studio créatif en France",
        globalDesc: globalDesc || "Art Vision est une agence de communication visuelle spécialisée en design graphique, branding, logo, vidéo, 3D, impression.",
        robotsTxt: robotsTxt || "",
        googleSearchCons: googleSearchCons || "",
        schemaType: "WebSite"
      }
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("PUT global SEO settings error:", error);
    return NextResponse.json({ success: false, error: "Database update error" }, { status: 500 });
  }
}
