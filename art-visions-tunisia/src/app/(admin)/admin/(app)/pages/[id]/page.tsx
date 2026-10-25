import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { can, requireUser } from "@/lib/auth";
import type { Block } from "@/lib/blocks";
import { loadAudit } from "@/lib/audit";
import { PageBuilder, type BuilderPage } from "@/components/admin/builder/page-builder";

export const metadata = { title: "Éditeur de page" };

export default async function EditPage({ params }: PageProps<"/admin/pages/[id]">) {
  await connection();
  const { id } = await params;
  const user = await requireUser();
  const db = getDb();
  const [p, revisions, audit, sections] = await Promise.all([
    db.page.findUnique({ where: { id } }),
    db.pageRevision.findMany({ where: { pageId: id }, orderBy: { createdAt: "desc" }, take: 40, select: { id: true, note: true, createdAt: true } }),
    loadAudit(),
    db.savedSection.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, type: true } }),
  ]);
  if (!p) notFound();
  const author = p.authorId ? await db.user.findUnique({ where: { id: p.authorId }, select: { name: true } }) : null;
  const twins = await db.page.findMany({ where: { kind: p.kind, id: { not: id } }, select: { id: true, title: true, lang: true }, orderBy: { title: "asc" } });
  const others = audit.filter((a) => !(a.kind === "page" && a.id === id));
  const page: BuilderPage = {
    id: p.id, title: p.title, slug: p.slug, template: p.template, status: p.status, lang: p.lang as "fr" | "ar",
    blocks: p.blocks as unknown as Block[], primaryKeyword: p.primaryKeyword ?? "", secondaryKeywords: p.secondaryKeywords,
    seoTitle: p.seoTitle ?? "", metaDescription: p.metaDescription ?? "", canonicalUrl: p.canonicalUrl ?? "", noindex: p.noindex, nofollow: p.nofollow,
    ogTitle: p.ogTitle ?? "", ogDescription: p.ogDescription ?? "", ogImage: p.ogImage ?? "", breadcrumbLabel: p.breadcrumbLabel ?? "",
    schemaType: p.schemaType, navVisible: p.navVisible, publishedAt: p.publishedAt?.toISOString() ?? null, updatedAt: p.updatedAt.toISOString(),
    authorName: author?.name ?? null, hadPublished: !!p.publishedAt,
    kind: p.kind as BuilderPage["kind"], category: p.category ?? "", translationId: p.translationId,
  };
  return (
    <PageBuilder
      page={page}
      sections={sections}
      translations={twins}
      revisions={revisions.map((r) => ({ id: r.id, note: r.note, createdAt: r.createdAt.toISOString() }))}
      ctx={{ titles: others.map((o) => o.input.seoTitle).filter(Boolean), descriptions: others.map((o) => o.input.metaDescription).filter(Boolean), keywords: others.map((o) => o.keyword).filter(Boolean) }}
      perms={{ edit: can(user.role, "page.edit"), seo: can(user.role, "page.seo"), publish: can(user.role, "page.publish"), del: can(user.role, "page.delete") }}
    />
  );
}
