import { connection } from "next/server";
import { getDb } from "@/lib/db";
import { getUser, can } from "@/lib/auth";
import { SERVICES } from "@/content/services";
import { AdminTitle, Card, fmtDate } from "@/components/admin/ui";
import { LeadStatus } from "@/components/admin/lead-status";

export const metadata = { title: "Demandes de devis" };

export default async function LeadsPage() {
  await connection();
  const [leads, user] = await Promise.all([getDb().lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 }), getUser()]);
  const editable = user ? can(user.role, "lead.edit") : false;
  const svc = (id: string | null) => SERVICES.find((s) => s.id === id)?.fr.name ?? id ?? "—";
  return (
    <>
      <AdminTitle title="Demandes de devis" desc={`${leads.length} demande(s) reçue(s) via le formulaire du site.`} />
      {leads.length === 0 ? (
        <Card className="p-10 text-center text-sm text-soft">Aucune demande pour l&apos;instant. Elles apparaîtront ici dès qu&apos;un visiteur enverra le formulaire.</Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[56rem] text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-soft">
              <tr>{["Date", "Contact", "Service", "Message", "Statut"].map((h) => (<th key={h} className="p-4 text-start font-medium">{h}</th>))}</tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-line align-top last:border-0">
                  <td className="num whitespace-nowrap p-4 text-xs text-soft">{fmtDate(l.createdAt)}</td>
                  <td className="p-4">
                    <p className="font-medium">{l.name}</p>
                    <a href={`mailto:${l.email}`} className="text-xs text-brand">{l.email}</a>
                    {l.phone && <p className="num text-xs text-soft">{l.phone}</p>}
                    {l.company && <p className="text-xs text-soft">{l.company}</p>}
                  </td>
                  <td className="p-4">{svc(l.service)}</td>
                  <td className="max-w-md whitespace-pre-line p-4 text-soft">{l.message}</td>
                  <td className="p-4"><LeadStatus id={l.id} status={l.status} disabled={!editable} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
