import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public read-only catalog for the print calculator.
//  - no slug → list of active products
//  - ?slug=flyers → that product with its options + active price rows
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  try {
    if (!slug) {
      const products = await prisma.printProduct.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
        select: { slug: true, name: true, description: true, image: true, mode: true },
      });
      return NextResponse.json({ success: true, products });
    }
    const product = await prisma.printProduct.findUnique({
      where: { slug },
      include: {
        options: { where: { active: true }, orderBy: { sortOrder: "asc" } },
        prices: { where: { active: true } },
      },
    });
    if (!product || !product.active) return NextResponse.json({ success: false, error: "Introuvable." }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (e) {
    console.error("print catalog GET:", e);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}
