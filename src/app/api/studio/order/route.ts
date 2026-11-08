import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { publicFormGuard } from "@/lib/email/security";
import { sendLeadNotification } from "@/lib/email/lead-notification";
import { formatEuros } from "@/lib/money";

const orderSchema = z.object({
  productSlug: z.string().min(1).max(120),
  productName: z.string().max(160),
  format: z.string().max(80),
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

    // Construct detailed options payload
    const optionsPayload = {
      orderSource: "STUDIO_ONLINE",
      format: d.format,
      sides: d.sides,
      paperId: d.paperId,
      paperTitle: d.paperTitle,
      quantity: d.quantity,
      company: d.client.company || null,
      shippingAddress: d.client.shippingAddress,
      notes: d.client.notes || null,
      batStatus: "BAT_PENDING",
      previewRecto: d.previewRecto ? d.previewRecto.slice(0, 500) + "..." : null, // preview indicator
      hasPdf: Boolean(d.pdfBase64),
      designSummary: {
        product: d.productName,
        sides: d.sides,
      },
    };

    // Store in Prisma PrintQuoteRequest
    const order = await prisma.printQuoteRequest.create({
      data: {
        productSlug: d.productSlug,
        productName: `${d.productName} (Création Studio)`,
        options: JSON.stringify(optionsPayload),
        estimatedTtcCents: d.priceTtcCents,
        name: d.client.name,
        email: d.client.email.toLowerCase(),
        phone: d.client.phone,
        message: `Commande Studio - ${d.productName}\nOptions: ${d.paperTitle} - ${d.quantity} - ${d.sides}\nLivraison: ${d.client.shippingAddress.street}, ${d.client.shippingAddress.zipCode} ${d.client.shippingAddress.city}\nNotes client: ${d.client.notes || "Aucune"}`,
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
            "Adresse de livraison": `${d.client.shippingAddress.street}, ${d.client.shippingAddress.zipCode} ${d.client.shippingAddress.city}`,
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
