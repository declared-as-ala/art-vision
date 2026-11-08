"use client";

import { useState } from "react";
import { Download, ExternalLink, FileText, FolderOpen, Mail, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { StudioOrderView } from "@/lib/studio/files";

interface Props {
  orderId: string;
  productName?: string;
  clientEmail?: string;
  clientName?: string;
  studio: StudioOrderView;
  rawOptions: string;
}

const fmtSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2).replace(".", ",")} Mo` : `${Math.max(1, Math.round(bytes / 1024))} Ko`;

/** Replace long strings (image data, base64…) so the technical block can never stretch the page. */
function compact(value: unknown): unknown {
  if (typeof value === "string") return value.length > 120 ? `${value.slice(0, 60)}… [${value.length} caractères]` : value;
  if (Array.isArray(value)) return value.map(compact);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, compact(v)]));
  return value;
}

const STATE_STYLE = {
  ready: { cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", Icon: CheckCircle2 },
  "legacy-ready": { cls: "bg-amber-500/15 text-amber-300 border-amber-500/30", Icon: AlertTriangle },
  missing: { cls: "bg-red-500/15 text-red-300 border-red-500/30", Icon: XCircle },
} as const;

/** What the print shop needs for a Studio order: previews, specs, the exact PDF and the editable project. */
export default function StudioOrderPanel({ orderId, productName, clientEmail, clientName, studio, rawOptions }: Props) {
  const [recto404, setRecto404] = useState(false);
  const [verso404, setVerso404] = useState(false);
  const base = `/api/studio/files/${orderId}`;
  const st = STATE_STYLE[studio.state];
  const s = studio.summary;
  const orientation = s.orientation === "portrait" ? "Portrait" : s.orientation === "landscape" ? "Paysage" : "—";
  const printsVerso = s.sides === "recto-verso";

  let technical = "";
  try {
    technical = JSON.stringify(compact(JSON.parse(rawOptions)), null, 1);
  } catch {
    technical = "(données illisibles)";
  }

  const mailto =
    clientEmail &&
    `mailto:${clientEmail}?subject=${encodeURIComponent(`Votre commande Studio ${studio.versionRef || ""} — fichier à renvoyer`)}&body=${encodeURIComponent(
      `Bonjour ${clientName || ""},\n\nNous n'avons pas pu récupérer le fichier de votre création (${productName || "commande Studio"}). Pouvez-vous rouvrir votre création sur art-visions.fr/studio puis renvoyer votre commande ?\n\nMerci,\nArt Vision`
    )}`;

  const preview = (kind: "preview-recto" | "preview-verso", label: string, failed: boolean, onError: () => void) => (
    <figure className="w-24 shrink-0">
      <a href={`${base}/${kind}`} target="_blank" rel="noreferrer" className="block rounded-md overflow-hidden border border-white/15 bg-black/40 hover:border-brand-magenta transition">
        {failed ? (
          <span className="flex h-16 items-center justify-center text-[9px] text-white/40 text-center px-1">Aperçu indisponible</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${base}/${kind}`} alt={`Aperçu ${label}`} loading="lazy" onError={onError} className="w-full h-auto block" />
        )}
      </a>
      <figcaption className="text-[9px] text-center text-white/50 mt-1">{label}</figcaption>
    </figure>
  );

  return (
    <div className="mt-2 space-y-2.5 rounded-lg border border-white/10 bg-black/20 p-2.5 max-w-[380px]">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-bold ${st.cls}`}>
          <st.Icon size={10} /> {studio.stateLabel}
        </span>
        {studio.versionRef && <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/70">{studio.versionRef}</span>}
      </div>

      {/* Previews */}
      <div className="flex gap-2.5 items-start">
        {studio.hasPreviewRecto && preview("preview-recto", "Recto", recto404, () => setRecto404(true))}
        {studio.hasPreviewVerso && preview("preview-verso", "Verso", verso404, () => setVerso404(true))}
        {studio.hasPreviewRecto && !studio.hasPreviewVerso && !printsVerso && (
          <span className="self-center text-[9px] text-white/40">Verso non imprimé</span>
        )}
        {studio.previewFromPdf && (
          <figure className="w-24 shrink-0">
            <iframe
              title="Aperçu du PDF"
              src={`${base}/pdf#page=1&toolbar=0&navpanes=0&view=Fit`}
              loading="lazy"
              className="h-32 w-24 rounded-md border border-white/15 bg-white"
            />
            <figcaption className="text-[9px] text-center text-white/50 mt-1">Page 1 du PDF</figcaption>
          </figure>
        )}
      </div>

      {/* Facts */}
      <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-[10px]">
        <dt className="text-white/40">Support</dt>
        <dd className="text-white/85 break-words">{productName || "—"}</dd>
        <dt className="text-white/40">Format</dt>
        <dd className="text-white/85 break-words">{s.format || "—"}</dd>
        <dt className="text-white/40">Orientation</dt>
        <dd className="text-white/85">{orientation}</dd>
        <dt className="text-white/40">Papier</dt>
        <dd className="text-white/85 break-words">{s.paper || "—"}</dd>
        <dt className="text-white/40">Quantité</dt>
        <dd className="text-white/85">{s.quantity || "—"}</dd>
        <dt className="text-white/40">Faces</dt>
        <dd className="text-white/85">{printsVerso ? "Recto / Verso" : "Recto seul"}</dd>
        {studio.pdf && (
          <>
            <dt className="text-white/40">Fichier</dt>
            <dd className="text-white/85 break-all">
              {studio.pdf.name}
              <span className="text-white/45">
                {studio.pdf.size ? ` · ${fmtSize(studio.pdf.size)}` : ""}
                {studio.pdf.pages ? ` · ${studio.pdf.pages} page${studio.pdf.pages > 1 ? "s" : ""}` : ""}
                {studio.pdf.widthMm ? ` · ${studio.pdf.widthMm} × ${studio.pdf.heightMm} mm` : ""}
              </span>
            </dd>
          </>
        )}
      </dl>

      {/* Actions */}
      <div className="flex flex-wrap gap-1.5">
        {studio.state !== "missing" ? (
          <>
            <a href={`${base}/pdf`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md bg-brand-purple px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-brand-purple/80 transition">
              <ExternalLink size={11} /> Ouvrir le PDF
            </a>
            <a href={`${base}/pdf?download=1`} download className="inline-flex items-center gap-1 rounded-md bg-brand-magenta px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-brand-magenta/80 transition">
              <Download size={11} /> Télécharger le PDF
            </a>
          </>
        ) : (
          mailto && (
            <a href={mailto} className="inline-flex items-center gap-1 rounded-md bg-brand-orange px-2.5 py-1.5 text-[10px] font-bold text-white hover:brightness-110 transition">
              <Mail size={11} /> Demander le fichier au client
            </a>
          )
        )}
        {studio.hasProject && (
          <>
            <a href={`/studio/editor?archive=${orderId}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2.5 py-1.5 text-[10px] font-bold text-white/90 hover:bg-white/10 transition">
              <FolderOpen size={11} /> Ouvrir le projet
            </a>
            <a href={`${base}/project`} download className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2.5 py-1.5 text-[10px] font-bold text-white/90 hover:bg-white/10 transition">
              <FileText size={11} /> Projet (JSON)
            </a>
          </>
        )}
      </div>

      {studio.notes.map((n) => (
        <p key={n} className="text-[10px] leading-snug text-white/55">{n}</p>
      ))}

      <details>
        <summary className="cursor-pointer text-[10px] text-brand-magenta">Données techniques</summary>
        <pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded bg-black/40 p-2 text-[9px] text-white/50">{technical}</pre>
      </details>
    </div>
  );
}
