/**
 * Idempotent blog seeding — categories + first content batch.
 * Run with:  npx tsx prisma/seed-blog.ts
 *
 * Safe to re-run: categories & posts are upserted by slug.
 * Content is original, written for Art Vision (no copied/spun text).
 */
import { makePrisma } from "./seed-client";

const prisma = makePrisma();

// ── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { slug: "identite-visuelle-branding", name: "Identité visuelle & Branding", icon: "Palette", description: "Stratégie de marque, charte graphique, couleurs et positionnement visuel.", sortOrder: 1 },
  { slug: "creation-logo", name: "Création logo", icon: "PenTool", description: "Concevoir, choisir et faire évoluer un logo professionnel.", sortOrder: 2 },
  { slug: "design-graphique", name: "Design graphique", icon: "Layout", description: "Supports de communication, mise en page et création visuelle.", sortOrder: 3 },
  { slug: "video-motion-design", name: "Vidéo & Motion design", icon: "Video", description: "Vidéo publicitaire, corporate, montage et animation graphique.", sortOrder: 4 },
  { slug: "3d-cgi", name: "3D & CGI", icon: "Box", description: "Modélisation 3D, packshot, rendu produit et CGI publicitaire.", sortOrder: 5 },
  { slug: "impression-professionnelle", name: "Impression professionnelle", icon: "Printer", description: "Flyers, affiches, cartes de visite, grand format et préparation fichiers.", sortOrder: 6 },
  { slug: "communication-digitale", name: "Communication digitale", icon: "Globe", description: "Site web, contenu et stratégie de communication en ligne.", sortOrder: 7 },
  { slug: "reseaux-sociaux", name: "Réseaux sociaux", icon: "Instagram", description: "Instagram, contenu social, calendrier éditorial et engagement.", sortOrder: 8 },
  { slug: "conseils-entrepreneurs", name: "Conseils entrepreneurs", icon: "Users", description: "Conseils pratiques pour l'image et la communication des entreprises.", sortOrder: 9 },
  { slug: "outils-gratuits", name: "Outils gratuits", icon: "Wand2", description: "Tutoriels et guides pour nos outils gratuits en ligne.", sortOrder: 10 },
  { slug: "etudes-de-cas", name: "Études de cas", icon: "Award", description: "Projets clients réels et résultats obtenus.", sortOrder: 11 },
  { slug: "actualites-art-vision", name: "Actualités Art Vision", icon: "Sparkles", description: "Nouveautés, coulisses et annonces du studio Art Vision.", sortOrder: 12 },
];

