"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Item = { key: string; url: string; size: number; modified: string };

/** Library grid with upload. `onPick` is optional: without it the grid is browse-only (Media page). */
export function MediaLibrary({ onPick }: { onPick?: (url: string) => void }) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const [tick, setTick] = useState(0);
  const load = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => {
    let live = true;
    fetch("/api/admin/media").then(async (r) => {
      const j = await r.json();
      if (!live) return;
      if (!r.ok) { setError(j.error ?? "Erreur"); setItems([]); return; }
      setError(""); setItems(j.items);
    });
    return () => { live = false; };
  }, [tick]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setError("");
    for (const f of Array.from(files)) {
      const fd = new FormData(); fd.set("file", f);
      const r = await fetch("/api/admin/media", { method: "POST", body: fd });
      if (!r.ok) setError((await r.json()).error ?? "Échec de l'envoi");
    }
    setBusy(false); load();
    if (input.current) input.current.value = "";
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" multiple hidden onChange={(e) => upload(e.target.files)} />
        <button onClick={() => input.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-indigo px-4 py-2 text-sm font-medium text-white hover:bg-brand disabled:opacity-60"><Upload size={15} />{busy ? "Envoi…" : "Téléverser"}</button>
        <span className="text-xs text-soft">PNG, JPG, WebP, GIF, AVIF · 8 Mo max</span>
      </div>
      {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {items === null ? <p className="py-10 text-center text-sm text-soft">Chargement…</p> : items.length === 0 && !error ? <p className="py-10 text-center text-sm text-soft">Aucune image. Téléversez la première.</p> : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((i) => (
            <li key={i.key}>
              <button onClick={() => onPick?.(i.url)} disabled={!onPick} className="group block w-full overflow-hidden rounded-xl border border-line bg-white text-start transition-colors enabled:hover:border-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.url} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <p className="num truncate p-2 text-[11px] text-soft">{i.key.replace("uploads/", "")}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MediaPickerField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-2">
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder ?? "https://… ou /api/media/…"} className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand" />
      <button type="button" onClick={() => setOpen(true)} aria-label="Choisir dans la médiathèque" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm hover:border-brand"><ImagePlus size={15} /></button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader><DialogTitle>Médiathèque</DialogTitle></DialogHeader>
          <MediaLibrary onPick={(u) => { onChange(u); setOpen(false); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
