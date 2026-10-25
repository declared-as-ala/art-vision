import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const canonicalSitemap = "https://art-visions.fr/sitemap.xml";
  let robotsText = "";

  try {
    const seoSettings = await prisma.sEOSettings.findUnique({
      where: { id: "default" }
    });

    if (seoSettings && seoSettings.robotsTxt) {
      robotsText = seoSettings.robotsTxt;
      // Strip any legacy Vercel domain sitemap
      if (robotsText.includes("vercel.app") || robotsText.includes("Sitemap:")) {
        robotsText = robotsText.replace(/Sitemap:\s*https?:\/\/[^\s]+/gi, `Sitemap: ${canonicalSitemap}`);
      }
    }
  } catch (error) {
    console.error("Error fetching robots.txt from DB:", error);
  }

  // Fallback to standard SEO rules if database query returns empty or fails
  if (!robotsText) {
    robotsText = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

Sitemap: ${canonicalSitemap}`;
  } else if (!robotsText.includes("Sitemap:")) {
    robotsText = `${robotsText.trim()}\n\nSitemap: ${canonicalSitemap}`;
  }

  return new Response(robotsText, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600, must-revalidate"
    }
  });
}
