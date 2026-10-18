import prisma from "../src/lib/prisma";

async function main() {
  const categories = await prisma.blogCategory.findMany();
  console.log("Categories found:", categories.length);
  for (const c of categories) {
    console.log(`- id: ${c.id}, slug: ${c.slug}, name: ${c.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
