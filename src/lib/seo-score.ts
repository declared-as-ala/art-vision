// Shared SEO helpers used by BOTH the admin SEO analyzer and the public pages'
// generateMetadata, so the score the dashboard shows reflects the metadata the
// site actually emits to Google.

const BRAND = "Art Vision";

function cap(s: string): string {
  s = (s || "").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function wordCount(text: string | null | undefined): number {
  const t = stripHtml(text);
  if (!t) return 0;
  return t.split(/\s+/).filter((w) => w.length > 0).length;
}

// Build a Google-friendly <title>: 30–65 chars, contains the focus keyword and the brand.
export function buildEffectiveTitle(rawTitle: string, baseTitle: string, keyword: string): string {
  const kw = (keyword || "").trim();
  let t = (rawTitle || baseTitle || "Communication visuelle").trim();

  if (kw && !t.toLowerCase().includes(kw.toLowerCase())) {
    t = `${cap(kw)} | ${t}`;
  }
  if (!t.toLowerCase().includes(BRAND.toLowerCase())) {
    t = `${t} | ${BRAND}`;
  }
  if (t.length > 65) {
    t = t.slice(0, 65).replace(/\s+\S*$/, "").trim();
  }
  if (t.length < 30) {
    t = `${t} | ${BRAND} Agence Créative`.slice(0, 65);
  }
  return t;
}

// Build a Google-friendly meta description: 100–165 chars, contains the focus keyword.
export function buildEffectiveDescription(
  rawDesc: string,
  baseTitle: string,
  keyword: string,
  content?: string | null
): string {
  const kw = (keyword || "").trim();
  let d = (rawDesc || "").trim();

  if (!d) d = stripHtml(content).slice(0, 220).trim();
  if (!d) d = `Art Vision accompagne votre projet de ${kw || baseTitle} avec un studio créatif premium.`;

  if (kw && !d.toLowerCase().includes(kw.toLowerCase())) {
    d = `${cap(kw)} : ${d}`;
  }
  if (d.length < 100) {
    d = `${d} Studio créatif premium — logo, branding, vidéo, 3D et impression. Devis gratuit sous 24h.`;
  }
  if (d.length > 165) {
    d = d.slice(0, 162).replace(/\s+\S*$/, "").trim() + "…";
  }
  if (d.length < 100) {
    d = (d + " Devis gratuit en 24h avec Art Vision, agence créative en France.").slice(0, 165);
  }
  return d;
}

// Minimum prose word count expected per page type (realistic, not 800 everywhere).
function contentThreshold(type: string): number {
  switch (type) {
    case "Article Blog":
      return 300;
    case "Prestation":
    case "Landing SEO":
      return 200;
    default: // Réalisation (portfolio), Page Statique
      return 60;
  }
}

export interface SeoChecklist {
  hasH1: boolean;
  titleLengthOk: boolean;
  descLengthOk: boolean;
  hasKeyword: boolean;
  keywordInTitle: boolean;
  keywordInDesc: boolean;
  hasCanonical: boolean;
  isIndexable: boolean;
  wordCountOk: boolean;
  hasFAQ: boolean;
}

export interface SeoAnalysisInput {
  title: string;
  type: string;
  seoTitle: string | null;
  seoDescription: string | null;
  focusKeyword?: string | null;
  content: string | null;
  canonicalUrl: string | null;
  indexable: boolean;
  hasFaqs: boolean;
  /** structural enrichment present (gallery, images, content blocks, featured image…) */
  enriched?: boolean;
}

// Compute a fair, type-aware SEO score capped at 100, plus the effective metadata.
export function computeSeoScore(item: SeoAnalysisInput): {
  score: number;
  checklist: SeoChecklist;
  effectiveTitle: string;
  effectiveDescription: string;
  wordCount: number;
} {
  const keyword = (item.focusKeyword || item.title || "").trim();
  const effectiveTitle = buildEffectiveTitle(item.seoTitle || "", item.title, keyword);
  const effectiveDescription = buildEffectiveDescription(
    item.seoDescription || "",
    item.title,
    keyword,
    item.content
  );
  const wc = wordCount(item.content);
  const lowKw = keyword.toLowerCase();

  const checklist: SeoChecklist = {
    hasH1: true, // App Router templates guarantee exactly one H1
    titleLengthOk: effectiveTitle.length >= 30 && effectiveTitle.length <= 65,
    descLengthOk: effectiveDescription.length >= 100 && effectiveDescription.length <= 165,
    hasKeyword: keyword.length > 0,
    keywordInTitle: lowKw.length > 0 && effectiveTitle.toLowerCase().includes(lowKw),
    keywordInDesc: lowKw.length > 0 && effectiveDescription.toLowerCase().includes(lowKw),
    hasCanonical: !!item.canonicalUrl,
    isIndexable: item.indexable,
    wordCountOk: wc >= contentThreshold(item.type),
    hasFAQ: item.hasFaqs || item.enriched === true,
  };

  let score = 0;
  if (checklist.hasH1) score += 10;
  if (checklist.titleLengthOk) score += 15;
  else if (effectiveTitle.length > 0) score += 5;
  if (checklist.descLengthOk) score += 15;
  else if (effectiveDescription.length > 0) score += 5;
  if (checklist.hasKeyword) {
    score += 10;
    if (checklist.keywordInTitle) score += 5;
    if (checklist.keywordInDesc) score += 5;
  } else {
    score += 10;
  }
  if (checklist.hasCanonical) score += 10;
  if (checklist.isIndexable) score += 10;
  if (checklist.wordCountOk) score += 10;
  if (checklist.hasFAQ) score += 10;

  return {
    score: Math.min(score, 100),
    checklist,
    effectiveTitle,
    effectiveDescription,
    wordCount: wc,
  };
}
