import prisma from "../src/lib/prisma";
import { NEW_ARTICLES_CLUSTER1_LOGO } from "../prisma/data/new-articles-cluster1-logo";
import { NEW_ARTICLES_CLUSTER2_PRINT } from "../prisma/data/new-articles-cluster2-print";
import { NEW_ARTICLES_CLUSTER3_COMMERCE } from "../prisma/data/new-articles-cluster3-commerce";
import { NEW_ARTICLES_CLUSTER4_DIGITAL } from "../prisma/data/new-articles-cluster4-digital";
import { NEW_ARTICLES_CLUSTER5_WEB } from "../prisma/data/new-articles-cluster5-web";

async function main() {
  console.log("=== SEEDING 60 NEW SEO BLOG ARTICLES INTO TURSO DB ===");

  // Retrieve category maps
  const categories = await prisma.blogCategory.findMany();
  const catMap = new Map<string, string>();
  for (const c of categories) {
    catMap.set(c.slug, c.id);
  }

  const logoCatId = catMap.get("creation-logo") || catMap.get("identite-visuelle-branding") || categories[0].id;
  const printCatId = catMap.get("impression-professionnelle") || categories[0].id;
  const commerceCatId = catMap.get("conseils-entrepreneurs") || categories[0].id;
  const digitalCatId = catMap.get("reseaux-sociaux") || catMap.get("communication-digitale") || categories[0].id;
  const webCatId = catMap.get("communication-digitale") || catMap.get("conseils-entrepreneurs") || categories[0].id;

  const clusterConfigs = [
    { name: "Cluster 1: Logo & Branding", articles: NEW_ARTICLES_CLUSTER1_LOGO, catId: logoCatId },
    { name: "Cluster 2: Impression & Print", articles: NEW_ARTICLES_CLUSTER2_PRINT, catId: printCatId },
    { name: "Cluster 3: Restauration & Commerce", articles: NEW_ARTICLES_CLUSTER3_COMMERCE, catId: commerceCatId },
    { name: "Cluster 4: Digital & Réseaux Sociaux", articles: NEW_ARTICLES_CLUSTER4_DIGITAL, catId: digitalCatId },
    { name: "Cluster 5: Sites Web & SEO", articles: NEW_ARTICLES_CLUSTER5_WEB, catId: webCatId },
  ];

  let totalUpserted = 0;

  for (const cluster of clusterConfigs) {
    console.log(`\nProcessing ${cluster.name} (${cluster.articles.length} articles)...`);
    for (const a of cluster.articles) {
      await prisma.blogPost.upsert({
        where: { slug: a.slug },
        update: {
          title: a.title,
          content: a.content.trim(),
          excerpt: a.excerpt,
          featuredImage: a.featuredImage,
          featuredImageAlt: a.featuredImageAlt,
          imagePrompt: a.imagePrompt,
          author: a.author,
          status: "PUBLISHED",
          tags: a.tags,
          seoTitle: a.seoTitle,
          seoDescription: a.seoDescription,
          focusKeyword: a.focusKeyword,
          secondaryKeywords: a.secondaryKeywords,
          faqJson: a.faqJson,
          relatedServices: a.relatedServices,
          relatedTools: a.relatedTools,
          ctaTitle: a.ctaTitle,
          ctaText: a.ctaText,
          ctaLabel: a.ctaLabel,
          ctaHref: a.ctaHref,
          readingTime: a.readingTime,
          publishedAt: a.publishedAt,
          categoryId: cluster.catId,
        },
        create: {
          slug: a.slug,
          title: a.title,
          content: a.content.trim(),
          excerpt: a.excerpt,
          featuredImage: a.featuredImage,
          featuredImageAlt: a.featuredImageAlt,
          imagePrompt: a.imagePrompt,
          author: a.author,
          status: "PUBLISHED",
          tags: a.tags,
          seoTitle: a.seoTitle,
          seoDescription: a.seoDescription,
          focusKeyword: a.focusKeyword,
          secondaryKeywords: a.secondaryKeywords,
          faqJson: a.faqJson,
          relatedServices: a.relatedServices,
          relatedTools: a.relatedTools,
          ctaTitle: a.ctaTitle,
          ctaText: a.ctaText,
          ctaLabel: a.ctaLabel,
          ctaHref: a.ctaHref,
          readingTime: a.readingTime,
          publishedAt: a.publishedAt,
          categoryId: cluster.catId,
        },
      });
      totalUpserted++;
      console.log(`  ✓ [Upserted] ${a.slug}`);
    }
  }

  const finalCount = await prisma.blogPost.count();
  const publishedCount = await prisma.blogPost.count({ where: { status: "PUBLISHED" } });

  console.log("\n==========================================");
  console.log(`Successfully upserted: ${totalUpserted} articles`);
  console.log(`Total BlogPost in database: ${finalCount}`);
  console.log(`Total PUBLISHED BlogPost: ${publishedCount}`);
  console.log("==========================================");
}

main()
  .catch((e) => {
    console.error("Error during blog seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
