import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatEuros } from "@/lib/money";

const STATUSES = ["NEW", "CONTACTED", "CONFIRMED", "IN_PRODUCTION", "DELIVERED", "CANCELLED"];

export async function GET(req: Request) {
  if (!(await getCurrentUser())) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const where: any = {};
  if (status && status !== "all") where.status = status;
  const orders = await prisma.printQuoteRequest.findMany({ where, orderBy: { createdAt: "desc" }, take: 500 });

  if (searchParams.get("format") === "csv") {
    const head = ["Date", "Produit", "Nom", "Email", "Téléphone", "Estimation TTC", "Statut", "Options", "Notes"];
    const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/[\r\n]+/g, " ")}"`;
    const lines = orders.map((o) => [new Date(o.createdAt).toLocaleString("fr-FR"), o.productName, o.name, o.email, o.phone, formatEuros(o.estimatedTtcCents), o.status, o.options, o.notes].map(cell).join(","));
    const csv = "﻿" + [head.map(cell).join(","), ...lines].join("\r\n");
    return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="devis-impression-${Date.now()}.csv"` } });
  }
  return NextResponse.json({ success: true, orders });
}

export async function PATCH(req: Request) {
  if (!(await getCurrentUser())) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  const { id, status, notes } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ success: false, error: "ID manquant." }, { status: 400 });
  const data: any = {};
  if (status && STATUSES.includes(status)) data.status = status;
  if (typeof notes === "string") data.notes = notes.slice(0, 4000);
  const order = await prisma.printQuoteRequest.update({ where: { id }, data });
  return NextResponse.json({ success: true, order });
}

export async function DELETE(req: Request) {
  if (!(await getCurrentUser())) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, error: "ID manquant." }, { status: 400 });
  await prisma.printQuoteRequest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
