import "server-only";
import { CreateBucketCommand, GetObjectCommand, HeadBucketCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const BUCKET = process.env.S3_BUCKET ?? "avtn-media";

let client: S3Client | null = null;
let ready: Promise<void> | null = null;

function s3() {
  if (!process.env.S3_ENDPOINT || !process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) throw new Error("Stockage non configuré (S3_*)");
  client ??= new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION ?? "us-east-1",
    forcePathStyle: true,
    credentials: { accessKeyId: process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_SECRET_KEY },
  });
  return client;
}

async function ensureBucket() {
  ready ??= (async () => {
    try { await s3().send(new HeadBucketCommand({ Bucket: BUCKET })); }
    catch { await s3().send(new CreateBucketCommand({ Bucket: BUCKET })); }
  })().catch((e) => { ready = null; throw e; });
  return ready;
}

export const ALLOWED = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" } as const;
export const MAX_BYTES = 8 * 1024 * 1024;

export async function putImage(file: File) {
  const ext = ALLOWED[file.type as keyof typeof ALLOWED];
  if (!ext) throw new Error("Format non autorisé (PNG, JPG, WebP, GIF, AVIF).");
  if (file.size > MAX_BYTES) throw new Error("Fichier trop lourd (8 Mo max).");
  await ensureBucket();
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "image";
  const key = `uploads/${Date.now()}-${base}.${ext}`;
  await s3().send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type, CacheControl: "public, max-age=31536000, immutable" }));
  return { key, url: `/api/media/${key}` };
}

export async function listImages() {
  await ensureBucket();
  const r = await s3().send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "uploads/", MaxKeys: 200 }));
  return (r.Contents ?? [])
    .map((o) => ({ key: o.Key!, url: `/api/media/${o.Key}`, size: o.Size ?? 0, modified: o.LastModified?.toISOString() ?? "" }))
    .sort((a, b) => b.modified.localeCompare(a.modified));
}

export async function getObject(key: string) {
  const r = await s3().send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  return { body: r.Body!.transformToWebStream(), type: r.ContentType ?? "application/octet-stream", length: r.ContentLength };
}
