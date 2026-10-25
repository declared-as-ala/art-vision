"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowLeft, ArrowUp, Bookmark, Copy, ExternalLink, GripVertical, History, Laptop, Plus, Save, Send, Smartphone, Tablet, Trash2 } from "lucide-react";
import { SPEC, SPECS, newBlock, newId, type Block, type BlockType } from "@/lib/blocks";
import { BlockRenderer } from "@/components/blocks/renderer";
import { BlockEditor } from "./block-editor";
import { SeoPanel, type SeoState } from "./seo-panel";
import { deletePage, deleteSectionAction, duplicatePage, insertSectionAction, restoreRevision, saveSectionAction, savePage, type PageInput } from "@/app/(admin)/admin/actions";
import { runChecks, score, scoreTone, type SeoContext } from "@/lib/seo-score";
import { ARTICLE_CATEGORIES, KINDS, pagePath, type Kind } from "@/lib/content-kinds";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type BuilderPage = {
  id: string; title: string; slug: string; template: string; status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED"; lang: "fr" | "ar";
  blocks: Block[]; primaryKeyword: string; secondaryKeywords: string[]; seoTitle: string; metaDescription: string; canonicalUrl: string;
  noindex: boolean; nofollow: boolean; ogTitle: string; ogDescription: string; ogImage: string; breadcrumbLabel: string; schemaType: string;
  navVisible: boolean; publishedAt: string | null; updatedAt: string; authorName: string | null; hadPublished: boolean; kind: Kind; category: string; translationId: string | null;
};
export type Perms = { edit: boolean; seo: boolean; publish: boolean; del: boolean };
export type SectionRef = { id: string; name: string; type: string };
export type TranslationOption = { id: string; title: string; lang: string };
export type Rev = { id: string; note: string | null; createdAt: string };

const FRAMES = { desktop: { w: "100%", Icon: Laptop, label: "Bureau" }, tablet: { w: "768px", Icon: Tablet, label: "Tablette" }, mobile: { w: "390px", Icon: Smartphone, label: "Mobile" } } as const;
const STATUS_LABEL = { DRAFT: "Brouillon", SCHEDULED: "Programmé", PUBLISHED: "Publié", ARCHIVED: "Archivé" } as const;
const input = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand";

const blockTitle = (b: Block) => {
  const d = b.data;
  const t = (d.title ?? d.text ?? d.body ?? d.alt ?? "") as string;
  return typeof t === "string" ? t.slice(0, 44) : "";
};

