/**
 * Comprehensive Idempotent Seeder for Art Vision SEO Expansion:
 * - 14 High-Value Commercial Money Pages (SeoLandingPage)
 * - 52 Supporting SEO Blog Articles (BlogPost)
 * - Companion SEOSettings records
 *
 * Run with: npx tsx prisma/seed-expanded-seo.ts
 */
import { makePrisma } from "./seed-client";
import { LOGO_BRANDING_BLOGS } from "./data/seo-blogs-logo";
import { PRINT_BLOGS } from "./data/seo-blogs-print";
import { WEB_BLOGS } from "./data/seo-blogs-web";

const prisma = makePrisma();

const IMG = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=75`;

interface CommercialPageDef {
  slug: string;
  keyword: string;
  title: string;
  h1: string;
  metaDesc: string;
  intro: string;
  content: string;
  faqs: { question: string; answer: string }[];
  relatedServices: string;
  relatedPortfolio?: string;
}

const COMMERCIAL_PAGES: CommercialPageDef[] = [
  {
    slug: "charte-graphique",
    keyword: "charte graphique",
    title: "Création de Charte Graphique d'Entreprise Complète | Art Vision",
    h1: "Création de Charte Graphique Professionnelle & Sur-Mesure",
    metaDesc:
      "Confiez la création de votre charte graphique à Art Vision : règles typographiques, palettes de couleurs, logotype, iconographie et guide d'application PDF complet.",
    intro:
      "La charte graphique est le passeport visuel de votre marque. Elle fixe avec précision les règles d'utilisation de votre logo, vos typographies et vos couleurs pour garantir une cohérence absolue sur tous vos supports de communication.",
    content: `
<h2>Pourquoi la charte graphique est indispensable à votre entreprise</h2>
<p>Une identité visuelle ne se limite pas à un simple logo. Sans cadre rigoureux, chaque nouveau collaborateur, imprimeur ou développeur web risque d'interpréter votre image à sa manière, diluant ainsi votre impact. La <strong>charte graphique d'entreprise</strong> sert de manuel de référence unique pour préserver votre crédibilité et votre professionnalisme.</p>

<h3>Ce que contient une charte graphique conçue par Art Vision</h3>
<ul>
  <li><strong>Règles d'usage du logotype :</strong> zone d'exclusion, dimensions minimales autorisées, versions sur fond clair et fond sombre, interdictions formelles.</li>
  <li><strong>Palette chromatique complète :</strong> références précises en CMJN (impression offset/numérique), RVB (écrans), codes HEX (web) et références Pantone (PMS).</li>
  <li><strong>Typographies de marque :</strong> polices principales de titrage, polices de labeur (textes courants) et polices web de substitution universelles.</li>
  <li><strong>Hiérarchie visuelle et iconographie :</strong> règles d'espacement, style photographique, jeux d'icônes et éléments graphiques secondaires.</li>
  <li><strong>Déclinaisons sur supports réels :</strong> exemples concrets d'application sur <a href="/impression/carte-de-visite">cartes de visite</a>, papier à en-tête, signature d'email et bannières réseaux sociaux.</li>
</ul>

<h2>Notre processus d'élaboration en 4 étapes</h2>
<ol>
  <li><strong>Audit et cadrage :</strong> analyse de votre positionnement, de vos concurrents et des contraintes techniques de votre secteur.</li>
  <li><strong>Recherche et formalisation :</strong> tests de lisibilité, contrastes WCAG pour le web et simulations d'impression.</li>
  <li><strong>Rédaction du guide de marque :</strong> mise en page soignée d'un document PDF interactif et didactique de 15 à 30 pages.</li>
  <li><strong>Livraison et accompagnement :</strong> transfert de tous les fichiers sources vectoriels et session d'explication pour vos équipes.</li>
</ol>
`,
    faqs: [
      {
        question: "Combien coûte la création d'une charte graphique ?",
        answer:
          "Pour une TPE ou un indépendant, une charte essentielle (logo, couleurs, typos, règles de base) démarre généralement autour de 350€ à 700€. Pour une PME ou une marque complète nécessitant des déclinaisons multicanaux, le budget se situe entre 800€ et 2 500€.",
      },
      {
        question: "Sous quel format est livrée la charte graphique ?",
        answer:
          "Elle est livrée sous la forme d'un document PDF interactif haute définition, structuré et indexé, accompagné d'un dossier complet contenant toutes les polices sous licence et les fichiers vectoriels (AI, SVG, EPS).",
      },
      {
        question: "Quelle différence entre identité visuelle et charte graphique ?",
        answer:
          "L'identité visuelle est l'ensemble des éléments graphiques qui composent votre univers de marque (logo, couleurs, formes). La charte graphique est le document normatif qui en régit l'application exacte.",
      },
    ],
    relatedServices: "identite-visuelle,creation-logo-professionnel,design-graphique",
    relatedPortfolio: "oleapure-branding",
  },
  {
    slug: "agence-graphique",
    keyword: "agence graphique",
    title: "Agence Graphique & Studio de Création Visuelle en France | Art Vision",
    h1: "Agence Graphique & Direction Artistique pour Entreprises",
    metaDesc:
      "Art Vision, agence graphique et studio de design visuel : conception de logos, chartes graphiques, packshots 3D, supports imprimés et vidéos publicitaires.",
    intro:
      "Votre image de marque mérite l'exigence d'un studio de design dédié. Art Vision allie créativité contemporaine, rigueur technique et réactivité pour transformer vos idées en actifs visuels durables.",
    content: `
