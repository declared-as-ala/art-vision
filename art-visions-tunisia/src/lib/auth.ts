import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { getDb } from "@/lib/db";

const COOKIE = "avtn_session";
const TTL_MS = 7 * 24 * 3600 * 1000;
const hash = (t: string) => createHash("sha256").update(t).digest("hex");

export type Role = "OWNER" | "EDITOR" | "SEO";

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  await getDb().session.create({ data: { tokenHash: hash(token), userId, expiresAt: new Date(Date.now() + TTL_MS) } });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: TTL_MS / 1000,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await getDb().session.deleteMany({ where: { tokenHash: hash(token) } });
  jar.delete(COOKIE);
}

export const getUser = cache(async () => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const s = await getDb().session.findUnique({ where: { tokenHash: hash(token) }, include: { user: true } });
  if (!s || s.expiresAt < new Date()) return null;
  return { id: s.user.id, email: s.user.email, name: s.user.name, role: s.user.role as Role };
});

export async function requireUser() {
  const u = await getUser();
  if (!u) redirect("/admin/login");
  return u;
}

// Permissions: OWNER everything · EDITOR content · SEO metadata only.
const PERMS = {
  "page.edit": ["OWNER", "EDITOR"],
  "page.seo": ["OWNER", "EDITOR", "SEO"],
  "page.publish": ["OWNER", "EDITOR"],
  "page.delete": ["OWNER"],
  "redirect.edit": ["OWNER", "SEO"],
  "lead.edit": ["OWNER", "EDITOR"],
  "media.upload": ["OWNER", "EDITOR"],
  "user.manage": ["OWNER"],
} as const;
export type Perm = keyof typeof PERMS;
export const can = (role: Role, p: Perm) => (PERMS[p] as readonly string[]).includes(role);

export async function audit(userId: string | null, action: string, entity: string, entityId?: string, meta?: object) {
  await getDb().auditLog.create({ data: { userId, action, entity, entityId, meta: meta as object | undefined } });
}
