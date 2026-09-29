// OUTILS GRATUITS - central registry (single source of truth)
// Used by the hub, tool pages, structured data and sitemap.

export const TOOLS_BASE_PATH = "/outils-gratuits";

export type ToolCategory =
  | "Carrière"
  | "Impression & supports"
  | "Identité visuelle"
  | "Marketing & réseaux sociaux"
  | "Web & entreprise";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDef {
  slug: string;
  icon: string;
  title: string;
  shortDesc: string;
  seoText: string;
  category: ToolCategory;
  seoTitle: string;
  seoDescription: string;
  cta: { label: string; href: string };
  relatedServices: { label: string; href: string }[];
  relatedToolSlugs?: string[];
  faq: ToolFaq[];
  accent: string;
  order: number;
  live: boolean;
}

const service = {
  design: { label: "Création graphique", href: "/design-graphique" },
  logo: { label: "Création de logo", href: "/creation-logo-professionnel" },
  identity: { label: "Identité visuelle", href: "/identite-visuelle" },
  print: { label: "Impression", href: "/impression" },
  signage: { label: "Signalétique", href: "/signaletique" },
  social: { label: "Community management", href: "/community-management" },
  web: { label: "Création de site web", href: "/creation-site-internet" },
};

const printCta = {
  label: "Besoin d'un support professionnel imprimé ? Art Visions peut le créer et l'imprimer.",
  href: "/impression",
};

const identityCta = {
  label: "Besoin d'une identité visuelle complète ? Confiez votre marque à Art Visions.",
  href: "/identite-visuelle",
};

const socialCta = {
  label: "Besoin d'une stratégie de contenu régulière ? Art Visions peut gérer vos réseaux sociaux.",
  href: "/community-management",
};

