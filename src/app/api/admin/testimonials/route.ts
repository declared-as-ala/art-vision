import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { displayOrder: "asc" }
    });
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error("GET testimonials error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, rating, message, image, displayOrder } = body;
    
    const newTestimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        rating: Number(rating) || 5,
        message,
        image: image || null,
        displayOrder: Number(displayOrder) || 0
      }
    });
    return NextResponse.json({ success: true, testimonial: newTestimonial });
  } catch (error) {
    console.error("POST testimonial error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, role, rating, message, image, displayOrder } = body;
    
    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        role,
        rating: Number(rating),
        message,
        image,
        displayOrder: Number(displayOrder)
      }
    });
    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error) {
    console.error("PUT testimonial error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    
    await prisma.testimonial.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE testimonial error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
