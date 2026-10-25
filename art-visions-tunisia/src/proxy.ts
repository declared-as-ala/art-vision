import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ARTICLES } from "@/content/blog";
import { PROJECTS } from "@/content/portfolio";
import { SERVICES } from "@/content/services";
import type { Kind, Lang } from "@/lib/content-kinds";

/**
 * 1) Admin gate: cheap first check (real validation happens server-side in requireUser()).
 * 2) Public status codes: streamed pages cannot change status after the shell is sent, so builder
 *    URLs are resolved here → real 301 for retired slugs, real 404 for unknown ones.
 */

const STATIC_ROOT = new Set(["services", "blog", "contact", "portfolio", "outils-gratuits", "ar", "admin", "api"]);
const STATIC_AR = new Set(["services", "contact"]);
const STATIC_SLUGS = {
  blog: new Set(ARTICLES.map((a) => a.slug)),
  portfolio: new Set(PROJECTS.map((p) => p.slug)),
  "services-fr": new Set(SERVICES.map((s) => s.slugs.fr)),
  "services-ar": new Set(SERVICES.map((s) => s.slugs.ar)),
};

type Target = { kind: Kind; lang: Lang; slug: string; staticHit: boolean };

function classify(path: string): Target | null {
  const p = path.replace(/\/+$/, "") || "/";
  let m = p.match(/^\/([^/]+)$/);
  if (m && !STATIC_ROOT.has(m[1])) return { kind: "page", lang: "fr", slug: m[1], staticHit: false };
  if ((m = p.match(/^\/blog\/([^/]+)$/))) return { kind: "article", lang: "fr", slug: m[1], staticHit: STATIC_SLUGS.blog.has(m[1]) };
  if ((m = p.match(/^\/portfolio\/([^/]+)$/))) return { kind: "project", lang: "fr", slug: m[1], staticHit: STATIC_SLUGS.portfolio.has(m[1]) };
  if ((m = p.match(/^\/services\/([^/]+)$/))) return { kind: "service", lang: "fr", slug: m[1], staticHit: STATIC_SLUGS["services-fr"].has(m[1]) };
  if ((m = p.match(/^\/ar\/services\/([^/]+)$/))) return { kind: "service", lang: "ar", slug: m[1], staticHit: STATIC_SLUGS["services-ar"].has(m[1]) };
  if ((m = p.match(/^\/ar\/([^/]+)$/)) && !STATIC_AR.has(m[1])) return { kind: "page", lang: "ar", slug: m[1], staticHit: false };
  return null;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = req.cookies.has("avtn_session");

  if (pathname.startsWith("/api/admin")) return authed ? NextResponse.next() : NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (pathname.startsWith("/admin")) return authed || pathname === "/admin/login" ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", req.url));

  if (pathname === "/home" || pathname === "/ar/home") return NextResponse.rewrite(new URL("/__not-found__/x", req.url), { status: 404 });

  const t = req.method === "GET" || req.method === "HEAD" ? classify(pathname) : null;
  if (!t || t.staticHit) return NextResponse.next();

  try {
    const db = getDb();
    const live = await db.page.findFirst({
      where: { kind: t.kind, lang: t.lang, slug: t.slug, OR: [{ status: "PUBLISHED" }, { status: "SCHEDULED", publishedAt: { lte: new Date() } }] },
      select: { id: true },
    });
    if (live) return NextResponse.next();
    const redirect = await db.redirect.findUnique({ where: { fromPath: pathname.replace(/\/+$/, "") } });
    if (redirect) {
      const dest = /^https?:\/\//.test(redirect.toPath) ? redirect.toPath : new URL(redirect.toPath, req.url).toString();
      return NextResponse.redirect(dest, redirect.permanent ? 301 : 302);
    }
  } catch {
    return NextResponse.next(); // DB unavailable: let the page decide rather than serving a false 404
  }
  // Nothing matches: serve the site's not-found UI with a real 404 status.
  return NextResponse.rewrite(new URL("/__not-found__/x", req.url), { status: 404 });
}

// Everything except Next internals, API (other than admin) and files with an extension.
export const config = { matcher: ["/((?!_next/|api/(?!admin)|brand/|favicon|.*\\..*).*)"] };
