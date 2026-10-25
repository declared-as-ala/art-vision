import { connection } from "next/server";
import Link from "next/link";
import { loadAudit } from "@/lib/audit";
import { AdminTitle, Card } from "@/components/admin/ui";

export const metadata = { title: "Maillage interne" };

export default async function Links() {
  await connection();
  const items = await loadAudit();
  const orphans = items.filter((i) => i.inbound === 0 && i.indexable);
  const thin = items.filter((i) => i.outLinks.length < 2);
  return (
    <>
      <AdminTitle title="Maillage interne" desc="Pages orphelines (aucun lien entrant) et pages qui envoient trop peu de liens internes." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-semibold">Pages orphelines ({orphans.length})</h2>
          <p className="mt-1 text-xs text-soft">Aucune autre page ne pointe vers elles. Ajoutez un lien depuis un texte, un CTA ou activez l&apos;affichage dans le pied de page.</p>
          <ul className="mt-4 divide-y divide-line text-sm">{orphans.map((o) => (<li key={o.id} className="flex justify-between py-2.5"><Link href={o.editHref ?? "#"} className="hover:text-brand">{o.title}</Link><span className="num text-xs text-soft">{o.path}</span></li>))}{orphans.length === 0 && <li className="py-4 text-soft">Aucune page orpheline. 🎉</li>}</ul>
        </Card>
        <Card className="p-6">
          <h2 className="font-semibold">Peu de liens sortants ({thin.length})</h2>
          <ul className="mt-4 divide-y divide-line text-sm">{thin.map((o) => (<li key={o.kind + o.id} className="flex justify-between py-2.5"><span>{o.title}</span><span className="num text-xs text-soft">{o.outLinks.length} lien(s)</span></li>))}{thin.length === 0 && <li className="py-4 text-soft">Toutes les pages ont au moins 2 liens internes.</li>}</ul>
        </Card>
      </div>
      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-sm"><thead className="border-b border-line text-xs uppercase tracking-wider text-soft"><tr>{["Page", "Liens entrants", "Liens sortants"].map((h) => (<th key={h} className="p-4 text-start font-medium">{h}</th>))}</tr></thead>
          <tbody>{items.map((i) => (<tr key={i.kind + i.id} className="border-b border-line last:border-0"><td className="p-4">{i.title}<span className="num ms-2 text-xs text-soft">{i.path}</span></td><td className="num p-4">{i.inbound}</td><td className="num p-4">{i.outLinks.length}</td></tr>))}</tbody></table>
      </Card>
    </>
  );
}
