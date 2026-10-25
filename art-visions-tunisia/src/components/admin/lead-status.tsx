"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setLeadStatus } from "@/app/(admin)/admin/actions";

const LABELS: Record<string, string> = { NEW: "Nouveau", CONTACTED: "Contacté", QUOTED: "Devis envoyé", WON: "Gagné", LOST: "Perdu" };

export function LeadStatus({ id, status, disabled }: { id: string; status: string; disabled?: boolean }) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label="Statut de la demande"
      defaultValue={status}
      disabled={pending || disabled}
      onChange={(e) =>
        start(async () => {
          const r = await setLeadStatus(id, e.target.value);
          if (r.ok) toast.success("Statut mis à jour");
          else toast.error(r.error);
        })
      }
      className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm outline-none focus:border-brand"
    >
      {Object.entries(LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
    </select>
  );
}
