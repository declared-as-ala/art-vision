import "server-only";
import { getDb } from "@/lib/db";
import { SITE } from "@/lib/site";
import { analyseBlocks, newId, type Block } from "@/lib/blocks";
import { runChecks, score, type Check, type SeoInput } from "@/lib/seo-score";
import { ARTICLES, ARTICLE_KEYWORDS } from "@/content/blog";
import { SERVICES } from "@/content/services";
import { PROJECTS } from "@/content/portfolio";
import { TOOLS } from "@/content/tools";
import { pagePath, type Kind, type Lang } from "@/lib/content-kinds";

export type AuditItem = {
  kind: "page" | "blog" | "service" | "portfolio" | "tool";
  id: string;
  title: string;
  path: string;
  editHref?: string;
  status: string;
  indexable: boolean;
  input: SeoInput;
  checks: Check[];
  score: number;
  keyword: string;
  outLinks: string[];
  inbound: number;
  words: number;
  dbId?: string;
  dbKind?: string;
};

const mk = (type: Block["type"], data: Block["data"]): Block => ({ id: newId(), type, data, style: { bg: "paper", space: "md", align: "left", hide: "none" } });
const base = { canonicalUrl: "", nofollow: false, ogImage: "", schemaType: "WebPage" };

const articleBlocks = (a: (typeof ARTICLES)[number]): Block[] => {
  const svc = SERVICES.find((s) => s.id === a.service);
  const out: Block[] = [mk("hero", { title: a.title, text: a.description })];
  for (const b of a.body) {
    if (b.t === "h2") out.push(mk("heading", { text: b.v, level: "2" }));
    else if (b.t === "p" || b.t === "tip") out.push(mk("text", { body: b.v }));
    else if (b.t === "ul") out.push(mk("text", { body: b.v.map((x) => `- ${x}`).join("\n") }));
  }
  if (svc) out.push(mk("cta", { title: svc.fr.name, href: `/services/${svc.slugs.fr}`, label: "En savoir plus" }));
  out.push(mk("cta", { title: "Devis", href: "/contact", label: "Devis" }));
  return out;
};
const serviceBlocks = (s: (typeof SERVICES)[number]): Block[] => [
  mk("hero", { title: s.fr.h1, text: s.fr.intro, ctaHref: `/contact?service=${s.slugs.fr}`, ctaLabel: "Devis" }),
  mk("features", { title: "Ce que vous recevez", items: s.fr.deliverables.map((d) => ({ title: d, text: "" })) }),
  mk("process", { title: "Notre processus", items: s.fr.process }),
  mk("faq", { title: "Questions fréquentes", items: s.fr.faqs.map((f) => ({ q: f.q, a: f.a })) }),
  mk("services", { title: "Autres services" }),
  mk("cta", { title: "Devis", href: "/contact", label: "Devis" }),
];

