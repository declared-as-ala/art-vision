import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { publicFormGuard } from "@/lib/email/security";
import { sendLeadNotification } from "@/lib/email/lead-notification";

const schema = z.object({
  name: z.string().min(1).max(120), jobTitle: z.string().max(160), phone: z.string().max(40), email: z.string().email().max(160),
  address: z.string().max(300).optional(), website: z.string().max(500).optional(), socials: z.string().max(10000).optional(),
  templateId: z.string().max(120).optional(), colors: z.string().max(10000).optional(), qrData: z.string().max(5000).optional(),
  sourceUrl: z.string().url().max(500).optional(), websiteTrap: z.string().optional(),
});
export async function POST(req: Request) {
  let body: unknown; try { body = await req.json(); } catch { return NextResponse.json({ success: false, error: "Requête invalide." }, { status: 400 }); }
  const parsed = schema.safeParse(body); if (!parsed.success) return NextResponse.json({ success: false, error: "Données invalides." }, { status: 422 });
  const d = parsed.data, guard = publicFormGuard(req, "business-card", d.websiteTrap); if (!guard.ok) return NextResponse.json({ success: false, error: guard.error }, { status: guard.status });
  try {
    let template = await prisma.businessCardTemplate.findFirst({ where: { id: d.templateId } });
    if (!template) template = await prisma.businessCardTemplate.create({ data: { id: d.templateId || "modern-minimalist", name: d.templateId === "creative" ? "Creative Gradient" : "Modern Minimalist", layout: d.colors || "{}" } });
    const row = await prisma.generatedBusinessCard.create({ data: { templateId: template.id, name: d.name, jobTitle: d.jobTitle, phone: d.phone, email: d.email.toLowerCase(), address: d.address, website: d.website, socials: d.socials, colors: d.colors, qrData: d.qrData } });
    await sendLeadNotification({ type: "business-card", lead: { name: d.name, email: d.email, phone: d.phone, toolName: "Générateur de carte de visite", details: { jobTitle: d.jobTitle, website: d.website, template: d.templateId } }, metadata: { sourceUrl: d.sourceUrl }, relatedEntityType: "GeneratedBusinessCard", relatedEntityId: row.id });
    return NextResponse.json({ success: true, cardId: row.id });
  } catch (error) { console.error("Business card save failed", error instanceof Error ? error.message : "unknown"); return NextResponse.json({ success: false, error: "Erreur lors de la sauvegarde." }, { status: 500 }); }
}