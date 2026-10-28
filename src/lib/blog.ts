import { getTool, toolUrl } from "@/lib/tools";

// Human labels for the service slugs used in BlogPost.relatedServices.
export const SERVICE_LABELS: Record<string, string> = {
  "identite-visuelle": "Identité visuelle & Branding",
  "creation-logo-professionnel": "Création de logo professionnel",
  "creation-logo": "Création de logo",
  "design-graphique": "Design graphique",
  "impression": "Impression professionnelle",
  "impression-grand-format": "Impression grand format",
  "video-publicitaire": "Vidéo publicitaire",
  "motion-design": "Motion design",
  "modelisation-3d-rendu-produit": "Modélisation 3D & Rendu produit",
  "rendu-3d-produit": "Rendu 3D produit",
  "creation-site-vitrine": "Création de site vitrine",
  "creation-site-internet": "Création de site internet",
  "community-management": "Community management",
  "devis-sur-mesure": "Demande de devis sur-mesure",
};

export interface LinkItem { label: string; href: string }

export const splitSlugs = (v?: string | null): string[] => {
  if (!v) return [];
  let rawItems: string[] = [];
  try {
    const parsed = JSON.parse(v);
    if (Array.isArray(parsed)) {
      rawItems = parsed.map((x) => String(x));
    } else if (typeof parsed === "string") {
      rawItems = parsed.split(",");
    }
  } catch {
    rawItems = v.split(",");
  }
  return rawItems
    .map((s) => s.replace(/[\[\]"'\\]/g, "").trim().replace(/^\/+/, ""))
    .filter(Boolean);
};

export function resolveServices(v?: string | null): LinkItem[] {
  return splitSlugs(v).map((slug) => ({
    label:
      SERVICE_LABELS[slug] ||
      slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
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

import { markdownToHtml } from "@/lib/markdown";

/**
 * Converts Markdown or HTML into clean semantic HTML, adds stable ids to <h2>/<h3>,
 * and extracts the table of contents (TOC).
 */
export function withHeadingIds(rawOrHtml: string): { html: string; toc: TocItem[] } {
  const converted = markdownToHtml(rawOrHtml || "");
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = converted.replace(/<(h2|h3)>([\s\S]*?)<\/\1>/g, (_m, tag: string, inner: string) => {
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
