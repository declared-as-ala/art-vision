import { connection } from "next/server";
import Link from "next/link";
import { loadAudit, type AuditItem } from "@/lib/audit";
import { AdminTitle, Card, ScoreBadge } from "@/components/admin/ui";

export const metadata = { title: "Vue SEO & audits" };

const KIND: Record<AuditItem["kind"], string> = { page: "Page", blog: "Article", service: "Service", portfolio: "Portfolio", tool: "Outil" };

export default async function SeoOverview() {
  await connection();
  const items = await loadAudit();
  const avg = Math.round(items.reduce((n, a) => n + a.score, 0) / Math.max(1, items.length));
  // Aggregate failing checks across the site, most frequent first.
  const issues = new Map<string, { label: string; hint: string; level: string; items: AuditItem[] }>();
  for (const it of items) for (const c of it.checks) if (!c.pass) {
    const e = issues.get(c.id) ?? { label: c.label, hint: c.hint, level: c.level, items: [] };
    e.items.push(it); issues.set(c.id, e);
  }
  const list = [...issues.entries()].sort((a, b) => (a[1].level === "error" ? 0 : 1) - (b[1].level === "error" ? 0 : 1) || b[1].items.length - a[1].items.length);
  const noindex = items.filter((i) => !i.indexable).length;
  return (
    <>
      <AdminTitle title="Vue SEO & audits" desc="Analyse transparente de toutes les pages du site. Le score est un outil éditorial : il ne prédit pas le classement Google." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-sm text-soft">Score moyen</p><p className="num mt-2 text-4xl font-semibold text-indigo">{avg}</p></Card>
        <Card className="p-5"><p className="text-sm text-soft">Contenus analysés</p><p className="num mt-2 text-4xl font-semibold text-indigo">{items.length}</p></Card>
        <Card className="p-5"><p className="text-sm text-soft">Non indexables</p><p className="num mt-2 text-4xl font-semibold text-indigo">{noindex}</p></Card>
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Problèmes détectés</h2>
      {list.length === 0 ? <Card className="p-8 text-center text-sm text-soft">Aucun problème détecté.</Card> : (
        <div className="space-y-3">
          {list.map(([id, e]) => (
            <Card key={id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div><p className="font-medium">{e.label}</p><p className="mt-0.5 text-xs text-soft">{e.hint}</p></div>
                <span className={`num shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${e.level === "error" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{e.items.length}</span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-1.5">{e.items.slice(0, 12).map((it) => (<li key={it.kind + it.id}><Link href={it.editHref ?? "/admin/content/" + (it.kind === "blog" ? "blog" : it.kind === "service" ? "services" : it.kind === "portfolio" ? "portfolio" : "tools")} className="rounded-full bg-paper px-2.5 py-1 text-xs ring-1 ring-line hover:ring-brand">{it.title.slice(0, 34)}</Link></li>))}{e.items.length > 12 && <li className="px-2 py-1 text-xs text-soft">+{e.items.length - 12}</li>}</ul>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-3 mt-10 text-lg font-semibold">Scores par contenu</h2>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-soft"><tr>{["Contenu", "Type", "URL", "Mots", "Score"].map((h) => (<th key={h} className="p-4 text-start font-medium">{h}</th>))}</tr></thead>
          <tbody>{[...items].sort((a, b) => a.score - b.score).map((it) => (
            <tr key={it.kind + it.id} className="border-b border-line last:border-0">
              <td className="p-4">{it.editHref ? <Link href={it.editHref} className="font-medium hover:text-brand">{it.title}</Link> : it.title}</td>
              <td className="p-4 text-soft">{KIND[it.kind]}</td><td className="num p-4 text-xs text-soft">{it.path}</td><td className="num p-4">{it.words}</td><td className="p-4"><ScoreBadge n={it.score} /></td>
            </tr>))}</tbody>
        </table>
      </Card>
    </>
  );
}
