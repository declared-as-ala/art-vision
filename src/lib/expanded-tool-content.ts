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
  const title = tool?.title.toLowerCase() ?? "support de communication";

  return {
    howItWorks: [
      "Remplissez les informations essentielles relatives à votre activité et votre identité de marque.",
      "Personnalisez le rendu visuel : sélection de modèle, couleurs, typographies et hiérarchie de lecture.",
      "Vérifiez l'aperçu en temps réel, ajustez les détails et téléchargez votre fichier directement.",
    ],
    useCases: [
      "Créateurs d'entreprise et indépendants qui souhaitent concevoir un support pro en autonomie.",
      "Commerçants, restaurateurs et artisans ayant besoin d'éditer un visuel sans logiciel complexe.",
      "Équipes marketing préparant un document de travail clair avant finalisation par un studio graphique.",
    ],
    benefits: [
      "Création immédiate, gratuite et accessible sans création de compte obligatoire.",
      "Rendu soigné, aligné sur les bonnes pratiques de design et prêt à l'emploi.",
      "Passerelle directe vers nos services de création sur-mesure quand votre projet monte en gamme.",
    ],
    advice: [
      "Privilégiez la concision : un bon support de communication délivre son message en moins de 5 secondes.",
      "Veillez aux contrastes chromatiques pour garantir une parfaite lisibilité sur tous supports.",
      "Pour l'impression, vérifiez attentivement l'orthographe, les marges et la netteté des éléments importés.",
    ],
    examples: [
      "Concevoir un support prêt à l'emploi pour lancer une offre ou un nouveau service.",
      "Créer une déclinaison propre pour un événement, un salon ou une opération promotionnelle.",
      "Tester rapidement plusieurs variantes visuelles avant validation définitive.",
    ],
    search: {
      primaryKeyword: title,
      secondaryKeywords: ["outil gratuit en ligne", "modèle personnalisable", "communication d'entreprise"],
      longTailKeywords: [`créer ${title} en ligne`, `modèle ${title} gratuit`, `comment créer un ${title}`],
      intent: "Créer rapidement un support utilisable, avec modèle et export.",
      competitors: "Générateurs génériques, suites SaaS et modèles bureautiques.",
      gap: "Combiner un véritable outil web fluide avec l'expertise d'un studio de design professionnel.",
    },
  };
};

