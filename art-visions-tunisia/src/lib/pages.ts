import "server-only";
import { connection } from "next/server";
import { getDb } from "@/lib/db";
import type { Kind, Lang } from "@/lib/content-kinds";

/** A page is live when published, or scheduled with a date in the past. */
export const liveWhere = () => ({ OR: [{ status: "PUBLISHED" as const }, { status: "SCHEDULED" as const, publishedAt: { lte: new Date() } }] });

export async function getLive(kind: Kind, lang: Lang, slug: string) {
  await connection(); // request-time data: keeps the surrounding shell prerenderable
  const p = await getDb().page.findUnique({ where: { kind_lang_slug: { kind, lang, slug } } });
  if (!p) return null;
  const live = p.status === "PUBLISHED" || (p.status === "SCHEDULED" && !!p.publishedAt && p.publishedAt <= new Date());
  return live ? p : null;
}

export async function listLive(kind: Kind, lang: Lang, take = 50) {
  await connection();
  return getDb().page.findMany({
    where: { kind, lang, noindex: false, ...liveWhere() },
    orderBy: { publishedAt: "desc" },
    take,
    select: { slug: true, title: true, metaDescription: true, category: true, publishedAt: true },
  });
}
