import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function dayStart(d: Date) { return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); }
function addDays(d: Date, n: number) { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x; }

async function distinctVisitors(where: any): Promise<number> {
  const rows = await prisma.analyticsEvent.findMany({ where: { ...where, eventType: "page_view" }, select: { visitorId: true }, distinct: ["visitorId"] });
  return rows.filter((r) => r.visitorId).length;
}
async function pageViews(where: any): Promise<number> {
  return prisma.analyticsEvent.count({ where: { ...where, eventType: "page_view" } });
}

export async function GET(req: Request) {
  if (!(await getCurrentUser())) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const now = new Date();
  const today = dayStart(now);
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : addDays(today, -29);
  const to = searchParams.get("to") ? new Date(new Date(searchParams.get("to")!).setUTCHours(23, 59, 59, 999)) : now;

  try {
    // ── Preset visitor cards ──
    const yest = addDays(today, -1);
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const lastMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const lastMonthEnd = new Date(monthStart.getTime() - 1);

    const [vToday, vYest, v7, v30, vMonth, vLastMonth, vTotal, pvTotal] = await Promise.all([
      distinctVisitors({ createdAt: { gte: today } }),
      distinctVisitors({ createdAt: { gte: yest, lt: today } }),
      distinctVisitors({ createdAt: { gte: addDays(today, -6) } }),
      distinctVisitors({ createdAt: { gte: addDays(today, -29) } }),
      distinctVisitors({ createdAt: { gte: monthStart } }),
      distinctVisitors({ createdAt: { gte: lastMonthStart, lte: lastMonthEnd } }),
      distinctVisitors({}),
      pageViews({}),
    ]);

    // ── Range data ──
    const where = { createdAt: { gte: from, lte: to } };
    const events = await prisma.analyticsEvent.findMany({
      where,
      select: { eventType: true, pagePath: true, pageTitle: true, visitorId: true, sessionId: true, deviceType: true, browser: true, source: true, country: true, city: true, createdAt: true },
      take: 60000,
      orderBy: { createdAt: "asc" },
    });
    const pv = events.filter((e) => e.eventType === "page_view");
    const uniq = (arr: (string | null)[]) => new Set(arr.filter(Boolean) as string[]).size;

    const tally = (key: keyof (typeof pv)[number]) => {
      const m = new Map<string, number>();
      for (const e of pv) { const k = (e[key] as string) || "—"; m.set(k, (m.get(k) || 0) + 1); }
      return [...m.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
    };

    // top pages with distinct visitors
    const pageMap = new Map<string, { views: number; visitors: Set<string> }>();
    for (const e of pv) {
      const k = e.pagePath || "/";
      const cur = pageMap.get(k) || { views: 0, visitors: new Set<string>() };
      cur.views++; if (e.visitorId) cur.visitors.add(e.visitorId);
      pageMap.set(k, cur);
    }
    const topPages = [...pageMap.entries()].map(([path, v]) => ({ path, views: v.views, visitors: v.visitors.size })).sort((a, b) => b.views - a.views).slice(0, 15);

    // daily series (visitors + pageviews per day)
    const dayMap = new Map<string, { visitors: Set<string>; views: number }>();
    for (let d = dayStart(from); d <= to; d = addDays(d, 1)) dayMap.set(d.toISOString().slice(0, 10), { visitors: new Set(), views: 0 });
    for (const e of pv) {
      const k = new Date(e.createdAt).toISOString().slice(0, 10);
      const cur = dayMap.get(k); if (!cur) continue;
      cur.views++; if (e.visitorId) cur.visitors.add(e.visitorId);
    }
    const daily = [...dayMap.entries()].map(([date, v]) => ({ date, visitors: v.visitors.size, views: v.views }));

    // new vs returning within range
    const rangeVisitorIds = [...new Set(pv.map((e) => e.visitorId).filter(Boolean) as string[])];
    const priorRows = await prisma.analyticsEvent.findMany({ where: { eventType: "page_view", createdAt: { lt: from }, visitorId: { in: rangeVisitorIds } }, select: { visitorId: true }, distinct: ["visitorId"] });
    const priorSet = new Set(priorRows.map((r) => r.visitorId));
    const returningVisitors = rangeVisitorIds.filter((v) => priorSet.has(v)).length;
    const newVisitors = rangeVisitorIds.length - returningVisitors;

    // conversions (from events + existing models)
    const evCount = (type: string) => events.filter((e) => e.eventType === type).length;
    const [quoteRequests, contacts, toolGenerations, printQuotes, newsletters] = await Promise.all([
      prisma.quoteRequest.count({ where }).catch(() => 0),
      prisma.contactMessage.count({ where: { ...where, NOT: { name: "Newsletter" } } }).catch(() => 0),
      prisma.toolSubmission.count({ where }).catch(() => 0),
      prisma.printQuoteRequest.count({ where }).catch(() => 0),
      prisma.contactMessage.count({ where: { ...where, name: "Newsletter" } }).catch(() => 0),
    ]);
    const whatsappClicks = evCount("whatsapp_click");
    const ctaClicks = events.filter((e) => e.eventType.endsWith("_click")).length;

    if (searchParams.get("format") === "csv") {
      const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const csv = "﻿" + ["Date,Visiteurs,Pages vues", ...daily.map((d) => [d.date, d.visitors, d.views].map(cell).join(","))].join("\r\n");
      return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="analytics-${Date.now()}.csv"` } });
    }

    return NextResponse.json({
      success: true,
      presets: { today: vToday, yesterday: vYest, last7: v7, last30: v30, thisMonth: vMonth, lastMonth: vLastMonth, total: vTotal, pageViewsTotal: pvTotal },
      range: {
        from: from.toISOString(), to: to.toISOString(),
        visitors: uniq(pv.map((e) => e.visitorId)),
        sessions: uniq(pv.map((e) => e.sessionId)),
        pageViews: pv.length,
        newVisitors, returningVisitors,
        devices: tally("deviceType"), browsers: tally("browser"), sources: tally("source"),
        countries: tally("country").slice(0, 10), cities: tally("city").slice(0, 10),
        topPages, daily,
        conversions: { quoteRequests, contacts, toolGenerations, printQuotes, newsletters, whatsappClicks, ctaClicks },
      },
    });
  } catch (e) {
    console.error("analytics GET:", e);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}
