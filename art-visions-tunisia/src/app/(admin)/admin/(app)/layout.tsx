import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { AdminShell } from "@/components/admin/shell";

async function Shell({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const newLeads = await getDb().lead.count({ where: { status: "NEW" } });
  return <AdminShell user={{ name: user.name, email: user.email, role: user.role }} newLeads={newLeads}>{children}</AdminShell>;
}

export default function AppLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-soft">Chargement…</div>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
