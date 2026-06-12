import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";

export type ContentType = "PAGE" | "SERVICE" | "POST" | "PROJECT" | "SEO_LANDING";

export function normalizeSlug(value: unknown) {
  return String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function contentPath(type: ContentType, slug: string) {
  const cleanSlug = normalizeSlug(slug);
  if (type === "POST") return `/blog/${cleanSlug}`;
  if (type === "PROJECT") return `/portfolio/${cleanSlug}`;
  if (type === "SERVICE") return `/services/${cleanSlug}`;
  if (type === "SEO_LANDING") return `/seo/${cleanSlug}`;
  return `/${cleanSlug}`;
}

export function legacyContentPath(type: ContentType, slug: string) {
  if (type === "SERVICE" || type === "SEO_LANDING") return `/${normalizeSlug(slug)}`;
  return contentPath(type, slug);
}

export function revalidateContent(type: ContentType, slug: string, previousSlug?: string) {
  const paths = new Set([
    contentPath(type, slug),
    legacyContentPath(type, slug),
    "/sitemap.xml",
  ]);

  if (type === "POST") paths.add("/blog");
  if (type === "PROJECT") paths.add("/portfolio");

  if (previousSlug && normalizeSlug(previousSlug) !== normalizeSlug(slug)) {
    paths.add(contentPath(type, previousSlug));
    paths.add(legacyContentPath(type, previousSlug));
  }

  paths.forEach((path) => revalidatePath(path));
  revalidateTag("cms-content", "max");
}

export function sanitizeHtml(html: string) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");
}

export async function slugExists(slug: string, current?: { type: ContentType; id: string }) {
  const cleanSlug = normalizeSlug(slug);
  const [page, service, post, project, landing] = await Promise.all([
    prisma.page.findUnique({ where: { slug: cleanSlug }, select: { id: true } }),
    prisma.service.findUnique({ where: { slug: cleanSlug }, select: { id: true } }),
    prisma.blogPost.findUnique({ where: { slug: cleanSlug }, select: { id: true } }),
    prisma.portfolioProject.findUnique({ where: { slug: cleanSlug }, select: { id: true } }),
    prisma.seoLandingPage.findUnique({ where: { slug: cleanSlug }, select: { id: true } }),
  ]);
  const matches: Array<[ContentType, { id: string } | null]> = [
    ["PAGE", page], ["SERVICE", service], ["POST", post], ["PROJECT", project], ["SEO_LANDING", landing],
  ];
  return matches.some(([type, item]) => item && !(current?.type === type && current.id === item.id));
}

export function parseContent(contentJson: string, contentHtml = "") {
  if (contentHtml.trim()) return sanitizeHtml(contentHtml);
  try {
    const parsed = JSON.parse(contentJson);
    if (typeof parsed?.html === "string") return sanitizeHtml(parsed.html);
    if (typeof parsed?.body === "string") return sanitizeHtml(parsed.body);
    if (typeof parsed?.content === "string") return sanitizeHtml(parsed.content);
  } catch {
    return sanitizeHtml(contentJson);
  }
  return "";
}
