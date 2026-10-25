import { scoreTone } from "@/lib/seo-score";

export function AdminTitle({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-3xl font-semibold tracking-tight text-indigo">{title}</h1>{desc && <p className="mt-1.5 max-w-2xl text-sm text-soft">{desc}</p>}</div>
      {children}
    </div>
  );
}
export const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`rounded-2xl border border-line bg-white ${className}`}>{children}</div>
);
export const ScoreBadge = ({ n }: { n: number }) => <span className={`num inline-block min-w-10 rounded-full px-2.5 py-0.5 text-center text-xs font-semibold ${scoreTone(n)}`}>{n}</span>;
export const StatusBadge = ({ s }: { s: string }) => {
  const tone: Record<string, string> = { PUBLISHED: "bg-emerald-50 text-emerald-700", DRAFT: "bg-slate-100 text-slate-600", SCHEDULED: "bg-sky-50 text-sky-700", ARCHIVED: "bg-stone-100 text-stone-500", UNVERIFIED: "bg-amber-50 text-amber-700" };
  const label: Record<string, string> = { PUBLISHED: "Publié", DRAFT: "Brouillon", SCHEDULED: "Programmé", ARCHIVED: "Archivé", UNVERIFIED: "Non vérifié" };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tone[s] ?? "bg-slate-100"}`}>{label[s] ?? s}</span>;
};
export const fmtDate = (d: Date | string) => new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
