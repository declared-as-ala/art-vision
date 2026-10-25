import { analyseBlocks, type Block } from "./blocks";

/**
 * Internal editorial score (0–100) built from transparent checks.
 * It is a writing aid, NOT a prediction of Google rankings: 100 never means "first place".
 */

export type SeoInput = {
  title: string; // page title (H1 fallback)
  seoTitle: string;
  metaDescription: string;
  slug: string;
  keyword: string;
  canonicalUrl: string;
  noindex: boolean;
  nofollow: boolean;
  ogImage: string;
  schemaType: string;
  blocks: Block[];
  status: string;
};
export type SeoContext = { titles: string[]; descriptions: string[]; keywords: string[] }; // from OTHER pages

export type Check = { id: string; group: string; label: string; pass: boolean; weight: number; hint: string; level: "error" | "warn" | "info" };

/** Rough Google-title pixel width (Arial ~20px). Display guidance only. */
export function titlePixels(s: string): number {
  let w = 0;
  for (const ch of s) {
    if ("il.,;:'!|jtfI ".includes(ch)) w += 5.5;
    else if ("mwMW@".includes(ch)) w += 16.5;
    else if (/[A-Z]/.test(ch)) w += 13.5;
    else if (/[a-z0-9]/.test(ch)) w += 10.5;
    else w += 11;
  }
  return Math.round(w);
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

export function runChecks(i: SeoInput, ctx: SeoContext): Check[] {
  const an = analyseBlocks(i.blocks);
  const title = i.seoTitle.trim();
  const desc = i.metaDescription.trim();
  const kw = norm(i.keyword);
  const has = (hay: string) => kw !== "" && norm(hay).includes(kw);
  const h1Text = an.headings.find((h) => h.level === 1)?.text ?? "";
  const first100 = an.firstText.split(/\s+/).slice(0, 100).join(" ");
  const px = titlePixels(title);
  const c: Check[] = [];
  const add = (group: string, id: string, label: string, pass: boolean, weight: number, hint: string, level: Check["level"] = "warn") =>
    c.push({ id, group, label, pass, weight, hint, level });

  // Technical metadata
  add("Métadonnées", "title", "Titre SEO renseigné", title.length > 0, 6, "Ajoutez un titre SEO unique.", "error");
  add("Métadonnées", "title-len", "Titre de 30 à 60 caractères (≈ 600 px max)", title.length >= 30 && title.length <= 60 && px <= 600, 4, `Actuellement ${title.length} caractères, ≈ ${px}px.`);
  add("Métadonnées", "title-dup", "Titre unique sur le site", title !== "" && !ctx.titles.some((t) => norm(t) === norm(title)), 4, "Un autre contenu utilise le même titre.", "error");
  add("Métadonnées", "desc", "Méta description renseignée", desc.length > 0, 6, "Rédigez une méta description.", "error");
  add("Métadonnées", "desc-len", "Description de 120 à 160 caractères", desc.length >= 120 && desc.length <= 160, 3, `Actuellement ${desc.length} caractères.`);
  add("Métadonnées", "desc-dup", "Description unique", desc !== "" && !ctx.descriptions.some((d) => norm(d) === norm(desc)), 3, "Une autre page a la même description.");
  add("Métadonnées", "slug", "URL courte, minuscule, sans accents", /^[a-z0-9]+(-[a-z0-9]+)*$/.test(i.slug) && i.slug.split("-").length <= 6, 3, "Utilisez 6 mots maximum, en minuscules et tirets.");
  add("Métadonnées", "canon", "Canonical cohérent", !i.canonicalUrl || /^https?:\/\//.test(i.canonicalUrl), 2, "Le canonical doit être une URL absolue (ou vide pour auto).");

  // Indexability
  add("Indexation", "noindex", "Page indexable", !(i.noindex && i.status === "PUBLISHED"), 5, "Cette page publiée est en noindex : elle ne sera pas indexée.", "error");
  add("Indexation", "nofollow", "Liens suivis (follow)", !i.nofollow, 2, "Nofollow empêche la transmission de signaux : à éviter sauf cas précis.");

  // Content
  add("Contenu", "h1", "Un seul H1", an.h1 === 1, 6, an.h1 === 0 ? "Ajoutez un bloc Hero ou un Titre niveau 1." : "Plusieurs H1 : gardez-en un seul.", "error");
  add("Contenu", "words", "Au moins 300 mots de contenu", an.words >= 300, 6, `Actuellement ${an.words} mots : développez le contenu utile.`);
  add("Contenu", "h2", "Structure : au moins 2 sous-titres", an.headings.filter((h) => h.level >= 2).length >= 2, 3, "Structurez avec des H2/H3.");
  add("Contenu", "cta", "Appel à l'action présent", an.hasCta, 3, "Ajoutez un bloc CTA ou un formulaire.");
  add("Contenu", "faq", "FAQ présente", an.hasFaq, 2, "Une FAQ répond aux questions et active les données structurées.", "info");

  // Intent / keyword
  add("Intention de recherche", "kw", "Mot-clé principal défini", kw !== "", 4, "Définissez un mot-clé principal.");
  add("Intention de recherche", "kw-title", "Mot-clé dans le titre SEO", has(title), 4, "Placez le mot-clé dans le titre.");
  add("Intention de recherche", "kw-h1", "Mot-clé dans le H1", has(h1Text), 3, "Placez le mot-clé dans le H1.");
  add("Intention de recherche", "kw-desc", "Mot-clé dans la méta description", has(desc), 2, "Mentionnez le mot-clé dans la description.");
  add("Intention de recherche", "kw-first", "Mot-clé dans les 100 premiers mots", has(first100), 2, "Mentionnez-le dans l'introduction.");
  add("Intention de recherche", "kw-dup", "Mot-clé non dupliqué (cannibalisation)", kw === "" || !ctx.keywords.some((k) => norm(k) === kw), 3, "Un autre contenu cible le même mot-clé.", "error");

  // Links
  add("Liens internes", "links", "Au moins 2 liens internes", an.internalLinks.length >= 2, 4, `Actuellement ${an.internalLinks.length}. Liez vers services, articles et outils.`);

  // Structured data
  add("Données structurées", "schema", "Type de données structurées défini", !!i.schemaType, 2, "Choisissez un type (WebPage, Service, FAQPage…).", "info");
  add("Données structurées", "schema-faq", "FAQ cohérente avec le schéma", !an.hasFaq || an.faqs.every((f) => f.q?.trim() && f.a?.trim()), 2, "Chaque question de la FAQ doit avoir une réponse.");

  // Images / social
  add("Images & social", "alt", "Toutes les images ont un texte alternatif", an.imagesNoAlt === 0, 3, `${an.imagesNoAlt} image(s) sans alt.`);
  add("Images & social", "og", "Image Open Graph définie", !!i.ogImage, 2, "Ajoutez une image de partage 1200×630.", "info");
  return c;
}

export function score(checks: Check[]) {
  const total = checks.reduce((n, c) => n + c.weight, 0);
  const got = checks.filter((c) => c.pass).reduce((n, c) => n + c.weight, 0);
  return Math.round((got / total) * 100);
}

export const scoreTone = (n: number) => (n >= 80 ? "text-emerald-700 bg-emerald-50" : n >= 55 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50");
