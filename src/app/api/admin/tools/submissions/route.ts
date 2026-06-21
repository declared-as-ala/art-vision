import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];

export async function GET(req: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const toolType = searchParams.get("toolType") || undefined;
  const status = searchParams.get("status") || undefined;
  const q = searchParams.get("q")?.trim();

  const where: any = {};
  if (toolType && toolType !== "all") where.toolType = toolType;
  if (status && status !== "all") where.status = status;
  if (q) {
    where.OR = [
      { email: { contains: q } },
      { name: { contains: q } },
      { phone: { contains: q } },
    ];
  }

  try {
    const items = await prisma.toolSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 300,
    });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("List submissions error:", error);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  }
  try {
    const { id, status, notes } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "ID manquant." }, { status: 400 });
    const data: any = {};
    if (status && STATUSES.includes(status)) data.status = status;
    if (typeof notes === "string") data.notes = notes.slice(0, 4000);
    const updated = await prisma.toolSubmission.update({ where: { id }, data });
    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Update submission error:", error);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID manquant." }, { status: 400 });
    await prisma.toolSubmission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete submission error:", error);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}
