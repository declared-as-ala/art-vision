import type { MetadataRoute } from "next";
import { SERVICES } from "@/content/services";
import { PROJECTS } from "@/content/portfolio";
import { ARTICLES } from "@/content/blog";
import { TOOLS } from "@/content/tools";
import { SITE } from "@/lib/site";
import { getDb } from "@/lib/db";
import { liveWhere } from "@/lib/pages";
import { pagePath, type Kind, type Lang } from "@/lib/content-kinds";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (p: string) => `${SITE.url}${p === "/" ? "" : p}`;
  const pair = (fr: string, ar: string) => ({ url: u(fr), alternates: { languages: { "fr-TN": u(fr), "ar-TN": u(ar) } } });

  // Published, indexable builder content. The DB may be unreachable at build time (e.g. Docker image build).
  let dynamic: MetadataRoute.Sitemap = [];
  try {
    const pages = await getDb().page.findMany({ where: { noindex: false, ...liveWhere() }, select: { id: true, kind: true, lang: true, slug: true, updatedAt: true, translationId: true } });
    const byId = new Map(pages.map((p) => [p.id, p]));
    dynamic = pages.map((p) => {
      const self = u(pagePath(p.kind as Kind, p.lang as Lang, p.slug));
      const twin = p.translationId ? byId.get(p.translationId) : undefined;
      const entry: MetadataRoute.Sitemap[number] = { url: self, lastModified: p.updatedAt };
      if (twin) {
        const other = u(pagePath(twin.kind as Kind, twin.lang as Lang, twin.slug));
        const [fr, ar] = p.lang === "fr" ? [self, other] : [other, self];
        entry.alternates = { languages: { "fr-TN": fr, "ar-TN": ar } };
      }
      return entry;
    });
  } catch { /* fall through with static URLs only */ }

  return [
    pair("/", "/ar"),
    pair("/services", "/ar/services"),
    pair("/contact", "/ar/contact"),
    ...SERVICES.map((s) => pair(`/services/${s.slugs.fr}`, `/ar/services/${s.slugs.ar}`)),
    { url: u("/portfolio") },
    ...PROJECTS.filter((p) => p.verified).map((p) => ({ url: u(`/portfolio/${p.slug}`) })),
    { url: u("/blog") },
    ...ARTICLES.map((a) => ({ url: u(`/blog/${a.slug}`), lastModified: a.date })),
    { url: u("/outils-gratuits") },
    ...TOOLS.map((t) => ({ url: u(`/outils-gratuits/${t.slug}`) })),
    ...dynamic,
  ].filter((e, i, arr) => arr.findIndex((x) => x.url === e.url) === i); // drop duplicates (e.g. an edited copy of a code page)
}
