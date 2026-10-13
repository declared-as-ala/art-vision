import "dotenv/config";
import prisma from "../src/lib/prisma";

async function main() {
  console.log("Applying database updates...");

  // 1. Fix L'univers de Car's SEO title and description
  const carsRes = await prisma.portfolioProject.updateMany({
    where: { slug: "creation-logo-univers-de-cars" },
    data: {
      seoTitle: "Création de logo – L'univers de Car's | Logo & Identité - Art Vision",
      seoDescription: "Découvrez la création de logo et l'identité visuelle moderne réalisés pour L'univers de Car's par Art Vision.",
    },
  });
  console.log(`Updated L'univers de Car's: ${carsRes.count} records`);

  // 2. Vitarena video media
  const vitarenaRes = await prisma.portfolioProject.updateMany({
    where: { slug: "motion-design-publicite-vitarena" },
    data: {
      images: "/api/media/cmreyx6vl000804jnq2abv8ri/vitarena-spot-1.mp4;/api/media/cmreyxm65000904jnhjliti9a/vitarena-spot-2.mp4",
    },
  });
  console.log(`Updated Vitarena media URLs: ${vitarenaRes.count} records`);

  // Also update Media table records if they exist
  await prisma.media.updateMany({
    where: { id: "cmreyx6vl000804jnq2abv8ri" },
    data: { mimeType: "video/mp4", fileName: "vitarena-spot-1.mp4" },
  });
  await prisma.media.updateMany({
    where: { id: "cmreyxm65000904jnhjliti9a" },
    data: { mimeType: "video/mp4", fileName: "vitarena-spot-2.mp4" },
  });

  // 3. Site Settings phone, email, whatsapp
  try {
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        phone: "+32 490 22 49 05",
        whatsapp: "+32 490 22 49 05",
        email: "contact@art-visions.fr",
      },
      create: {
        id: "default",
        logo: "/logo-titre.svg",
        brandName: "Art Vision",
        slogan: "L'art au service de votre image.",
        primaryColor: "#08051F",
        secondaryColor: "#1A1238",
        accentColor: "#6C2BD9",
        creativeMagenta: "#D72888",
        orangeCta: "#FF6A00",
        softWhite: "#F8F7FC",
        lightGray: "#EDEAF5",
        textDark: "#171625",
        email: "contact@art-visions.fr",
        phone: "+32 490 22 49 05",
        whatsapp: "+32 490 22 49 05",
        franceAddress: "5 Rue de Constantine, 72000 Le Mans",
        tunisiaAddress: "Rue Salem Bchir, 5000 Monastir, Tunisie",
      },
    });
    console.log("Updated SiteSettings");
  } catch (e) {
    console.error("SiteSettings update error:", e);
  }

  // 4. Email Settings
  try {
    await prisma.emailSettings.upsert({
      where: { id: "default" },
      update: {
        primaryNotificationEmail: "contact@art-visions.fr",
        senderEmail: "contact@art-visions.fr",
      },
      create: {
        id: "default",
        primaryNotificationEmail: "contact@art-visions.fr",
        senderEmail: "contact@art-visions.fr",
        senderName: "Art Vision",
      },
    });
    console.log("Updated EmailSettings");
  } catch (e) {
    console.error("EmailSettings update error:", e);
  }

  // 5. SEO Settings robotsTxt
  try {
    await prisma.sEOSettings.upsert({
      where: { id: "default" },
      update: {
        robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://art-visions.fr/sitemap.xml",
      },
      create: {
        id: "default",
        robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://art-visions.fr/sitemap.xml",
      },
    });
    console.log("Updated SEOSettings robotsTxt");
  } catch (e) {
    console.error("SEOSettings update error:", e);
  }

  // 6. Fix "au Le Mans" -> "au Mans" in SeoLandingPage
  await prisma.seoLandingPage.updateMany({
    where: { slug: "agence-graphique-le-mans" },
    data: {
      title: "Agence graphique au Mans | Studio & Design - Art Vision",
      h1: "Votre Agence Graphique Professionnelle au Mans",
      metaDescription: "Art Vision conçoit vos chartes graphiques, logos, brochures et vidéos publicitaires au Mans. Studio créatif à taille humaine.",
    },
  });
  await prisma.seoLandingPage.updateMany({
    where: { slug: "graphiste-le-mans" },
    data: {
      title: "Graphiste professionnel au Mans | Design unique - Art Vision",
      h1: "Graphiste Professionnel Indépendant au Mans",
      metaDescription: "Besoin d'un graphiste au Mans ? Création de logos vectoriels originaux, mise en page publicitaire et supports print sous 5 jours.",
    },
  });
  await prisma.seoLandingPage.updateMany({
    where: { slug: "impression-le-mans" },
    data: {
      title: "Impression publicitaire au Mans | Imprimerie locale - Art Vision",
      h1: "Imprimerie & Impression Publicitaire au Mans",
      metaDescription: "Impression locale au Mans pour flyers, bâches extérieures, panneaux de chantier et cartes de visite rigides. Devis express.",
    },
  });
  console.log("Updated Le Mans landing pages to 'au Mans'");

  // 7. Video service packages - clearly distinguish montage à partir de rushes fournis
  const videoService = await prisma.service.findFirst({
    where: { slug: "video-publicitaire" },
  });
  if (videoService) {
    const courtPkg = await prisma.pricingPackage.findFirst({
      where: { serviceId: videoService.id, name: { contains: "Court" } },
    });
    if (courtPkg) {
      await prisma.pricingPackage.update({
        where: { id: courtPkg.id },
        data: {
          name: "Montage vidéo (Rushes fournis)",
          features: "Montage à partir de vos rushes;Découpage dynamique;Titrage & sous-titres;Format vertical ou horizontal;Musique libre de droits",
        },
      });
      console.log("Updated video pricing package to clearly state 'Montage vidéo (Rushes fournis)'");
    }
  }

  console.log("All DB updates completed successfully!");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
