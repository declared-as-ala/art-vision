import { connection } from "next/server";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { loadAudit } from "@/lib/audit";
import { AdminTitle, Card, ScoreBadge, fmtDate } from "@/components/admin/ui";
import { LeadsChart } from "@/components/admin/leads-chart";

export const metadata = { title: "Tableau de bord" };

const weeksAgo = (n: number) => new Date(Date.now() - n * 7 * 86400_000);
function bucketWeeks(leads: { createdAt: Date }[]) {
  return Array.from({ length: 8 }, (_, i) => {
    const end = weeksAgo(7 - i).getTime();
    return { week: new Date(end).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }), leads: leads.filter((l) => l.createdAt.getTime() > end - 7 * 86400_000 && l.createdAt.getTime() <= end).length };
  });
}

export default async function Overview() {
  await connection();
  const db = getDb();
  const since = weeksAgo(8);
  const [leads, recent, pages, published, drafts, redirects, activity, audit] = await Promise.all([
    db.lead.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.page.count(), db.page.count({ where: { status: "PUBLISHED" } }), db.page.count({ where: { status: "DRAFT" } }),
    db.redirect.count(),
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    loadAudit(),
  ]);
  const newCount = await db.lead.count({ where: { status: "NEW" } });
  const weeks = bucketWeeks(leads);
  const avg = Math.round(audit.reduce((n, a) => n + a.score, 0) / Math.max(1, audit.length));
  const worst = [...audit].sort((a, b) => a.score - b.score).slice(0, 5);
  const kpis = [
    { label: "Nouvelles demandes", value: newCount, href: "/admin/leads" },
    { label: "Pages publiées", value: published, sub: `${drafts} brouillon(s) · ${pages} au total`, href: "/admin/pages" },
    { label: "Score SEO moyen", value: avg, sub: "Outil éditorial, pas un classement", href: "/admin/seo" },
    { label: "Redirections", value: redirects, href: "/admin/seo/redirects" },
  ];
  return (
    <>
      <AdminTitle title="Tableau de bord" desc="Vue d'ensemble de votre site, de vos demandes et de la qualité SEO." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="rounded-2xl border border-line bg-white p-5 transition-colors hover:border-brand">
            <p className="text-sm text-soft">{k.label}</p>
            <p className="num mt-2 text-4xl font-semibold text-indigo">{k.value}</p>
            {k.sub && <p className="mt-1 text-xs text-soft">{k.sub}</p>}
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3"><h2 className="mb-4 font-semibold">Demandes par semaine</h2><LeadsChart data={weeks} /></Card>
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-3 font-semibold">Contenus à améliorer</h2>
          <ul className="divide-y divide-line">
            {worst.map((w) => (<li key={w.kind + w.id} className="flex items-center justify-between gap-3 py-2.5 text-sm"><Link href={w.editHref ?? "/admin/seo"} className="truncate hover:text-brand">{w.title}</Link><ScoreBadge n={w.score} /></li>))}
          </ul>
        </Card>
        <Card className="p-6 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Dernières demandes</h2><Link href="/admin/leads" className="text-sm text-brand">Tout voir</Link></div>
          {recent.length === 0 ? <p className="py-6 text-sm text-soft">Aucune demande pour l&apos;instant.</p> : (
            <ul className="divide-y divide-line">{recent.map((l) => (<li key={l.id} className="flex items-center justify-between gap-3 py-3 text-sm"><div className="min-w-0"><p className="truncate font-medium">{l.name}</p><p className="truncate text-xs text-soft">{l.service ?? "Service à définir"} · {fmtDate(l.createdAt)}</p></div><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${l.status === "NEW" ? "bg-brand text-white" : "bg-slate-100 text-slate-600"}`}>{({ NEW: "Nouveau", CONTACTED: "Contacté", QUOTED: "Devis envoyé", WON: "Gagné", LOST: "Perdu" } as Record<string, string>)[l.status]}</span></li>))}</ul>
          )}
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-3 font-semibold">Activité récente</h2>
          <ul className="space-y-2.5 text-sm">{activity.map((a) => (<li key={a.id}><span className="num text-xs text-soft">{fmtDate(a.createdAt)}</span><br />{a.action} · {a.entity}</li>))}{activity.length === 0 && <li className="text-soft">Rien pour l&apos;instant.</li>}</ul>
        </Card>
      </div>
    </>
  );
}
