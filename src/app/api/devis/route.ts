import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { cleanText, publicFormGuard } from "@/lib/email/security";
import { sendLeadNotification } from "@/lib/email/lead-notification";

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

  try {
    const quote = await prisma.quoteRequest.create({
      data: {
        service: cleanText(d.service, 160)!,
        details: cleanText(d.details, 10000) || "Aucun détail fourni.",
        budget: cleanText(d.budget, 120) || "À définir",
        deadline: cleanText(d.deadline, 120) || "Non précisé",
        fileUrl: null,
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
      });
    } catch (notifErr) {
      console.error("Lead notification failed:", notifErr);
      // We still return success as the quote is saved in database
    }

    return NextResponse.json({ success: true, quoteId: quote.id });
  } catch (error) {
    console.error("Quote submission failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de l’envoi de votre demande. Veuillez réessayer ou nous contacter directement." },
      { status: 500 }
    );
  }
}