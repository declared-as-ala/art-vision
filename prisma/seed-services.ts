/**
 * Seeds the provided service-page content (tagline, description, intro, body,
 * packages). Idempotent: updates services by slug; replaces packages only for
 * services where new packages are provided. Run: npx tsx prisma/seed-services.ts
 */
import { makePrisma } from "./seed-client";

const prisma = makePrisma();

const TAGLINE = "L'Âme de Votre Marque";
const IMG = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

interface Pkg { name: string; price: string; features: string }
interface SvcContent {
  slug: string;
  name: string;
  description: string;
  introHeading: string;
  detailedBody: string;
  packages?: Pkg[];
  gallery?: string[]; // unsplash ids
}

const SERVICES: SvcContent[] = [
  {
    slug: "identite-visuelle",
    name: "Identité visuelle",
    description: "Votre image est le premier contact avec vos clients. Nous créons des identités visuelles fortes, mémorables et cohérentes qui racontent votre histoire et captivent votre audience.",
    introHeading: "De l'idée à l'identité",
    detailedBody: "Chez ART VISION, nous croyons qu'une identité visuelle réussie naît d'une compréhension profonde de vos valeurs. Notre méthode est conçue pour transformer votre vision en une réalité visuelle impactante. Nous donnons à votre marque une voix visuelle authentique qui parle directement à votre audience. C'est ainsi que nous créons une connexion durable entre vous et vos clients.",
  },
  {
    slug: "creation-logo-professionnel",
    name: "Conception de Logo",
    description: "Votre logo est le premier contact avec vos clients. Nous créons des logos forts, mémorables et cohérents qui racontent votre histoire et captivent votre audience.",
    introHeading: "De l'idée à votre Logo",
    detailedBody: "Chez ART VISION, nous considérons que votre logo est l'essence même de votre marque. Ce n'est pas qu'une simple image ; c'est la promesse de votre entreprise résumée en un seul symbole. Notre méthode est conçue pour transformer vos valeurs fondamentales et vos ambitions en un concept de logo puissant, intemporel et mémorable.",
  },
  {
    slug: "design-graphique",
    name: "Création et Design Graphique",
    description: "L'image de votre marque est essentielle. Nous concevons tous vos supports visuels pour qu'ils soient puissants, mémorables et cohérents, racontant l'histoire de votre entreprise.",
    introHeading: "De l'idée à la Réalisation",
    detailedBody: "Chez ART VISION, nous transformons vos concepts en supports visuels concrets et percutants. Que ce soit pour un support imprimable ou une campagne digitale, notre approche est de comprendre votre vision et vos objectifs.\n\nNotre méthode est conçue pour garantir que chaque élément graphique — formes, couleurs, typographies — transmette l'émotion et le professionnalisme de votre marque. Nous vous aidons à mettre en place une stratégie visuelle authentique qui parle directement à votre audience cible, pour un impact maximal et durable.",
    packages: [
      { name: "Supports de Bureau (Design)", price: "à partir de 25 €", features: "Carte de Visite : design recto/verso, fichier HD prêt pour l'imprimeur (PDF X-1a);Papier en-tête & enveloppe : conception du modèle, respect de la charte, fichier HD" },
      { name: "Supports Promotionnels (Design)", price: "à partir de 50 €", features: "Affiche A3/A4 : création du visuel, fichier HD prêt à imprimer;Brochure / plaquette : conception graphique, respect de la charte;Menu (restaurant/bar) : design simple ou dépliant, intégration textes et tarifs" },
      { name: "Supports Grand Format (Design)", price: "à partir de 40 €", features: "Bâche / panneau rigide : visuel grand format, fond perdu et DPI respectés;Oriflamme : visuel adapté à la forme (goutte, plume), fichier HD;Roll-up, totem, autocollant… sur devis" },
    ],
  },
  {
    slug: "impression-publicitaire",
    name: "Impression professionnelle",
    description: "Une impression professionnelle pour façonner votre image.",
    introHeading: "De l'idée à l'impression",
    detailedBody: "Chez ART VISION, nous redéfinissons l'impression professionnelle. Notre engagement est triple : vous fournir une qualité d'impression irréprochable, de la plus petite carte de visite au plus grand Beachflag, tout en garantissant des prix bas et compétitifs. Grâce à notre équipement de pointe, nous maîtrisons tous les formats (A4, magazine, affiches, bâches…) et offrons une flexibilité totale.\n\n🎯 Notre objectif : faire de vos impressions professionnelles de véritables ambassadeurs visuels — élégants, durables et impactants.",
  },
  {
    slug: "video-publicitaire",
    name: "Création et Montage Vidéo",
    description: "L'image en mouvement donne vie à votre message.",
    introHeading: "De l'idée à la Réalisation",
    detailedBody: "Chez ART VISION, nous produisons des vidéos percutantes qui captivent, inspirent et valorisent votre marque. De la conception à la post-production, nous façonnons des contenus dynamiques adaptés à chaque canal de communication.\n\n🎯 Notre objectif : raconter votre histoire avec rythme, émotion et impact visuel.",
    packages: [
      { name: "Vidéo Publicitaire (Design + Montage)", price: "à partir de 80 €", features: "Conception et montage d'une courte publicité (15 à 60 sec);Intégration logo, musique libre de droits, texte animé, sous-titres;Format optimisé pour réseaux sociaux ou TV" },
      { name: "Vidéo Corporate (Design + Montage)", price: "à partir de 120 €", features: "Présentation d'entreprise ou d'équipe;Montage pro : transitions fluides, musique corporate, logo animé;Durée : 1 à 3 minutes" },
      { name: "Reels & Shorts (Design)", price: "à partir de 50 €", features: "Format vertical 9:16 optimisé Instagram / TikTok / YouTube;Rythme dynamique, effets modernes, titrage;Livraison prête à publier" },
    ],
  },
  {
    slug: "motion-design",
    name: "Motion Design",
    description: "Nous concevons votre histoire, créons les visuels et animons le tout pour un rendu harmonieux et professionnel.",
    introHeading: "De l'idée à la Réalisation",
    detailedBody: "Chez ART VISION, nous transformons vos concepts en animations percutantes, fluides et captivantes. Le motion design permet de donner vie à vos messages à travers un univers graphique unique, alliant design, rythme et narration visuelle.\n\n🎯 Notre mission : traduire vos idées en mouvements qui marquent les esprits.",
    packages: [
      { name: "Animation Logo (Design)", price: "à partir de 20 €", features: "Animation de votre logo (apparition fluide, effet 3D léger, particules, lumière);Format vidéo HD/4K, fond transparent ou sur mesure" },
      { name: "Vidéo Explicative (Design)", price: "à partir de 60 €", features: "Animation complète à partir d'un script ou storyboard;Intégration d'icônes, illustrations, voix off, transitions fluides;Durée : 30 sec à 2 min" },
      { name: "Motion Réseaux Sociaux (Design)", price: "à partir de 45 €", features: "Visuels animés pour Instagram, TikTok, YouTube;Animations dynamiques, typographie en mouvement;Format carré ou vertical" },
    ],
  },
  {
    slug: "creation-site-vitrine",
    name: "Création de Site Vitrine",
    description: "Un site web, c'est bien plus qu'une vitrine : c'est une expérience utilisateur, un outil de communication et un reflet de votre marque.",
    introHeading: "De l'idée à la Réalisation",
    detailedBody: "Chez ART VISION, nous concevons des sites vitrines élégants, performants et faciles à administrer. Chaque page est pensée pour valoriser votre activité, raconter votre histoire et séduire vos visiteurs dès le premier clic.\n\n🎯 Notre objectif : vous offrir un site à la fois beau, fluide et stratégique.",
    packages: [
      { name: "Pack One Page", price: "à partir de 120 €", features: "Site vitrine d'une page (présentation, services, contact);Design personnalisé, responsive;Hébergement et domaine non inclus" },
      { name: "Pack Standard", price: "à partir de 250 €", features: "Site vitrine complet (jusqu'à 5 pages);Design unique, intégration du contenu, formulaire de contact, SEO de base;Hébergement et domaine non inclus" },
      { name: "Pack Premium", price: "à partir de 800 €", features: "Site vitrine sur mesure (jusqu'à 8 pages);Animation légère, motion design, intégration portfolio, optimisation avancée;Hébergement et domaine non inclus" },
    ],
  },
  {
    slug: "community-management",
    name: "Community Management",
    description: "Gérer vos réseaux, c'est bien plus que publier du contenu : c'est raconter votre histoire, créer du lien et inspirer confiance.",
    introHeading: "De l'idée à la Réalisation",
    detailedBody: "Chez ART VISION, nous gérons et animons vos communautés avec une approche créative et stratégique. Nous créons du contenu cohérent, engageant et esthétique, pensé pour renforcer votre image et développer votre audience.\n\n🎯 Notre mission : transformer vos réseaux en un véritable levier de croissance.",
    packages: [
      { name: "Pack Découverte", price: "à partir de 120 €", features: "Gestion d'un réseau social (Instagram, Facebook, LinkedIn…);4 publications + stories, visuels personnalisés;Hashtags et légendes optimisées" },
      { name: "Pack Croissance", price: "à partir de 250 €", features: "Gestion de 2 réseaux sociaux;8 publications + stories;Suivi des performances" },
      { name: "Pack Premium", price: "à partir de 400 €", features: "Gestion complète (jusqu'à 3 réseaux);12 publications, stories, veille concurrentielle;Stratégie de contenu, shooting photos/vidéos, planning éditorial, reporting mensuel" },
    ],
  },
];

