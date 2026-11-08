import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { publicFormGuard } from "@/lib/email/security";
import { sendLeadNotification } from "@/lib/email/lead-notification";
import { formatEuros } from "@/lib/money";
import {
  SUBMISSION_ID_RE,
  inspectPdf,
  listSubmissionFiles,
  readStudioFile,
  siteUrl,
  signedFileUrl,
  versionRefOf,
  STUDIO_FILE_TYPE,
  type OrderFiles,
} from "@/lib/studio/files";

export const runtime = "nodejs";
export const maxDuration = 30;

// Files (PDF, project, previews, assets) are uploaded beforehand to
// /api/studio/submissions/<submissionId>/files — this request only carries the order data.
const orderSchema = z.object({
  submissionId: z.string().regex(SUBMISSION_ID_RE),
  productSlug: z.string().min(1).max(120),
  productName: z.string().max(160),
  format: z.string().max(120),
  formatId: z.string().max(40).optional(),
  orientation: z.enum(["portrait", "landscape"]).optional(),
  orderMode: z.enum(["instant", "quote"]).optional().default("instant"),
  deliveryNote: z.string().max(600).optional(),
  exportInfo: z.string().max(200).optional(),
  sides: z.enum(["recto", "recto-verso"]),
  paperId: z.string().max(120),
  paperTitle: z.string().max(160),
  quantity: z.string().max(60),
  priceHtCents: z.number().int().positive(),
  priceTtcCents: z.number().int().positive(),
  vatRate: z.number().optional().default(0.2),
  deliveryCents: z.number().int().default(0),
  dims: z.object({ widthMm: z.number().positive(), heightMm: z.number().positive(), bleedMm: z.number().min(0) }),
  client: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email().max(160),
    phone: z.string().min(6).max(40),
    company: z.string().max(120).optional(),
    shippingAddress: z.object({
      street: z.string().min(3).max(200),
      zipCode: z.string().min(2).max(20),
      city: z.string().min(2).max(100),
      country: z.string().default("France"),
    }),
    billingAddress: z
      .object({
        name: z.string().max(160).optional(),
        street: z.string().min(3).max(200),
        zipCode: z.string().min(2).max(20),
        city: z.string().min(2).max(100),
        country: z.string().max(80).default("France"),
      })
      .optional(),
    notes: z.string().max(2000).optional(),
  }),
});

