import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const schema = z.object({
  productSlug: z.string().min(1).max(120),
  productName: z.string().max(120).optional(),
  options: z.unknown().optional(),
  estimatedTtcCents: z.number().int().optional(),
  name: z.string().max(120).optional(),
  email: z.string().email().max(160).optional(),
  phone: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  const rl = rateLimit(`printquote:${clientIp(req)}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ success: false, error: "Trop de requêtes." }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ success: false, error: "Données invalides." }, { status: 422 });
  const d = parsed.data;
  try {
    const order = await prisma.printQuoteRequest.create({
      data: {
        productSlug: d.productSlug,
        productName: d.productName || null,
        options: JSON.stringify(d.options ?? {}).slice(0, 8000),
        estimatedTtcCents: d.estimatedTtcCents ?? null,
        name: d.name || null,
        email: d.email || null,
        phone: d.phone || null,
        message: d.message || null,
      },
    });
    return NextResponse.json({ success: true, id: order.id });
  } catch (e) {
    console.error("print quote POST:", e);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}
