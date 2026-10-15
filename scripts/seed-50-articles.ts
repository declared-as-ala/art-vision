import { makePrisma } from "../prisma/seed-client";
import { ARTICLES_CLUSTER1_LOGO } from "../prisma/data/articles-cluster1-logo";
import { ARTICLES_CLUSTER2_PRINT } from "../prisma/data/articles-cluster2-print";
import { ARTICLES_CLUSTER3_COMMERCE } from "../prisma/data/articles-cluster3-commerce";
import { ARTICLES_CLUSTER4_DIGITAL } from "../prisma/data/articles-cluster4-digital";
import { ARTICLES_CLUSTER5_WEB } from "../prisma/data/articles-cluster5-web";
import { BlogPostInput } from "../prisma/data/seo-blogs-logo";

const prisma = makePrisma();

const CATEGORIES = [
  { slug: "creation-logo", name: "Création logo", icon: "PenTool", description: "Concevoir, choisir et faire évoluer un logo professionnel.", sortOrder: 2 },
  { slug: "identite-visuelle-branding", name: "Identité visuelle & Branding", icon: "Palette", description: "Stratégie de marque, charte graphique, couleurs et positionnement visuel.", sortOrder: 1 },
  { slug: "design-graphique", name: "Design graphique", icon: "Layout", description: "Supports de communication, mise en page et création visuelle.", sortOrder: 3 },
  { slug: "impression-professionnelle", name: "Impression professionnelle", icon: "Printer", description: "Flyers, affiches, cartes de visite, grand format et préparation fichiers.", sortOrder: 6 },
  { slug: "conseils-entrepreneurs", name: "Conseils entrepreneurs", icon: "Users", description: "Conseils pratiques pour l'image et la communication des entreprises.", sortOrder: 9 },
  { slug: "communication-digitale", name: "Communication digitale", icon: "Globe", description: "Site web, contenu et stratégie de communication en ligne.", sortOrder: 7 },
  { slug: "reseaux-sociaux", name: "Réseaux sociaux", icon: "Instagram", description: "Instagram, contenu social, calendrier éditorial et engagement.", sortOrder: 8 },
  { slug: "video-motion-design", name: "Vidéo & Motion design", icon: "Video", description: "Vidéo publicitaire, corporate, montage et animation graphique.", sortOrder: 4 },
];

async function main() {
  console.log("=== Seeding 50 Premium SEO Blog Articles ===");

  // 1. Ensure categories exist
  const catMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const c = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });
    catMap[cat.slug] = c.id;
  }
  console.log("✓ Categories verified:", Object.keys(catMap).length);

  // 2. Aggregate all 5 clusters
  const ALL_50_ARTICLES: BlogPostInput[] = [
    ...ARTICLES_CLUSTER1_LOGO,
    ...ARTICLES_CLUSTER2_PRINT,
    ...ARTICLES_CLUSTER3_COMMERCE,
    ...ARTICLES_CLUSTER4_DIGITAL,
    ...ARTICLES_CLUSTER5_WEB,
  ];

  console.log(`Total articles to seed: ${ALL_50_ARTICLES.length}`);
  if (ALL_50_ARTICLES.length !== 50) {
    console.warn(`WARNING: Expected 50 articles, got ${ALL_50_ARTICLES.length}`);
  }

  // 3. Upsert each article
  let seededCount = 0;
  for (const post of ALL_50_ARTICLES) {
    const categoryId = catMap[post.categorySlug] || catMap["communication-digitale"] || catMap["creation-logo"];
    if (!categoryId) {
      throw new Error(`Category not found for slug: ${post.categorySlug}`);
    }

    const data = {
      title: post.title,
      content: post.content.trim(),
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      featuredImageAlt: post.featuredImageAlt,
      imagePrompt: post.imagePrompt,
      author: post.author,
      status: "PUBLISHED" as const,
      tags: post.tags,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      focusKeyword: post.focusKeyword,
      secondaryKeywords: post.secondaryKeywords,
      ogTitle: post.seoTitle,
      ogDescription: post.seoDescription,
      ogImage: post.featuredImage,
      faqJson: JSON.stringify(post.faq),
      relatedServices: post.relatedServices || null,
      relatedTools: post.relatedTools || null,
      relatedPortfolio: post.relatedPortfolio || null,
      ctaTitle: post.ctaTitle || null,
      ctaText: post.ctaText || null,
      ctaLabel: post.ctaLabel || null,
      ctaHref: post.ctaHref || null,
      readingTime: post.readingTime,
      isPillar: post.readingTime >= 9,
      publishedAt: new Date(),
      categoryId: categoryId,
    };

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: data,
      create: {
        slug: post.slug,
        ...data,
      },
    });

    seededCount++;
    console.log(`[${seededCount}/50] Upserted: ${post.slug}`);
  }

  console.log(`\n🎉 SUCCESS: All ${seededCount} articles successfully upserted into the database!`);
}

main()
  .catch((err) => {
    console.error("Error seeding articles:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
