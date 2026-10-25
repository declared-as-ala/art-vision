import { connection } from "next/server";
import { loadAudit } from "@/lib/audit";
import { AdminTitle, Card, ScoreBadge } from "@/components/admin/ui";

export const metadata = { title: "Mots-clés" };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

export default async function Keywords() {
  await connection();
  const items = (await loadAudit()).filter((i) => i.keyword);
  const byKw = new Map<string, typeof items>();
  for (const i of items) byKw.set(norm(i.keyword), [...(byKw.get(norm(i.keyword)) ?? []), i]);
  const conflicts = [...byKw.values()].filter((g) => g.length > 1);
  const missing = (await loadAudit()).filter((i) => !i.keyword && i.kind !== "portfolio");
  return (
    <>
      <AdminTitle title="Mots-clés" desc="Carte des mots-clés cibles par URL et détection de cannibalisation. Les volumes et positions réels nécessitent la connexion à Google Search Console (non configurée)." />
      {conflicts.length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50/50 p-5">
          <p className="font-medium text-red-800">Cannibalisation possible</p>
          <ul className="mt-2 space-y-1 text-sm">{conflicts.map((g) => (<li key={g[0].keyword}>« {g[0].keyword} » est ciblé par : {g.map((x) => x.path).join(", ")}</li>))}</ul>
        </Card>
      )}
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-soft"><tr>{["Mot-clé cible", "URL", "Dans titre", "Dans H1", "Score"].map((h) => (<th key={h} className="p-4 text-start font-medium">{h}</th>))}</tr></thead>
          <tbody>{items.map((i) => {
            const ck = (id: string) => i.checks.find((c) => c.id === id)?.pass;
            return (<tr key={i.kind + i.id} className="border-b border-line last:border-0"><td className="p-4 font-medium">{i.keyword}</td><td className="num p-4 text-xs text-soft">{i.path}</td><td className="p-4">{ck("kw-title") ? "✓" : "—"}</td><td className="p-4">{ck("kw-h1") ? "✓" : "—"}</td><td className="p-4"><ScoreBadge n={i.score} /></td></tr>);
          })}</tbody>
        </table>
      </Card>
      {missing.length > 0 && <p className="mt-6 text-sm text-soft">Sans mot-clé défini : {missing.map((m) => m.title).join(" · ")}</p>}
    </>
  );
}
