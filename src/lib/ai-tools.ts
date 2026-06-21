// ──────────────────────────────────────────────────────────────────────────
// AI provider abstraction for the text generators (slogan / bio / caption).
//
//  - If an API key is configured (AI_API_KEY or ANTHROPIC_API_KEY) the request
//    is sent to the Anthropic Messages API and the answer is parsed.
//  - Otherwise a smart, template-based generator is used. It is NOT fake AI:
//    it deterministically composes real, varied results from the user inputs.
//  - The returned `source` field lets the UI be transparent about which engine
//    produced the result.
//
//  Secrets are read from the environment only — never exposed to the client.
// ──────────────────────────────────────────────────────────────────────────

export type GenSource = "ai" | "template";

const AI_KEY = process.env.AI_API_KEY || process.env.ANTHROPIC_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "claude-haiku-4-5";

export function aiEnabled(): boolean {
  return Boolean(AI_KEY) && process.env.AI_FALLBACK_ONLY !== "true";
}

/** Low-level call to Anthropic. Returns plain text, or null on any failure. */
async function askAnthropic(prompt: string, maxTokens = 1024): Promise<string | null> {
  if (!AI_KEY) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": AI_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
      // Never hang a public endpoint forever.
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    return typeof text === "string" ? text : null;
  } catch {
    return null;
  }
}

/** Extract a JSON array/object from an LLM answer that may contain prose. */
function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const body = match ? match[1] : raw;
    const start = body.search(/[[{]/);
    if (start === -1) return null;
    return JSON.parse(body.slice(start)) as T;
  } catch {
    return null;
  }
}

const uniq = (arr: string[]) => Array.from(new Set(arr.map((s) => s.trim()))).filter(Boolean);
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// ── SLOGANS ────────────────────────────────────────────────────────────────

export interface SloganInput {
  businessName: string;
  industry: string;
  tone: string; // Professionnel / Premium / Amical / Moderne / Audacieux / Luxe
  audience?: string;
  keywords?: string;
}

export async function generateSlogans(
  input: SloganInput
): Promise<{ source: GenSource; slogans: string[] }> {
  if (aiEnabled()) {
    const prompt = `Tu es un directeur de création publicitaire francophone. Génère 12 slogans courts, percutants et originaux en français pour l'entreprise "${input.businessName}" (secteur : ${input.industry}). Ton souhaité : ${input.tone}. Cible : ${input.audience || "grand public"}. Mots-clés : ${input.keywords || "—"}. Réponds UNIQUEMENT avec un tableau JSON de chaînes, sans numérotation ni texte autour.`;
    const arr = parseJson<string[]>(await askAnthropic(prompt));
    if (arr && arr.length >= 6) return { source: "ai", slogans: uniq(arr).slice(0, 12) };
  }
  return { source: "template", slogans: templateSlogans(input) };
}

function templateSlogans(i: SloganInput): string[] {
  const name = i.businessName.trim() || "Votre marque";
  const field = (i.industry || "votre univers").toLowerCase();
  const kw = uniq((i.keywords || "").split(/[,;]/)).slice(0, 4);
  const k1 = kw[0] || field;
  const k2 = kw[1] || "qualité";
  const tone = (i.tone || "").toLowerCase();

  const base = [
    `${name}, l'excellence au service de ${field}.`,
    `${cap(k1)} repensé par ${name}.`,
    `${name} — votre vision, notre savoir-faire.`,
    `Avec ${name}, ${field} devient un art.`,
    `${cap(k1)}. ${cap(k2)}. ${name}.`,
    `${name}, là où ${field} prend vie.`,
    `Pensé pour vous, signé ${name}.`,
    `${name} : un cran au-dessus en ${field}.`,
    `Donnez du sens à ${field} avec ${name}.`,
    `${name}, la différence se voit.`,
    `${cap(k1)} sans compromis, par ${name}.`,
    `${name} — simplement remarquable.`,
  ];

  const toneLines: Record<string, string[]> = {
    premium: [`${name}, l'exigence devient signature.`, `Le raffinement ${field}, par ${name}.`],
    luxe: [`${name}, l'art du détail d'exception.`, `Quand ${field} rime avec prestige : ${name}.`],
    amical: [`${name}, on s'occupe de tout 😊`, `${cap(field)} en toute simplicité avec ${name}.`],
    moderne: [`${name}, ${field} nouvelle génération.`, `${cap(k1)} réinventé. ${name}.`],
    audacieux: [`Osez ${field}. Osez ${name}.`, `${name} change les règles du jeu.`],
    professionnel: [`${name}, la rigueur au service de vos résultats.`, `${cap(k1)} fiable, ${name} responsable.`],
  };
  const extra = toneLines[tone] || [];
  return uniq([...extra, ...base]).slice(0, 12);
}

