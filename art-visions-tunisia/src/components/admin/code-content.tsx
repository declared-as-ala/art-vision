import Link from "next/link";
import { Pencil } from "lucide-react";
import { getDb } from "@/lib/db";
import { listImportables } from "@/lib/import-content";
import { makeEditableAction } from "@/app/(admin)/admin/actions";
import { Card, StatusBadge } from "@/components/admin/ui";

/** Every page whose content lives in code, with a one-click way to edit it in the visual builder. */
export async function CodeContent({ only }: { only?: string[] }) {
  const db = getDb();
  const all = listImportables().filter((i) => !only || only.includes(i.group));
  const existing = await db.page.findMany({ select: { id: true, kind: true, lang: true, slug: true, status: true } });
  const find = (i: (typeof all)[number]) => existing.find((e) => e.kind === i.kind && e.lang === i.lang && e.slug === i.slug);
  const groups = [...new Set(all.map((i) => i.group))];

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">Pages du site à modifier</h2>
      <p className="mb-4 mt-1 max-w-3xl text-sm text-soft">
        Ces pages existent déjà sur le site. Cliquez sur <b>Modifier</b> : une copie modifiable (brouillon) s&apos;ouvre dans l&apos;éditeur. Le site continue d&apos;afficher la version actuelle
        jusqu&apos;à ce que vous cliquiez sur <b>Publier</b> : votre version la remplace alors.
      </p>
      <div className="space-y-4">
        {groups.map((g) => (
          <Card key={g} className="overflow-x-auto">
            <p className="num border-b border-line px-4 py-2.5 text-[10px] uppercase tracking-widest text-soft">{g}</p>
            <table className="w-full min-w-[40rem] text-sm">
              <tbody>
                {all.filter((i) => i.group === g).map((i) => {
                  const e = find(i);
                  return (
                    <tr key={`${i.kind}-${i.lang}-${i.slug}`} className="border-b border-line last:border-0">
                      <td className="p-4 font-medium">{i.label}</td>
                      <td className="p-4"><Link href={i.publicPath} target="_blank" prefetch={false} className="num text-xs text-brand">{i.publicPath}</Link></td>
                      <td className="p-4">{e ? <span className="flex items-center gap-2"><StatusBadge s={e.status} /><span className="text-xs text-soft">{e.status === "PUBLISHED" ? "votre version est en ligne" : "version modifiable (brouillon)"}</span></span> : <span className="text-xs text-soft">Version code (non modifiable)</span>}</td>
                      <td className="p-4 text-end">
                        {e ? (
                          <Link href={`/admin/pages/${e.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo px-3.5 py-2 text-sm font-medium text-white hover:bg-brand"><Pencil size={14} />Ouvrir l&apos;éditeur</Link>
                        ) : (
                          <form action={makeEditableAction.bind(null, i.kind, i.lang, i.slug)}>
                            <button className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-ink"><Pencil size={14} />Modifier</button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        ))}
      </div>
    </section>
  );
}
