"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { ALIGNS, BGS, HIDES, SPACES, SPEC, type Block, type Field, type Item } from "@/lib/blocks";
import { MediaPickerField } from "@/components/admin/media-picker";

const input = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand";

const BG_LABEL: Record<string, string> = { paper: "Papier", white: "Blanc", violet: "Lavande", brand: "Magenta", copper: "Cuivre", indigo: "Indigo", night: "Nuit" };
const BG_SWATCH: Record<string, string> = { paper: "#f8f7fc", white: "#fff", violet: "#ecebfb", brand: "#ba3184", copper: "#cd7942", indigo: "#2d2966", night: "#150933" };

function FieldInput({ f, value, onChange }: { f: Field; value: string; onChange: (v: string) => void }) {
  if (f.kind === "area") return <textarea rows={5} value={value} onChange={(e) => onChange(e.target.value)} className={input} />;
  if (f.kind === "select") return <select value={value} onChange={(e) => onChange(e.target.value)} className={input}>{f.options?.map((o) => (<option key={o} value={o}>{o}</option>))}</select>;
  if (f.kind === "image") return <MediaPickerField value={value} onChange={onChange} />;
  return <input type={f.kind === "url" ? "text" : "text"} inputMode={f.kind === "url" ? "url" : undefined} value={value} onChange={(e) => onChange(e.target.value)} placeholder={f.kind === "url" ? "/contact ou https://…" : undefined} className={input} />;
}

function ListEditor({ f, items, onChange }: { f: Field; items: Item[]; onChange: (v: Item[]) => void }) {
  const set = (i: number, k: string, v: string) => onChange(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i: number, d: number) => { const n = [...items]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; onChange(n); };
  const blank = () => Object.fromEntries((f.fields ?? []).map((x) => [x.k, ""]));
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-line bg-paper p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="num text-[10px] uppercase tracking-widest text-soft">#{i + 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} aria-label="Monter" className="rounded p-1 hover:bg-white"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Descendre" className="rounded p-1 hover:bg-white"><ArrowDown size={14} /></button>
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Supprimer l'élément" className="rounded p-1 text-red-600 hover:bg-white"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="space-y-2">
            {f.fields?.map((sf) => (
              <label key={sf.k} className="block text-xs font-medium text-soft">{sf.label}
                <div className="mt-1 font-normal text-charcoal"><FieldInput f={sf} value={it[sf.k] ?? ""} onChange={(v) => set(i, sf.k, v)} /></div>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, blank()])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-soft hover:border-brand hover:text-brand"><Plus size={14} />Ajouter</button>
    </div>
  );
}

export function BlockEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const spec = SPEC[block.type];
  const setData = (k: string, v: string | Item[]) => onChange({ ...block, data: { ...block.data, [k]: v } });
  const setStyle = <K extends keyof Block["style"]>(k: K, v: Block["style"][K]) => onChange({ ...block, style: { ...block.style, [k]: v } });
  return (
    <div className="space-y-6">
      <div><p className="num text-[10px] uppercase tracking-widest text-brand">{spec.label}</p><p className="text-xs text-soft">{spec.desc}</p></div>
      <div className="space-y-4">
        {spec.fields.map((f) => (
          <div key={f.k}>
            <label className="mb-1.5 block text-xs font-medium">{f.label}</label>
            {f.kind === "list"
              ? <ListEditor f={f} items={(block.data[f.k] as Item[]) ?? []} onChange={(v) => setData(f.k, v)} />
              : <FieldInput f={f} value={(block.data[f.k] as string) ?? ""} onChange={(v) => setData(f.k, v)} />}
            {f.hint && <p className="mt-1 text-[11px] text-soft">{f.hint}</p>}
          </div>
        ))}
      </div>

      <fieldset className="space-y-4 border-t border-line pt-5">
        <legend className="num -mt-2.5 bg-white pe-2 text-[10px] uppercase tracking-widest text-soft">Mise en page</legend>
        <div>
          <p className="mb-1.5 text-xs font-medium">Arrière-plan</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Arrière-plan">
            {BGS.map((b) => (
              <button key={b} type="button" role="radio" aria-checked={block.style.bg === b} title={BG_LABEL[b]} onClick={() => setStyle("bg", b)}
                style={{ background: BG_SWATCH[b] }} className={`size-8 rounded-full ring-offset-2 ${block.style.bg === b ? "ring-2 ring-brand" : "ring-1 ring-line"}`} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="text-xs font-medium">Espacement<select value={block.style.space} onChange={(e) => setStyle("space", e.target.value as Block["style"]["space"])} className={`${input} mt-1`}>{SPACES.map((s) => (<option key={s}>{s}</option>))}</select></label>
          <label className="text-xs font-medium">Alignement<select value={block.style.align} onChange={(e) => setStyle("align", e.target.value as Block["style"]["align"])} className={`${input} mt-1`}>{ALIGNS.map((s) => (<option key={s}>{s}</option>))}</select></label>
          <label className="text-xs font-medium">Masquer<select value={block.style.hide} onChange={(e) => setStyle("hide", e.target.value as Block["style"]["hide"])} className={`${input} mt-1`}>{HIDES.map((s) => (<option key={s}>{s}</option>))}</select></label>
        </div>
      </fieldset>
    </div>
  );
}
