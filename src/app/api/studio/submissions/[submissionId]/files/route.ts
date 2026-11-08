import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  SUBMISSION_ID_RE,
  inspectPdf,
  purgeStalePendingFiles,
  saveStudioFile,
  type StudioFileKind,
} from "@/lib/studio/files";

export const runtime = "nodejs";

const MAX_BYTES = 4_000_000; // stays under the serverless request body limit
const KINDS: Record<string, { mimes: string[]; ext: string }> = {
  pdf: { mimes: ["application/pdf"], ext: "pdf" },
  project: { mimes: ["application/json"], ext: "json" },
  "preview-recto": { mimes: ["image/jpeg"], ext: "jpg" },
  "preview-verso": { mimes: ["image/jpeg"], ext: "jpg" },
  asset: { mimes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"], ext: "bin" },
};

/**
 * Step 1 of a Studio order: the browser uploads each file of the submission (PDF, editable project,
 * previews, image assets). Every upload is verified and the response carries the stored size so the
 * client can confirm the file really arrived. Uploads are idempotent per (submission, kind, name).
 */
export async function POST(req: Request, ctx: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await ctx.params;
  if (!SUBMISSION_ID_RE.test(submissionId)) {
    return NextResponse.json({ success: false, error: "Référence de soumission invalide." }, { status: 400 });
  }
  const rl = rateLimit(`studio-upload:${clientIp(req)}`, { limit: 60, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ success: false, error: "Trop d'envois. Réessayez dans un instant." }, { status: 429 });

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const expected = req.headers.get("x-forwarded-host") || req.headers.get("host");
      if (expected && new URL(origin).host !== expected) return NextResponse.json({ success: false, error: "Origine refusée." }, { status: 403 });
    } catch {
      return NextResponse.json({ success: false, error: "Origine refusée." }, { status: 403 });
    }
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ success: false, error: "Envoi illisible." }, { status: 400 });
  }
  const kind = String(form.get("kind") || "");
  const file = form.get("file");
  const rule = KINDS[kind];
  if (!rule || !(file instanceof File)) {
    return NextResponse.json({ success: false, error: "Type de fichier non pris en charge." }, { status: 400 });
  }
  if (file.size === 0) return NextResponse.json({ success: false, error: "Le fichier est vide." }, { status: 422 });
  if (file.size > MAX_BYTES) return NextResponse.json({ success: false, error: "Fichier trop volumineux (4 Mo maximum par envoi)." }, { status: 413 });
  const mime = (file.type || "").split(";")[0];
  if (!rule.mimes.includes(mime)) return NextResponse.json({ success: false, error: "Format de fichier refusé." }, { status: 415 });

  const buffer = Buffer.from(await file.arrayBuffer());

  if (kind === "pdf") {
    const check = inspectPdf(buffer);
    if (!check.ok) return NextResponse.json({ success: false, error: check.error }, { status: 422 });
  }
  if (kind === "project") {
    try {
      const parsed = JSON.parse(buffer.toString("utf8"));
      if (!parsed?.design?.recto) throw new Error("bad");
    } catch {
      return NextResponse.json({ success: false, error: "Projet illisible." }, { status: 422 });
    }
  }
  if (kind.startsWith("preview") && buffer.subarray(0, 2).toString("hex") !== "ffd8") {
    return NextResponse.json({ success: false, error: "Aperçu invalide." }, { status: 422 });
  }

  const rawName = String(form.get("name") || `${kind}.${rule.ext}`);
  const safeName = rawName.replace(/[^A-Za-z0-9._-]+/g, "-").slice(0, 80) || `${kind}.${rule.ext}`;

  try {
    await purgeStalePendingFiles();
    const saved = await saveStudioFile({ submissionId, kind: kind as StudioFileKind, fileName: safeName, mimeType: mime, buffer });
    return NextResponse.json({ success: true, id: saved.id, size: saved.size, name: saved.fileName, kind });
  } catch (error) {
    console.error("Studio upload failed:", error);
    return NextResponse.json({ success: false, error: "Le fichier n'a pas pu être enregistré. Réessayez." }, { status: 500 });
  }
}
