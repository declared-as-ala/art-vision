"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileEdit, Trash2 } from "lucide-react";
import { listDrafts, specToQuery, buildSpec, getProduct, type StoredDraftInfo } from "./studioProducts";

/** "Reprendre un brouillon": lists the designs kept in this browser (one per support + format). */
export default function StudioDrafts() {
  const [drafts, setDrafts] = useState<StoredDraftInfo[] | null>(null);

  useEffect(() => {
    // localStorage is only available after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrafts(listDrafts());
  }, []);

  if (!drafts || drafts.length === 0) return null;

  const hrefFor = (d: StoredDraftInfo) => {
    const product = getProduct(d.productId);
    const spec = product
      ? buildSpec(product, d.formatId, d.orientation, product.custom ? { w: d.widthMm / 10, h: d.heightMm / 10 } : undefined)
      : null;
    return spec ? `/studio/editor?${specToQuery(spec)}` : "/studio";
  };

  return (
    <section className="space-y-4" aria-label="Reprendre un brouillon">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <FileEdit size={18} className="text-av-orange" /> Reprendre une création en cours
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {drafts.map((d) => (
          <li
            key={d.key}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"
          >
            <Link href={hrefFor(d)} className="min-w-0 flex-1 group">
              <span className="block text-sm font-bold text-white truncate group-hover:text-av-orange transition-colors">
                {d.title}
              </span>
              <span className="block text-[11px] text-white/50">
                {d.dimensionsLabel}
                {d.updatedAt ? ` · modifié le ${new Date(d.updatedAt).toLocaleDateString("fr-FR")}` : ""}
              </span>
            </Link>
            <Link href={hrefFor(d)} className="p-2 rounded-lg text-av-orange hover:bg-white/10 transition" aria-label="Reprendre">
              <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Supprimer définitivement ce brouillon (${d.title}, ${d.dimensionsLabel}) ?`)) {
                  try {
                    localStorage.removeItem(d.key);
                  } catch {
                    /* ignore */
                  }
                  setDrafts(listDrafts());
                }
              }}
              className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
              aria-label="Supprimer ce brouillon"
            >
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