<h2>L'excellence créative au service de votre croissance</h2>
<p>Dans un marché saturé où l'attention des clients se compte en secondes, un design médiocre coûte cher en opportunités manquées. En tant qu'<strong>agence graphique de référence</strong>, Art Vision intervient à 360° sur votre écosystème de marque avec une approche globale.</p>

<h3>Nos domaines d'intervention clés</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <h4>Identité de Marque & Logotypes</h4>
    <p>Conception de <a href="/creation-logo-professionnel">logos professionnels vectoriels</a>, refonte de marques historiques et création d'univers visuels mémorables.</p>
  </div>
  <div>
    <h4>Édition & Supports Imprimés</h4>
    <p>Création graphique et impression de <a href="/impression/carte-de-visite">cartes de visite haut de gamme</a>, flyers, brochures commerciales et signalétique grand format.</p>
  </div>
  <div>
    <h4>Modélisation 3D & Packshots Produits</h4>
    <p>Visualisation de produits photoréalistes sous Blender sans nécessiter de coûteux shootings photos en studio.</p>
  </div>
  <div>
    <h4>Webdesign & Interfaces Digitales</h4>
    <p>Conception de maquettes UI/UX ergonomiques pour <a href="/creation-site-internet">sites internet professionnels</a> et applications mobiles.</p>
  </div>
</div>

<h2>Pourquoi choisir Art Vision plutôt qu'une agence classique ?</h2>
<ul>
  <li><strong>Un interlocuteur unique et direct :</strong> votre chef de projet est également designer, garantissant une communication fluide sans déperdition d'information.</li>
  <li><strong>Tarifs transparents et compétitifs :</strong> aucun coût d'infrastructure superflu, des formules au juste prix adaptées aux PME et créateurs d'entreprise.</li>
  <li><strong>Contrôle technique rigoureux :</strong> de la colorimétrie CMJN certifiée pour l'atelier d'impression au code sémantique optimisé pour Google.</li>
</ul>
`,
    faqs: [
      {
        question: "Comment se déroule une collaboration avec Art Vision ?",
        answer:
          "Nous débutons par un échange approfondi (visio ou rendez-vous) pour cerner vos objectifs. Nous établissons un devis détaillé sous 24h, puis livrons les propositions créatives par étapes avec validation progressive.",
      },
      {
        question: "Travaillez-vous avec des clients partout en France et à l'international ?",
        answer:
          "Oui. Grâce à nos outils collaboratifs en ligne, nous accompagnons des clients à Paris, Lyon, Marseille, Lille, Nantes ainsi qu'en Belgique et en Suisse avec la même réactivité.",
      },
    ],
    relatedServices: "identite-visuelle,creation-logo-professionnel,design-graphique",
    relatedPortfolio: "oleapure-branding,tadaa-3d-packshot",
  },
  {
    slug: "impression-pas-cher",
    keyword: "impression pas cher",
    title: "Impression Professionnelle Pas Cher en Ligne | Art Vision",
    h1: "Impression Professionnelle en Ligne au Meilleur Prix",
    metaDesc:
      "Imprimez vos cartes de visite, flyers, affiches et brochures au meilleur prix sans compromis sur la qualité. Vérification PAO gratuite et expédition rapide.",
    intro:
      "Faire des économies sur vos impressions ne signifie pas accepter un papier médiocre ou des couleurs ternes. Art Vision vous propose une impression professionnelle de haute tenue à des tarifs ultra-compétitifs.",
    content: `
<h2>L'impression professionnelle au prix juste sans compromis qualité</h2>
<p>Trop d'offres dites « discount » livrent des papiers translucides ou des impressions mal découpées qui ruinent l'image de votre entreprise. Chez Art Vision, notre engagement pour l'<strong>impression pas cher</strong> repose sur l'optimisation industrielle de nos tirages en amalgame, et non sur le rabais des matières premières.</p>

<h3>Comment nous vous permettons d'optimiser votre budget d'impression</h3>
<ul>
  <li><strong>Le principe de l'amalgame :</strong> nous regroupons plusieurs commandes sur les mêmes planches d'impression, ce qui mutualise les coûts de calage machine et réduit drastiquement le prix unitaire.</li>
  <li><strong>Papiers certifiés :</strong> nous n'imprimons jamais en-dessous des grammages professionnels recommandés (135g minimum pour les flyers, 350g pour les cartes de visite).</li>
  <li><strong>Vérification technique offerte :</strong> contrôle systématique de vos repères de coupe, de vos marges de sécurité et du mode CMJN pour éviter les tirages gâchés.</li>
</ul>

<h2>Découvrez nos tarifs attractifs sur tous nos supports</h2>
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  <a href="/impression/carte-de-visite" class="block p-4 bg-[#1A1238]/60 border border-brand-purple/20 rounded-xl hover:border-brand-magenta transition">
    <strong>Cartes de Visite</strong>
    <p class="text-xs text-white/60">350g couché mat, dès quelques centimes l'unité.</p>
  </a>
  <a href="/impression/flyer" class="block p-4 bg-[#1A1238]/60 border border-brand-purple/20 rounded-xl hover:border-brand-magenta transition">
    <strong>Flyers & Tracts</strong>
    <p class="text-xs text-white/60">A6, A5, A4, tarifs dégressifs dès 100 ex.</p>
  </a>
  <a href="/impression/affiche" class="block p-4 bg-[#1A1238]/60 border border-brand-purple/20 rounded-xl hover:border-brand-magenta transition">
    <strong>Affiches Publicitaires</strong>
    <p class="text-xs text-white/60">A3 à A0, encres UV haute fidélité.</p>
  </a>
  <a href="/impression/brochure" class="block p-4 bg-[#1A1238]/60 border border-brand-purple/20 rounded-xl hover:border-brand-magenta transition">
    <strong>Brochures & Dépliants</strong>
    <p class="text-xs text-white/60">Finitions agrafées ou plis 2/3 volets.</p>
  </a>
