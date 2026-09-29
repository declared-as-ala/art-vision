import prisma from "./prisma";
import { getLandingContent } from "./expanded-tool-content";
import { toolsByOrder, toolUrl } from "./tools";

const BASE = "https://art-visions.fr";
const EXISTING_STATIC_TOOL_SLUGS = new Set([
  "calculateur-impression",
  "carte-de-visite-gratuite",
  "creer-flyer",
  "cv-gratuit",
  "generateur-bio-instagram",
  "generateur-brief-logo",
  "generateur-caption-instagram",
  "generateur-palette-couleurs",
  "generateur-qr-code",
  "generateur-slogan",
]);

export async function seedToolSEOData() {
  console.log("Seeding free-tool SEO data...");
  const newTools = toolsByOrder.filter((tool) => !EXISTING_STATIC_TOOL_SLUGS.has(tool.slug));

  for (const tool of newTools) {
    const path = toolUrl(tool.slug);
    const slug = path.slice(1);
    const content = getLandingContent(tool.slug);
    const secondaryKeywords = [
      ...content.search.secondaryKeywords,
      ...content.search.longTailKeywords,
    ].join(", ");

    await prisma.toolSetting.upsert({
      where: { toolType: tool.slug },
      update: {
        title: tool.title,
        shortDesc: tool.shortDesc,
        ctaLabel: tool.cta.label,
        ctaHref: tool.cta.href,
        seoTitle: tool.seoTitle,
        seoDescription: tool.seoDescription,
        faqJson: JSON.stringify(tool.faq),
        relatedServices: tool.relatedServices.map((service) => service.href.replace(/^\//, "")).join(","),
        isActive: true,
        indexable: true,
        sortOrder: tool.order,
      },
      create: {
        id: tool.slug,
        toolType: tool.slug,
        title: tool.title,
        shortDesc: tool.shortDesc,
        ctaLabel: tool.cta.label,
        ctaHref: tool.cta.href,
        seoTitle: tool.seoTitle,
        seoDescription: tool.seoDescription,
        faqJson: JSON.stringify(tool.faq),
        relatedServices: tool.relatedServices.map((service) => service.href.replace(/^\//, "")).join(","),
        isActive: true,
        indexable: true,
        sortOrder: tool.order,
      },
    });

    await prisma.sEOSettings.upsert({
      where: { slug },
      update: {
        pageType: "PAGE",
        title: tool.seoTitle,
        description: tool.seoDescription,
        focusKeyword: content.search.primaryKeyword,
        secondaryKeywords,
        canonicalUrl: `${BASE}${path}`,
        ogTitle: tool.seoTitle,
        ogDescription: tool.seoDescription,
        indexable: true,
        follow: true,
        schemaType: "WebApplication",
      },
      create: {
        id: `seo-tool-${tool.slug}`,
        slug,
        pageType: "PAGE",
        title: tool.seoTitle,
        description: tool.seoDescription,
        focusKeyword: content.search.primaryKeyword,
        secondaryKeywords,
        canonicalUrl: `${BASE}${path}`,
        ogTitle: tool.seoTitle,
        ogDescription: tool.seoDescription,
        indexable: true,
        follow: true,
        schemaType: "WebApplication",
      },
    });

    await prisma.sitemapEntry.upsert({
      where: { url: path },
      update: {
        priority: 0.85,
        changeFrequency: "weekly",
        included: true,
        lastModified: new Date(),
      },
      create: {
        url: path,
        priority: 0.85,
        changeFrequency: "weekly",
        included: true,
        lastModified: new Date(),
      },
    });

    for (let index = 0; index < tool.faq.length; index++) {
      const faq = tool.faq[index];
      await prisma.fAQ.upsert({
        where: { id: `faq-tool-${tool.slug}-${index}` },
        update: {
          pageType: "PAGE",
          pageId: slug,
          question: faq.question,
          answer: faq.answer,
          order: index,
          schemaEnabled: true,
        },
        create: {
          id: `faq-tool-${tool.slug}-${index}`,
          pageType: "PAGE",
          pageId: slug,
          question: faq.question,
          answer: faq.answer,
          order: index,
          schemaEnabled: true,
        },
      });
    }
  }

  console.log(`Free-tool SEO data seeded for ${newTools.length} tools.`);
}
