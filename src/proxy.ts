import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect admin routes (Except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("art_vision_session")?.value;
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
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
      const redirect = await prisma.redirect.findFirst({
        where: {
          active: true,
          OR: [
            { sourceUrl: cleanPath },
            { sourceUrl: cleanPath === "/" ? "/" : `${cleanPath}/` },
          ],
        },
      });

      if (redirect) {
        const targetUrl = redirect.targetUrl.startsWith("http")
          ? new URL(redirect.targetUrl)
          : new URL(redirect.targetUrl, request.url);
        return NextResponse.redirect(targetUrl, redirect.statusCode || 301);
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
