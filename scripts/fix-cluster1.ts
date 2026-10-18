import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "prisma/data/new-articles-cluster1-logo.ts");
let content = fs.readFileSync(filePath, "utf-8");

// Replace import
content = content.replace(
  'import { BlogPostInput } from "./seo-blogs-logo";',
  `export interface NewBlogPostInput {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  imagePrompt: string;
  author: string;
  status: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  faqJson: string;
  relatedServices: string;
  relatedTools: string;
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
  readingTime: number;
  publishedAt: Date;
}`
);

content = content.replace(
  "export const NEW_ARTICLES_CLUSTER1_LOGO: BlogPostInput[] = [",
  "export const NEW_ARTICLES_CLUSTER1_LOGO: NewBlogPostInput[] = ["
);

// We want to transform faqs: [ ... ] into faqJson: JSON.stringify([ ... ]), status: "PUBLISHED", publishedAt: new Date("2026-03-24T08:00:00Z"),
// Let's use regex or eval
// Notice in the file, every article ends with:
// faqs: [
//   { question: "...", answer: "..." },
//   ...
// ]
// }

// Let's replace 'faqs: [' with 'status: "PUBLISHED",\n    publishedAt: new Date("2026-03-24T08:00:00Z"),\n    faqJson: JSON.stringify(['
// and we need to close JSON.stringify() where the faqs array ends!

// Let's find every `faqs:\s*\[([\s\S]*?)\]\s*(?=},|\}\s*\])` and replace with `faqJson: JSON.stringify([$1]),\n    status: "PUBLISHED",\n    publishedAt: new Date("2026-03-24T08:00:00Z")`
const regex = /faqs:\s*(\[[\s\S]*?\])\s*(?=},|\}\s*\])/g;
content = content.replace(regex, (match, p1) => {
  return `faqJson: JSON.stringify(${p1}),\n    status: "PUBLISHED",\n    publishedAt: new Date("2026-03-24T08:00:00Z")`;
});

// Also remove categorySlug if it causes issues, but NewBlogPostInput doesn't forbid extra properties unless strict, or we can just keep it.
fs.writeFileSync(filePath, content, "utf-8");
console.log("Updated new-articles-cluster1-logo.ts successfully");
