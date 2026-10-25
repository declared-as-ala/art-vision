export type Tool = {
  slug: string;
  name: string;
  text: string;
  seoTitle: string;
  seoDescription: string;
  tone: string; // tailwind bg class
  about: string;
};

// Only tools that actually work in the app are listed.
export const TOOLS: Tool[] = [
  {
    slug: "generateur-palette-couleurs",
    name: "Générateur de palette de couleurs",
    text: "Partez d'une couleur et obtenez des harmonies prêtes à l'emploi.",
    seoTitle: "Générateur de palette de couleurs pour logo et marque | Art Visions",
    seoDescription: "Choisissez une couleur de base et générez des palettes complémentaires, analogues ou triadiques, avec codes HEX et contraste.",
    tone: "bg-brand",
    about: "Une palette cohérente est la base d'une identité visuelle. Les harmonies sont calculées à partir de la teinte de départ ; vérifiez toujours le contraste du texte avant de les utiliser.",
  },
  {
    slug: "generateur-qr-code",
    name: "Générateur de QR code",
    text: "Créez un QR code pour menu, site ou contact et téléchargez-le.",
    seoTitle: "Générateur de QR code gratuit (PNG et SVG) | Art Visions",
    seoDescription: "Créez un QR code gratuit pour votre menu, site web ou lien WhatsApp. Téléchargement en PNG ou SVG, sans inscription.",
    tone: "bg-indigo",
    about: "Le QR code est généré directement dans votre navigateur : votre lien n'est envoyé nulle part. Testez-le avec plusieurs téléphones avant impression.",
  },
  {
    slug: "generateur-brief-logo",
    name: "Générateur de brief logo",
    text: "Structurez votre demande de logo en quelques questions.",
    seoTitle: "Générateur de brief logo : préparez votre demande | Art Visions",
    seoDescription: "Répondez à quelques questions et obtenez un brief de logo clair à envoyer à un designer ou à Art Visions.",
    tone: "bg-copper",
    about: "Un brief précis réduit les allers-retours et améliore le résultat. Copiez le texte généré ou envoyez-le-nous avec votre demande de devis.",
  },
  {
    slug: "generateur-slogan",
    name: "Générateur de slogan",
    text: "Des idées de slogans de départ pour votre activité.",
    seoTitle: "Générateur de slogan pour entreprise | Art Visions",
    seoDescription: "Obtenez des idées de slogans à partir de votre activité et de votre promesse principale. Un point de départ à affiner.",
    tone: "bg-violet",
    about: "Ces propositions sont des points de départ construits sur des structures éprouvées. Un bon slogan se travaille : gardez-le court et vérifiable.",
  },
];

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