export function PageBuilder({ page, revisions, ctx, perms, sections, translations }: { page: BuilderPage; revisions: Rev[]; ctx: SeoContext; perms: Perms; sections: SectionRef[]; translations: TranslationOption[] }) {
  const router = useRouter();
  const [p, setP] = useState(page);
  const [sel, setSel] = useState<string | null>(page.blocks[0]?.id ?? null);
  const [device, setDevice] = useState<keyof typeof FRAMES>("desktop");
  const [adding, setAdding] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, start] = useTransition();
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);

  const patch = useCallback((x: Partial<BuilderPage>) => { setP((o) => ({ ...o, ...x })); setDirty(true); }, []);
  const setBlocks = (fn: (b: Block[]) => Block[]) => patch({ blocks: fn(p.blocks) });
  const current = p.blocks.find((b) => b.id === sel) ?? null;

  const seoState: SeoState = {
    title: p.title, seoTitle: p.seoTitle, metaDescription: p.metaDescription, slug: p.slug, keyword: p.primaryKeyword, canonicalUrl: p.canonicalUrl,
    noindex: p.noindex, nofollow: p.nofollow, ogImage: p.ogImage, schemaType: p.schemaType, blocks: p.blocks, status: p.status,
    secondaryKeywords: p.secondaryKeywords.join(", "), ogTitle: p.ogTitle, ogDescription: p.ogDescription, breadcrumbLabel: p.breadcrumbLabel, lang: p.lang,
  };
  const total = score(runChecks(seoState, ctx));

  const save = useCallback((status?: BuilderPage["status"], note?: string) => {
    const next = { ...p, status: status ?? p.status };
    const payload: PageInput = {
      title: next.title, slug: next.slug, template: next.template, status: next.status, publishedAt: next.publishedAt,
      primaryKeyword: next.primaryKeyword, secondaryKeywords: next.secondaryKeywords, seoTitle: next.seoTitle, metaDescription: next.metaDescription,
      canonicalUrl: next.canonicalUrl, noindex: next.noindex, nofollow: next.nofollow, ogTitle: next.ogTitle, ogDescription: next.ogDescription,
      ogImage: next.ogImage, breadcrumbLabel: next.breadcrumbLabel, schemaType: next.schemaType as PageInput["schemaType"], navVisible: next.navVisible,
      lang: next.lang, category: next.category, translationId: next.translationId, blocks: next.blocks,
    };
    start(async () => {
      const r = await savePage(p.id, payload, note);
      if (r.ok) { setP({ ...next, updatedAt: r.updatedAt }); setDirty(false); toast.success(status === "PUBLISHED" ? "Page publiée" : "Enregistré"); router.refresh(); }
      else toast.error(r.error);
    });
  }, [p, router]);

  // Ctrl/Cmd+S and unsaved-changes guard
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); if (perms.edit || perms.seo) save(); } };
    const b = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("keydown", k); window.addEventListener("beforeunload", b);
    return () => { window.removeEventListener("keydown", k); window.removeEventListener("beforeunload", b); };
  }, [save, dirty, perms]);

  // Preview must never navigate away or submit.
  const stop = (e: React.SyntheticEvent) => { const t = e.target as HTMLElement; if (t.closest("a")) e.preventDefault(); if (t.closest("form") && (e.type === "submit")) e.preventDefault(); };

  const add = (type: BlockType) => {
    const b = newBlock(type);
    patch({ blocks: [...p.blocks, b] }); setSel(b.id); setAdding(false);
    setTimeout(() => preview.current?.querySelector(`[data-block-id="${b.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  };
  const move = (i: number, d: number) => setBlocks((bs) => { const n = [...bs]; const j = i + d; if (j < 0 || j >= n.length) return bs; [n[i], n[j]] = [n[j], n[i]]; return n; });
  const dup = (i: number) => setBlocks((bs) => { const c = { ...JSON.parse(JSON.stringify(bs[i])), id: newId() } as Block; setSel(c.id); return [...bs.slice(0, i + 1), c, ...bs.slice(i + 1)]; });
  const remove = (i: number) => { if (!confirm("Supprimer ce bloc ?")) return; setBlocks((bs) => bs.filter((_, j) => j !== i)); setSel(null); };
  const drop = (to: number) => { if (drag === null || drag === to) return; setBlocks((bs) => { const n = [...bs]; const [m] = n.splice(drag, 1); n.splice(to, 0, m); return n; }); setDrag(null); setOver(null); };

  const saveAsSection = (b: Block) => {
    const name = prompt("Nom de la section réutilisable :", SPEC[b.type].label);
    if (!name) return;
    start(async () => { const r = await saveSectionAction(name, b); if (r.ok) { toast.success("Section ajoutée à la bibliothèque"); router.refresh(); } else toast.error(r.error); });
  };
  const insertSection = (id: string) => start(async () => {
    const r = await insertSectionAction(id);
    if (!r.ok) { toast.error(r.error); return; }
    patch({ blocks: [...p.blocks, r.block] }); setSel(r.block.id); setAdding(false);
  });
  const removeSection = (id: string) => { if (!confirm("Supprimer cette section de la bibliothèque ? Les pages qui l'utilisent ne sont pas modifiées.")) return; start(async () => { const r = await deleteSectionAction(id); if (r.ok) { toast.success("Supprimée"); router.refresh(); } else toast.error(r.error); }); };

  const publish = () => {
    if (p.noindex && !confirm("Cette page est en noindex : elle ne sera pas indexée par Google. Publier quand même ?")) return;
    if ((p.slug !== page.slug || p.lang !== page.lang) && p.hadPublished) toast.info("Une redirection 301 sera créée depuis l'ancienne URL.");
    save("PUBLISHED");
  };
  const readOnly = !perms.edit;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* top bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-white px-4 py-2.5">
        <Link href="/admin/pages" aria-label="Retour aux pages" className="rounded-lg p-2 hover:bg-tint-violet"><ArrowLeft size={17} /></Link>
        <input aria-label="Nom de la page" disabled={readOnly} value={p.title} onChange={(e) => patch({ title: e.target.value })} className="min-w-0 max-w-xs flex-1 rounded-lg bg-transparent px-2 py-1 text-lg font-semibold outline-none hover:bg-paper focus:bg-paper" />
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{STATUS_LABEL[p.status]}</span>
        <span className={`num rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreTone(total)}`} title="Score SEO éditorial">SEO {total}</span>
        {dirty && <span className="text-xs text-amber-600">● Modifications non enregistrées</span>}
        <div className="ms-auto flex items-center gap-2">
          <div className="hidden rounded-lg bg-tint-violet p-0.5 sm:flex" role="group" aria-label="Aperçu responsive">
            {(Object.keys(FRAMES) as (keyof typeof FRAMES)[]).map((d) => { const { Icon, label } = FRAMES[d]; return (<button key={d} onClick={() => setDevice(d)} aria-pressed={device === d} title={label} className={`rounded-md p-1.5 ${device === d ? "bg-white shadow-sm" : ""}`}><Icon size={16} /></button>); })}
          </div>
          {p.status === "PUBLISHED" && <a href={pagePath(page.kind, page.lang, page.slug)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm hover:border-brand"><ExternalLink size={14} />Voir</a>}
          <button onClick={() => save()} disabled={saving || (!perms.edit && !perms.seo)} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm hover:border-brand disabled:opacity-50"><Save size={14} />{saving ? "…" : "Enregistrer"}</button>
          {perms.publish && <button onClick={publish} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-ink disabled:opacity-50"><Send size={14} />Publier</button>}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[17rem_1fr_24rem]">
        {/* blocks */}
        <aside className="flex min-h-0 flex-col border-e border-line bg-white">
          <div className="flex items-center justify-between p-3"><p className="num text-[10px] uppercase tracking-widest text-soft">Sections ({p.blocks.length})</p>
            <button disabled={readOnly} onClick={() => setAdding(true)} className="inline-flex items-center gap-1 rounded-lg bg-indigo px-2.5 py-1.5 text-xs font-medium text-white hover:bg-brand disabled:opacity-50"><Plus size={13} />Ajouter</button></div>
          <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-3 pb-3" data-lenis-prevent>
            {p.blocks.map((b, i) => (
              <li key={b.id} draggable={!readOnly} onDragStart={() => setDrag(i)} onDragEnd={() => { setDrag(null); setOver(null); }} onDragOver={(e) => { e.preventDefault(); setOver(i); }} onDrop={() => drop(i)}
                className={`rounded-xl border bg-white transition-colors ${sel === b.id ? "border-brand ring-1 ring-brand/30" : "border-line"} ${over === i && drag !== null ? "border-t-2 border-t-brand" : ""} ${drag === i ? "opacity-40" : ""}`}>
                <div className="flex items-center gap-1 p-1.5">
                  <GripVertical size={15} className="shrink-0 cursor-grab text-soft" aria-hidden="true" />
                  <button onClick={() => setSel(b.id)} className="min-w-0 flex-1 px-1 text-start"><p className="num text-[10px] uppercase tracking-widest text-brand">{SPEC[b.type].label}</p><p className="truncate text-xs text-soft">{blockTitle(b) || "—"}</p></button>
                </div>
                {sel === b.id && !readOnly && (
                  <div className="flex justify-end gap-0.5 border-t border-line px-1.5 py-1">
                    <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter" className="rounded p-1.5 hover:bg-paper disabled:opacity-30"><ArrowUp size={14} /></button>
                    <button onClick={() => move(i, 1)} disabled={i === p.blocks.length - 1} aria-label="Descendre" className="rounded p-1.5 hover:bg-paper disabled:opacity-30"><ArrowDown size={14} /></button>
                    <button onClick={() => dup(i)} aria-label="Dupliquer" className="rounded p-1.5 hover:bg-paper"><Copy size={14} /></button>
                    <button onClick={() => saveAsSection(b)} aria-label="Enregistrer comme section réutilisable" title="Enregistrer comme section réutilisable" className="rounded p-1.5 hover:bg-paper"><Bookmark size={14} /></button>
                    <button onClick={() => remove(i)} aria-label="Supprimer" className="rounded p-1.5 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
                  </div>
                )}
              </li>
            ))}
            {p.blocks.length === 0 && <li className="rounded-xl border border-dashed border-line p-6 text-center text-xs text-soft">Aucune section. Cliquez sur « Ajouter ».</li>}
          </ul>
        </aside>

        {/* preview */}
        <section className="min-h-0 overflow-auto bg-[#e9e7f3] p-4" data-lenis-prevent ref={preview}>
          <div className="mx-auto overflow-hidden rounded-xl bg-paper shadow-lg ring-1 ring-black/5 transition-[width] duration-300" style={{ width: FRAMES[device].w, maxWidth: "100%" }}>
            <div onClickCapture={stop} onSubmitCapture={stop}>
              {p.blocks.length === 0 ? <p className="p-16 text-center text-sm text-soft">La page est vide.</p> : (
                <div className="@container">
                  {p.blocks.map((b) => (
                    <div key={b.id} data-block-id={b.id} onClick={() => setSel(b.id)} className={`relative cursor-pointer ${sel === b.id ? "outline-2 -outline-offset-2 outline-brand" : "hover:outline hover:outline-2 hover:-outline-offset-2 hover:outline-brand/40"}`}>
                      <BlockRenderer blocks={[b]} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* inspector */}
        <aside className="min-h-0 overflow-y-auto border-s border-line bg-white p-4" data-lenis-prevent>
          <Tabs defaultValue="block">
            <TabsList className="mb-4 grid w-full grid-cols-4">
              <TabsTrigger value="block">Bloc</TabsTrigger><TabsTrigger value="page">Page</TabsTrigger><TabsTrigger value="seo">SEO</TabsTrigger><TabsTrigger value="history"><History size={14} /></TabsTrigger>
            </TabsList>
            <TabsContent value="block">
              {current ? <fieldset disabled={readOnly}><BlockEditor block={current} onChange={(b) => setBlocks((bs) => bs.map((x) => (x.id === b.id ? b : x)))} /></fieldset>
                : <p className="py-12 text-center text-sm text-soft">Sélectionnez une section pour la modifier.</p>}
            </TabsContent>
            <TabsContent value="page">
              <fieldset disabled={readOnly} className="space-y-4">
                <label className="block text-xs font-medium">URL (slug)
                  <input value={p.slug} onChange={(e) => patch({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} className={`${input} num mt-1.5`} /></label>
                {(p.slug !== page.slug || p.lang !== page.lang) && p.hadPublished && <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">L&apos;URL change : une redirection 301 de <b>{pagePath(page.kind, page.lang, page.slug)}</b> vers <b>{pagePath(p.kind, p.lang, p.slug)}</b> sera créée à l&apos;enregistrement.</p>}
                <label className="block text-xs font-medium">Statut
                  <select value={p.status} onChange={(e) => patch({ status: e.target.value as BuilderPage["status"] })} className={`${input} mt-1.5`}>{Object.entries(STATUS_LABEL).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select></label>
                {p.status === "SCHEDULED" && <label className="block text-xs font-medium">Date de publication
                  <input type="datetime-local" value={p.publishedAt ? new Date(new Date(p.publishedAt).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""} onChange={(e) => patch({ publishedAt: e.target.value ? new Date(e.target.value).toISOString() : null })} className={`${input} mt-1.5`} /></label>}
                <p className="num text-[10px] uppercase tracking-widest text-brand">{KINDS[p.kind].label} · {pagePath(p.kind, p.lang, p.slug)}</p>
                {(KINDS[p.kind].langs as readonly string[]).includes("ar") && <label className="block text-xs font-medium">Langue<select value={p.lang} onChange={(e) => patch({ lang: e.target.value as "fr" | "ar", translationId: null })} className={`${input} mt-1.5`}><option value="fr">Français (fr-TN)</option><option value="ar">العربية (ar-TN, RTL)</option></select></label>}
                {p.kind === "article" && <label className="block text-xs font-medium">Catégorie<select value={p.category} onChange={(e) => patch({ category: e.target.value })} className={`${input} mt-1.5`}><option value="">—</option>{ARTICLE_CATEGORIES.map((c) => (<option key={c}>{c}</option>))}</select></label>}
                {(KINDS[p.kind].langs as readonly string[]).includes("ar") && <label className="block text-xs font-medium">Traduction (hreflang)<select value={p.translationId ?? ""} onChange={(e) => patch({ translationId: e.target.value || null })} className={`${input} mt-1.5`}><option value="">Aucune</option>{translations.filter((t) => t.lang !== p.lang).map((t) => (<option key={t.id} value={t.id}>{t.title} ({t.lang})</option>))}</select><span className="mt-1 block text-[11px] text-soft">Relie la version française et arabe : les balises hreflang sont émises quand les deux sont publiées.</span></label>}
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.navVisible} onChange={(e) => patch({ navVisible: e.target.checked })} />Afficher dans le pied de page</label>
                <dl className="space-y-1 border-t border-line pt-4 text-xs text-soft"><div className="flex justify-between"><dt>Auteur</dt><dd>{p.authorName ?? "—"}</dd></div><div className="flex justify-between"><dt>Dernière mise à jour</dt><dd className="num">{new Date(p.updatedAt).toLocaleString("fr-FR")}</dd></div></dl>
              </fieldset>
              <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-4">
                {perms.edit && <form action={duplicatePage.bind(null, p.id)}><button className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm hover:border-brand"><Copy size={14} />Dupliquer</button></form>}
                {perms.del && <form action={deletePage.bind(null, p.id)} onSubmit={(e) => { if (!confirm(`Supprimer définitivement « ${p.title} » et son historique ?`)) e.preventDefault(); }}><button className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"><Trash2 size={14} />Supprimer</button></form>}
              </div>
            </TabsContent>
            <TabsContent value="seo">
              <SeoPanel state={seoState} ctx={ctx} canEditSeo={perms.seo}
                set={(x) => patch({
                  ...(x.keyword !== undefined && { primaryKeyword: x.keyword }), ...(x.seoTitle !== undefined && { seoTitle: x.seoTitle }), ...(x.metaDescription !== undefined && { metaDescription: x.metaDescription }),
                  ...(x.canonicalUrl !== undefined && { canonicalUrl: x.canonicalUrl }), ...(x.noindex !== undefined && { noindex: x.noindex }), ...(x.nofollow !== undefined && { nofollow: x.nofollow }),
                  ...(x.ogImage !== undefined && { ogImage: x.ogImage }), ...(x.schemaType !== undefined && { schemaType: x.schemaType }), ...(x.ogTitle !== undefined && { ogTitle: x.ogTitle }),
                  ...(x.ogDescription !== undefined && { ogDescription: x.ogDescription }), ...(x.breadcrumbLabel !== undefined && { breadcrumbLabel: x.breadcrumbLabel }),
                  ...(x.secondaryKeywords !== undefined && { secondaryKeywords: x.secondaryKeywords.split(",").map((s) => s.trim()).filter(Boolean) }),
                })} />
            </TabsContent>
            <TabsContent value="history">
              <p className="mb-3 text-xs text-soft">Une version est conservée à chaque enregistrement (40 dernières).</p>
              <ul className="space-y-2">
                {revisions.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-2 rounded-xl border border-line p-3 text-xs">
                    <div><p className="num">{new Date(r.createdAt).toLocaleString("fr-FR")}</p>{r.note && <p className="text-soft">{r.note}</p>}</div>
                    {perms.edit && <button onClick={() => { if (!confirm("Restaurer cette version ? L'état actuel sera sauvegardé dans l'historique et la page repassera en brouillon.")) return; start(async () => { const x = await restoreRevision(p.id, r.id); if (x.ok) { toast.success("Version restaurée"); router.refresh(); setTimeout(() => window.location.reload(), 300); } else toast.error(x.error); }); }} className="rounded-lg border border-line px-2.5 py-1.5 hover:border-brand">Restaurer</button>}
                  </li>
                ))}
                {revisions.length === 0 && <li className="py-8 text-center text-xs text-soft">Aucune version enregistrée.</li>}
              </ul>
            </TabsContent>
          </Tabs>
        </aside>
      </div>

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>Ajouter une section</DialogTitle></DialogHeader>
          <ul className="grid gap-2 sm:grid-cols-2">
            {SPECS.map((s) => (<li key={s.type}><button onClick={() => add(s.type)} className="w-full rounded-xl border border-line p-3 text-start transition-colors hover:border-brand hover:bg-tint-brand"><p className="text-sm font-medium">{s.label}</p><p className="text-xs text-soft">{s.desc}</p></button></li>))}
          </ul>
          {sections.length > 0 && (
            <div className="mt-6 border-t border-line pt-4">
              <p className="num mb-2 text-[10px] uppercase tracking-widest text-soft">Mes sections réutilisables</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {sections.map((x) => (
                  <li key={x.id} className="flex items-center gap-1 rounded-xl border border-line p-1.5">
                    <button onClick={() => insertSection(x.id)} className="min-w-0 flex-1 rounded-lg p-2 text-start hover:bg-tint-brand"><p className="truncate text-sm font-medium">{x.name}</p><p className="text-xs text-soft">{SPEC[x.type as BlockType]?.label ?? x.type}</p></button>
                    <button onClick={() => removeSection(x.id)} aria-label="Supprimer de la bibliothèque" className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