export const tools: ToolDef[] = [
  {
    slug: "cv-gratuit",
    icon: "FileText",
    title: "Générateur de CV",
    shortDesc: "Créez un CV professionnel et design, prêt à imprimer en PDF.",
    seoText: "Modèles de CV modernes, aperçu en direct, export PDF gratuit. Choisissez un style, vos couleurs et téléchargez instantanément.",
    category: "Carrière",
    seoTitle: "Créer un CV gratuit en ligne | Modèles CV professionnels - Art Visions",
    seoDescription: "Créez gratuitement un CV professionnel en ligne avec Art Visions : modèles modernes, aperçu en direct, couleurs personnalisables et export PDF immédiat.",
    cta: { label: "Besoin d'un CV encore plus professionnel ? Contactez Art Visions.", href: "/contact" },
    relatedServices: [service.design, service.identity],
    relatedToolSlugs: ["generateur-signature-email", "generateur-palette-couleurs", "createur-charte-graphique"],
    faq: [
      { question: "Le générateur de CV est-il vraiment gratuit ?", answer: "Oui. Vous créez, prévisualisez et téléchargez votre CV au format PDF gratuitement, sans inscription obligatoire." },
      { question: "Puis-je personnaliser les couleurs et le modèle ?", answer: "Oui. Plusieurs modèles sont disponibles et vous pouvez choisir une couleur d'accent adaptée à votre métier." },
    ],
    accent: "#6C2BD9",
    order: 1,
    live: true,
  },
  {
    slug: "carte-de-visite-gratuite",
    icon: "CreditCard",
    title: "Générateur de carte de visite",
    shortDesc: "Concevez une carte de visite recto-verso prête à imprimer (85 x 55 mm).",
    seoText: "Créez une carte de visite professionnelle avec logo, QR code vCard et aperçu recto-verso. Export PNG/PDF au format d'impression standard.",
    category: "Identité visuelle",
    seoTitle: "Créer une carte de visite gratuite en ligne | Art Visions",
    seoDescription: "Générez gratuitement votre carte de visite professionnelle : logo, QR code vCard, modèles premium, aperçu recto-verso et export PNG/PDF prêt à imprimer.",
    cta: { label: "Commander l'impression de vos cartes", href: "/impression" },
    relatedServices: [service.print, service.logo],
    relatedToolSlugs: ["createur-charte-graphique", "generateur-signature-email", "gabarit-impression", "createur-carte-fidelite"],
    faq: [
      { question: "Quel format pour l'impression ?", answer: "Les cartes sont générées au format standard 85 x 55 mm, prêt pour l'impression professionnelle." },
      { question: "Puis-je ajouter mon logo et un QR code ?", answer: "Oui, vous pouvez importer votre logo et générer un QR code vCard." },
    ],
    accent: "#D72888",
    order: 2,
    live: true,
  },
  {
    slug: "generateur-qr-code",
    icon: "QrCode",
    title: "Générateur de QR Code",
    shortDesc: "QR codes personnalisés : URL, WhatsApp, vCard, Wi-Fi, réseaux sociaux.",
    seoText: "Générez gratuitement un QR code aux couleurs de votre marque pour votre site, WhatsApp, Instagram, menu, Wi-Fi ou contact vCard.",
    category: "Marketing & réseaux sociaux",
    seoTitle: "Générateur QR Code gratuit en ligne | Art Visions",
    seoDescription: "Créez gratuitement un QR code personnalisé (URL, WhatsApp, Instagram, vCard, Wi-Fi...) aux couleurs de votre marque. Téléchargement PNG, SVG et PDF.",
    cta: { label: "Besoin d'un support QR professionnel ? Demander un devis.", href: "/devis-sur-mesure" },
    relatedServices: [service.print, service.design],
    relatedToolSlugs: ["createur-affiche-qr-code", "createur-menu-restaurant", "createur-affiche-horaires"],
    faq: [
      { question: "Les QR codes générés expirent-ils ?", answer: "Non. Les QR codes sont statiques : ils encodent directement votre information et fonctionnent indéfiniment." },
      { question: "Puis-je mettre mon logo au centre ?", answer: "Oui, vous pouvez importer un logo qui sera placé au centre avec une correction d'erreur adaptée." },
    ],
    accent: "#6C2BD9",
    order: 3,
    live: true,
  },
  {
    slug: "generateur-palette-couleurs",
    icon: "Palette",
    title: "Générateur de palette de couleurs",
    shortDesc: "Extrayez une palette harmonieuse depuis une image ou une couleur de base.",
    seoText: "Créez une palette cohérente pour votre marque : couleur primaire, secondaire, accent et neutres. Codes HEX, RGB, HSL et contraste.",
    category: "Identité visuelle",
    seoTitle: "Générateur de palette de couleurs gratuit | Art Visions",
    seoDescription: "Générez gratuitement une palette de couleurs professionnelle à partir d'une couleur ou d'une image. Codes HEX/RGB/HSL, contraste et export.",
    cta: identityCta,
    relatedServices: [service.identity, service.logo],
    relatedToolSlugs: ["createur-charte-graphique", "generateur-mockup", "generateur-signature-email"],
    faq: [
      { question: "Comment extraire les couleurs d'un logo ?", answer: "Importez votre image : l'outil analyse les pixels et propose les couleurs dominantes." },
      { question: "Qu'est-ce que la vérification du contraste ?", answer: "Elle indique si une couleur de texte reste lisible sur un fond donné, selon les recommandations WCAG." },
    ],
    accent: "#D72888",
    order: 4,
    live: true,
  },
  {
    slug: "generateur-brief-logo",
    icon: "PenTool",
    title: "Générateur de brief logo",
    shortDesc: "Un questionnaire guidé qui produit un brief logo clair en PDF.",
    seoText: "Préparez un brief de logo complet : secteur, cible, personnalité de marque, styles et couleurs. Téléchargez un PDF professionnel.",
    category: "Identité visuelle",
    seoTitle: "Créer un brief logo gratuit en ligne | Art Visions",
    seoDescription: "Générez gratuitement un brief de logo professionnel grâce à un questionnaire guidé. Téléchargez un PDF clair à partager avec votre graphiste.",
    cta: { label: "Recevez une proposition pour votre logo.", href: "/creation-logo-professionnel" },
    relatedServices: [service.logo, service.identity],
    relatedToolSlugs: ["createur-charte-graphique", "generateur-brief-site-web", "generateur-palette-couleurs"],
    faq: [
      { question: "À quoi sert un brief de logo ?", answer: "Il rassemble la cible, le style et les valeurs pour aider le designer à créer un logo aligné dès le départ." },
      { question: "Puis-je l'envoyer à Art Visions ?", answer: "Oui. Vous pouvez télécharger le PDF et nous l'envoyer, ou demander une proposition directement." },
    ],
    accent: "#FF6A00",
    order: 5,
    live: true,
  },
  {
    slug: "generateur-slogan",
    icon: "Megaphone",
    title: "Générateur de slogan",
    shortDesc: "Au moins 10 idées de slogans selon votre secteur et votre ton.",
    seoText: "Trouvez un slogan accrocheur pour votre entreprise. Choisissez le ton et obtenez instantanément des propositions.",
    category: "Identité visuelle",
    seoTitle: "Générateur de slogan gratuit pour entreprise | Art Visions",
    seoDescription: "Générez gratuitement des idées de slogans pour votre entreprise selon votre secteur, votre ton et vos mots-clés.",
    cta: identityCta,
    relatedServices: [service.identity, service.social],
    relatedToolSlugs: ["generateur-bio-instagram", "generateur-caption-instagram", "createur-charte-graphique"],
    faq: [
      { question: "Les slogans sont-ils générés par IA ?", answer: "L'outil utilise un moteur intelligent avec un générateur de secours basé sur des structures éprouvées." },
      { question: "Puis-je réutiliser librement un slogan ?", answer: "Oui, les suggestions vous appartiennent. Une vérification d'antériorité reste recommandée avant dépôt de marque." },
    ],
    accent: "#6C2BD9",
    order: 6,
    live: true,
  },
  {
    slug: "generateur-bio-instagram",
    icon: "Instagram",
    title: "Générateur de bio Instagram",
    shortDesc: "3 à 5 bios Instagram optimisées avec appel à l'action.",
    seoText: "Rédigez une bio Instagram professionnelle : activité, ville, services, ton et CTA. Compteur de caractères inclus.",
    category: "Marketing & réseaux sociaux",
    seoTitle: "Générateur de bio Instagram professionnelle gratuit | Art Visions",
    seoDescription: "Créez gratuitement une bio Instagram percutante pour votre entreprise : ton personnalisable, appel à l'action et limite de caractères.",
    cta: socialCta,
    relatedServices: [service.social, service.design],
    relatedToolSlugs: ["generateur-caption-instagram", "planificateur-publications", "createur-visuel-produit"],
    faq: [
      { question: "Quelle est la limite d'une bio Instagram ?", answer: "Instagram limite la bio à 150 caractères. L'outil affiche un compteur en direct." },
      { question: "Puis-je ajuster le ton ?", answer: "Oui, vous pouvez choisir un ton plus professionnel, chaleureux, premium ou direct." },
    ],
    accent: "#D72888",
    order: 7,
    live: true,
  },
  {
    slug: "generateur-caption-instagram",
    icon: "Hash",
    title: "Captions & hashtags Instagram",
    shortDesc: "Légendes courtes/longues avec hashtags pertinents.",
    seoText: "Générez des légendes Instagram engageantes et une sélection de hashtags selon votre type de publication.",
    category: "Marketing & réseaux sociaux",
    seoTitle: "Générateur de captions et hashtags Instagram gratuit | Art Visions",
    seoDescription: "Créez gratuitement des légendes Instagram, des appels à l'action et des hashtags pertinents pour vos publications professionnelles.",
    cta: socialCta,
    relatedServices: [service.social, service.design],
    relatedToolSlugs: ["generateur-bio-instagram", "planificateur-publications", "createur-visuel-produit"],
    faq: [
      { question: "Combien de hashtags faut-il utiliser ?", answer: "Un mix de hashtags larges et de niche est souvent plus utile qu'une liste trop générique." },
      { question: "Les légendes sont-elles en français ?", answer: "Oui, tous les contenus sont générés en français par défaut." },
    ],
    accent: "#6C2BD9",
    order: 8,
    live: true,
  },
  {
    slug: "creer-flyer",
    icon: "Image",
    title: "Créateur de flyer",
    shortDesc: "4 modèles à personnaliser pour promotion, ouverture, événement ou nouveauté.",
    seoText: "Créez un flyer professionnel en ligne : titre, offre, date, lieu, image et logo. Export PNG/PDF prêt à partager ou imprimer.",
    category: "Marketing & réseaux sociaux",
    seoTitle: "Créer un flyer gratuit en ligne | Modèles personnalisables - Art Visions",
    seoDescription: "Créez gratuitement un flyer professionnel avec nos modèles. Personnalisez, prévisualisez et exportez en PNG/PDF.",
    cta: { label: "Demander une version professionnelle ou une impression.", href: "/impression" },
    relatedServices: [service.print, service.design],
    relatedToolSlugs: ["gabarit-impression", "verificateur-resolution-image-impression", "redimensionner-image"],
    faq: [
      { question: "Puis-je imprimer le flyer ?", answer: "Oui, l'export haute résolution est adapté au partage digital comme à l'impression." },
      { question: "Puis-je utiliser mes propres images ?", answer: "Oui, vous pouvez importer votre image de fond et votre logo." },
    ],
    accent: "#FF6A00",
    order: 9,
    live: true,
  },
  {
    slug: "calculateur-impression",
    icon: "Calculator",
    title: "Calculateur de prix impression",
    shortDesc: "Estimez le prix de vos flyers, affiches, bâches, cartes...",
    seoText: "Estimez instantanément le coût de votre impression : produit, format, quantité, papier et finition.",
    category: "Impression & supports",
    seoTitle: "Calculateur de prix impression gratuit | Flyers, affiches, cartes - Art Visions",
    seoDescription: "Calculez gratuitement une estimation du prix d'impression de vos flyers, affiches, bâches, panneaux, catalogues et cartes de visite.",
    cta: { label: "Recevoir mon devis impression", href: "/devis-sur-mesure" },
    relatedServices: [service.print],
    relatedToolSlugs: ["gabarit-impression", "verificateur-resolution-image-impression", "creer-flyer"],
    faq: [
      { question: "L'estimation est-elle un prix définitif ?", answer: "Non. Il s'agit d'une estimation indicative. Le devis final est établi après validation du fichier et des options." },
      { question: "Quels produits sont couverts ?", answer: "Flyers, affiches, bâches, panneaux publicitaires, catalogues et cartes de visite." },
    ],
    accent: "#D72888",
    order: 10,
    live: true,
  },
];

