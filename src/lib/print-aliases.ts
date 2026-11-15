import catalog from "@/data/impression-catalog.json";
import products from "@/data/impression-products.json";

export type PriceRow = { format: string; dimension: string; prices: Record<string, string | null> };
export type PriceCategory = { id: string; title: string; name: string; quantities: string[]; rows: PriceRow[] };
export type ProductData = {
  title: string;
  source: string;
  scrapedAt: string;
  fileGuidelines: {
    acceptedFormats: string[];
    quality: string;
    bleed: string;
    technicalCheck: string;
    production: string;
    shipping: string;
    express: string;
  };
  categories: PriceCategory[];
};

const productData = products as Record<string, ProductData>;


// Mapping aliases: singular requested SEO URLs -> catalog data keys
export const ALIAS_MAP: Record<
  string,
  {
    catalogSlug: string;
    canonicalSlug: string;
    label: string;
    h1: string;
    intro: string;
    faqs?: { question: string; answer: string }[];
  }
> = {
  "carte-de-visite": {
    catalogSlug: "cartes-de-visite",
    canonicalSlug: "carte-de-visite",
    label: "Cartes de Visite Professionnelles",
    h1: "Impression de Carte de Visite Professionnelle & Personnalisée",
    intro:
      "Faites une première impression marquante. Impression haute fidélité sur papier 350g ou 400g couché, finitions luxe (pelliculage Soft Touch, vernis sélectif 3D, dorure) au format standard 85×55 mm.",
    faqs: [
      {
        question: "Quel papier choisir pour une carte de visite professionnelle ?",
        answer:
          "Le papier 350g couché demi-mat est le standard de référence pour un équilibre parfait entre rigidité et élégance. Pour un toucher ultra-luxueux, optez pour le 400g avec pelliculage Soft Touch (effet peau de pêche).",
      },
      {
        question: "Quel format respecter pour l'impression en France ?",
        answer:
          "Le format carte bancaire standard en France et en Europe est de 85 × 55 mm. Prévoyez 2 mm de fond perdu tout autour (fichier fourni à 89 × 59 mm) et conservez vos textes à 3 mm du bord de coupe.",
      },
      {
        question: "Puis-je commander une impression après avoir créé ma maquette sur votre outil gratuit ?",
        answer:
          "Oui, absolument ! Exportez votre maquette ou PDF haute définition depuis notre générateur gratuit de carte de visite, puis transmettez-la à notre atelier. Nos graphistes effectuent un contrôle PAO gratuit avant lancement.",
      },
    ],
  },
  "cartes-de-visite": {
    catalogSlug: "cartes-de-visite",
    canonicalSlug: "carte-de-visite",
    label: "Cartes de Visite Professionnelles",
    h1: "Impression de Cartes de Visite Professionnelles",
    intro:
      "Impression de cartes de visite de haute qualité. Formats 85×55 mm, papiers 350g/400g, finitions vernis 3D et dorure avec contrôle PAO inclus.",
  },
  flyer: {
    catalogSlug: "flyers",
    canonicalSlug: "flyer",
    label: "Flyers & Prospectus Publicitaires",
    h1: "Impression de Flyers Publicitaires au Meilleur Prix",
    intro:
      "Communiquez massivement avec des flyers A6, A5 ou A4 sur papier 135g à 300g couché brillant ou mat. Contrôle PAO gratuit et livraison express partout en France.",
    faqs: [
      {
        question: "Quel grammage choisir pour un flyer ?",
        answer:
          "Le 135g couché brillant est idéal pour la distribution en boîte aux lettres ou le street-marketing économique. Le 170g apporte plus de tenue en présentoir, et le 250g/300g est parfait pour des tracts publicitaires haut de gamme.",
      },
      {
        question: "Quels sont les délais de livraison pour les flyers ?",
        answer:
          "La production standard est de 2 à 3 jours ouvrables après validation du BAT, suivie d'une expédition sous 24 à 48h.",
      },
    ],
  },
  affiche: {
    catalogSlug: "affiches",
    canonicalSlug: "affiche",
    label: "Affiches & Posters Publicitaires",
    h1: "Impression d'Affiches Publicitaires Haute Définition",
    intro:
      "Impression d'affiches intérieures et extérieures en formats A3, A2, A1 et A0. Rendu couleur éclatant et papier résistant 135g à 250g.",
  },
  brochure: {
    catalogSlug: "brochures",
    canonicalSlug: "brochure",
    label: "Brochures & Plaquettes d'Entreprise",
    h1: "Impression de Brochures et Plaquettes Commerciales",
    intro:
      "Présentez vos services avec des brochures reliées par piqûre à cheval ou dos carré collé. Papiers de 135g à 250g avec couverture pelliculée.",
  },
  depliant: {
    catalogSlug: "depliants",
    canonicalSlug: "depliant",
    label: "Dépliants Publicitaires 2 & 3 Volets",
    h1: "Impression de Dépliants Publicitaires 2 ou 3 Volets",
    intro:
      "Dépliants A4 ou A5 avec pli simple, pli roulé ou pli accordéon. Idéal pour menus de restaurant, fiches techniques et plaquettes d'offres.",
  },
  catalogue: {
    catalogSlug: "brochures",
    canonicalSlug: "catalogue",
    label: "Catalogues Produits & Magalogs",
    h1: "Impression de Catalogues Produits Multi-Pages",
    intro:
      "Catalogues d'entreprise multi-pages haute pagination. Façonnage robuste, couleurs fidèles et finitions soignées pour sublimer vos collections.",
  },
  bache: {
    catalogSlug: "baches",
    canonicalSlug: "bache",
    label: "Bâches & Banderoles Publicitaires",
    h1: "Impression de Bâches & Banderoles avec Œillets",
    intro:
      "Bâches publicitaires résistantes aux intempéries (PVC 500g ou micro-perforé Mesh). Œillets de fixation en laiton renforcé tous les 50 cm inclus.",
  },
  panneau: {
    catalogSlug: "panneaux",
    canonicalSlug: "panneau",
    label: "Panneaux Publicitaires & Signalétique",
    h1: "Impression de Panneaux Publicitaires Akilux & Alu Dibond",
    intro:
      "Panneaux de chantier légers en polypropylène alvéolaire Akilux, panneaux rigides PVC Forex ou plaques de façade en Alu Dibond inaltérables.",
  },
  "roll-up": {
    catalogSlug: "roll-up",
    canonicalSlug: "roll-up",
    label: "Roll-Up & Kakemonos Enrouleurs",
    h1: "Impression de Roll-Up Publicitaire & Totem Enrouleur",
    intro:
      "Structure aluminium légère avec housse de transport rembourrée. Toile anti-reflet et anti-incurvation pour vos salons, foires et événements.",
  },
  kakemono: {
    catalogSlug: "roll-up",
    canonicalSlug: "kakemono",
    label: "Kakemonos Publicitaires & Bannières Suspendues",
    h1: "Impression de Kakemonos & Bannières Événementielles",
    intro:
      "Supports verticaux élégants suspendus ou autoportants pour points de vente, salons professionnels et showrooms d'entreprise.",
  },
  "marque-pages": {
    catalogSlug: "marque-pages",
    canonicalSlug: "marque-pages",
    label: "Marque-pages Personnalisés",
    h1: "Impression de Marque-pages Professionnels & Personnalisés",
    intro:
      "Sublimez vos éditions, événements littéraires ou cadeaux clients avec des marque-pages imprimés sur carton rigide FSC 300g, avec option vernis UV protecteur ou carton recyclé.",
    faqs: [
      {
        question: "Quels sont les formats recommandés pour un marque-page ?",
        answer:
          "Le format classique de référence est 50 × 200 mm ou 55 × 210 mm. Il s'insère parfaitement dans un livre de poche ou un ouvrage relié sans dépasser excessivement.",
      },
      {
        question: "Quel grammage choisir pour un marque-page rigide ?",
        answer:
          "Un grammage d'au moins 300 g/m² FSC ou recyclé est recommandé pour assurer une tenue irréprochable et éviter tout écornage lors des manipulations répétées.",
      },
      {
        question: "Quelles finitions sont disponibles ?",
        answer:
          "Vous pouvez opter pour un vernis UV brillant recto/verso, un pelliculage mat soft-touch ou un support texturé écologique selon l'image de votre marque.",
      },
    ],
  },
  autocollant: {
    catalogSlug: "autocollants",
    canonicalSlug: "autocollant",
    label: "Autocollants & Stickers Personnalisés",
    h1: "Impression d'Autocollants & Stickers Vinyle Haute Adhérence",
    intro:
      "Stickers publicitaires découpés à la forme, étiquettes adhésives en rouleau ou vinyles pour packaging et vitrine. Résistance UV et intempéries garantie.",
  },
};

export function resolveSlug(slug: string) {
  const alias = ALIAS_MAP[slug];
  const catalogSlug = alias ? alias.catalogSlug : slug;
  const product = catalog.products.find((item) => item.slug === catalogSlug);
  const data = productData[catalogSlug];
  return { alias, product, data, effectiveSlug: catalogSlug };
}

