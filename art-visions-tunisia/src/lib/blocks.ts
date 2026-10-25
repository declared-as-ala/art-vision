import { z } from "zod";

/**
 * Page builder block model. Content is structured data validated server-side —
 * never arbitrary HTML. Rendering escapes everything through React.
 */

export const BGS = ["paper", "white", "violet", "brand", "copper", "indigo", "night"] as const;
export const SPACES = ["sm", "md", "lg"] as const;
export const ALIGNS = ["left", "center"] as const;
export const HIDES = ["none", "mobile", "desktop"] as const;

export const BLOCK_TYPES = [
  "hero", "heading", "text", "image", "gallery", "video", "features", "process", "stats",
  "table", "faq", "testimonials", "pricing", "cta", "services", "portfolio", "related", "contact",
  "homehero", "marquee", "tools",
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export type Item = Record<string, string>;
export type BlockData = Record<string, string | Item[]>;
export type Block = {
  id: string;
  type: BlockType;
  data: BlockData;
  style: { bg: (typeof BGS)[number]; space: (typeof SPACES)[number]; align: (typeof ALIGNS)[number]; hide: (typeof HIDES)[number] };
};

export type Field = {
  k: string;
  label: string;
  kind: "text" | "area" | "url" | "image" | "select" | "list";
  options?: string[];
  fields?: Field[]; // for list items
  hint?: string;
};
export type BlockSpec = { type: BlockType; label: string; desc: string; fields: Field[]; defaults: BlockData; bg?: Block["style"]["bg"] };

const t = (k: string, label: string, hint?: string): Field => ({ k, label, kind: "text", hint });
const a = (k: string, label: string, hint?: string): Field => ({ k, label, kind: "area", hint });
const u = (k: string, label: string): Field => ({ k, label, kind: "url" });
const img = (k: string, label: string): Field => ({ k, label, kind: "image" });
const list = (k: string, label: string, fields: Field[]): Field => ({ k, label, kind: "list", fields });

export const SPECS: BlockSpec[] = [
  { type: "hero", label: "Hero", desc: "Titre H1, introduction et bouton", bg: "night",
    fields: [t("eyebrow", "Sur-titre"), t("title", "Titre (H1)"), a("text", "Introduction"), t("ctaLabel", "Texte du bouton"), u("ctaHref", "Lien du bouton")],
    defaults: { eyebrow: "", title: "Titre de la page", text: "Une introduction claire qui répond à l'intention de recherche.", ctaLabel: "Demander un devis", ctaHref: "/contact" } },
  { type: "heading", label: "Titre", desc: "Titre de section H2 / H3",
    fields: [t("text", "Texte"), { k: "level", label: "Niveau", kind: "select", options: ["2", "3", "1"] }], defaults: { text: "Nouveau titre", level: "2" } },
  { type: "text", label: "Texte riche", desc: "Paragraphes, listes, liens",
    fields: [a("body", "Contenu", "Paragraphes séparés par une ligne vide. « - » pour une liste, « ## » pour un sous-titre, [texte](/lien) pour un lien.")],
    defaults: { body: "Écrivez votre contenu ici.\n\n- Premier point\n- Deuxième point" } },
  { type: "image", label: "Image", desc: "Image avec texte alternatif",
    fields: [img("src", "Image"), t("alt", "Texte alternatif (SEO)"), t("caption", "Légende")], defaults: { src: "", alt: "", caption: "" } },
  { type: "gallery", label: "Galerie", desc: "Plusieurs images",
    fields: [list("items", "Images", [img("src", "Image"), t("alt", "Texte alternatif")])], defaults: { items: [] } },
  { type: "video", label: "Vidéo", desc: "YouTube ou Vimeo",
    fields: [u("url", "Lien YouTube / Vimeo"), t("caption", "Légende")], defaults: { url: "", caption: "" } },
  { type: "features", label: "Cartes avantages", desc: "Grille de cartes",
    fields: [t("title", "Titre"), list("items", "Cartes", [t("title", "Titre"), a("text", "Texte")])],
    defaults: { title: "Pourquoi nous choisir", items: [{ title: "Avantage 1", text: "Description." }, { title: "Avantage 2", text: "Description." }, { title: "Avantage 3", text: "Description." }] } },
  { type: "process", label: "Processus", desc: "Étapes numérotées",
    fields: [t("title", "Titre"), list("items", "Étapes", [t("title", "Titre"), a("text", "Texte")])],
    defaults: { title: "Notre processus", items: [{ title: "Brief", text: "Nous cadrons votre besoin." }, { title: "Création", text: "Nous concevons." }, { title: "Livraison", text: "Fichiers prêts à l'emploi." }] } },
  { type: "stats", label: "Chiffres", desc: "Chiffres vérifiés uniquement",
    fields: [t("title", "Titre"), list("items", "Chiffres", [t("value", "Valeur"), t("label", "Libellé")])],
    defaults: { title: "", items: [{ value: "", label: "" }] } },
  { type: "table", label: "Tableau comparatif", desc: "Colonnes et lignes",
    fields: [t("title", "Titre"), t("head", "Colonnes", "Séparées par |"), a("rows", "Lignes", "Une ligne par ligne, cellules séparées par |")],
    defaults: { title: "Comparatif", head: "Critère | Option A | Option B", rows: "Prix | … | …\nDélai | … | …" } },
  { type: "faq", label: "FAQ", desc: "Accordéon + données structurées",
    fields: [t("title", "Titre"), list("items", "Questions", [t("q", "Question"), a("a", "Réponse")])],
    defaults: { title: "Questions fréquentes", items: [{ q: "Question ?", a: "Réponse." }] } },
  { type: "testimonials", label: "Témoignages", desc: "Uniquement des avis réels et vérifiés",
    fields: [t("title", "Titre"), list("items", "Témoignages", [a("quote", "Citation"), t("name", "Nom"), t("role", "Fonction / entreprise"), u("source", "Source vérifiable")])],
    defaults: { title: "Ils nous font confiance", items: [] } },
  { type: "pricing", label: "Tarifs", desc: "Prix en DT approuvés",
    fields: [t("title", "Titre"), list("items", "Offres", [t("name", "Nom"), t("price", "Prix (ex. 250 DT)"), t("note", "Précision"), a("features", "Inclus (une ligne par point)")])],
    defaults: { title: "Tarifs", items: [] } },
  { type: "cta", label: "Appel à l'action", desc: "Bandeau de conversion", bg: "brand",
    fields: [t("title", "Titre"), a("text", "Texte"), t("label", "Bouton"), u("href", "Lien")],
    defaults: { title: "Parlons de votre projet", text: "", label: "Demander un devis", href: "/contact" } },
  { type: "services", label: "Services liés", desc: "Grille automatique des services",
    fields: [t("title", "Titre")], defaults: { title: "Nos services" } },
  { type: "portfolio", label: "Portfolio", desc: "Projets vérifiés",
    fields: [t("title", "Titre")], defaults: { title: "Réalisations" } },
  { type: "related", label: "Articles liés", desc: "Derniers articles du blog",
    fields: [t("title", "Titre")], defaults: { title: "À lire aussi" } },
  { type: "homehero", label: "Hero d'accueil (drapeau)", desc: "Grand hero avec drapeau tunisien", bg: "night",
    fields: [t("eyebrow", "Sur-titre"), t("line1", "Titre — ligne 1"), t("line2", "Titre — ligne 2 (orange)"), t("line3", "Titre — ligne 3 (contour)"), a("text", "Introduction"),
      t("ctaLabel", "Bouton principal"), u("ctaHref", "Lien du bouton principal"), t("cta2Label", "Bouton secondaire"), u("cta2Href", "Lien du bouton secondaire"), t("flagCaption", "Légende du drapeau")],
    defaults: { eyebrow: "Agence créative · Tunisie", line1: "Des marques tunisiennes", line2: "qu'on remarque,", line3: "et qu'on retient.", text: "Art Visions conçoit votre logo, votre identité visuelle, vos supports imprimés et votre site web.", ctaLabel: "Demander un devis gratuit", ctaHref: "/contact", cta2Label: "Voir les services", cta2Href: "/services", flagCaption: "Conçu en Tunisie, pour la Tunisie" } },
  { type: "marquee", label: "Bandeau défilant", desc: "Mots qui défilent (secteurs, atouts)", bg: "brand",
    fields: [a("items", "Éléments", "Un élément par ligne")], defaults: { items: "Restaurants & cafés\nBoutiques de mode\nSalons de beauté\nStartups\nArtisans" } },
  { type: "tools", label: "Outils gratuits", desc: "Grille des outils gratuits", bg: "night",
    fields: [t("eyebrow", "Sur-titre"), t("title", "Titre")], defaults: { eyebrow: "Outils gratuits", title: "Avancez avant même de nous contacter." } },
  { type: "contact", label: "Formulaire de devis", desc: "Formulaire connecté aux leads",
    fields: [t("title", "Titre"), a("text", "Texte")], defaults: { title: "Demander un devis", text: "" } },
];

export const SPEC = Object.fromEntries(SPECS.map((s) => [s.type, s])) as Record<BlockType, BlockSpec>;

export const newId = () => Math.random().toString(36).slice(2, 10);

export function newBlock(type: BlockType): Block {
  const s = SPEC[type];
  return {
    id: newId(),
    type,
    data: JSON.parse(JSON.stringify(s.defaults)),
    style: { bg: s.bg ?? "paper", space: "md", align: "left", hide: "none" },
  };
}

// ---------- validation ----------
const item = z.record(z.string().max(60), z.string().max(4000));
export const blockSchema = z.object({
  id: z.string().min(1).max(40),
  type: z.enum(BLOCK_TYPES),
  data: z.record(z.string().max(60), z.union([z.string().max(10000), z.array(item).max(40)])),
  style: z.object({ bg: z.enum(BGS), space: z.enum(SPACES), align: z.enum(ALIGNS), hide: z.enum(HIDES) }),
});
export const blocksSchema = z.array(blockSchema).max(80);

/** Only http(s), site-relative, mailto, tel and anchors are allowed. */
export function safeUrl(v: string): string {
  const s = v.trim();
  return /^(https?:\/\/|\/(?!\/)|mailto:|tel:|#)/i.test(s) ? s : "";
}

function cleanFields(fields: Field[], data: Record<string, unknown>) {
  for (const f of fields) {
    const v = data[f.k];
    if (f.kind === "url" || f.kind === "image") data[f.k] = typeof v === "string" ? safeUrl(v) : "";
    else if (f.kind === "list" && f.fields) {
      data[f.k] = (Array.isArray(v) ? v : []).map((it) => {
        const row = { ...(it as Record<string, unknown>) };
        cleanFields(f.fields!, row);
        return row;
      });
    }
  }
}

/** Parse + sanitise blocks from untrusted input (server side). */
export function parseBlocks(input: unknown): { ok: true; blocks: Block[] } | { ok: false; error: string } {
  const r = blocksSchema.safeParse(input);
  if (!r.success) return { ok: false, error: "Blocs invalides : " + (r.error.issues[0]?.message ?? "format") };
  const blocks = r.data.map((b) => {
    const data = { ...b.data } as Record<string, unknown>;
    cleanFields(SPEC[b.type].fields, data);
    return { ...b, data: data as BlockData };
  });
  return { ok: true, blocks };
}

// ---------- analysis helpers (shared by editor + audits) ----------
const s = (v: unknown) => (typeof v === "string" ? v : "");
const items = (v: unknown): Item[] => (Array.isArray(v) ? (v as Item[]) : []);

export function blockText(b: Block): string {
  const parts: string[] = [];
  const walk = (d: Record<string, unknown>) => {
    for (const val of Object.values(d)) {
      if (typeof val === "string") parts.push(val);
      else if (Array.isArray(val)) val.forEach((it) => walk(it as Record<string, unknown>));
    }
  };
  const d = { ...b.data } as Record<string, unknown>;
  for (const f of SPEC[b.type].fields) if (f.kind === "url" || f.kind === "image") delete d[f.k];
  walk(d);
  return parts.join(" ");
}

export function analyseBlocks(blocks: Block[]) {
  const headings: { level: number; text: string }[] = [];
  let words = 0;
  const links: string[] = [];
  let images = 0, imagesNoAlt = 0;
  let firstText = "";
  let hasCta = false, hasFaq = false;
  const faqs: Item[] = [];

  for (const b of blocks) {
    const txt = blockText(b);
    words += txt.split(/\s+/).filter(Boolean).length;
    if (!firstText && (b.type === "hero" || b.type === "homehero" || b.type === "text")) firstText = txt;
    if (b.type === "hero") { headings.push({ level: 1, text: s(b.data.title) }); if (s(b.data.ctaHref)) { links.push(s(b.data.ctaHref)); hasCta = true; } }
    if (b.type === "homehero") { headings.push({ level: 1, text: [s(b.data.line1), s(b.data.line2), s(b.data.line3)].join(" ").trim() }); for (const k of ["ctaHref", "cta2Href"]) if (s(b.data[k])) links.push(s(b.data[k])); hasCta = true; }
    if (b.type === "heading") headings.push({ level: Number(s(b.data.level)) || 2, text: s(b.data.text) });
    if (["features", "process", "faq", "table", "pricing", "services", "cta", "contact", "testimonials", "related", "portfolio", "stats", "tools"].includes(b.type) && s(b.data.title)) headings.push({ level: 2, text: s(b.data.title) });
    if (b.type === "text") {
      for (const line of s(b.data.body).split("\n")) {
        const m = line.match(/^(#{2,3})\s+(.*)/);
        if (m) headings.push({ level: m[1].length, text: m[2] });
      }
      for (const m of s(b.data.body).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) links.push(m[1]);
    }
    if (b.type === "cta") { hasCta = true; if (s(b.data.href)) links.push(s(b.data.href)); }
    if (b.type === "contact") hasCta = true;
    if (b.type === "services" || b.type === "related" || b.type === "portfolio" || b.type === "tools") links.push("/services");
    if (b.type === "faq") { hasFaq = true; faqs.push(...items(b.data.items)); }
    if (b.type === "image") { images++; if (!s(b.data.alt).trim()) imagesNoAlt++; }
    if (b.type === "gallery") for (const it of items(b.data.items)) { images++; if (!s(it.alt).trim()) imagesNoAlt++; }
  }
  const internalLinks = links.filter((l) => l.startsWith("/") || l.includes("art-visions"));
  return { headings, words, links, internalLinks, images, imagesNoAlt, firstText, hasCta, hasFaq, faqs, h1: headings.filter((h) => h.level === 1).length };
}

export function videoEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}
