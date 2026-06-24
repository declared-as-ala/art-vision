import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { toCents, htToTtcCents, formatEuros } from "@/lib/money";

async function admin() {
  return getCurrentUser();
}

const combo = (r: { paper?: string; format?: string; finish?: string; side?: string; quantity: number }) => ({
  paper: r.paper ?? "",
  format: r.format ?? "",
  finish: r.finish ?? "",
  side: r.side ?? "recto",
  quantity: Number(r.quantity) || 0,
});

async function audit(productId: string | null, action: string, detail: string, user?: string | null) {
  try { await prisma.priceAuditLog.create({ data: { productId, action, detail, user: user || null } }); } catch {}
}

// GET ?productId=...  (optionally &format=csv)
export async function GET(req: Request) {
  if (!(await admin())) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId") || undefined;
  const where = productId ? { productId } : {};
  const rows = await prisma.printPrice.findMany({ where, orderBy: [{ paper: "asc" }, { format: "asc" }, { quantity: "asc" }] });

  if (searchParams.get("format") === "csv") {
    const head = ["paper", "format", "finish", "side", "quantity", "priceHT", "priceTTC", "promoTTC", "productionDays", "active"];
    const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = rows.map((r) =>
      [r.paper, r.format, r.finish, r.side, r.quantity, (r.priceHtCents / 100).toFixed(2), (r.priceTtcCents / 100).toFixed(2), r.promoTtcCents != null ? (r.promoTtcCents / 100).toFixed(2) : "", r.productionDays, r.active ? 1 : 0].map(cell).join(",")
    );
    const csv = "﻿" + [head.map(cell).join(","), ...lines].join("\r\n");
    return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="prix-${productId || "all"}.csv"` } });
  }
  return NextResponse.json({ success: true, rows });
}

// POST upsert a single price row. Body: { productId, paper, format, finish, side, quantity, priceHt, priceTtc?, promoTtc?, productionDays?, active? }
export async function POST(req: Request) {
  const user = await admin();
  if (!user) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!b.productId || !b.quantity) return NextResponse.json({ success: false, error: "Produit et quantité requis." }, { status: 400 });
  const c = combo(b);
  const priceHtCents = toCents(b.priceHt ?? 0);
  const priceTtcCents = b.priceTtc != null && b.priceTtc !== "" ? toCents(b.priceTtc) : htToTtcCents(priceHtCents);
  const data = {
    priceHtCents,
    priceTtcCents,
    promoTtcCents: b.promoTtc != null && b.promoTtc !== "" ? toCents(b.promoTtc) : null,
    costCents: b.cost != null && b.cost !== "" ? toCents(b.cost) : null,
    marginPct: b.marginPct != null && b.marginPct !== "" ? Number(b.marginPct) : null,
    productionDays: Number(b.productionDays) || 5,
    active: b.active !== false,
  };
  try {
    const row = await prisma.printPrice.upsert({
      where: { productId_paper_format_finish_side_quantity: { productId: b.productId, ...c } },
      update: data,
      create: { productId: b.productId, ...c, ...data },
    });
    await audit(b.productId, "update", `${c.paper}/${c.format}/${c.quantity} → ${formatEuros(priceTtcCents)} TTC`, user.email);
    return NextResponse.json({ success: true, row });
  } catch (e) {
    console.error("print prices POST:", e);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}

// PUT bulk actions. Body: { action: "adjust"|"import", productId, ... }
export async function PUT(req: Request) {
  const user = await admin();
  if (!user) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  const b = await req.json().catch(() => ({}));

  if (b.action === "adjust") {
    // { productId, ids?: string[], percent?: number, fixedEuros?: number, target: "ht"|"ttc"|"both" }
    const where: any = b.ids?.length ? { id: { in: b.ids } } : { productId: b.productId };
    const rows = await prisma.printPrice.findMany({ where });
    const pct = Number(b.percent) || 0;
    const fixed = toCents(b.fixedEuros ?? 0);
    let n = 0;
    for (const r of rows) {
      const adj = (c: number) => Math.max(0, Math.round(c * (1 + pct / 100) + fixed));
      await prisma.printPrice.update({
        where: { id: r.id },
        data: { priceHtCents: adj(r.priceHtCents), priceTtcCents: adj(r.priceTtcCents) },
      });
      n++;
    }
    await audit(b.productId || null, "bulk_adjust", `${n} prix ajustés (${pct >= 0 ? "+" : ""}${pct}% / ${fixed >= 0 ? "+" : ""}${fixed / 100}€)`, user.email);
    return NextResponse.json({ success: true, updated: n });
  }

  if (b.action === "import") {
    // { productId, rows: [{ paper, format, finish, side, quantity, priceHT, priceTTC?, promoTTC?, productionDays?, active? }] }
    if (!b.productId || !Array.isArray(b.rows)) return NextResponse.json({ success: false, error: "Données invalides." }, { status: 422 });
    let n = 0;
    for (const r of b.rows) {
      const c = combo(r);
      if (!c.quantity) continue;
      const ht = toCents(r.priceHT ?? 0);
      const ttc = r.priceTTC != null && r.priceTTC !== "" ? toCents(r.priceTTC) : htToTtcCents(ht);
      await prisma.printPrice.upsert({
        where: { productId_paper_format_finish_side_quantity: { productId: b.productId, ...c } },
        update: { priceHtCents: ht, priceTtcCents: ttc, promoTtcCents: r.promoTTC ? toCents(r.promoTTC) : null, productionDays: Number(r.productionDays) || 5, active: r.active !== false && r.active !== 0 && r.active !== "0" },
        create: { productId: b.productId, ...c, priceHtCents: ht, priceTtcCents: ttc, promoTtcCents: r.promoTTC ? toCents(r.promoTTC) : null, productionDays: Number(r.productionDays) || 5, active: r.active !== false && r.active !== 0 && r.active !== "0" },
      });
      n++;
    }
    await audit(b.productId, "import", `${n} lignes importées (CSV)`, user.email);
    return NextResponse.json({ success: true, imported: n });
  }

  return NextResponse.json({ success: false, error: "Action inconnue." }, { status: 400 });
}

export async function DELETE(req: Request) {
  const user = await admin();
  if (!user) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, error: "ID manquant." }, { status: 400 });
  try {
    await prisma.printPrice.delete({ where: { id } });
    await audit(null, "delete", `Ligne de prix supprimée`, user.email);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}
