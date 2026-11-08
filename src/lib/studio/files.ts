import "server-only";
import crypto from "node:crypto";
import prisma from "@/lib/prisma";

/**
 * Archive of what a customer sent with a Studio order.
 *
 * Files live in the existing `Media` table (bytes in the DB, which is Turso in production so
 * they survive restarts and redeploys) with `fileType = "STUDIO_FILE"`. They are NEVER served by the
 * public /api/media route: access goes through /api/studio/files/* (admin session or signed link).
 *
 *  altText = submissionId   (version reference, groups the files of one submission)
 *  title   = kind           ("pdf" | "project" | "preview-recto" | "preview-verso" | "asset")
 *  caption = "pending" until the order is committed, then "order:<orderId>"
 */

export const STUDIO_FILE_TYPE = "STUDIO_FILE";
export type StudioFileKind = "pdf" | "project" | "preview-recto" | "preview-verso" | "asset";

export const SUBMISSION_ID_RE = /^[A-Za-z0-9-]{16,64}$/;

export function siteUrl(): string {
  const raw = process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";
  const withProtocol = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  const url = new URL(withProtocol);
  // Production links in e-mails must be HTTPS and absolute
  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") url.protocol = "https:";
  return url.origin;
}

/** "AV-20261109-3F9A2C1B" — short, human-friendly version reference. */
export function versionRefOf(submissionId: string, date = new Date()): string {
  const d = date.toISOString().slice(0, 10).replace(/-/g, "");
  return `AV-${d}-${submissionId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

/* ───────────── signed links (customer / e-mail) ───────────── */

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("JWT_SECRET must be configured in production.");
  return "development-only-change-me";
}

const b64 = (s: string) => Buffer.from(s).toString("base64url");

/** Long-lived (default 2 years) download token bound to one order. */
export function signOrderToken(orderId: string, ttlSeconds = 60 * 60 * 24 * 730): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${orderId}.${exp}`;
  const sig = crypto.createHmac("sha256", secret()).update(`studio-file:${payload}`).digest("base64url");
  return `${b64(payload)}.${sig}`;
}

export function verifyOrderToken(token: string | null | undefined, orderId: string): boolean {
  if (!token) return false;
  const [p, sig] = token.split(".");
  if (!p || !sig) return false;
  try {
    const payload = Buffer.from(p, "base64url").toString();
    const expected = crypto.createHmac("sha256", secret()).update(`studio-file:${payload}`).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    const [id, exp] = payload.split(".");
    return id === orderId && Number(exp) * 1000 > Date.now();
  } catch {
    return false;
  }
}

/** Absolute HTTPS link to a file of an order (signed, so it works from an e-mail). */
export function signedFileUrl(orderId: string, file: string, opts: { download?: boolean } = {}): string {
  const q = new URLSearchParams({ t: signOrderToken(orderId) });
  if (opts.download) q.set("download", "1");
  return `${siteUrl()}/api/studio/files/${orderId}/${file}?${q.toString()}`;
}

/* ───────────── storage ───────────── */

export async function saveStudioFile(input: {
  submissionId: string;
  kind: StudioFileKind;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}) {
  // Re-uploading the same file of the same submission replaces it (safe retries)
  await prisma.media.deleteMany({
    where: { fileType: STUDIO_FILE_TYPE, altText: input.submissionId, title: input.kind, fileName: input.fileName },
  });
  const media = await prisma.media.create({
    data: {
      url: "",
      data: new Uint8Array(input.buffer),
      fileName: input.fileName,
      fileType: STUDIO_FILE_TYPE,
      mimeType: input.mimeType,
      size: input.buffer.length,
      width: 0,
      height: 0,
      altText: input.submissionId,
      title: input.kind,
      caption: "pending",
    },
    select: { id: true, size: true, fileName: true },
  });
  return media;
}

