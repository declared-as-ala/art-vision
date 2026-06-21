/**
 * One-off repair for double-encoded (mojibake) text, e.g. "IdentitÃ© visuelle"
 * → "Identité visuelle". Reverses the corruption by re-encoding the string to
 * Windows-1252 bytes and decoding them as UTF-8.
 *
 * Safe: only strings containing mojibake markers are touched, and a fix is
 * applied only when it round-trips cleanly (no invalid UTF-8). Correct text is
 * left untouched.
 *
 * Run: npx tsx prisma/fix-encoding.ts
 */
import { makePrisma } from "./seed-client";

const prisma = makePrisma();

// Windows-1252 specials (0x80–0x9F) → byte value, for chars above 0xFF.
const CP1252_EXTRA: Record<number, number> = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85, 0x2020: 0x86,
  0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a, 0x2039: 0x8b, 0x0152: 0x8c,
  0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95,
  0x2013: 0x96, 0x2014: 0x97, 0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b,
  0x0153: 0x9c, 0x017e: 0x9e, 0x0178: 0x9f,
};

function toCp1252(str: string): Buffer | null {
  const bytes: number[] = [];
  for (const ch of str) {
    const cp = ch.codePointAt(0)!;
    if (cp <= 0xff) bytes.push(cp);
    else if (CP1252_EXTRA[cp] !== undefined) bytes.push(CP1252_EXTRA[cp]);
    else return null; // char not representable → not our mojibake, skip
  }
  return Buffer.from(bytes);
}

function fix(value: unknown): unknown {
  if (typeof value !== "string" || !value) return value;
  // Only attempt on strings that look corrupted.
  if (!/[ÃÂÅ]|â€/.test(value)) return value;
  const bytes = toCp1252(value);
  if (!bytes) return value;
  const decoded = bytes.toString("utf8");
  if (decoded === value) return value;
  if (decoded.includes("�")) return value; // invalid round-trip → leave as-is
  // Re-fix in case of triple-encoding.
  return /[ÃÂÅ]|â€/.test(decoded) ? fix(decoded) : decoded;
}

let totalFields = 0;
let totalRows = 0;

async function repair(model: string, fields: string[], delegate: any) {
  const rows = await delegate.findMany();
  let changedRows = 0;
  for (const row of rows) {
    const data: Record<string, unknown> = {};
    for (const f of fields) {
      const fixed = fix(row[f]);
      if (fixed !== row[f]) { data[f] = fixed; totalFields++; }
    }
    if (Object.keys(data).length) {
      await delegate.update({ where: { id: row.id }, data });
      changedRows++;
    }
  }
  if (changedRows) console.log(`  ${model}: ${changedRows} row(s) repaired`);
  totalRows += changedRows;
}

async function main() {
  console.log("Repairing mojibake text…");
  await repair("Service", ["name", "description", "detailedBody", "benefits", "process", "seoTitle", "seoDescription"], prisma.service);
  await repair("PricingPackage", ["name", "price", "features"], prisma.pricingPackage);
  await repair("FAQ", ["question", "answer"], prisma.fAQ);
  await repair("Page", ["title", "contentJson", "contentHtml", "excerpt", "seoTitle", "seoDescription"], prisma.page);
  await repair("BlogPost", ["title", "content", "excerpt", "author", "tags", "seoTitle", "seoDescription", "ogTitle", "ogDescription", "faqJson", "ctaTitle", "ctaText", "ctaLabel", "featuredImageAlt", "secondaryKeywords", "focusKeyword"], prisma.blogPost);
  await repair("BlogCategory", ["name", "description"], prisma.blogCategory);
  await repair("PortfolioProject", ["title", "client", "industry", "objective", "challenge", "solution", "result", "testimonial", "testimonialRole", "testimonialAuthor", "seoTitle", "seoDescription"], prisma.portfolioProject);
  await repair("PortfolioCategory", ["name"], prisma.portfolioCategory);
  await repair("Testimonial", ["name", "role", "message"], prisma.testimonial);
  await repair("SeoLandingPage", ["title", "h1", "keyword", "city", "intro", "content", "faq", "metaDescription", "seoTitle"], prisma.seoLandingPage);
  await repair("SiteSettings", ["brandName", "slogan", "franceAddress", "tunisiaAddress"], prisma.siteSettings);
  await repair("SEOSettings", ["globalTitle", "globalDesc", "title", "description", "ogTitle", "ogDescription", "twitterTitle", "twitterDescription"], prisma.sEOSettings);
  await repair("QuoteRequest", ["service", "details", "name", "company", "notes"], prisma.quoteRequest);
  await repair("ContactMessage", ["name", "message"], prisma.contactMessage);

  console.log(`\nDone. ${totalFields} field(s) across ${totalRows} row(s) repaired.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
