import { connection } from "next/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { loadAudit } from "@/lib/audit";
import { getDb } from "@/lib/db";
import { KINDS, KIND_KEYS, isKind, pagePath, type Kind, type Lang } from "@/lib/content-kinds";
import { CodeContent } from "@/components/admin/code-content";
import { AdminTitle, Card, ScoreBadge, StatusBadge, fmtDate } from "@/components/admin/ui";

export const metadata = { title: "Pages" };

export default async function PagesList({ searchParams }: PageProps<"/admin/pages">) {
  await connection();
  const sp = await searchParams;
  const kind: Kind | null = isKind(sp.kind) ? sp.kind : null;
  const [audit, pages] = await Promise.all([loadAudit(), getDb().page.findMany({ where: kind ? { kind } : {}, orderBy: { updatedAt: "desc" } })]);
  const score = new Map(audit.filter((a) => a.dbId).map((a) => [a.dbId, a.score]));
  return (
    <>
      <AdminTitle title="Pages & contenus" desc="Créez et optimisez pages, articles, projets et services sans écrire de code.">
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/pages/new?kind=${kind ?? "page"}`} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-ink"><Plus size={16} />Nouveau {KINDS[kind ?? "page"].label.toLowerCase()}</Link>
        </div>
      </AdminTitle>
      <nav aria-label="Filtrer par type" className="mb-5 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/pages" className={`rounded-full px-3.5 py-1.5 ${!kind ? "bg-indigo text-white" : "bg-white ring-1 ring-line hover:ring-brand"}`}>Tous</Link>
        {KIND_KEYS.map((k) => (<Link key={k} href={`/admin/pages?kind=${k}`} className={`rounded-full px-3.5 py-1.5 ${kind === k ? "bg-indigo text-white" : "bg-white ring-1 ring-line hover:ring-brand"}`}>{KINDS[k].plural}</Link>))}
      </nav>
      {pages.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="font-medium">Aucun contenu pour l&apos;instant</p>
          <p className="mt-1 text-sm text-soft">Créez votre premier contenu depuis un modèle.</p>
          <Link href={`/admin/pages/new?kind=${kind ?? "page"}`} className="mt-5 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white">Créer</Link>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-soft">
              <tr>{["Titre", "Type", "URL", "Statut", "SEO", "Mise à jour"].map((h) => (<th key={h} className="p-4 text-start font-medium">{h}</th>))}</tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper">
                  <td className="p-4">
                    <Link href={`/admin/pages/${p.id}`} className="font-medium text-indigo hover:text-brand">{p.title}</Link>
                    {p.lang === "ar" && <span className="ms-2 rounded bg-tint-violet px-1.5 py-0.5 text-[10px] text-indigo">AR</span>}
                    {p.noindex && <span className="ms-2 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">noindex</span>}
                  </td>
                  <td className="p-4 text-soft">{KINDS[p.kind as Kind].label}</td>
                  <td className="num p-4 text-xs text-soft">{pagePath(p.kind as Kind, p.lang as Lang, p.slug)}</td>
                  <td className="p-4"><StatusBadge s={p.status} /></td>
                  <td className="p-4"><ScoreBadge n={score.get(p.id) ?? 0} /></td>
                  <td className="num p-4 text-xs text-soft">{fmtDate(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {!kind && <CodeContent />}
    </>
  );
}
