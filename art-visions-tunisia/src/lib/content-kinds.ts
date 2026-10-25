/**
 * Builder content types. All are stored in the Page table; `kind` decides the public URL.
 * Safe to import from client and server code.
 */
export const KINDS = {
  page: { prefix: "", label: "Page", plural: "Pages", langs: ["fr", "ar"] },
  article: { prefix: "/blog", label: "Article", plural: "Articles de blog", langs: ["fr"] },
  project: { prefix: "/portfolio", label: "Projet", plural: "Projets portfolio", langs: ["fr"] },
  service: { prefix: "/services", label: "Service", plural: "Services", langs: ["fr", "ar"] },
} as const;

export type Kind = keyof typeof KINDS;
export type Lang = "fr" | "ar";
export const KIND_KEYS = Object.keys(KINDS) as Kind[];
export const isKind = (v: unknown): v is Kind => typeof v === "string" && v in KINDS;

/** Public path of a builder content item. */
export const pagePath = (kind: Kind, lang: Lang, slug: string) =>
  kind === "page" && slug === "home" ? (lang === "ar" ? "/ar" : "/") : `${lang === "ar" ? "/ar" : ""}${KINDS[kind].prefix}/${slug}`;

export const ARTICLE_CATEGORIES = ["Logo & identité", "Print", "Web"] as const;