</div>
`,
    faqs: [
      {
        question: "Comment réduire le coût d'une commande d'impression ?",
        answer:
          "Trois leviers majeurs : augmenter la quantité pour profiter de la dégressivité, choisir des formats standards (A5, A6, 85×55 mm) qui optimisent la feuille machine, et anticiper vos besoins pour éviter les surcoûts d'expédition express.",
      },
      {
        question: "Les prix affichés comprennent-ils le contrôle de mon fichier ?",
        answer:
          "Oui, un technicien PAO vérifie vos repères de coupe, vos fonds perdus et votre résolution avant tout lancement machine.",
      },
    ],
    relatedServices: "design-graphique",
  },
  {
    slug: "impression-rapide",
    keyword: "impression rapide",
    title: "Impression Rapide & Express en Ligne | Délais Garantis - Art Vision",
    h1: "Impression Rapide & Express de vos Supports Publicitaires",
    metaDesc:
      "Besoin d'imprimés en urgence ? Art Vision assure la fabrication rapide de vos cartes de visite, flyers, banderoles et affiches avec expédition suivie.",
    intro:
      "Un événement imprévu, un salon professionnel imminent ou une rupture de stock ? Art Vision met à votre service une chaîne de production réactive pour imprimer et expédier vos documents dans des délais courts et fiables.",
    content: `
<h2>Des délais maîtrisés basés sur des capacités réelles</h2>
<p>L'<strong>impression rapide</strong> ne tolère aucune approximation. Nous ne formulons aucune promesse irréaliste de livraison instantanée : nous indiquons des plannings de production transparents (2 à 3 jours ouvrables en formule express) appuyés sur nos équipements numériques à séchage immédiat.</p>

<h3>Les clés pour gagner du temps lors d'une commande urgente</h3>
<ol>
  <li><strong>Fournir un fichier PDF conforme dès le départ :</strong> résolution 300 DPI, mode colorimétrique CMJN, textes vectorisés et 2 mm de fond perdu.</li>
  <li><strong>Valider le Bon à Tirer (BAT) sans attendre :</strong> dès réception de l'épreuve numérique, votre validation électronique déclenche instantanément le calage machine.</li>
  <li><strong>Opter pour des finitions simples :</strong> le vernis sélectif 3D ou la dorure nécessitent des temps de séchage incompressibles (+24 à 48h). Pour l'urgence, privilégiez le couché demi-mat ou le pelliculage mat standard.</li>
</ol>

<h2>Nos produits disponibles en production accélérée</h2>
<ul>
  <li><strong><a href="/impression/carte-de-visite">Cartes de visite express :</a></strong> découpe automatisée et emballage en boîtes rigides.</li>
  <li><strong><a href="/impression/flyer">Flyers et prospectus :</a></strong> tirage numérique haute cadence sur 135g ou 170g.</li>
  <li><strong><a href="/impression/bache">Bâches publicitaires :</a></strong> soudure d'ourlets et pose d'œillets express.</li>
  <li><strong><a href="/impression/roll-up">Roll-up et totems enrouleurs :</a></strong> montage en structure alu prêt à poser.</li>
</ul>
`,
    faqs: [
      {
        question: "Quels sont les délais réels pour une commande d'impression express ?",
        answer:
          "En formule express, la production est réalisée en 48h ouvrées après validation de votre Bon à Tirer (BAT), puis expédiée avec livraison en 24h via transporteur express.",
      },
      {
        question: "Proposez-vous une livraison le jour même (same-day) ?",
        answer:
          "Non, nous ne faisons pas de fausses promesses techniques. Un travail d'impression de qualité exige un calage rigoureux et un temps de séchage chimique des encres.",
      },
    ],
    relatedServices: "design-graphique",
  },
  {
    slug: "creation-site-internet",
    keyword: "création site internet",
    title: "Création de Site Internet Professionnel & Sur-Mesure | Art Vision",
    h1: "Création de Site Internet Professionnel, Moderne & Optimisé SEO",
    metaDesc:
      "Art Vision conçoit votre site internet professionnel sur-mesure : design soigné, temps de chargement ultra-rapides, responsive mobile et visibilité Google garantie.",
    intro:
      "Votre site internet est le cœur névralgique de votre présence digitale. Nous développons des sites web sur-mesure, performants, sécurisés et pensés pour convertir vos visiteurs en clients fidèles.",
    content: `
<h2>Un site web moderne taillé pour la conversion et la visibilité</h2>
<p>Aujourd'hui, un site internet ne peut plus être une simple plaquette statique perdue sur les moteurs de recherche. Pour générer un retour sur investissement tangible, votre site doit allier <strong>vitesse de chargement fulgurante</strong>, ergonomie intuitive sur smartphone et conformité technique absolue avec les algorithmes de Google.</p>

