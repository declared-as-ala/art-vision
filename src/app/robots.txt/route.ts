import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";
  let robotsText = "";

  try {
    const seoSettings = await prisma.sEOSettings.findUnique({
      where: { id: "default" }
    });

    if (seoSettings && seoSettings.robotsTxt) {
      robotsText = seoSettings.robotsTxt;
    }
  } catch (error) {
    console.error("Error fetching robots.txt from DB:", error);
  }

  // Fallback to standard SEO rules if database query returns empty or fails
  if (!robotsText) {
    robotsText = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;
  }

  return new Response(robotsText, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600, must-revalidate"
    }
  });
}
