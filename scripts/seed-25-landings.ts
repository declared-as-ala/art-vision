import { makePrisma } from "../prisma/seed-client";
import { NEW_LANDING_PAGES_25 } from "../prisma/data/new-landing-pages-25";

const prisma = makePrisma();

async function main() {
  console.log("=== Seeding 25 High-Value Commercial SEO Landing Pages ===");
  console.log(`Total landing pages to seed: ${NEW_LANDING_PAGES_25.length}`);

  let count = 0;
  for (const page of NEW_LANDING_PAGES_25) {
    const data = {
      title: page.title,
      h1: page.h1,
      keyword: page.keyword,
      pageType: "GENERIC" as const,
      intro: page.intro.trim(),
      content: page.content.trim(),
      faq: JSON.stringify(page.faqs),
      relatedServices: page.relatedServices || null,
      relatedPortfolio: page.relatedPortfolio || null,
      status: "PUBLISHED" as const,
      seoTitle: page.title,
      metaDescription: page.metaDesc,
      canonicalUrl: `https://art-visions.fr/${page.slug}`,
      indexable: true,
    };

    await prisma.seoLandingPage.upsert({
      where: { slug: page.slug },
      update: data,
      create: {
        slug: page.slug,
        ...data,
      },
    });

    count++;
    console.log(`[${count}/25] Upserted landing page: /${page.slug}`);
  }

  const totalNow = await prisma.seoLandingPage.count();
  console.log(`\n🎉 SUCCESS: All 25 landing pages upserted! Total in DB: ${totalNow}`);
}

main()
  .catch((err) => {
    console.error("Error seeding landing pages:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