<h3>Nos engagements pour votre futur site web</h3>
<ul>
  <li><strong>Technologies de pointe :</strong> développement avec Next.js et React pour des performances inégalées, ou WordPress sur-mesure pour une autonomie totale de gestion.</li>
  <li><strong>Optimisation SEO dès la racine :</strong> balisage sémantique HTML5, métadonnées soignées, données structurées Schema.org et temps de chargement sous la seconde (Core Web Vitals au vert).</li>
  <li><strong>Design unique à votre image :</strong> aucun template générique acheté en masse. Chaque page est dessinée en adéquation avec votre <a href="/charte-graphique">charte graphique</a>.</li>
  <li><strong>Sécurité et conformité RGPD :</strong> certificat SSL HTTPS, formulaire de consentement aux cookies et hébergement haute disponibilité.</li>
</ul>

<h2>Des formules adaptées à chaque étape de votre développement</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="p-5 bg-[#1A1238]/60 border border-brand-purple/20 rounded-2xl">
    <h4 class="text-white font-bold"><a href="/site-vitrine">Site Vitrine</a></h4>
    <p class="text-xs text-white/65 mt-2">Présentez votre entreprise, vos prestations et capturez des demandes de devis qualifiées.</p>
  </div>
  <div class="p-5 bg-[#1A1238]/60 border border-brand-purple/20 rounded-2xl">
    <h4 class="text-white font-bold"><a href="/creation-site-ecommerce">Site E-Commerce</a></h4>
    <p class="text-xs text-white/65 mt-2">Vendez vos produits en ligne avec un tunnel d'achat optimisé et des paiements sécurisés.</p>
  </div>
  <div class="p-5 bg-[#1A1238]/60 border border-brand-purple/20 rounded-2xl">
    <h4 class="text-white font-bold"><a href="/refonte-site-internet">Refonte de Site</a></h4>
    <p class="text-xs text-white/65 mt-2">Modernisez un site vieillissant pour regagner des positions sur Google et relancer vos conversions.</p>
  </div>
</div>
`,
    faqs: [
      {
        question: "Combien de temps faut-il pour créer un site internet ?",
        answer:
          "Pour un site vitrine professionnel de 3 à 5 pages, comptez généralement entre 2 et 4 semaines selon la réactivité des échanges et la fourniture des contenus. Un projet e-commerce requiert environ 4 à 8 semaines.",
      },
      {
        question: "Puis-je modifier moi-même les textes et images du site ?",
        answer:
          "Absolument. Nous vous formons à la prise en main de votre tableau de bord d'administration pour que vous puissiez mettre à jour vos contenus en toute autonomie.",
      },
      {
        question: "Le référencement naturel (SEO) est-il inclus ?",
        answer:
          "Oui, le socle technique SEO (balises Hn, meta title/description, sitemap.xml, robots.txt, compression d'images, temps de chargement) est intégré de série dans tous nos développements.",
      },
    ],
    relatedServices: "creation-site-vitrine,design-graphique",
    relatedPortfolio: "oleapure-branding",
  },
  {
    slug: "agence-web",
    keyword: "agence web",
    title: "Agence Web & Création Digitale en France | Art Vision",
    h1: "Agence Web Créative, Stratégique & Technique",
    metaDesc:
      "Art Vision, agence web et digitale : conception de sites internet vitrines et e-commerce, ergonomie UI/UX, développement sur-mesure et référencement naturel.",
    intro:
      "Une agence web qui comprend vos enjeux commerciaux. De la première esquisse UI/UX jusqu'à la mise en ligne et l'acquisition de trafic, nous bâtissons des solutions web durables et rentables.",
    content: `
<h2>La synergie du design et de la performance technique</h2>
<p>Trop d'agences séparent la technique du graphisme. Chez Art Vision, notre force réside dans la convergence totale de la <strong>direction artistique</strong> et de l'<strong>ingénierie web moderne</strong>. Votre site n'est pas seulement esthétique : il est rapide, ergonomique et pensé pour transformer vos visiteurs en clients.</p>

<h3>Nos compétences à votre service</h3>
<ul>
  <li><strong>Stratégie de contenu & UX :</strong> architecture de l'information, parcours utilisateur fluide et rédaction de textes percutants orientés conversion.</li>
  <li><strong>Développement Full-Stack :</strong> frameworks modernes (Next.js, Tailwind, React, Node) pour des performances d'affichage instantanées.</li>
  <li><strong>Intégration d'outils métiers :</strong> formulaires de devis dynamiques, réservation en ligne, interfaçage CRM et modules de paiement Stripe/PayPal.</li>
  <li><strong>Maintenance & Sécurité :</strong> forfaits de <a href="/maintenance-site-internet">maintenance préventive</a> pour garantir la continuité de service de votre activité.</li>
</ul>
`,
    faqs: [
      {
        question: "Pourquoi faire appel à une agence web plutôt qu'un outil de création automatique ?",
        answer:
          "Les générateurs automatiques (Wix, Shopify basique) imposent des limites sévères de personnalisation, génèrent un code lourd préjudiciable au SEO et ne vous confèrent pas la propriété de votre outil. Une agence conçoit un actif pérenne qui vous appartient à 100%.",
      },
    ],
    relatedServices: "creation-site-vitrine",
  },
  {
    slug: "site-vitrine",
    keyword: "site vitrine",
    title: "Création de Site Vitrine Professionnel & Artisans | Art Vision",
    h1: "Création de Site Vitrine pour Entreprises, PME & Indépendants",
    metaDesc:
      "Donnez de la visibilité à votre savoir-faire avec un site vitrine élégant, rapide et responsive. Présentation de vos services, avis clients et devis en ligne.",
    intro:
      "Le site vitrine est l'ambassadeur digital de votre entreprise. Conçu pour inspirer confiance et susciter des prises de contact qualifiées, il valorise votre expertise 24h/24.",
    content: `
