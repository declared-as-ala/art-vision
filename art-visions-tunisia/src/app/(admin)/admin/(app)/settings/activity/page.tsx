import { connection } from "next/server";
import { getDb } from "@/lib/db";
import { AdminTitle, Card, fmtDate } from "@/components/admin/ui";

export const metadata = { title: "Journal d'activité" };

export default async function Activity() {
  await connection();
  const db = getDb();
  const logs = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const users = await db.user.findMany({ select: { id: true, name: true } });
  const name = (id: string | null) => users.find((u) => u.id === id)?.name ?? "—";
  return (
    <>
      <AdminTitle title="Journal d'activité" desc="Les 200 dernières actions (connexions, pages, redirections, utilisateurs)." />
      <Card className="overflow-x-auto">
        {logs.length === 0 ? <p className="p-10 text-center text-sm text-soft">Aucune activité.</p> : (
          <table className="w-full min-w-[40rem] text-sm"><thead className="border-b border-line text-xs uppercase tracking-wider text-soft"><tr>{["Date", "Utilisateur", "Action", "Cible", "Détails"].map((h) => (<th key={h} className="p-4 text-start font-medium">{h}</th>))}</tr></thead>
            <tbody>{logs.map((l) => (<tr key={l.id} className="border-b border-line last:border-0"><td className="num whitespace-nowrap p-4 text-xs text-soft">{fmtDate(l.createdAt)}</td><td className="p-4">{name(l.userId)}</td><td className="num p-4 text-xs">{l.action}</td><td className="p-4 text-xs text-soft">{l.entity}</td><td className="num max-w-xs truncate p-4 text-xs text-soft">{l.meta ? JSON.stringify(l.meta) : ""}</td></tr>))}</tbody></table>
        )}
      </Card>
    </>
  );
}
