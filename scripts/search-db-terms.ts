import prisma from "../src/lib/prisma";

async function main() {
  const terms = [
    "Recherche et intention SEO",
    "Notre angle",
    "Cette page cible principalement",
    "Recherches observées",
    "scrapé",
    "scrapes",
    "scraped",
    "scraping",
    "70%",
    "more than 70%"
  ];

  console.log("=== SCANNING DATABASE FOR TERMS ===");

  // 1. SeoLandingPage
  const landings = await prisma.seoLandingPage.findMany();
  for (const l of landings) {
    for (const t of terms) {
      if (l.content && l.content.toLowerCase().includes(t.toLowerCase())) {
        console.log(`[SeoLandingPage] slug: "${l.slug}" matched term: "${t}" in content`);
      }
      if (l.intro && l.intro.toLowerCase().includes(t.toLowerCase())) {
        console.log(`[SeoLandingPage] slug: "${l.slug}" matched term: "${t}" in intro`);
      }
    }
  }

  // 2. Page
  const pages = await prisma.page.findMany();
  for (const p of pages) {
    for (const t of terms) {
      if (p.contentHtml && p.contentHtml.toLowerCase().includes(t.toLowerCase())) {
        console.log(`[Page] slug: "${p.slug}" matched term: "${t}" in contentHtml`);
      }
      if (p.contentJson && p.contentJson.toLowerCase().includes(t.toLowerCase())) {
        console.log(`[Page] slug: "${p.slug}" matched term: "${t}" in contentJson`);
      }
    }
  }

  // 3. BlogPost
  const posts = await prisma.blogPost.findMany();
  for (const b of posts) {
    for (const t of terms) {
      if (b.content && b.content.toLowerCase().includes(t.toLowerCase())) {
        console.log(`[BlogPost] slug: "${b.slug}" matched term: "${t}" in content`);
      }
      if (b.excerpt && b.excerpt.toLowerCase().includes(t.toLowerCase())) {
        console.log(`[BlogPost] slug: "${b.slug}" matched term: "${t}" in excerpt`);
      }
    }
  }

  // 4. Service
  const services = await prisma.service.findMany();
  for (const s of services) {
    for (const t of terms) {
      if (s.detailedBody && s.detailedBody.toLowerCase().includes(t.toLowerCase())) {
        console.log(`[Service] slug: "${s.slug}" matched term: "${t}" in detailedBody`);
      }
      if (s.description && s.description.toLowerCase().includes(t.toLowerCase())) {
        console.log(`[Service] slug: "${s.slug}" matched term: "${t}" in description`);
      }
    }
  }

  // 5. ToolSetting
  const tools = await prisma.toolSetting.findMany();
  for (const tool of tools) {
    for (const t of terms) {
      if (tool.shortDesc && tool.shortDesc.toLowerCase().includes(t.toLowerCase())) {
        console.log(`[ToolSetting] toolType: "${tool.toolType}" matched term: "${t}" in shortDesc`);
      }
    }
  }

  console.log("=== DB SCAN COMPLETED ===");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
