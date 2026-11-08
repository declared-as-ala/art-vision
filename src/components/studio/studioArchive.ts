import type { StudioDesign } from "./studioTypes";
import type { StudioSpec } from "./studioProducts";

/** Per-request body limit on the host is ~4.5 MB: every upload stays under this. */
const MAX_UPLOAD_BYTES = 3_800_000;

export interface ProjectAsset {
  name: string;
  blob: Blob;
}

export function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`.slice(0, 48);
}

/** Cheap stable hash (djb2) used to detect that a design changed between two submissions. */
export function hashString(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  return String(h >>> 0);
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(",", 2);
  const mime = head.match(/data:([^;]+)/)?.[1] || "application/octet-stream";
  if (head.includes(";base64")) {
    const bin = atob(body);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }
  return new Blob([decodeURIComponent(body)], { type: mime });
}

const EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg" };

async function shrinkImage(blob: Blob): Promise<Blob> {
  if (blob.size <= MAX_UPLOAD_BYTES || blob.type === "image/svg+xml") return blob;
  const bitmap = await createImageBitmap(blob);
  let scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
  for (let i = 0; i < 4; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const out = await new Promise<Blob | null>((res) => canvas.toBlob(res, blob.type === "image/png" && i < 2 ? "image/png" : "image/jpeg", 0.88));
    if (out && out.size <= MAX_UPLOAD_BYTES) return out;
    scale *= 0.75;
  }
  throw new Error("Une image importée est trop lourde pour être archivée. Importez une version plus légère.");
}

/**
 * Build the editable project file. Embedded images are pulled out into separate assets
 * (referenced as asset://name) so each upload stays small.
 */
export async function buildProjectPackage(
  design: StudioDesign,
  spec: StudioSpec,
  submissionId: string,
  versionRef: string
): Promise<{ projectBlob: Blob; assets: ProjectAsset[] }> {
  const copy: StudioDesign = JSON.parse(JSON.stringify(design));
  const assets: ProjectAsset[] = [];
  const seen = new Map<string, string>();

  for (const side of [copy.recto, copy.verso]) {
    for (const el of side.elements) {
      if (el.type !== "image" || !el.src?.startsWith("data:")) continue;
      let name = seen.get(el.src);
      if (!name) {
        const blob = await shrinkImage(dataUrlToBlob(el.src));
        name = `image-${assets.length + 1}.${EXT[blob.type] || "bin"}`;
        assets.push({ name, blob });
        seen.set(el.src, name);
      }
      el.src = `asset://${name}`;
    }
  }

  const project = {
    format: "art-vision-studio-project",
    version: 1,
    versionRef,
    submissionId,
    createdAt: new Date().toISOString(),
    spec: {
      productId: spec.productId,
      formatId: spec.formatId,
      orientation: spec.orientation,
      widthMm: spec.widthMm,
      heightMm: spec.heightMm,
      bleedMm: spec.bleedMm,
      safeMarginMm: spec.safeMarginMm,
      title: spec.title,
      dimensionsLabel: spec.dimensionsLabel,
    },
    design: copy,
  };
  return { projectBlob: new Blob([JSON.stringify(project)], { type: "application/json" }), assets };
}

export interface UploadedFile {
  id: string;
  size: number;
}

/** Upload one file and verify the server stored exactly these bytes. Retries transient failures. */
export async function uploadSubmissionFile(
  submissionId: string,
  kind: "pdf" | "project" | "preview-recto" | "preview-verso" | "asset",
  blob: Blob,
  name: string
): Promise<UploadedFile> {
  if (blob.size === 0) throw new Error("Le fichier généré est vide.");
  if (blob.size > MAX_UPLOAD_BYTES + 200_000) throw new Error("Le fichier généré est trop volumineux pour l'envoi.");
  let lastError = "Envoi impossible.";
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const form = new FormData();
      form.set("kind", kind);
      form.set("name", name);
      form.set("file", new File([blob], name, { type: blob.type }));
      const res = await fetch(`/api/studio/submissions/${submissionId}/files`, { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        if (data.size !== blob.size) throw new Error("Le fichier reçu ne correspond pas au fichier envoyé.");
        return { id: data.id, size: data.size };
      }
      lastError = data.error || `Erreur serveur (${res.status}).`;
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break; // not worth retrying
    } catch (e) {
      lastError = e instanceof Error ? e.message : "Connexion interrompue.";
    }
    await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
  }
  throw new Error(lastError);
}

/** Restore `asset://` references of an archived project to loadable URLs. */
export function resolveArchiveAssets(design: StudioDesign, resolve: (name: string) => string): StudioDesign {
  const copy: StudioDesign = JSON.parse(JSON.stringify(design));
  for (const side of [copy.recto, copy.verso]) {
    for (const el of side.elements) {
      if (el.type === "image" && el.src?.startsWith("asset://")) el.src = resolve(el.src.slice("asset://".length));
    }
  }
  return copy;
}
