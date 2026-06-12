import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Bot/crawler user agents to ignore
const BOT_PATTERN = /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|facebot|ia_archiver|ahrefsbot|semrushbot|mj12bot|dotbot|uptimerobot|pingdom|pagespeed|lighthouse/i;

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || "";

    // Skip bots and crawlers
    if (BOT_PATTERN.test(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    const body = await req.json();
    const path = body?.path as string;

    // Validate path
    if (!path || typeof path !== "string" || path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true });
    }

    // Normalise to start-of-day UTC for grouping by day
    const now = new Date();
    const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    // Upsert: increment count for this path+day
    await prisma.pageView.upsert({
      where: { path_date: { path, date: dayStart } },
      update: { count: { increment: 1 } },
      create: { path, date: dayStart, count: 1 },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Fail silently — never break the page for tracking errors
    return NextResponse.json({ ok: true });
  }
}