export async function loadAudit(): Promise<AuditItem[]> {
  type Row = Omit<AuditItem, "checks" | "score" | "inbound" | "outLinks" | "words"> & { blocks: Block[] };
  const rows: (Row & { dbId?: string; dbKind?: string })[] = [];

  const pages = await getDb().page.findMany({ orderBy: { updatedAt: "desc" } });
  for (const p of pages) {
    const blocks = p.blocks as unknown as Block[];
    rows.push({
      kind: "page", id: p.id, dbId: p.id, dbKind: p.kind, title: p.title, path: pagePath(p.kind as Kind, p.lang as Lang, p.slug), editHref: `/admin/pages/${p.id}`, status: p.status,
      indexable: !p.noindex && p.status === "PUBLISHED", keyword: p.primaryKeyword ?? "", blocks,
      input: {
        title: p.title, seoTitle: p.seoTitle ?? "", metaDescription: p.metaDescription ?? "", slug: p.slug, keyword: p.primaryKeyword ?? "",
        canonicalUrl: p.canonicalUrl ?? "", noindex: p.noindex, nofollow: p.nofollow, ogImage: p.ogImage ?? "", schemaType: p.schemaType, blocks, status: p.status,
      },
    });
  }
  for (const a of ARTICLES) {
    const blocks = articleBlocks(a);
    rows.push({ kind: "blog", id: a.slug, title: a.title, path: `/blog/${a.slug}`, status: "PUBLISHED", indexable: true, keyword: ARTICLE_KEYWORDS[a.slug] ?? "", blocks,
      input: { ...base, title: a.title, seoTitle: a.seoTitle, metaDescription: a.description, slug: a.slug, keyword: ARTICLE_KEYWORDS[a.slug] ?? "", noindex: false, blocks, status: "PUBLISHED", schemaType: "Article" } });
  }
  for (const s of SERVICES) {
    const blocks = serviceBlocks(s);
    rows.push({ kind: "service", id: s.id, title: s.fr.name, path: `/services/${s.slugs.fr}`, status: "PUBLISHED", indexable: true, keyword: s.keyword, blocks,
      input: { ...base, title: s.fr.h1, seoTitle: s.fr.seoTitle, metaDescription: s.fr.seoDescription, slug: s.slugs.fr, keyword: s.keyword, noindex: false, blocks, status: "PUBLISHED", schemaType: "Service" } });
  }
  for (const p of PROJECTS) {
    const blocks = [mk("hero", { title: p.title, text: p.objective }), mk("text", { body: `${p.challenge}\n\n${p.solution}` }), mk("cta", { title: "Devis", href: "/contact", label: "Devis" })];
    rows.push({ kind: "portfolio", id: p.slug, title: p.title, path: `/portfolio/${p.slug}`, status: p.verified ? "PUBLISHED" : "UNVERIFIED", indexable: p.verified, keyword: "", blocks,
      input: { ...base, title: p.title, seoTitle: `${p.title} | Réalisation Art Visions`, metaDescription: p.objective, slug: p.slug, keyword: "", noindex: !p.verified, blocks, status: "PUBLISHED" } });
  }
  for (const t of TOOLS) {
    const blocks = [mk("hero", { title: t.name, text: t.text }), mk("text", { body: t.about }), mk("cta", { title: "Devis", href: "/contact", label: "Devis" })];
    rows.push({ kind: "tool", id: t.slug, title: t.name, path: `/outils-gratuits/${t.slug}`, status: "PUBLISHED", indexable: true, keyword: "", blocks,
      input: { ...base, title: t.name, seoTitle: t.seoTitle, metaDescription: t.seoDescription, slug: t.slug, keyword: "", noindex: false, blocks, status: "PUBLISHED", schemaType: "WebApplication" } });
  }

  // A builder item with the same public path replaces the code version: audit it once.
  const overridden = new Set(rows.filter((r) => r.dbId).map((r) => r.path));
  for (let i = rows.length - 1; i >= 0; i--) if (!rows[i].dbId && overridden.has(rows[i].path)) rows.splice(i, 1);

  // inbound links: hub listing pages link to every static item; DB pages need real links.
  const hubs = new Set(["blog", "service", "portfolio", "tool"]);
  const outgoing = rows.map((r) => analyseBlocks(r.blocks).internalLinks.map((l) => l.split("#")[0].split("?")[0].replace(SITE.url, "")));
  const inboundCount = (path: string, self: number) => outgoing.reduce((n, links, i) => (i !== self && links.includes(path) ? n + 1 : n), 0);

  return rows.map((r, i) => {
    const others = rows.filter((_, j) => j !== i);
    const ctx = { titles: others.map((o) => o.input.seoTitle).filter(Boolean), descriptions: others.map((o) => o.input.metaDescription).filter(Boolean), keywords: others.map((o) => o.keyword).filter(Boolean) };
    const checks = runChecks(r.input, ctx);
    const an = analyseBlocks(r.blocks);
    const { blocks: _b, ...rest } = r;
    void _b;
    return { ...rest, checks, score: score(checks), outLinks: outgoing[i], words: an.words, inbound: hubs.has(r.kind) || (r.dbKind && r.dbKind !== "page" && r.input.status === "PUBLISHED") ? Math.max(1, inboundCount(r.path, i)) : inboundCount(r.path, i) };
  });
}
