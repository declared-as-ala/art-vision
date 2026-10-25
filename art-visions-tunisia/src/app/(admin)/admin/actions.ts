"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { audit, can, createSession, destroySession, getUser, requireUser, type Perm } from "@/lib/auth";
import { blockSchema, newBlock, newId, parseBlocks, safeUrl, type Block } from "@/lib/blocks";
import { isKind, pagePath, type Kind, type Lang } from "@/lib/content-kinds";
import { ARTICLES } from "@/content/blog";
import { PROJECTS } from "@/content/portfolio";
import { SERVICES } from "@/content/services";
import { buildImport } from "@/lib/import-content";

export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const RESERVED = new Set(["home", "admin", "api", "ar", "services", "blog", "contact", "portfolio", "outils-gratuits", "sitemap", "robots", "brand", "_next", "favicon"]);

const STATIC_SLUGS: Record<Kind, Set<string>> = {
  page: RESERVED,
  article: new Set(ARTICLES.map((a) => a.slug)),
  project: new Set(PROJECTS.map((p) => p.slug)),
  service: new Set(SERVICES.flatMap((x) => [x.slugs.fr, x.slugs.ar])),
};

// ---------- auth ----------
const attempts = new Map<string, number[]>();
export async function loginAction(_: unknown, form: FormData): Promise<{ error?: string; email?: string }> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${ip}|${email}`;
  const recent = (attempts.get(key) ?? []).filter((t) => Date.now() - t < 15 * 60_000);
  if (recent.length >= 8) return { error: "Trop de tentatives. Réessayez dans 15 minutes.", email };
  const user = email ? await getDb().user.findUnique({ where: { email } }) : null;
  // Compare even when the user is unknown to keep timing similar.
  const ok = await bcrypt.compare(password, user?.passwordHash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvali");
  if (!user || !ok) {
    attempts.set(key, [...recent, Date.now()]);
    return { error: "Identifiants incorrects.", email };
  }
  await createSession(user.id);
  await audit(user.id, "login", "user", user.id);
  redirect("/admin");
}

export async function logoutAction() {
  const u = await getUser();
  await destroySession();
  if (u) await audit(u.id, "logout", "user", u.id);
  redirect("/admin/login");
}

async function guard(p: Perm) {
  const u = await requireUser();
  if (!can(u.role, p)) throw new Error("Permission refusée");
  return u;
}

// ---------- pages ----------
const pageSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug : minuscules, chiffres et tirets").max(80),
  template: z.string().max(40),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  publishedAt: z.string().nullable(),
  primaryKeyword: z.string().max(120),
  secondaryKeywords: z.array(z.string().max(120)).max(15),
  seoTitle: z.string().max(120),
  metaDescription: z.string().max(320),
  canonicalUrl: z.string().max(300),
  noindex: z.boolean(),
  nofollow: z.boolean(),
  ogTitle: z.string().max(120),
  ogDescription: z.string().max(320),
  ogImage: z.string().max(500),
  breadcrumbLabel: z.string().max(80),
  schemaType: z.enum(["WebPage", "Service", "FAQPage", "AboutPage", "ContactPage", "CollectionPage", "Article"]),
  navVisible: z.boolean(),
  lang: z.enum(["fr", "ar"]),
  category: z.string().max(60),
  translationId: z.string().max(40).nullable(),
  blocks: z.unknown(),
});
export type PageInput = z.infer<typeof pageSchema>;

function starterBlocks(template: string, title: string, keyword: string, kind: Kind = "page"): Block[] {
  const mk = (t: Parameters<typeof newBlock>[0], data: Record<string, unknown> = {}) => { const b = newBlock(t); Object.assign(b.data, data); return b; };
  if (template === "blank") return [mk("hero", { title })];
  if (kind === "article") return [mk("hero", { title, text: keyword ? `Tout ce qu'il faut savoir sur ${keyword}.` : "" }), mk("text", { body: "## Introduction\n\nPosez le problème du lecteur et annoncez ce qu'il va apprendre.\n\n## Les points clés\n\n- Premier point\n- Deuxième point" }), mk("faq"), mk("related"), mk("cta")];
  if (kind === "project") return [mk("hero", { title, text: "" }), mk("image"), mk("text", { body: "## Objectif\n\n…\n\n## Solution\n\n…" }), mk("cta", { title: "Un projet similaire ?" })];
  if (template === "legal") return [mk("hero", { title }), mk("text", { body: "## À compléter\n\nRenseignez ici les informations légales exactes de l'entreprise (dénomination, forme juridique, matricule fiscal, adresse, contact, hébergeur). N'affichez que des informations vérifiées." })];
  const base = [
    mk("hero", { title, text: keyword ? `Tout ce qu'il faut savoir sur ${keyword}.` : "" }),
    mk("text", { body: "Présentez votre offre en quelques paragraphes clairs, orientés vers le besoin du client." }),
    mk("features"),
    mk("process"),
  ];
  if (template === "service") base.push(mk("pricing"));
  base.push(mk("faq"), mk("cta"));
  return base;
}