<h2>Mettez en valeur votre savoir-faire auprès de vos futurs clients</h2>
<p>Que vous soyez artisan, profession libérale, consultant ou dirigeant de PME, vos clients potentiels vous recherchent sur Google avant de prendre contact. Un <strong>site vitrine professionnel</strong> établit immédiatement votre autorité et répond aux questions essentielles de vos prospects.</p>

<h3>Les composants d'un site vitrine réussi</h3>
<ul>
  <li><strong>Une page d'accueil percutante :</strong> proposition de valeur limpide, appel à l'action immédiat et réassurance (certifications, avis clients).</li>
  <li><strong>Pages services détaillées :</strong> descriptif clair de vos prestations avec bénéfices concrets et fourchettes budgétaires indicatives.</li>
  <li><strong>Section réalisations / portfolio :</strong> photos avant/après, études de cas et témoignages pour matérialiser la qualité de votre travail.</li>
  <li><strong>Formulaire de contact & devis ergonomique :</strong> champs optimisés pour maximiser le taux de conversion.</li>
</ul>
`,
    faqs: [
      {
        question: "Quel est le prix d'un site vitrine professionnel ?",
        answer:
          "Chez Art Vision, nos forfaits débutent à partir de 120€ pour un Pack One-Page percutant, 250€ pour un site standard multipages et 800€ pour une version sur-mesure haut de gamme avec animations.",
      },
    ],
    relatedServices: "creation-site-internet,creation-logo-professionnel",
  },
  {
    slug: "creation-site-ecommerce",
    keyword: "site e commerce",
    title: "Création de Site E-Commerce & Boutique en Ligne | Art Vision",
    h1: "Création de Boutique en Ligne E-Commerce Performante",
    metaDesc:
      "Lancez votre boutique e-commerce avec Art Vision : catalogue produits intuitif, paiement sécurisé, gestion des stocks, responsive mobile et tunnel de commande optimisé.",
    intro:
      "Vendez vos produits partout et à toute heure. Nous créons des boutiques en ligne intuitives, sécurisées et optimisées pour maximiser votre taux de transformation et le panier moyen de vos clients.",
    content: `
<h2>Bâtissez une boutique en ligne conçue pour vendre</h2>
<p>L'e-commerce ne s'improvise pas : un temps de chargement trop long, un tunnel de commande complexe ou des fiches produits mal hiérarchisées provoquent l'abandon de panier. Nous concevons votre <strong>site e-commerce</strong> avec une obsession : fluidifier chaque étape de l'expérience d'achat.</p>

<h3>Fonctionnalités clés de nos solutions e-commerce</h3>
<ul>
  <li><strong>Gestion autonome du catalogue :</strong> fiches produits détaillées, gestion des déclinaisons (tailles, couleurs), suivi des stocks et alertes automatiques.</li>
  <li><strong>Paiements sécurisés multicanaux :</strong> intégration de Stripe, Cartes Bancaires, Apple Pay, PayPal et solutions de paiement fractionné.</li>
  <li><strong>Calcul des frais de port automatisé :</strong> liaison avec transporteurs (Mondial Relay, Colissimo, DPD) et génération d'étiquettes d'expédition.</li>
  <li><strong>Outils de relance marketing :</strong> emails automatiques de paniers abandonnés, codes promotionnels et programmes de fidélité.</li>
</ul>
`,
    faqs: [
      {
        question: "Quelle plateforme e-commerce utilisez-vous ?",
        answer:
          "Nous sélectionnons la technologie la plus adaptée à vos besoins et à votre volumétrie : WooCommerce/WordPress pour une grande flexibilité éditoriale, Shopify pour une gestion simplifiée ou Next.js e-commerce sur-mesure pour des performances extrêmes.",
      },
    ],
    relatedServices: "creation-site-internet,design-graphique",
  },
  {
    slug: "creation-site-wordpress",
    keyword: "création site wordpress",
    title: "Création de Site WordPress Professionnel & Sur-Mesure | Art Vision",
    h1: "Création & Développement de Sites WordPress Professionnels",
    metaDesc:
      "Développement de sites WordPress rapides, sécurisés et sur-mesure. Interface facile à administrer, thèmes optimisés et référencement naturel Google.",
    intro:
      "WordPress propulse plus de 40% des sites web mondiaux. Nous exploitons la puissance de ce CMS avec un code sur-mesure, léger et sécurisé, loin des usines à gaz lentes et vulnérables.",
    content: `
<h2>Le meilleur de WordPress : puissance, autonomie et sécurité</h2>
<p>Trop de sites WordPress souffrent de l'accumulation excessive de plugins mal codés, provoquant lenteurs et failles de sécurité. Chez Art Vision, nous concevons des <strong>sites WordPress professionnels</strong> avec un thème épuré sur-mesure et une stack technique optimisée.</p>

<h3>Les piliers de notre développement WordPress</h3>
<ul>
  <li><strong>Édition visuelle intuitive :</strong> gestion facile de vos blocs de contenu grâce à Gutenberg ou un constructeur moderne sans casser la mise en page.</li>
  <li><strong>Vitesse de chargement optimale :</strong> mise en cache serveur, compression des images au format WebP et minification des scripts CSS/JS.</li>
  <li><strong>Sécurité renforcée :</strong> double authentification, pare-feu applicatif, limitation des tentatives de connexion et sauvegardes journalières.</li>
