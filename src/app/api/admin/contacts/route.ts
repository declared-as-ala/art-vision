import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Messages sent through the public contact form (newsletter sign-ups are stored in the same table, name = "Newsletter").
const unauthorized = () => NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });

export async function GET() {
  if (!(await getCurrentUser())) return unauthorized();
  try {
    const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 1000 });
    const messages = rows.map((m) => ({ ...m, isNewsletter: m.name === "Newsletter" }));
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("GET contacts error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await getCurrentUser())) return unauthorized();
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing message ID" }, { status: 400 });
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE contact error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ success: false, error: "Database delete error" }, { status: 500 });
  }
}
