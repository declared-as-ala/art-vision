import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Cookie-free aggregate counter: stores only (day, path, referrer host) → count. No IP, no UA, no identifiers.
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|lighthouse|headless/i;

export async function POST(request: Request) {
  if (BOT.test(request.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });
  const body = await request.json().catch(() => null);
  const raw = typeof body?.path === "string" ? body.path : "";
  const path = raw.split("?")[0].split("#")[0].slice(0, 200);
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/admin") || path.startsWith("/api")) return new NextResponse(null, { status: 204 });

  let referrer = "";
  try {
    const r = typeof body?.ref === "string" && body.ref ? new URL(body.ref) : null;
    const own = new URL(request.url).hostname;
    if (r && r.hostname !== own) referrer = r.hostname.replace(/^www\./, "").slice(0, 100);
  } catch { /* ignore malformed referrer */ }

  const day = new Date(new Date().toISOString().slice(0, 10));
  try {
    await getDb().pageView.upsert({
      where: { day_path_referrer: { day, path, referrer } },
      update: { count: { increment: 1 } },
      create: { day, path, referrer, count: 1 },
    });
  } catch { /* analytics must never break the site */ }
  return new NextResponse(null, { status: 204 });
}