export async function listSubmissionFiles(submissionId: string) {
  return prisma.media.findMany({
    where: { fileType: STUDIO_FILE_TYPE, altText: submissionId },
    select: { id: true, title: true, fileName: true, size: true, mimeType: true, caption: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function readStudioFile(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media?.data) return null;
  return { buffer: Buffer.from(media.data as unknown as Uint8Array), mimeType: media.mimeType, fileName: media.fileName, size: media.size, fileType: media.fileType };
}

/** Delete submission files that were uploaded but never attached to an order. */
export async function purgeStalePendingFiles(maxAgeMs = 3 * 24 * 3600 * 1000) {
  await prisma.media.deleteMany({
    where: { fileType: STUDIO_FILE_TYPE, caption: "pending", createdAt: { lt: new Date(Date.now() - maxAgeMs) } },
  });
}

/* ───────────── PDF verification ───────────── */

export interface PdfCheck {
  ok: boolean;
  error?: string;
  pages: number;
  widthMm: number;
  heightMm: number;
  size: number;
}

/** Structural check of a generated PDF: header, size, page count and page dimensions. */
export function inspectPdf(buffer: Buffer, expected?: { pages: number; widthMm: number; heightMm: number; toleranceMm?: number }): PdfCheck {
  const size = buffer.length;
  const fail = (error: string, extra: Partial<PdfCheck> = {}): PdfCheck => ({ ok: false, error, pages: 0, widthMm: 0, heightMm: 0, size, ...extra });
  if (size < 800) return fail("Le fichier PDF est vide ou incomplet.");
  if (buffer.subarray(0, 5).toString("latin1") !== "%PDF-") return fail("Le fichier n'est pas un PDF valide.");
  const text = buffer.toString("latin1");
  if (!/%%EOF\s*$/.test(text.slice(-64))) return fail("Le PDF est tronqué (fin de fichier manquante).");
  const pages = (text.match(/\/Type\s*\/Page[^s]/g) || []).length;
  const box = text.match(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/);
  if (!box || pages === 0) return fail("Structure PDF illisible (pages introuvables).", { pages });
  const widthMm = (parseFloat(box[1]) * 25.4) / 72;
  const heightMm = (parseFloat(box[2]) * 25.4) / 72;
  const result: PdfCheck = { ok: true, pages, widthMm: Math.round(widthMm * 10) / 10, heightMm: Math.round(heightMm * 10) / 10, size };
  if (expected) {
    const tol = expected.toleranceMm ?? 0.8;
    if (pages !== expected.pages) return { ...result, ok: false, error: `Nombre de pages inattendu (${pages} au lieu de ${expected.pages}).` };
    if (Math.abs(widthMm - expected.widthMm) > tol || Math.abs(heightMm - expected.heightMm) > tol) {
      return {
        ...result,
        ok: false,
        error: `Dimensions du PDF inattendues (${result.widthMm} × ${result.heightMm} mm au lieu de ${expected.widthMm} × ${expected.heightMm} mm).`,
      };
    }
  }
  return result;
}

/* ───────────── order file model (stored in PrintQuoteRequest.options.files) ───────────── */

export interface OrderFileRef {
  id: string;
  name: string;
  size: number;
}
export interface OrderFiles {
  pdf: OrderFileRef & { pages: number; widthMm: number; heightMm: number };
  project: OrderFileRef;
  previewRecto: OrderFileRef;
  previewVerso: OrderFileRef | null;
  assets: OrderFileRef[];
}

export type StudioFileState = "ready" | "legacy-ready" | "missing";

export interface StudioOrderView {
  isStudio: boolean;
  versionRef: string | null;
  state: StudioFileState;
  stateLabel: string;
  pdf: { name: string; size: number; pages: number | null; widthMm: number | null; heightMm: number | null } | null;
  hasPreviewRecto: boolean;
  hasPreviewVerso: boolean;
  hasProject: boolean;
  /** For legacy orders we only have the PDF: previews can be shown from it */
  previewFromPdf: boolean;
  summary: {
    format: string | null;
    formatId: string | null;
    orientation: string | null;
    paper: string | null;
    quantity: string | null;
    sides: string | null;
    exportInfo: string | null;
    deliveryNote: string | null;
  };
  notes: string[];
}

const mediaIdFromUrl = (url: string | null | undefined) => {
  const m = (url || "").match(/\/api\/media\/([^/?#]+)/);
  return m ? m[1] : null;
};

/** Inspect an order's stored options and verify (against the DB) which files really exist. */
export async function describeStudioOrder(optionsJson: string): Promise<StudioOrderView> {
  let o: Record<string, any> = {};
  try {
    o = JSON.parse(optionsJson);
  } catch {
    /* keep empty */
  }
  const isStudio = o.orderSource === "STUDIO_ONLINE";
  const summary = {
    format: o.format ?? null,
    formatId: o.formatId ?? null,
    orientation: o.orientation ?? null,
    paper: o.paperTitle ?? null,
    quantity: o.quantity ?? null,
    sides: o.sides ?? null,
    exportInfo: o.exportInfo ?? null,
    deliveryNote: o.deliveryNote ?? null,
  };
  const base: StudioOrderView = {
    isStudio,
    versionRef: o.versionRef ?? null,
    state: "missing",
    stateLabel: "",
    pdf: null,
    hasPreviewRecto: false,
    hasPreviewVerso: false,
    hasProject: false,
    previewFromPdf: false,
    summary,
    notes: [],
  };
  if (!isStudio) return base;

  const files: OrderFiles | undefined = o.files;
  if (files?.pdf) {
    const ids = [files.pdf.id, files.project?.id, files.previewRecto?.id, files.previewVerso?.id].filter(Boolean) as string[];
    const found = await prisma.media.findMany({ where: { id: { in: ids } }, select: { id: true, size: true } });
    const has = (id?: string) => !!id && found.some((f) => f.id === id && f.size > 0);
    const pdfOk = has(files.pdf.id);
    return {
      ...base,
      state: pdfOk ? "ready" : "missing",
      stateLabel: pdfOk ? "PDF archivé et disponible" : "PDF introuvable dans l'archive",
      pdf: { name: files.pdf.name, size: files.pdf.size, pages: files.pdf.pages, widthMm: files.pdf.widthMm, heightMm: files.pdf.heightMm },
      hasPreviewRecto: has(files.previewRecto?.id),
      hasPreviewVerso: has(files.previewVerso?.id),
      hasProject: has(files.project?.id),
      notes: pdfOk ? [] : ["Le fichier référencé par la commande n'existe plus. Contactez le client pour qu'il renvoie son projet."],
    };
  }

  // Legacy order: only pdfUrl / hasPdf were recorded
  const legacyId = mediaIdFromUrl(o.pdfUrl);
  if (legacyId) {
    const m = await prisma.media.findUnique({ where: { id: legacyId }, select: { id: true, size: true, fileName: true } });
    if (m && m.size > 0) {
      return {
        ...base,
        state: "legacy-ready",
        stateLabel: "PDF disponible (commande antérieure)",
        pdf: { name: m.fileName || "commande.pdf", size: m.size, pages: null, widthMm: null, heightMm: null },
        previewFromPdf: true,
        notes: ["Commande enregistrée avant l'archivage complet : le PDF est disponible, mais le projet modifiable n'a pas été conservé."],
      };
    }
  }
  if (typeof o.pdfUrl === "string" && /^https?:\/\//.test(o.pdfUrl)) {
    return {
      ...base,
      state: "legacy-ready",
      stateLabel: "PDF disponible (commande antérieure)",
      pdf: { name: o.pdfUrl.split("/").pop() || "commande.pdf", size: 0, pages: null, widthMm: null, heightMm: null },
      previewFromPdf: true,
      notes: ["Commande enregistrée avant l'archivage complet : le projet modifiable n'a pas été conservé."],
    };
  }
  return {
    ...base,
    state: "missing",
    stateLabel: o.hasPdf ? "PDF annoncé mais introuvable" : "Aucun PDF conservé",
    notes: [
      o.hasPdf
        ? "Le PDF annoncé n'est plus récupérable. L'aperçu enregistré à l'époque était tronqué et ne permet pas de reconstituer le fichier."
        : "Cette commande a été enregistrée avant la conservation des fichiers. L'aperçu enregistré était tronqué : demandez au client de renvoyer sa création.",
      "Récupération possible : écrire au client (bouton ci-dessous) pour qu'il rouvre son brouillon sur son appareil et renvoie la commande.",
    ],
  };
}

/** Fallback: resolve the media id of a legacy PDF. */
export function legacyPdfMediaId(optionsJson: string): string | null {
  try {
    const o = JSON.parse(optionsJson);
    return mediaIdFromUrl(o.pdfUrl);
  } catch {
    return null;
  }
}
