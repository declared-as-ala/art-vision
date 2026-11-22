import type { LocalCityData } from "./local-cities-types";

export const LOCAL_CITIES_PART1: LocalCityData[] = [
  {
    slug: "agence-graphique-paris",
    city: "Paris",
    preposition: "à Paris",
    region: "Île-de-France",
    department: "Paris (75)",
    layoutVariant: "editorial-panoramic",
    accent: "magenta",
    seoTitle: "Impression & Agence Graphique à Paris | Cartes, Flyers, Bâches - Art Vision",
    metaDescription:
      "Imprimez vos supports professionnels pour Paris : cartes de visite dès 46 € HT (500 ex), flyers, dépliants, roll-up et création graphique sur mesure avec livraison rapide.",
    focusKeyword: "impression publicitaire Paris",
    heroBadge: "Île-de-France • Commerces, Restaurants & Événements",
    h1: "Impression professionnelle & création graphique à Paris",
    heroSubtitle:
      "Boutiques de quartier, tables parisiennes, agences et exposants de salons : commandez vos supports imprimés avec contrôle technique gratuit et livraison directe.",
    intro:
      "À Paris, la visibilité d'une enseigne ou d'un lancement se joue souvent sur la qualité tactile d'une carte de visite, la lisibilité d'une vitrine ou la tenue d'un catalogue. Art Vision accompagne les professionnels parisiens à distance avec un studio de création en ligne, des graphistes dédiés et un catalogue de 48 supports imprimés expédiés en 1 à 3 jours ouvrables après production.",
    editorialAngle: "Boutiques, restaurants, agences et événements professionnels",
    printSectionTitle: "Supports d'impression plébiscités par les pros parisiens",
    printSectionIntro:
      "Des tirages précis pour les lancements en boutique, l'hôtellerie-restauration et les salons professionnels de la capitale. Tarifs affichés HT selon le catalogue Art Vision.",
    featuredProducts: [
      {
        slug: "cartes-de-visite",
        customTag: "Réseautage & Boutiques",
        localPitch: "Format standard 85 × 55 mm avec option pelliculage mat Soft Touch ou vernis sélectif pour marquer vos rendez-vous parisiens.",
        recommendedSpec: "350g ou 400g couché • 500 ex dès 46 € HT",
      },
      {
        slug: "flyers",
        customTag: "Lancements & Quartiers",
        localPitch: "Idéal pour annoncer une ouverture, un vernissage ou une offre saisonnière dans le Marais, à Opéra ou sur la Rive Gauche.",
        recommendedSpec: "A6 ou A5 CMJN 300 DPI • 500 ex dès 48 € HT",
      },
      {
        slug: "depliants",
        customTag: "Menus & Cartes",
        localPitch: "Pliage 2 ou 3 volets pour cartes de bistrot, programmes d'exposition ou plaquettes de services de proximité.",
        recommendedSpec: "A5 plié 170g/250g • 500 ex dès 80 € HT",
      },
      {
        slug: "roll-up",
        customTag: "Salons & Conférences",
        localPitch: "Structure aluminium légère avec housse de transport pour vos prises de parole à Porte de Versailles ou Villepinte.",
        recommendedSpec: "Toile anti-reflet • Dès 95 € HT / unité",
      },
      {
        slug: "autocollants",
        customTag: "Packaging & Vitrines",
        localPitch: "Stickers vinyle découpés à la forme pour sceller vos sacs kraft, boîtes pâtissières et coffrets boutique.",
        recommendedSpec: "Vinyle haute adhérence • 250 ex dès 75 € HT",
      },
      {
        slug: "brochures",
        customTag: "Lookbooks & Dossiers",
        localPitch: "Brochures agrafées ou dos carré collé pour showrooms mode, galeries d'art et agences immobilières parisiennes.",
        recommendedSpec: "A6 à A4 • 250 ex dès 140 € HT",
      },
    ],
    sectorsTitle: "Exemples concrets d'impression pour Paris",
    sectorsIntro:
      "Chaque secteur parisien impose des contraintes de format, de papier et de délai différentes. Voici nos recommandations pratiques.",
    localSectors: [
      {
        sector: "Commerces & Concept Stores",
        title: "Soigner l'expérience en caisse et en vitrine",
        description:
          "Associez une affiche A2 en vitrine à des stickers personnalisés sur vos emballages et une carte de fidélité PVC ou carton.",
        recommendedSupports: ["Affiches dès 28 € HT", "Autocollants dès 75 € HT", "Cartes PVC dès 53 € HT"],
        paperTip: "Privilégiez un papier 170g satiné pour les affiches intérieures afin d'éviter les reflets sous les spots de boutique.",
      },
      {
        sector: "Restauration, Cafés & Traiteurs",
        title: "Cartes de table durables et ventes à emporter",
        description:
          "Dépliants 3 volets pour les menus de saison, sous-bocks imprimés pour le bar et flyers A6 glissés dans les commandes.",
        recommendedSupports: ["Dépliants dès 80 € HT", "Sous-bocks dès 100 € HT", "Flyers dès 48 € HT"],
        paperTip: "Un pelliculage mat ou brillant sur vos menus (comptez +2 jours ouvrables) protège contre les taches et l'humidité.",
      },
      {
        sector: "Agences & Exposants Salons",
        title: "Stands rapides à installer dans les parcs d'expositions",
        description:
          "Roll-up autoportant, fardes à rabats A4 pour remettre vos propositions commerciales et badges magnétiques pour vos équipes.",
        recommendedSupports: ["Roll-Up dès 95 € HT", "Fardes à rabats dès 282 € HT", "Badges dès 48 € HT"],
        paperTip: "Exportez vos fichiers PDF avec 2 mm de bord perdu et textes à 3 mm minimum du bord de coupe.",
      },
    ],
    designSectionTitle: "Création graphique, branding & digital en complément",
    designSectionBody:
      "Pas encore de fichier prêt à imprimer ? Nos graphistes basés au Mans travaillent en direct avec votre équipe parisienne (visio et validations rapides) pour créer votre identité visuelle, vos maquettes print, mais aussi vos vidéos promotionnelles et votre site vitrine.",
    highlightedServices: [
      { label: "Identité visuelle & charte", href: "/identite-visuelle", pitch: "Palette, typographies et déclinaisons prêtes pour l'impression." },
      { label: "Design graphique sur mesure", href: "/design-graphique", pitch: "Mise en page de brochures, affiches et packagings." },
      { label: "Motion design & vidéo", href: "/motion-design", pitch: "Animations courtes pour écrans vitrines et réseaux sociaux." },
    ],
    workflowNote:
      "Délai standard de production : 2 jours ouvrables (ajoutez 2 jours ouvrables pour vernis ou pelliculage), puis 1 à 3 jours ouvrables de livraison vers Paris et l'Île-de-France.",
    faqs: [
      {
        question: "Art Vision possède-t-il une imprimerie physique dans Paris intra-muros ?",
        answer:
          "Notre siège social est situé au Mans (72000). Nous accompagnons les entreprises de Paris à distance avec contrôle technique PAO gratuit, studio de création en ligne et livraison directe à votre adresse parisienne en 1 à 3 jours ouvrables après production.",
      },
      {
        question: "Comment préparer un fichier conforme pour des cartes de visite ou flyers ?",
        answer:
          "Fournissez un PDF, JPG, TIF, EPS ou AI en 300 DPI et mode colorimétrique CMJN, avec 2 mm de bord perdu tout autour et les textes placés à au moins 3 mm des bords.",
      },
      {
        question: "Puis-je créer mon visuel moi-même avant de commander l'impression ?",
        answer:
          "Oui, notre studio en ligne (/studio) permet de personnaliser cartes de visite, flyers et supports directement depuis votre navigateur avant de passer commande.",
      },
      {
        question: "Les tarifs affichés sur le catalogue incluent-ils la TVA ?",
        answer:
          "Non, tous les prix indiqués sur notre catalogue d'impression (comme les 500 cartes de visite dès 46 € ou les 500 flyers A6 dès 48 €) sont exprimés hors TVA (HT).",
      },
    ],
    ctaPrimaryLabel: "Découvrir nos supports d'impression",
    ctaSecondaryLabel: "Demander mon devis",
    finalCtaTitle: "Lancez votre prochaine impression pour Paris",
    finalCtaSubtitle: "Comparez les formats et grammages en ligne ou confiez la maquette à notre équipe créative.",
    photo: {
      path: "/images/villes/paris.webp",
      width: 1600,
      height: 1575,
      alt: "Vue panoramique sur Paris et le Champ-de-Mars depuis la Tour Eiffel",
      caption: "Paris — Champ-de-Mars et panorama urbain",
      author: "Diliff, edited by Fir0002",
      license: "CC BY 2.5",
      licenseUrl: "https://creativecommons.org/licenses/by/2.5",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Champ_de_Mars_from_the_Eiffel_Tower_-_July_2006_edit.jpg",
    },
  },

  {
    slug: "agence-graphique-lyon",
    city: "Lyon",
    preposition: "à Lyon",
    region: "Auvergne-Rhône-Alpes",
    department: "Rhône (69)",
    layoutVariant: "gallery-grid",
    accent: "orange",
    seoTitle: "Impression Lyon : Cartes, Menus, Bâches & Design | Art Vision",
    metaDescription:
      "Supports imprimés pour professionnels à Lyon : dépliants dès 80 € HT, étiquettes, affiches dès 28 € HT et création graphique. Contrôle fichier gratuit et livraison France.",
    focusKeyword: "impression supports publicitaires Lyon",
    heroBadge: "Auvergne-Rhône-Alpes • Gastronomie, Commerces & Salons",
    h1: "Impression & communication visuelle pour les professionnels à Lyon",
    heroSubtitle:
      "Restaurateurs de la Presqu'île, commerçants de la Croix-Rousse ou exposants à Eurexpo : équipez-vous de supports imprimés soignés, livrés rapidement.",
    intro:
      "Entre tradition gastronomique, dynamisme commercial et grands rendez-vous professionnels, les entreprises lyonnaises ont besoin d'imprimés irréprochables. Art Vision vous permet de commander en ligne 48 familles de supports avec vérification PAO gratuite, ou de confier votre création graphique à notre studio.",
    editorialAngle: "Gastronomie, commerces et communication événementielle",
    printSectionTitle: "La sélection impression pour la métropole de Lyon",
    printSectionIntro:
      "Des formats adaptés aux tables lyonnaises, aux boutiques indépendantes et aux exposants professionnels.",
    featuredProducts: [
      {
        slug: "depliants",
        customTag: "Bouchons & Restaurants",
        localPitch: "Menus à emporter, cartes des vins ou brochures de traiteur avec plis roulés ou accordéon parfaitement rainés.",
        recommendedSpec: "A5 plié • 500 ex dès 80 € HT",
      },
      {
        slug: "etiquettes",
        customTag: "Épiceries & Artisans",
        localPitch: "Étiquettes adhésives sur mesure pour bocaux, bouteilles, coffrets gourmands et produits artisanaux.",
        recommendedSpec: "Formats & découpes sur devis",
      },
      {
        slug: "affiches",
        customTag: "Culture & Événements",
        localPitch: "Affiches A4 à A0 pour annoncer concerts, expositions, marchés de créateurs et opérations commerciales.",
        recommendedSpec: "A4 à grand format • 10 ex dès 28 € HT",
      },
      {
        slug: "cartes-de-visite",
        customTag: "Commerces & Services",
        localPitch: "Cartes rigides recto-verso pour fidéliser votre clientèle ou équiper vos forces commerciales.",
        recommendedSpec: "Format 85 × 55 mm • 500 ex dès 46 € HT",
      },
      {
        slug: "baches",
        customTag: "Façades & Chantiers",
        localPitch: "Bâches PVC ou microperforées avec œillets pour vos devantures en travaux et événements en plein air.",
        recommendedSpec: "Sur mesure • Dès 8,50 € HT / m²",
      },
      {
        slug: "sous-bocks",
        customTag: "Bars & Brasseries",
        localPitch: "Sous-bocks personnalisés en carton absorbant pour valoriser votre marque à chaque service.",
        recommendedSpec: "Carton bois absorbant • 100 ex dès 100 € HT",
      },
    ],
    sectorsTitle: "Adapter vos imprimés aux métiers lyonnais",
    sectorsIntro:
      "Du papier texturé pour la restauration aux supports grand format pour l'événementiel, choisissez le bon grammage dès la commande.",
    localSectors: [
      {
        sector: "Gastronomie & Métiers de Bouche",
        title: "Menus, étiquettes produits et cartes traiteur",
        description:
          "Valorisez vos spécialités avec des dépliants clairs, des étiquettes résistantes pour vos conditionnements et des sous-bocks à votre effigie.",
        recommendedSupports: ["Dépliants dès 80 € HT", "Étiquettes sur devis", "Sous-bocks dès 100 € HT"],
        paperTip: "Pour les menus fréquemment manipulés, optez pour du 250g ou 300g avec pelliculage protecteur.",
      },
      {
        sector: "Événements & Salons (Eurexpo)",
        title: "Visibilité rapide de votre stand",
        description:
          "Combinez un roll-up dès 95 € HT, des badges personnalisés pour vos intervenants et des flyers A5 distribués sur le salon.",
        recommendedSupports: ["Roll-Up dès 95 € HT", "Badges dès 48 € HT", "Flyers dès 48 € HT"],
        paperTip: "Anticipez les finitions vernis ou pelliculage qui ajoutent 2 jours ouvrables aux 2 jours de production standard.",
      },
      {
        sector: "Commerces de Centre-Ville",
        title: "Fidélité et animation de vitrine",
        description:
          "Cartes de visite détournées en cartes de parrainage, affiches saisonnières et autocollants vitrine.",
        recommendedSupports: ["Cartes de visite dès 46 € HT", "Affiches dès 28 € HT", "Autocollants dès 75 € HT"],
        paperTip: "Vérifiez toujours vos visuels à 100 % en 300 DPI CMJN avant envoi pour éviter toute pixellisation.",
      },
    ],
    designSectionTitle: "Besoin d'un logo, d'une charte ou d'un packshot 3D à Lyon ?",
    designSectionBody:
      "Art Vision intervient à distance pour les entreprises lyonnaises : création de logos vectoriels, refonte d'identité, modélisation 3D produit et sites web modernes, en parfaite continuité avec vos supports imprimés.",
    highlightedServices: [
      { label: "Création de logo vectoriel", href: "/creation-logo-professionnel", pitch: "Un logo exploitable sur tous formats, du stylo à l'enseigne." },
      { label: "Modélisation & rendu 3D", href: "/modelisation-3d-rendu-produit", pitch: "Packshots photoréalistes pour catalogues et e-commerce." },
      { label: "Création de site vitrine", href: "/creation-site-vitrine", pitch: "Un site rapide relié à vos campagnes print (QR codes)." },
    ],
    workflowNote:
      "Votre fichier est vérifié gratuitement par nos techniciens avant impression. Production standard en 2 jours ouvrables et livraison suivie à Lyon sous 1 à 3 jours ouvrables.",
    faqs: [
      {
        question: "Puis-je commander des impressions pour Lyon même si votre siège est au Mans ?",
        answer:
          "Oui, toutes nos commandes sont gérées en ligne avec contrôle PAO inclus et expédiées directement à votre entreprise à Lyon et dans tout le Rhône.",
      },
      {
        question: "Quel support privilégier pour des étiquettes de produits alimentaires ?",
        answer:
          "Nos étiquettes personnalisées sont établies sur devis afin d'adapter exactement l'adhésif, le format et le conditionnement (en rouleau ou à l'unité) à vos contenants.",
      },
      {
        question: "Combien coûtent des dépliants pour un restaurant lyonnais ?",
        answer:
          "Les dépliants débutent à 80 € HT pour 500 exemplaires en format A5 plié. Vous pouvez comparer tous les papiers et plis sur la page Dépliants du catalogue.",
      },
      {
        question: "Proposez-vous la mise en page si je n'ai que mes textes et photos ?",
        answer:
          "Oui, sélectionnez la demande de devis création graphique depuis le catalogue ou contactez-nous : nos graphistes conçoivent votre maquette prête à imprimer.",
      },
    ],
    ctaPrimaryLabel: "Comparer les formats et tarifs",
    ctaSecondaryLabel: "Demander un devis gratuit",
    finalCtaTitle: "Prêt à imprimer vos supports pour Lyon ?",
    finalCtaSubtitle: "Accédez aux grilles tarifaires transparentes ou sollicitez l'aide de nos graphistes.",
    photo: {
      path: "/images/villes/lyon.webp",
      width: 1600,
      height: 1066,
      alt: "Panorama de Lyon vu depuis la colline de Fourvière avec la Saône et la Presqu'île",
      caption: "Lyon — Vue panoramique depuis Fourvière",
      author: "Dennis G. Jarvis",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lyon_cityscape_from_Notre-Dame_de_Fourvi%C3%A8re_-_from_Flickr.jpg",
    },
  },

  {
    slug: "agence-graphique-marseille",
    city: "Marseille",
    preposition: "à Marseille",
    region: "Provence-Alpes-Côte d'Azur",
    department: "Bouches-du-Rhône (13)",
    layoutVariant: "dynamic-split",
    accent: "orange",
    seoTitle: "Impression Marseille : Bâches, Panneaux, Flyers & Design | Art Vision",
    metaDescription:
      "Impression grand format et supports commerciaux pour Marseille : bâches dès 8,50 € HT/m², panneaux dès 12 € HT/m², flyers dès 48 € HT. Devis rapide et livraison.",
    focusKeyword: "impression grand format Marseille",
    heroBadge: "Provence-Alpes-Côte d'Azur • Commerces, Restauration & Grand Format",
    h1: "Impression grand format & supports publicitaires à Marseille",
    heroSubtitle:
      "Bâches extérieures résistantes au soleil, panneaux rigides pour chantiers et commerces, flyers et cartes pour la restauration : commandez vos imprimés en ligne.",
    intro:
      "Sous le soleil méditerranéen et face au Mistral, les supports extérieurs demandent des matériaux robustes et des encres durables. Art Vision propose aux professionnels marseillais des bâches, panneaux rigides, beach flags et imprimés commerciaux contrôlés avant tirage et livrés dans tous les arrondissements.",
    editorialAngle: "Commerces, restauration, affichage grand format",
    printSectionTitle: "Supports grand format et commerciaux pour Marseille",
    printSectionIntro:
      "De la façade de commerce aux animations en bord de mer, nos supports résistent aux usages intensifs en extérieur comme en intérieur.",
    featuredProducts: [
      {
        slug: "baches",
        customTag: "Façades & Chantiers",
        localPitch: "Bâches PVC ou mesh microperforé particulièrement adapté aux zones exposées au vent avec œillets renforcés.",
        recommendedSpec: "PVC / Mesh • Dès 8,50 € HT / m²",
      },
      {
        slug: "panneaux",
        customTag: "Enseignes & Signalétique",
        localPitch: "Panneaux rigides sur mesure pour chantiers BTP, zones d'activités et façades commerciales.",
        recommendedSpec: "Akilux / Forex / Dibond • Dès 12 € HT / m²",
      },
      {
        slug: "flyers",
        customTag: "Saisons & Événements",
        localPitch: "Distribution street-marketing, comptoirs hôteliers et programmes d'animations estivales.",
        recommendedSpec: "500 ex (A6) dès 48 € HT",
      },
      {
        slug: "beach-flags",
        customTag: "Terrasses & Plages",
        localPitch: "Oriflammes publicitaires visibles de loin devant un point de vente, un glacier ou un événement sportif.",
        recommendedSpec: "Accessoires & kits • Dès 45 € HT",
      },
      {
        slug: "affiches",
        customTag: "Promotions & Culture",
        localPitch: "Affiches grand format A2, A1, A0 ou abribus pour capter le flux piéton et routier.",
        recommendedSpec: "10 ex (A4) dès 28 € HT",
      },
      {
        slug: "cartes-de-visite",
        customTag: "Artisans & Services",
        localPitch: "Cartes de visite professionnelles faciles à distribuer sur rendez-vous ou chantier.",
        recommendedSpec: "500 ex dès 46 € HT",
      },
    ],
    sectorsTitle: "Des imprimés taillés pour l'activité marseillaise",
    sectorsIntro:
      "Trois usages fréquents à Marseille pour allier visibilité extérieure et clarté commerciale.",
    localSectors: [
      {
        sector: "BTP, Artisans & Immobilier",
        title: "Signaler vos chantiers et véhicules",
        description:
          "Panneaux rigides sur palissade, bâches microperforées anti-prise au vent et carnets autocopiants pour les bons d'intervention.",
        recommendedSupports: ["Panneaux dès 12 € HT/m²", "Bâches dès 8,50 € HT/m²", "Autocopiants dès 181 € HT"],
        paperTip: "Sur les zones très ventées du littoral, préférez la bâche microperforée (mesh) qui laisse passer l'air.",
      },
      {
        sector: "Restauration & Tourisme",
        title: "Attirer les clients depuis la rue",
        description:
          "Beach flags en façade, cartes-menus plastifiées ou pelliculées et sets/flyers saisonniers.",
        recommendedSupports: ["Beach Flags dès 45 € HT", "Dépliants dès 80 € HT", "Flyers dès 48 € HT"],
        paperTip: "Pensez à des contrastes élevés sur vos supports extérieurs pour rester lisible en plein soleil.",
      },
      {
        sector: "Commerces & Événements",
        title: "Campagnes locales à fort impact",
        description:
          "Affiches fluo pour les soldes, stickers pour vos produits et bracelets Tyvek pour les soirées et accès privés.",
        recommendedSupports: ["Affiches fluo dès 70 € HT", "Autocollants dès 75 € HT", "Bracelets dès 69 € HT"],
        paperTip: "Les fichiers fournis en CMJN 300 DPI avec 2 mm de bord perdu garantissent une coupe nette sans liseré blanc.",
      },
    ],
    designSectionTitle: "Création graphique, vidéo publicitaire & web pour Marseille",
    designSectionBody:
      "Besoin de concevoir votre enseigne, une vidéo dynamique pour vos réseaux ou un site web vitrine ? Nos designers vous accompagnent à distance depuis notre studio du Mans.",
    highlightedServices: [
      { label: "Vidéo publicitaire", href: "/video-publicitaire", pitch: "Formats courts percutants pour Instagram, TikTok et YouTube." },
      { label: "Design graphique", href: "/design-graphique", pitch: "Maquettes grand format, bâches et brochures commerciales." },
      { label: "Création de logo", href: "/creation-logo-professionnel", pitch: "Un emblème lisible aussi bien sur un flyer que sur une bâche 4×3." },
    ],
    workflowNote:
      "Contrôle technique gratuit de chaque maquette. Production en 2 jours ouvrables (hors finitions spéciales) et livraison dans les Bouches-du-Rhône sous 1 à 3 jours ouvrables.",
    faqs: [
      {
        question: "Quelle bâche choisir pour un emplacement exposé au Mistral à Marseille ?",
        answer:
          "Pour une façade ou une grille très exposée au vent, la bâche microperforée (mesh) est recommandée car ses micro-perforations réduisent la prise au vent.",
      },
      {
        question: "Quel est le prix de départ pour un panneau publicitaire ?",
        answer:
          "Nos panneaux publicitaires sont proposés dès 12 € HT / m² selon le support choisi et la surface commandée. Des panneaux immobiliers spécifiques démarrent à 185 € HT pour 10 exemplaires.",
      },
      {
        question: "Faites-vous la livraison à Marseille et dans les Bouches-du-Rhône ?",
        answer:
          "Oui, nous expédions vos supports imprimés directement à votre adresse professionnelle à Marseille, Aix-en-Provence, Aubagne ou dans toute la région en 1 à 3 jours ouvrables après production.",
      },
      {
        question: "Puis-je personnaliser mes flyers directement en ligne ?",
        answer:
          "Oui, notre studio en ligne (/studio) permet de créer cartes de visite, flyers et affiches directement sans logiciel complexe.",
      },
    ],
    ctaPrimaryLabel: "Voir les tarifs d'impression",
    ctaSecondaryLabel: "Faire imprimer mes supports",
    finalCtaTitle: "Donnez de la visibilité à votre activité à Marseille",
    finalCtaSubtitle: "Configurez votre impression sur le catalogue ou demandez un devis gratuit sous 24h ouvrées.",
    photo: {
      path: "/images/villes/marseille.webp",
      width: 1600,
      height: 555,
      alt: "Vue panoramique du Vieux-Port de Marseille et de Notre-Dame-de-la-Garde",
      caption: "Marseille — Vieux-Port et Notre-Dame-de-la-Garde",
      author: "Tobi 87",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Hafen_von_Marseille-Notre_Dame_de_la_Garde.jpg",
    },
  },

  {
    slug: "agence-graphique-toulouse",
    city: "Toulouse",
    preposition: "à Toulouse",
    region: "Occitanie",
    department: "Haute-Garonne (31)",
    layoutVariant: "corporate-asymmetric",
    accent: "purple",
    seoTitle: "Imprimerie en ligne & Design Toulouse | Brochures, Roll-Up - Art Vision",
    metaDescription:
      "Supports B2B et impression pour Toulouse : brochures dès 140 € HT, fardes à rabats dès 282 € HT, roll-up dès 95 € HT, cartes de visite dès 46 € HT. Devis gratuit.",
    focusKeyword: "imprimerie en ligne Toulouse",
    heroBadge: "Occitanie • Entreprises Innovantes, Salons & Supports B2B",
    h1: "Imprimerie en ligne & supports B2B pour les entreprises à Toulouse",
    heroSubtitle:
      "Startups, ingénierie, aéronautique, cabinets conseil et organisateurs de salons : commandez des dossiers de présentation, brochures et stands imprimés avec précision.",
    intro:
      "À Toulouse, les échanges B2B, appels d'offres et conventions techniques exigent des documents commerciaux structurés. Art Vision met à la disposition des entreprises toulousaines un catalogue d'impression professionnel (chemises à rabats, brochures, roll-up, cartes de visite) ainsi qu'un pôle design et 3D pour vos présentations techniques.",
    editorialAngle: "Entreprises innovantes, salons et supports B2B",
    printSectionTitle: "Supports B2B et salons professionnels pour Toulouse",
    printSectionIntro:
      "Des imprimés rigoureux pour équiper vos commerciaux, vos congrès au MEETT et vos dossiers clients.",
    featuredProducts: [
      {
        slug: "fardes-a-rabats",
        customTag: "Appels d'offres & Dossiers",
        localPitch: "Chemises à rabats A4 personnalisées pour regrouper devis, fiches techniques et contrats lors de vos rendez-vous.",
        recommendedSpec: "Format A4 • 100 ex dès 282 € HT",
      },
      {
        slug: "brochures",
        customTag: "Plaquettes Corporate",
        localPitch: "Brochures multi-pages pour présenter vos solutions industrielles, offres SaaS ou programmes de formation.",
        recommendedSpec: "250 ex (A6) dès 140 € HT",
      },
      {
        slug: "roll-up",
        customTag: "Congrès & MEETT",
        localPitch: "Enrouleur rapide à monter pour vos stands B2B, conférences et recrutements sur campus.",
        recommendedSpec: "Structure + visuel • Dès 95 € HT",
      },
      {
        slug: "cartes-de-visite",
        customTag: "Équipes Commerciales",
        localPitch: "Cartes de visite uniformes pour l'ensemble de vos collaborateurs et directions techniques.",
        recommendedSpec: "500 ex dès 46 € HT",
      },
      {
        slug: "bloc-notes",
        customTag: "Séminaires & Bureaux",
        localPitch: "Bloc-notes personnalisés avec votre charte pour vos réunions clients et ateliers internes.",
        recommendedSpec: "100 ex (A7) dès 91 € HT",
      },
      {
        slug: "tours-de-cou",
        customTag: "Badges & Événements",
        localPitch: "Tours de cou imprimés pour vos salons d'entreprise, journées portes ouvertes et accès sécurisés.",
        recommendedSpec: "100 ex dès 240 € HT",
      },
    ],
    sectorsTitle: "Usages B2B fréquents en Haute-Garonne",
    sectorsIntro:
      "Des combinaisons d'imprimés éprouvées pour les entreprises technologiques, cabinets et pôles de services toulousains.",
    localSectors: [
      {
        sector: "Entreprises Tech & Industrie",
        title: "Dossiers commerciaux et fiches produits",
        description:
          "Associez une chemise à rabats A4 à des fiches volantes actualisables et des cartes de visite avec QR code vers votre documentation.",
        recommendedSupports: ["Fardes à rabats dès 282 € HT", "Papier entête dès 59 € HT", "Cartes de visite dès 46 € HT"],
        paperTip: "Un papier 300g ou 350g avec pelliculage mat donne une tenue professionnelle aux chemises à rabats.",
      },
      {
        sector: "Salons, Colloques & Recrutement",
        title: "Kit d'exposition compact et réutilisable",
        description:
          "Un roll-up léger, des brochures de présentation et des bloc-notes ou stylos à remettre aux candidats et prospects.",
        recommendedSupports: ["Roll-Up dès 95 € HT", "Brochures dès 140 € HT", "Stylos dès 205 € HT"],
        paperTip: "Contrôlez l'alignement des logos et polices vectorisées avant export PDF pour les grands formats.",
      },
      {
        sector: "PME & Services Locaux",
        title: "Papeterie d'entreprise cohérente",
        description:
          "Enveloppes imprimées, papier à en-tête et tampons encreurs pour harmoniser toute votre correspondance.",
        recommendedSupports: ["Enveloppes dès 103 € HT", "Papier entête dès 59 € HT", "Cachets dès 53 € HT"],
        paperTip: "Commandez vos enveloppes et papiers à en-tête ensemble pour conserver une teinte homogène.",
      },
    ],
    designSectionTitle: "Modélisation 3D, motion design & sites corporate pour Toulouse",
    designSectionBody:
      "Au-delà de l'impression, Art Vision accompagne les entreprises toulousaines sur la visualisation 3D de produits industriels, les vidéos explicatives en motion design et la création de sites vitrines performants.",
    highlightedServices: [
      { label: "Modélisation & rendu 3D", href: "/modelisation-3d-rendu-produit", pitch: "Vues éclatées et rendus produits sans prototype physique." },
      { label: "Motion design", href: "/motion-design", pitch: "Vidéos pédagogiques pour expliquer des solutions complexes." },
      { label: "Site vitrine professionnel", href: "/creation-site-vitrine", pitch: "Plateforme web rapide et structurée pour la génération de leads B2B." },
    ],
    workflowNote:
      "Contrôle technique PAO gratuit sur vos fichiers PDF/AI/EPS. Production en 2 jours ouvrables (+2 jours avec vernis ou pelliculage) et livraison à Toulouse sous 1 à 3 jours ouvrables.",
    faqs: [
      {
        question: "Puis-je commander plusieurs jeux de cartes de visite pour une même équipe toulousaine ?",
        answer:
          "Oui, envoyez vos fichiers ou demandez un devis groupé : nous gérons les séries multi-noms tout en conservant une charte graphique identique.",
      },
      {
        question: "Quel format de fichier envoyer pour des fardes à rabats ou brochures ?",
        answer:
          "Un PDF haute définition en CMJN 300 DPI avec 2 mm de bord perdu et polices vectorisées. Nos graphistes vérifient gratuitement le gabarit avant lancement.",
      },
      {
        question: "Les délais incluent-ils la livraison jusqu'à Toulouse ?",
        answer:
          "Le délai de production standard est de 2 jours ouvrables (ou 4 jours ouvrables avec pelliculage/vernis), auquel s'ajoutent 1 à 3 jours ouvrables de livraison.",
      },
      {
        question: "Pouvez-vous concevoir la maquette de notre plaquette B2B ?",
        answer:
          "Tout à fait. Transmettez-nous votre cahier des charges via la page Devis sur mesure : un graphiste dédié réalise la mise en page complète.",
      },
    ],
    ctaPrimaryLabel: "Explorer le catalogue B2B",
    ctaSecondaryLabel: "Demander un devis entreprise",
    finalCtaTitle: "Équipez vos équipes toulousaines avec des supports B2B soignés",
    finalCtaSubtitle: "Tarifs dégressifs en ligne et accompagnement graphique réactif sous 24h ouvrées.",
    photo: {
      path: "/images/villes/toulouse.webp",
      width: 1600,
      height: 1109,
      alt: "La Place du Capitole à Toulouse et sa façade en brique rose",
      caption: "Toulouse — Place du Capitole",
      author: "kallerna",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Place_du_Capitole,_Toulouse.jpg",
    },
  },

  {
    slug: "agence-graphique-bordeaux",
    city: "Bordeaux",
    preposition: "à Bordeaux",
    region: "Nouvelle-Aquitaine",
    department: "Gironde (33)",
    layoutVariant: "refined-atelier",
    accent: "magenta",
    seoTitle: "Impression Bordeaux : Étiquettes, Cartes, Bâches & Design | Art Vision",
    metaDescription:
      "Imprimez vos supports professionnels pour Bordeaux : étiquettes sur mesure, cartes de visite dès 46 € HT, brochures dès 140 € HT, bâches dès 8,50 € HT/m².",
    focusKeyword: "bâche publicitaire Bordeaux",
    heroBadge: "Nouvelle-Aquitaine • Restaurants, Domaines Viticoles & Hôtellerie",
    h1: "Impression haut de gamme & identité visuelle à Bordeaux",
    heroSubtitle:
      "Propriétés viticoles, restaurants bordelais, hôtels et commerces : sublimez vos cuvées, cartes de table et signalétiques avec des supports imprimés précis.",
    intro:
      "Dans un territoire où l'art de vivre, le vin et l'accueil occupent une place centrale, la qualité perçue d'un imprimé fait immédiatement la différence. Art Vision accompagne les professionnels de Bordeaux et de Gironde pour l'impression d'étiquettes, brochures de dégustation, cartes de visite, bâches et supports hôteliers.",
    editorialAngle: "Restaurants, domaines viticoles, hôtellerie",
    printSectionTitle: "Supports d'impression adaptés à l'exigence bordelaise",
    printSectionIntro:
      "Une sélection pensée pour l'œnotourisme, la restauration, les cavistes et les hébergements de Gironde.",
    featuredProducts: [
      {
        slug: "etiquettes",
        customTag: "Domaines & Cavistes",
        localPitch: "Étiquettes adhésives sur mesure pour bouteilles, coffrets bois, colis et dégustations.",
        recommendedSpec: "Sur devis • Formats & papiers adaptés",
      },
      {
        slug: "brochures",
        customTag: "Œnotourisme & Hôtels",
        localPitch: "Livrets d'accueil, catalogues de millésimes et brochures de présentation multilingues.",
        recommendedSpec: "250 ex (A6) dès 140 € HT",
      },
      {
        slug: "cartes-de-visite",
        customTag: "Finitions Élégantes",
        localPitch: "Cartes 85 × 55 mm avec option pelliculage mat ou vernis sélectif pour une prise en main mémorable.",
        recommendedSpec: "500 ex dès 46 € HT",
      },
      {
        slug: "baches",
        customTag: "Domaines & Événements",
        localPitch: "Bâches extérieures pour signaler un chai, des portes ouvertes ou un événement estival.",
        recommendedSpec: "Dès 8,50 € HT / m²",
      },
      {
        slug: "depliants",
        customTag: "Cartes des Vins & Menus",
        localPitch: "Dépliants 2 ou 3 volets pour restaurants, bars à vin et visites guidées.",
        recommendedSpec: "500 ex (A5 plié) dès 80 € HT",
      },
      {
        slug: "cartes-postales",
        customTag: "Invitations & Coffrets",
        localPitch: "Cartes de remerciement ou cartons d'invitation glissés dans vos expéditions de caisses.",
        recommendedSpec: "500 ex (A6) dès 64 € HT",
      },
    ],
    sectorsTitle: "Savoir-faire print pour les professionnels de Bordeaux",
    sectorsIntro:
      "Nos recommandations pratiques pour marier esthétique sobre et durabilité sur vos supports.",
    localSectors: [
      {
        sector: "Domaines Viticoles & Négoce",
        title: "Habillage de bouteilles et fiches techniques",
        description:
          "Étiquettes sur mesure, brochures millésimées et cartes postales d'invitation aux dégustations.",
        recommendedSupports: ["Étiquettes sur devis", "Brochures dès 140 € HT", "Cartes postales dès 64 € HT"],
        paperTip: "Privilégiez des visuels épurés avec typographies fines et contrôle CMJN pour éviter les écarts de teintes.",
      },
      {
        sector: "Hôtellerie & Chambres d'Hôtes",
        title: "Accueil soigné dès la réception",
        description:
          "Livrets d'accueil brochés, cartes de visite à remettre au comptoir et marquage de véhicules navettes.",
        recommendedSupports: ["Brochures dès 140 € HT", "Cartes de visite dès 46 € HT", "Marquage véhicules dès 80 € HT"],
        paperTip: "Un papier 250g couché mat offre une lecture agréable sans reflets sous les éclairages tamisés.",
      },
      {
        sector: "Restaurants & Épiceries Fines",
        title: "Menus et signalétique de vitrine",
        description:
          "Dépliants robustes, stickers de fermeture de paquets et affiches pour vos accords mets et vins.",
        recommendedSupports: ["Dépliants dès 80 € HT", "Autocollants dès 75 € HT", "Affiches dès 28 € HT"],
        paperTip: "Ajoutez un pelliculage sur vos cartes de table pour prolonger leur durée de vie.",
      },
    ],
    designSectionTitle: "Identité visuelle & packaging haut de gamme pour Bordeaux",
    designSectionBody:
      "Nos graphistes créent des identités visuelles élégantes, des étiquettes sur mesure, des packshots 3D de bouteilles et des sites web dédiés aux acteurs bordelais.",
    highlightedServices: [
      { label: "Identité visuelle complète", href: "/identite-visuelle", pitch: "Direction artistique sobre et intemporelle." },
      { label: "Packshot & rendu 3D", href: "/modelisation-3d-rendu-produit", pitch: "Mises en scène 3D réalistes de vos bouteilles et coffrets." },
      { label: "Design graphique", href: "/design-graphique", pitch: "Création d'étiquettes, brochures et cartes de restaurant." },
    ],
    workflowNote:
      "Vérification technique gratuite incluse avant impression. Comptez 2 jours ouvrables de production standard (+2 jours si vernis ou pelliculage) et 1 à 3 jours ouvrables de livraison en Gironde.",
    faqs: [
      {
        question: "Comment commander des étiquettes personnalisées pour bouteilles ou bocaux ?",
        answer:
          "Les étiquettes étant adaptées à chaque contenant (dimensions, forme, adhésif), la tarification se fait sur devis gratuit via notre configurateur dédié.",
      },
      {
        question: "Puis-je commander une bâche publicitaire pour des portes ouvertes de domaine ?",
        answer:
          "Oui, nos bâches démarrent à 8,50 € HT / m² avec options d'œillets et de formats adaptés aux grilles, façades ou portails.",
      },
      {
        question: "Offrez-vous un contrôle des fichiers avant de lancer l'impression ?",
        answer:
          "Oui, nos opérateurs vérifient gratuitement la résolution (300 DPI), le mode CMJN et les marges de sécurité de 3 mm avant toute mise en production.",
      },
      {
        question: "Quel est le tarif des cartes de visite pour un restaurant ou un château ?",
        answer:
          "Les cartes de visite classiques démarrent à 46 € HT les 500 exemplaires. D'autres papiers et finitions sont consultables dans le catalogue.",
      },
    ],
    ctaPrimaryLabel: "Découvrir nos supports",
    ctaSecondaryLabel: "Confier mon projet graphique",
    finalCtaTitle: "Sublimez vos supports imprimés à Bordeaux",
    finalCtaSubtitle: "Tarifs transparents en ligne et accompagnement graphique personnalisé.",
    photo: {
      path: "/images/villes/bordeaux.webp",
      width: 1600,
      height: 1600,
      alt: "Place de la Bourse et Miroir d'eau à Bordeaux",
      caption: "Bordeaux — Place de la Bourse et Miroir d'eau",
      author: "Laurent Ringeval Toulouse Albi Gaillac Saint Sulpice",
      license: "CC BY 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by/3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Bordeaux_Miroir_D_Eau_Jeux_D_Enfant_(116854251).jpeg",
    },
  },

  {
    slug: "agence-graphique-lille",
    city: "Lille",
    preposition: "à Lille",
    region: "Hauts-de-France",
    department: "Nord (59)",
    layoutVariant: "b2b-comparison",
    accent: "purple",
    seoTitle: "Impression Roll-Up & Flyers Lille | Supports Pro & Design - Art Vision",
    metaDescription:
      "Supports d'impression B2B et retail pour Lille : roll-up dès 95 € HT, flyers dès 48 € HT, panneaux dès 12 € HT/m², objets pub dès 195 € HT. Livraison rapide Hauts-de-France.",
    focusKeyword: "impression roll-up Lille",
    heroBadge: "Hauts-de-France • Commerce, Distribution & Salons",
    h1: "Impression roll-up, PLV & supports commerciaux à Lille",
    heroSubtitle:
      "Enseignes retail, acteurs de la distribution et exposants à Lille Grand Palais : comparez nos formats d'impression et commandez vos supports en quelques clics.",
    intro:
      "Carrefour logistique et commercial du Nord, la métropole lilloise vit au rythme des salons professionnels, des opérations promotionnelles en point de vente et des lancements retail. Art Vision propose aux entreprises de Lille des tarifs clairs, des comparatifs de supports et une livraison directe de vos imprimés.",
    editorialAngle: "Commerce, distribution, salons professionnels",
    printSectionTitle: "Supports retail & salons professionnels pour Lille",
    printSectionIntro:
      "Comparez nos supports les plus demandés dans le Nord pour vos points de vente et stands d'exposition.",
    featuredProducts: [
      {
        slug: "roll-up",
        customTag: "Lille Grand Palais",
        localPitch: "Totem enrouleur prêt en 30 secondes pour vos salons B2B, showrooms et accueils de magasin.",
        recommendedSpec: "Aluminium + housse • Dès 95 € HT",
      },
      {
        slug: "flyers",
        customTag: "Retail & Distribution",
        localPitch: "Prospectus promotionnels à distribuer en caisse, en galerie marchande ou en boîte aux lettres.",
        recommendedSpec: "500 ex (A6) dès 48 € HT",
      },
      {
        slug: "panneaux",
        customTag: "PLV & Enseignes",
        localPitch: "Panneaux rigides pour fléchage d'entrepôt, signalétique de rayon ou affichage extérieur.",
        recommendedSpec: "Sur mesure • Dès 12 € HT / m²",
      },
      {
        slug: "objets-publicitaires",
        customTag: "Cadeaux Clients",
        localPitch: "Mugs personnalisés et articles promotionnels pour fidéliser vos partenaires et équipes.",
        recommendedSpec: "10 ex (Mug) dès 195 € HT",
      },
      {
        slug: "calendriers",
        customTag: "Fidélisation Annuelle",
        localPitch: "Calendriers publicitaires de poche ou muraux à remettre en fin d'année à vos clients pros.",
        recommendedSpec: "500 ex (Poche) dès 88 € HT",
      },
      {
        slug: "cartes-de-visite",
        customTag: "Forces de Vente",
        localPitch: "Cartes de visite recto-verso pour commerciaux itinérants et directeurs de magasin.",
        recommendedSpec: "500 ex dès 46 € HT",
      },
    ],
    sectorsTitle: "Bien choisir ses supports entre retail et B2B à Lille",
    sectorsIntro:
      "Comparez l'usage de nos supports selon votre terrain de prospection dans la métropole lilloise.",
    localSectors: [
      {
        sector: "Salons à Lille Grand Palais",
        title: "Stand visible et documentation structurée",
        description:
          "Un ou deux roll-up pour encadrer votre stand, accompagnés de fardes à rabats A4 et de stylos ou bloc-notes.",
        recommendedSupports: ["Roll-Up dès 95 € HT", "Fardes à rabats dès 282 € HT", "Stylos dès 205 € HT"],
        paperTip: "Privilégiez des visuels lisibles à 3 mètres sur vos roll-up : logo en haut, promesse courte au niveau des yeux.",
      },
      {
        sector: "Commerce & Grande Distribution",
        title: "Opérations commerciales et trafic en magasin",
        description:
          "Flyers en fort tirage, affiches fluo pour les promotions flash et panneaux rigides pour guider les clients.",
        recommendedSupports: ["Flyers dès 48 € HT", "Affiches fluo dès 70 € HT", "Panneaux dès 12 € HT/m²"],
        paperTip: "Un papier 135g couché brillant offre un excellent rapport visuel/prix pour les campagnes de prospectus.",
      },
      {
        sector: "Logistique & Services Entreprises",
        title: "Équiper vos équipes et flottes",
        description:
          "Marquage de véhicules, ruban adhésif personnalisé pour vos colis et carnets autocopiants pour les livraisons.",
        recommendedSupports: ["Marquage véhicules dès 80 € HT", "Ruban adhésif dès 2,48 € HT/rlx", "Autocopiants dès 181 € HT"],
        paperTip: "Le ruban adhésif imprimé transforme chaque carton expédié depuis le Nord en support publicitaire.",
      },
    ],
    designSectionTitle: "Un studio graphique réactif pour vos campagnes du Nord",
    designSectionBody:
      "Nos graphistes prennent en charge la création de vos catalogues retail, l'adaptation de vos chartes sur stands et la réalisation de vidéos produits ou sites vitrines.",
    highlightedServices: [
      { label: "Design graphique commercial", href: "/design-graphique", pitch: "Dépliants promos, PLV et catalogues multi-pages." },
      { label: "Création de site vitrine", href: "/creation-site-vitrine", pitch: "Présence web claire reliée à vos campagnes locales." },
      { label: "Community management", href: "/community-management", pitch: "Visuels et animations régulières pour vos réseaux." },
    ],
    workflowNote:
      "Fichiers vérifiés gratuitement avant production. Délai de fabrication standard : 2 jours ouvrables (+2 jours avec vernis ou pelliculage), livraison dans le Nord en 1 à 3 jours ouvrables.",
    faqs: [
      {
        question: "Proposez-vous des roll-up complets avec structure et impression pour un salon à Lille ?",
        answer:
          "Oui, nos roll-up incluent la structure aluminium avec housse de transport et le visuel imprimé, à partir de 95 € HT l'unité.",
      },
      {
        question: "Puis-je commander des objets publicitaires en petite quantité ?",
        answer:
          "Oui, certains objets publicitaires comme les mugs personnalisés sont accessibles dès 10 exemplaires (à partir de 195 € HT), et les stylos dès 100 exemplaires (205 € HT).",
      },
      {
        question: "Quelle est la différence entre un flyer 135g et un flyer 250g ?",
        answer:
          "Le 135g est souple et économique pour une distribution massive ; le 250g offre davantage de rigidité pour un dépôt sur comptoir ou une offre premium.",
      },
      {
        question: "Comment demander un devis pour un lot mixte (roll-up + flyers + cartes) ?",
        answer:
          "Utilisez le bouton « Demander un devis » : la page pré-remplit automatiquement votre ville (Lille) pour recevoir une proposition consolidée sous 24h ouvrées.",
      },
    ],
    ctaPrimaryLabel: "Comparer formats et tarifs",
    ctaSecondaryLabel: "Demander mon devis",
    finalCtaTitle: "Préparez vos prochaines campagnes et salons à Lille",
    finalCtaSubtitle: "Tarifs professionnels transparents et livraison rapide dans les Hauts-de-France.",
    photo: {
      path: "/images/villes/lille.webp",
      width: 1600,
      height: 1066,
      alt: "La Vieille Bourse sur la Grand'Place de Lille",
      caption: "Lille — La Vieille Bourse et Grand'Place",
      author: "Photographe : anonyme – Créateur du cliché : Joseph Maes",
      license: "CC0",
      licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Gezicht_op_de_beurs_van_Rijsel_%E2%80%93_Lille,_la_bourse_b%C3%A2tie_%C3%A0_l%27%C3%A9poque_espagnole.jpg",
    },
  },

  {
    slug: "agence-graphique-nantes",
    city: "Nantes",
    preposition: "à Nantes",
    region: "Pays de la Loire",
    department: "Loire-Atlantique (44)",
    layoutVariant: "gallery-grid",
    accent: "magenta",
    seoTitle: "Impression & Création Graphique Nantes | Flyers, Cartes, Affiches - Art Vision",
    metaDescription:
      "Impression pour entrepreneurs, associations et acteurs culturels à Nantes : cartes de visite dès 46 € HT, flyers dès 48 € HT, affiches dès 28 € HT. Studio en ligne inclus.",
    focusKeyword: "impression communication Nantes",
    heroBadge: "Pays de la Loire • Entrepreneuriat, Culture & Associations",
    h1: "Impression & studio graphique pour les projets à Nantes",
    heroSubtitle:
      "Jeunes entreprises de l'Île de Nantes, acteurs culturels, boutiques et associations : passez de l'idée à l'imprimé grâce à notre studio en ligne et nos tarifs transparents.",
    intro:
      "Nantes réunit un tissu dense de créateurs d'entreprises, de structures culturelles et de commerces engagés. À proximité directe de notre siège du Mans, Art Vision accompagne les porteurs de projets nantais avec des supports imprimés accessibles, un studio de création gratuit en ligne et un accompagnement graphique sur mesure.",
    editorialAngle: "Entrepreneuriat, culture, supports de communication",
    printSectionTitle: "Supports essentiels pour lancer et faire connaître votre activité à Nantes",
    printSectionIntro:
      "Des tirages maîtrisés pour démarrer avec une communication cohérente sans exploser votre budget.",
    featuredProducts: [
      {
        slug: "cartes-de-visite",
        customTag: "Créateurs & Indépendants",
        localPitch: "Indispensable pour vos premiers rendez-vous réseau, pépinières et coworkings nantais.",
        recommendedSpec: "500 ex dès 46 € HT",
      },
      {
        slug: "affiches",
        customTag: "Événements & Culture",
        localPitch: "Affiches A4 à grand format pour festivals, vernissages, conférences et spectacles.",
        recommendedSpec: "10 ex (A4) dès 28 € HT",
      },
      {
        slug: "flyers",
        customTag: "Diffusion Locale",
        localPitch: "Tracts et flyers recto-verso pour annoncer un atelier, un concert ou une ouverture de boutique.",
        recommendedSpec: "500 ex (A6) dès 48 € HT",
      },
      {
        slug: "autocollants",
        customTag: "Identité & Goodies",
        localPitch: "Stickers vinyle personnalisés pour vos emballages, ordinateurs portables et kits de lancement.",
        recommendedSpec: "250 ex dès 75 € HT",
      },
      {
        slug: "marque-pages",
        customTag: "Librairies & Culture",
        localPitch: "Marque-pages rigides 300g pour maisons d'édition, médiathèques et événements littéraires.",
        recommendedSpec: "500 ex dès 68 € HT",
      },
      {
        slug: "cartes-postales",
        customTag: "Éditions & Expositions",
        localPitch: "Cartes postales épaisses pour diffuser vos visuels graphiques ou programmes saisonniers.",
        recommendedSpec: "500 ex (A6) dès 64 € HT",
      },
    ],
    sectorsTitle: "Des supports pensés pour les entrepreneurs et la culture nantaise",
    sectorsIntro:
      "Comment combiner petits tirages et impact visuel fort en Loire-Atlantique.",
    localSectors: [
      {
        sector: "Startups & Indépendants",
        title: "Kit de lancement à budget maîtrisé",
        description:
          "500 cartes de visite, un lot de stickers à votre logo et notre studio en ligne (/studio) pour personnaliser votre maquette vous-même.",
        recommendedSupports: ["Cartes de visite dès 46 € HT", "Autocollants dès 75 € HT", "Studio en ligne gratuit"],
        paperTip: "Intégrez un QR code sur le verso de votre carte pour renvoyer vers votre portfolio ou prise de rendez-vous.",
      },
      {
        sector: "Salles, Festivals & Associations",
        title: "Affichage et billetterie événementielle",
        description:
          "Affiches haute définition, tickets d'entrée sécurisés ou bracelets Tyvek pour gérer les flux du public.",
        recommendedSupports: ["Affiches dès 28 € HT", "Tickets d'entrée dès 116 € HT", "Bracelets dès 69 € HT"],
        paperTip: "Pour un affichage extérieur durable, demandez les papiers dos bleu ou supports résistants.",
      },
      {
        sector: "Édition, Boutiques & Créateurs",
        title: "Supports imprimés à conserver",
        description:
          "Cartes postales illustrées, marque-pages et brochures agrafées pour valoriser vos collections.",
        recommendedSupports: ["Cartes postales dès 64 € HT", "Marque-pages dès 68 € HT", "Brochures dès 140 € HT"],
        paperTip: "Le 300g recyclé ou FSC donne une belle main tactile pour les supports culturels.",
      },
    ],
    designSectionTitle: "Logo, charte graphique & site web pour entrepreneurs nantais",
    designSectionBody:
      "Vous démarrez votre activité à Nantes ? Nos graphistes conçoivent votre logo vectoriel, votre charte graphique et votre site internet vitrine afin que vos supports imprimés et digitaux parlent d'une seule voix.",
    highlightedServices: [
      { label: "Création de logo professionnel", href: "/creation-logo-professionnel", pitch: "Un logo original livré avec tous ses fichiers vectoriels." },
      { label: "Création de site vitrine", href: "/creation-site-vitrine", pitch: "Un site Next.js rapide pensé pour convertir vos visiteurs." },
      { label: "Identité visuelle", href: "/identite-visuelle", pitch: "Une direction artistique complète dès le lancement." },
    ],
    workflowNote:
      "Basés au Mans à moins de deux heures de Nantes, nous gérons vos commandes en ligne avec contrôle PAO gratuit et livraison sous 1 à 3 jours ouvrables après 2 jours de production standard.",
    faqs: [
      {
        question: "Puis-je créer ma carte de visite ou mon flyer directement avant de commander ?",
        answer:
          "Oui ! Rendez-vous sur notre Studio (/studio) pour choisir un modèle de carte de visite ou de flyer, le personnaliser et lancer votre commande d'impression.",
      },
      {
        question: "Quelle est la quantité minimale pour imprimer des affiches pour un événement nantais ?",
        answer:
          "Vous pouvez commander des affiches à partir de 10 exemplaires (dès 28 € HT en format A4). Idéal pour les événements associatifs ou culturels.",
      },
      {
        question: "Combien de temps faut-il prévoir entre la commande et la réception à Nantes ?",
        answer:
          "La production standard prend 2 jours ouvrables (+2 jours si vous ajoutez un vernis ou pelliculage), suivis de 1 à 3 jours ouvrables de livraison.",
      },
      {
        question: "Vérifiez-vous la qualité des images avant impression ?",
        answer:
          "Oui, un contrôle technique gratuit vérifie la résolution (300 DPI recommandés), les couleurs CMJN et les bords perdus de 2 mm.",
      },
    ],
    ctaPrimaryLabel: "Personnaliser mon support",
    ctaSecondaryLabel: "Voir le catalogue impression",
    finalCtaTitle: "Donnez forme à vos projets nantais",
    finalCtaSubtitle: "Créez votre visuel dans notre studio en ligne ou demandez un devis graphique & impression.",
    photo: {
      path: "/images/villes/nantes.webp",
      width: 1600,
      height: 1220,
      alt: "Le Château des ducs de Bretagne à Nantes",
      caption: "Nantes — Château des ducs de Bretagne",
      author: "Eusebius",
      license: "CC BY 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by/3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_des_ducs_de_Bretagne_-_armoiries_Louis_XIV.jpg",
    },
  },

  {
    slug: "agence-graphique-nice",
    city: "Nice",
    preposition: "à Nice",
    region: "Provence-Alpes-Côte d'Azur",
    department: "Alpes-Maritimes (06)",
    layoutVariant: "refined-atelier",
    accent: "orange",
    seoTitle: "Impression & Design à Nice | Hôtellerie, Cartes, Brochures - Art Vision",
    metaDescription:
      "Impression premium pour Nice et la Côte d'Azur : cartes PVC dès 53 € HT, brochures dès 140 € HT, dépliants dès 80 € HT, cartes de visite dès 46 € HT. Devis gratuit.",
    focusKeyword: "impression premium Nice",
    heroBadge: "Côte d'Azur • Tourisme, Hôtellerie & Prestations Premium",
    h1: "Impression premium & communication visuelle à Nice",
    heroSubtitle:
      "Hôtels de la Promenade des Anglais, restaurants, conciergeries et prestataires de luxe : offrez à votre clientèle des supports imprimés à la hauteur de votre accueil.",
    intro:
      "À Nice et sur la Côte d'Azur, une clientèle internationale exige une présentation irréprochable jusque dans les moindres détails imprimés : cartes clés ou de fidélité en PVC, livrets d'accueil multilingues, menus pelliculés et cartes de visite élégantes. Art Vision conçoit et imprime vos supports avec un contrôle qualité strict.",
    editorialAngle: "Tourisme, hôtellerie, restauration et prestations premium",
    printSectionTitle: "Supports d'accueil et prestige pour Nice",
    printSectionIntro:
      "Des finitions soignées et des matériaux durables pensés pour le tourisme, l'hôtellerie et les services haut de gamme.",
    featuredProducts: [
      {
        slug: "cartes-pvc",
        customTag: "Hôtels & Clubs",
        localPitch: "Cartes PVC rigides façon carte bancaire pour accès VIP, fidélité, conciergerie ou bons cadeaux.",
        recommendedSpec: "PVC rigide • 10 ex dès 53 € HT",
      },
      {
        slug: "depliants",
        customTag: "Menus & Guides",
        localPitch: "Dépliants multilingues pour cartes de restaurant, soins spa ou excursions sur la Côte d'Azur.",
        recommendedSpec: "500 ex (A5 plié) dès 80 € HT",
      },
      {
        slug: "brochures",
        customTag: "Catalogues & Immobilier",
        localPitch: "Brochures haute définition pour biens immobiliers de prestige, yachts et portfolios hôteliers.",
        recommendedSpec: "250 ex (A6) dès 140 € HT",
      },
      {
        slug: "cartes-de-visite",
        customTag: "Conciergeries & Agences",
        localPitch: "Cartes de visite avec finitions haut de gamme pour laisser une trace élégante auprès de vos clients.",
        recommendedSpec: "500 ex dès 46 € HT",
      },
      {
        slug: "beach-flags",
        customTag: "Plages & Terrasses",
        localPitch: "Oriflammes élégantes pour signaler un établissement balnéaire, un événement ou un club privé.",
        recommendedSpec: "Dès 45 € HT",
      },
      {
        slug: "cartes-de-voeux",
        customTag: "Événements & Fidélisation",
        localPitch: "Cartes de remerciement et cartons d'invitation pour clients privilégiés et événements privés.",
        recommendedSpec: "500 ex (A7) dès 53 € HT",
      },
    ],
    sectorsTitle: "Recommandations print pour l'hôtellerie et le luxe niçois",
    sectorsIntro:
      "Sélectionnez des papiers épais et des finitions protectrices pour résister aux manipulations répétées.",
    localSectors: [
      {
        sector: "Hôtels, Spas & Conciergeries",
        title: "Livrets en chambre et cartes privilèges",
        description:
          "Brochures d'accueil multilingues, cartes PVC personnalisées et dépliants de soins ou services.",
        recommendedSupports: ["Cartes PVC dès 53 € HT", "Brochures dès 140 € HT", "Dépliants dès 80 € HT"],
        paperTip: "Un pelliculage mat Soft Touch apporte un toucher velouté immédiatement perçu comme haut de gamme.",
      },
      {
        sector: "Restauration & Plages Privées",
        title: "Cartes résistantes à l'usage extérieur",
        description:
          "Menus pelliculés, sous-bocks imprimés et beach flags pour identifier vos espaces en bord de mer.",
        recommendedSupports: ["Dépliants dès 80 € HT", "Sous-bocks dès 100 € HT", "Beach Flags dès 45 € HT"],
        paperTip: "Pour les terrasses ensoleillées, le pelliculage protège l'encre de l'humidité et des manipulations.",
      },
      {
        sector: "Immobilier de Prestige",
        title: "Dossiers acquéreurs et panneaux soignés",
        description:
          "Chemises à rabats A4, brochures immobilières et panneaux extérieurs haute définition.",
        recommendedSupports: ["Fardes à rabats dès 282 € HT", "Panneaux Immo dès 185 € HT", "Cartes de visite dès 46 € HT"],
        paperTip: "Soignez la colorimétrie CMJN de vos photographies d'architecture avant l'envoi du PDF.",
      },
    ],
    designSectionTitle: "Direction artistique, 3D & vidéos promotionnelles pour Nice",
    designSectionBody:
      "Art Vision accompagne les établissements et marques niçoises dans la refonte de leur identité visuelle, la création de vidéos d'ambiance et l'architecture de sites web bilingues.",
    highlightedServices: [
      { label: "Identité visuelle luxe", href: "/identite-visuelle", pitch: "Logos épurés, monogrammes et chartes raffinées." },
      { label: "Vidéo publicitaire", href: "/video-publicitaire", pitch: "Films de présentation pour hôtels, restaurants et événements." },
      { label: "Site vitrine sur mesure", href: "/creation-site-vitrine", pitch: "Interface fluide adaptée aux réservations et demandes de devis." },
    ],
    workflowNote:
      "Chaque fichier est vérifié gratuitement avant impression. Production standard en 2 jours ouvrables (+2 jours avec vernis ou pelliculage), expédition dans les Alpes-Maritimes en 1 à 3 jours ouvrables.",
    faqs: [
      {
        question: "Proposez-vous des cartes plastiques rigides (PVC) pour hôtels ou cartes cadeaux ?",
        answer:
          "Oui, nos cartes PVC (type carte bancaire) sont disponibles dès 10 exemplaires à partir de 53 € HT.",
      },
      {
        question: "Puis-je commander des dépliants multilingues français/anglais ?",
        answer:
          "Bien sûr. Vous pouvez fournir votre fichier multilingue prêt à imprimer ou confier la mise en page bilingue à nos graphistes.",
      },
      {
        question: "Quels sont les délais de livraison sur Nice ?",
        answer:
          "Après validation du fichier, comptez 2 jours ouvrables de production (4 jours avec pelliculage/vernis) et 1 à 3 jours ouvrables de transport.",
      },
      {
        question: "Comment obtenir un devis pour plusieurs supports hôteliers ?",
        answer:
          "Cliquez sur « Demander un devis » : votre page d'origine (Nice) est transmise automatiquement pour établir une offre groupée sous 24h ouvrées.",
      },
    ],
    ctaPrimaryLabel: "Explorer le catalogue premium",
    ctaSecondaryLabel: "Échanger sur WhatsApp",
    finalCtaTitle: "Valorisez votre établissement à Nice avec des imprimés d'exception",
    finalCtaSubtitle: "Devis personnalisé sous 24h ouvrées et livraison suivie sur toute la Côte d'Azur.",
    photo: {
      path: "/images/villes/nice.webp",
      width: 1600,
      height: 1200,
      alt: "Vue nocturne sur la Baie des Anges et la Promenade des Anglais à Nice",
      caption: "Nice — Baie des Anges et Promenade des Anglais",
      author: "Arnaud 25",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Baie_des_Anges_de_nuit.jpg",
    },
  },

  {
    slug: "agence-graphique-strasbourg",
    city: "Strasbourg",
    preposition: "à Strasbourg",
    region: "Grand Est",
    department: "Bas-Rhin (67)",
    layoutVariant: "editorial-panoramic",
    accent: "purple",
    seoTitle: "Impression & Design à Strasbourg | Dépliants, Bâches, Cartes - Art Vision",
    metaDescription:
      "Supports imprimés pour Strasbourg et le Grand Est : dépliants multilingues dès 80 € HT, affiches dès 28 € HT, roll-up dès 95 € HT, cartes de visite dès 46 € HT.",
    focusKeyword: "impression supports Strasbourg",
    heroBadge: "Grand Est • Commerces, Événements & Communication Multilingue",
    h1: "Impression & communication multilingue à Strasbourg",
    heroSubtitle:
      "Commerçants du centre historique, institutions et acteurs transfrontaliers : imprimez vos brochures, affiches et signalétiques franco-allemandes ou anglaises.",
    intro:
      "Carrefour européen au cœur du Bas-Rhin, Strasbourg rassemble des commerces touristiques, des institutions et des entreprises qui communiquent souvent en plusieurs langues. Art Vision vous accompagne à distance pour la mise en page multilingue et l'impression de vos dépliants, affiches, roll-up et cartes professionnelles.",
    editorialAngle: "Commerces, événements et communication multilingue",
    printSectionTitle: "Supports d'impression adaptés aux besoins strasbourgeois",
    printSectionIntro:
      "Des imprimés clairs pour le tourisme, les marchés saisonniers et les rencontres institutionnelles ou B2B.",
    featuredProducts: [
      {
        slug: "depliants",
        customTag: "Guides & Menus Multilingues",
        localPitch: "Dépliants 3 volets idéaux pour présenter vos offres en français, allemand et anglais sans surcharge.",
        recommendedSpec: "500 ex (A5 plié) dès 80 € HT",
      },
      {
        slug: "affiches",
        customTag: "Saisons & Marchés",
        localPitch: "Affiches haute définition pour annoncer vos événements culturels, marchés et temps forts commerciaux.",
        recommendedSpec: "10 ex (A4) dès 28 € HT",
      },
      {
        slug: "roll-up",
        customTag: "Colloques & Institutions",
        localPitch: "Support vertical stable et transportable pour vos conférences, forums et stands européens.",
        recommendedSpec: "Dès 95 € HT",
      },
      {
        slug: "baches",
        customTag: "Chantiers & Événements",
        localPitch: "Banderoles extérieures résistantes aux intempéries et aux températures hivernales.",
        recommendedSpec: "Dès 8,50 € HT / m²",
      },
      {
        slug: "cartes-de-visite",
        customTag: "Recto FR / Verso DE-EN",
        localPitch: "Exploitez le recto-verso pour afficher vos coordonnées en français d'un côté et en anglais ou allemand de l'autre.",
        recommendedSpec: "500 ex dès 46 € HT",
      },
      {
        slug: "badges",
        customTag: "Accueil & Visites",
        localPitch: "Badges personnalisés pour congrès, visites guidées et équipes d'accueil.",
        recommendedSpec: "10 ex dès 48 € HT",
      },
    ],
    sectorsTitle: "Conseils pratiques pour vos imprimés à Strasbourg",
    sectorsIntro:
      "Optimisez vos formats lorsque vous intégrez plusieurs langues ou préparez des événements saisonniers.",
    localSectors: [
      {
        sector: "Communication Transfrontalière & B2B",
        title: "Structurer des supports bilingues lisibles",
        description:
          "Utilisez des cartes de visite recto/verso bilingues et des dépliants à volets dédiés par langue pour éviter les textes trop petits.",
        recommendedSupports: ["Dépliants dès 80 € HT", "Cartes de visite dès 46 € HT", "Brochures dès 140 € HT"],
        paperTip: "Un format A4 ouvert plié en 3 volets offre 6 faces distinctes, parfait pour un contenu bilingue aéré.",
      },
      {
        sector: "Commerces, Artisanat & Tourisme",
        title: "Captez les visiteurs toute l'année",
        description:
          "Affiches vitrines, autocollants pour paquets cadeaux et cartes postales souvenirs ou promotionnelles.",
        recommendedSupports: ["Affiches dès 28 € HT", "Autocollants dès 75 € HT", "Cartes postales dès 64 € HT"],
        paperTip: "Prévoyez 3 mm de marge de sécurité interne sur tous vos textes accentués ou caractères spéciaux.",
      },
      {
        sector: "Congrès, Forums & Associations",
        title: "Signalétique claire et accueil organisé",
        description:
          "Roll-up d'orientation, badges pour les participants et tours de cou personnalisés.",
        recommendedSupports: ["Roll-Up dès 95 € HT", "Badges dès 48 € HT", "Tours de cou dès 240 € HT"],
        paperTip: "Validez toujours la vectorisation des polices avant export PDF pour préserver tous les accents.",
      },
    ],
    designSectionTitle: "Mise en page graphique, logo & site multilingue",
    designSectionBody:
      "Nos graphistes prennent en main l'équilibre typographique de vos documents multilingues, la création de votre identité visuelle et le développement de votre site web vitrine.",
    highlightedServices: [
      { label: "Design graphique & édition", href: "/design-graphique", pitch: "Mise en page soignée de brochures et dépliants multilingues." },
      { label: "Identité visuelle", href: "/identite-visuelle", pitch: "Cohérence graphique pour marques et institutions." },
      { label: "Motion design", href: "/motion-design", pitch: "Animations pédagogiques et sous-titrages multilingues." },
    ],
    workflowNote:
      "Contrôle technique PAO gratuit sur chaque commande. Production standard en 2 jours ouvrables (+2 jours avec vernis/pelliculage) et livraison à Strasbourg sous 1 à 3 jours ouvrables.",
    faqs: [
      {
        question: "Puis-je imprimer un recto en français et un verso en allemand ou anglais au même prix ?",
        answer:
          "Oui, nos cartes de visite et flyers recto-verso permettent d'imprimer une langue par face sans coût supplémentaire sur le tirage standard.",
      },
      {
        question: "Les bâches résistent-elles au froid et à la pluie en Alsace ?",
        answer:
          "Oui, nos bâches PVC sont conçues pour un usage extérieur résistant aux intempéries et aux variations climatiques.",
      },
      {
        question: "Pouvez-vous vérifier mon fichier avant de lancer l'impression ?",
        answer:
          "Chaque commande inclut un contrôle PAO gratuit pour vérifier résolution (300 DPI), profil CMJN et fonds perdus (2 mm).",
      },
      {
        question: "Quels formats de fichiers acceptez-vous ?",
        answer:
          "Nous acceptons les fichiers PDF, JPG, TIF, EPS et AI (avec textes vectorisés pour EPS et AI).",
      },
    ],
    ctaPrimaryLabel: "Découvrir nos tarifs HT",
    ctaSecondaryLabel: "Demander un devis gratuit",
    finalCtaTitle: "Commandez vos imprimés pour Strasbourg en toute sérénité",
    finalCtaSubtitle: "Tarifs directs du catalogue et livraison suivie dans tout le Bas-Rhin.",
    photo: {
      path: "/images/villes/strasbourg.webp",
      width: 1600,
      height: 928,
      alt: "Quartier de la Petite France et maisons à colombages à Strasbourg",
      caption: "Strasbourg — Petite France et canaux",
      author: "Lawitschka yvan",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Couleurs_d%27automne_%C3%A0_Strasbourg.jpg",
    },
  },

  {
    slug: "agence-graphique-montpellier",
    city: "Montpellier",
    preposition: "à Montpellier",
    region: "Occitanie",
    department: "Hérault (34)",
    layoutVariant: "dynamic-split",
    accent: "magenta",
    seoTitle: "Impression & Design à Montpellier | Flyers, Affiches, Stickers - Art Vision",
    metaDescription:
      "Impression et création graphique pour Montpellier : flyers dès 48 € HT, stickers dès 75 € HT, cartes de visite dès 46 € HT, bracelets dès 69 € HT. Livraison Hérault.",
    focusKeyword: "impression communication Montpellier",
    heroBadge: "Occitanie • Entreprises Émergentes, Associations & Événements",
    h1: "Impression rapide & design créatif à Montpellier",
    heroSubtitle:
      "Startups, commerces de l'Écusson, clubs sportifs et associations étudiantes : imprimez des supports modernes, colorés et accessibles avec contrôle PAO inclus.",
    intro:
      "Ville jeune, entrepreneuriale et événementielle, Montpellier demande des supports de communication dynamiques et faciles à déployer. Art Vision accompagne les entreprises émergentes, associations et commerces montpelliérains avec des flyers, stickers, affiches, bracelets événementiels et créations graphiques sur mesure.",
    editorialAngle: "Entreprises émergentes, associations et événements",
    printSectionTitle: "Les supports phares pour Montpellier et l'Hérault",
    printSectionIntro:
      "Des tirages réactifs pour les lancements d'activité, festivals, soirées et actions de terrain.",
    featuredProducts: [
      {
        slug: "flyers",
        customTag: "Lancements & Campus",
        localPitch: "Flyers A6 ou A5 percutants pour annoncer un événement, une ouverture ou une offre de lancement.",
        recommendedSpec: "500 ex (A6) dès 48 € HT",
      },
      {
        slug: "autocollants",
        customTag: "Startups & Street",
        localPitch: "Stickers découpés pour diffuser votre logo sur emballages, gourdes, ordinateurs et vitrines.",
        recommendedSpec: "250 ex dès 75 € HT",
      },
      {
        slug: "bracelets",
        customTag: "Festivals & Soirées",
        localPitch: "Bracelets Tyvek indéchirables avec fermeture adhésive et numérotation pour contrôler vos entrées.",
        recommendedSpec: "500 ex dès 69 € HT",
      },
      {
        slug: "cartes-de-visite",
        customTag: "Réseaux & Incubateurs",
        localPitch: "Cartes 85 × 55 mm pour vos rencontres en pépinières, salons digitaux et commerces.",
        recommendedSpec: "500 ex dès 46 € HT",
      },
      {
        slug: "affiches-fluo",
        customTag: "Événements & Promos",
        localPitch: "Affiches fluo jaune, vert, orange ou rouge pour capter l'œil immédiatement en vitrine ou sur panneau.",
        recommendedSpec: "50 ex (A4) dès 70 € HT",
      },
      {
        slug: "textiles",
        customTag: "Équipes & Assos",
        localPitch: "T-shirts personnalisés pour souder vos équipes événementielles, bénévoles ou clubs sportifs.",
        recommendedSpec: "50 ex dès 353 € HT",
      },
    ],
    sectorsTitle: "Des solutions print agiles pour l'écosystème montpelliérain",
    sectorsIntro:
      "Des combinaisons efficaces pour maximiser votre visibilité tout en maîtrisant votre budget.",
    localSectors: [
      {
        sector: "Jeunes Entreprises & Freelances",
        title: "Exister sur le terrain dès le premier mois",
        description:
          "Utilisez notre studio gratuit en ligne pour créer votre carte de visite et complétez avec un lot de flyers ou autocollants.",
        recommendedSupports: ["Cartes de visite dès 46 € HT", "Autocollants dès 75 € HT", "Studio en ligne"],
        paperTip: "Un QR code bien contrasté sur vos flyers facilite le suivi de vos retombées sur votre site web.",
      },
      {
        sector: "Associations & Événementiel",
        title: "Organiser vos soirées et festivals sans stress",
        description:
          "Affiches fluo pour annoncer la date, bracelets Tyvek à 69 € HT les 500 et tickets d'entrée micro-perforés.",
        recommendedSupports: ["Bracelets dès 69 € HT", "Affiches fluo dès 70 € HT", "Tickets d'entrée dès 116 € HT"],
        paperTip: "Pour les affiches fluo, travaillez en noir pur sur papier coloré pour un contraste maximal.",
      },
      {
        sector: "Commerces de Centre-Ville",
        title: "Dynamiser vos vitrines et commandes",
        description:
          "Affiches saisonnières, cartes de fidélité et dépliants de présentation à glisser dans vos sacs.",
        recommendedSupports: ["Affiches dès 28 € HT", "Dépliants dès 80 € HT", "Cartes PVC dès 53 € HT"],
        paperTip: "Prévoyez 2 mm de bord perdu sur toutes vos affiches pour éviter un filet blanc à la découpe.",
      },
    ],
    designSectionTitle: "Création de logo, vidéo & community management pour Montpellier",
    designSectionBody:
      "Vous lancez une marque à Montpellier ? Art Vision réalise votre logo vectoriel, vos vidéos sociales et vos visuels graphiques pour garder la même énergie en ligne et sur papier.",
    highlightedServices: [
      { label: "Création de logo", href: "/creation-logo-professionnel", pitch: "Un logo moderne livré en vectoriel prêt pour print et web." },
      { label: "Community management", href: "/community-management", pitch: "Contenus réguliers alignés sur vos campagnes imprimées." },
      { label: "Site vitrine", href: "/creation-site-vitrine", pitch: "Un site rapide pour convertir les visites issues de vos flyers." },
    ],
    workflowNote:
      "Contrôle technique gratuit de vos fichiers avant tirage. Production standard en 2 jours ouvrables (+2 jours avec vernis ou pelliculage), livraison dans l'Hérault sous 1 à 3 jours ouvrables.",
    faqs: [
      {
        question: "Combien coûtent 500 bracelets événementiels pour une soirée à Montpellier ?",
        answer:
          "Nos bracelets d'identification Tyvek indéchirables démarrent à 69 € HT pour 500 exemplaires.",
      },
      {
        question: "Puis-je commander des t-shirts personnalisés pour une association ?",
        answer:
          "Oui, les textiles personnalisés (t-shirts) sont accessibles à partir de 50 exemplaires dès 353 € HT.",
      },
      {
        question: "Est-ce que je peux préparer mon flyer sans savoir utiliser Photoshop ?",
        answer:
          "Oui, notre studio en ligne (/studio) permet de composer facilement vos cartes de visite, flyers et affiches depuis votre navigateur.",
      },
      {
        question: "Livrez-vous partout à Montpellier et autour (Castelnau, Lattes, Pérols) ?",
        answer:
          "Oui, la livraison est assurée partout en France métropolitaine en 1 à 3 jours ouvrables après production.",
      },
    ],
    ctaPrimaryLabel: "Voir les supports et prix",
    ctaSecondaryLabel: "Personnaliser mon support",
    finalCtaTitle: "Lancez vos impressions et créations pour Montpellier",
    finalCtaSubtitle: "Tarifs transparents en ligne et devis personnalisé gratuit sous 24h ouvrées.",
    photo: {
      path: "/images/villes/montpellier.webp",
      width: 1600,
      height: 1350,
      alt: "Place de la Comédie et fontaine des Trois Grâces à Montpellier",
      caption: "Montpellier — Place de la Comédie",
      author: "Peter from Salisbury, UK",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Comedie,_Montpellier_with_fountain_(14080865470).jpg",
    },
  },

  {
    slug: "agence-graphique-rennes",
    city: "Rennes",
    preposition: "à Rennes",
    region: "Bretagne",
    department: "Ille-et-Vilaine (35)",
    layoutVariant: "corporate-asymmetric",
    accent: "orange",
    seoTitle: "Impression & Graphisme à Rennes | Flyers, Affiches, Cartes - Art Vision",
    metaDescription:
      "Impression pour commerces indépendants, étudiants et associations à Rennes : flyers dès 48 € HT, affiches dès 28 € HT, cartes dès 46 € HT, tickets dès 116 € HT.",
    focusKeyword: "impression flyers Rennes",
    heroBadge: "Bretagne • Commerces Indépendants, Étudiants & Associations",
    h1: "Impression de flyers, affiches & supports associatifs à Rennes",
    heroSubtitle:
      "Commerçants du centre rennais, bureaux des étudiants, festivals et PME d'Ille-et-Vilaine : profitez de tirages fiables et d'un studio de création accessible.",
    intro:
      "Dynamisée par sa vie étudiante, culturelle et ses commerces indépendants, Rennes génère tout au long de l'année un fort besoin en communication de proximité : flyers de quartier, affiches de concerts, tickets numérotés et cartes de visite. À proximité de notre siège du Mans, Art Vision vous offre un service rapide et sans surprise.",
    editorialAngle: "Commerces indépendants, étudiants et associations",
    printSectionTitle: "Supports incontournables pour Rennes et la Bretagne",
    printSectionIntro:
      "Des imprimés adaptés aux budgets associatifs comme aux commerçants exigeants.",
    featuredProducts: [
      {
        slug: "flyers",
        customTag: "Diffusion Quartiers",
        localPitch: "Formats A6 et A5 pratiques pour les distributions piétonnes, comptoirs de cafés et commerces.",
        recommendedSpec: "500 ex (A6) dès 48 € HT",
      },
      {
        slug: "affiches",
        customTag: "Festivals & Concerts",
        localPitch: "Petites ou grandes séries pour couvrir vos événements culturels et animations de rue.",
        recommendedSpec: "10 ex (A4) dès 28 € HT",
      },
      {
        slug: "tickets-entree",
        customTag: "Billetterie & Tombolas",
        localPitch: "Carnets ou tickets individuels numérotés pour galas étudiants, concerts et lotos associatifs.",
        recommendedSpec: "500 ex (A7) dès 116 € HT",
      },
      {
        slug: "cartes-de-visite",
        customTag: "Indépendants & Artisans",
        localPitch: "Cartes solides 85 × 55 mm pour développer votre bouche-à-oreille en Ille-et-Vilaine.",
        recommendedSpec: "500 ex dès 46 € HT",
      },
      {
        slug: "badges",
        customTag: "Bénévoles & BDE",
        localPitch: "Badges épingle ou magnétiques pour identifier vos équipes d'accueil lors d'événements.",
        recommendedSpec: "10 ex dès 48 € HT",
      },
      {
        slug: "marque-pages",
        customTag: "Édition & Librairies",
        localPitch: "Un support utile et économique apprécié par les commerces culturels et établissements scolaires.",
        recommendedSpec: "500 ex dès 68 € HT",
      },
    ],
    sectorsTitle: "Utilisations concrètes pour les acteurs rennais",
    sectorsIntro:
      "Bien calibrer son papier et sa quantité évite le gaspillage tout en optimisant le coût unitaire.",
    localSectors: [
      {
        sector: "Associations & Vie Étudiante",
        title: "Gérer entrées, buvettes et communication",
        description:
          "Combinez billetterie sécurisée (tickets numérotés ou bracelets), affiches fluo pour les campus et badges pour les organisateurs.",
        recommendedSupports: ["Tickets d'entrée dès 116 € HT", "Bracelets dès 69 € HT", "Affiches fluo dès 70 € HT"],
        paperTip: "Pour les tickets d'entrée, pensez à laisser une zone blanche dégagée si vous ajoutez un tampon ou numéro.",
      },
      {
        sector: "Boutiques & Cafés Indépendants",
        title: "Fidéliser la clientèle de proximité",
        description:
          "Cartes de fidélité, dépliants menus et stickers sur vos gobelets ou emballages à emporter.",
        recommendedSupports: ["Cartes de visite dès 46 € HT", "Autocollants dès 75 € HT", "Dépliants dès 80 € HT"],
        paperTip: "Un flyer 170g offre une meilleure tenue sur un comptoir de café qu'un papier trop fin.",
      },
      {
        sector: "PME & Prestataires Services",
        title: "Supports de rendez-vous et véhicules",
        description:
          "Brochures de présentation, chemises à rabats et marquage magnétique ou adhésif sur vos utilitaires.",
        recommendedSupports: ["Brochures dès 140 € HT", "Fardes à rabats dès 282 € HT", "Marquage véhicules dès 80 € HT"],
        paperTip: "Utilisez des fichiers vectoriels pour les logos destinés aux véhicules et panneaux.",
      },
    ],
    designSectionTitle: "Design graphique, logos & sites web pour Rennes",
    designSectionBody:
      "Besoin d'un coup de main créatif pour votre association ou entreprise rennaise ? Nos graphistes conçoivent vos affiches, identités visuelles et sites internet clés en main.",
    highlightedServices: [
      { label: "Design graphique", href: "/design-graphique", pitch: "Mise en page d'affiches, flyers et programmes d'événements." },
      { label: "Création de logo", href: "/creation-logo-professionnel", pitch: "Un emblème clair pour tous vos supports print et textiles." },
      { label: "Site vitrine", href: "/creation-site-vitrine", pitch: "Un site rapide pour présenter votre programmation ou vos services." },
    ],
    workflowNote:
      "Contrôle technique gratuit avant impression. Production standard en 2 jours ouvrables (+2 jours avec vernis ou pelliculage) et livraison rapide en Bretagne sous 1 à 3 jours ouvrables.",
    faqs: [
      {
        question: "Proposez-vous des tickets numérotés pour des soirées étudiantes ou festivals à Rennes ?",
        answer:
          "Oui, notre catalogue propose des tickets d'entrée personnalisés dès 116 € HT les 500 exemplaires (format A7) ainsi que des bracelets Tyvek dès 69 € HT.",
      },
      {
        question: "Puis-je commander de petites quantités d'affiches ?",
        answer:
          "Oui, les affiches sont disponibles dès 10 exemplaires (à partir de 28 € HT en format A4), ce qui convient parfaitement aux événements locaux.",
      },
      {
        question: "Comment puis-je obtenir un devis rapide pour mon association ?",
        answer:
          "Cliquez sur « Demander un devis » pour envoyer votre besoin (support, format, quantité) : notre équipe vous répond sous 24h ouvrées.",
      },
      {
        question: "Vos prix incluent-ils la vérification du fichier PDF ?",
        answer:
          "Oui, le contrôle technique (résolution 300 DPI, mode CMJN, bords perdus de 2 mm) est inclus gratuitement sur chaque commande.",
      },
    ],
    ctaPrimaryLabel: "Faire imprimer mes supports",
    ctaSecondaryLabel: "Demander un devis gratuit",
    finalCtaTitle: "Préparez vos prochaines éditions et campagnes à Rennes",
    finalCtaSubtitle: "Tarifs clairs HT, contrôle gratuit et livraison express en Ille-et-Vilaine.",
    photo: {
      path: "/images/villes/rennes.webp",
      width: 1600,
      height: 1129,
      alt: "Architecture de la Place du Parlement de Bretagne à Rennes",
      caption: "Rennes — Place du Parlement de Bretagne",
      author: "GO69",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Rennes_(35)_Place_du_Parlement_-_Immeuble_n%C2%B011_-_Mascaron_-_01.jpg",
    },
  },
];