interface PostInput {
  slug: string;
  title: string;
  categorySlug: string;
  author: string;
  status: "PUBLISHED" | "DRAFT";
  isPillar?: boolean;
  readingTime: number;
  tags: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  imagePrompt: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  ogTitle?: string;
  ogDescription?: string;
  content: string;
  faq: { question: string; answer: string }[];
  relatedServices?: string;
  relatedTools?: string;
  relatedPortfolio?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const IMG = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=70`;

// ── 3 COMPLETE FLAGSHIP ARTICLES ─────────────────────────────────────────────
const POSTS: PostInput[] = [
  {
    slug: "pourquoi-investir-logo-professionnel",
    title: "Pourquoi investir dans un logo professionnel ?",
    categorySlug: "creation-logo",
    author: "Julien Dubosc",
    status: "PUBLISHED",
    isPillar: true,
    readingTime: 8,
    tags: "Logo,Branding,Identité visuelle,Entreprise",
    excerpt:
      "Un logo professionnel n'est pas une dépense, c'est un investissement. Voici pourquoi il influence la confiance, la mémorisation et les ventes — et comment bien le préparer.",
    featuredImage: IMG("photo-1626785774573-4b799315345d"),
    featuredImageAlt: "Designer travaillant sur des propositions de logo professionnel sur ordinateur",
    imagePrompt: "Flat lay d'un studio de design avec esquisses de logo, nuancier de couleurs et tablette graphique, lumière douce, ambiance premium",
    seoTitle: "Pourquoi investir dans un logo professionnel ? | Art Vision",
    seoDescription:
      "Découvrez pourquoi un logo professionnel est un investissement rentable : confiance, mémorisation, cohérence de marque et impact sur les ventes. Conseils d'Art Vision.",
    focusKeyword: "logo professionnel",
    secondaryKeywords: "création logo, importance du logo, logo entreprise, identité de marque",
    content: `
<p>Votre logo est, le plus souvent, le tout premier contact entre votre entreprise et un client potentiel. En une fraction de seconde, il transmet une impression : sérieux ou amateur, moderne ou daté, premium ou bas de gamme. C'est précisément pour cette raison qu'un <strong>logo professionnel</strong> n'est pas un coût, mais un investissement qui travaille pour vous chaque jour, sur chaque support.</p>
<p>Dans ce guide, nous expliquons concrètement ce qu'un logo bien conçu apporte à une entreprise, pourquoi la version « gratuite » coûte souvent plus cher à long terme, et comment préparer un projet de création réussi.</p>

<h2>Un logo professionnel inspire confiance immédiatement</h2>
<p>La confiance est la base de toute relation commerciale. Avant même de lire votre offre, un prospect évalue inconsciemment votre crédibilité à travers vos signaux visuels. Un logo soigné, lisible et cohérent envoie un message clair : « cette entreprise prend son image au sérieux, elle prendra donc mon projet au sérieux ».</p>
<p>À l'inverse, un logo flou, mal aligné ou copié sur un modèle générique sème le doute. Ce doute se paie en taux de conversion : un visiteur hésitant compare, repousse sa décision, ou choisit un concurrent qui paraît plus établi.</p>

<h2>Il favorise la mémorisation et la reconnaissance</h2>
<p>Les marques fortes sont reconnaissables en un clin d'œil. Cette reconnaissance n'est pas un hasard : elle repose sur la <strong>simplicité</strong>, la <strong>cohérence</strong> et la <strong>répétition</strong>. Un logo professionnel est pensé pour rester lisible aussi bien sur une enseigne que sur une icône d'application de quelques millimètres.</p>
<ul>
  <li><strong>Simplicité :</strong> une forme claire se mémorise plus facilement qu'un dessin chargé.</li>
  <li><strong>Distinction :</strong> il vous différencie visuellement de vos concurrents directs.</li>
  <li><strong>Adaptabilité :</strong> il fonctionne en couleur, en noir et blanc, en petit comme en grand format.</li>
</ul>

<h2>Un logo vectoriel s'utilise partout sans perte de qualité</h2>
<p>La différence technique majeure entre un logo amateur et un logo professionnel se joue souvent sur le format. Un logo professionnel est livré en <strong>fichiers vectoriels</strong> (SVG, PDF, AI). Concrètement, cela signifie que vous pouvez l'agrandir à l'infini — d'une carte de visite à une bâche de plusieurs mètres — sans aucune pixellisation.</p>
<p>Cette flexibilité est essentielle dès que vous déclinez votre marque sur de nombreux supports. C'est aussi un gain de temps et d'argent : vous évitez de tout refaire à chaque nouveau besoin. Pour bien cadrer ce travail, nous recommandons toujours de partir d'une <a href="/identite-visuelle">identité visuelle cohérente</a> plutôt que d'un logo isolé.</p>

<h2>Logo gratuit ou logo professionnel : le vrai calcul</h2>
<p>Les générateurs de logos gratuits sont tentants : rapides et sans frais immédiats. Mais ils présentent des limites importantes que l'on découvre souvent trop tard :</p>
<ul>
  <li>Des modèles <strong>réutilisés</strong> par des centaines d'autres entreprises.</li>
  <li>Des fichiers en basse résolution, inadaptés à l'impression.</li>
  <li>Une absence de droits clairs sur l'exploitation commerciale.</li>
  <li>Aucune réflexion stratégique sur votre marché ou votre cible.</li>
</ul>
<p>Le résultat ? Beaucoup d'entrepreneurs finissent par tout refaire un an plus tard, en ayant perdu du temps et une partie de leur crédibilité. Investir dès le départ dans une <a href="/creation-logo-professionnel">création de logo professionnel</a> revient souvent moins cher que de corriger un mauvais départ.</p>

<h2>Comment préparer un bon projet de logo</h2>
<p>La qualité d'un logo dépend largement de la qualité du brief. Plus vous donnez d'informations utiles au designer, plus la première proposition sera juste. Un bon brief comprend :</p>
<ul>
  <li>Le nom et le secteur d'activité de l'entreprise.</li>
  <li>La cible et le positionnement (accessible, premium, technique…).</li>
  <li>La personnalité de marque en quelques mots-clés.</li>
  <li>Vos préférences de style et de couleurs, ainsi que des exemples qui vous parlent.</li>
</ul>
<p>Pour gagner du temps, vous pouvez préparer ce document en quelques minutes avec notre <a href="/outils-gratuits/generateur-brief-logo">générateur de brief logo gratuit</a>, puis l'envoyer directement à notre studio.</p>

<h3>Le rôle des couleurs dans un logo</h3>
<p>Les couleurs portent une charge émotionnelle forte et doivent être choisies en cohérence avec votre marché. Avant de figer une palette, il est utile de tester plusieurs combinaisons et de vérifier leur lisibilité. Notre <a href="/outils-gratuits/generateur-palette-couleurs">générateur de palette de couleurs</a> vous aide à explorer des associations harmonieuses et accessibles.</p>

<h2>Un logo, première brique d'une marque cohérente</h2>
<p>Un logo réussi n'est jamais isolé : il s'inscrit dans un système plus large comprenant les couleurs, les typographies et les règles d'utilisation. C'est ce système — la charte graphique — qui garantit une image homogène sur votre site, vos réseaux sociaux et vos supports imprimés. Vous pouvez voir des exemples concrets de ce travail dans notre <a href="/portfolio">portfolio</a>.</p>

<h2>En résumé</h2>
<p>Investir dans un logo professionnel, c'est investir dans la confiance, la mémorisation et la cohérence de votre marque. C'est aussi vous épargner des refontes coûteuses et protéger l'exploitation commerciale de votre image. Pour un secteur concurrentiel, c'est rarement une option : c'est un fondamental.</p>
`,
    faq: [
      { question: "Combien coûte un logo professionnel ?", answer: "Le prix dépend du niveau de personnalisation et des livrables. Une création professionnelle commence généralement autour de quelques dizaines d'euros pour une formule de base, et augmente avec le nombre de concepts, de déclinaisons et de fichiers sources fournis." },
      { question: "Quelle est la différence entre un logo gratuit et un logo professionnel ?", answer: "Un logo gratuit s'appuie souvent sur des modèles réutilisés, en basse résolution et sans droits clairs. Un logo professionnel est unique, vectoriel (utilisable sur tous supports) et accompagné d'une réflexion stratégique." },
      { question: "Vais-je recevoir les fichiers sources ?", answer: "Oui, une prestation professionnelle inclut généralement les fichiers vectoriels (SVG, PDF, AI) qui vous permettent de décliner et modifier votre logo à l'avenir." },
      { question: "Combien de temps faut-il pour créer un logo ?", answer: "Comptez en moyenne de quelques jours à deux semaines selon le nombre d'allers-retours, de concepts et de déclinaisons demandés." },
      { question: "Faut-il refaire toute mon identité visuelle en même temps ?", answer: "Pas obligatoirement, mais c'est recommandé. Un logo est plus efficace lorsqu'il s'inscrit dans une charte graphique cohérente (couleurs, typographies, supports)." },
    ],
    relatedServices: "creation-logo-professionnel,identite-visuelle,design-graphique",
    relatedTools: "generateur-brief-logo,generateur-palette-couleurs",
    relatedPortfolio: "oleapure-branding",
    ctaTitle: "Besoin d'un logo qui marque les esprits ?",
    ctaText: "Préparez votre brief en quelques minutes et recevez une proposition adaptée à votre marque.",
    ctaLabel: "Demander une proposition de logo",
    ctaHref: "/creation-logo-professionnel",
  },
  {
    slug: "pourquoi-identite-visuelle-essentielle-entreprise",
    title: "Pourquoi une identité visuelle est essentielle pour une entreprise ?",
    categorySlug: "identite-visuelle-branding",
    author: "Julien Dubosc",
    status: "PUBLISHED",
    isPillar: true,
    readingTime: 9,
    tags: "Identité visuelle,Branding,Charte graphique,Marque",
    excerpt:
      "L'identité visuelle, ce n'est pas qu'un logo. C'est le système qui rend votre marque reconnaissable, cohérente et crédible partout. Voici pourquoi elle est décisive.",
    featuredImage: IMG("photo-1561070791-2526d30994b5"),
    featuredImageAlt: "Planche d'identité visuelle avec logo, palette de couleurs et typographies",
    imagePrompt: "Moodboard d'identité de marque sur une table : logo, échantillons de couleurs, typographies et cartes de visite, style premium",
    seoTitle: "Pourquoi une identité visuelle est essentielle pour une entreprise ? | Art Vision",
    seoDescription:
      "Identité visuelle : définition, composants et bénéfices concrets pour une entreprise. Découvrez pourquoi une marque cohérente inspire confiance et fidélise. Art Vision.",
    focusKeyword: "identité visuelle",
    secondaryKeywords: "charte graphique, branding entreprise, image de marque, cohérence visuelle",
    content: `
<p>Beaucoup d'entrepreneurs réduisent l'<strong>identité visuelle</strong> à un simple logo. C'est une erreur fréquente. L'identité visuelle est en réalité le système complet qui rend votre marque reconnaissable et cohérente : logo, couleurs, typographies, style des images, mise en page et règles d'utilisation. C'est ce système qui transforme une activité en véritable marque.</p>
<p>Dans cet article, nous voyons pourquoi une identité visuelle solide est un levier business — et pas seulement une question d'esthétique.</p>

<h2>Qu'est-ce qu'une identité visuelle, exactement ?</h2>
<p>L'identité visuelle regroupe l'ensemble des éléments graphiques qui expriment la personnalité de votre marque. On y retrouve principalement :</p>
<ul>
  <li><strong>Le logo</strong> et ses déclinaisons (couleur, monochrome, version réduite).</li>
  <li><strong>La palette de couleurs</strong> et leurs proportions d'utilisation.</li>
  <li><strong>Les typographies</strong> pour les titres et le texte courant.</li>
  <li><strong>Le style visuel</strong> (photos, illustrations, icônes, motifs).</li>
  <li><strong>Les règles</strong> rassemblées dans une charte graphique.</li>
</ul>
<p>Pris isolément, ces éléments n'ont qu'un impact limité. Assemblés avec méthode, ils créent une signature reconnaissable entre toutes.</p>

<h2>Elle rend votre marque cohérente partout</h2>
<p>Votre entreprise communique sur de nombreux points de contact : site web, réseaux sociaux, flyers, devis, packaging, enseigne… Sans cadre commun, chaque support finit par « parler une langue différente ». Le résultat est une image brouillonne qui dilue votre message.</p>
<p>Une identité visuelle bien définie agit comme un fil conducteur. Elle garantit que, quel que soit le support, votre client reconnaît instantanément votre marque. Cette cohérence est l'un des fondements d'une <a href="/identite-visuelle">image de marque professionnelle</a>.</p>

<h2>Elle inspire confiance et crédibilité</h2>
<p>La cohérence visuelle est perçue comme un signe de sérieux. Une marque qui maîtrise son image rassure : elle donne l'impression d'une entreprise structurée, fiable et installée. À l'inverse, des visuels disparates suggèrent l'improvisation — un frein puissant à la décision d'achat, surtout pour un nouveau client.</p>

<h2>Elle facilite la mémorisation</h2>
<p>Nous sommes exposés à des milliers de messages chaque jour. Pour exister, une marque doit être facile à reconnaître et à retenir. La répétition d'un même univers visuel — mêmes couleurs, même typographie, même ton — ancre votre marque dans la mémoire de votre audience. C'est ce qui fait qu'on « reconnaît » une entreprise avant même de lire son nom.</p>

<h3>Le rôle clé des couleurs</h3>
<p>Les couleurs sont parmi les éléments les plus mémorisés d'une marque. Elles véhiculent des émotions et un positionnement : sobriété, énergie, luxe, proximité… Choisir une palette cohérente et accessible est donc stratégique. Pour expérimenter, vous pouvez utiliser notre <a href="/outils-gratuits/generateur-palette-couleurs">générateur de palette de couleurs gratuit</a> et vérifier la lisibilité de vos associations.</p>

<h3>Le rôle des typographies</h3>
<p>Les typographies portent, elles aussi, une part importante de votre personnalité. Une police affirmée pour les titres et une police lisible pour le texte courant suffisent souvent à structurer une identité claire. L'essentiel est la cohérence : limiter le nombre de polices et les utiliser toujours de la même manière.</p>

<h2>Elle valorise votre entreprise sur le long terme</h2>
<p>Une identité visuelle forte est un actif. Elle augmente la valeur perçue de vos offres, justifie un positionnement premium et facilite chaque nouvelle prise de parole. C'est aussi un gain de temps considérable : une fois la charte établie, créer un nouveau support devient rapide et cohérent, car les règles sont déjà posées.</p>
<p>Si votre image actuelle a vieilli ou manque d'unité, un <strong>rebranding</strong> peut s'imposer. Avant de vous lancer, il est utile de cadrer précisément vos objectifs et votre cible — un travail que nous menons systématiquement en amont de chaque projet.</p>

<h2>Par où commencer ?</h2>
<p>Construire une identité visuelle solide suit généralement ces étapes :</p>
<ul>
  <li>Clarifier votre positionnement et votre personnalité de marque.</li>
  <li>Concevoir ou affiner votre <a href="/creation-logo-professionnel">logo professionnel</a>.</li>
  <li>Définir une palette de couleurs et des typographies.</li>
  <li>Établir des règles d'utilisation (la charte graphique).</li>
  <li>Décliner l'ensemble sur vos supports prioritaires.</li>
</ul>
<p>Vous pouvez découvrir des réalisations concrètes de ce processus dans notre <a href="/portfolio">portfolio</a>.</p>

<h2>En résumé</h2>
<p>L'identité visuelle dépasse largement le logo : c'est le système qui rend votre marque reconnaissable, cohérente et crédible. Bien construite, elle inspire confiance, facilite la mémorisation et valorise durablement votre entreprise. C'est l'un des investissements les plus rentables pour une marque qui veut durer.</p>
`,
    faq: [
      { question: "Quelle est la différence entre un logo et une identité visuelle ?", answer: "Le logo est un élément ; l'identité visuelle est le système complet qui l'entoure : couleurs, typographies, style d'images et règles d'utilisation rassemblées dans une charte graphique." },
      { question: "Qu'est-ce qu'une charte graphique ?", answer: "C'est le document de référence qui définit comment utiliser tous les éléments de votre marque (logo, couleurs, typographies, espacements) afin de garantir une image cohérente partout." },
      { question: "Une petite entreprise a-t-elle besoin d'une identité visuelle ?", answer: "Oui. Même avec un budget modeste, une identité cohérente renforce la crédibilité et la mémorisation, ce qui aide à se différencier sur un marché concurrentiel." },
      { question: "Combien de temps prend la création d'une identité visuelle ?", answer: "En général de une à trois semaines selon l'étendue du projet et le nombre d'allers-retours nécessaires." },
      { question: "Quand faut-il envisager un rebranding ?", answer: "Lorsque votre image a vieilli, manque de cohérence, ne reflète plus votre positionnement ou freine votre développement commercial." },
    ],
    relatedServices: "identite-visuelle,creation-logo-professionnel,design-graphique",
    relatedTools: "generateur-palette-couleurs,generateur-brief-logo",
    relatedPortfolio: "oleapure-branding",
    ctaTitle: "Envie d'une identité visuelle cohérente et mémorable ?",
    ctaText: "Notre studio conçoit des identités complètes, du logo à la charte graphique.",
    ctaLabel: "Discuter de mon identité visuelle",
    ctaHref: "/identite-visuelle",
  },
  {
    slug: "comment-creer-carte-de-visite-professionnelle",
    title: "Comment créer une carte de visite professionnelle ?",
    categorySlug: "impression-professionnelle",
    author: "Julien Dubosc",
    status: "PUBLISHED",
    isPillar: true,
    readingTime: 7,
    tags: "Carte de visite,Impression,Branding,QR code",
    excerpt:
      "La carte de visite reste un outil de contact redoutablement efficace. Voici comment en créer une professionnelle, du contenu aux finitions, et l'optimiser avec un QR code.",
    featuredImage: IMG("photo-1589330694653-ded6df03f754"),
    featuredImageAlt: "Cartes de visite professionnelles élégantes posées sur une surface sombre",
    imagePrompt: "Pile de cartes de visite premium avec finition dorée sur fond sombre, éclairage studio, faible profondeur de champ",
    seoTitle: "Comment créer une carte de visite professionnelle ? | Art Vision",
    seoDescription:
      "Guide pratique pour créer une carte de visite professionnelle : informations essentielles, design, format 85×55 mm, finitions premium et QR code vCard. Outil gratuit Art Vision.",
    focusKeyword: "carte de visite professionnelle",
    secondaryKeywords: "créer carte de visite, carte de visite QR code, impression carte de visite, format carte de visite",
    content: `
<p>À l'ère du numérique, beaucoup pensent que la <strong>carte de visite professionnelle</strong> a disparu. C'est faux. Tendre une carte soignée lors d'un rendez-vous, d'un salon ou d'une rencontre reste l'un des gestes de networking les plus efficaces : il est concret, mémorable et instantané. Encore faut-il que la carte soit à la hauteur de votre image.</p>
<p>Voici comment concevoir une carte de visite qui inspire confiance, du contenu aux finitions, et comment la rendre plus utile grâce à un QR code.</p>

<h2>Les informations essentielles à faire figurer</h2>
<p>Une bonne carte va à l'essentiel. Surchargée, elle devient illisible. Concentrez-vous sur les informations qui comptent :</p>
<ul>
  <li><strong>Nom et fonction</strong> — pour savoir immédiatement à qui l'on a affaire.</li>
  <li><strong>Nom de l'entreprise et logo</strong> — pour ancrer votre marque.</li>
  <li><strong>Téléphone et e-mail</strong> — les moyens de contact prioritaires.</li>
  <li><strong>Site web</strong> et, si pertinent, un réseau social.</li>
  <li><strong>Adresse</strong> si vous recevez du public.</li>
</ul>
<p>Tout le reste est souvent superflu. La clarté prime sur l'exhaustivité.</p>

<h2>Le bon format et les bonnes marges</h2>
<p>Le format standard d'une carte de visite en France est de <strong>85 × 55 mm</strong>. Pour une impression réussie, prévoyez quelques détails techniques essentiels :</p>
<ul>
  <li>Un <strong>fond perdu</strong> de 2 à 3 mm pour éviter les bords blancs après découpe.</li>
  <li>Une <strong>zone de sécurité</strong> : ne placez aucun texte trop près des bords.</li>
  <li>Une résolution de <strong>300 dpi</strong> et un mode colorimétrique <strong>CMJN</strong> pour l'impression.</li>
</ul>
<p>Si vous préparez vous-même votre fichier, ces réglages évitent les mauvaises surprises au moment d'imprimer.</p>

<h2>Soigner le design pour refléter votre marque</h2>
<p>Votre carte doit prolonger votre <a href="/identite-visuelle">identité visuelle</a> : mêmes couleurs, même typographie, même logo. Un design cohérent renforce la reconnaissance de votre marque et la perception de sérieux. Quelques principes utiles :</p>
<ul>
  <li>Laissez respirer la mise en page : l'espace vide valorise l'information.</li>
  <li>Limitez-vous à une ou deux polices lisibles.</li>
  <li>Assurez un bon contraste entre le texte et le fond.</li>
  <li>Mettez en avant ce qui compte : nom, fonction, contact.</li>
</ul>
<p>Pour aller vite, vous pouvez concevoir votre carte gratuitement avec notre <a href="/outils-gratuits/carte-de-visite-gratuite">générateur de carte de visite</a>, qui propose plusieurs modèles, un aperçu recto-verso et un export prêt à imprimer.</p>

<h3>Ajouter un QR code pour connecter le papier au digital</h3>
<p>Un QR code transforme une carte classique en passerelle vers votre univers numérique. Scanné, il peut enregistrer automatiquement vos coordonnées (vCard), ouvrir votre site, votre WhatsApp ou votre compte Instagram. C'est un excellent moyen de faciliter le contact et de réduire les fautes de saisie. Vous pouvez en générer un aux couleurs de votre marque avec notre <a href="/outils-gratuits/generateur-qr-code">générateur de QR code gratuit</a>.</p>

<h2>Les finitions qui font la différence</h2>
<p>À contenu égal, ce sont souvent les finitions qui distinguent une carte « correcte » d'une carte « premium ». Selon votre positionnement, vous pouvez envisager :</p>
<ul>
  <li>Un <strong>papier épais</strong> (350 g et plus) pour une sensation de qualité.</li>
  <li>Un <strong>pelliculage soft touch</strong> au toucher velouté.</li>
  <li>Un <strong>vernis sélectif</strong> pour faire ressortir le logo.</li>
  <li>Une <strong>dorure à chaud</strong> pour un effet haut de gamme.</li>
</ul>
<p>Ces options se choisissent en fonction de votre image et de votre budget. Pour estimer rapidement un coût, vous pouvez utiliser notre <a href="/outils-gratuits/calculateur-impression">calculateur de prix d'impression</a>.</p>

<h2>Faut-il imprimer soi-même ou faire appel à un professionnel ?</h2>
<p>Une impression maison dépanne, mais elle atteint vite ses limites : papiers fins, couleurs imprécises, découpe approximative. Pour un rendu fidèle et durable, l'impression professionnelle reste le meilleur choix, surtout si la carte représente votre entreprise. Notre service d'<a href="/impression">impression publicitaire</a> couvre l'ensemble de la chaîne, de la vérification du fichier à la livraison.</p>

<h2>En résumé</h2>
<p>Une carte de visite professionnelle réussie est claire, cohérente avec votre marque, imprimée au bon format et soignée dans ses finitions. Ajoutez-y un QR code, et elle devient un véritable outil de conversion. Bien conçue, elle continue de faire bonne impression longtemps après la poignée de main.</p>
`,
    faq: [
      { question: "Quel est le format standard d'une carte de visite ?", answer: "En France, le format standard est de 85 × 55 mm. Prévoyez un fond perdu de 2 à 3 mm et une zone de sécurité pour éviter que le texte soit coupé à la découpe." },
      { question: "Comment ajouter un QR code à ma carte de visite ?", answer: "Vous pouvez générer un QR code vCard (qui enregistre vos coordonnées) avec notre générateur gratuit, puis l'intégrer au dos de la carte pour faciliter le contact." },
      { question: "Quel papier choisir pour une carte premium ?", answer: "Un papier de 350 g ou plus, éventuellement avec pelliculage soft touch, vernis sélectif ou dorure à chaud, donne une sensation haut de gamme." },
      { question: "Puis-je créer ma carte de visite gratuitement ?", answer: "Oui. Notre générateur de carte de visite gratuit propose plusieurs modèles, un aperçu recto-verso et un export PNG/PDF prêt pour l'impression." },
      { question: "Recto seul ou recto-verso ?", answer: "Le recto-verso est recommandé : il offre plus d'espace pour aérer l'information côté face et placer un QR code, un slogan ou des coordonnées complémentaires au dos." },
    ],
    relatedServices: "impression,identite-visuelle,design-graphique",
    relatedTools: "carte-de-visite-gratuite,generateur-qr-code,calculateur-impression",
    relatedPortfolio: "oleapure-branding",
    ctaTitle: "Envie de cartes de visite à la hauteur de votre image ?",
    ctaText: "Créez votre carte gratuitement, puis commandez une impression professionnelle.",
    ctaLabel: "Créer ma carte de visite",
    ctaHref: "/outils-gratuits/carte-de-visite-gratuite",
  },
];

// ── DETAILED DRAFTS (titles + SEO + outline) ─────────────────────────────────
function draftOutline(h2s: string[]): string {
  return (
    `<p><em>Brouillon — plan détaillé prêt à être rédigé.</em></p>\n<ul>` +
    h2s.map((h) => `<li>${h}</li>`).join("\n") +
    `</ul>`
  );
}

type DraftTuple = [string, string, string, string, string, string[], string, string];
const DRAFTS: DraftTuple[] = [
  ["combien-coute-creation-logo-professionnel", "Combien coûte la création d'un logo professionnel ?", "creation-logo", "prix création logo", "tarif logo, devis logo, coût logo entreprise", ["Les facteurs qui font varier le prix", "Logo gratuit, freelance ou studio", "Ce qui est inclus dans une prestation", "Comment obtenir un bon rapport qualité/prix", "FAQ tarifs logo"], "creation-logo-professionnel", "generateur-brief-logo"],
  ["differents-types-de-logos-expliques", "Les différents types de logos expliqués simplement", "creation-logo", "types de logos", "logotype, monogramme, emblème, logo combiné", ["Le logotype (typographique)", "Le monogramme / lettermark", "Le symbole / pictogramme", "L'emblème et le logo combiné", "Quel type choisir selon votre activité"], "creation-logo-professionnel", "generateur-brief-logo"],
  ["comment-creer-charte-graphique-professionnelle", "Comment créer une charte graphique professionnelle ?", "identite-visuelle-branding", "charte graphique", "créer charte graphique, règles de marque, branding", ["À quoi sert une charte graphique", "Les sections indispensables", "Couleurs, typographies et logo", "Les règles d'utilisation", "Diffuser et faire respecter la charte"], "identite-visuelle", "generateur-palette-couleurs"],
  ["comment-choisir-couleurs-de-sa-marque", "Comment choisir les couleurs de sa marque ?", "identite-visuelle-branding", "couleurs de marque", "psychologie des couleurs, palette de marque, identité couleur", ["La signification des couleurs", "Construire une palette cohérente", "Couleur primaire, secondaire et accents", "Accessibilité et contraste", "Tester sa palette avec un outil gratuit"], "identite-visuelle", "generateur-palette-couleurs"],
  ["tendances-design-graphique-2026", "Les tendances du design graphique en 2026", "design-graphique", "tendances design graphique 2026", "tendances graphiques, design 2026, inspiration", ["Les grandes tendances de l'année", "Typographies et couleurs en vogue", "Le retour de certains styles", "Ce qu'il faut adopter (ou éviter)", "Rester intemporel malgré les tendances"], "design-graphique", "generateur-palette-couleurs"],
  ["comment-creer-affiche-publicitaire-efficace", "Comment créer une affiche publicitaire efficace ?", "design-graphique", "affiche publicitaire", "créer une affiche, design affiche, impression affiche", ["Définir un message unique", "La hiérarchie visuelle", "Choisir les bons formats", "Préparer le fichier pour l'impression", "Erreurs fréquentes à éviter"], "impression,design-graphique", "creer-flyer"],
  ["pourquoi-creer-video-publicitaire-entreprise", "Pourquoi créer une vidéo publicitaire pour son entreprise ?", "video-motion-design", "vidéo publicitaire entreprise", "vidéo marketing, spot publicitaire, vidéo de marque", ["L'impact de la vidéo sur l'engagement", "Les formats les plus efficaces", "Vidéo vs motion design", "Budget et retour sur investissement", "Réussir son brief vidéo"], "video-publicitaire,motion-design", ""],
  ["motion-design-ou-video-classique", "Motion design ou vidéo classique : quel format choisir ?", "video-motion-design", "motion design ou vidéo", "animation vs vidéo, format vidéo entreprise", ["Définitions et différences", "Avantages du motion design", "Avantages de la vidéo réelle", "Critères de choix selon l'objectif", "Combiner les deux approches"], "motion-design,video-publicitaire", ""],
  ["pourquoi-rendu-3d-produit-vendre-en-ligne", "Pourquoi utiliser un rendu 3D produit pour vendre en ligne ?", "3d-cgi", "rendu 3D produit", "packshot 3D, visuel produit, e-commerce 3D", ["Les limites de la photo produit", "Les avantages du rendu 3D", "Flexibilité et économies à long terme", "Cas d'usage e-commerce", "Préparer un produit pour la 3D"], "modelisation-3d-rendu-produit", ""],
  ["comment-choisir-bon-format-flyer", "Comment choisir le bon format de flyer ?", "impression-professionnelle", "format flyer", "taille flyer, A5 A6, impression flyer", ["Les formats de flyers les plus courants", "Choisir selon l'usage et le message", "Recto simple ou recto-verso", "Papier et finitions", "Estimer le coût d'impression"], "impression", "creer-flyer,calculateur-impression"],
  ["comment-creer-bio-instagram-professionnelle", "Comment créer une bio Instagram professionnelle ?", "reseaux-sociaux", "bio Instagram professionnelle", "bio Instagram entreprise, optimiser bio Instagram", ["Le rôle de la bio Instagram", "Les éléments d'une bio qui convertit", "La limite de 150 caractères", "Ajouter un appel à l'action", "Générer sa bio avec un outil gratuit"], "community-management", "generateur-bio-instagram"],
  ["comment-creer-cv-professionnel-en-ligne-gratuitement", "Comment créer un CV professionnel en ligne gratuitement ?", "outils-gratuits", "créer CV gratuit", "CV en ligne, modèle CV, CV PDF gratuit", ["Pourquoi un CV bien conçu compte", "Les sections indispensables", "Choisir un modèle adapté à son métier", "Exporter en PDF prêt à l'emploi", "Aller plus loin avec un CV sur-mesure"], "design-graphique", "cv-gratuit"],
];

async function main() {
  console.log("Seeding blog categories & content...");

  const catId: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const cat = await prisma.blogCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, icon: c.icon, sortOrder: c.sortOrder },
      create: c,
    });
    catId[c.slug] = cat.id;
  }
  console.log(`✓ ${CATEGORIES.length} categories`);

  const upsertPost = async (p: PostInput) => {
    const data = {
      title: p.title,
      content: p.content,
      excerpt: p.excerpt,
      featuredImage: p.featuredImage,
      featuredImageAlt: p.featuredImageAlt,
      imagePrompt: p.imagePrompt,
      author: p.author,
      status: p.status,
      tags: p.tags,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      focusKeyword: p.focusKeyword,
      secondaryKeywords: p.secondaryKeywords,
      ogTitle: p.ogTitle || p.seoTitle,
      ogDescription: p.ogDescription || p.seoDescription,
      ogImage: p.featuredImage,
      faqJson: JSON.stringify(p.faq),
      relatedServices: p.relatedServices || null,
      relatedTools: p.relatedTools || null,
      relatedPortfolio: p.relatedPortfolio || null,
      ctaTitle: p.ctaTitle || null,
      ctaText: p.ctaText || null,
      ctaLabel: p.ctaLabel || null,
      ctaHref: p.ctaHref || null,
      readingTime: p.readingTime,
      isPillar: p.isPillar || false,
      publishedAt: p.status === "PUBLISHED" ? new Date() : null,
      categoryId: catId[p.categorySlug],
    };
    await prisma.blogPost.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
  };

  for (const p of POSTS) await upsertPost(p);
  console.log(`✓ ${POSTS.length} complete articles`);

  // Drafts
  const draftPosts: PostInput[] = DRAFTS.map(([slug, title, categorySlug, focus, secondary, h2s, relServices, relTools]: any) => ({
    slug, title, categorySlug, author: "Art Vision", status: "DRAFT", readingTime: 6,
    tags: "", excerpt: `${title} — article à rédiger (plan détaillé inclus).`,
    featuredImage: IMG("photo-1517245386807-bb43f82c33c4"),
    featuredImageAlt: title, imagePrompt: `Illustration éditoriale pour : ${title}`,
    seoTitle: `${title} | Art Vision`, seoDescription: `${title} — guide pratique par Art Vision.`,
    focusKeyword: focus, secondaryKeywords: secondary,
    content: draftOutline(h2s), faq: [],
    relatedServices: relServices || null, relatedTools: relTools || null,
  }));
  for (const p of draftPosts) await upsertPost(p);
  console.log(`✓ ${draftPosts.length} detailed drafts`);

  console.log("Blog seeding done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
