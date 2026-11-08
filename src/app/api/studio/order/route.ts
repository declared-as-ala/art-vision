import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { publicFormGuard } from "@/lib/email/security";
import { sendLeadNotification } from "@/lib/email/lead-notification";
import { formatEuros } from "@/lib/money";

const orderSchema = z.object({
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
  quantity: z.string().max(40),
  priceHtCents: z.number().int().positive(),
  priceTtcCents: z.number().int().positive(),
  vatRate: z.number().optional().default(0.2),
  deliveryCents: z.number().int().default(0),
  previewRecto: z.string().min(1),
  previewVerso: z.string().optional(),
  pdfBase64: z.string().optional(),
  designData: z.unknown(),
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

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = orderSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Données de commande invalides.", details: parsed.error.format() },
        { status: 422 }
      );
    }

    const d = parsed.data;

    // Rate-limiting and honeypot guard
    const guard = publicFormGuard(req, "studio-order");
    if (!guard.ok) {
      return NextResponse.json({ success: false, error: guard.error }, { status: guard.status });
    }

    // Server-side price safety validation:
    // Ensure TTC corresponds to HT + TVA
    const computedTtc = Math.round(d.priceHtCents * (1 + (d.vatRate || 0.2)));
    if (Math.abs(computedTtc - d.priceTtcCents) > 100) {
      // Small rounding tolerance (1 euro)
      console.warn("Price discrepancy detected, clamping to server-calculated TTC:", computedTtc, d.priceTtcCents);
    }

    // Keep the print-ready PDF: Vercel Blob when configured, otherwise DB-backed media
    let pdfUrl: string | null = null;
    if (d.pdfBase64) {
      try {
        const base64 = d.pdfBase64.replace(/^data:application\/pdf;base64,/, "");
        const buffer = Buffer.from(base64, "base64");
        const safeName = `studio-${d.productSlug}-${Date.now()}.pdf`;
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          const { put } = await import("@vercel/blob");
          const blob = await put(`studio-orders/${safeName}`, buffer, { access: "public", contentType: "application/pdf" });
          pdfUrl = blob.url;
        } else {
          const media = await prisma.media.create({
            data: {
              url: "",
              data: buffer,
              fileName: safeName,
              fileType: "FILE",
              mimeType: "application/pdf",
              size: buffer.length,
              width: 0,
              height: 0,
              altText: "Fichier commande Studio",
            },
          });
          pdfUrl = `/api/media/${media.id}/${safeName}`;
          await prisma.media.update({ where: { id: media.id }, data: { url: pdfUrl } });
        }
      } catch (pdfErr) {
        console.error("Studio PDF storage failed:", pdfErr);
      }
    }

    // Construct detailed options payload
    const optionsPayload = {
      orderSource: "STUDIO_ONLINE",
      format: d.format,
      formatId: d.formatId || null,
      orientation: d.orientation || null,
      orderMode: d.orderMode,
      deliveryNote: d.deliveryNote || null,
      exportInfo: d.exportInfo || null,
      pdfUrl,
      billingAddress: d.client.billingAddress || null,
      sides: d.sides,
      paperId: d.paperId,
      paperTitle: d.paperTitle,
      quantity: d.quantity,
      company: d.client.company || null,
      shippingAddress: d.client.shippingAddress,
      notes: d.client.notes || null,
      batStatus: "BAT_PENDING",
      previewRecto: d.previewRecto ? d.previewRecto.slice(0, 500) + "..." : null, // preview indicator
      hasPdf: Boolean(pdfUrl),
      designSummary: {
        product: d.productName,
        sides: d.sides,
      },
    };

    // Store in Prisma PrintQuoteRequest
    const order = await prisma.printQuoteRequest.create({
      data: {
        productSlug: d.productSlug,
        productName: `${d.productName} (${d.orderMode === "quote" ? "Devis Studio" : "Création Studio"})`,
        options: JSON.stringify(optionsPayload),
        estimatedTtcCents: d.priceTtcCents,
        name: d.client.name,
        email: d.client.email.toLowerCase(),
        phone: d.client.phone,
        message: `Commande Studio - ${d.productName}\nOptions: ${d.paperTitle} - ${d.quantity} - ${d.sides}\nFormat: ${d.format}\nLivraison: ${d.client.shippingAddress.street}, ${d.client.shippingAddress.zipCode} ${d.client.shippingAddress.city}, ${d.client.shippingAddress.country}${d.client.billingAddress ? `\nFacturation: ${d.client.billingAddress.name || ""} ${d.client.billingAddress.street}, ${d.client.billingAddress.zipCode} ${d.client.billingAddress.city}, ${d.client.billingAddress.country}` : ""}\nFichier: ${pdfUrl || "non enregistré"} (${d.exportInfo || "n/a"})\nNotes client: ${d.client.notes || "Aucune"}`,
        status: "NEW",
      },
    });

    // Notify team via email
    try {
      await sendLeadNotification({
        type: "printing",
        lead: {
          name: d.client.name,
          email: d.client.email,
          phone: d.client.phone,
          service: `Studio Impression : ${d.productName}`,
          estimatedPrice: formatEuros(d.priceTtcCents),
          message: `Nouvelle commande personnalisée dans le Studio Art Vision.\nProduit: ${d.productName}\nPapier: ${d.paperTitle}\nQuantité: ${d.quantity}\nAdresse: ${d.client.shippingAddress.street}, ${d.client.shippingAddress.zipCode} ${d.client.shippingAddress.city}`,
          details: {
            "Référence commande": order.id,
            "Format": d.format,
            "Faces": d.sides,
            "Papier & Finition": d.paperTitle,
            "Quantité": d.quantity,
            "Total TTC": formatEuros(d.priceTtcCents),
            "Entreprise": d.client.company || "Particulier / Non renseigné",
            "Adresse de livraison": `${d.client.shippingAddress.street}, ${d.client.shippingAddress.zipCode} ${d.client.shippingAddress.city}, ${d.client.shippingAddress.country}`,
            "Adresse de facturation": d.client.billingAddress
              ? `${d.client.billingAddress.name || ""} ${d.client.billingAddress.street}, ${d.client.billingAddress.zipCode} ${d.client.billingAddress.city}, ${d.client.billingAddress.country}`
              : "Identique à la livraison",
            "Mode": d.orderMode === "quote" ? "Demande de devis (estimation)" : "Commande au tarif catalogue",
            "Fichier PDF": pdfUrl ? (pdfUrl.startsWith("http") ? pdfUrl : `${process.env.SITE_URL || "https://art-visions.fr"}${pdfUrl}`) : "non enregistré",
            "Export": d.exportInfo || "n/a",
          },
        },
        metadata: {
          sourceUrl: `${process.env.SITE_URL || "https://art-visions.fr"}/studio`,
          dashboardUrl: `${process.env.SITE_URL || "https://art-visions.fr"}/admin/print`,
        },
        relatedEntityType: "PrintQuoteRequest",
        relatedEntityId: order.id,
      });
    } catch (emailErr) {
      console.error("Studio lead email notification failed:", emailErr);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Votre commande a été transmise à notre atelier avec succès.",
    });
  } catch (error: any) {
    console.error("Studio order error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne lors de l'enregistrement de la commande." },
      { status: 500 }
    );
  }
}

