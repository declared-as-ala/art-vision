import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams, origin } = new URL(request.url);
  const path = searchParams.get("path");
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return NextResponse.json({ error: "Invalid preview path" }, { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();
  return NextResponse.redirect(new URL(path, origin));
}
