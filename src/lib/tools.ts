// ──────────────────────────────────────────────────────────────────────────
// OUTILS GRATUITS — central registry (single source of truth)
// Used by: /outils-gratuits directory, each tool page (metadata, breadcrumb,
// FAQ, related), the sitemap and the admin dashboard.
// No client-only imports here so it can be used in Server Components & route
// handlers. Icons are referenced by name and resolved client-side.
// ──────────────────────────────────────────────────────────────────────────

export const TOOLS_BASE_PATH = "/outils-gratuits";

export type ToolCategory =
  | "Carrière"
  | "Identité de marque"
  | "Marketing digital"
  | "Impression";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDef {
  /** url slug, also used as toolType in the DB */
  slug: string;
  /** lucide-react icon name (resolved on the client) */
  icon: string;
  title: string;
  /** short marketing description shown on the card */
  shortDesc: string;
  /** longer SEO-friendly blurb shown on the card / hero */
  seoText: string;
  category: ToolCategory;
  /** <title> tag for the dedicated page */
  seoTitle: string;
  seoDescription: string;
  /** main CTA below the tool */
  cta: { label: string; href: string };
  /** related Art Vision service routes for internal linking */
  relatedServices: { label: string; href: string }[];
  faq: ToolFaq[];
  /** accent used for the card glow */
  accent: string;
  /** order in the grid */
  order: number;
  /** whether the generator is fully interactive (vs. coming soon) */
  live: boolean;
}

