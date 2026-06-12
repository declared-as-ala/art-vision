import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all quotes
export async function GET() {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, quotes });
  } catch (error) {
    console.error("GET quotes error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

// PUT (update status/notes)
export async function PUT(req: Request) {
  try {
    const { id, status, notes } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing quote ID" }, { status: 400 });
    }

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: {
        status: status || undefined,
        notes: notes !== undefined ? notes : undefined
      }
    });

    return NextResponse.json({ success: true, quote: updated });
  } catch (error) {
    console.error("PUT quote error:", error);
    return NextResponse.json({ success: false, error: "Database update error" }, { status: 500 });
  }
}

// DELETE a quote request
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing quote ID" }, { status: 400 });
    }

    await prisma.quoteRequest.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE quote error:", error);
    return NextResponse.json({ success: false, error: "Database delete error" }, { status: 500 });
  }
}
