import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getTemplate } from "@/lib/certificates/templates";
import {
  generateCertificatePdf,
  loadTemplateBytes,
  certificateFileName,
} from "@/lib/certificates/generate";

export const runtime = "nodejs";

// GET — regenerate a saved certificate's PDF. `?download=1` forces a download.
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });

  try {
    const { id } = await ctx.params;
    const cert = await prisma.certificate.findUnique({ where: { id } });
    if (!cert) return NextResponse.json({ success: false, error: "Introuvable." }, { status: 404 });

    const template = getTemplate(cert.certificateType);
    if (!template) return NextResponse.json({ success: false, error: "Type invalide." }, { status: 400 });

    const origin = new URL(req.url).origin;
    const templateBytes = await loadTemplateBytes(template, origin);
    const pdf = await generateCertificatePdf({ ...cert }, templateBytes);

    const download = new URL(req.url).searchParams.get("download") === "1";
    const fileName = certificateFileName(cert);

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Certificate pdf error:", error);
    return NextResponse.json({ success: false, error: "Erreur de génération." }, { status: 500 });
  }
}
