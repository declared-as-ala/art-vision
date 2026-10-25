import { connection } from "next/server";
import { Trash2 } from "lucide-react";
import { getDb } from "@/lib/db";
import { can, requireUser } from "@/lib/auth";
import { deleteRedirect, saveRedirect } from "@/app/(admin)/admin/actions";
import { AdminTitle, Card, fmtDate } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Redirections" };

export default async function Redirects({ searchParams }: PageProps<"/admin/seo/redirects">) {
  await connection();
  const [user, list, sp] = await Promise.all([requireUser(), getDb().redirect.findMany({ orderBy: { createdAt: "desc" } }), searchParams]);
  const edit = can(user.role, "redirect.edit");
  return (
    <>
      <AdminTitle title="Redirections" desc="Redirections 301 appliquées avant l'erreur 404. Elles sont créées automatiquement quand vous changez l'URL d'une page publiée." />
      {sp.error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Chemins invalides : « de » doit commencer par /, « vers » par / ou https://.</p>}
      {edit && (
        <Card className="mb-6 p-5">
          <form action={saveRedirect} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <div className="grid gap-1.5"><Label htmlFor="from">De (ancienne URL)</Label><Input id="from" name="from" placeholder="/ancienne-page" required /></div>
            <div className="grid gap-1.5"><Label htmlFor="to">Vers (nouvelle URL)</Label><Input id="to" name="to" placeholder="/nouvelle-page" required /></div>
            <button className="h-10 rounded-full bg-brand px-6 text-sm font-medium text-white hover:bg-brand-ink">Ajouter</button>
          </form>
        </Card>
      )}
      <Card className="overflow-x-auto">
        {list.length === 0 ? <p className="p-10 text-center text-sm text-soft">Aucune redirection.</p> : (
          <table className="w-full min-w-[36rem] text-sm"><thead className="border-b border-line text-xs uppercase tracking-wider text-soft"><tr>{["De", "Vers", "Créée", ""].map((h) => (<th key={h} className="p-4 text-start font-medium">{h}</th>))}</tr></thead>
            <tbody>{list.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0"><td className="num p-4">{r.fromPath}</td><td className="num p-4">{r.toPath}</td><td className="num p-4 text-xs text-soft">{fmtDate(r.createdAt)}</td>
                <td className="p-4 text-end">{edit && <form action={deleteRedirect.bind(null, r.id)}><button aria-label="Supprimer" className="rounded p-1.5 text-red-600 hover:bg-red-50"><Trash2 size={15} /></button></form>}</td></tr>))}</tbody></table>
        )}
      </Card>
    </>
  );
}
