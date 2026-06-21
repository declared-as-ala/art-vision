import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

// Lightweight, integration-ready newsletter signup.
// Stores the lead as a ContactMessage tagged "Newsletter" so it shows up in the
// existing admin flow. Swap the storage for Brevo/Mailchimp later if needed.
const schema = z.object({
  email: z.string().email().max(160),
  source: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  const rl = rateLimit(`newsletter:${clientIp(req)}`, { limit: 8, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ success: false, error: "Trop de requêtes." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Requête invalide." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "E-mail invalide." }, { status: 422 });
  }
  try {
    await prisma.contactMessage.create({
      data: {
        name: "Newsletter",
        email: parsed.data.email,
        message: `Inscription newsletter${parsed.data.source ? ` (source: ${parsed.data.source})` : ""}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}
