import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { computeSeoScore } from "@/lib/seo-score";

export async function GET() {
  try {
    const list: any[] = [];

    // Helper to run SEO analysis on an item (fair, type-aware, capped at 100).
    const analyzeSEO = (item: {
      id: string;
      title: string;
      slug: string;
      type: string;
      seoTitle: string | null;
      seoDescription: string | null;
      focusKeyword?: string | null;
      content: string | null;
      canonicalUrl: string | null;
      indexable: boolean;
      hasFaqs: boolean;
      enriched?: boolean;
    }) => {
      const { score, checklist, wordCount } = computeSeoScore(item);
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        type: item.type,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        focusKeyword: (item.focusKeyword || item.title || "").trim() || null,
        wordCount,
        score,
        checklist
      };
    };

    // 1. Fetch Services
    const services = await prisma.service.findMany({
      include: { faqs: true }
    });
    for (const service of services) {
      // Find matching SEOSettings if any
      const seoSettings = await prisma.sEOSettings.findFirst({
        where: { pageType: "SERVICE", pageId: service.id }
      });

      list.push(analyzeSEO({
        id: service.id,
        title: service.name,
        slug: `/${service.slug}`,
        type: "Prestation",
        seoTitle: seoSettings?.title || service.seoTitle,
        seoDescription: seoSettings?.description || service.seoDescription,
        focusKeyword: seoSettings?.focusKeyword || service.name,
        content: service.detailedBody,
        canonicalUrl: seoSettings?.canonicalUrl || `https://art-visions.fr/${service.slug}`,
        indexable: seoSettings?.indexable !== undefined ? seoSettings.indexable : true,
        hasFaqs: service.faqs.length > 0,
        enriched: !!service.gallery || !!service.detailedBody || service.faqs.length > 0
      }));
    }

    // 2. Fetch SEO Landing Pages
    const landings = await prisma.seoLandingPage.findMany();
    for (const landing of landings) {
      const faqsList = landing.faq ? JSON.parse(landing.faq) : [];
      list.push(analyzeSEO({
        id: landing.id,
        title: landing.title,
        slug: `/${landing.slug}`,
        type: "Landing SEO",
        seoTitle: landing.seoTitle || landing.title,
        seoDescription: landing.metaDescription || landing.intro,
        focusKeyword: landing.keyword,
        content: landing.content,
        canonicalUrl: landing.canonicalUrl || `https://art-visions.fr/${landing.slug}`,
        indexable: landing.indexable,
        hasFaqs: faqsList.length > 0,
        enriched: true
      }));
    }

    // 3. Fetch Blogs
    const blogs = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" }
    });
    for (const blog of blogs) {
      // Check custom SEOSettings if any
      const seoSettings = await prisma.sEOSettings.findFirst({
        where: { pageType: "POST", pageId: blog.id }
      });

      list.push(analyzeSEO({
        id: blog.id,
        title: blog.title,
        slug: `/blog/${blog.slug}`,
        type: "Article Blog",
        seoTitle: seoSettings?.title || blog.seoTitle,
        seoDescription: seoSettings?.description || blog.seoDescription,
        focusKeyword: seoSettings?.focusKeyword || blog.tags.split(",")[0] || null,
        content: blog.content,
        canonicalUrl: seoSettings?.canonicalUrl || `https://art-visions.fr/blog/${blog.slug}`,
        indexable: seoSettings?.indexable !== undefined ? seoSettings.indexable : true,
        hasFaqs: false,
        enriched: !!blog.featuredImage || (blog.content || "").length > 0
      }));
    }

    // 4. Fetch Portfolio Projects
    const projects = await prisma.portfolioProject.findMany();
    for (const project of projects) {
      const seoSettings = await prisma.sEOSettings.findFirst({
        where: { pageType: "PROJECT", pageId: project.id }
      });

      list.push(analyzeSEO({
        id: project.id,
        title: project.title,
        slug: `/portfolio/${project.slug}`,
        type: "Réalisation",
        seoTitle: seoSettings?.title || project.seoTitle,
        seoDescription: seoSettings?.description || project.seoDescription,
        focusKeyword: seoSettings?.focusKeyword || project.title,
        content: `${project.objective} ${project.challenge} ${project.solution} ${project.result}`,
        canonicalUrl: seoSettings?.canonicalUrl || `https://art-visions.fr/portfolio/${project.slug}`,
        indexable: seoSettings?.indexable !== undefined ? seoSettings.indexable : true,
        hasFaqs: false,
        enriched: !!project.images
      }));
    }

    // 5. Fetch Static Pages (From Page Model)
    const pages = await prisma.page.findMany();
    for (const page of pages) {
      const seoSettings = await prisma.sEOSettings.findFirst({
        where: { pageType: "PAGE", pageId: page.id }
      });

      list.push(analyzeSEO({
        id: page.id,
        title: page.title,
        slug: page.slug === "home" ? "/" : `/${page.slug}`,
        type: "Page Statique",
        seoTitle: seoSettings?.title || page.seoTitle || page.title,
        seoDescription: seoSettings?.description || page.seoDescription,
        focusKeyword: seoSettings?.focusKeyword || page.title,
        content: page.contentHtml || page.excerpt || page.contentJson,
        canonicalUrl: seoSettings?.canonicalUrl || page.canonicalUrl || `https://art-visions.fr/${page.slug === "home" ? "" : page.slug}`,
        indexable: seoSettings?.indexable !== undefined ? seoSettings.indexable : true,
        hasFaqs: false,
        enriched: !!(page.contentHtml || page.contentJson || page.excerpt)
      }));
    }

    return NextResponse.json({ success: true, pages: list });
  } catch (error) {
    console.error("GET pages SEO checklist error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate SEO checklist data" }, { status: 500 });
  }
}

// PUT: Save custom SEOSettings for any page
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      pageType,
      pageId,
      title,
      description,
      focusKeyword,
      canonicalUrl,
      indexable,
      follow,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage
    } = body;

    if (!pageType || !pageId) {
      return NextResponse.json({ success: false, error: "pageType and pageId are required" }, { status: 400 });
    }

    // Fetch existing settings or create
    const existing = await prisma.sEOSettings.findFirst({
      where: { pageType, pageId }
    });

    let seoSettings;
    if (existing) {
      seoSettings = await prisma.sEOSettings.update({
        where: { id: existing.id },
        data: {
          title,
          description,
          focusKeyword,
          canonicalUrl,
          indexable: indexable !== undefined ? indexable : true,
          follow: follow !== undefined ? follow : true,
          ogTitle: ogTitle || title,
          ogDescription: ogDescription || description,
          ogImage,
          twitterTitle: twitterTitle || title,
          twitterDescription: twitterDescription || description,
          twitterImage
        }
      });
    } else {
      seoSettings = await prisma.sEOSettings.create({
        data: {
          pageType,
          pageId,
          title,
          description,
          focusKeyword,
          canonicalUrl,
          indexable: indexable !== undefined ? indexable : true,
          follow: follow !== undefined ? follow : true,
          ogTitle: ogTitle || title,
          ogDescription: ogDescription || description,
          ogImage,
          twitterTitle: twitterTitle || title,
          twitterDescription: twitterDescription || description,
          twitterImage,
          slug: `${pageType.toLowerCase()}-${pageId}` // Unique dummy slug to satisfy unique constraint if required
        }
      });
    }

    return NextResponse.json({ success: true, seoSettings });
  } catch (error) {
    console.error("PUT page SEO update error:", error);
    return NextResponse.json({ success: false, error: "Failed to save SEO metadata" }, { status: 500 });
  }
}
