import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clearRedirectsCache } from "@/app/api/redirect-check/route";

// GET: List all redirects
export async function GET() {
  try {
    const redirects = await prisma.redirect.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, redirects });
  } catch (error) {
    console.error("GET redirects error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch redirects" }, { status: 500 });
  }
}

// POST: Create a new redirect
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceUrl, targetUrl, statusCode, active } = body;

    if (!sourceUrl || !targetUrl) {
      return NextResponse.json({ success: false, error: "Source path and target path are required." }, { status: 400 });
    }

    // Standardize paths
    const cleanSource = sourceUrl.trim();
    const cleanTarget = targetUrl.trim();

    // Check for existing redirect with the same source
    const existing = await prisma.redirect.findUnique({
      where: { sourceUrl: cleanSource }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "A redirect rule already exists for this source path." }, { status: 400 });
    }

    const redirect = await prisma.redirect.create({
      data: {
        sourceUrl: cleanSource,
        targetUrl: cleanTarget,
        statusCode: parseInt(statusCode, 10) || 301,
        active: active !== undefined ? active : true,
        hitCount: 0
      }
    });

    clearRedirectsCache(); // Clear redirects cache

    return NextResponse.json({ success: true, redirect });
  } catch (error) {
    console.error("POST redirect error:", error);
    return NextResponse.json({ success: false, error: "Failed to create redirect" }, { status: 500 });
  }
}

// PUT: Update an existing redirect
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, sourceUrl, targetUrl, statusCode, active } = body;

    if (!id || !sourceUrl || !targetUrl) {
      return NextResponse.json({ success: false, error: "ID, source path, and target path are required." }, { status: 400 });
    }

    const cleanSource = sourceUrl.trim();
    const cleanTarget = targetUrl.trim();

    // Check if sourceUrl is used by another redirect
    const existing = await prisma.redirect.findFirst({
      where: {
        sourceUrl: cleanSource,
        NOT: { id }
      }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Another redirect rule already uses this source path." }, { status: 400 });
    }

    const redirect = await prisma.redirect.update({
      where: { id },
      data: {
        sourceUrl: cleanSource,
        targetUrl: cleanTarget,
        statusCode: parseInt(statusCode, 10) || 301,
        active: active !== undefined ? active : true
      }
    });

    clearRedirectsCache(); // Clear redirects cache

    return NextResponse.json({ success: true, redirect });
  } catch (error) {
    console.error("PUT redirect error:", error);
    return NextResponse.json({ success: false, error: "Failed to update redirect" }, { status: 500 });
  }
}

// DELETE: Delete a redirect
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Redirect ID is required" }, { status: 400 });
    }

    await prisma.redirect.delete({
      where: { id }
    });

    clearRedirectsCache(); // Clear redirects cache

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE redirect error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete redirect" }, { status: 500 });
  }
}
