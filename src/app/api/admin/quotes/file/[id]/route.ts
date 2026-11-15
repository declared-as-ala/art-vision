import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

/** Admin-only download of a file a customer attached to a quote request. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await getCurrentUser())) return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  const { id } = await ctx.params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media?.data || media.fileType !== "QUOTE_FILE") return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  const bytes = media.data as unknown as Uint8Array;
  const name = encodeURIComponent(media.fileName || "fichier");
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": media.mimeType || "application/octet-stream",
      "Content-Length": String(bytes.length),
      "Content-Disposition": `attachment; filename*=UTF-8''${name}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