export const tools: ToolDef[] = [
  {
    slug: "cv-gratuit",
    icon: "FileText",
    title: "Générateur de CV",
    shortDesc: "Créez un CV professionnel et design, prêt à imprimer en PDF.",
    seoText:
      "Modèles de CV modernes, aperçu en direct, export PDF gratuit. Choisissez un style, vos couleurs et téléchargez instantanément.",
    category: "Carrière",
    seoTitle: "Créer un CV gratuit en ligne | Modèles CV professionnels - Art Vision",
    seoDescription:
      "Créez gratuitement un CV professionnel en ligne avec Art Vision : modèles modernes, aperçu en direct, couleurs personnalisables et export PDF immédiat.",
    cta: { label: "Besoin d'un CV encore plus professionnel ? Contactez Art Vision.", href: "/contact" },
    relatedServices: [
      { label: "Design graphique", href: "/design-graphique" },
      { label: "Identité visuelle", href: "/identite-visuelle" },
    ],
    faq: [
      { question: "Le générateur de CV est-il vraiment gratuit ?", answer: "Oui. Vous créez, prévisualisez et téléchargez votre CV au format PDF gratuitement, sans inscription obligatoire." },
      { question: "Puis-je personnaliser les couleurs et le modèle ?", answer: "Absolument. Plusieurs modèles sont disponibles et vous pouvez choisir une couleur d'accent adaptée à votre métier." },
      { question: "Mes données sont-elles conservées ?", answer: "Vos données ne sont enregistrées que si vous le demandez explicitement. Aucun envoi n'est fait sans votre consentement." },
    ],
    accent: "#6C2BD9",
    order: 1,
    live: true,
  },
  {
    slug: "carte-de-visite-gratuite",
    icon: "CreditCard",
    title: "Générateur de carte de visite",
    shortDesc: "Concevez une carte de visite recto-verso prête à imprimer (85×55 mm).",
    seoText:
      "Créez une carte de visite professionnelle avec logo, QR code vCard et aperçu recto-verso. Export PNG/PDF au format d'impression standard.",
    category: "Identité de marque",
    seoTitle: "Créer une carte de visite gratuite en ligne | Art Vision",
    seoDescription:
      "Générez gratuitement votre carte de visite professionnelle : logo, QR code vCard, modèles premium, aperçu recto-verso et export PNG/PDF prêt à imprimer.",
    cta: { label: "Commander l'impression de vos cartes", href: "/impression" },
    relatedServices: [
      { label: "Impression", href: "/impression" },
      { label: "Création de logo", href: "/creation-logo-professionnel" },
    ],
    faq: [
      { question: "Quel format pour l'impression ?", answer: "Les cartes sont générées au format standard 85×55 mm, prêtes pour l'impression professionnelle." },
      { question: "Puis-je ajouter mon logo et un QR code ?", answer: "Oui, vous pouvez importer votre logo et générer un QR code vCard que l'on scanne pour enregistrer vos coordonnées." },
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
    seoText:
      "Générez gratuitement un QR code aux couleurs de votre marque pour votre site, WhatsApp, Instagram, menu, Wi-Fi ou contact vCard. Export PNG, SVG et PDF.",
    category: "Marketing digital",
    seoTitle: "Générateur QR Code gratuit en ligne | Art Vision",
    seoDescription:
      "Créez gratuitement un QR code personnalisé (URL, WhatsApp, Instagram, vCard, Wi-Fi…) aux couleurs de votre marque. Téléchargement PNG, SVG et PDF haute qualité.",
    cta: { label: "Besoin d'un support QR professionnel ? Demander un devis.", href: "/devis-sur-mesure" },
    relatedServices: [
      { label: "Impression", href: "/impression" },
      { label: "Design graphique", href: "/design-graphique" },
    ],
    faq: [
      { question: "Les QR codes générés expirent-ils ?", answer: "Non. Les QR codes sont statiques : ils encodent directement votre information et fonctionnent indéfiniment." },
      { question: "Puis-je mettre mon logo au centre ?", answer: "Oui, vous pouvez importer un logo qui sera placé au centre du QR code avec un niveau de correction d'erreur adapté." },
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
    seoText:
      "Créez une palette de couleurs cohérente pour votre marque : couleur primaire, secondaire, accent et neutres. Codes HEX, RGB, HSL et contrôle du contraste.",
    category: "Identité de marque",
    seoTitle: "Générateur de palette de couleurs gratuit | Art Vision",
    seoDescription:
      "Générez gratuitement une palette de couleurs professionnelle à partir d'une couleur ou d'une image. Codes HEX/RGB/HSL, vérification du contraste et export.",
    cta: { label: "Vous voulez une identité visuelle complète ?", href: "/identite-visuelle" },
    relatedServices: [
      { label: "Identité visuelle", href: "/identite-visuelle" },
      { label: "Création de logo", href: "/creation-logo-professionnel" },
    ],
    faq: [
      { question: "Comment extraire les couleurs d'un logo ?", answer: "Importez votre image : l'outil analyse les pixels et propose les couleurs dominantes ainsi qu'une palette harmonisée." },
      { question: "Qu'est-ce que la vérification du contraste ?", answer: "Elle indique si une couleur de texte reste lisible sur un fond donné, selon les recommandations d'accessibilité WCAG." },
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
    seoText:
      "Préparez un brief de logo complet en quelques étapes : secteur, cible, personnalité de marque, styles et couleurs. Téléchargez un PDF professionnel.",
    category: "Identité de marque",
    seoTitle: "Créer un brief logo gratuit en ligne | Art Vision",
    seoDescription:
      "Générez gratuitement un brief de logo professionnel grâce à un questionnaire guidé. Téléchargez un PDF clair à partager avec votre graphiste ou Art Vision.",
    cta: { label: "Recevez une proposition pour votre logo.", href: "/creation-logo-professionnel" },
    relatedServices: [
      { label: "Création de logo", href: "/creation-logo-professionnel" },
      { label: "Identité visuelle", href: "/identite-visuelle" },
    ],
    faq: [
      { question: "À quoi sert un brief de logo ?", answer: "Il rassemble toutes les informations utiles (cible, style, valeurs) pour que le designer crée un logo aligné sur votre marque dès le premier essai." },
      { question: "Puis-je l'envoyer directement à Art Vision ?", answer: "Oui. Vous pouvez télécharger le PDF et nous l'envoyer, ou demander une proposition directement depuis l'outil." },
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
    seoText:
      "Trouvez un slogan accrocheur pour votre entreprise. Choisissez le ton (premium, moderne, amical…) et obtenez instantanément des dizaines de propositions.",
    category: "Identité de marque",
    seoTitle: "Générateur de slogan gratuit pour entreprise | Art Vision",
    seoDescription:
      "Générez gratuitement des idées de slogans pour votre entreprise selon votre secteur, votre ton et vos mots-clés. Copiez et enregistrez vos slogans préférés.",
    cta: { label: "Créer une identité de marque complète.", href: "/identite-visuelle" },
    relatedServices: [
      { label: "Identité visuelle", href: "/identite-visuelle" },
      { label: "Community management", href: "/community-management" },
    ],
    faq: [
      { question: "Les slogans sont-ils générés par IA ?", answer: "L'outil utilise un moteur intelligent : avec une clé d'API IA configurée, les slogans sont enrichis ; sinon un générateur basé sur des structures éprouvées prend le relais." },
      { question: "Puis-je réutiliser librement un slogan ?", answer: "Oui, les suggestions vous appartiennent. Nous vous recommandons une vérification d'antériorité avant un dépôt de marque." },
    ],
    accent: "#6C2BD9",
    order: 6,
    live: true,
  },
  {
    slug: "generateur-bio-instagram",
    icon: "Instagram",
    title: "Générateur de bio Instagram",
    shortDesc: "3 à 5 bios Instagram optimisées avec emojis et appel à l'action.",
    seoText:
      "Rédigez une bio Instagram professionnelle qui convertit : activité, ville, services, ton et CTA. Compteur de caractères et options d'emojis inclus.",
    category: "Marketing digital",
    seoTitle: "Générateur de bio Instagram professionnelle gratuit | Art Vision",
    seoDescription:
      "Créez gratuitement une bio Instagram percutante pour votre entreprise : ton personnalisable, emojis, appel à l'action et respect de la limite de caractères.",
    cta: { label: "Besoin d'une stratégie Instagram professionnelle ?", href: "/community-management" },
    relatedServices: [
      { label: "Community management", href: "/community-management" },
      { label: "Design graphique", href: "/design-graphique" },
    ],
    faq: [
      { question: "Quelle est la limite de caractères d'une bio Instagram ?", answer: "Instagram limite la bio à 150 caractères. L'outil affiche un compteur en direct pour rester dans la limite." },
      { question: "Puis-je ajouter des emojis ?", answer: "Oui, vous pouvez activer ou désactiver les emojis selon le ton souhaité." },
    ],
    accent: "#D72888",
    order: 7,
    live: true,
  },
  {
    slug: "generateur-caption-instagram",
    icon: "Hash",
    title: "Captions & hashtags Instagram",
    shortDesc: "Légendes courtes/longues + 15 à 25 hashtags pertinents.",
    seoText:
      "Générez des légendes Instagram engageantes et une sélection de hashtags pertinents selon votre type de publication (promo, ouverture, nouveauté…).",
    category: "Marketing digital",
    seoTitle: "Générateur de captions et hashtags Instagram gratuit | Art Vision",
    seoDescription:
      "Créez gratuitement des légendes Instagram (courte et longue), des appels à l'action et 15 à 25 hashtags pertinents pour vos publications professionnelles.",
    cta: { label: "Créer vos visuels et contenus sociaux avec Art Vision.", href: "/community-management" },
    relatedServices: [
      { label: "Community management", href: "/community-management" },
      { label: "Motion design", href: "/motion-design" },
    ],
    faq: [
      { question: "Combien de hashtags faut-il utiliser ?", answer: "Entre 15 et 25 hashtags ciblés est un bon équilibre. L'outil propose un mix de hashtags larges et de niche." },
      { question: "Les légendes sont-elles en français ?", answer: "Oui, tous les contenus sont générés en français par défaut, adaptés à votre activité." },
    ],
    accent: "#6C2BD9",
    order: 8,
    live: true,
  },
  {
    slug: "creer-flyer",
    icon: "Image",
    title: "Créateur de flyer",
    shortDesc: "4 modèles (promo, ouverture, événement, nouveauté) à personnaliser.",
    seoText:
      "Créez un flyer professionnel en ligne : titre, offre, date, lieu, image et logo. Aperçu en direct et export PNG/PDF prêt à partager ou imprimer.",
    category: "Marketing digital",
    seoTitle: "Créer un flyer gratuit en ligne | Modèles personnalisables - Art Vision",
    seoDescription:
      "Créez gratuitement un flyer professionnel avec nos modèles (promotion, ouverture, événement, nouveauté). Personnalisez, prévisualisez et exportez en PNG/PDF.",
    cta: { label: "Demander une version professionnelle ou une impression.", href: "/impression" },
    relatedServices: [
      { label: "Impression", href: "/impression" },
      { label: "Design graphique", href: "/design-graphique" },
    ],
    faq: [
      { question: "Puis-je imprimer le flyer ?", answer: "Oui, l'export haute résolution est adapté au partage digital comme à l'impression. Pour un rendu pro, demandez un devis d'impression." },
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
    shortDesc: "Estimez le prix de vos flyers, affiches, bâches, cartes…",
    seoText:
      "Estimez instantanément le coût de votre impression : produit, format, quantité, papier et finition. Estimation indicative, devis final après validation.",
    category: "Impression",
    seoTitle: "Calculateur de prix impression gratuit | Flyers, affiches, cartes - Art Vision",
    seoDescription:
      "Calculez gratuitement une estimation du prix d'impression de vos flyers, affiches, bâches, panneaux, catalogues et cartes de visite. Devis final après validation.",
    cta: { label: "Recevoir mon devis impression", href: "/devis-sur-mesure" },
    relatedServices: [
      { label: "Impression", href: "/impression" },
    ],
    faq: [
      { question: "L'estimation est-elle un prix définitif ?", answer: "Non. Il s'agit d'une estimation indicative. Le devis final est établi après validation de votre fichier et de vos options exactes." },
      { question: "Quels produits sont couverts ?", answer: "Flyers, affiches, bâches, panneaux publicitaires, catalogues et cartes de visite, avec différents formats et finitions." },
    ],
    accent: "#D72888",
    order: 10,
    live: true,
  },
];

export const toolsByOrder = [...tools].sort((a, b) => a.order - b.order);

export function getTool(slug: string): ToolDef | undefined {
  return tools.find((t) => t.slug === slug);
}

export const toolCategories: ToolCategory[] = [
  "Carrière",
  "Identité de marque",
  "Marketing digital",
  "Impression",
];

export function toolUrl(slug: string): string {
  return `${TOOLS_BASE_PATH}/${slug}`;
}
