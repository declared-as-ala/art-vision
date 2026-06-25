import bcrypt from "bcryptjs";
import { makePrisma } from "./seed-client";

const prisma = makePrisma();

async function main() {
  console.log("Seeding database...");

  // 1. Create Default Admin User
  const adminPasswordHash = bcrypt.hashSync("admin123", 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@artvision.fr" },
    update: {},
    create: {
      email: "admin@artvision.fr",
      name: "Art Vision Super Admin",
      password: adminPasswordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Admin seeded:", superAdmin.email);

  // 2. Create Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      logo: "/logo.svg",
      primaryColor: "#2D2966",
      accentColor: "#6348E5",
      creativeMagenta: "#BA3184",
      orangeCta: "#CD7942",
      softWhite: "#EDEDED",
      email: "contact2artvision@gmail.com",
      phone: "+216 55 804 227",
      whatsapp: "+32 490 22 49 05",
      franceAddress: "5 Rue de Constantine, 72000 Le Mans",
      tunisiaAddress: "Rue Salem Bchir, 5000 Monastir, Tunisie",
    },
    create: {
      id: "default",
      logo: "/logo.svg",
      brandName: "Art Vision",
      slogan: "L’art au service de votre image.",
      primaryColor: "#2D2966",
      secondaryColor: "#1A1238",
      accentColor: "#6348E5",
      creativeMagenta: "#BA3184",
      orangeCta: "#CD7942",
      softWhite: "#EDEDED",
      lightGray: "#EDEAF5",
      textDark: "#171625",
      socialFb: "https://facebook.com/artvision",
      socialIg: "https://instagram.com/artvision",
      socialIn: "https://linkedin.com/company/artvision",
      email: "contact2artvision@gmail.com",
      phone: "+216 55 804 227",
      whatsapp: "+32 490 22 49 05",
      franceAddress: "5 Rue de Constantine, 72000 Le Mans",
      tunisiaAddress: "Rue Salem Bchir, 5000 Monastir, Tunisie",
      googleAnalyticsId: "G-XXXXXXXXXX",
      googleTagManagerId: "GTM-XXXXXXX",
      searchConsoleVerification: "",
    },
  });
  console.log("SiteSettings seeded.");

  // 3. Create SEO Default Settings
  await prisma.sEOSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      globalTitle: "Art Vision | Agence de communication visuelle en France",
      globalDesc: "Art Vision est un studio graphique et créatif spécialisé en identité visuelle, création logo, vidéo, 3D, motion design et impression.",
      googleSearchCons: "",
    },
  });
  console.log("SEOSettings seeded.");

  // 4. Create Services
  const servicesData = [
    {
      slug: "identite-visuelle",
      name: "Identité visuelle",
      icon: "Palette",
      image: "/images/services/identite-visuelle.jpg",
      description: "Création d’une image unique, cohérente et mémorable pour votre marque.",
      detailedBody: "Votre image de marque est le reflet de vos valeurs. Nous concevons des chartes graphiques complètes comprenant la typographie, la palette de couleurs et les règles d'utilisation de votre logo sur tous vos supports physiques et numériques.",
      benefits: "Cohérence de marque;Image de marque premium;Confiance client accrue;Reconnaissance immédiate",
      process: "Analyse du besoin & Audit;Recherches créatives;Propositions de chartes;Validation & Déclinaisons;Livraison des fichiers sources",
      seoTitle: "Création identité visuelle en France | Branding entreprise - Art Vision",
      seoDescription: "Art Vision crée des identités visuelles professionnelles pour entreprises, marques et indépendants : charte graphique, logo, couleurs, typographies et supports.",
      packages: {
        create: [
          { name: "Basic", price: "à partir de 70€", features: "Logo de base;Palette de couleurs;Règles typographiques de base;Livrables web (PNG, JPG)" },
          { name: "Standard", price: "à partir de 120€", features: "Logo principal & secondaire;Charte graphique PDF;Templates réseaux sociaux;Livrables haute définition (SVG, PDF)" },
          { name: "Premium", price: "à partir de 160€", features: "Branding complet;Supports de marque (carte de visite, papier en-tête);Templates éditables Canva;Fichiers sources complets (AI, PSD)" }
        ]
      },
      faqs: {
        create: [
          { question: "Qu'est-ce qu'une charte graphique ?", answer: "Une charte graphique est un document contenant l'ensemble des règles d'utilisation des signes graphiques (logo, couleurs, typographies, déclinaisons) d'une entreprise." },
          { question: "Combien de temps prend la création d'une identité visuelle ?", answer: "En général, le processus complet prend entre 1 et 3 semaines selon les retours et les ajustements." }
        ]
      }
    },
    {
      slug: "creation-logo-professionnel",
      name: "Conception logo",
      icon: "PenTool",
      image: "/images/services/conception-logo.jpg",
      description: "Un logo professionnel, distinctif et adapté à tous vos supports.",
      detailedBody: "Un logo de qualité supérieure doit être intemporel et fonctionnel. Nos designers dessinent des logos vectoriels uniques adaptés aux impressions géantes ainsi qu'aux favicons d'applications mobiles.",
      benefits: "Vectoriel haute définition;Unique & sur-mesure;Mémorisable par votre cible;Utilisable sur tous supports",
      process: "Brief créatif;Planche de tendances;Création de concepts;Ajustements & retours;Livrables finaux",
      seoTitle: "Création logo professionnel en France | Logo entreprise - Art Vision",
      seoDescription: "Création de logo professionnel pour entreprises, startups, restaurants, boutiques, marques et indépendants en France.",
      packages: {
        create: [
          { name: "Basic Logo", price: "à partir de 50€", features: "2 concepts originaux;1 révision;Fichiers PNG transparents" },
          { name: "Standard Logo", price: "à partir de 95€", features: "4 concepts originaux;3 révisions;Fichiers SVG/Vectoriels" },
          { name: "Premium Logo", price: "à partir de 140€", features: "Concepts illimités;Révisions illimitées;Fichiers sources complets (.AI);Déclinaisons de couleurs" }
        ]
      },
      faqs: {
        create: [
          { question: "Fournissez-vous les fichiers vectoriels ?", answer: "Oui, tous nos logos standards et premiums sont livrés aux formats vectoriels (SVG, PDF, AI)." },
          { question: "Puis-je modifier mon logo après livraison ?", answer: "Tout à fait, en possédant les fichiers sources (.AI), vous pourrez faire des modifications dans le futur." }
        ]
      }
    },
    {
      slug: "design-graphique",
      name: "Projet graphique",
      icon: "Layout",
      image: "/images/services/projet-graphique.jpg",
      description: "Supports visuels modernes pour vos campagnes, réseaux sociaux et documents commerciaux.",
      detailedBody: "De la conception d'affiches publicitaires au design de brochures de vente haut de gamme, nous mettons notre expertise créative au service de vos supports de communication.",
      benefits: "Design moderne;Mise en page aérée;Optimisé pour la conversion;Adapté à votre charte",
      process: "Brief & Textes;Mise en page initiale;Ajustements graphiques;Validation;Export",
      seoTitle: "Design graphique en France | Création visuelle professionnelle - Art Vision",
      seoDescription: "Création de supports graphiques professionnels pour communication, publicité, réseaux sociaux, catalogues, affiches et campagnes visuelles.",
      packages: {
        create: [
          { name: "Visuels RS", price: "à partir de 45€", features: "3 gabarits de posts;Format Story et Carré;Fichiers JPG de haute qualité" },
          { name: "Support Unique", price: "à partir de 80€", features: "Flyer ou affiche A4;Mise en page professionnelle;Fichier prêt pour l'impression" },
          { name: "Catalogue/Brochure", price: "à partir de 200€", features: "Mise en page multi-pages;Jusqu'à 8 pages;Export interactif & print" }
        ]
      },
      faqs: {
        create: [
          { question: "De quoi avez-vous besoin pour démarrer ?", answer: "Nous avons besoin de votre logo, de votre charte graphique (si disponible), des textes à inclure et de vos directives visuelles." }
        ]
      }
    },
    {
      slug: "impression-publicitaire",
      name: "Impression",
      icon: "Printer",
      image: "/images/services/impression.jpg",
      description: "Supports imprimés de haute qualité pour flyers, affiches, bâches, catalogues, panneaux et cartes de visite.",
      detailedBody: "Nous gérons toute la chaîne de production : choix du papier (grammage, vernis), vérification des zones de sécurité, colorimétrie CMJN et livraison directe de vos supports imprimés à vos bureaux.",
      benefits: "Papier premium;Finition soignée (mat/brillant);Vérification pré-presse gratuite;Livraison rapide",
      process: "Choix du support & options;Vérification du fichier de création;Impression en atelier;Contrôle qualité;Expédition",
      seoTitle: "Impression publicitaire en France | Flyers, affiches, bâches, cartes - Art Vision",
      seoDescription: "Art Vision propose des services d’impression publicitaire pour flyers, affiches, bâches, panneaux, catalogues, cartes de visite et supports grand format.",
      packages: {
        create: [
          { name: "Pack Cartes de Visite", price: "à partir de 35€", features: "250 exemplaires;Papier 350g couché demi-mat;Impression recto/verso" },
          { name: "Pack Flyers", price: "à partir de 50€", features: "500 exemplaires A5;Papier 135g brillant;Impression recto/verso" },
          { name: "Pack Grand Format", price: "à partir de 90€", features: "Bâche publicitaire 2x1m;Œillets inclus;Résistant aux intempéries" }
        ]
      },
      faqs: {
        create: [
          { question: "Quels sont vos délais de livraison ?", answer: "La livraison prend généralement 3 à 5 jours ouvrés après la validation du Bon À Tirer (BAT)." }
        ]
      }
    },
    {
      slug: "video-publicitaire",
      name: "Projet vidéo",
      icon: "Video",
      image: "/images/services/video.jpg",
      description: "Vidéos impactantes pour présenter votre marque, vos produits ou vos services.",
      detailedBody: "Le contenu vidéo est le format le plus captivant du web. Nous réalisons des tournages, des montages professionnels et du color grading pour vos spots publicitaires et vidéos institutionnelles.",
      benefits: "Montage rythmé;Qualité cinéma/4K;Storytelling captivant;Sous-titres intégrés",
      process: "Écriture du script;Tournage / Captation;Dérushage & Montage;Étalonnage & Sound design;Livraison MP4/ProRes",
      seoTitle: "Vidéo publicitaire en France | Montage vidéo & vidéo corporate - Art Vision",
      seoDescription: "Création de vidéos publicitaires, vidéos corporate, montages vidéo et contenus vidéo pour entreprises et marques.",
      packages: {
        create: [
          { name: "Format Court (Reels/TikTok)", price: "à partir de 90€", features: "Jusqu'à 60 secondes;Format vertical;Montage dynamique;Sous-titres automatiques" },
          { name: "Vidéo Promo (Web)", price: "à partir de 250€", features: "Jusqu'à 2 minutes;Scénarisation;Musique libre de droits;Habillage graphique simple" },
          { name: "Vidéo Corporate Premium", price: "à partir de 600€", features: "Vidéo d'entreprise complète;Interview & B-roll;Habillage motion design;Mixage audio professionnel" }
        ]
      },
      faqs: {
        create: [
          { question: "Proposez-vous des voix-off ?", answer: "Oui, nous pouvons intégrer des voix-off professionnelles masculines ou féminines (français, anglais, arabe) en option." }
        ]
      }
    },
    {
      slug: "motion-design",
      name: "Motion design",
      icon: "Sparkles",
      image: "/images/services/motion-design.jpg",
      description: "Animations dynamiques pour capter l’attention et renforcer votre communication.",
      detailedBody: "Expliquez des concepts complexes en quelques secondes grâce à l'animation graphique 2D. Nous créons des infographies animées et des logos animés haut de gamme.",
      benefits: "Forte mémorisation;Animation fluide;Clarté pédagogique;Adapté à tous les écrans",
      process: "Script & Storyboard;Illustration des assets;Animation;Sound design & Bruitages;Export final",
      seoTitle: "Motion design en France | Animation vidéo professionnelle - Art Vision",
      seoDescription: "Création de motion design, animation vidéo, habillage graphique, vidéos explicatives et animations publicitaires.",
      packages: {
        create: [
          { name: "Logo Animé", price: "à partir de 60€", features: "Animation de logo existant;Format web & transparent;Durée 3-5 secondes" },
          { name: "Vidéo Explicative 30s", price: "à partir de 180€", features: "Script fourni;Illustrations vectorielles;Animation fluide;Musique de fond" },
          { name: "Motion Premium 1min", price: "à partir de 390€", features: "Storyboard sur-mesure;Illustrations complexes;Voix-off professionnelle;Sound design complet" }
        ]
      },
      faqs: {
        create: [
          { question: "Qu'est-ce qu'un storyboard ?", answer: "Le storyboard est une bande dessinée schématisant les scènes de la future vidéo afin de valider le visuel avant l'animation." }
        ]
      }
    },
    {
      slug: "modelisation-3d-rendu-produit",
      name: "3D & Design produit",
      icon: "Box",
      image: "/images/services/3d.jpg",
      description: "Modélisation 3D, rendu produit, packshot 3D, visualisation 3D et CGI publicitaire.",
      detailedBody: "Présentez vos produits sous leur meilleur jour grâce à des rendus photoréalistes. Modélisation CAO, packshots pour e-commerce et animations 3D pour campagnes publicitaires.",
      benefits: "Rendus photoréalistes;Aucun studio photo requis;Modifications d'angles infinies;Qualité studio premium",
      process: "Plans 2D / Photos du produit;Modélisation 3D filaire;Application des textures/matériaux;Mise en lumière studio;Calcul du rendu haute définition",
      seoTitle: "Modélisation 3D & rendu produit en France | CGI & packshot 3D - Art Vision",
      seoDescription: "Création de modélisation 3D, rendu 3D produit, animation 3D, visualisation 3D, CGI publicitaire et packshot 3D.",
      packages: {
        create: [
          { name: "Packshot Produit Simple", price: "à partir de 80€", features: "1 rendu haute définition;Fond blanc uni;Textures réalistes standard" },
          { name: "Rendu 3D Ambiance", price: "à partir de 150€", features: "Rendu dans un décor 3D;Éclairage studio personnalisé;3 angles de vue différents" },
          { name: "Animation 3D Produit", price: "à partir de 450€", features: "Vidéo 15s de rotation/éclaté;Textures complexes;Rendu 4K/Full HD" }
        ]
      },
      faqs: {
        create: [
          { question: "Quels fichiers devez-vous fournir pour une modélisation 3D ?", answer: "Des photos du produit sous tous les angles, ou des fichiers techniques CAO (STEP, IGES, OBJ)." }
        ]
      }
    },
    {
      slug: "creation-site-vitrine",
      name: "Site vitrine",
      icon: "Globe",
      image: "/images/services/site-vitrine.jpg",
      description: "Sites web élégants, rapides, responsive et optimisés pour convertir.",
      detailedBody: "Un site web moderne est le socle de votre réussite numérique. Nous développons des sites web vitrines sur-mesure rapides, sécurisés, optimisés pour Google et compatibles avec tous les smartphones.",
      benefits: "Super rapide & Sécurisé;Optimisé SEO de base;Interface UX/UI sur-mesure;Bouton WhatsApp flottant",
      process: "Maquettes UX/UI Figma;Développement Next.js / Tailwind;Intégration du CMS Admin;Phase de tests;Mise en ligne",
      seoTitle: "Création site vitrine en France | Site web professionnel - Art Vision",
      seoDescription: "Création de sites vitrines modernes, rapides, responsive et optimisés SEO pour entreprises, indépendants et marques.",
      packages: {
        create: [
          { name: "Landing Page", price: "à partir de 250€", features: "Page unique optimisée;Formulaire de contact;Design responsive;Optimisé SEO" },
          { name: "Site Vitrine Standard", price: "à partir de 490€", features: "Jusqu'à 5 pages;Dashboard d'administration;Intégration réseaux sociaux;Hébergement sécurisé" },
          { name: "Site Vitrine Premium", price: "à partir de 950€", features: "Pages illimitées;Devis en ligne interactif;Multilingue (FR/EN/AR);Accompagnement SEO poussé" }
        ]
      },
      faqs: {
        create: [
          { question: "Le site sera-t-il modifiable ?", answer: "Oui, un espace d'administration sécurisé vous permet de modifier les textes, images et articles de blog sans coder." }
        ]
      }
    },
    {
      slug: "community-management",
      name: "Community management",
      icon: "Users",
      image: "/images/services/community-management.jpg",
      description: "Gestion et animation professionnelle de vos réseaux sociaux.",
      detailedBody: "Engagez vos abonnés et développez votre visibilité. Nous gérons votre planning éditorial, la rédaction des légendes, le design de vos visuels et l'interaction avec votre communauté.",
      benefits: "Présence active garantie;Contenus professionnels;Gain de temps;Rapports mensuels de performance",
      process: "Audit réseaux sociaux;Définition de la charte éditoriale;Création du calendrier de publication;Création graphique des posts;Planification & Modération",
      seoTitle: "Community management en France | Gestion réseaux sociaux - Art Vision",
      seoDescription: "Gestion de réseaux sociaux, création de contenu, planning éditorial et animation de communauté pour entreprises et marques.",
      packages: {
        create: [
          { name: "Essentiel", price: "à partir de 120€/mois", features: "1 publication par semaine;Instagram / Facebook;Rédaction des légendes;Rapport trimestriel" },
          { name: "Business", price: "à partir = 250€/mois", features: "3 publications par semaine;Gabarits graphiques inclus;Modération des commentaires;Rapport mensuel" },
          { name: "Premium Influence", price: "à partir de 450€/mois", features: "5 publications par semaine + Stories;Création de Reels/Vidéo;Gestion publicitaire (Meta Ads);Support 7j/7" }
        ]
      },
      faqs: {
        create: [
          { question: "Les budgets publicitaires sont-ils inclus ?", answer: "Non, les budgets publicitaires (Meta Ads) sont payés directement aux plateformes par le client." }
        ]
      }
    }
  ];

  for (const service of servicesData) {
    const { packages, faqs, ...rest } = service as any;
    const existing = await prisma.service.findUnique({ where: { slug: service.slug } });
    if (existing) {
      // Idempotent: refresh fields and fully reset nested packages/FAQs so they
      // don't accumulate as duplicates on every re-run / build.
      await prisma.service.update({ where: { slug: service.slug }, data: rest });
      await prisma.pricingPackage.deleteMany({ where: { serviceId: existing.id } });
      await prisma.fAQ.deleteMany({ where: { serviceId: existing.id } });
      if (packages?.create) {
        for (const p of packages.create) await prisma.pricingPackage.create({ data: { ...p, serviceId: existing.id } });
      }
      if (faqs?.create) {
        for (const f of faqs.create) await prisma.fAQ.create({ data: { ...f, serviceId: existing.id } });
      }
    } else {
      await prisma.service.create({ data: service });
    }
  }
  console.log("Services seeded successfully.");

  // 5. Create Portfolio Categories
  const logoCat = await prisma.portfolioCategory.upsert({
    where: { slug: "logo" },
    update: { name: "Logo" },
    create: { name: "Logo", slug: "logo" },
  });
  const brandingCat = await prisma.portfolioCategory.upsert({
    where: { slug: "identite-visuelle" },
    update: { name: "Identité visuelle" },
    create: { name: "Identité visuelle", slug: "identite-visuelle" },
  });
  const designCat = await prisma.portfolioCategory.upsert({
    where: { slug: "design-graphique" },
    update: { name: "Design graphique" },
    create: { name: "Design graphique", slug: "design-graphique" },
  });
  const videoCat = await prisma.portfolioCategory.upsert({
    where: { slug: "video" },
    update: { name: "Vidéo" },
    create: { name: "Vidéo", slug: "video" },
  });
  const cgiCat = await prisma.portfolioCategory.upsert({
    where: { slug: "3d" },
    update: { name: "3D" },
    create: { name: "3D", slug: "3d" },
  });
  void logoCat;
  void designCat;
  void videoCat;

  // Seed Projects
  const portfolioProjects = [
    {
      title: "Identité Visuelle OléaPure",
      slug: "oleapure-branding",
      client: "OléaPure SAS",
      industry: "Cosmétique bio",
      objective: "Créer un branding écologique et ultra-premium pour une marque d'huiles de beauté bio.",
      challenge: "Se démarquer sur un marché saturé de la beauté biologique tout en conservant des codes minimalistes et haut de gamme.",
      solution: "Développement d'un logo monogramme raffiné fusionnant une goutte d'huile et une feuille d'olivier. Palette de vert olive profond et dorure à chaud pour les packagings.",
      result: "Une augmentation de 45% des ventes en pharmacie dès le premier mois après le déploiement du nouveau design.",
      testimonial: "Art Vision a parfaitement capté l'essence de notre marque. Le nouveau packaging fait sensation !",
      testimonialAuthor: "Sophie Laurent",
      testimonialRole: "Fondatrice, OléaPure",
      images: "https://images.unsplash.com/photo-1608248597481-496100c8c836;https://images.unsplash.com/photo-1526947425960-945c6e72858f",
      categoryId: brandingCat.id,
      seoTitle: "Case study OléaPure | Branding cosmétique - Art Vision",
      seoDescription: "Découvrez comment Art Vision a conçu l'identité visuelle haut de gamme de la marque de cosmétique bio OléaPure.",
    },
    {
      title: "Production 3D TADAA!",
      slug: "tadaa-3d-packshot",
      client: "TADAA Studio",
      industry: "Boisson énergisante",
      objective: "Réaliser des packshots 3D photoréalistes et un spot publicitaire CGI pour le lancement d'une canette.",
      challenge: "Simuler la condensation et l'effet glacé sur le métal d'une canette de boisson de manière hyperréaliste.",
      solution: "Modélisation 3D complète sous Blender et rendu de particules pour l'effet de givre. Création d'une animation rythmée de 15 secondes avec habillage musical.",
      result: "Un spot publicitaire utilisé sur les réseaux sociaux ayant généré plus de 150 000 vues en organique.",
      testimonial: "Le rendu 3D est tellement réaliste qu'on croirait toucher la canette. Du grand art.",
      testimonialAuthor: "Thomas Dupuis",
      testimonialRole: "Directeur Marketing",
      images: "https://images.unsplash.com/photo-1527960659564-77b9ad9c97ab;https://images.unsplash.com/photo-1542751371-adc38448a05e",
      categoryId: cgiCat.id,
      seoTitle: "Rendu 3D TADAA! | CGI publicitaire - Art Vision",
      seoDescription: "Étude de cas du rendu produit 3D photoréaliste et CGI publicitaire réalisés pour la marque de boissons TADAA!.",
    },
  ];

  for (const project of portfolioProjects) {
    await prisma.portfolioProject.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  console.log("Portfolio projects seeded.");

  // 6. Create Blog Categories and Posts
  const designBlogCat = await prisma.blogCategory.upsert({
    where: { slug: "design-branding" },
    update: { name: "Design & Branding" },
    create: { name: "Design & Branding", slug: "design-branding" },
  });

  const legacyBlogPost = {
    title: "Comment créer une identité visuelle professionnelle ?",
    slug: "comment-creer-identite-visuelle-professionnelle",
    content: "Une identité visuelle forte est la clé du succès commercial. Elle permet de vous démarquer de la concurrence, d'accroître votre visibilité et d'installer une relation de confiance avec votre clientèle cible. Dans cet article, nous décortiquons les étapes clés d'un branding réussi : la recherche de concepts, le choix de la palette chromatique, l'utilisation cohérente des typographies et la rédaction d'une charte graphique solide...",
    featuredImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
    author: "Julien Dubosc (Lead Designer)",
    status: "PUBLISHED",
    tags: "Branding,Charte graphique,Design",
    readingTime: 6,
    categoryId: designBlogCat.id,
    seoTitle: "Comment créer une identité visuelle professionnelle ? | Blog Art Vision",
    seoDescription: "Découvrez les étapes indispensables pour concevoir une identité visuelle marquante pour votre marque ou entreprise.",
  };

  await prisma.blogPost.upsert({
    where: { slug: legacyBlogPost.slug },
    update: legacyBlogPost,
    create: legacyBlogPost,
  });

  console.log("Blog articles seeded.");

  // 7. Create Testimonials
  const testimonials = [
    {
      name: "Marc Antoine",
      role: "CEO de TechStart",
      rating: 5,
      message: "L'équipe d'Art Vision a su traduire nos idées techniques complexes en une vidéo motion design moderne et très pédagogique. Nos clients adorent !",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      displayOrder: 1,
    },
    {
      name: "Chloé Vautrin",
      role: "Fondatrice de Atelier Fleurs",
      rating: 5,
      message: "Mon nouveau logo et mes cartes de visite reçoivent des compliments quotidiens. Un professionnalisme remarquable du début à la livraison.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      displayOrder: 2,
    },
  ];

  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: testimonial.name, role: testimonial.role } });
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: testimonial });
    } else {
      await prisma.testimonial.create({ data: testimonial });
    }
  }

  console.log("Testimonials seeded.");

  // 8. Create CV and Business Card Templates
  const cvTemplates = [
    {
      id: "creative-agency",
      name: "Creative Agency",
      layout: JSON.stringify({ themeColor: "#D72888", accentColor: "#08051F", layout: "split" }),
      thumbnail: "/images/cv-templates/creative.jpg",
    },
    {
      id: "modern-tech",
      name: "Modern Tech",
      layout: JSON.stringify({ themeColor: "#6C2BD9", accentColor: "#171625", layout: "modern" }),
      thumbnail: "/images/cv-templates/tech.jpg",
    },
  ];

  for (const template of cvTemplates) {
    await prisma.cVTemplate.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
  }

  const businessCardTemplates = [
    {
      id: "modern-minimalist",
      name: "Modern Minimalist",
      layout: JSON.stringify({ theme: "minimalist", font: "Inter", primaryColor: "#08051F" }),
      thumbnail: "/images/card-templates/minimal.jpg",
    },
    {
      id: "creative-gradient",
      name: "Creative Gradient",
      layout: JSON.stringify({ theme: "gradient", font: "Sora", primaryColor: "#6C2BD9", secondaryColor: "#D72888" }),
      thumbnail: "/images/card-templates/creative.jpg",
    },
  ];

  for (const template of businessCardTemplates) {
    await prisma.businessCardTemplate.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
  }

  console.log("Templates seeded.");

  // 9. Seed Legal Pages (idempotent — upsert by slug)
  const legalPages = [
    {
      slug: "mentions-legales",
      title: "Mentions Légales",
      contentHtml: "<section><h2>Édition du site</h2><p><strong>SAS ART VISION</strong></p><p>5 Rue de Constantine, 72000 Le Mans, France</p><p>contact@art-visions.fr</p><p>Capital social : 10 000 € — RCS Le Mans 921 234 567 — TVA intracommunautaire : FR 92 921234567</p></section><section><h2>Directeur de la publication</h2><p>Ala Eddine Ben Salem, Président de SAS ART VISION.</p></section><section><h2>Hébergement</h2><p>Ce site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p></section><section><h2>Propriété intellectuelle</h2><p>L’ensemble des contenus présents sur le site art-visions.fr (textes, graphismes, logos, images, vidéos, icônes) est protégé par le droit d’auteur et reste la propriété exclusive de SAS ART VISION.</p></section><section><h2>Responsabilité</h2><p>SAS ART VISION s’efforce d’assurer l’exactitude des informations diffusées. Nous ne saurions être tenus responsables d’éventuelles erreurs, omissions ou indisponibilités temporaires du site.</p></section><section><h2>Contact</h2><p>Pour toute question : contact@art-visions.fr</p></section>",
      contentJson: JSON.stringify({ html: "<section>…</section>", blocks: [] }),
      status: "PUBLISHED",
      isActive: true,
      seoTitle: "Mentions Légales | Art Vision",
      seoDescription: "Mentions légales de SAS Art Vision – informations juridiques, siège social, directeur de publication et hébergeur.",
    },
    {
      slug: "politique-de-confidentialite",
      title: "Politique de Confidentialité",
      contentHtml: "<section><h2>1. Données collectées</h2><p>Dans le cadre de votre navigation, nous pouvons collecter : nom, prénom, email (via formulaire), données de navigation (pages visitées, durée, adresse IP anonymisée) et préférences de cookies.</p></section><section><h2>2. Finalités du traitement</h2><p>Vos données sont traitées pour répondre à vos demandes, améliorer votre expérience de navigation et respecter nos obligations légales.</p></section><section><h2>3. Base légale</h2><p>Le traitement repose sur votre consentement et notre intérêt légitime.</p></section><section><h2>4. Durée de conservation</h2><p>3 ans après le dernier contact pour les données de formulaire, 13 mois pour les cookies analytics.</p></section><section><h2>5. Vos droits RGPD</h2><p>Droit d’accès, de rectification, d’effacement, à la limitation, à la portabilité, d’opposition et de retrait du consentement.</p></section><section><h2>6. Exercer vos droits</h2><p>Contactez-nous à contact@art-visions.fr. Réclamation possible auprès de la CNIL : www.cnil.fr</p></section>",
      contentJson: JSON.stringify({ html: "<section>…</section>", blocks: [] }),
      status: "PUBLISHED",
      isActive: true,
      seoTitle: "Politique de Confidentialité | Art Vision",
      seoDescription: "Politique de confidentialité de SAS Art Vision – collecte des données, droits RGPD, cookies et sécurité.",
    },
    {
      slug: "politique-de-cookies-ue",
      title: "Politique de Cookies (UE)",
      contentHtml: "<section><h2>Qu’est-ce qu’un cookie ?</h2><p>Un cookie est un petit fichier texte déposé sur votre appareil lors de votre visite sur un site web.</p></section><section><h2>Cookies utilisés</h2><ul><li><strong>Analytics</strong> – Mesure d’audience anonymisée – 13 mois</li><li><strong>Préférences</strong> – Mémorisation de votre consentement – 6 mois</li><li><strong>Fonctionnels</strong> – Maintien de la session – Session</li></ul></section><section><h2>Votre consentement</h2><p>Une bannière vous informe et recueille votre consentement lors de votre première visite.</p></section><section><h2>Paramétrer vos cookies</h2><p>Via notre bannière cookies ou les paramètres de votre navigateur.</p></section>",
      contentJson: JSON.stringify({ html: "<section>…</section>", blocks: [] }),
      status: "PUBLISHED",
      isActive: true,
      seoTitle: "Politique de Cookies (UE) | Art Vision",
      seoDescription: "Politique de cookies d'Art Vision – gestion des cookies analytics, consentement et paramétrage selon le RGPD.",
    },
  ];

  for (const legal of legalPages) {
    await prisma.page.upsert({
      where: { slug: legal.slug },
      update: legal,
      create: legal,
    });
  }
  console.log("Legal pages seeded.");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