export const landingContent: Record<string, ToolLandingContent> = {
  "generateur-brief-site-web": {
    howItWorks: [
      "Renseignez le contexte de votre entreprise, votre positionnement marché et vos objectifs clés.",
      "Structurez votre arborescence prévisionnelle (pages accueil, offres, blog, contact) et fonctionnalités utiles.",
      "Exportez un cahier des charges complet et structuré en PDF, prêt à être partagé avec votre prestataire web.",
    ],
    useCases: [
      "Entrepreneurs et TPE préparant la création de leur tout premier site vitrine professionnel.",
      "PME en phase de refonte digitale souhaitant clarifier leurs besoins techniques et graphiques.",
      "Responsables marketing devant cadrer un appel d'offres ou demander des devis comparables.",
    ],
    benefits: [
      "Économisez des heures de cadrage grâce à un questionnaire méthodologique éprouvé.",
      "Évitez les mauvaises surprises et les surcoûts en clarifiant le périmètre dès le départ.",
      "Obtenez des devis d'agences plus précis, détaillés et directement comparables.",
    ],
    advice: [
      "Rassemblez vos éléments existants (charte graphique, photos, contenus) avant de finaliser le brief.",
      "Priorisez vos besoins : distinguez les fonctions indispensables (MVP) des options de confort.",
      "Fixez des objectifs concrets et mesurables (ex. générer 10 demandes de devis qualifiées par mois).",
    ],
    examples: [
      "Brief de site vitrine pour artisan ou profession libérale (5 à 8 pages avec formulaire).",
      "Cahier des charges pour cabinet de conseil ou PME B2B avec demande de devis sur-mesure.",
      "Expression de besoin pour commerce ou restaurant avec carte en ligne et localisation.",
    ],
    search: {
      primaryKeyword: "générateur brief site web",
      secondaryKeywords: ["cahier des charges site internet", "brief refonte site vitrine", "modèle brief site web"],
      longTailKeywords: ["créer un brief de site web gratuit", "exemple cahier des charges site vitrine", "formulaire brief projet web"],
      intent: "Structurer ses besoins et produire un document de cadrage pour son projet de site internet.",
      competitors: "Modèles Word/Notion génériques d'agences et articles de blog théoriques.",
      gap: "Un générateur interactif étape par étape qui produit un PDF exploitable immédiatement.",
    },
  },
  "createur-menu-restaurant": {
    ...defaultContent("createur-menu-restaurant"),
    useCases: [
      "Restaurant traditionnel renouvelant sa carte des saisons ou sa sélection du chef.",
      "Brasserie, snack ou pizzeria souhaitant un menu clair, lisible et rapidement modifiable.",
      "Café, salon de thé ou bar composant sa carte de boissons et desserts à emporter.",
    ],
    advice: [
      "Regroupez vos plats en 4 à 6 sections logiques maximum pour guider le regard du client.",
      "Alignez les prix avec une typographie sobre, sans points de suite superflus qui orientent vers le moins cher.",
      "Conservez une version imprimée épurée et proposez le détail des allergènes via QR code.",
    ],
    examples: [
      "Menu de brasserie A4 recto-verso avec formules midi et plats du jour.",
      "Carte des desserts et boissons chaudes au format chevalet de table.",
      "Formule déjeuner à emporter pour sandwicherie ou salad bar.",
    ],
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
    advice: [
      "Optez pour un code HTML tabulaire propre pour garantir l'affichage sur tous les clients mails.",
      "Évitez les signatures sous forme d'une unique image : elles finissent souvent en pièce jointe ou bloquées.",
      "Testez systématiquement l'affichage sur mobile (Gmail iOS/Android) et sur Outlook desktop.",
    ],
    examples: [
      "Signature professionnelle pour dirigeant avec logo d'entreprise et lien vers prise de RDV.",
      "Signature commerciale pour équipe de vente avec bannière promotionnelle et réseaux sociaux.",
      "Signature épurée pour profession libérale avec coordonnées complètes et mentions légales.",
    ],
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
    advice: [
      "Visez impérativement 300 DPI à taille réelle pour les supports vus de près (cartes de visite, flyers, dépliants).",
      "Pour les supports grand format lus à plus de 2 mètres (bâches, affiches abribus), 150 DPI suffit amplement.",
      "Distinguez le poids en mégaoctets de la résolution en pixels : seule la matrice de pixels détermine la netteté finale.",
    ],
    examples: [
      "Vérification d'une photo smartphone avant commande de tirage A3 ou poster mural.",
      "Contrôle d'un visuel importé pour une bâche événementielle de 2 mètres sur 1 mètre.",
      "Validation de la netteté d'un logo matriciel avant envoi à l'imprimerie pour des flyers A5.",
    ],
    search: {
      primaryKeyword: "résolution image impression",
      secondaryKeywords: ["calcul DPI impression", "image 300 DPI", "taille image impression"],
      longTailKeywords: ["quelle résolution pour imprimer une photo", "vérifier qualité image impression", "taille maximale impression 300 DPI"],
      intent: "Savoir si une image est assez grande pour un format imprimé.",
      competitors: "Articles pédagogiques DPI, calculateurs techniques et imprimeurs.",
      gap: "Donner un verdict clair par format courant, pas seulement une formule.",
    },
  },
  "gabarit-impression": {
    ...defaultContent("gabarit-impression"),
    useCases: [
      "Graphistes et designers préparant un document d'exécution conforme aux exigences d'atelier.",
      "Entreprises réalisant en interne des visuels de cartes de visite, affiches ou flyers.",
      "Étudiants et communicants souhaitant comprendre le rôle des fonds perdus et zones de sécurité.",
    ],
    advice: [
      "Ajoutez toujours 2 à 3 mm de fond perdu tout autour de votre format de coupe final.",
      "Gardez tous vos textes et éléments cruciaux à au moins 3 à 5 mm à l'intérieur de la coupe (zone tranquille).",
      "Exportez en PDF haute définition conforme aux normes PDF/X sans traits de coupe parasites si non requis.",
    ],
    examples: [
      "Gabarit carte de visite standard 85 x 55 mm avec 2 mm de fond perdu.",
      "Gabarit flyer A5 (148 x 210 mm) avec repères de sécurité pour impression recto-verso.",
      "Gabarit dépliant 3 volets avec compensation de la largeur du volet intérieur.",
    ],
    search: {
      primaryKeyword: "gabarit impression avec fond perdu",
      secondaryKeywords: ["gabarit carte de visite", "fond perdu flyer", "dimensions impression PDF"],
      longTailKeywords: ["télécharger gabarit impression gratuit", "format impression avec bords perdus", "repères de coupe imprimerie"],
      intent: "Obtenir les cotes exactes et un fichier gabarit pour préparer un document imprimable.",
      competitors: "Pages de gabarits d'imprimeurs en ligne souvent limitées à leurs formats propriétaires.",
      gap: "Un générateur universel et immédiat avec export PDF et SVG conforme aux normes d'imprimerie.",
    },
  },
  "planificateur-publications": {
    ...defaultContent("planificateur-publications"),
    advice: [
      "Équilibrez vos publications : 40 % de contenu à forte valeur, 30 % de preuves/avis, 20 % de coulisses, 10 % d'offres directes.",
      "Maintenez une régularité tenable (ex. 2 à 3 posts par semaine) plutôt qu'un rythme insoutenable qui retombe après 15 jours.",
      "Définissez un objectif clair et un appel à l'action pour chaque publication programmée.",
    ],
    examples: [
      "Planning mensuel pour commerce de proximité (mise en avant des arrivages, promotions et coulisses).",
      "Calendrier de lancement de produit B2B sur LinkedIn avec posts d'expertise et carrousels.",
      "Planning Instagram pour salon de coiffure ou beauté avec avant/après et témoignages clients.",
    ],
    search: {
      primaryKeyword: "calendrier éditorial gratuit",
      secondaryKeywords: ["planning réseaux sociaux", "planning publication Instagram", "calendrier contenu social media"],
      longTailKeywords: ["générer calendrier éditorial Instagram", "planning publications réseaux sociaux gratuit", "calendrier éditorial PME"],
      intent: "Transformer une stratégie de contenu en dates, formats et idées.",
      competitors: "Templates Notion/Excel, articles de planning et générateurs de marronniers.",
      gap: "Produire un calendrier directement adapté au secteur, à l'objectif et aux plateformes.",
    },
  },
  "createur-carte-fidelite": {
    ...defaultContent("createur-carte-fidelite"),
    useCases: [
      "Café, salon de thé ou restaurant rapide voulant récompenser ses habitués avec une formule 10e café offert.",
      "Coiffeur, barbier ou institut de beauté proposant une réduction à la 5e ou 8e visite.",
      "Boutique de prêt-à-porter ou commerce de bouche renforçant la rétention de sa clientèle locale.",
    ],
    advice: [
      "Choisissez un papier non couché ou offset (au moins 300 g) pour que les tampons sèchent immédiatement sans baver.",
      "Mentionnez clairement les conditions d'utilisation et la date de validité si elle s'applique.",
      "Intégrez vos coordonnées essentielles et votre compte Instagram au verso pour garder le contact.",
    ],
    examples: [
      "Carte de fidélité 10 tampons pour café ou salon de thé (recto design, verso cases tampon).",
      "Carte fidélité beauté avec offre privilège au 5e passage pour institut ou barbier.",
      "Carte d'abonnement ou fidélité artisan boulanger-pâtissier.",
    ],
    search: {
      primaryKeyword: "créateur carte de fidélité",
      secondaryKeywords: ["carte de fidélité à imprimer", "modèle carte fidélité gratuit", "carte tampon fidélité"],
      longTailKeywords: ["faire une carte de fidélité en ligne gratuite", "imprimer carte de fidélité commerce", "carte fidélité personnalisée restaurant"],
      intent: "Créer une carte de fidélité recto-verso prête pour impression avec tampons.",
      competitors: "Modèles d'imprimeurs ou logiciels de fidélisation par application mobile.",
      gap: "Création visuelle instantanée en ligne avec export PDF haute définition prêt à imprimer.",
    },
  },
  "generateur-bon-cadeau": {
    ...defaultContent("generateur-bon-cadeau"),
    useCases: [
      "Instituts de massage, spas et centres esthétiques pour les fêtes de fin d'année ou la fête des mères.",
      "Restaurants gastronomiques et bistronomiques proposant des menus dégustation en cadeau.",
      "Artisans d'art, photographes et créateurs proposant des bons d'achat personnalisables.",
    ],
    advice: [
      "Attribuez toujours un numéro de bon unique et conservez un registre de vos émissions pour éviter les doublons.",
      "Spécifiez une durée de validité raisonnable (généralement 6 mois à 1 an) conformément à vos CGV.",
      "Imprimez sur un carton épais texturé ou avec finition dorée pour valoriser le geste d'offrir.",
    ],
    examples: [
      "Bon cadeau soin du visage et bien-être pour institut de beauté.",
      "Chèque cadeau d'une valeur de 50 € à 150 € pour dîner au restaurant.",
      "Bon pour séance photo en famille ou shooting portrait professionnel.",
    ],
    search: {
      primaryKeyword: "générateur bon cadeau gratuit",
      secondaryKeywords: ["bon cadeau à imprimer", "chèque cadeau entreprise", "modèle bon d'achat personnalisé"],
      longTailKeywords: ["créer un bon cadeau gratuit à imprimer", "faire un bon cadeau institut", "modèle chèque cadeau restaurant"],
      intent: "Générer un bon cadeau élégant avec montant, bénéficiaire et validité.",
      competitors: "Templates bureautiques rigides ou plateformes de billetterie payantes.",
      gap: "Outil simple et sans inscription produisant un PDF élégant prêt pour la remise en main propre.",
    },
  },
  "createur-affiche-horaires": {
    ...defaultContent("createur-affiche-horaires"),
    useCases: [
      "Commerces de centre-ville signalant leurs heures d'ouverture sur vitrine ou porte d'entrée.",
      "Cabinets médicaux, dentaires ou juridiques affichant les plages de consultation sur rendez-vous.",
      "Garages, ateliers ou prestataires de services informant sur les horaires d'accueil téléphonique et atelier.",
    ],
    advice: [
      "Utilisez une taille de caractères suffisante pour une lecture facile à travers la vitrine depuis le trottoir.",
      "Indiquez distinctement les jours de fermeture hebdomadaire pour éviter toute déconvenue.",
      "Ajoutez un QR code vers vos avis Google ou votre réservation en ligne pour les clients de passage en dehors des heures d'ouverture.",
    ],
    examples: [
      "Affiche d'horaires d'ouverture pour boutique de mode avec nocturne le vendredi.",
      "Panneau horaires cabinet médical avec coordonnées de garde et lien de prise de rendez-vous.",
      "Affichette horaires d'été ou périodes de congés annuels pour commerce de quartier.",
    ],
    search: {
      primaryKeyword: "créateur affiche horaires d'ouverture",
      secondaryKeywords: ["affiche horaires commerce", "modèle horaire ouverture vitrine", "affiche horaires magasin gratuit"],
      longTailKeywords: ["créer une affiche horaires d'ouverture gratuite", "affiche horaire magasin à imprimer", "pancarte horaires d'ouverture vitrophanie"],
      intent: "Créer une affiche d'horaires claire et propre à imprimer pour sa vitrine.",
      competitors: "Modèles Word basiques et fiches d'horaires brutes.",
      gap: "Mise en page graphique soignée aux couleurs de l'entreprise avec export PDF haute définition.",
    },
  },
  "redimensionner-image": {
    ...defaultContent("redimensionner-image"),
    useCases: [
      "Community managers adaptant un même visuel aux formats spécifiques de chaque réseau social.",
      "E-commerçants recadrant leurs photos de produits aux dimensions carrées des fiches articles.",
      "Créateurs de contenu préparant leurs bannières YouTube, couvertures Facebook ou stories Instagram.",
    ],
    advice: [
      "Partez toujours d'une image source de haute définition pour éviter toute pixellisation lors des recadrages.",
      "Placez votre sujet principal au centre du cadre pour anticiper les découpes automatiques des flux mobiles.",
      "Privilégiez le format PNG pour les graphismes avec aplats de couleurs et le WebP/JPEG pour les photographies.",
    ],
    examples: [
      "Recadrage d'une photo paysage en format vertical Story 9:16 pour Instagram et TikTok.",
      "Adaptation d'une photo d'équipe en bannière d'entreprise LinkedIn 1584 x 396 px.",
      "Redimensionnement carré 1080 x 1080 px pour carrousel ou publication standard.",
    ],
    search: {
      primaryKeyword: "redimensionner image réseaux sociaux",
      secondaryKeywords: ["taille format Instagram", "recadrer image en ligne", "dimensions visuels réseaux sociaux"],
      longTailKeywords: ["redimensionner une photo pour Instagram sans la déformer", "format bannière LinkedIn outil gratuit", "redimensionner image en ligne gratuitement"],
      intent: "Adapter rapidement une photo aux dimensions imposées par les différentes plateformes sociales.",
      competitors: "Convertisseurs d'images en ligne avec publicités intrusives et outils SaaS complexes.",
      gap: "Traitement 100 % local dans le navigateur, respectant la vie privée et sans dégradation inutile.",
    },
  },
  "createur-charte-graphique": {
    ...defaultContent("createur-charte-graphique"),
    useCases: [
      "Porteurs de projet fixant les premiers piliers de leur identité de marque avant de commander des supports.",
      "Freelances et agences souhaitant remettre à un client une synthèse visuelle claire et structurée.",
      "TPE ayant un logo mais manquant d'un guide synthétique pour harmoniser leurs documents internes.",
    ],
    advice: [
      "Limitez votre palette à 3 ou 4 teintes : une couleur dominante, une secondaire et un ou deux neutres d'accompagnement.",
      "Sélectionnez au maximum deux familles typographiques : une pour les titres et une pour le corps de texte.",
      "Précisez les interdits d'usage de votre logo (déformation, changement de couleurs, manque d'espace de protection).",
    ],
    examples: [
      "Mini-charte d'identité visuelle pour startup technologique (palette moderne, typographie géométrique).",
      "Guide graphique essentiel pour boutique de décoration artisanale (tons naturels, typographie avec empattements).",
      "Fiche mémo d'identité visuelle pour cabinet comptable ou d'avocats (palette institutionnelle sobre).",
    ],
    search: {
      primaryKeyword: "créateur mini charte graphique",
      secondaryKeywords: ["modèle charte graphique gratuit", "guide identité visuelle", "créer charte graphique PDF"],
      longTailKeywords: ["comment faire une charte graphique simple", "mini charte graphique pour entreprise", "guide de style marque gratuit"],
      intent: "Synthétiser l'identité visuelle de son entreprise dans un document de référence clair.",
      competitors: "Templates InDesign ou articles théoriques sur l'identité de marque.",
      gap: "Génération automatique d'un condensé de charte directement téléchargeable en PDF.",
    },
  },
};

export function getLandingContent(slug: string): ToolLandingContent {
  return landingContent[slug] ?? defaultContent(slug);
}
