import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isCertificateType, getTemplate } from "@/lib/certificates/templates";

export const runtime = "nodejs";

async function requireAdmin() {
  const user = await getCurrentUser();
  return user || null;
}

const certificateSchema = z.object({
  certificateType: z.string().refine(isCertificateType, "Type de certificat invalide."),
  recipientName: z.string().min(2, "Nom du bénéficiaire requis.").max(120),
  trainingTitle: z.string().min(1).max(160),
  duration: z.string().min(1).max(60),
  sessionDate: z.string().min(1).max(120),
  trainingCenter: z.string().max(160).optional().nullable(),
  trainerName: z.string().max(120).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  objectives: z.string().max(4000).optional().nullable(),
  signatureName: z.string().max(120).optional().nullable(),
  issueDate: z.string().optional().nullable(), // ISO date
});

// Generate the next unique reference for a type, e.g. COV-2026-0001.
async function nextReference(certificateType: string, year: number): Promise<string> {
  const tpl = getTemplate(certificateType)!;
  const prefix = `${tpl.refPrefix}-${year}-`;
  const count = await prisma.certificate.count({
    where: { certificateType, reference: { startsWith: prefix } },
  });
  // Guard against collisions if a row was deleted: bump until free.
  let seq = count + 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const ref = `${prefix}${String(seq).padStart(4, "0")}`;
    const existing = await prisma.certificate.findUnique({ where: { reference: ref } });
    if (!existing) return ref;
    seq++;
  }
}

// GET — list all certificates (most recent first).
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  }
  try {
    const certificates = await prisma.certificate.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, certificates });
  } catch (error) {
    console.error("GET certificates error:", error);
    return NextResponse.json({ success: false, error: "Erreur base de données." }, { status: 500 });
  }
}

// POST — create + auto-generate reference.
export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  try {
    const parsed = certificateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Données invalides." },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const issueDate = d.issueDate ? new Date(d.issueDate) : new Date();
    const reference = await nextReference(d.certificateType, issueDate.getFullYear());

    const certificate = await prisma.certificate.create({
      data: {
        reference,
        certificateType: d.certificateType,
        recipientName: d.recipientName.trim(),
        trainingTitle: d.trainingTitle.trim(),
        duration: d.duration.trim(),
        sessionDate: d.sessionDate.trim(),
        trainingCenter: d.trainingCenter?.trim() || null,
        trainerName: d.trainerName?.trim() || null,
        location: d.location?.trim() || null,
        description: d.description?.trim() || null,
        objectives: d.objectives?.trim() || null,
        signatureName: d.signatureName?.trim() || null,
        issueDate,
        createdBy: user.name || user.email || null,
      },
    });
    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error("POST certificate error:", error);
    return NextResponse.json({ success: false, error: "Erreur base de données." }, { status: 500 });
  }
}

// PUT — edit an existing certificate (reference stays fixed).
export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ success: false, error: "ID manquant." }, { status: 400 });
    const parsed = certificateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Données invalides." },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        certificateType: d.certificateType,
        recipientName: d.recipientName.trim(),
        trainingTitle: d.trainingTitle.trim(),
        duration: d.duration.trim(),
        sessionDate: d.sessionDate.trim(),
        trainingCenter: d.trainingCenter?.trim() || null,
        trainerName: d.trainerName?.trim() || null,
        location: d.location?.trim() || null,
        description: d.description?.trim() || null,
        objectives: d.objectives?.trim() || null,
        signatureName: d.signatureName?.trim() || null,
        ...(d.issueDate ? { issueDate: new Date(d.issueDate) } : {}),
      },
    });
    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error("PUT certificate error:", error);
    return NextResponse.json({ success: false, error: "Erreur base de données." }, { status: 500 });
  }
}

// DELETE — remove a certificate.
export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
  }
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID manquant." }, { status: 400 });
    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE certificate error:", error);
    return NextResponse.json({ success: false, error: "Erreur base de données." }, { status: 500 });
  }
}
