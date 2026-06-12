import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET settings
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" }
    });
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

// PUT settings
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      brandName,
      slogan,
      email,
      phone,
      whatsapp,
      franceAddress,
      tunisiaAddress,
      googleAnalyticsId,
      googleTagManagerId,
      searchConsoleVerification,
      socialFb,
      socialIg,
      socialIn,
    } = body;

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        brandName,
        slogan,
        email,
        phone,
        whatsapp,
        franceAddress,
        tunisiaAddress,
        googleAnalyticsId,
        googleTagManagerId,
        searchConsoleVerification,
        socialFb,
        socialIg,
        socialIn,
      },
      create: {
        id: "default",
        logo: "https://art-visions.fr/wp-content/uploads/2025/10/logo1.svg",
        brandName: brandName || "Art Vision",
        slogan: slogan || "L’art au service de votre image.",
        email: email || "contact@art-visions.fr",
        phone: phone || "+33 2 43 00 00 00",
        whatsapp: whatsapp || "+33 6 00 00 00 00",
        franceAddress: franceAddress || "5 Rue de Constantine, 72000 Le Mans",
        tunisiaAddress: tunisiaAddress || "Bur 5, étage 5 Imm souk lybia, 5000 Monastir",
        googleAnalyticsId,
        googleTagManagerId,
        searchConsoleVerification,
        socialFb,
        socialIg,
        socialIn,
        primaryColor: "#08051F",
        secondaryColor: "#1A1238",
        accentColor: "#6C2BD9",
        creativeMagenta: "#D72888",
        orangeCta: "#FF6A00",
        softWhite: "#F8F7FC",
        lightGray: "#EDEAF5",
        textDark: "#171625",
      }
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("PUT settings error:", error);
    return NextResponse.json({ success: false, error: "Database upsert error" }, { status: 500 });
  }
}