// ── INSTAGRAM BIO ────────────────────────────────────────────────────────────

export interface BioInput {
  businessName: string;
  activity: string;
  city?: string;
  services?: string;
  phone?: string;
  website?: string;
  tone: string;
  emojis: boolean;
  cta: boolean;
}

export async function generateBios(
  input: BioInput
): Promise<{ source: GenSource; bios: string[] }> {
  if (aiEnabled()) {
    const prompt = `Rédige 5 bios Instagram en français pour "${input.businessName}" (${input.activity})${input.city ? `, à ${input.city}` : ""}. Services : ${input.services || "—"}. Ton : ${input.tone}. ${input.emojis ? "Utilise des emojis pertinents." : "Sans emoji."} ${input.cta ? "Termine par un appel à l'action." : ""} Chaque bio doit faire MOINS de 150 caractères. Réponds uniquement par un tableau JSON de chaînes.`;
    const arr = parseJson<string[]>(await askAnthropic(prompt));
    if (arr && arr.length >= 3) return { source: "ai", bios: arr.map((b) => b.slice(0, 150)).slice(0, 5) };
  }
  return { source: "template", bios: templateBios(input) };
}

function templateBios(i: BioInput): string[] {
  const e = (s: string) => (i.emojis ? s : "");
  const name = i.businessName.trim() || "Votre marque";
  const act = i.activity.trim() || "votre activité";
  const city = i.city ? `${e("📍")} ${i.city}` : "";
  const svc = uniq((i.services || "").split(/[,;]/)).slice(0, 3);
  const svcLine = svc.length ? `${svc.join(" • ")}` : act;
  const link = i.website ? `${e("🔗")} ${i.website.replace(/^https?:\/\//, "")}` : "";
  const phone = i.phone ? `${e("📲")} ${i.phone}` : "";
  const ctaLine = i.cta ? (i.phone ? "Réservez dès maintenant 👇" : "Contactez-nous 👇") : "";

  const variants = [
    [`${e("✨")} ${name}`, svcLine, city, ctaLine, link].filter(Boolean).join("\n"),
    [`${name} | ${cap(act)}`, `${e("💼")} ${svcLine}`, [city, phone].filter(Boolean).join("  "), link].filter(Boolean).join("\n"),
    [`${e("🚀")} ${cap(act)} qui fait la différence`, svcLine, [city, ctaLine].filter(Boolean).join(" — "), link].filter(Boolean).join("\n"),
    [`${name}`, `${e("👉")} ${svcLine}`, city, link || phone].filter(Boolean).join("\n"),
    [`${cap(act)} ${e("•")} ${name}`, svcLine, ctaLine, link].filter(Boolean).join("\n"),
  ];
  return uniq(variants.map((v) => v.slice(0, 150)));
}

// ── INSTAGRAM CAPTIONS + HASHTAGS ───────────────────────────────────────────

export interface CaptionInput {
  businessType: string;
  postType: string; // Promotion / Nouveau produit / Offre / Événement / Ouverture / Témoignage / Éducatif
  tone: string;
  city?: string;
  details: string;
  ctaPreference?: string;
}

export interface CaptionResult {
  caption: string;
  shortVersion: string;
  longVersion: string;
  ctaOptions: string[];
  hashtags: string[];
}

