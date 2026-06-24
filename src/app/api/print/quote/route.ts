import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { publicFormGuard } from "@/lib/email/security";
import { sendLeadNotification } from "@/lib/email/lead-notification";
import { formatEuros } from "@/lib/money";

const schema = z.object({
  productSlug: z.string().min(1).max(120), productName: z.string().max(120).optional(), options: z.unknown().optional(),
  estimatedTtcCents: z.number().int().optional(), name: z.string().max(120).optional(), email: z.string().email().max(160).optional(),
  phone: z.string().max(40).optional(), message: z.string().max(2000).optional(), website: z.string().optional(), sourceUrl: z.string().url().max(500).optional(),
});
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({}))); if (!parsed.success) return NextResponse.json({ success: false, error: "Données invalides." }, { status: 422 });
  const d = parsed.data, guard = publicFormGuard(req, "printquote", d.website); if (!guard.ok) return NextResponse.json({ success: false, error: guard.error }, { status: guard.status });
  try {
    const order = await prisma.printQuoteRequest.create({ data: { productSlug: d.productSlug, productName: d.productName || null, options: JSON.stringify(d.options ?? {}).slice(0, 8000), estimatedTtcCents: d.estimatedTtcCents ?? null, name: d.name || null, email: d.email?.toLowerCase() || null, phone: d.phone || null, message: d.message || null } });
    if (d.name || d.email || d.phone) await sendLeadNotification({ type: "printing", lead: { name: d.name, email: d.email, phone: d.phone, service: d.productName || d.productSlug, message: d.message, estimatedPrice: d.estimatedTtcCents != null ? formatEuros(d.estimatedTtcCents) : undefined, details: typeof d.options === "object" && d.options ? d.options as Record<string, unknown> : { options: d.options } }, metadata: { sourceUrl: d.sourceUrl, dashboardUrl: `${process.env.SITE_URL || "https://art-visions.fr"}/admin/print` }, relatedEntityType: "PrintQuoteRequest", relatedEntityId: order.id });
    return NextResponse.json({ success: true, id: order.id });
  } catch (error) { console.error("Print quote submission failed", error instanceof Error ? error.message : "unknown"); return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 }); }
}