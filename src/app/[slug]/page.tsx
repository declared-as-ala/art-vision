import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Palette, Sparkles, Check, HelpCircle, ArrowRight, ShieldCheck, MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { RichContent } from "@/components/cms/RichContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

// Dynamic Metadata Generator for Technical SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();

  const page = await prisma.page.findUnique({ where: { slug } });
  if (page && ((page.status === "PUBLISHED" && page.isActive) || isPreview)) {
    const canonical = page.canonicalUrl || `https://art-visions.fr/${slug}`;
    return {
      title: page.seoTitle || page.title,
      description: page.seoDescription || page.excerpt || undefined,
      alternates: { canonical },
      robots: { index: !isPreview && page.isActive, follow: !isPreview && page.isActive },
      openGraph: {
        title: page.seoTitle || page.title,
        description: page.seoDescription || page.excerpt || undefined,
        images: page.ogImage ? [{ url: page.ogImage }] : undefined,
        url: canonical,
        type: "website",
      },
    };
  }

  // 1. Check if it matches a Service
  try {
    const service = await prisma.service.findUnique({ where: { slug } });
    if (service && (service.status === "PUBLISHED" || isPreview)) {
      const seo = await prisma.sEOSettings.findFirst({
        where: { pageType: "SERVICE", pageId: service.id }
      });

      const title = seo?.title || service.seoTitle || `${service.name} | Art Vision`;
      const desc = seo?.description || service.seoDescription || service.description;
      const canonical = seo?.canonicalUrl || `https://art-visions.fr/${slug}`;
      const indexable = seo?.indexable !== undefined ? seo.indexable : true;
      const follow = seo?.follow !== undefined ? seo.follow : true;

      return {
        title,
        description: desc,
        alternates: {
          canonical,
          languages: {
            "fr-FR": canonical,
            "en-US": canonical.replace("art-visions.fr", "art-visions.fr/en"),
            "ar-AE": canonical.replace("art-visions.fr", "art-visions.fr/ar")
          }
        },
        robots: {
          index: indexable,
          follow,
        },
        openGraph: {
          title: seo?.ogTitle || title,
          description: seo?.ogDescription || desc,
          images: seo?.ogImage ? [{ url: seo.ogImage }] : (service.image ? [{ url: service.image }] : undefined),
          url: `https://art-visions.fr/${slug}`,
          type: "website"
        },
        twitter: {
          card: "summary_large_image",
          title: seo?.twitterTitle || title,
          description: seo?.twitterDescription || desc,
          images: seo?.twitterImage ? [seo.twitterImage] : (service.image ? [service.image] : undefined),
        }
      };
    }
  } catch (e) {
    console.error("Metadata Service lookup error:", e);
  }

  // 2. Check if it matches an SEO Landing Page
  try {
    const landing = await prisma.seoLandingPage.findUnique({ where: { slug } });
    if (landing && (landing.status === "PUBLISHED" || isPreview)) {
      const seo = await prisma.sEOSettings.findFirst({
        where: { pageType: "SEO_LANDING", pageId: landing.id }
      });

      const title = seo?.title || landing.seoTitle || landing.title;
      const desc = seo?.description || landing.metaDescription || landing.intro;
      const canonical = seo?.canonicalUrl || landing.canonicalUrl || `https://art-visions.fr/${slug}`;
      const indexable = seo?.indexable !== undefined ? seo.indexable : landing.indexable;
      const follow = seo?.follow !== undefined ? seo.follow : true;
      const ogImg = seo?.ogImage || landing.ogImage || undefined;

      return {
        title,
        description: desc,
        alternates: {
          canonical,
          languages: {
            "fr-FR": canonical,
            "en-US": canonical.replace("art-visions.fr", "art-visions.fr/en"),
            "ar-AE": canonical.replace("art-visions.fr", "art-visions.fr/ar")
          }
        },
        robots: {
          index: indexable,
          follow,
        },
        openGraph: {
          title: seo?.ogTitle || title,
          description: seo?.ogDescription || desc,
          images: ogImg ? [{ url: ogImg }] : undefined,
          url: `https://art-visions.fr/${slug}`,
          type: "website"
        },
        twitter: {
          card: "summary_large_image",
          title: seo?.twitterTitle || title,
          description: seo?.twitterDescription || desc,
          images: seo?.twitterImage ? [seo.twitterImage] : (ogImg ? [ogImg] : undefined),
        }
      };
    }
  } catch (e) {
    console.error("Metadata Landing Page lookup error:", e);
  }

  // 3. Fallback check for custom page/slug overrides directly in SEOSettings
  try {
    const customSeo = await prisma.sEOSettings.findFirst({
      where: { slug }
    });
    if (customSeo) {
      return {
        title: customSeo.title || undefined,
        description: customSeo.description || undefined,
        alternates: {
          canonical: customSeo.canonicalUrl || `https://art-visions.fr/${slug}`,
        },
        robots: {
          index: customSeo.indexable,
          follow: customSeo.follow,
        },
        openGraph: {
          title: customSeo.ogTitle || customSeo.title || undefined,
          description: customSeo.ogDescription || customSeo.description || undefined,
          images: customSeo.ogImage ? [{ url: customSeo.ogImage }] : undefined,
          url: `https://art-visions.fr/${slug}`,
          type: "website"
        },
        twitter: {
          card: "summary_large_image",
          title: customSeo.twitterTitle || customSeo.title || undefined,
          description: customSeo.twitterDescription || customSeo.description || undefined,
          images: customSeo.twitterImage ? [customSeo.twitterImage] : undefined,
        }
      };
    }
  } catch (e) {
    console.error("Metadata fallback slug lookup error:", e);
  }

  return {
    title: `${slug.replace(/-/g, " ")} | Art Vision`,
    description: "Art Vision, agence de communication visuelle premium en France."
  };
}

