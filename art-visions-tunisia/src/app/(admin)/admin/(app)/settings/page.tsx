import { connection } from "next/server";
import { getDb } from "@/lib/db";
import { SITE } from "@/lib/site";
import { AdminTitle, Card } from "@/components/admin/ui";

export const metadata = { title: "Réglages" };

async function dbOk() { try { await getDb().$queryRaw`select 1`; return true; } catch { return false; } }

export default async function Settings() {
  await connection();
  const rows: [string, string, boolean][] = [
    ["Base de données PostgreSQL", process.env.DATABASE_URL ? "Connectée" : "Non configurée", await dbOk()],
    ["Stockage MinIO / S3", process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY ? `Bucket ${process.env.S3_BUCKET}` : "Non configuré", !!(process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY)],
    ["URL du site", SITE.url, true],
    ["Email de contact", SITE.email, !!process.env.NEXT_PUBLIC_CONTACT_EMAIL],
    ["WhatsApp", SITE.whatsapp || "Non renseigné", !!SITE.whatsapp],
    ["Google Search Console", process.env.NEXT_PUBLIC_GSC_VERIFICATION ? "Balise de vérification active" : "Non vérifié — ajoutez NEXT_PUBLIC_GSC_VERIFICATION dans .env", !!process.env.NEXT_PUBLIC_GSC_VERIFICATION],
    ["Analytique interne", "Active (sans cookie, agrégée) — voir Analytique", true],
  ];
  return (
    <>
      <AdminTitle title="Réglages généraux" desc="État des intégrations de ce projet. Les valeurs se modifient dans le fichier .env (aucun secret n'est affiché ici)." />
      <Card className="divide-y divide-line">
        {rows.map(([k, v, ok]) => (<div key={k} className="flex items-center justify-between gap-4 p-4 text-sm"><span className="font-medium">{k}</span><span className="flex items-center gap-2 text-soft"><span className={`size-2 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-400"}`} />{v}</span></div>))}
      </Card>
    </>
  );
}
