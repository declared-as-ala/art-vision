import "dotenv/config";
import { makePrisma, dbUrl } from "../prisma/seed-client";
import { markdownToHtml } from "../src/lib/markdown";
import { ARTICLES_50_CLUSTER1_PRINT } from "../prisma/data/articles-50-cluster1-print";
import { ARTICLES_50_CLUSTER2_LOGO } from "../prisma/data/articles-50-cluster2-logo";
import { ARTICLES_50_CLUSTER3_RETAIL } from "../prisma/data/articles-50-cluster3-retail";
import { ARTICLES_50_CLUSTER4_WEB } from "../prisma/data/articles-50-cluster4-web";
import { ARTICLES_50_CLUSTER5_MOTION3D } from "../prisma/data/articles-50-cluster5-motion3d";

const prisma = makePrisma();

const ALL_50_ARTICLES = [
  ...ARTICLES_50_CLUSTER1_PRINT,
  ...ARTICLES_50_CLUSTER2_LOGO,
  ...ARTICLES_50_CLUSTER3_RETAIL,
  ...ARTICLES_50_CLUSTER4_WEB,
  ...ARTICLES_50_CLUSTER5_MOTION3D,
];

async function main() {
  console.log("=====================================================");
  console.log("CONVERTING 50 BLOG ARTICLES TO CLEAN SEMANTIC HTML");
  console.log("TARGET DB URL:", dbUrl());
  console.log("=====================================================");

  let updated = 0;
  for (const article of ALL_50_ARTICLES) {
    const htmlContent = markdownToHtml(article.content);

    const res = await prisma.blogPost.updateMany({
      where: { slug: article.slug },
      data: {
        content: htmlContent,
      },
    });

    if (res.count > 0) {
      updated++;
    }
  }

  console.log(`Successfully updated ${updated} / ${ALL_50_ARTICLES.length} articles in Turso DB to semantic HTML.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Conversion failed:", e);
  process.exit(1);
});
