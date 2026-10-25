import { connection } from "next/server";
import { getDb } from "@/lib/db";
import { AdminTitle, Card } from "@/components/admin/ui";
import { ViewsChart } from "@/components/admin/views-chart";

export const metadata = { title: "Analytique" };

const DAYS = 30;
const daysAgo = (n: number) => new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z").getTime() - n * 86400_000;

export default async function Analytics() {
  await connection();
  const db = getDb();
  const from = new Date(daysAgo(DAYS - 1));
  const [rows, leads] = await Promise.all([
    db.pageView.findMany({ where: { day: { gte: from } } }),
    db.lead.count({ where: { createdAt: { gte: from } } }),
  ]);
  const total = rows.reduce((n, r) => n + r.count, 0);
  const byDay = new Map<string, number>();
  const byPath = new Map<string, number>();
  const byRef = new Map<string, number>();
  for (const r of rows) {
    const d = r.day.toISOString().slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + r.count);
    byPath.set(r.path, (byPath.get(r.path) ?? 0) + r.count);
    byRef.set(r.referrer || "Direct / inconnu", (byRef.get(r.referrer || "Direct / inconnu") ?? 0) + r.count);
  }
  const series = Array.from({ length: DAYS }, (_, i) => {
    const t = daysAgo(DAYS - 1 - i);
    const key = new Date(t).toISOString().slice(0, 10);
    return { day: new Date(t).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", timeZone: "UTC" }), views: byDay.get(key) ?? 0 };
  });
  const top = [...byPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const refs = [...byRef.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const conv = total > 0 ? ((leads / total) * 100).toFixed(1) : "0";
  const kpis: [string, string | number][] = [["Pages vues (30 j)", total], ["Pages distinctes", byPath.size], ["Demandes de devis (30 j)", leads], ["Vues → demandes", `${conv} %`]];
  return (
    <>
      <AdminTitle title="Analytique" desc="Mesure d'audience interne, sans cookie : aucune adresse IP, aucun identifiant, uniquement la page, la date et le site d'origine. Le signal « Do Not Track » est respecté." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(([k, v]) => (<Card key={k} className="p-5"><p className="text-sm text-soft">{k}</p><p className="num mt-2 text-4xl font-semibold text-indigo">{v}</p></Card>))}
      </div>
      <Card className="mt-6 p-6"><h2 className="mb-4 font-semibold">Pages vues par jour</h2>{total === 0 ? <p className="py-10 text-center text-sm text-soft">Aucune donnée pour l&apos;instant. Les visites apparaîtront ici dès que le site recevra du trafic.</p> : <ViewsChart data={series} />}</Card>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6"><h2 className="mb-3 font-semibold">Pages les plus vues</h2><ul className="divide-y divide-line text-sm">{top.map(([p, n]) => (<li key={p} className="flex justify-between py-2.5"><span className="num truncate text-xs">{p}</span><span className="num">{n}</span></li>))}{top.length === 0 && <li className="py-4 text-soft">—</li>}</ul></Card>
        <Card className="p-6"><h2 className="mb-3 font-semibold">Origine du trafic</h2><ul className="divide-y divide-line text-sm">{refs.map(([p, n]) => (<li key={p} className="flex justify-between py-2.5"><span className="truncate">{p}</span><span className="num">{n}</span></li>))}{refs.length === 0 && <li className="py-4 text-soft">—</li>}</ul></Card>
      </div>
      <p className="mt-6 text-xs text-soft">Pour les positions Google, impressions et clics réels, connectez Google Search Console (voir Réglages).</p>
    </>
  );
}
