import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// CSV export of tool submissions (optionally filtered by tool).
function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""').replace(/[\r\n]+/g, " ")}"`;
}

export async function GET(req: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const toolType = searchParams.get("toolType") || undefined;
  const where: any = {};
  if (toolType && toolType !== "all") where.toolType = toolType;

  const items = await prisma.toolSubmission.findMany({ where, orderBy: { createdAt: "desc" }, take: 5000 });

  const header = ["Date", "Outil", "Nom", "Email", "Téléphone", "Consentement", "Statut", "Notes"];
  const rows = items.map((i) =>
    [
      new Date(i.createdAt).toLocaleString("fr-FR"),
      i.toolType,
      i.name,
      i.email,
      i.phone,
      i.consentMarketing ? "Oui" : "Non",
      i.status,
      i.notes,
    ].map(csvCell).join(",")
  );
  const csv = "﻿" + [header.map(csvCell).join(","), ...rows].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-outils-${Date.now()}.csv"`,
    },
  });
}
