import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const BOT = /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|facebot|ahrefsbot|semrushbot|mj12bot|dotbot|uptimerobot|pingdom|pagespeed|lighthouse/i;

const deviceFromUA = (ua: string) =>
  /tablet|ipad/i.test(ua) ? "tablet" : /mobile|android|iphone|ipod/i.test(ua) ? "mobile" : "desktop";

const browserFromUA = (ua: string) =>
  /edg/i.test(ua) ? "Edge" : /opr|opera/i.test(ua) ? "Opera" : /chrome|crios/i.test(ua) ? "Chrome" : /firefox|fxios/i.test(ua) ? "Firefox" : /safari/i.test(ua) ? "Safari" : "Autre";

function sourceFromReferrer(ref: string | null, host: string): string {
  if (!ref) return "direct";
  try {
    const u = new URL(ref);
    if (u.host.includes(host)) return "direct";
    if (/google|bing|yahoo|duckduckgo|qwant|ecosia/i.test(u.host)) return "organic";
    if (/facebook|instagram|linkedin|twitter|t\.co|tiktok|youtube|pinterest|reddit/i.test(u.host)) return "social";
    return "referral";
  } catch {
    return "direct";
  }
}

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  if (BOT.test(ua)) return NextResponse.json({ ok: true });
  if (!rateLimit(`analytics:${clientIp(req)}`, { limit: 80, windowMs: 60_000 }).ok) return NextResponse.json({ ok: true });

  try {
    const b = await req.json();
    const path = String(b.pagePath || "").slice(0, 300);
    if (path.startsWith("/admin") || path.startsWith("/api")) return NextResponse.json({ ok: true });

    const host = req.headers.get("host") || "";
    const referrer = b.referrer ? String(b.referrer) : null;
    const cityRaw = req.headers.get("x-vercel-ip-city");

    await prisma.analyticsEvent.create({
      data: {
        eventType: String(b.eventType || "page_view").slice(0, 40),
        pagePath: path,
        pageTitle: b.pageTitle ? String(b.pageTitle).slice(0, 200) : null,
        sessionId: b.sessionId ? String(b.sessionId).slice(0, 40) : null,
        visitorId: b.visitorId ? String(b.visitorId).slice(0, 40) : null,
        country: req.headers.get("x-vercel-ip-country") || null,
        city: cityRaw ? decodeURIComponent(cityRaw).slice(0, 80) : null,
        deviceType: deviceFromUA(ua),
        browser: browserFromUA(ua),
        referrer: referrer ? referrer.slice(0, 300) : null,
        source: b.source ? String(b.source).slice(0, 40) : sourceFromReferrer(referrer, host),
        medium: b.medium ? String(b.medium).slice(0, 40) : null,
        campaign: b.campaign ? String(b.campaign).slice(0, 80) : null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