</ul>
`,
    faqs: [
      {
        question: "Est-il facile de modifier le site après sa livraison ?",
        answer:
          "Oui, c'est l'un des grands atouts de WordPress : vous pouvez créer de nouveaux articles, modifier vos tarifs, ajouter des photos et gérer vos pages en quelques clics sans aucune compétence technique.",
      },
    ],
    relatedServices: "creation-site-internet,maintenance-site-internet",
  },
  {
    slug: "refonte-site-internet",
    keyword: "refonte site web",
    title: "Refonte de Site Internet : Modernisation & SEO | Art Vision",
    h1: "Refonte de Site Internet : Modernisez votre Image & Boostez votre Trafic",
    metaDesc:
      "Votre site web est vieillissant ou mal positionné sur Google ? Confiez la refonte de votre site à Art Vision : nouveau design moderne, responsive mobile et préservation de votre SEO.",
    intro:
      "Un site internet daté freine votre développement commercial et nuit à votre image de marque. Nous modernisons votre site web en profondeur tout en protégeant méticuleusement vos acquis SEO et votre historique de liens.",
    content: `
<h2>Quand et pourquoi entreprendre la refonte de votre site web ?</h2>
<p>Les standards du web évoluent vite : un site créé il y a 3 ou 5 ans est souvent inadapté aux nouveaux écrans mobiles, trop lent et vulnérable aux attaques. Une <strong>refonte de site internet</strong> est l'opportunité de repartir sur des bases techniques saines et de rehausser votre image de marque.</p>

<h3>Notre méthode pour sécuriser votre refonte SEO</h3>
<ol>
  <li><strong>Audit préalable de l'existant :</strong> identification de vos pages qui génèrent du trafic et de vos mots-clés stratégiques.</li>
  <li><strong>Plan de redirection 301 rigoureux :</strong> chaque ancienne URL est redirigée de manière permanente vers sa nouvelle équivalence pour ne perdre aucun visiteur ni aucun lien externe (backlink).</li>
  <li><strong>Refonte graphique contemporaine :</strong> alignement avec votre <a href="/charte-graphique">charte graphique actuelle</a> et optimisation du parcours de conversion.</li>
  <li><strong>Gain de performance Core Web Vitals :</strong> division par deux ou trois des temps de chargement.</li>
</ol>
`,
    faqs: [
      {
        question: "Vais-je perdre mon positionnement Google lors d'une refonte ?",
        answer:
          "Non, à condition de suivre scrupuleusement notre plan de redirection 301 et de préserver les balises clés de vos pages qui se classent déjà. Au contraire, le gain de vitesse et l'ergonomie mobile améliorent vos positions sur le moyen terme.",
      },
    ],
    relatedServices: "creation-site-internet,design-graphique",
  },
  {
    slug: "webdesign",
    keyword: "web design",
    title: "Webdesign & Ergonomie UI/UX sur-mesure | Art Vision",
    h1: "Webdesign Moderne, Ergonomie UI/UX & Maquettes Graphiques",
    metaDesc:
      "Conception de maquettes web et mobiles UI/UX percutantes sous Figma : identité visuelle digitale, prototypage interactif et design systems pour marques ambitieuses.",
    intro:
      "Le webdesign ne se contente pas d'être beau : il guide le regard, simplifie la navigation et déclenche l'action. Nous concevons des interfaces digitales captivantes et intuitives.",
    content: `
<h2>L'art de concevoir des interfaces qui captivent et convertissent</h2>
<p>Une bonne interface utilisateur (UI) alliée à une expérience utilisateur soignée (UX) transforme une simple visite en conviction d'achat. Notre studio de <strong>webdesign</strong> conçoit des maquettes graphiques sur-mesure sous Figma avec des prototypes cliquables réalistes.</p>

<h3>Notre approche du design digital</h3>
<ul>
  <li><strong>Recherche utilisateur & wireframes :</strong> structuration des écrans et hiérarchisation des messages avant la mise en couleur.</li>
  <li><strong>Direction artistique numérique :</strong> création d'ambiances visuelles fortes, de typographies audacieuses et de micro-interactions engageantes.</li>
  <li><strong>Design System réutilisable :</strong> bibliothèque de composants modulaires (boutons, cartes, bannières) pour garantir une évolution cohérente de votre site.</li>
</ul>
`,
    faqs: [
      {
        question: "Sous quel logiciel concevez-vous les maquettes ?",
        answer:
          "Nous utilisons Figma, la référence mondiale du design d'interface, permettant des revues interactives, des tests cliquables et une transmission parfaite aux développeurs.",
      },
    ],
    relatedServices: "creation-site-internet,design-graphique",
  },
  {
    slug: "creation-site-internet-pas-cher",
    keyword: "création site internet pas cher",
    title: "Création de Site Internet Pas Cher & Professionnel | Art Vision",
    h1: "Création de Site Internet Pas Cher & Rentable pour TPE/PME",
    metaDesc:
      "Obtenez un site web professionnel sans exploser votre budget. Formules claires dès 120€, design soigné, responsive mobile et nom de domaine inclus.",
    intro:
      "Vous lancez votre activité ou disposez d'un budget mesuré ? Art Vision vous propose des solutions web professionnelles abordables, sans compromis sur la qualité d'affichage ni sur le sérieux de votre image.",
    content: `
<h2>Un site web professionnel accessible sans renoncer à la qualité</h2>
<p>Lancer une entreprise exige des investissements multiples. Nous pensons que chaque professionnel a droit à un site web soigné dès le premier jour, sans devoir débourser des milliers d'euros. Notre offre de <strong>création de site internet pas cher</strong> vous garantit un outil immédiatement opérationnel et évolutif.</p>

