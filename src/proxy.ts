import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { cached } from "@/lib/cache";

// Load active redirects once and cache for 5 min, instead of a DB query on
// every page navigation. Returns a Map keyed by source path.
async function getRedirects() {
  return cached("redirects", 5 * 60_000, async () => {
    const rows = await prisma.redirect.findMany({
      where: { active: true },
      select: { sourceUrl: true, targetUrl: true, statusCode: true },
    });
    const map = new Map<string, { targetUrl: string; statusCode: number }>();
    for (const r of rows) map.set(r.sourceUrl.replace(/\/$/, "") || "/", { targetUrl: r.targetUrl, statusCode: r.statusCode || 301 });
    return map;
  });
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect admin routes (Except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("art_vision_session")?.value;
    if (!session || isTokenExpired(session)) {
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      if (session) response.cookies.delete("art_vision_session");
      return response;
    }
    return NextResponse.next();
  }

  // 2. Perform dynamic redirect checks without recursively fetching this app.
  if (
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".")
  ) {
    try {
      const cleanPath = pathname !== "/" && pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname;
      const redirects = await getRedirects();
      const redirect = redirects.get(cleanPath || "/");

      if (redirect) {
        const targetUrl = redirect.targetUrl.startsWith("http")
          ? new URL(redirect.targetUrl)
          : new URL(redirect.targetUrl, request.url);
        return NextResponse.redirect(targetUrl, redirect.statusCode);
      }
    } catch (e) {
      console.error("Proxy redirects query failed:", e);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png (logo file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)",
  ],
};
