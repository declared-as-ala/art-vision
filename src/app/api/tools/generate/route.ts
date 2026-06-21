import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import {
  generateSlogans,
  generateBios,
  generateCaptions,
} from "@/lib/ai-tools";

// Public endpoint that powers the slogan / bio / caption generators.
// Heavier rate limit because each call may hit an external AI provider.

const sloganSchema = z.object({
  kind: z.literal("slogan"),
  businessName: z.string().min(1).max(80),
  industry: z.string().max(80).default(""),
  tone: z.string().max(40).default("Moderne"),
  audience: z.string().max(120).optional(),
  keywords: z.string().max(200).optional(),
});

const bioSchema = z.object({
  kind: z.literal("bio"),
  businessName: z.string().min(1).max(80),
  activity: z.string().max(80).default(""),
  city: z.string().max(80).optional(),
  services: z.string().max(200).optional(),
  phone: z.string().max(40).optional(),
  website: z.string().max(120).optional(),
  tone: z.string().max(40).default("Moderne"),
  emojis: z.boolean().default(true),
  cta: z.boolean().default(true),
});

const captionSchema = z.object({
  kind: z.literal("caption"),
  businessType: z.string().min(1).max(80),
  postType: z.string().max(40).default("Promotion"),
  tone: z.string().max(40).default("Moderne"),
  city: z.string().max(80).optional(),
  details: z.string().max(400).default(""),
  ctaPreference: z.string().max(120).optional(),
});

const schema = z.discriminatedUnion("kind", [sloganSchema, bioSchema, captionSchema]);

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`generate:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, error: "Trop de générations. Patientez un instant." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Requête invalide." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides." }, { status: 422 });
  }
  const d = parsed.data;

  try {
    if (d.kind === "slogan") {
      const r = await generateSlogans(d);
      return NextResponse.json({ success: true, ...r });
    }
    if (d.kind === "bio") {
      const r = await generateBios(d);
      return NextResponse.json({ success: true, ...r });
    }
    const r = await generateCaptions(d);
    return NextResponse.json({ success: true, ...r });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ success: false, error: "Erreur de génération." }, { status: 500 });
  }
}
