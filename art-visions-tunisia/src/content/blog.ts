export type Block =
  | { t: "h2"; v: string }
  | { t: "p"; v: string }
  | { t: "ul"; v: string[] }
  | { t: "tip"; v: string };

export type Article = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  date: string; // ISO
  readMinutes: number;
  service: string; // service id for internal linking
  tools?: string[];
  body: Block[];
};

export const BLOG_CATEGORIES = ["Logo & identité", "Print", "Web"] as const;

export const ARTICLES: Article[] = [
  {
    slug: "combien-coute-un-logo-professionnel-en-tunisie",
    title: "Combien coûte un logo professionnel en Tunisie ? Ce qui fait varier le prix",
    seoTitle: "Prix d'un logo professionnel en Tunisie : les critères qui comptent",
    description: "Pourquoi les devis de logo varient autant en Tunisie ? Les cinq critères qui expliquent l'écart, et comment comparer deux offres sans vous tromper.",
    category: "Logo & identité",
    date: "2026-10-12",
    readMinutes: 5,
    service: "logo",
    tools: ["generateur-brief-logo"],
    body: [
      { t: "p", v: "Entre un logo à quelques dinars généré en ligne et un projet de branding complet, l'écart de prix est énorme. Ce n'est pas arbitraire : chaque devis reflète un niveau de travail différent. Voici comment lire ces écarts." },
      { t: "h2", v: "1. La recherche en amont" },
      { t: "p", v: "Un logo conçu sans étude de votre marché ressemble souvent à celui du voisin. Le temps passé à analyser votre activité, vos concurrents locaux et votre clientèle est invisible sur le fichier final, mais c'est lui qui rend le résultat distinctif." },
      { t: "h2", v: "2. Le nombre de pistes et de révisions" },
      { t: "ul", v: ["Une seule proposition : peu de choix, peu de marge d'ajustement.", "Plusieurs pistes distinctes : vous comparez de vraies directions.", "Révisions illimitées ou cadrées : demandez toujours le nombre exact par écrit."] },
      { t: "h2", v: "3. Les livrables" },
      { t: "p", v: "Un logo livré uniquement en JPG pose problème dès que vous devez imprimer une enseigne ou un tampon. Vérifiez la présence de fichiers vectoriels (SVG, PDF), de versions couleur, noir et blanc, et de déclinaisons carrées pour les réseaux sociaux." },
      { t: "h2", v: "4. L'originalité et les droits" },
      { t: "p", v: "Un logo basé sur un modèle revendu à plusieurs clients ne vous appartient pas vraiment. Demandez si la création est originale et si les droits d'exploitation vous sont cédés." },
      { t: "h2", v: "5. L'accompagnement" },
      { t: "p", v: "Mise en situation sur des supports, conseils sur les couleurs, mini-charte d'usage : ces extras évitent les erreurs coûteuses ensuite." },
      { t: "tip", v: "Pour comparer deux devis, alignez-les sur les mêmes lignes : recherche, nombre de pistes, révisions, formats livrés, cession des droits." },
      { t: "p", v: "Chez Art Visions, nous préférons chiffrer après un brief précis plutôt que d'afficher un prix unique pour tous les projets. Le générateur de brief ci-dessous vous aide à préparer votre demande." },
    ],
  },
  {
    slug: "logo-ou-identite-visuelle-que-choisir",
    title: "Logo ou identité visuelle complète : que choisir pour votre entreprise ?",
    seoTitle: "Logo ou identité visuelle : lequel choisir pour votre entreprise ?",
    description: "Le logo est un élément, l'identité visuelle est un système. Découvrez dans quels cas un simple logo suffit et quand investir dans une charte graphique.",
    category: "Logo & identité",
    date: "2026-10-05",
    readMinutes: 4,
    service: "identity",
    tools: ["generateur-palette-couleurs"],
    body: [
      { t: "p", v: "Beaucoup d'entrepreneurs demandent « un logo » alors que leur vrai besoin est une image cohérente sur tous leurs supports. Les deux démarches sont complémentaires, mais pas équivalentes." },
      { t: "h2", v: "Ce que contient un logo" },
      { t: "p", v: "Un symbole, un nom mis en forme et quelques déclinaisons. C'est la signature visuelle de votre marque." },
      { t: "h2", v: "Ce que contient une identité visuelle" },
      { t: "ul", v: ["Logo et ses règles d'usage (espaces, tailles minimales, interdits)", "Palette de couleurs avec codes HEX, RVB et CMJN", "Typographies pour titres et textes", "Style des images et des icônes", "Exemples d'application : carte de visite, menu, réseaux sociaux"] },
      { t: "h2", v: "Quand un simple logo suffit" },
      { t: "p", v: "Vous démarrez, vos supports se comptent sur les doigts d'une main et vous gérez vous-même votre communication. Un logo bien dessiné et une palette claire suffisent." },
      { t: "h2", v: "Quand investir dans une charte" },
      { t: "ul", v: ["Plusieurs personnes créent vos supports (équipe, freelances, imprimeurs)", "Vous ouvrez plusieurs points de vente", "Vous vendez en ligne et en boutique", "Vous refondez une image devenue incohérente"] },
      { t: "tip", v: "Commencez par la palette : testez vos couleurs avec le générateur gratuit avant de les figer dans un logo." },
    ],
  },
  {
    slug: "menu-restaurant-7-regles-pour-un-menu-qui-se-lit",
    title: "Menu de restaurant : 7 règles pour un menu qui se lit et qui vend",
    seoTitle: "Créer un menu de restaurant lisible : 7 règles de design",
    description: "Hiérarchie, lisibilité, photos, QR code : les règles de design pour un menu de restaurant ou de café clair, attractif et facile à mettre à jour.",
    category: "Print",
    date: "2026-09-28",
    readMinutes: 4,
    service: "print",
    tools: ["generateur-qr-code"],
    body: [
      { t: "p", v: "Un client lit un menu en moins d'une minute. Votre design doit l'aider à trouver et choisir, pas à déchiffrer." },
      { t: "h2", v: "1. Une hiérarchie évidente" },
      { t: "p", v: "Catégories en titres, plats en gras, descriptions en texte plus léger. Trois niveaux suffisent." },
      { t: "h2", v: "2. Une police lisible, même en lumière faible" },
      { t: "p", v: "Évitez les polices très décoratives pour les descriptions. Réservez-les au titre et au logo." },
      { t: "h2", v: "3. Moins de plats, mieux présentés" },
      { t: "p", v: "Un menu surchargé retarde la décision. Regroupez et priorisez vos plats phares." },
      { t: "h2", v: "4. Les prix sans surcharge" },
      { t: "p", v: "Alignez-les proprement et évitez les lignes de points ou les symboles inutiles qui attirent l'œil sur le prix plutôt que sur le plat." },
      { t: "h2", v: "5. Des photos seulement si elles sont bonnes" },
      { t: "p", v: "Une mauvaise photo dessert le plat. Mieux vaut un menu typographique soigné." },
      { t: "h2", v: "6. Un QR code pour la version à jour" },
      { t: "p", v: "Un QR code vers votre menu en ligne permet de changer un prix sans réimprimer. Testez-le avant impression." },
      { t: "h2", v: "7. Un support adapté" },
      { t: "p", v: "Papier épais pour le menu manipulé, plastifié pour les cafés à forte rotation, set de table pour les menus du jour." },
      { t: "tip", v: "Demandez un fichier avec fonds perdus et repères de coupe pour que l'imprimeur n'ait rien à retoucher." },
    ],
  },
  {
    slug: "flyer-checklist-avant-impression",
    title: "Flyer : la checklist à valider avant d'envoyer à l'impression",
    seoTitle: "Flyer : checklist avant impression (format, fond perdu, couleurs)",
    description: "Fond perdu, résolution, couleurs CMJN, zone de sécurité, texte lisible : la checklist pour éviter un flyer raté à l'impression.",
    category: "Print",
    date: "2026-09-20",
    readMinutes: 3,
    service: "print",
    body: [
      { t: "p", v: "Un flyer imprimé avec une erreur ne se corrige pas. Cette checklist évite les surprises les plus courantes." },
      { t: "h2", v: "Les points techniques" },
      { t: "ul", v: ["Fond perdu de 3 mm sur les quatre côtés (à confirmer avec votre imprimeur)", "Zone de sécurité : texte et logo à 5 mm minimum du bord", "Résolution de 300 dpi pour les images", "Mode colorimétrique CMJN pour l'impression", "Textes vectorisés ou polices incluses"] },
      { t: "h2", v: "Les points de contenu" },
      { t: "ul", v: ["Une seule action demandée (appeler, scanner, venir)", "Coordonnées complètes et relues", "Offre avec date limite si elle est temporaire", "Lisibilité à bout de bras : testez en imprimant à taille réelle sur une imprimante de bureau"] },
      { t: "tip", v: "Demandez toujours un BAT (bon à tirer) à l'imprimeur avant le tirage complet." },
    ],
  },
  {
    slug: "site-vitrine-pages-indispensables-commerce-local",
    title: "Site vitrine : les pages indispensables pour un commerce local en Tunisie",
    seoTitle: "Site vitrine pour commerce local : les pages indispensables",
    description: "Accueil, services, réalisations, contact, mentions légales : la structure minimale d'un site vitrine qui rassure et génère des demandes.",
    category: "Web",
    date: "2026-09-12",
    readMinutes: 4,
    service: "web",
    tools: ["generateur-qr-code"],
    body: [
      { t: "p", v: "Un site vitrine n'a pas besoin de cinquante pages. Il doit répondre vite aux questions d'un client qui hésite." },
      { t: "h2", v: "Accueil" },
      { t: "p", v: "Qui êtes-vous, que proposez-vous, comment vous joindre : tout cela visible sans défiler longtemps, surtout sur mobile." },
      { t: "h2", v: "Une page par service principal" },
      { t: "p", v: "Chaque service important mérite sa page. C'est aussi ce qui permet à Google de comprendre vos activités." },
      { t: "h2", v: "Réalisations ou galerie" },
      { t: "p", v: "Des exemples réels rassurent plus que tous les slogans. N'affichez que du vrai travail." },
      { t: "h2", v: "Contact et accès" },
      { t: "ul", v: ["Formulaire court", "Téléphone cliquable sur mobile", "Horaires et adresse uniquement s'ils sont exacts"] },
      { t: "h2", v: "Mentions légales" },
      { t: "p", v: "Identification de l'entreprise et politique de confidentialité si vous collectez des données." },
      { t: "tip", v: "Mesurez dès le premier jour : combien de visiteurs utilisent le formulaire ou appellent ? C'est la seule statistique qui compte vraiment." },
    ],
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);

/** Target keyword per article (used by the admin SEO audit; not verified search volume). */
export const ARTICLE_KEYWORDS: Record<string, string> = {
  "combien-coute-un-logo-professionnel-en-tunisie": "prix logo professionnel Tunisie",
  "logo-ou-identite-visuelle-que-choisir": "logo ou identité visuelle",
  "menu-restaurant-7-regles-pour-un-menu-qui-se-lit": "menu restaurant design",
  "flyer-checklist-avant-impression": "flyer avant impression",
  "site-vitrine-pages-indispensables-commerce-local": "site vitrine commerce local",
};