export async function generateCaptions(
  input: CaptionInput
): Promise<{ source: GenSource; result: CaptionResult }> {
  if (aiEnabled()) {
    const prompt = `Tu es community manager francophone. Pour une publication Instagram de type "${input.postType}" pour "${input.businessType}"${input.city ? ` à ${input.city}` : ""}. Détails : ${input.details}. Ton : ${input.tone}. CTA souhaité : ${input.ctaPreference || "libre"}.
Réponds UNIQUEMENT en JSON avec ce schéma exact :
{"caption": string, "shortVersion": string, "longVersion": string, "ctaOptions": string[3], "hashtags": string[20]}
Les hashtags commencent par # et mélangent termes larges et de niche, en français.`;
    const obj = parseJson<CaptionResult>(await askAnthropic(prompt, 1500));
    if (obj && obj.caption && Array.isArray(obj.hashtags)) {
      return {
        source: "ai",
        result: {
          caption: obj.caption,
          shortVersion: obj.shortVersion || obj.caption,
          longVersion: obj.longVersion || obj.caption,
          ctaOptions: (obj.ctaOptions || []).slice(0, 4),
          hashtags: uniq(obj.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`))).slice(0, 25),
        },
      };
    }
  }
  return { source: "template", result: templateCaptions(input) };
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function templateCaptions(i: CaptionInput): CaptionResult {
  const biz = i.businessType.trim() || "notre entreprise";
  const city = i.city ? ` à ${i.city}` : "";
  const details = i.details.trim() || "notre nouveauté";

  const intros: Record<string, string> = {
    Promotion: `🔥 Offre à ne pas manquer${city} !`,
    "Nouveau produit": `✨ Nouveauté${city} : on a quelque chose pour vous.`,
    Offre: `🎁 Une offre pensée pour vous${city}.`,
    "Événement": `📅 Réservez la date${city} !`,
    Ouverture: `🎉 Grande ouverture${city} !`,
    "Témoignage": `💬 Vos retours nous font vibrer.`,
    "Éducatif": `💡 Le saviez-vous ?`,
  };
  const intro = intros[i.postType] || `✨ ${cap(biz)}${city}`;

  const caption = `${intro}\n${cap(details)}.\nChez ${biz}, on met tout en œuvre pour vous offrir le meilleur. 👇`;
  const shortVersion = `${intro} ${cap(details)} ✨`;
  const longVersion = `${intro}\n\n${cap(details)}.\n\nDepuis nos débuts, ${biz} s'engage à allier qualité, écoute et savoir-faire${city}. Chaque détail compte pour faire de votre expérience un moment unique.\n\nDécouvrez-en plus dès aujourd'hui et rejoignez une communauté qui nous fait confiance. ❤️`;

  const ctaOptions = [
    "📲 Envoyez-nous un message en DM pour en savoir plus !",
    "👉 Cliquez sur le lien en bio pour réserver.",
    "📍 Passez nous voir, on vous attend !",
    "💬 Dites-nous en commentaire ce que vous en pensez.",
  ];

  const bizTag = slug(biz);
  const cityTag = i.city ? slug(i.city) : "";
  const generic = [
    "#instabusiness", "#entrepreneur", "#madeinfrance", "#commercelocal",
    "#nouveaute", "#promo", "#bonplan", "#qualite", "#savoirfaire",
    "#inspiration", "#instagood", "#smallbusiness", "#marque", "#tendance",
  ];
  const typed: Record<string, string[]> = {
    Promotion: ["#promotion", "#offrespeciale", "#destockage", "#reduction"],
    "Nouveau produit": ["#nouveaute", "#newproduct", "#collection", "#lancement"],
    Offre: ["#offre", "#exclusif", "#avantage", "#cadeau"],
    "Événement": ["#evenement", "#savethedate", "#agenda", "#live"],
    Ouverture: ["#ouverture", "#grandeouverture", "#newshop", "#openingsoon"],
    "Témoignage": ["#avisclient", "#temoignage", "#merci", "#satisfaction"],
    "Éducatif": ["#lesaviezvous", "#conseil", "#astuce", "#tuto"],
  };
  const hashtags = uniq([
    bizTag ? `#${bizTag}` : "",
    cityTag ? `#${cityTag}` : "",
    ...(typed[i.postType] || []),
    ...generic,
  ]).slice(0, 22);

  return { caption, shortVersion, longVersion, ctaOptions, hashtags };
}