// Default gallery images per service (applied only when no gallery is set yet,
// so admin-uploaded images are never overwritten).
const GALLERY: Record<string, string[]> = {
  "identite-visuelle": ["photo-1561070791-2526d30994b5", "photo-1542744173-8e7e53415bb0", "photo-1502691876148-a84978e59af8"],
  "creation-logo-professionnel": ["photo-1599305445671-ac291c95aaa9", "photo-1611224885990-ab7363d1f2a9", "photo-1626785774573-4b799315345d"],
  "design-graphique": ["photo-1517245386807-bb43f82c33c4", "photo-1586281380349-632531db7ed4", "photo-1561070791-2526d30994b5"],
  "impression-publicitaire": ["photo-1606857521015-7f9fcf423740", "photo-1589330694653-ded6df03f754", "photo-1608248597481-496100c8c836"],
  "video-publicitaire": ["photo-1574717024653-61fd2cf4d44d", "photo-1535016120720-40c646be5580", "photo-1527960659564-77b9ad9c97ab"],
  "motion-design": ["photo-1535016120720-40c646be5580", "photo-1542751371-adc38448a05e", "photo-1517245386807-bb43f82c33c4"],
  "creation-site-vitrine": ["photo-1517245386807-bb43f82c33c4", "photo-1586281380349-632531db7ed4", "photo-1502691876148-a84978e59af8"],
  "community-management": ["photo-1611162617474-5b21e879e113", "photo-1561070791-2526d30994b5", "photo-1526947425960-945c6e72858f"],
};

