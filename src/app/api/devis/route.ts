import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { cleanText, publicFormGuard } from "@/lib/email/security";
import { sendLeadNotification } from "@/lib/email/lead-notification";

/** Customer files attached to a quote: stored privately (QUOTE_FILE, never served by /api/media) and e-mailed to the team. */
const ALLOWED_EXT: Record<string, string> = {
  pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", zip: "application/zip",
  ai: "application/postscript", psd: "image/vnd.adobe.photoshop", svg: "image/svg+xml",
};
const MAX_FILE_BYTES = 7 * 1024 * 1024;

function decodeUpload(fileData: string, fileName?: string): { buffer: Buffer; name: string; mime: string } | { error: string } {
  const m = /^data:([^;,]*)(?:;[^,]*)?;base64,([\s\S]+)$/.exec(fileData);
  if (!m) return { error: "Le fichier joint n'a pas pu être lu. Réessayez ou envoyez-le par e-mail." };
  const base = (fileName || "fichier").split(/[\/]/).pop()!.replace(/[^\w.\- ()]/g, "_").slice(0, 120) || "fichier";
  const ext = (base.split(".").pop() || "").toLowerCase();
  if (!ALLOWED_EXT[ext]) return { error: "Type de fichier non accepté (PDF, PNG, JPG, ZIP, AI, PSD ou SVG)." };
  const buffer = Buffer.from(m[2], "base64");
  if (buffer.length === 0) return { error: "Le fichier joint est vide." };
  if (buffer.length > MAX_FILE_BYTES) return { error: "Le fichier dépasse 7 Mo. Envoyez-le par lien après validation de votre demande." };
  return { buffer, name: base, mime: ALLOWED_EXT[ext] };
}

const schema = z.object({
  service: z.string().min(1, "Prestation requise").max(160),
  details: z.string().max(10000).optional().default(""),
  budget: z.string().max(120).optional().default("À définir"),
  deadline: z.string().max(120).optional().default(""),
  fileData: z.string().max(8_000_000).optional(),
  fileName: z.string().max(180).optional(),
  name: z.string().min(2, "Nom requis").max(120),
  email: z.string().email("Adresse e-mail invalide").max(160),
  phone: z.string().max(40).optional().default(""),
  company: z.string().max(160).optional(),
  consent: z.literal(true),
  website: z.string().optional(),
  sourceUrl: z.string().url().max(500).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Requête invalide." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ") || "Veuillez vérifier les informations saisies.";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 422 }
    );
  }

  const d = parsed.data;
  const g = publicFormGuard(req, "quote", d.website);
  if (!g.ok) {
    return NextResponse.json({ success: false, error: g.error }, { status: g.status });
  }

  let upload: { buffer: Buffer; name: string; mime: string } | null = null;
  if (d.fileData) {
    const r = decodeUpload(d.fileData, d.fileName);
    if ("error" in r) return NextResponse.json({ success: false, error: r.error }, { status: 422 });
    upload = r;
  }

  let mediaId: string | null = null;
  try {
    if (upload) {
      const media = await prisma.media.create({
        data: {
          url: "", data: new Uint8Array(upload.buffer), fileName: upload.name, fileType: "QUOTE_FILE", mimeType: upload.mime,
          size: upload.buffer.length, width: 0, height: 0, title: "Fichier joint à une demande de devis",
        },
        select: { id: true },
      });
      mediaId = media.id;
    }
    const quote = await prisma.quoteRequest.create({
      data: {
        service: cleanText(d.service, 160)!,
        details: cleanText(d.details, 10000) || "Aucun détail fourni.",
        budget: cleanText(d.budget, 120) || "À définir",
        deadline: cleanText(d.deadline, 120) || "Non précisé",
        fileUrl: mediaId ? `/api/admin/quotes/file/${mediaId}` : null,
        name: cleanText(d.name, 120)!,
        email: d.email.toLowerCase(),
        phone: cleanText(d.phone, 40) || "",
        company: cleanText(d.company, 160),
        consent: true,
        status: "NEW",
      },
    });

    try {
      await sendLeadNotification({
        type: d.service.toLowerCase().includes("impression") ? "printing" : "quote",
        lead: {
          name: d.name,
          email: d.email,
          phone: d.phone,
          company: d.company,
          service: d.service,
          budget: d.budget,
          deadline: d.deadline,
          message: d.details,
        },
        metadata: {
          sourceUrl: d.sourceUrl,
          dashboardUrl: `${process.env.SITE_URL || "https://art-visions.fr"}/admin/quotes`,
          quoteUrl: `${process.env.SITE_URL || "https://art-visions.fr"}/admin/quotes`,
        },
        relatedEntityType: "QuoteRequest",
        relatedEntityId: quote.id,
        internalAttachments: mediaId && upload ? [{ filename: upload.name, contentType: upload.mime, mediaId }] : undefined,
      });
    } catch (notifErr) {
      console.error("Lead notification failed:", notifErr);
      // We still return success as the quote is saved in database
    }

    return NextResponse.json({ success: true, quoteId: quote.id });
  } catch (error) {
    if (mediaId) await prisma.media.delete({ where: { id: mediaId } }).catch(() => {});
    console.error("Quote submission failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de l’envoi de votre demande. Veuillez réessayer ou nous contacter directement." },
      { status: 500 }
    );
  }
}