const newTools: ToolDef[] = [
  ["createur-menu-restaurant", "Utensils", "Créateur de menu restaurant", "Composez un menu imprimable avec plats, prix, logo, couleurs et modèles.", "Créez gratuitement une carte de restaurant, café, snack, pizzeria ou salon de thé avec aperçu en direct et export PDF prêt à imprimer.", "Impression & supports", "Créateur de menu restaurant gratuit en ligne | Art Visions", "Créez gratuitement votre menu de restaurant en ligne. Ajoutez plats, prix, logo et couleurs puis téléchargez un PDF prêt à imprimer.", printCta, [service.print, service.design], ["createur-affiche-qr-code", "gabarit-impression", "verificateur-resolution-image-impression", "createur-affiche-horaires"], "#CD7942"],
  ["generateur-grille-tarifaire", "ListChecks", "Générateur de grille tarifaire", "Créez une liste de prix claire pour salon, institut, garage ou freelance.", "Ajoutez vos catégories, prestations, descriptions, tarifs et prix promotionnels dans une grille lisible à exporter en PDF ou image.", "Web & entreprise", "Grille tarifaire gratuite en ligne | Modèle personnalisable - Art Visions", "Créez une grille tarifaire professionnelle gratuite pour salon, institut, barber, garage, freelance ou consultant avec export PDF et PNG.", { label: "Besoin d'une grille tarifaire imprimée ou harmonisée à votre marque ?", href: "/design-graphique" }, [service.design, service.print], ["createur-affiche-horaires", "createur-charte-graphique", "createur-carte-fidelite", "generateur-bon-cadeau"], "#6348E5"],
  ["createur-carte-fidelite", "Stamp", "Créateur de carte de fidélité", "Cartes de fidélité recto/verso avec cases tampon, récompense et contacts.", "Choisissez 5, 6, 8 ou 10 cases, ajoutez votre logo, votre offre et vos informations, puis exportez une carte imprimable.", "Impression & supports", "Carte de fidélité gratuite à imprimer | Art Visions", "Créez gratuitement une carte de fidélité personnalisée pour restaurant, café, salon, barber ou boutique avec PDF imprimable.", { label: "Faites imprimer vos cartes de fidélité par Art Visions.", href: "/impression" }, [service.print, service.identity], ["generateur-bon-cadeau", "createur-charte-graphique", "createur-affiche-qr-code", "carte-de-visite-gratuite"], "#D72888"],
  ["generateur-bon-cadeau", "Gift", "Générateur de bon cadeau", "Bon cadeau personnalisé avec montant, bénéficiaire, message et validité.", "Générez un chèque cadeau à imprimer pour institut, restaurant, salon, boutique ou activité de service.", "Impression & supports", "Bon cadeau gratuit à imprimer | Générateur Art Visions", "Créez gratuitement un bon cadeau personnalisé avec logo, montant, message, date de validité, référence et export PDF.", printCta, [service.print, service.design], ["createur-carte-fidelite", "generateur-grille-tarifaire", "createur-visuel-produit", "createur-charte-graphique"], "#CD7942"],
  ["generateur-signature-email", "Mail", "Créateur de signature e-mail", "Signature HTML avec logo, photo, coordonnées, site et réseaux sociaux.", "Créez une signature professionnelle compatible Gmail, Outlook et Apple Mail, puis copiez le HTML prêt à coller.", "Identité visuelle", "Générateur de signature mail gratuit HTML | Art Visions", "Créez gratuitement une signature e-mail professionnelle avec logo, photo, téléphone, site, adresse et liens sociaux. Copiez le HTML.", identityCta, [service.identity, service.logo], ["createur-charte-graphique", "carte-de-visite-gratuite", "generateur-palette-couleurs", "generateur-brief-logo"], "#6C2BD9"],
  ["createur-affiche-qr-code", "QrCode", "Créateur d'affiche QR Code", "Affiches QR code pour Wi-Fi, menu, avis Google, Instagram, site ou événement.", "Générez un QR code scannable, personnalisez l'affiche et exportez-la en PNG ou PDF pour l'imprimer.", "Impression & supports", "Affiche QR Code gratuite à imprimer | Art Visions", "Créez gratuitement une affiche QR code pour Wi-Fi, menu restaurant, avis Google, Instagram, site, paiement ou événement.", { label: "Imprimez votre affiche QR Code avec Art Visions.", href: "/impression" }, [service.print, service.signage], ["generateur-qr-code", "createur-menu-restaurant", "gabarit-impression", "verificateur-resolution-image-impression"], "#BA3184"],
  ["verificateur-resolution-image-impression", "ScanSearch", "Vérificateur de résolution d'image", "Contrôlez pixels, ratio, DPI estimé et taille d'impression recommandée.", "Importez une image et sachez si elle est excellente, acceptable ou insuffisante pour A6, A5, A4, A3, affiche, flyer ou roll-up.", "Impression & supports", "Vérifier la résolution d'une image pour impression | Art Visions", "Calculez gratuitement les dimensions, le ratio, le DPI estimé et la taille maximale d'impression à 300 DPI ou 150 DPI.", { label: "Un doute sur votre fichier d'impression ? Demandez une vérification Art Visions.", href: "/devis-sur-mesure" }, [service.print, service.design], ["gabarit-impression", "redimensionner-image", "createur-affiche-qr-code", "creer-flyer"], "#059669"],
  ["gabarit-impression", "Ruler", "Générateur de gabarits d'impression", "Créez des gabarits avec format final, fond perdu et zone de sécurité.", "Sélectionnez carte de visite, flyer, affiche, dépliant, brochure, sticker, carte PVC ou invitation puis téléchargez un PDF/SVG.", "Impression & supports", "Gabarit impression gratuit avec fond perdu | Art Visions", "Générez gratuitement un gabarit d'impression PDF ou SVG avec dimensions, fond perdu, zone de sécurité et repères.", printCta, [service.print, service.design], ["verificateur-resolution-image-impression", "carte-de-visite-gratuite", "creer-flyer", "createur-menu-restaurant"], "#CD7942"],
  ["generateur-mockup", "PanelsTopLeft", "Créateur de mockups", "Prévisualisez un logo sur carte de visite, t-shirt, tote bag, mug ou enseigne.", "Importez un logo ou design et obtenez un mockup navigateur fiable, exportable en image, sans prétendre à un rendu IA photoréaliste.", "Identité visuelle", "Générateur de mockup gratuit pour logo | Art Visions", "Créez gratuitement des mockups de logo sur carte de visite, t-shirt, tote bag, enseigne, packaging, mug, flyer ou vitrine.", { label: "Besoin de mockups professionnels pour votre marque ?", href: "/identite-visuelle" }, [service.identity, service.signage], ["createur-charte-graphique", "carte-de-visite-gratuite", "createur-visuel-produit", "generateur-palette-couleurs"], "#6348E5"],
  ["createur-affiche-horaires", "Clock", "Créateur d'affiche d'horaires", "Affichez vos horaires d'ouverture, fermetures, contacts et réseaux sociaux.", "Créez une affiche d'horaires pour boutique, restaurant, café, salon, cabinet ou garage et exportez-la en PNG/PDF.", "Impression & supports", "Affiche horaires ouverture gratuite à imprimer | Art Visions", "Créez gratuitement une affiche d'horaires d'ouverture pour commerce, restaurant, salon, cabinet ou garage avec export PDF et PNG.", printCta, [service.print, service.signage], ["createur-affiche-qr-code", "generateur-grille-tarifaire", "gabarit-impression", "verificateur-resolution-image-impression"], "#059669"],
  ["redimensionner-image", "Crop", "Redimensionneur de visuels", "Adaptez une image aux formats Instagram, Facebook, LinkedIn, YouTube et TikTok.", "Importez une image une seule fois, ajustez le cadrage, le zoom et le fond, puis téléchargez les formats réseaux sociaux.", "Marketing & réseaux sociaux", "Redimensionner une image en ligne gratuitement | Art Visions", "Redimensionnez gratuitement une photo pour Instagram, Story, Facebook, LinkedIn, YouTube, TikTok et Google Business avec export PNG.", socialCta, [service.social, service.design], ["createur-visuel-produit", "planificateur-publications", "verificateur-resolution-image-impression", "generateur-caption-instagram"], "#BA3184"],
  ["planificateur-publications", "CalendarDays", "Planificateur de publications", "Générez un calendrier de contenus selon votre activité et vos objectifs.", "Choisissez secteur, plateformes, fréquence, période et objectif pour obtenir un planning éditorial exportable en CSV/PDF.", "Marketing & réseaux sociaux", "Calendrier éditorial gratuit pour réseaux sociaux | Art Visions", "Générez gratuitement un planning de publications Instagram, Facebook, LinkedIn ou TikTok avec idées, formats, CTA et statut.", socialCta, [service.social, service.design], ["createur-visuel-produit", "redimensionner-image", "generateur-caption-instagram", "generateur-bio-instagram"], "#6348E5"],
  ["createur-charte-graphique", "SwatchBook", "Créateur de mini-charte graphique", "Générez une mini charte avec logo, couleurs, typographies et usages simples.", "Ajoutez votre marque, votre logo, vos couleurs et vos polices pour obtenir une base d'identité visuelle exportable en PDF.", "Identité visuelle", "Créateur de charte graphique gratuite | Art Visions", "Créez gratuitement une mini-charte graphique avec logo, palette HEX/RGB, typographies, exemples d'usage et export PDF.", identityCta, [service.identity, service.logo], ["generateur-palette-couleurs", "generateur-mockup", "generateur-signature-email", "carte-de-visite-gratuite"], "#D72888"],
  ["createur-visuel-produit", "BadgePercent", "Créateur de visuel produit", "Créez un visuel promotionnel avec photo produit, prix, remise et CTA.", "Importez une photo produit et un logo, ajoutez prix, ancien prix, promotion et texte court, puis exportez en PNG/JPG.", "Marketing & réseaux sociaux", "Créer un visuel produit gratuit pour Instagram | Art Visions", "Créez gratuitement un visuel publicitaire produit pour Instagram, Facebook, Story ou promotion carrée avec export PNG/JPG.", socialCta, [service.social, service.design], ["redimensionner-image", "planificateur-publications", "generateur-caption-instagram", "generateur-mockup"], "#CD7942"],
  ["generateur-brief-site-web", "FileQuestion", "Générateur de brief site web", "Un questionnaire qui transforme vos besoins en brief de site professionnel.", "Décrivez votre activité, objectifs, pages, fonctionnalités, langues, e-commerce, SEO, contenus et inspirations pour obtenir un brief clair.", "Web & entreprise", "Générateur de brief site web gratuit | Cahier des charges - Art Visions", "Créez gratuitement un brief ou cahier des charges de site web avec objectifs, pages, fonctionnalités, SEO, contenus, délai et budget.", { label: "Vous avez votre brief ? Demandez maintenant votre devis à Art Visions.", href: "/devis-sur-mesure" }, [service.web, service.identity], ["generateur-brief-logo", "createur-charte-graphique", "planificateur-publications", "generateur-slogan"], "#6C2BD9"],
].map((item, index) => {
  const [slug, icon, title, shortDesc, seoText, category, seoTitle, seoDescription, cta, relatedServices, relatedToolSlugs, accent] = item as [
    string,
    string,
    string,
    string,
    string,
    ToolCategory,
    string,
    string,
    ToolDef["cta"],
    ToolDef["relatedServices"],
    string[],
    string,
  ];

  return {
    slug,
    icon,
    title,
    shortDesc,
    seoText,
    category,
    seoTitle,
    seoDescription,
    cta,
    relatedServices,
    relatedToolSlugs,
    faq: [
      { question: "L'outil est-il gratuit ?", answer: "Oui. Vous pouvez créer, prévisualiser et exporter votre support gratuitement, sans inscription obligatoire." },
      { question: "Mes fichiers sont-ils envoyés à Art Visions ?", answer: "Non. Quand l'outil utilise une image ou un logo, le traitement reste dans votre navigateur autant que possible." },
    ],
    accent,
    order: 11 + index,
    live: true,
  };
});

tools.push(...newTools);

export const toolsByOrder = [...tools].sort((a, b) => a.order - b.order);

export function getTool(slug: string): ToolDef | undefined {
  return tools.find((t) => t.slug === slug);
}

export const toolCategories: ToolCategory[] = [
  "Carrière",
  "Impression & supports",
  "Identité visuelle",
  "Marketing & réseaux sociaux",
  "Web & entreprise",
];

export function toolUrl(slug: string): string {
  return `${TOOLS_BASE_PATH}/${slug}`;
}