<h3>Ce qui est inclus dans nos offres économiques</h3>
<ul>
  <li>Une mise en page responsive irréprochable sur smartphone et ordinateur.</li>
  <li>L'intégration de vos coordonnées, formulaire de contact et liens réseaux sociaux.</li>
  <li>L'affichage de votre logo et de vos photos professionnelles.</li>
  <li>La conformité légale (mentions légales, politique de confidentialité).</li>
</ul>
`,
    faqs: [
      {
        question: "Le site pourra-t-il évoluer plus tard ?",
        answer:
          "Absolument. Vous pouvez démarrer avec une formule One-Page économique et ajouter des pages, un blog ou un module e-commerce au fur et à mesure de votre croissance.",
      },
    ],
    relatedServices: "site-vitrine,creation-site-internet",
  },
  {
    slug: "creation-landing-page",
    keyword: "création landing page",
    title: "Création de Landing Page à Forte Conversion | Art Vision",
    h1: "Création de Landing Page & Page de Vente Haute Conversion",
    metaDesc:
      "Maximisez le retour sur investissement de vos campagnes publicitaires avec une landing page conçue pour convertir : copywriting percutant, design épuré et chargement rapide.",
    intro:
      "Envoyer du trafic publicitaire sur une page d'accueil généraliste est une erreur coûteuse. Une landing page dédiée focalise l'attention du visiteur sur une seule promesse et un seul appel à l'action.",
    content: `
<h2>Transformez vos clics publicitaires en prospects qualifiés</h2>
<p>Qu'il s'agisse d'une campagne Google Ads, Meta Ads ou d'un lancement de produit, une <strong>landing page optimisée</strong> multiplie votre taux de conversion en éliminant toute distraction inutile.</p>

<h3>Les ingrédients d'une landing page ultra-performante</h3>
<ul>
  <li><strong>Titre accrocheur & promesse claire :</strong> le visiteur comprend en 3 secondes ce qu'il gagne à rester.</li>
  <li><strong>Arguments et preuves sociales :</strong> témoignages clients, chiffres clés et certifications pour lever tous les freins à l'achat.</li>
  <li><strong>Vitesse d'affichage sous la seconde :</strong> chaque dixième de seconde gagné réduit le taux de rebond.</li>
  <li><strong>Appels à l'action stratégiques (CTA) :</strong> formulaires courts et contrastés qui incitent à l'action immédiate.</li>
</ul>
`,
    faqs: [
      {
        question: "Pouvez-vous connecter la page à mon CRM ou autorépondeur ?",
        answer:
          "Oui, nous pouvons relier vos formulaires directement à vos outils de messagerie (HubSpot, Mailchimp, Brevo, Zapier) pour un traitement instantané de vos leads.",
      },
    ],
    relatedServices: "creation-site-internet,design-graphique",
  },
  {
    slug: "maintenance-site-internet",
    keyword: "maintenance site internet",
    title: "Maintenance de Site Internet & Support Technique | Art Vision",
    h1: "Maintenance de Site Internet, Sécurité & Mises à Jour Pro",
    metaDesc:
      "Protégez votre site web contre les pannes, failles de sécurité et ralentissements : sauvegardes quotidiennes, mises à jour, monitoring et dépannage réactif sous 24h.",
    intro:
      "Un site internet non maintenu est une porte ouverte aux piratages et aux dysfonctionnements. Confiez la gestion technique de votre site à des experts pour vous consacrer sereinement à votre activité.",
    content: `
<h2>Sécurité, sauvegardes et tranquillité d'esprit pour votre entreprise</h2>
<p>Un site web hors-service ou piraté coûte cher en réputation et en chiffre d'affaires. Notre service de <strong>maintenance de site internet</strong> assure une veille technique permanente, préventive et curative sur votre infrastructure.</p>

<h3>Nos prestations de maintenance au quotidien</h3>
<ul>
  <li><strong>Mises à jour sécurisées :</strong> application hebdomadaire des correctifs CMS, thèmes et extensions après vérification de compatibilité en pré-production.</li>
  <li><strong>Sauvegardes externalisées quotidiennes :</strong> conservation de vos bases de données et fichiers sur des serveurs sécurisés distants pour une restauration immédiate en cas d'incident.</li>
  <li><strong>Monitoring de disponibilité 24/7 :</strong> alerte en temps réel dès la moindre coupure d'accès pour une intervention technique immédiate.</li>
  <li><strong>Support et petites modifications :</strong> assistance par ticket ou WhatsApp pour vos ajustements de contenus récurrents.</li>
