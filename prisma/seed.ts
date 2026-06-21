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
      slogan: "Lâ€™art au service de votre image.",
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
      globalDesc: "Art Vision est un studio graphique et crÃ©atif spÃ©cialisÃ© en identitÃ© visuelle, crÃ©ation logo, vidÃ©o, 3D, motion design et impression.",
      googleSearchCons: "",
    },
  });
  console.log("SEOSettings seeded.");

  // 4. Create Services
  const servicesData = [
    {
      slug: "identite-visuelle",
      name: "IdentitÃ© visuelle",
      icon: "Palette",
      image: "/images/services/identite-visuelle.jpg",
      description: "CrÃ©ation dâ€™une image unique, cohÃ©rente et mÃ©morable pour votre marque.",
      detailedBody: "Votre image de marque est le reflet de vos valeurs. Nous concevons des chartes graphiques complÃ¨tes comprenant la typographie, la palette de couleurs et les rÃ¨gles d'utilisation de votre logo sur tous vos supports physiques et numÃ©riques.",
      benefits: "CohÃ©rence de marque;Image de marque premium;Confiance client accrue;Reconnaissance immÃ©diate",
      process: "Analyse du besoin & Audit;Recherches crÃ©atives;Propositions de chartes;Validation & DÃ©clinaisons;Livraison des fichiers sources",
      seoTitle: "CrÃ©ation identitÃ© visuelle en France | Branding entreprise - Art Vision",
      seoDescription: "Art Vision crÃ©e des identitÃ©s visuelles professionnelles pour entreprises, marques et indÃ©pendants : charte graphique, logo, couleurs, typographies et supports.",
      packages: {
        create: [
          { name: "Basic", price: "Ã  partir de 70â‚¬", features: "Logo de base;Palette de couleurs;RÃ¨gles typographiques de base;Livrables web (PNG, JPG)" },
          { name: "Standard", price: "Ã  partir de 120â‚¬", features: "Logo principal & secondaire;Charte graphique PDF;Templates rÃ©seaux sociaux;Livrables haute dÃ©finition (SVG, PDF)" },
          { name: "Premium", price: "Ã  partir de 160â‚¬", features: "Branding complet;Supports de marque (carte de visite, papier en-tÃªte);Templates Ã©ditables Canva;Fichiers sources complets (AI, PSD)" }
        ]
      },
      faqs: {
        create: [
          { question: "Qu'est-ce qu'une charte graphique ?", answer: "Une charte graphique est un document contenant l'ensemble des rÃ¨gles d'utilisation des signes graphiques (logo, couleurs, typographies, dÃ©clinaisons) d'une entreprise." },
          { question: "Combien de temps prend la crÃ©ation d'une identitÃ© visuelle ?", answer: "En gÃ©nÃ©ral, le processus complet prend entre 1 et 3 semaines selon les retours et les ajustements." }
        ]
      }
    },
    {
      slug: "creation-logo-professionnel",
      name: "Conception logo",
      icon: "PenTool",
      image: "/images/services/conception-logo.jpg",
      description: "Un logo professionnel, distinctif et adaptÃ© Ã  tous vos supports.",
      detailedBody: "Un logo de qualitÃ© supÃ©rieure doit Ãªtre intemporel et fonctionnel. Nos designers dessinent des logos vectoriels uniques adaptÃ©s aux impressions gÃ©antes ainsi qu'aux favicons d'applications mobiles.",
      benefits: "Vectoriel haute dÃ©finition;Unique & sur-mesure;MÃ©morisable par votre cible;Utilisable sur tous supports",
      process: "Brief crÃ©atif;Planche de tendances;CrÃ©ation de concepts;Ajustements & retours;Livrables finaux",
      seoTitle: "CrÃ©ation logo professionnel en France | Logo entreprise - Art Vision",
      seoDescription: "CrÃ©ation de logo professionnel pour entreprises, startups, restaurants, boutiques, marques et indÃ©pendants en France.",
      packages: {
        create: [
          { name: "Basic Logo", price: "Ã  partir de 50â‚¬", features: "2 concepts originaux;1 rÃ©vision;Fichiers PNG transparents" },
          { name: "Standard Logo", price: "Ã  partir de 95â‚¬", features: "4 concepts originaux;3 rÃ©visions;Fichiers SVG/Vectoriels" },
          { name: "Premium Logo", price: "Ã  partir de 140â‚¬", features: "Concepts illimitÃ©s;RÃ©visions illimitÃ©es;Fichiers sources complets (.AI);DÃ©clinaisons de couleurs" }
        ]
      },
      faqs: {
        create: [
          { question: "Fournissez-vous les fichiers vectoriels ?", answer: "Oui, tous nos logos standards et premiums sont livrÃ©s aux formats vectoriels (SVG, PDF, AI)." },
          { question: "Puis-je modifier mon logo aprÃ¨s livraison ?", answer: "Tout Ã  fait, en possÃ©dant les fichiers sources (.AI), vous pourrez faire des modifications dans le futur." }
        ]
      }
    },
    {
      slug: "design-graphique",
      name: "Projet graphique",
      icon: "Layout",
      image: "/images/services/projet-graphique.jpg",
      description: "Supports visuels modernes pour vos campagnes, rÃ©seaux sociaux et documents commerciaux.",
      detailedBody: "De la conception d'affiches publicitaires au design de brochures de vente haut de gamme, nous mettons notre expertise crÃ©ative au service de vos supports de communication.",
      benefits: "Design moderne;Mise en page aÃ©rÃ©e;OptimisÃ© pour la conversion;AdaptÃ© Ã  votre charte",
      process: "Brief & Textes;Mise en page initiale;Ajustements graphiques;Validation;Export",
      seoTitle: "Design graphique en France | CrÃ©ation visuelle professionnelle - Art Vision",
      seoDescription: "CrÃ©ation de supports graphiques professionnels pour communication, publicitÃ©, rÃ©seaux sociaux, catalogues, affiches et campagnes visuelles.",
      packages: {
        create: [
          { name: "Visuels RS", price: "Ã  partir de 45â‚¬", features: "3 gabarits de posts;Format Story et CarrÃ©;Fichiers JPG de haute qualitÃ©" },
          { name: "Support Unique", price: "Ã  partir de 80â‚¬", features: "Flyer ou affiche A4;Mise en page professionnelle;Fichier prÃªt pour l'impression" },
          { name: "Catalogue/Brochure", price: "Ã  partir de 200â‚¬", features: "Mise en page multi-pages;Jusqu'Ã  8 pages;Export interactif & print" }
        ]
      },
      faqs: {
        create: [
          { question: "De quoi avez-vous besoin pour dÃ©marrer ?", answer: "Nous avons besoin de votre logo, de votre charte graphique (si disponible), des textes Ã  inclure et de vos directives visuelles." }
        ]
      }
    },
    {
      slug: "impression-publicitaire",
      name: "Impression",
      icon: "Printer",
      image: "/images/services/impression.jpg",
      description: "Supports imprimÃ©s de haute qualitÃ© pour flyers, affiches, bÃ¢ches, catalogues, panneaux et cartes de visite.",
      detailedBody: "Nous gÃ©rons toute la chaÃ®ne de production : choix du papier (grammage, vernis), vÃ©rification des zones de sÃ©curitÃ©, colorimÃ©trie CMJN et livraison directe de vos supports imprimÃ©s Ã  vos bureaux.",
      benefits: "Papier premium;Finition soignÃ©e (mat/brillant);VÃ©rification prÃ©-presse gratuite;Livraison rapide",
      process: "Choix du support & options;VÃ©rification du fichier de crÃ©ation;Impression en atelier;ContrÃ´le qualitÃ©;ExpÃ©dition",
      seoTitle: "Impression publicitaire en France | Flyers, affiches, bÃ¢ches, cartes - Art Vision",
      seoDescription: "Art Vision propose des services dâ€™impression publicitaire pour flyers, affiches, bÃ¢ches, panneaux, catalogues, cartes de visite et supports grand format.",
      packages: {
        create: [
          { name: "Pack Cartes de Visite", price: "Ã  partir de 35â‚¬", features: "250 exemplaires;Papier 350g couchÃ© demi-mat;Impression recto/verso" },
          { name: "Pack Flyers", price: "Ã  partir de 50â‚¬", features: "500 exemplaires A5;Papier 135g brillant;Impression recto/verso" },
          { name: "Pack Grand Format", price: "Ã  partir de 90â‚¬", features: "BÃ¢che publicitaire 2x1m;Å’illets inclus;RÃ©sistant aux intempÃ©ries" }
        ]
      },
      faqs: {
        create: [
          { question: "Quels sont vos dÃ©lais de livraison ?", answer: "La livraison prend gÃ©nÃ©ralement 3 Ã  5 jours ouvrÃ©s aprÃ¨s la validation du Bon Ã€ Tirer (BAT)." }
        ]
      }
    },
    {
      slug: "video-publicitaire",
      name: "Projet vidÃ©o",
      icon: "Video",
      image: "/images/services/video.jpg",
      description: "VidÃ©os impactantes pour prÃ©senter votre marque, vos produits ou vos services.",
      detailedBody: "Le contenu vidÃ©o est le format le plus captivant du web. Nous rÃ©alisons des tournages, des montages professionnels et du color grading pour vos spots publicitaires et vidÃ©os institutionnelles.",
      benefits: "Montage rythmÃ©;QualitÃ© cinÃ©ma/4K;Storytelling captivant;Sous-titres intÃ©grÃ©s",
      process: "Ã‰criture du script;Tournage / Captation;DÃ©rushage & Montage;Ã‰talonnage & Sound design;Livraison MP4/ProRes",
      seoTitle: "VidÃ©o publicitaire en France | Montage vidÃ©o & vidÃ©o corporate - Art Vision",
      seoDescription: "CrÃ©ation de vidÃ©os publicitaires, vidÃ©os corporate, montages vidÃ©o et contenus vidÃ©o pour entreprises et marques.",
      packages: {
        create: [
          { name: "Format Court (Reels/TikTok)", price: "Ã  partir de 90â‚¬", features: "Jusqu'Ã  60 secondes;Format vertical;Montage dynamique;Sous-titres automatiques" },
          { name: "VidÃ©o Promo (Web)", price: "Ã  partir de 250â‚¬", features: "Jusqu'Ã  2 minutes;ScÃ©narisation;Musique libre de droits;Habillage graphique simple" },
          { name: "VidÃ©o Corporate Premium", price: "Ã  partir de 600â‚¬", features: "VidÃ©o d'entreprise complÃ¨te;Interview & B-roll;Habillage motion design;Mixage audio professionnel" }
        ]
      },
      faqs: {
        create: [
          { question: "Proposez-vous des voix-off ?", answer: "Oui, nous pouvons intÃ©grer des voix-off professionnelles masculines ou fÃ©minines (franÃ§ais, anglais, arabe) en option." }
        ]
      }
    },
    {
      slug: "motion-design",
      name: "Motion design",
      icon: "Sparkles",
      image: "/images/services/motion-design.jpg",
      description: "Animations dynamiques pour capter lâ€™attention et renforcer votre communication.",
      detailedBody: "Expliquez des concepts complexes en quelques secondes grÃ¢ce Ã  l'animation graphique 2D. Nous crÃ©ons des infographies animÃ©es et des logos animÃ©s haut de gamme.",
      benefits: "Forte mÃ©morisation;Animation fluide;ClartÃ© pÃ©dagogique;AdaptÃ© Ã  tous les Ã©crans",
      process: "Script & Storyboard;Illustration des assets;Animation;Sound design & Bruitages;Export final",
      seoTitle: "Motion design en France | Animation vidÃ©o professionnelle - Art Vision",
      seoDescription: "CrÃ©ation de motion design, animation vidÃ©o, habillage graphique, vidÃ©os explicatives et animations publicitaires.",
      packages: {
        create: [
          { name: "Logo AnimÃ©", price: "Ã  partir de 60â‚¬", features: "Animation de logo existant;Format web & transparent;DurÃ©e 3-5 secondes" },
          { name: "VidÃ©o Explicative 30s", price: "Ã  partir de 180â‚¬", features: "Script fourni;Illustrations vectorielles;Animation fluide;Musique de fond" },
          { name: "Motion Premium 1min", price: "Ã  partir de 390â‚¬", features: "Storyboard sur-mesure;Illustrations complexes;Voix-off professionnelle;Sound design complet" }
        ]
      },
      faqs: {
        create: [
          { question: "Qu'est-ce qu'un storyboard ?", answer: "Le storyboard est une bande dessinÃ©e schÃ©matisant les scÃ¨nes de la future vidÃ©o afin de valider le visuel avant l'animation." }
        ]
      }
    },
    {
      slug: "modelisation-3d-rendu-produit",
      name: "3D & Design produit",
      icon: "Box",
      image: "/images/services/3d.jpg",
      description: "ModÃ©lisation 3D, rendu produit, packshot 3D, visualisation 3D et CGI publicitaire.",
      detailedBody: "PrÃ©sentez vos produits sous leur meilleur jour grÃ¢ce Ã  des rendus photorÃ©alistes. ModÃ©lisation CAO, packshots pour e-commerce et animations 3D pour campagnes publicitaires.",
      benefits: "Rendus photorÃ©alistes;Aucun studio photo requis;Modifications d'angles infinies;QualitÃ© studio premium",
      process: "Plans 2D / Photos du produit;ModÃ©lisation 3D filaire;Application des textures/matÃ©riaux;Mise en lumiÃ¨re studio;Calcul du rendu haute dÃ©finition",
      seoTitle: "ModÃ©lisation 3D & rendu produit en France | CGI & packshot 3D - Art Vision",
      seoDescription: "CrÃ©ation de modÃ©lisation 3D, rendu 3D produit, animation 3D, visualisation 3D, CGI publicitaire et packshot 3D.",
      packages: {
        create: [
          { name: "Packshot Produit Simple", price: "Ã  partir de 80â‚¬", features: "1 rendu haute dÃ©finition;Fond blanc uni;Textures rÃ©alistes standard" },
          { name: "Rendu 3D Ambiance", price: "Ã  partir de 150â‚¬", features: "Rendu dans un dÃ©cor 3D;Ã‰clairage studio personnalisÃ©;3 angles de vue diffÃ©rents" },
          { name: "Animation 3D Produit", price: "Ã  partir de 450â‚¬", features: "VidÃ©o 15s de rotation/Ã©clatÃ©;Textures complexes;Rendu 4K/Full HD" }
        ]
      },
      faqs: {
        create: [
          { question: "Quels fichiers devez-vous fournir pour une modÃ©lisation 3D ?", answer: "Des photos du produit sous tous les angles, ou des fichiers techniques CAO (STEP, IGES, OBJ)." }
        ]
      }
    },
    {
      slug: "creation-site-vitrine",
      name: "Site vitrine",
      icon: "Globe",
      image: "/images/services/site-vitrine.jpg",
      description: "Sites web Ã©lÃ©gants, rapides, responsive et optimisÃ©s pour convertir.",
      detailedBody: "Un site web moderne est le socle de votre rÃ©ussite numÃ©rique. Nous dÃ©veloppons des sites web vitrines sur-mesure rapides, sÃ©curisÃ©s, optimisÃ©s pour Google et compatibles avec tous les smartphones.",
      benefits: "Super rapide & SÃ©curisÃ©;OptimisÃ© SEO de base;Interface UX/UI sur-mesure;Bouton WhatsApp flottant",
      process: "Maquettes UX/UI Figma;DÃ©veloppement Next.js / Tailwind;IntÃ©gration du CMS Admin;Phase de tests;Mise en ligne",
      seoTitle: "CrÃ©ation site vitrine en France | Site web professionnel - Art Vision",
      seoDescription: "CrÃ©ation de sites vitrines modernes, rapides, responsive et optimisÃ©s SEO pour entreprises, indÃ©pendants et marques.",
      packages: {
        create: [
          { name: "Landing Page", price: "Ã  partir de 250â‚¬", features: "Page unique optimisÃ©e;Formulaire de contact;Design responsive;OptimisÃ© SEO" },
          { name: "Site Vitrine Standard", price: "Ã  partir de 490â‚¬", features: "Jusqu'Ã  5 pages;Dashboard d'administration;IntÃ©gration rÃ©seaux sociaux;HÃ©bergement sÃ©curisÃ©" },
          { name: "Site Vitrine Premium", price: "Ã  partir de 950â‚¬", features: "Pages illimitÃ©es;Devis en ligne interactif;Multilingue (FR/EN/AR);Accompagnement SEO poussÃ©" }
        ]
      },
      faqs: {
        create: [
          { question: "Le site sera-t-il modifiable ?", answer: "Oui, un espace d'administration sÃ©curisÃ© vous permet de modifier les textes, images et articles de blog sans coder." }
        ]
      }
    },
    {
      slug: "community-management",
      name: "Community management",
      icon: "Users",
      image: "/images/services/community-management.jpg",
      description: "Gestion et animation professionnelle de vos rÃ©seaux sociaux.",
      detailedBody: "Engagez vos abonnÃ©s et dÃ©veloppez votre visibilitÃ©. Nous gÃ©rons votre planning Ã©ditorial, la rÃ©daction des lÃ©gendes, le design de vos visuels et l'interaction avec votre communautÃ©.",
      benefits: "PrÃ©sence active garantie;Contenus professionnels;Gain de temps;Rapports mensuels de performance",
      process: "Audit rÃ©seaux sociaux;DÃ©finition de la charte Ã©ditoriale;CrÃ©ation du calendrier de publication;CrÃ©ation graphique des posts;Planification & ModÃ©ration",
      seoTitle: "Community management en France | Gestion rÃ©seaux sociaux - Art Vision",
      seoDescription: "Gestion de rÃ©seaux sociaux, crÃ©ation de contenu, planning Ã©ditorial et animation de communautÃ© pour entreprises et marques.",
      packages: {
        create: [
          { name: "Essentiel", price: "Ã  partir de 120â‚¬/mois", features: "1 publication par semaine;Instagram / Facebook;RÃ©daction des lÃ©gendes;Rapport trimestriel" },
          { name: "Business", price: "Ã  partir = 250â‚¬/mois", features: "3 publications par semaine;Gabarits graphiques inclus;ModÃ©ration des commentaires;Rapport mensuel" },
          { name: "Premium Influence", price: "Ã  partir de 450â‚¬/mois", features: "5 publications par semaine + Stories;CrÃ©ation de Reels/VidÃ©o;Gestion publicitaire (Meta Ads);Support 7j/7" }
        ]
      },
      faqs: {
        create: [
          { question: "Les budgets publicitaires sont-ils inclus ?", answer: "Non, les budgets publicitaires (Meta Ads) sont payÃ©s directement aux plateformes par le client." }
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
