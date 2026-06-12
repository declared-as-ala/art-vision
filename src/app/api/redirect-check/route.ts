import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple in-memory cache for redirects
let cachedRedirects: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 60000; // 60 seconds cache

// Export a helper to clear cache when redirects change
export function clearRedirectsCache() {
  cachedRedirects = null;
  lastCacheTime = 0;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  if (!path) {
    return NextResponse.json({ redirect: null });
  }

  try {
    const decodedPath = decodeURIComponent(path);
    const cleanPath = decodedPath !== "/" && decodedPath.endsWith("/")
      ? decodedPath.slice(0, -1)
      : decodedPath;

    const now = Date.now();
    // Refresh cache if expired or empty
    if (!cachedRedirects || (now - lastCacheTime > CACHE_TTL)) {
      cachedRedirects = await prisma.redirect.findMany({
        where: { active: true }
      });
      lastCacheTime = now;
    }

    // Match in-memory cached redirects
    const redirect = cachedRedirects.find(r => {
      const src = r.sourceUrl;
      return src === cleanPath || src === cleanPath + "/" || (src.endsWith("/") ? src.slice(0, -1) : src + "/") === cleanPath;
    });

    if (redirect) {
      // Increment hitCount in background
      prisma.redirect.update({
        where: { id: redirect.id },
        data: { hitCount: { increment: 1 } }
      }).catch(err => console.error("Error updating redirect hitCount:", err));

      return NextResponse.json({ redirect });
    }
  } catch (error) {
    console.error("Redirect check database error:", error);
  }

  return NextResponse.json({ redirect: null });
}
