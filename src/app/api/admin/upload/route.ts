import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
  "video/mp4", "video/webm", "application/pdf",
]);

export async function POST(req: Request) {
  try {
    if (!(await getCurrentUser())) {
      return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
    }
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ success: false, error: "Aucun fichier n'a été fourni." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, error: "Type de fichier non autorisé." }, { status: 415 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: "Le fichier dépasse la limite de 10 Mo." }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure filename is safe and unique
    const timestamp = Date.now();
    const safeFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    const uniqueFileName = `${timestamp}-${safeFileName}`;

    // Store to Vercel Blob in production (serverless FS is read-only/ephemeral);
    // fall back to the local public/uploads folder for local development.
    let url: string;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${uniqueFileName}`, buffer, {
        access: "public",
        contentType: file.type || "application/octet-stream",
      });
      url = blob.url;
    } else {
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, uniqueFileName), buffer);
      url = `/uploads/${uniqueFileName}`;
    }

    // Save record to DB Media table
    const media = await prisma.media.create({
      data: {
        url,
        fileName: file.name,
        fileType: file.type.startsWith("image/") ? "IMAGE" : "FILE",
        mimeType: file.type || "image/jpeg",
        size: file.size,
        width: 800, // standard placeholder fallback
        height: 600,
        altText: file.name.split(".")[0] || "Image",
      }
    });

    return NextResponse.json({ success: true, url, media });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Échec de l'upload." }, { status: 500 });
  }
}