function galleryCount(v: string | null | undefined): number {
  try { const a = JSON.parse(v || "[]"); return Array.isArray(a) ? a.length : 0; } catch { return 0; }
}

async function main() {
  console.log("Seeding service page content…");
  let updated = 0;
  for (const s of SERVICES) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
    if (!existing) { console.warn("  ⚠ service not found:", s.slug); continue; }
    const setGallery =
      galleryCount(existing.gallery) === 0 && GALLERY[s.slug]
        ? { gallery: JSON.stringify(GALLERY[s.slug].map((id) => ({ url: IMG(id), alt: s.name }))) }
        : {};
    // Replace the broken local hero image (/images/services/*) or empty image
    // with a real one, without overwriting an admin-uploaded image.
    const needsImage = !existing.image || existing.image.startsWith("/images/services/");
    const setImage = needsImage && GALLERY[s.slug] ? { image: IMG(GALLERY[s.slug][0]) } : {};
    await prisma.service.update({
      where: { slug: s.slug },
      data: {
        name: s.name,
        heroTagline: TAGLINE,
        introHeading: s.introHeading,
        description: s.description,
        detailedBody: s.detailedBody,
        ...setGallery,
        ...setImage,
      },
    });
    if (s.packages) {
      await prisma.pricingPackage.deleteMany({ where: { serviceId: existing.id } });
      for (const p of s.packages) {
        await prisma.pricingPackage.create({ data: { serviceId: existing.id, name: p.name, price: p.price, features: p.features } });
      }
    }
    updated++;
  }
  console.log(`✓ ${updated} services updated.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
