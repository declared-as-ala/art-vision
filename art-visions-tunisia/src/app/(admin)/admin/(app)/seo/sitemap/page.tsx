import { connection } from "next/server";
import { loadAudit } from "@/lib/audit";
import { SITE } from "@/lib/site";
import { AdminTitle, Card, StatusBadge } from "@/components/admin/ui";

export const metadata = { title: "Sitemap & indexation" };

export default async function SitemapView() {
  await connection();
  const items = await loadAudit();
  const inMap = items.filter((i) => i.indexable);
  const out = items.filter((i) => !i.indexable);
  return (
    <>
      <AdminTitle title="Sitemap & indexation" desc="URL incluses dans le sitemap et pages exclues (brouillons, noindex, projets non vérifiés).">
        <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="rounded-full border border-line px-4 py-2 text-sm hover:border-brand">Ouvrir sitemap.xml</a>
      </AdminTitle>
      <p className="mb-6 text-sm text-soft">Site : <span className="num">{SITE.url}</span>. Soumettez <span className="num">/sitemap.xml</span> dans votre propriété Google Search Console dédiée à ce domaine.</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6"><h2 className="font-semibold">Dans le sitemap ({inMap.length})</h2><ul className="mt-3 max-h-[32rem] divide-y divide-line overflow-y-auto text-sm" data-lenis-prevent>{inMap.map((i) => (<li key={i.kind + i.id} className="num py-2 text-xs">{i.path}</li>))}</ul></Card>
        <Card className="p-6"><h2 className="font-semibold">Exclues ({out.length})</h2><ul className="mt-3 divide-y divide-line text-sm">{out.map((i) => (<li key={i.kind + i.id} className="flex items-center justify-between py-2"><span className="num text-xs">{i.path}</span><StatusBadge s={i.status} /></li>))}{out.length === 0 && <li className="py-4 text-soft">Rien d&apos;exclu.</li>}</ul></Card>
      </div>
    </>
  );
}