const fail = (status: number, code: string, error: string, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ success: false, code, error, ...extra }, { status });

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = orderSchema.safeParse(json);
    if (!parsed.success) return fail(422, "INVALID_ORDER", "Données de commande invalides.", { details: parsed.error.format() });
    const d = parsed.data;

    const guard = publicFormGuard(req, "studio-order");
    if (!guard.ok) return fail(guard.status, "GUARD", guard.error);

    // ── Idempotency: a retry of the same submission never creates a second order or e-mail ──
    const existing = await prisma.printQuoteRequest.findFirst({
      where: { options: { contains: `"submissionId":"${d.submissionId}"` } },
      select: { id: true, options: true },
    });
    if (existing) {
      let ref: string | null = null;
      try {
        ref = JSON.parse(existing.options).versionRef ?? null;
      } catch {
        /* ignore */
      }
      return NextResponse.json({ success: true, orderId: existing.id, versionRef: ref, duplicate: true, message: "Cette commande avait déjà été enregistrée." });
    }

    // ── The files must really be stored, readable and correct ──
    const stored = await listSubmissionFiles(d.submissionId);
    const one = (title: string) => stored.find((f) => f.title === title);
    const pdfRow = one("pdf");
    const projectRow = one("project");
    const prevRecto = one("preview-recto");
    const prevVerso = one("preview-verso");
    const expectedPages = d.sides === "recto-verso" ? 2 : 1;

    if (!pdfRow || !projectRow || !prevRecto || (expectedPages === 2 && !prevVerso)) {
      return fail(422, "FILE_MISSING", "Le fichier de votre création n'a pas été enregistré en entier. Relancez la préparation du fichier.");
    }
    const pdfFile = await readStudioFile(pdfRow.id);
    if (!pdfFile) return fail(422, "FILE_MISSING", "Le PDF n'a pas pu être relu après enregistrement. Relancez la préparation du fichier.");
    const check = inspectPdf(pdfFile.buffer, {
      pages: expectedPages,
      widthMm: d.dims.widthMm + d.dims.bleedMm * 2,
      heightMm: d.dims.heightMm + d.dims.bleedMm * 2,
    });
    if (!check.ok) return fail(422, "FILE_INVALID", `${check.error} Relancez la préparation du fichier.`);

    const projectFile = await readStudioFile(projectRow.id);
    let projectOk = false;
    try {
      const p = JSON.parse(projectFile!.buffer.toString("utf8"));
      projectOk = Math.abs(p.design.widthMm - d.dims.widthMm) < 0.05 && Math.abs(p.design.heightMm - d.dims.heightMm) < 0.05;
    } catch {
      projectOk = false;
    }
    if (!projectOk) return fail(422, "PROJECT_INVALID", "Le projet enregistré ne correspond pas au format commandé. Relancez la préparation du fichier.");

    const versionRef = versionRefOf(d.submissionId);
    const assets = stored.filter((f) => f.title === "asset").map((f) => ({ id: f.id, name: f.fileName, size: f.size }));
    const files: OrderFiles = {
      pdf: { id: pdfRow.id, name: pdfRow.fileName, size: pdfRow.size, pages: check.pages, widthMm: check.widthMm, heightMm: check.heightMm },
      project: { id: projectRow.id, name: projectRow.fileName, size: projectRow.size },
      previewRecto: { id: prevRecto.id, name: prevRecto.fileName, size: prevRecto.size },
      previewVerso: prevVerso ? { id: prevVerso.id, name: prevVerso.fileName, size: prevVerso.size } : null,
      assets,
    };

    const optionsPayload = {
      orderSource: "STUDIO_ONLINE",
      submissionId: d.submissionId,
      versionRef,
      format: d.format,
      formatId: d.formatId || null,
      orientation: d.orientation || null,
      orderMode: d.orderMode,
      dims: d.dims,
      sides: d.sides,
      paperId: d.paperId,
      paperTitle: d.paperTitle,
      quantity: d.quantity,
      company: d.client.company || null,
      shippingAddress: d.client.shippingAddress,
      billingAddress: d.client.billingAddress || null,
      notes: d.client.notes || null,
      deliveryNote: d.deliveryNote || null,
      exportInfo: d.exportInfo || null,
      batStatus: "BAT_PENDING",
      hasPdf: true,
      files,
    };

    const order = await prisma.printQuoteRequest.create({
      data: {
        productSlug: d.productSlug,
        productName: `${d.productName} (${d.orderMode === "quote" ? "Devis Studio" : "Création Studio"})`,
        options: JSON.stringify(optionsPayload),
        estimatedTtcCents: d.priceTtcCents,
        name: d.client.name,
        email: d.client.email.toLowerCase(),
        phone: d.client.phone,
        message: [
          `Commande Studio — ${d.productName} (${versionRef})`,
          `Format : ${d.format}`,
          `Options : ${d.paperTitle} — ${d.quantity} — ${d.sides}`,
          `Livraison : ${d.client.shippingAddress.street}, ${d.client.shippingAddress.zipCode} ${d.client.shippingAddress.city}, ${d.client.shippingAddress.country}`,
          d.client.billingAddress
            ? `Facturation : ${d.client.billingAddress.name || ""} ${d.client.billingAddress.street}, ${d.client.billingAddress.zipCode} ${d.client.billingAddress.city}, ${d.client.billingAddress.country}`
            : null,
          `Notes client : ${d.client.notes || "Aucune"}`,
        ]
          .filter(Boolean)
          .join("\n"),
        status: "NEW",
      },
    });

    // The submission is now archived with the order (no longer purgeable)
    await prisma.media.updateMany({
      where: { fileType: STUDIO_FILE_TYPE, altText: d.submissionId },
      data: { caption: `order:${order.id}` },
    });

    // ── Notifications: each message only announces the files and links it really contains ──
    const site = siteUrl();
    const slugTag = d.productSlug.replace(/[^a-z0-9-]/gi, "");
    const formatTag = (d.formatId || "format").replace(/[^a-z0-9-]/gi, "");
    const pdfName = `${versionRef}_${slugTag}_${formatTag}.pdf`;
    const MAX_ATTACH = 8_000_000;
    const attachPdf = pdfFile.size > 0 && pdfFile.size <= MAX_ATTACH;

    let emailStatus: "sent" | "partial" | "failed" = "sent";
    try {
      const result = await sendLeadNotification({
        type: "printing",
        lead: {
          name: d.client.name,
          email: d.client.email,
          phone: d.client.phone,
          company: d.client.company,
          service: `Studio Impression : ${d.productName} — ${d.format}`,
          estimatedPrice: formatEuros(d.priceTtcCents),
          message: `Nouvelle ${d.orderMode === "quote" ? "demande de devis" : "commande"} Studio (${versionRef}).`,
          details: {
            "Référence commande": order.id,
            "Version archivée": versionRef,
            Support: d.productName,
            Format: d.format,
            Orientation: d.orientation === "portrait" ? "Portrait" : d.orientation === "landscape" ? "Paysage" : "—",
            Faces: d.sides === "recto-verso" ? "Recto / Verso" : "Recto seul",
            "Papier & finition": d.paperTitle,
            Quantité: d.quantity,
            "Total TTC": formatEuros(d.priceTtcCents),
            Mode: d.orderMode === "quote" ? "Demande de devis (estimation)" : "Commande au tarif catalogue",
            Export: d.exportInfo || `${check.pages} page(s) · ${check.widthMm} × ${check.heightMm} mm`,
            "Adresse de livraison": `${d.client.shippingAddress.street}, ${d.client.shippingAddress.zipCode} ${d.client.shippingAddress.city}, ${d.client.shippingAddress.country}`,
            "Adresse de facturation": d.client.billingAddress
              ? `${d.client.billingAddress.name || ""} ${d.client.billingAddress.street}, ${d.client.billingAddress.zipCode} ${d.client.billingAddress.city}, ${d.client.billingAddress.country}`
              : "Identique à la livraison",
            "Remarques client": d.client.notes || "Aucune",
          },
          uploadedFiles: [
            { name: `Télécharger le PDF (${check.pages} p., ${(pdfFile.size / 1024 / 1024).toFixed(2).replace(".", ",")} Mo)`, url: signedFileUrl(order.id, "pdf", { download: true }) },
            { name: "Ouvrir le PDF dans le navigateur", url: signedFileUrl(order.id, "pdf") },
            { name: "Projet modifiable (JSON)", url: signedFileUrl(order.id, "project", { download: true }) },
          ],
          clientFiles: [{ name: `Votre fichier PDF (${versionRef})`, url: signedFileUrl(order.id, "pdf", { download: true }) }],
        },
        metadata: {
          sourceUrl: `${site}/studio`,
          dashboardUrl: `${site}/admin/print?tab=orders&order=${order.id}`,
        },
        internalAttachments: attachPdf ? [{ filename: pdfName, contentType: "application/pdf", mediaId: pdfRow.id }] : undefined,
        relatedEntityType: "PrintQuoteRequest",
        relatedEntityId: order.id,
      });
      const r = result as { skipped?: boolean; internal?: { success: boolean }; client?: { success: boolean } | null };
      if (!r.skipped) {
        if (r.internal && !r.internal.success) emailStatus = "failed";
        else if (r.client && !r.client.success) emailStatus = "partial";
      }
    } catch (emailErr) {
      console.error("Studio lead email notification failed:", emailErr);
      emailStatus = "failed";
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      versionRef,
      emailStatus,
      downloadUrl: signedFileUrl(order.id, "pdf", { download: true }),
      file: { pages: check.pages, widthMm: check.widthMm, heightMm: check.heightMm, size: pdfFile.size },
      message: "Votre commande a été transmise à notre atelier avec succès.",
    });
  } catch (error) {
    console.error("Studio order error:", error);
    return fail(500, "SERVER", "Erreur interne lors de l'enregistrement de la commande. Votre création est conservée : réessayez.");
  }
}
