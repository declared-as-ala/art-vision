/**
 * One-off cleanup: remove duplicate pricing packages and FAQs that accumulated
 * from repeated non-idempotent seeding. Keeps the first occurrence of each
 * unique package name (and FAQ question) per service. Run: npx tsx prisma/dedupe.ts
 */
import { makePrisma } from "./seed-client";

const prisma = makePrisma();

async function main() {
  const services = await prisma.service.findMany({ include: { packages: { orderBy: { createdAt: "asc" } }, faqs: { orderBy: { createdAt: "asc" } } } });
  let pkgDeleted = 0;
  let faqDeleted = 0;

  for (const s of services) {
    const seenPkg = new Set<string>();
    for (const p of s.packages) {
      if (seenPkg.has(p.name)) { await prisma.pricingPackage.delete({ where: { id: p.id } }); pkgDeleted++; }
      else seenPkg.add(p.name);
    }
    const seenFaq = new Set<string>();
    for (const f of s.faqs) {
      if (seenFaq.has(f.question)) { await prisma.fAQ.delete({ where: { id: f.id } }); faqDeleted++; }
      else seenFaq.add(f.question);
    }
  }

  console.log(`Removed ${pkgDeleted} duplicate package(s) and ${faqDeleted} duplicate FAQ(s).`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
