import "dotenv/config";
import { makePrisma, dbUrl } from "../prisma/seed-client";
import { markdownToHtml } from "../src/lib/markdown";
import { ARTICLES_50_CLUSTER1_PRINT } from "../prisma/data/articles-50-cluster1-print";
import { ARTICLES_50_CLUSTER2_LOGO } from "../prisma/data/articles-50-cluster2-logo";
import { ARTICLES_50_CLUSTER3_RETAIL } from "../prisma/data/articles-50-cluster3-retail";
import { ARTICLES_50_CLUSTER4_WEB } from "../prisma/data/articles-50-cluster4-web";
import { ARTICLES_50_CLUSTER5_MOTION3D } from "../prisma/data/articles-50-cluster5-motion3d";

const prisma = makePrisma();

const CATEGORIES_DEF = [
  { slug: "creation-logo", name: "Création logo", icon: "PenTool", description: "Concevoir, choisir et faire évoluer un logo professionnel.", sortOrder: 1 },
  { slug: "identite-visuelle-branding", name: "Identité visuelle & Branding", icon: "Palette", description: "Stratégie de marque, charte graphique, couleurs et positionnement visuel.", sortOrder: 2 },
  { slug: "design-graphique", name: "Design graphique", icon: "Layout", description: "Supports de communication, mise en page et création visuelle.", sortOrder: 3 },
  { slug: "impression-professionnelle", name: "Impression professionnelle", icon: "Printer", description: "Flyers, affiches, cartes de visite, grand format et préparation fichiers.", sortOrder: 4 },
  { slug: "signaletique", name: "Signalétique & Enseignes", icon: "Flag", description: "Enseignes de magasin, vitrophanies, panneaux et marquage.", sortOrder: 5 },
  { slug: "communication-digitale", name: "Communication digitale", icon: "Globe", description: "Site web, conversion, référencement et présence en ligne.", sortOrder: 6 },
  { slug: "video-motion-design", name: "Vidéo & Motion design", icon: "Video", description: "Vidéo publicitaire, animations 2D, storyboards et formats réseaux.", sortOrder: 7 },
  { slug: "3d-cgi", name: "3D & CGI", icon: "Box", description: "Modélisation 3D, packshots photoréalistes et effets visuels FOOH.", sortOrder: 8 },
  { slug: "conseils-entrepreneurs", name: "Conseils entrepreneurs", icon: "Users", description: "Conseils pratiques pour l'image et la communication des entreprises.", sortOrder: 9 },
];

async function main() {
  console.log("=====================================================");
  console.log("ART VISIONS — SAFE SEEDING OF 50 NEW PREMIUM SEO BLOGS");
  console.log("TARGET DB URL:", dbUrl());
  console.log("=====================================================");

  // 1. Ensure categories exist in Turso LibSQL database
  const catMap: Record<string, string> = {};
  for (const cat of CATEGORIES_DEF) {
    const record = await prisma.blogCategory.upsert({
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
    catMap[cat.slug] = record.id;
  }
  console.log(`✓ Verified ${Object.keys(catMap).length} categories in database.`);

  // 2. Aggregate all 5 clusters
  const ALL_50_ARTICLES = [
    ...ARTICLES_50_CLUSTER1_PRINT,
    ...ARTICLES_50_CLUSTER2_LOGO,
    ...ARTICLES_50_CLUSTER3_RETAIL,
    ...ARTICLES_50_CLUSTER4_WEB,
    ...ARTICLES_50_CLUSTER5_MOTION3D,
  ];

  console.log(`✓ Total articles to seed: ${ALL_50_ARTICLES.length} (Target: 50)`);

  if (ALL_50_ARTICLES.length !== 50) {
    throw new Error(`Integrity error: expected exactly 50 articles, got ${ALL_50_ARTICLES.length}`);
  }

  // Baseline publication date: spread gracefully across recent days up to current production date
  const now = new Date();
  let seededCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < ALL_50_ARTICLES.length; i++) {
    const post = ALL_50_ARTICLES[i];

    // Calculate realistic publishedAt (spread over the past 14 days)
    const daysAgo = Math.floor((50 - i) * (14 / 50));
    const articlePublishedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const categoryId = catMap[post.categorySlug] || catMap["communication-digitale"] || catMap["impression-professionnelle"];
    if (!categoryId) {
      throw new Error(`Missing category mapping for slug: ${post.categorySlug}`);
    }

    const payload = {
      title: post.title,
      content: markdownToHtml(post.content),
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      featuredImageAlt: post.featuredImageAlt,
      imagePrompt: post.imagePrompt,
      author: post.author,
      status: "PUBLISHED" as const,
      tags: JSON.stringify([post.focusKeyword, ...post.secondaryKeywords.split(",").map((s) => s.trim())]),
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      focusKeyword: post.focusKeyword,
      secondaryKeywords: post.secondaryKeywords,
      ogTitle: post.seoTitle,
      ogDescription: post.seoDescription,
      ogImage: post.featuredImage,
      faqJson: JSON.stringify(post.faq),
      relatedServices: post.relatedServices,
      relatedTools: post.relatedTools,
      ctaTitle: post.ctaTitle,
      ctaText: post.ctaText,
      ctaLabel: post.ctaLabel,
      ctaHref: post.ctaHref,
      readingTime: post.readingTime,
      isPillar: post.readingTime >= 8,
      publishedAt: articlePublishedAt,
      categoryId,
    };

    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });

    if (existing) {
      await prisma.blogPost.update({
        where: { slug: post.slug },
        data: payload,
      });
      updatedCount++;
    } else {
      await prisma.blogPost.create({
        data: {
          slug: post.slug,
          ...payload,
        },
      });
      seededCount++;
    }
  }

  console.log(`\n=====================================================`);
  console.log(`✓ SEEDING COMPLETED SUCCESSFULLY!`);
  console.log(`  - Newly created: ${seededCount}`);
  console.log(`  - Updated / verified: ${updatedCount}`);
  console.log(`  - Total active in batch: ${seededCount + updatedCount} / 50`);
  console.log(`=====================================================\n`);

  // 3. Verify total published blog posts in database
  const totalPublished = await prisma.blogPost.count({
    where: { status: "PUBLISHED" },
  });
  console.log(`Current Total Published Blog Posts in Turso DB: ${totalPublished}`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
