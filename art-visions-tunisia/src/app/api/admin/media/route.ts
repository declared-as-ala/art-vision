import { NextResponse } from "next/server";
import { audit, can, getUser } from "@/lib/auth";
import { listImages, putImage } from "@/lib/storage";

export async function GET() {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    return NextResponse.json({ items: await listImages() });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur de stockage" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!can(u.role, "media.upload")) return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  try {
    const out = await putImage(file);
    await audit(u.id, "media.upload", "media", out.key);
    return NextResponse.json(out, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Échec de l'envoi" }, { status: 400 });
  }
}
