import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { normalizeSlug, revalidateContent } from "@/lib/cms";

const optionSchema = z.object({
  type: z.enum(["paper", "format", "finish", "side"]),
  name: z.string().min(1).max(80),
  value: z.string().max(80).optional(),
  sortOrder: z.number().int().optional(),
});

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(120),
  slug: z.string().max(120).optional(),
  description: z.string().max(2000).optional(),
  image: z.string().max(500).optional(),
  active: z.boolean().optional(),
  mode: z.enum(["instant", "quote"]).optional(),
  productionTime: z.string().max(120).optional(),
  deliveryTime: z.string().max(120).optional(),
  fileGuidelines: z.string().max(2000).optional(),
  minQuantity: z.number().int().optional(),
  sides: z.enum(["recto", "recto-verso", "both"]).optional(),
  vatNote: z.string().max(200).optional(),
  seoTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(320).optional(),
  sortOrder: z.number().int().optional(),
  options: z.array(optionSchema).optional(),
});

async function requireAdmin() {
  const user = await getCurrentUser();
  return user ? user : null;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  try {
    const products = await prisma.printProduct.findMany({
      orderBy: { sortOrder: "asc" },
      include: { options: { orderBy: { sortOrder: "asc" } }, _count: { select: { prices: true } } },
    });
    return NextResponse.json({ success: true, products });
  } catch (e) {
    console.error("print products GET:", e);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}

async function replaceOptions(productId: string, options: z.infer<typeof optionSchema>[] | undefined) {
  if (!options) return;
  await prisma.printOption.deleteMany({ where: { productId } });
  for (let i = 0; i < options.length; i++) {
    const o = options[i];
    await prisma.printOption.create({
      data: {
        productId,
        type: o.type,
        name: o.name,
        value: o.value || normalizeSlug(o.name),
        sortOrder: o.sortOrder ?? i,
      },
    });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  const parsed = productSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ success: false, error: "Données invalides." }, { status: 422 });
  const d = parsed.data;
  const slug = normalizeSlug(d.slug || d.name);
  try {
    if (await prisma.printProduct.findUnique({ where: { slug } })) {
      return NextResponse.json({ success: false, error: "Ce slug existe déjà." }, { status: 400 });
    }
    const { options, ...rest } = d;
    const product = await prisma.printProduct.create({ data: { ...rest, slug } });
    await replaceOptions(product.id, options);
    revalidateContent("PAGE", `impression/${slug}`);
    return NextResponse.json({ success: true, product });
  } catch (e) {
    console.error("print products POST:", e);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  const parsed = productSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success || !parsed.data.id) return NextResponse.json({ success: false, error: "Données invalides." }, { status: 422 });
  const d = parsed.data;
  const slug = normalizeSlug(d.slug || d.name);
  try {
    const clash = await prisma.printProduct.findUnique({ where: { slug } });
    if (clash && clash.id !== d.id) return NextResponse.json({ success: false, error: "Ce slug est déjà utilisé." }, { status: 400 });
    const { options, id, ...rest } = d;
    const product = await prisma.printProduct.update({ where: { id }, data: { ...rest, slug } });
    await replaceOptions(product.id, options);
    revalidateContent("PAGE", `impression/${slug}`);
    return NextResponse.json({ success: true, product });
  } catch (e) {
    console.error("print products PUT:", e);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, error: "ID manquant." }, { status: 400 });
  try {
    await prisma.printProduct.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("print products DELETE:", e);
    return NextResponse.json({ success: false, error: "Erreur." }, { status: 500 });
  }
}
