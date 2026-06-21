import { getTool, toolUrl } from "@/lib/tools";

// Human labels for the service slugs used in BlogPost.relatedServices.
export const SERVICE_LABELS: Record<string, string> = {
  "identite-visuelle": "Identité visuelle",
  "creation-logo-professionnel": "Création de logo",
  "design-graphique": "Design graphique",
  "impression": "Impression",
  "video-publicitaire": "Vidéo publicitaire",
  "motion-design": "Motion design",
  "modelisation-3d-rendu-produit": "3D & rendu produit",
  "creation-site-vitrine": "Création de site vitrine",
  "community-management": "Community management",
};

export interface LinkItem { label: string; href: string }

const splitSlugs = (v?: string | null): string[] =>
  (v || "").split(",").map((s) => s.trim()).filter(Boolean);

export function resolveServices(v?: string | null): LinkItem[] {
  return splitSlugs(v).map((slug) => ({
    label: SERVICE_LABELS[slug] || slug,
    href: `/${slug}`,
  }));
}

export function resolveTools(v?: string | null): LinkItem[] {
  return splitSlugs(v)
    .map((slug) => {
      const t = getTool(slug);
      return t ? { label: t.title, href: toolUrl(t.slug) } : null;
    })
    .filter((x): x is LinkItem => x !== null);
}

export function resolvePortfolio(v?: string | null): LinkItem[] {
  return splitSlugs(v).map((slug) => ({
    label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    href: `/portfolio/${slug}`,
  }));
}

export interface TocItem { id: string; text: string; level: 2 | 3 }

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

/**
 * Adds stable ids to <h2>/<h3> in the article HTML and returns the table of
 * contents extracted from them. Server-side string transform (no DOM needed).
 */
export function withHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(/<(h2|h3)>([\s\S]*?)<\/\1>/g, (_m, tag: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    let id = slugify(text) || `section-${toc.length + 1}`;
    while (used.has(id)) id = `${id}-${toc.length + 1}`;
    used.add(id);
    toc.push({ id, text, level: tag === "h2" ? 2 : 3 });
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
  return { html: out, toc };
}

export function parseFaq(v?: string | null): { question: string; answer: string }[] {
  if (!v) return [];
  try {
    const arr = JSON.parse(v);
    return Array.isArray(arr) ? arr.filter((f) => f?.question && f?.answer) : [];
  } catch {
    return [];
  }
}
