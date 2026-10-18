import { makePrisma } from "../prisma/seed-client";

const prisma = makePrisma();

async function main() {
  console.log("=== ART VISIONS AUDIT INSPECTION ===");
  
  // 1. Blog posts
  const totalPosts = await prisma.blogPost.count();
  const publishedPosts = await prisma.blogPost.count({ where: { status: "PUBLISHED" } });
  const draftPosts = await prisma.blogPost.count({ where: { status: "DRAFT" } });
  console.log(`Blog Posts -> Total: ${totalPosts}, Published: ${publishedPosts}, Drafts: ${draftPosts}`);

  // 2. Categories
  const categories = await prisma.blogCategory.findMany({
    include: { _count: { select: { posts: true } } },
  });
  console.log("\nCategories:");
  categories.forEach(c => console.log(` - [${c.slug}] ${c.name}: ${c._count.posts} posts`));

  // 3. Services in DB
  const services = await prisma.service.findMany({ select: { slug: true, name: true } });
  console.log("\nServices in DB:", services.length);
  services.forEach(s => console.log(` - /services/${s.slug} (${s.name})`));

  // 4. SeoLandingPages in DB
  const landings = await prisma.seoLandingPage.findMany({
    select: { slug: true, title: true, keyword: true, pageType: true, city: true },
  });
  console.log("\nSeoLandingPages in DB:", landings.length);
  landings.forEach(l => console.log(` - /${l.slug} (${l.title} | ${l.keyword} | ${l.pageType} ${l.city || ""})`));

  // 5. Pages in DB
  const pages = await prisma.page.findMany({ select: { slug: true, title: true } });
  console.log("\nPages in DB:", pages.length);
  pages.forEach(p => console.log(` - /${p.slug} (${p.title})`));

}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
