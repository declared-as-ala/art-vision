import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

// Public: serve a DB-stored uploaded file (used when no Blob/disk storage is
// available, e.g. Vercel's read-only serverless filesystem). The URL is
// /api/media/<id>[/<filename.ext>] — the id is the first segment; any trailing
// filename only exists so the URL carries the file extension (image vs video).
export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await ctx.params;
    const id = path?.[0];
    if (!id) return new NextResponse("Not found", { status: 404 });

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return new NextResponse("Not found", { status: 404 });

    // If the file lives elsewhere (disk/blob), send the client there.
    if (!media.data) {
      if (media.url && !media.url.startsWith("/api/media/")) {
        return NextResponse.redirect(new URL(media.url, "https://art-visions.fr"));
      }
      return new NextResponse("Not found", { status: 404 });
    }

    const bytes = media.data as unknown as Uint8Array;
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": media.mimeType || "application/octet-stream",
        "Content-Length": String(bytes.length),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Media serve error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
