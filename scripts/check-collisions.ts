import prisma from "../src/lib/prisma";

async function main() {
  const slugs = [
    "pelliculage-mat-ou-brillant", "vernis-selectif-3d-carte-de-visite", "dorure-a-chaud-impression",
    "types-de-reliure-brochure", "pdf-x4-impression", "noir-riche-impression", "papier-couche-ou-offset",
    "impression-petite-quantite", "depliant-2-volets-3-volets", "bon-a-tirer-imprimerie",
    "declinaisons-logo", "logo-monochrome", "logo-responsive", "lancement-nouvelle-identite-visuelle",
    "identite-visuelle-entreprise-b2b", "types-de-logo-entreprise", "architecture-de-marque-visuelle",
    "identite-visuelle-packaging", "identite-visuelle-premium", "fichier-logo-enseigne",
    "carte-boissons-cafe", "creer-menu-brunch", "design-carte-des-vins", "menu-a-emporter-imprime",
    "vitrophanie-magasin", "design-enseigne-magasin", "affiche-soldes-magasin", "packaging-boulangerie",
    "carte-fidelite-papier-ou-digitale", "signaletique-magasin-interieur",
    "nombre-pages-site-vitrine", "site-one-page-ou-multipage", "page-a-propos-entreprise",
    "formulaire-demande-de-devis", "creer-portfolio-professionnel", "photos-site-internet-entreprise",
    "site-vitrine-reservation-en-ligne", "page-service-site-web", "preparer-contenu-site-internet",
    "parcours-contact-site-web",
    "tarif-motion-design-entreprise", "storyboard-publicite", "video-produit-ou-animation-3d",
    "packshot-3d-produit", "animation-logo-entreprise", "formats-video-entreprise",
    "cgi-publicitaire", "brief-video-publicitaire", "fichiers-rendu-3d-produit", "video-explicative-animee"
  ];

  const existing = await prisma.blogPost.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true }
  });

  console.log("Total candidate slugs:", slugs.length);
  console.log("Existing matching slugs:", existing.length);
  if (existing.length > 0) {
    console.log("Collisions:", existing.map(e => e.slug));
  } else {
    console.log("ZERO collisions! All 50 topics are completely fresh and distinct!");
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