export async function createPageAction(form: FormData) {
  const u = await guard("page.edit");
  const kindRaw = String(form.get("kind") ?? "page");
  const kind: Kind = isKind(kindRaw) ? kindRaw : "page";
  const title = String(form.get("title") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim().toLowerCase();
  const template = String(form.get("template") ?? "landing");
  const keyword = String(form.get("keyword") ?? "").trim();
  const langRaw = String(form.get("lang") ?? "fr");
  const lang: Lang = langRaw === "ar" && (kind === "page" || kind === "service") ? "ar" : "fr";
  const back = (e: string) => `/admin/pages/new?kind=${kind}&error=${e}`;
  if (title.length < 2 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) redirect(back("invalid"));
  if (STATIC_SLUGS[kind].has(slug)) redirect(back("reserved"));
  const db = getDb();
  if (await db.page.findUnique({ where: { kind_lang_slug: { kind, lang, slug } } })) redirect(back("exists"));
  const page = await db.page.create({
    data: {
      kind, lang, title, slug, template, primaryKeyword: keyword || null,
      category: String(form.get("category") ?? "") || null,
      seoTitle: String(form.get("seoTitle") ?? "") || null,
      metaDescription: String(form.get("metaDescription") ?? "") || null,
      blocks: starterBlocks(template, title, keyword, kind) as object[], authorId: u.id,
    },
  });
  await audit(u.id, "page.create", "page", page.id, { kind, slug });
  redirect(`/admin/pages/${page.id}`);
}

export async function savePage(id: string, raw: PageInput, note?: string): Promise<Result<{ updatedAt: string }>> {
  const u = await requireUser();
  const db = getDb();
  const existing = await db.page.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Page introuvable." };

  const parsed = pageSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Champs invalides" };
  const d = parsed.data;

  // Role checks: SEO role may only change SEO fields.
  if (!can(u.role, "page.edit")) {
    if (!can(u.role, "page.seo")) return { ok: false, error: "Permission refusée." };
    d.title = existing.title; d.slug = existing.slug; d.blocks = existing.blocks; d.status = existing.status; d.template = existing.template;
    d.navVisible = existing.navVisible; d.publishedAt = existing.publishedAt?.toISOString() ?? null; d.lang = existing.lang as "fr" | "ar";
  }
  if ((d.status === "PUBLISHED" || d.status === "SCHEDULED") !== (existing.status === "PUBLISHED" || existing.status === "SCHEDULED") && !can(u.role, "page.publish")) {
    return { ok: false, error: "Permission de publication refusée." };
  }
  if (RESERVED.has(d.slug) && !(existing.kind === "page" && d.slug === existing.slug)) return { ok: false, error: "Ce slug est réservé." };
  const kind = existing.kind as Kind;
  if (STATIC_SLUGS[kind].has(d.slug) && d.slug !== existing.slug) return { ok: false, error: "Ce slug est réservé par un contenu existant." };
  if (d.lang === "ar" && !(kind === "page" || kind === "service")) return { ok: false, error: "Ce type de contenu n'existe qu'en français." };
  const clash = await db.page.findUnique({ where: { kind_lang_slug: { kind, lang: d.lang, slug: d.slug } } });
  if (clash && clash.id !== id) return { ok: false, error: "Ce slug est déjà utilisé pour ce type et cette langue." };

  const pb = parseBlocks(d.blocks);
  if (!pb.ok) return { ok: false, error: pb.error };
  const canonical = d.canonicalUrl.trim();
  if (canonical && !/^https?:\/\//.test(canonical)) return { ok: false, error: "Le canonical doit être une URL absolue." };
  if (d.status === "SCHEDULED" && !d.publishedAt) return { ok: false, error: "Choisissez une date de publication." };

  let publishedAt = d.publishedAt ? new Date(d.publishedAt) : existing.publishedAt;
  if (d.status === "PUBLISHED" && !publishedAt) publishedAt = new Date();

  // Snapshot the previous state for history before overwriting.
  await db.pageRevision.create({ data: { pageId: id, note: note ?? null, snapshot: JSON.parse(JSON.stringify(existing)) } });
  const old = await db.pageRevision.findMany({ where: { pageId: id }, orderBy: { createdAt: "desc" }, skip: 40, select: { id: true } });
  if (old.length) await db.pageRevision.deleteMany({ where: { id: { in: old.map((r) => r.id) } } });

  const updated = await db.page.update({
    where: { id },
    data: {
      title: d.title, slug: d.slug, template: d.template, status: d.status, publishedAt, lang: d.lang,
      primaryKeyword: d.primaryKeyword || null, secondaryKeywords: d.secondaryKeywords.filter(Boolean),
      seoTitle: d.seoTitle || null, metaDescription: d.metaDescription || null, canonicalUrl: canonical || null,
      noindex: d.noindex, nofollow: d.nofollow, ogTitle: d.ogTitle || null, ogDescription: d.ogDescription || null,
      ogImage: safeUrl(d.ogImage) || null, breadcrumbLabel: d.breadcrumbLabel || null, schemaType: d.schemaType,
      navVisible: d.navVisible, blocks: pb.blocks as unknown as object[],
      category: d.category || null, translationId: d.translationId || null,
    },
  });

  // Safe redirect handling when a previously public slug changes.
  if ((existing.slug !== d.slug || existing.lang !== d.lang) && existing.publishedAt) {
    const from = pagePath(kind, existing.lang as Lang, existing.slug), to = pagePath(kind, d.lang, d.slug);
    await db.redirect.deleteMany({ where: { fromPath: to } });
    await db.redirect.updateMany({ where: { toPath: from }, data: { toPath: to } });
    await db.redirect.upsert({ where: { fromPath: from }, update: { toPath: to }, create: { fromPath: from, toPath: to } });
  }
  await audit(u.id, "page.save", "page", id, { status: d.status, slug: d.slug });
  revalidatePath(pagePath(kind, existing.lang as Lang, existing.slug));
  revalidatePath(pagePath(kind, d.lang, d.slug));
  revalidatePath("/sitemap.xml");
  return { ok: true, updatedAt: updated.updatedAt.toISOString() };
}

export async function duplicatePage(id: string) {
  const u = await guard("page.edit");
  const db = getDb();
  const p = await db.page.findUnique({ where: { id } });
  if (!p) return;
  let slug = `${p.slug}-copie`, n = 2;
  while (await db.page.findUnique({ where: { kind_lang_slug: { kind: p.kind, lang: p.lang, slug } } })) slug = `${p.slug}-copie-${n++}`;
  const { id: _id, createdAt: _c, updatedAt: _u, publishedAt: _p, ...rest } = p;
  void _id; void _c; void _u; void _p;
  const copy = await db.page.create({ data: { ...rest, slug, title: `${p.title} (copie)`, status: "DRAFT", authorId: u.id, blocks: p.blocks as object[] } });
  await audit(u.id, "page.duplicate", "page", copy.id, { from: id });
  redirect(`/admin/pages/${copy.id}`);
}

export async function deletePage(id: string) {
  const u = await guard("page.delete");
  const p = await getDb().page.delete({ where: { id } });
  await audit(u.id, "page.delete", "page", id, { slug: p.slug });
  revalidatePath(pagePath(p.kind as Kind, p.lang as Lang, p.slug));
  redirect("/admin/pages");
}

export async function restoreRevision(pageId: string, revisionId: string): Promise<Result> {
  const u = await guard("page.edit");
  const db = getDb();
  const rev = await db.pageRevision.findFirst({ where: { id: revisionId, pageId } });
  const cur = await db.page.findUnique({ where: { id: pageId } });
  if (!rev || !cur) return { ok: false, error: "Version introuvable." };
  const s = rev.snapshot as Record<string, unknown>;
  const pb = parseBlocks(s.blocks);
  if (!pb.ok) return { ok: false, error: pb.error };
  await db.pageRevision.create({ data: { pageId, note: "Avant restauration", snapshot: JSON.parse(JSON.stringify(cur)) } });
  await db.page.update({
    where: { id: pageId },
    data: {
      title: String(s.title), blocks: pb.blocks as unknown as object[],
      seoTitle: (s.seoTitle as string) ?? null, metaDescription: (s.metaDescription as string) ?? null,
      primaryKeyword: (s.primaryKeyword as string) ?? null, status: "DRAFT",
    },
  });
  await audit(u.id, "page.restore", "page", pageId, { revisionId });
  revalidatePath(pagePath(cur.kind as Kind, cur.lang as Lang, cur.slug));
  return { ok: true };
}

// ---------- redirects ----------
export async function saveRedirect(form: FormData): Promise<void> {
  const u = await guard("redirect.edit");
  const fromPath = String(form.get("from") ?? "").trim();
  const toPath = String(form.get("to") ?? "").trim();
  if (!fromPath.startsWith("/") || fromPath.startsWith("//") || !(toPath.startsWith("/") || /^https?:\/\//.test(toPath)) || fromPath === toPath) redirect("/admin/seo/redirects?error=invalid");
  await getDb().redirect.upsert({ where: { fromPath }, update: { toPath }, create: { fromPath, toPath } });
  await audit(u.id, "redirect.save", "redirect", fromPath, { toPath });
  revalidatePath("/admin/seo/redirects");
  redirect("/admin/seo/redirects");
}
export async function deleteRedirect(id: string) {
  const u = await guard("redirect.edit");
  await getDb().redirect.delete({ where: { id } });
  await audit(u.id, "redirect.delete", "redirect", id);
  revalidatePath("/admin/seo/redirects");
}

// ---------- leads ----------
export async function setLeadStatus(id: string, status: string): Promise<Result> {
  const u = await guard("lead.edit");
  if (!["NEW", "CONTACTED", "QUOTED", "WON", "LOST"].includes(status)) return { ok: false, error: "Statut invalide" };
  await getDb().lead.update({ where: { id }, data: { status: status as "NEW" } });
  await audit(u.id, "lead.status", "lead", id, { status });
  revalidatePath("/admin/leads");
  return { ok: true };
}

// ---------- users ----------
export async function createUserAction(form: FormData): Promise<void> {
  const u = await guard("user.manage");
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const name = String(form.get("name") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const role = String(form.get("role") ?? "EDITOR");
  if (!z.email().safeParse(email).success || name.length < 2 || password.length < 10 || !["OWNER", "EDITOR", "SEO"].includes(role)) redirect("/admin/settings/users?error=invalid");
  const db = getDb();
  if (await db.user.findUnique({ where: { email } })) redirect("/admin/settings/users?error=exists");
  const created = await db.user.create({ data: { email, name, role: role as "EDITOR", passwordHash: await bcrypt.hash(password, 12) } });
  await audit(u.id, "user.create", "user", created.id, { role });
  revalidatePath("/admin/settings/users");
  redirect("/admin/settings/users");
}

// ---------- reusable sections ----------
export async function saveSectionAction(name: string, block: unknown): Promise<Result<{ id: string }>> {
  const u = await guard("page.edit");
  const n = name.trim().slice(0, 80);
  if (n.length < 2) return { ok: false, error: "Donnez un nom à la section." };
  const pb = parseBlocks([block]);
  if (!pb.ok) return { ok: false, error: pb.error };
  const b = pb.blocks[0];
  const row = await getDb().savedSection.create({ data: { name: n, type: b.type, data: b.data as object, style: b.style as object, createdBy: u.id } });
  await audit(u.id, "section.save", "section", row.id, { type: b.type });
  return { ok: true, id: row.id };
}

export async function deleteSectionAction(id: string): Promise<Result> {
  const u = await guard("page.edit");
  await getDb().savedSection.delete({ where: { id } });
  await audit(u.id, "section.delete", "section", id);
  return { ok: true };
}

/** Returns a fresh copy (new id) of a saved section, validated, ready to insert. */
export async function insertSectionAction(id: string): Promise<Result<{ block: Block }>> {
  await guard("page.edit");
  const row = await getDb().savedSection.findUnique({ where: { id } });
  if (!row) return { ok: false, error: "Section introuvable." };
  const parsed = blockSchema.safeParse({ id: newId(), type: row.type, data: row.data, style: row.style });
  if (!parsed.success) return { ok: false, error: "Section corrompue." };
  const pb = parseBlocks([parsed.data]);
  return pb.ok ? { ok: true, block: pb.blocks[0] } : { ok: false, error: pb.error };
}

// ---------- make code-defined content editable ----------
/** Creates an editable DRAFT copy of a code-defined page (or opens the existing one). The code version stays live until the copy is published. */
export async function makeEditableAction(kind: Kind, lang: Lang, slug: string): Promise<void> {
  const u = await guard("page.edit");
  const db = getDb();
  const existing = await db.page.findUnique({ where: { kind_lang_slug: { kind, lang, slug } } });
  if (existing) redirect(`/admin/pages/${existing.id}`);
  const imp = buildImport(kind, lang, slug);
  if (!imp) redirect("/admin/pages");
  const page = await db.page.create({
    data: {
      kind, lang, slug, title: imp.title, template: kind === "page" ? "landing" : kind, status: "DRAFT",
      blocks: imp.blocks as unknown as object[], authorId: u.id, primaryKeyword: imp.keyword || null,
      seoTitle: imp.seoTitle, metaDescription: imp.metaDescription, category: imp.category ?? null, schemaType: imp.schemaType,
    },
  });
  await audit(u.id, "page.import", "page", page.id, { kind, lang, slug });
  redirect(`/admin/pages/${page.id}`);
}