</ul>
`,
    faqs: [
      {
        question: "Pourquoi la maintenance est-elle indispensable même si mon site fonctionne bien ?",
        answer:
          "Les failles de sécurité sont découvertes continuellement par les robots malveillants. Un site qui semble fonctionner peut héberger des scripts invisibles spammant vos clients ou être déréférencé par Google sans maintenance préventive.",
      },
    ],
    relatedServices: "creation-site-internet,creation-site-wordpress",
  },
];

export async function seedExpandedCommercialPages() {
  console.log("Seeding 14 expanded commercial landing pages...");
  let count = 0;

  for (const p of COMMERCIAL_PAGES) {
    await prisma.seoLandingPage.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        h1: p.h1,
        keyword: p.keyword,
        pageType: "GENERIC",
        intro: p.intro,
        content: p.content,
        faq: JSON.stringify(p.faqs),
        relatedServices: p.relatedServices,
        relatedPortfolio: p.relatedPortfolio || null,
        status: "PUBLISHED",
        seoTitle: p.title,
        metaDescription: p.metaDesc,
        canonicalUrl: `https://art-visions.fr/${p.slug}`,
        ogImage: "/logo.png",
        indexable: true,
      },
      create: {
        slug: p.slug,
        title: p.title,
        h1: p.h1,
        keyword: p.keyword,
        pageType: "GENERIC",
        intro: p.intro,
        content: p.content,
        faq: JSON.stringify(p.faqs),
        relatedServices: p.relatedServices,
        relatedPortfolio: p.relatedPortfolio || null,
        status: "PUBLISHED",
        seoTitle: p.title,
        metaDescription: p.metaDesc,
        canonicalUrl: `https://art-visions.fr/${p.slug}`,
        ogImage: "/logo.png",
        indexable: true,
      },
    });

    // Populate companion SEOSettings record
    await prisma.sEOSettings.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.metaDesc,
        focusKeyword: p.keyword,
        canonicalUrl: `https://art-visions.fr/${p.slug}`,
        ogTitle: p.title,
        ogDescription: p.metaDesc,
        indexable: true,
        follow: true,
      },
      create: {
        id: `seo-page-${p.slug}`,
        slug: p.slug,
        pageType: "SEO_LANDING",
        title: p.title,
        description: p.metaDesc,
        focusKeyword: p.keyword,
        canonicalUrl: `https://art-visions.fr/${p.slug}`,
        ogTitle: p.title,
        ogDescription: p.metaDesc,
        indexable: true,
        follow: true,
      },
    });

    count++;
  }

  console.log(`✓ ${count} commercial money pages seeded successfully!`);
}

export async function seedExpandedBlogPosts() {
  console.log("Seeding 52 expanded SEO blog articles...");
  const ALL_BLOGS = [...LOGO_BRANDING_BLOGS, ...PRINT_BLOGS, ...WEB_BLOGS];
  const categories = await prisma.blogCategory.findMany();
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  let count = 0;

  for (const post of ALL_BLOGS) {
    const categoryId = categoryMap.get(post.categorySlug) || categories[0]?.id;
    if (!categoryId) {
      console.warn(`Category not found for slug: ${post.categorySlug}`);
      continue;
    }

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        featuredImageAlt: post.featuredImageAlt,
        imagePrompt: post.imagePrompt,
        author: post.author,
        status: "PUBLISHED",
        tags: post.tags,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        focusKeyword: post.focusKeyword,
        secondaryKeywords: post.secondaryKeywords,
        ogTitle: post.seoTitle,
        ogDescription: post.seoDescription,
        ogImage: post.featuredImage,
        faqJson: JSON.stringify(post.faq),
        relatedServices: post.relatedServices || null,
        relatedTools: post.relatedTools || null,
        relatedPortfolio: post.relatedPortfolio || null,
        ctaTitle: post.ctaTitle || null,
        ctaText: post.ctaText || null,
        ctaLabel: post.ctaLabel || null,
        ctaHref: post.ctaHref || null,
        readingTime: post.readingTime,
        publishedAt: new Date(),
        categoryId,
      },
      create: {
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        featuredImageAlt: post.featuredImageAlt,
        imagePrompt: post.imagePrompt,
        author: post.author,
        status: "PUBLISHED",
        tags: post.tags,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        focusKeyword: post.focusKeyword,
        secondaryKeywords: post.secondaryKeywords,
        ogTitle: post.seoTitle,
        ogDescription: post.seoDescription,
        ogImage: post.featuredImage,
        faqJson: JSON.stringify(post.faq),
        relatedServices: post.relatedServices || null,
        relatedTools: post.relatedTools || null,
        relatedPortfolio: post.relatedPortfolio || null,
        ctaTitle: post.ctaTitle || null,
        ctaText: post.ctaText || null,
        ctaLabel: post.ctaLabel || null,
        ctaHref: post.ctaHref || null,
        readingTime: post.readingTime,
        publishedAt: new Date(),
        categoryId,
      },
    });

    // Companion SEOSettings record with unique id
    await prisma.sEOSettings.upsert({
      where: { slug: `blog/${post.slug}` },
      update: {
        title: post.seoTitle,
        description: post.seoDescription,
        focusKeyword: post.focusKeyword,
        secondaryKeywords: post.secondaryKeywords,
        canonicalUrl: `https://art-visions.fr/blog/${post.slug}`,
        ogTitle: post.seoTitle,
        ogDescription: post.seoDescription,
        ogImage: post.featuredImage,
        indexable: true,
        follow: true,
      },
      create: {
        id: `seo-post-${post.slug}`,
        slug: `blog/${post.slug}`,
        pageType: "POST",
        title: post.seoTitle,
        description: post.seoDescription,
        focusKeyword: post.focusKeyword,
        secondaryKeywords: post.secondaryKeywords,
        canonicalUrl: `https://art-visions.fr/blog/${post.slug}`,
        ogTitle: post.seoTitle,
        ogDescription: post.seoDescription,
        ogImage: post.featuredImage,
        indexable: true,
        follow: true,
      },
    });

    count++;
  }

  console.log(`✓ ${count} SEO blog articles seeded successfully!`);
}

async function main() {
  await seedExpandedCommercialPages();
  await seedExpandedBlogPosts();
}

main()
  .catch((e) => {
    console.error("Error seeding expanded SEO data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
