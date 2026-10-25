import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { loadAudit } from "@/lib/audit";
import { BLOG_CATEGORIES, ARTICLES } from "@/content/blog";
import type { Kind } from "@/lib/content-kinds";
import { CodeContent } from "@/components/admin/code-content";
import { AdminTitle, Card, ScoreBadge, StatusBadge } from "@/components/admin/ui";

const KINDS: Record<string, { title: string; kind: "blog" | "service" | "portfolio" | "tool"; dbKind?: Kind; note: string }> = {
  blog: { title: "Articles de blog", kind: "blog", dbKind: "article", note: "Les articles créés ici sont édités visuellement et publiés sous /blog. Les 5 articles de départ sont définis dans le code (src/content/blog.ts)." },
  services: { title: "Services", kind: "service", dbKind: "service", note: "Pages de service créées dans le builder (FR ou AR), publiées sous /services et /ar/services. Les 4 services de base sont définis dans le code." },
  portfolio: { title: "Portfolio", kind: "portfolio", dbKind: "project", note: "Projets créés dans le builder, publiés sous /portfolio. Les projets « non vérifiés » du code restent en noindex tant que leur réalité n'est pas confirmée." },
  tools: { title: "Outils gratuits", kind: "tool", note: "Outils interactifs côté navigateur (src/content/tools.ts). Ils nécessitent du code : ils ne se créent pas dans le builder." },
};

const GROUP: Record<string, string> = { blog: "Articles de blog", services: "Services", portfolio: "Portfolio" };

export default async function ContentKind({ params }: PageProps<"/admin/content/[kind]">) {
  await connection();
  const { kind } = await params;
  const cfg = KINDS[kind];
  if (!cfg) notFound();
  const all = await loadAudit();
  const code = all.filter((i) => !i.dbId && i.kind === cfg.kind);
  const built = cfg.dbKind ? all.filter((i) => i.dbId && i.dbKind === cfg.dbKind) : [];
  return (
    <>
      <AdminTitle title={cfg.title} desc={cfg.note}>
        {cfg.dbKind && <Link href={`/admin/pages/new?kind=${cfg.dbKind}`} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-ink"><Plus size={16} />Créer</Link>}
      </AdminTitle>
      {kind === "blog" && <p className="mb-4 text-sm text-soft">Catégories : {BLOG_CATEGORIES.map((c) => `${c} (${ARTICLES.filter((a) => a.category === c).length + built.filter((b) => b.title && false).length})`).join(" · ")}</p>}

      {cfg.dbKind && (
        <>
          <h2 className="mb-3 text-lg font-semibold">Créés dans l&apos;éditeur ({built.length})</h2>
          <Card className="mb-8 overflow-x-auto">
            {built.length === 0 ? <p className="p-8 text-center text-sm text-soft">Rien pour l&apos;instant. Cliquez sur « Créer » pour commencer.</p> : (
              <table className="w-full min-w-[40rem] text-sm">
                <thead className="border-b border-line text-xs uppercase tracking-wider text-soft"><tr>{["Titre", "URL", "Mot-clé", "Statut", "SEO"].map((h) => (<th key={h} className="p-4 text-start font-medium">{h}</th>))}</tr></thead>
                <tbody>{built.map((i) => (
                  <tr key={i.id} className="border-b border-line last:border-0"><td className="p-4"><Link href={i.editHref ?? "#"} className="font-medium text-indigo hover:text-brand">{i.title}</Link></td><td className="num p-4 text-xs text-soft">{i.path}</td><td className="p-4 text-soft">{i.keyword || "—"}</td><td className="p-4"><StatusBadge s={i.status} /></td><td className="p-4"><ScoreBadge n={i.score} /></td></tr>))}</tbody>
              </table>
            )}
          </Card>
        </>
      )}

      {GROUP[kind] && <CodeContent only={[GROUP[kind]]} />}

      <h2 className="mb-3 mt-10 text-lg font-semibold">Vue SEO des contenus définis dans le code ({code.length})</h2>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-soft"><tr>{["Titre", "URL", "Mot-clé", "Statut", "SEO"].map((h) => (<th key={h} className="p-4 text-start font-medium">{h}</th>))}</tr></thead>
          <tbody>{code.map((i) => (
            <tr key={i.id} className="border-b border-line last:border-0"><td className="p-4 font-medium">{i.title}</td><td className="p-4"><Link href={i.path} target="_blank" prefetch={false} className="num text-xs text-brand">{i.path}</Link></td><td className="p-4 text-soft">{i.keyword || "—"}</td><td className="p-4"><StatusBadge s={i.status} /></td><td className="p-4"><ScoreBadge n={i.score} /></td></tr>))}</tbody>
        </table>
      </Card>
    </>
  );
}
