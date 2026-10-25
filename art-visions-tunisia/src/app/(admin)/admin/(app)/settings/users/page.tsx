import { connection } from "next/server";
import { getDb } from "@/lib/db";
import { can, requireUser } from "@/lib/auth";
import { createUserAction } from "@/app/(admin)/admin/actions";
import { AdminTitle, Card, fmtDate } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Utilisateurs & rôles" };

const ROLES: Record<string, string> = { OWNER: "Propriétaire — tous les droits", EDITOR: "Éditeur — contenu et leads", SEO: "SEO — métadonnées et redirections" };

export default async function Users({ searchParams }: PageProps<"/admin/settings/users">) {
  await connection();
  const [me, users, sp] = await Promise.all([requireUser(), getDb().user.findMany({ orderBy: { createdAt: "asc" } }), searchParams]);
  const manage = can(me.role, "user.manage");
  return (
    <>
      <AdminTitle title="Utilisateurs & rôles" desc="Chaque action sensible vérifie le rôle côté serveur et est consignée dans le journal." />
      {sp.error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{sp.error === "exists" ? "Cet email existe déjà." : "Champs invalides (mot de passe : 10 caractères minimum)."}</p>}
      <Card className="mb-6 divide-y divide-line">
        {users.map((u) => (<div key={u.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm"><div><p className="font-medium">{u.name}</p><p className="text-xs text-soft">{u.email}</p></div><div className="text-end"><p className="num text-xs uppercase tracking-widest text-brand">{u.role}</p><p className="text-xs text-soft">{fmtDate(u.createdAt)}</p></div></div>))}
      </Card>
      {manage && (
        <Card className="max-w-2xl p-6">
          <h2 className="mb-4 font-semibold">Ajouter un utilisateur</h2>
          <form action={createUserAction} className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5"><Label htmlFor="name">Nom</Label><Input id="name" name="name" required /></div>
            <div className="grid gap-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            <div className="grid gap-1.5"><Label htmlFor="password">Mot de passe (10+ car.)</Label><Input id="password" name="password" type="password" minLength={10} required autoComplete="new-password" /></div>
            <div className="grid gap-1.5"><Label htmlFor="role">Rôle</Label><select id="role" name="role" className="h-10 rounded-lg border border-input bg-white px-3 text-sm">{Object.entries(ROLES).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select></div>
            <button className="justify-self-start rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-ink sm:col-span-2">Créer</button>
          </form>
        </Card>
      )}
    </>
  );
}
