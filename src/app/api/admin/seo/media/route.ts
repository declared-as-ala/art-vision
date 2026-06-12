import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: List all media items
export async function GET() {
  try {
    const mediaList = await prisma.media.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, mediaList });
  } catch (error) {
    console.error("GET media error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch media assets" }, { status: 500 });
  }
}

// PUT: Update media Alt Text, Title and Caption
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, altText, title, caption } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Media ID is required" }, { status: 400 });
    }

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: {
        altText: altText || null,
        title: title || null,
        caption: caption || null
      }
    });

    return NextResponse.json({ success: true, media: updatedMedia });
  } catch (error) {
    console.error("PUT media error:", error);
    return NextResponse.json({ success: false, error: "Failed to update media details" }, { status: 500 });
  }
}
