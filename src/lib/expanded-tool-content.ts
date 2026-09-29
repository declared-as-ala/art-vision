import { getTool } from "./tools";

export type SearchIntent = {
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  intent: string;
  competitors: string;
  gap: string;
};

export type ToolLandingContent = {
  howItWorks: string[];
  useCases: string[];
  benefits: string[];
  advice: string[];
  examples: string[];
  search: SearchIntent;
};

const defaultContent = (slug: string): ToolLandingContent => {
  const tool = getTool(slug);
  const title = tool?.title.toLowerCase() ?? "outil gratuit";

  return {
    howItWorks: [
      "Remplissez les champs principaux avec les informations de votre entreprise.",
      "Choisissez un modèle, une couleur et les options utiles à votre support.",
      "Contrôlez l'aperçu en direct, corrigez les détails, puis exportez votre fichier.",
    ],
    useCases: [
      "Entrepreneurs qui veulent obtenir un premier support propre sans logiciel complexe.",
      "Commerçants, restaurants, artisans et freelances qui doivent communiquer rapidement.",
      "Équipes marketing qui veulent préparer un brouillon avant une finition professionnelle.",
    ],
    benefits: [
      "Un résultat immédiat, gratuit et sans inscription obligatoire.",
      "Une base visuelle cohérente avec votre marque et exploitable pour l'impression ou le web.",
      "Un passage naturel vers une création Art Visions lorsque le support doit devenir premium.",
    ],
    advice: [
      "Gardez des textes courts : un support efficace se lit en quelques secondes.",
      "Utilisez des couleurs contrastées pour préserver la lisibilité.",
      "Avant impression, vérifiez les marges, les fautes et la qualité des images importées.",
    ],
    examples: [
      `Créer un ${title} pour une nouvelle offre.`,
      `Préparer un ${title} avant une ouverture ou une campagne locale.`,
      `Tester plusieurs variantes avant de demander une version professionnelle.`,
    ],
    search: {
      primaryKeyword: title,
      secondaryKeywords: ["outil gratuit", "modèle personnalisable", "export PDF"],
      longTailKeywords: [`créer ${title} en ligne`, `${title} à imprimer`, `${title} gratuit sans inscription`],
      intent: "Créer rapidement un support utilisable, avec modèle et export.",
      competitors: "Pages de générateurs gratuits, modèles Canva/Excel/Notion et articles modèles.",
      gap: "Combiner un vrai outil, des conseils pratiques et un CTA de service local sans forcer l'inscription.",
    },
  };
};

export const landingContent: Record<string, ToolLandingContent> = {
  "createur-menu-restaurant": {
    ...defaultContent("createur-menu-restaurant"),
    useCases: ["Restaurant qui refait sa carte saisonnière.", "Snack ou pizzeria qui veut une carte A4 simple.", "Café ou salon de thé qui prépare une carte boissons et desserts."],
    advice: ["Regroupez les plats en 4 à 6 catégories maximum.", "Indiquez les prix clairement avec la même ponctuation partout.", "Gardez une version courte pour l'impression et une version plus détaillée pour le QR code."],
    search: {
      primaryKeyword: "créateur menu restaurant gratuit",
      secondaryKeywords: ["créer menu restaurant", "menu restaurant PDF", "carte restaurant à imprimer"],
      longTailKeywords: ["faire un menu restaurant gratuit en ligne", "modèle menu restaurant avec prix", "menu pizzeria à imprimer"],
      intent: "Créer et télécharger un menu imprimable, souvent sans compétence graphique.",
      competitors: "Générateurs spécialisés restaurant, modèles Canva et outils de menu QR.",
      gap: "Proposer un export imprimable avec conseils de lisibilité et liens vers QR, gabarit et impression.",
    },
  },
  "generateur-signature-email": {
    ...defaultContent("generateur-signature-email"),
    advice: ["Préférez une signature légère en tableau HTML.", "Évitez de mettre toute la signature dans une seule image.", "Testez le rendu dans Gmail et Outlook avant de la déployer à toute l'équipe."],
    search: {
      primaryKeyword: "générateur signature mail",
      secondaryKeywords: ["signature email gratuite", "signature Gmail", "signature Outlook"],
      longTailKeywords: ["créer signature mail professionnelle HTML", "signature email avec logo gratuit", "copier signature email Outlook"],
      intent: "Obtenir une signature HTML prête à copier dans une messagerie.",
      competitors: "Générateurs de signatures hébergés, CRM, outils SaaS français.",
      gap: "Fournir un HTML simple, sans tracking, avec explications d'installation claires.",
    },
  },
  "verificateur-resolution-image-impression": {
    ...defaultContent("verificateur-resolution-image-impression"),
    advice: ["Visez 300 DPI pour les supports lus de près.", "Pour un grand poster vu à distance, 150 DPI peut suffire.", "Ne confondez pas poids du fichier et qualité d'impression : les pixels disponibles comptent vraiment."],
    search: {
      primaryKeyword: "résolution image impression",
      secondaryKeywords: ["calcul DPI impression", "image 300 DPI", "taille image impression"],
      longTailKeywords: ["quelle résolution pour imprimer une photo", "vérifier qualité image impression", "taille maximale impression 300 DPI"],
      intent: "Savoir si une image est assez grande pour un format imprimé.",
      competitors: "Articles pédagogiques DPI, calculateurs techniques et imprimeurs.",
      gap: "Donner un verdict clair par format courant, pas seulement une formule.",
    },
  },
  "planificateur-publications": {
    ...defaultContent("planificateur-publications"),
    advice: ["Alternez contenus utiles, preuve sociale, coulisses et offres.", "Gardez une fréquence réaliste plutôt qu'un planning impossible à tenir.", "Associez chaque publication à un objectif mesurable."],
    search: {
      primaryKeyword: "calendrier éditorial gratuit",
      secondaryKeywords: ["planning réseaux sociaux", "planning publication Instagram", "calendrier contenu social media"],
      longTailKeywords: ["générer calendrier éditorial Instagram", "planning publications réseaux sociaux gratuit", "calendrier éditorial PME"],
      intent: "Transformer une stratégie de contenu en dates, formats et idées.",
      competitors: "Templates Notion/Excel, articles de planning et générateurs de marronniers.",
      gap: "Produire un calendrier directement adapté au secteur, à l'objectif et aux plateformes.",
    },
  },
};

export function getLandingContent(slug: string): ToolLandingContent {
  return landingContent[slug] ?? defaultContent(slug);
}
