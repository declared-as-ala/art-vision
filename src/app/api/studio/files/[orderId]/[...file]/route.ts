import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { legacyPdfMediaId, readStudioFile, verifyOrderToken, type OrderFiles } from "@/lib/studio/files";

export const runtime = "nodejs";

/**
 * Controlled access to the files archived with a Studio order.
 *  - Art Vision team: admin session cookie.
 *  - Customer / e-mail links: signed token (?t=…) bound to this order.
 * Everything else gets a 404 (never reveals whether an order exists).
 */
export async function GET(req: Request, ctx: { params: Promise<{ orderId: string; file: string[] }> }) {
  const { orderId, file } = await ctx.params;
  const url = new URL(req.url);
  const notFound = () => new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });

  const allowed = verifyOrderToken(url.searchParams.get("t"), orderId) || Boolean(await getCurrentUser());
  if (!allowed) return notFound();

  const order = await prisma.printQuoteRequest.findUnique({ where: { id: orderId }, select: { id: true, options: true } });
  if (!order) return notFound();

  let options: Record<string, any> = {};
  try {
    options = JSON.parse(order.options);
  } catch {
    return notFound();
  }
  const files: OrderFiles | undefined = options.files;
  const kind = file[0];

  let mediaId: string | null = null;
  let downloadName = "fichier";
  if (files) {
    if (kind === "pdf") {
      mediaId = files.pdf?.id ?? null;
      downloadName = files.pdf?.name ?? "commande.pdf";
    } else if (kind === "project") {
      mediaId = files.project?.id ?? null;
      downloadName = `${options.versionRef || "projet"}-projet.json`;
    } else if (kind === "preview-recto") {
      mediaId = files.previewRecto?.id ?? null;
      downloadName = `${options.versionRef || "apercu"}-recto.jpg`;
    } else if (kind === "preview-verso") {
      mediaId = files.previewVerso?.id ?? null;
      downloadName = `${options.versionRef || "apercu"}-verso.jpg`;
    } else if (kind === "asset" && file[1]) {
      const a = files.assets?.find((x) => x.name === decodeURIComponent(file[1]));
      mediaId = a?.id ?? null;
      downloadName = a?.name ?? "image";
    }
  } else if (kind === "pdf") {
    // Orders recorded before the full archive: fall back to the stored pdfUrl
    mediaId = legacyPdfMediaId(order.options);
    if (!mediaId && typeof options.pdfUrl === "string" && /^https?:\/\//.test(options.pdfUrl)) {
      return NextResponse.redirect(options.pdfUrl);
    }
    downloadName = `commande-${orderId}.pdf`;
  }
  if (!mediaId) return notFound();

  const media = await readStudioFile(mediaId);
  if (!media || media.size === 0) return notFound();
  if (media.fileName && kind === "pdf" && !files) downloadName = media.fileName;

  const inline = url.searchParams.get("download") !== "1" && kind !== "project";
  const safeName = downloadName.replace(/[^A-Za-z0-9._-]+/g, "-");
  return new NextResponse(new Uint8Array(media.buffer), {
    status: 200,
    headers: {
      "Content-Type": media.mimeType || "application/octet-stream",
      "Content-Length": String(media.buffer.length),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
