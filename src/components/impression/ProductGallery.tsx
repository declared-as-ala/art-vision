"use client";

import { useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";

export interface GalleryImage { src: string; alt: string }

/** Large product visual, thumbnails when several visuals exist, and a full-size view (native <dialog>: Esc, focus trap). */
export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = images[Math.min(active, images.length - 1)];
  if (!current) return null;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label="Agrandir l'image du produit"
        className="group relative block w-full aspect-[4/3] overflow-hidden rounded-2xl border border-brand-purple/25 bg-[#120a28]/90 p-4 shadow-2xl shadow-brand-purple/20 transition hover:border-brand-magenta/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-magenta cursor-zoom-in"
      >
        <img src={current.src} alt={current.alt} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
          <Maximize2 size={13} aria-hidden /> Agrandir
        </span>
      </button>

      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto" aria-label="Visuels du produit">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Voir le visuel ${i + 1}`}
                aria-current={i === active}
                className={`h-16 w-20 overflow-hidden rounded-lg border bg-[#120a28]/90 p-1 transition ${i === active ? "border-brand-magenta" : "border-brand-purple/25 hover:border-brand-magenta/50"}`}
              >
                <img src={img.src} alt="" className="h-full w-full object-contain" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}
        aria-label="Image du produit en grand"
        className="m-auto max-h-[92vh] w-[min(92vw,1100px)] rounded-2xl border border-brand-purple/30 bg-[#0b0314] p-3 text-white backdrop:bg-black/80"
      >
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Fermer" className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 hover:bg-brand-magenta">
          <X size={18} />
        </button>
        <img src={current.src} alt={current.alt} className="mx-auto max-h-[84vh] w-auto max-w-full object-contain" />
      </dialog>
    </div>
  );
}
