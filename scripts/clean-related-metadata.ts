import "dotenv/config";
import { makePrisma, dbUrl } from "../prisma/seed-client";
import { splitSlugs } from "../src/lib/blog";

const prisma = makePrisma();

async function main() {
  console.log("=====================================================");
  console.log("CLEANING RELATED SERVICES & TOOLS METADATA IN TURSO");
  console.log("TARGET DB URL:", dbUrl());
  console.log("=====================================================");

  const posts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, relatedServices: true, relatedTools: true, relatedPortfolio: true },
  });

  let cleaned = 0;
  for (const post of posts) {
    let needsUpdate = false;
    const updateData: Record<string, string> = {};

    if (post.relatedServices && (post.relatedServices.includes("[") || post.relatedServices.includes('"') || post.relatedServices.includes("/"))) {
      updateData.relatedServices = splitSlugs(post.relatedServices).join(", ");
      needsUpdate = true;
    }

    if (post.relatedTools && (post.relatedTools.includes("[") || post.relatedTools.includes('"') || post.relatedTools.includes("/"))) {
      updateData.relatedTools = splitSlugs(post.relatedTools).join(", ");
      needsUpdate = true;
    }

    if (post.relatedPortfolio && (post.relatedPortfolio.includes("[") || post.relatedPortfolio.includes('"') || post.relatedPortfolio.includes("/"))) {
      updateData.relatedPortfolio = splitSlugs(post.relatedPortfolio).join(", ");
      needsUpdate = true;
    }

    if (needsUpdate) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: updateData,
      });
      cleaned++;
    }
  }

  console.log(`Cleaned related services & tools metadata for ${cleaned} / ${posts.length} articles.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Clean failed:", e);
  process.exit(1);
});
