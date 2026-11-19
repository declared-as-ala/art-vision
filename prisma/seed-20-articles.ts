import { makePrisma } from "./seed-client";
import { ARTICLES_20_NOV_DEC_2026 } from "./data/articles-20-nov-dec-2026";

const prisma = makePrisma();

async function main() {
  console.log("Seeding 20 blog articles for November & December 2026...");

  // Cache existing categories
  const categories = await prisma.blogCategory.findMany();
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  let insertedCount = 0;
  let updatedCount = 0;

  for (const article of ARTICLES_20_NOV_DEC_2026) {
    let categoryId = categoryMap.get(article.categorySlug);

    // Fallback if category slug doesn't exist
    if (!categoryId) {
      const fallback = categoryMap.get("impression-professionnelle") || categories[0]?.id;
      if (!fallback) throw new Error("No category found in database.");
      categoryId = fallback;
    }

    const dataPayload = {
      title: article.title,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      focusKeyword: article.focusKeyword,
      secondaryKeywords: article.secondaryKeywords,
      categoryId,
      excerpt: article.excerpt,
      content: article.content,
      featuredImage: article.featuredImage,
      featuredImageAlt: article.featuredImageAlt,
      imagePrompt: article.imagePrompt,
      author: article.author,
      readingTime: article.readingTime,
      status: "PUBLISHED",
      tags: `${article.focusKeyword}, ${article.secondaryKeywords}`,
      faqJson: JSON.stringify(article.faq),
      relatedServices: article.relatedServices,
      relatedTools: article.relatedTools,
      ctaTitle: article.ctaTitle,
      ctaText: article.ctaText,
      ctaLabel: article.ctaLabel,
      ctaHref: article.ctaHref,
      publishedAt: new Date(article.publishedAt),
      updatedAt: new Date(article.publishedAt),
    };

    const existing = await prisma.blogPost.findUnique({
      where: { slug: article.slug },
    });

    if (existing) {
      await prisma.blogPost.update({
        where: { slug: article.slug },
        data: dataPayload,
      });
      updatedCount++;
    } else {
      await prisma.blogPost.create({
        data: {
          slug: article.slug,
          ...dataPayload,
        },
      });
      insertedCount++;
    }

    console.log(`✓ [${article.ctaLabel}] -> /blog/${article.slug}`);
  }

  console.log(`\nFinished! Inserted: ${insertedCount}, Updated: ${updatedCount}, Total processed: ${ARTICLES_20_NOV_DEC_2026.length}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Error seeding 20 articles:", err);
  process.exit(1);
});
