import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { tools } from "@/lib/tools";

const VALID_TYPES = new Set(tools.map((t) => t.slug));

// Strip ASCII control characters (0x00â€“0x1F, 0x7F) and cap length.
function clean(v: unknown, max = 2000): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = [...v].filter((ch) => { const c = ch.charCodeAt(0); return c >= 32 && c !== 127; }).join("").trim().slice(0, max);
  return s || undefined;
}

// Cap the JSON payloads so a malicious client can't store megabytes.
function safeJson(v: unknown, max = 20_000): string {
  try {
    const s = JSON.stringify(v ?? {});
    return s.length > max ? JSON.stringify({ truncated: true }) : s;
  } catch {
    return "{}";
  }
}

const schema = z.object({
  toolType: z.string().min(1).max(60),
  name: z.string().max(120).optional(),
  email: z.string().email().max(160).optional(),
  phone: z.string().max(40).optional(),
  consentMarketing: z.boolean().optional(),
  inputData: z.unknown().optional(),
  outputData: z.unknown().optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`submit:${ip}`, { limit: 15, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, error: "Trop de requÃªtes. RÃ©essayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "RequÃªte invalide." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "DonnÃ©es invalides." }, { status: 422 });
  }
  const d = parsed.data;

  if (!VALID_TYPES.has(d.toolType)) {
    return NextResponse.json({ success: false, error: "Outil inconnu." }, { status: 400 });
  }

  // Storing an email requires explicit marketing consent (GDPR).
  if (d.email && !d.consentMarketing) {
    return NextResponse.json(
      { success: false, error: "Le consentement est requis pour enregistrer votre e-mail." },
      { status: 400 }
    );
  }

  try {
    const submission = await prisma.toolSubmission.create({
      data: {
        toolType: d.toolType,
        name: clean(d.name, 120),
        email: clean(d.email, 160),
        phone: clean(d.phone, 40),
        consentMarketing: Boolean(d.consentMarketing),
        inputData: safeJson(d.inputData),
        outputData: safeJson(d.outputData),
      },
    });
    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error("Tool submission error:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de l'enregistrement." }, { status: 500 });
  }
}