export default async function DynamicSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();

  const page = await prisma.page.findUnique({ where: { slug } });
  if (page && ((page.status === "PUBLISHED" && page.isActive) || isPreview)) {
    return (
      <main className="min-h-screen bg-brand-navy pt-32 pb-20">
        {isPreview && (
          <div className="fixed inset-x-0 top-0 z-50 bg-brand-orange px-4 py-2 text-center text-xs font-bold text-white">
            Mode aperçu actif
          </div>
        )}
        <article className="mx-auto max-w-5xl px-4 sm:px-6">
          <nav className="mb-8 text-xs text-white/50">
            <Link href="/" className="hover:text-brand-magenta">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{page.title}</span>
          </nav>
          <header className="mb-12 border-b border-brand-purple/20 pb-10">
            <h1 className="text-4xl font-extrabold leading-tight text-white md:text-6xl">{page.title}</h1>
            {page.excerpt && <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">{page.excerpt}</p>}
          </header>
          <RichContent contentJson={page.contentJson} contentHtml={page.contentHtml} />
        </article>
      </main>
    );
  }

  // 1. Try Service Page
  let service: any = null;
  try {
    service = await prisma.service.findUnique({
      where: { slug },
      include: { packages: true, faqs: true }
    });
  } catch (e) {
    console.error("Service fetch error:", e);
  }

  if (service && (service.status === "PUBLISHED" || isPreview)) {
    const benefitsList = service.benefits.split(";").filter((b: string) => b.trim() !== "");
    const processList = service.process.split(";").filter((p: string) => p.trim() !== "");

    // Fetch companion SEO settings to check for custom JSON-LD
    let customSchema: string | null = null;
    try {
      const seoSettings = await prisma.sEOSettings.findFirst({
        where: { pageType: "SERVICE", pageId: service.id }
      });
      customSchema = seoSettings?.customJsonLd || null;
    } catch (e) {}

    // JSON-LD Schemas for Service
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://art-visions.fr" },
        { "@type": "ListItem", "position": 2, "name": service.name, "item": `https://art-visions.fr/${slug}` }
      ]
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": service.name,
      "description": service.description,
      "provider": {
        "@type": "Organization",
        "name": "Art Vision",
        "url": "https://art-visions.fr",
        "logo": "https://art-visions.fr/logo.png"
      }
    };

    const faqSchema = service.faqs.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": service.faqs.map((f: any) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    } : null;

    return (
      <div className="min-h-screen bg-brand-navy pt-32 pb-20 text-left">
        {/* Schema Markup Injection */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
        {customSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: customSchema }} />}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="text-xs text-white/50 mb-8 space-x-2 font-medium">
            <Link href="/" className="hover:text-brand-magenta transition">Accueil</Link>
            <span>/</span>
            <span className="text-white">{service.name}</span>
          </nav>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="bg-brand-purple/30 border border-brand-purple/40 text-brand-magenta text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Prestation Premium
              </span>
              <h1 className="text-4xl md:text-5xl font-sora font-extrabold tracking-tight text-white leading-tight">
                {service.seoTitle || `Prestation : ${service.name}`}
              </h1>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                {service.description}
              </p>
              <div className="pt-2">
                <Link
                  href={`/devis-sur-mesure?service=${encodeURIComponent(service.name)}`}
                  data-tracking="devis_click"
                  className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-3.5 rounded-full font-bold text-sm transition"
                >
                  Démarrer votre projet
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 aspect-[4/3] bg-[#1A1238]/40 rounded-2xl overflow-hidden border border-brand-purple/15">
              {service.image ? (
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 font-sora text-2xl font-bold bg-gradient-dark">
                  ART VISION
                </div>
              )}
            </div>
          </div>

          {/* Details & Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20 border-t border-brand-purple/15 pt-16">
            <div className="lg:col-span-7 space-y-4 text-left">
              <h2 className="font-sora font-bold text-2xl text-white">Pourquoi nous faire confiance ?</h2>
              <p className="text-sm text-white/75 leading-relaxed">{service.detailedBody}</p>
            </div>
            
            <div className="lg:col-span-5 bg-[#1A1238]/40 border border-brand-purple/15 p-6 rounded-2xl text-left space-y-4">
              <h3 className="font-sora font-semibold text-sm text-white uppercase tracking-wider text-brand-magenta">Avantages Clés</h3>
              <ul className="text-xs space-y-3 text-white/80">
                {benefitsList.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <Check size={14} className="text-brand-orange shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Process Section */}
          <div className="mb-20 space-y-8 border-t border-brand-purple/15 pt-16 text-center">
            <h2 className="font-sora font-bold text-2xl text-white">Notre processus créatif</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {processList.map((step: string, idx: number) => (
                <div key={idx} className="bg-[#1A1238]/20 border border-brand-purple/15 p-5 rounded-xl text-left space-y-2 relative">
                  <span className="text-2xl font-sora font-extrabold text-brand-purple/25 absolute top-3 right-3">0{idx + 1}</span>
                  <h4 className="font-sora font-bold text-xs text-white pt-4">{step.split(" & ")[0]}</h4>
                  <p className="text-[11px] text-white/60">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Packages */}
          {service.packages.length > 0 && (
            <div className="mb-20 space-y-12 border-t border-brand-purple/15 pt-16 text-center">
              <h2 className="font-sora font-bold text-2xl text-white">Nos Tarifs & Formules</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {service.packages.map((pkg: any) => {
                  const feats = pkg.features.split(";").filter((f: string) => f.trim() !== "");
                  return (
                    <div
                      key={pkg.id}
                      className="glassmorphism rounded-2xl p-6 border border-brand-purple/20 hover:border-brand-magenta/30 transition flex flex-col justify-between text-left space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="font-sora font-extrabold text-lg text-white">{pkg.name}</h3>
                        <p className="text-2xl font-sora font-black text-brand-orange">{pkg.price}</p>
                      </div>
                      <ul className="text-xs space-y-2 text-white/70 flex-1">
                        {feats.map((f: string, i: number) => (
                          <li key={i} className="flex items-center space-x-2">
                            <Check size={12} className="text-brand-magenta shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/devis-sur-mesure?service=${encodeURIComponent(service.name)}&package=${encodeURIComponent(pkg.name)}`}
                        data-tracking="devis_click"
                        className="block text-center bg-brand-orange hover:bg-brand-orange/95 text-white text-xs font-semibold py-3 rounded-lg transition"
                      >
                        Commander
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FAQs */}
          {service.faqs.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-8 border-t border-brand-purple/15 pt-16 text-left">
              <h2 className="font-sora font-bold text-2xl text-white text-center">Questions fréquentes</h2>
              <div className="space-y-4">
                {service.faqs.map((faq: any) => (
                  <div key={faq.id} className="glassmorphism rounded-xl p-5 border border-brand-purple/15 space-y-2">
                    <h4 className="font-sora font-semibold text-sm text-white flex items-start space-x-2">
                      <HelpCircle size={16} className="text-brand-magenta shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs text-white/70 pl-6 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Try Database SEO Landing Page
  let landingPage: any = null;
  try {
    landingPage = await prisma.seoLandingPage.findUnique({
      where: { slug }
    });
  } catch (e) {
    console.error("Landing page fetch error:", e);
  }

  if (landingPage && (landingPage.status === "PUBLISHED" || isPreview)) {
    const isLocal = landingPage.pageType === "LOCAL";
    const cityLabel = landingPage.city || "France";
    const parsedFAQs = landingPage.faq ? JSON.parse(landingPage.faq) : [];
    
    // Fetch related projects
    let relatedProjects: any[] = [];
    if (landingPage.relatedPortfolio) {
      const slugs = landingPage.relatedPortfolio.split(",").map((s: string) => s.trim());
      try {
        relatedProjects = await prisma.portfolioProject.findMany({
          where: { slug: { in: slugs } },
          include: { category: true }
        });
      } catch (e) {}
    }

    // Fetch related services
    let relatedServicesList: any[] = [];
    if (landingPage.relatedServices) {
      const slugs = landingPage.relatedServices.split(",").map((s: string) => s.trim());
      try {
        relatedServicesList = await prisma.service.findMany({
          where: { slug: { in: slugs } }
        });
      } catch (e) {}
    }

    // Fetch Testimonials for local trust building
    let localTestimonials: any[] = [];
    try {
      localTestimonials = await prisma.testimonial.findMany({ take: 3 });
    } catch (e) {}

    // Fetch companion SEO settings to check for custom JSON-LD
    let customSchema: string | null = null;
    try {
      const seoSettings = await prisma.sEOSettings.findFirst({
        where: { pageType: "SEO_LANDING", pageId: landingPage.id }
      });
      customSchema = seoSettings?.customJsonLd || null;
    } catch (e) {}

    // Dynamic JSON-LD Schemas for Landing Page
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://art-visions.fr" },
        { "@type": "ListItem", "position": 2, "name": landingPage.title, "item": `https://art-visions.fr/${slug}` }
      ]
    };

    const localBusinessSchema = isLocal ? {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `Art Vision - ${cityLabel}`,
      "image": "https://art-visions.fr/logo.png",
      "telephone": "+33 2 43 00 00 00",
      "email": "contact@art-visions.fr",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "5 Rue de Constantine",
        "addressLocality": cityLabel,
        "postalCode": "72000",
        "addressCountry": "FR"
      }
    } : null;

    const faqSchema = parsedFAQs.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": parsedFAQs.map((f: any) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    } : null;

    return (
      <div className="min-h-screen bg-brand-navy pt-32 pb-20 text-left">
        {/* Dynamic Schema Injection */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {localBusinessSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />}
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
        {customSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: customSchema }} />}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Breadcrumbs */}
          <nav className="text-xs text-white/50 space-x-2 font-medium">
            <Link href="/" className="hover:text-brand-magenta transition">Accueil</Link>
            <span>/</span>
            <span className="text-white">{landingPage.title}</span>
          </nav>

          {/* Hero Header block */}
          <div className="space-y-6">
            <span className="bg-brand-purple/30 border border-brand-purple/40 text-brand-orange text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              {isLocal ? `Expertise Locale ${cityLabel}` : "Expertise Nationale France"}
            </span>
            <h1 className="text-3xl md:text-5xl font-sora font-extrabold tracking-tight text-white leading-tight">
              {landingPage.h1}
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-3xl">
              {landingPage.intro}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/devis-sur-mesure"
                data-tracking="devis_click"
                className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-brand-orange/15"
              >
                Demander un devis
              </Link>
              <Link
                href="#portfolio"
                data-tracking="portfolio_click"
                className="bg-white/10 hover:bg-white/20 border border-white/15 text-white px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition"
              >
                Voir nos réalisations
              </Link>
            </div>
          </div>

          {/* Long Copy Copywriting Content Block */}
          <div 
            className="prose prose-invert max-w-none text-white/85 text-sm md:text-base leading-relaxed space-y-6 pt-8 border-t border-brand-purple/15"
            dangerouslySetInnerHTML={{ __html: landingPage.content }}
          />

          {/* Related Portfolio Projects */}
          {relatedProjects.length > 0 && (
            <div id="portfolio" className="space-y-6 pt-12 border-t border-brand-purple/15">
              <h2 className="font-sora font-bold text-xl text-white">Nos réalisations associées</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedProjects.map((project: any) => (
                  <Link
                    key={project.id}
                    href={`/portfolio/${project.slug}`}
                    data-tracking="portfolio_click"
                    className="group block bg-[#1A1238]/40 border border-brand-purple/10 rounded-2xl overflow-hidden hover:border-brand-magenta/40 transition-all duration-300"
                  >
                    <div className="aspect-[16/10] bg-brand-purple/20 overflow-hidden relative">
                      <img
                        src={project.images.split(";")[0]}
                        alt={project.title}
                        title={project.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 text-left">
                      <span className="text-brand-magenta text-[10px] font-bold uppercase tracking-wider">{project.category.name}</span>
                      <h3 className="font-sora font-bold text-sm text-white group-hover:text-brand-orange transition mt-1">{project.title}</h3>
                      <p className="text-xs text-white/60 line-clamp-1 mt-1">{project.objective}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Localized SEO Google Maps Block */}
          {isLocal && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-brand-purple/15 items-center">
              <div className="space-y-4">
                <h3 className="font-sora font-bold text-lg text-white">Notre Agence au Service de {cityLabel}</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Chef de projet dédié pour cadrer votre plan de communication {cityLabel}. Nous nous déplaçons dans vos bureaux ou organisons des visioconférences sous 24 heures pour concevoir vos chartes visuelles, packshots 3D et imprimés publicitaires.
                </p>
                <div className="space-y-2 text-xs text-white/80">
                  <p className="flex items-center space-x-2"><MapPin size={14} className="text-brand-magenta" /><span>5 Rue de Constantine, {cityLabel}</span></p>
                  <p className="flex items-center space-x-2"><Phone size={14} className="text-brand-purple" /><span>+33 2 43 00 00 00</span></p>
                  <p className="flex items-center space-x-2"><Mail size={14} className="text-brand-orange" /><span>contact@art-visions.fr</span></p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-brand-purple/20 h-56 relative">
                <iframe
                  title={`Google Maps Art Vision ${cityLabel}`}
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2667.6534571932915!2d0.19830501177695328!3d48.00114097123616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e28f32145b23d9%3A0xe543df5e900c3cd!2s5%20Rue%20de%20Constantine%2C%2072000%20Le%20Mans!5e0!3m2!1sfr!2sfr!4v1718182283921!5m2!1sfr!2sfr`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          )}

          {/* Testimonials */}
          {localTestimonials.length > 0 && (
            <div className="pt-12 border-t border-brand-purple/15 space-y-6">
              <h2 className="font-sora font-bold text-xl text-white">Ils font confiance à Art Vision</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {localTestimonials.map((t: any) => (
                  <div key={t.id} className="bg-[#1A1238]/40 border border-brand-purple/10 rounded-2xl p-5 text-left">
                    <p className="text-xs text-white/75 italic leading-relaxed mb-4">« {t.message} »</p>
                    <strong className="text-xs text-white block">{t.name}</strong>
                    <span className="text-[10px] text-white/50">{t.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs section */}
          {parsedFAQs.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-brand-purple/15">
              <h3 className="font-sora font-bold text-xl text-white text-center">Foire Aux Questions</h3>
              <div className="space-y-4 max-w-3xl mx-auto">
                {parsedFAQs.map((faq: any, idx: number) => (
                  <div key={idx} className="glassmorphism rounded-xl p-5 border border-brand-purple/15 space-y-2">
                    <h4 className="font-sora font-semibold text-sm text-white flex items-start space-x-2">
                      <HelpCircle size={16} className="text-brand-magenta shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs text-white/70 pl-6 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related internal links */}
          {relatedServicesList.length > 0 && (
            <div className="pt-8 border-t border-brand-purple/15 text-left space-y-3">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-magenta">Services Associés</h4>
              <div className="flex flex-wrap gap-2">
                {relatedServicesList.map(s => (
                  <Link
                    key={s.id}
                    href={`/${s.slug}`}
                    className="text-xs bg-[#1A1238]/60 border border-brand-purple/20 px-3 py-1.5 rounded-full hover:border-brand-magenta hover:text-white transition text-white/80"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Final Conversion CTA Callout */}
          <div className="glassmorphism rounded-3xl p-8 md:p-10 border border-brand-orange/30 text-center space-y-6 mt-12">
            <h3 className="font-sora font-bold text-2xl md:text-3xl text-white">Démarrer votre projet de {landingPage.keyword}</h3>
            <p className="text-sm text-white/70 max-w-xl mx-auto">Recevez une estimation tarifaire sur-mesure et un accompagnement créatif complet en 24h ouvrées.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/devis-sur-mesure"
                data-tracking="devis_click"
                className="bg-brand-orange hover:bg-brand-orange/95 text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition"
              >
                Parler de mon projet
              </Link>
              <Link
                href="/contact"
                data-tracking="contact_submit"
                className="bg-white/10 hover:bg-white/20 border border-white/15 text-white px-8 py-3 rounded-full font-semibold text-xs uppercase tracking-wider transition"
              >
                Nous Contacter
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Not Found fallback
  notFound();
}
