import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getTemplate, isCertificateType } from "@/lib/certificates/templates";
import { generateCertificatePdf, loadTemplateBytes } from "@/lib/certificates/generate";

export const runtime = "nodejs";

// POST — render a live PDF preview from unsaved form data (not persisted).
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });

  try {
    const body = await req.json();
    if (!isCertificateType(body.certificateType)) {
      return NextResponse.json({ success: false, error: "Type invalide." }, { status: 400 });
    }
    const template = getTemplate(body.certificateType)!;
    const origin = new URL(req.url).origin;
    const templateBytes = await loadTemplateBytes(template, origin);

    const pdf = await generateCertificatePdf(
      {
        certificateType: body.certificateType,
        recipientName: body.recipientName || "",
        trainingTitle: body.trainingTitle || template.defaults.trainingTitle,
        duration: body.duration || template.defaults.duration,
        sessionDate: body.sessionDate || "",
        trainingCenter: body.trainingCenter,
        trainerName: body.trainerName,
        location: body.location,
        description: body.description,
        objectives: body.objectives,
        signatureName: body.signatureName,
        reference: body.reference || "APERÇU",
      },
      templateBytes
    );

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=preview.pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Certificate preview error:", error);
    return NextResponse.json({ success: false, error: "Erreur de génération." }, { status: 500 });
  }
}
