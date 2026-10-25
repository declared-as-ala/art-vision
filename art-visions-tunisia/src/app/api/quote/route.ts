import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validation/quote";
import { getDb } from "@/lib/db";

// Naive per-instance throttle; replace with Redis if traffic justifies it.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Trop de demandes. Réessayez plus tard." }, { status: 429 });

  const json = await request.json().catch(() => null);
  const parsed = quoteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true }, { status: 201 }); // honeypot

  try {
    await getDb().lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service || null,
        message: data.message,
        source: "quote-form",
      },
    });
  } catch (e) {
    console.error("lead.create failed", e);
    return NextResponse.json({ error: "Service momentanément indisponible." }, { status: 503 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
