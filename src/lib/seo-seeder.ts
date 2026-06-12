import prisma from "./prisma";

interface SEOPageTemplate {
  slug: string;
  keyword: string;
  city?: string;
  title: string;
  h1: string;
  metaDesc: string;
  pageType: "GENERIC" | "LOCAL";
}

const SEO_TEMPLATES: SEOPageTemplate[] = [
  // General
  { slug: "agence-graphique-france", keyword: "agence graphique", title: "Agence graphique en France | Logo, Branding & Design - Art Vision", h1: "Votre Agence Graphique de Référence en France", metaDesc: "Art Vision, agence graphique en France, conçoit vos logos, identités visuelles, packaging, supports imprimés et chartes graphiques de haute qualité.", pageType: "GENERIC" },
  { slug: "studio-graphique-france", keyword: "studio graphique", title: "Studio graphique en France | Création visuelle - Art Vision", h1: "Studio Graphique & Direction Artistique en France", metaDesc: "Besoin d'un studio graphique professionnel ? Art Vision crée vos supports imprimés, visuels digitaux, motion design et modélisation 3D.", pageType: "GENERIC" },
  { slug: "graphiste-freelance-france", keyword: "graphiste freelance", title: "Graphiste freelance en France | Une alternative premium - Art Vision", h1: "Graphiste Freelance en France : La Flexibilité Premium", metaDesc: "Trouvez un graphiste freelance expert avec la structure juridique et la réactivité d'une agence créative premium. Devis sous 24h.", pageType: "GENERIC" },
  { slug: "agence-de-communication-visuelle", keyword: "agence de communication visuelle", title: "Agence de communication visuelle en France | Art Vision", h1: "Agence de Communication Visuelle Premium", metaDesc: "Art Vision gère votre image de marque à 360° : logos, vidéos publicitaires, modélisation 3D, impressions et développement web.", pageType: "GENERIC" },
  { slug: "identite-visuelle", keyword: "identité visuelle", title: "Création d'identité visuelle en France | Charte graphique - Art Vision", h1: "Création d'Identité Visuelle & Charte Graphique", metaDesc: "Concevez une identité visuelle marquante pour votre marque avec notre studio créatif. Palette, typographie, logotype et supports.", pageType: "GENERIC" },
  { slug: "creation-logo-professionnel", keyword: "création logo", title: "Création de logo professionnel en France | Art Vision", h1: "Création de Logo Professionnel et Vectoriel", metaDesc: "Donnez vie à votre marque avec un logo unique, vectoriel et mémorable. Proposition originale par nos designers sous 7 jours.", pageType: "GENERIC" },
  { slug: "design-graphique", keyword: "design graphique", title: "Design graphique professionnel en France | Art Vision", h1: "Prestation de Design Graphique sur-mesure", metaDesc: "Création de flyers, dépliants, affiches publicitaires, habillages web et visuels réseaux sociaux par nos graphistes.", pageType: "GENERIC" },
  { slug: "branding-entreprise", keyword: "branding entreprise", title: "Branding entreprise et image de marque | Art Vision", h1: "Branding d'Entreprise & Stratégie de Marque", metaDesc: "Développez une marque forte et mémorable avec notre agence de branding. Stratégie visuelle, positionnement et cohérence print/web.", pageType: "GENERIC" },
  { slug: "creation-visuelle", keyword: "création visuelle", title: "Création visuelle pour marques et entreprises | Art Vision", h1: "Création Visuelle Multicanal Haute Définition", metaDesc: "Art Vision réalise la création visuelle de vos supports marketing, bannières publicitaires et visuels institutionnels.", pageType: "GENERIC" },
  { slug: "graphiste-professionnel", keyword: "graphiste professionnel", title: "Graphiste professionnel en France | Design sur-mesure - Art Vision", h1: "Trouver un Graphiste Professionnel et Réactif", metaDesc: "Graphiste professionnel spécialisé en Suite Adobe, Illustrator et Photoshop pour réaliser tous vos supports marketing rapidement.", pageType: "GENERIC" },

  // Video
  { slug: "montage-video", keyword: "montage vidéo", title: "Montage vidéo professionnel en France | Art Vision", h1: "Service de Montage Vidéo Professionnel", metaDesc: "Confiez votre montage vidéo à Art Vision : étalonnage colorimétrique, sound design, sous-titres et habillages graphiques 4K.", pageType: "GENERIC" },
  { slug: "video-publicitaire", keyword: "vidéo publicitaire", title: "Création de vidéo publicitaire en France | Art Vision", h1: "Production de Vidéo Publicitaire à Fort Impact", metaDesc: "Développez vos ventes avec une vidéo publicitaire pour Facebook, Instagram, YouTube et TV. Script, tournage et post-production.", pageType: "GENERIC" },
  { slug: "motion-design", keyword: "motion design", title: "Motion design en France | Animation 2D & 3D - Art Vision", h1: "Création de Motion Design & Vidéo Explicative", metaDesc: "Expliquez des concepts complexes en quelques secondes grâce au motion design. Logo animé, infographie animée et animation de marque.", pageType: "GENERIC" },
  { slug: "animation-video", keyword: "animation vidéo", title: "Studio d'animation vidéo en France | Art Vision", h1: "Studio d'Animation Vidéo Institutionnelle", metaDesc: "Animation vidéo explicative, cartoon ou corporate pour votre communication d'entreprise. Devis gratuit sous 24h.", pageType: "GENERIC" },
  { slug: "creation-contenu-video", keyword: "création contenu vidéo", title: "Création de contenu vidéo pour réseaux sociaux | Art Vision", h1: "Création de Contenu Vidéo pour Entreprises", metaDesc: "Production de Reels, TikToks, vidéos de présentation produit et formats courts pour dynamiser votre présence en ligne.", pageType: "GENERIC" },
  { slug: "video-corporate", keyword: "vidéo corporate", title: "Vidéo corporate et film d'entreprise en France | Art Vision", h1: "Vidéo Corporate & Film Institutionnel", metaDesc: "Présentez vos valeurs, vos collaborateurs et vos infrastructures avec un film corporate de haute qualité cinématographique.", pageType: "GENERIC" },

  // 3D
  { slug: "modelisation-3d", keyword: "modélisation 3D", title: "Modélisation 3D professionnelle en France | Art Vision", h1: "Service de Modélisation 3D Hyperréaliste", metaDesc: "Modélisation CAO et polygonale de produits, packagings et concepts industriels par nos infographistes 3D sous Blender.", pageType: "GENERIC" },
  { slug: "rendu-3d-produit", keyword: "rendu 3D produit", title: "Rendu 3D produit & Packshot photoréaliste | Art Vision", h1: "Rendu 3D Produit & Visualisation Studio", metaDesc: "Présentez vos produits sans shooting photo. Rendu 3D produit photoréaliste pour e-commerce, packshot et catalogue.", pageType: "GENERIC" },
  { slug: "animation-3d", keyword: "animation 3D", title: "Studio d'animation 3D produit et publicitaire | Art Vision", h1: "Production d'Animation 3D Publicitaire", metaDesc: "Animez vos produits en 3D : vue éclatée, simulation de fluides, animation de mécanismes complexes en ultra haute définition.", pageType: "GENERIC" },
  { slug: "visualisation-3d", keyword: "visualisation 3D", title: "Visualisation 3D de produits et espaces | Art Vision", h1: "Visualisation 3D & Rendu d'Architecture", metaDesc: "Projetez vos clients dans leur futur achat avec des rendus de visualisation 3D de haute qualité pour immobilier et retail.", pageType: "GENERIC" },
  { slug: "cgi-publicitaire", keyword: "CGI publicitaire", title: "CGI publicitaire et effets spéciaux 3D | Art Vision", h1: "Effets Spéciaux & CGI Publicitaire 3D", metaDesc: "Créez l'effet de buzz avec des vidéos de CGI publicitaire 3D réalistes intégrant des objets géants animés dans le monde réel.", pageType: "GENERIC" },
  { slug: "packshot-3d", keyword: "packshot 3D", title: "Packshot 3D e-commerce et catalogue | Art Vision", h1: "Packshot 3D Produit de Haute Précision", metaDesc: "Remplacer la photographie traditionnelle par des packshots 3D impeccables sous tous les angles avec des textures parfaites.", pageType: "GENERIC" },

  // Printing
  { slug: "impression-grand-format", keyword: "impression grand format", title: "Impression grand format bâches & panneaux | Art Vision", h1: "Impression Grand Format Publicitaire", metaDesc: "Imprimez vos bâches, banderoles, panneaux de chantier et affiches abribus en haute définition. Finition résistante aux UV.", pageType: "GENERIC" },
  { slug: "impression-publicitaire", keyword: "impression publicitaire", title: "Impression publicitaire rapide en France | Art Vision", h1: "Imprimerie Publicitaire & Supports de Vente", metaDesc: "Imprimez tous vos documents commerciaux en ligne : cartes de visite, flyers, dépliants et affiches publicitaires de qualité.", pageType: "GENERIC" },
  { slug: "impression-flyers", keyword: "impression flyers", title: "Impression flyers et prospectus publicitaires | Art Vision", h1: "Impression de Flyers Publicitaires CMJN", metaDesc: "Imprimez vos flyers A5 et A6 sur papier 135g à 350g couché mat ou brillant avec contrôle graphique de vos repères de coupe.", pageType: "GENERIC" },
  { slug: "impression-affiches", keyword: "impression affiches", title: "Impression affiches publicitaires toutes tailles | Art Vision", h1: "Impression d'Affiches Publicitaires A3 à A0", metaDesc: "Commandez vos affiches publicitaires grands formats. Papier résistant, impression haute fidélité pour intérieur et extérieur.", pageType: "GENERIC" },
  { slug: "impression-baches", keyword: "impression bâches", title: "Impression de bâches et banderoles publicitaires | Art Vision", h1: "Impression de Bâches & Banderoles avec Oeillets", metaDesc: "Bâches publicitaires ultra-résistantes avec œillets renforcés en laiton tous les 50cm. Impression haute définition extérieure.", pageType: "GENERIC" },
  { slug: "impression-panneaux-publicitaires", keyword: "impression panneaux", title: "Impression panneaux rigides et enseignes | Art Vision", h1: "Impression de Panneaux Publicitaires et Alu Dibond", metaDesc: "Panneaux de chantier en PVC alvéolaire Akilux, panneaux publicitaires en PVC Forex ou plaques enseignes rigides en alu Dibond.", pageType: "GENERIC" },
  { slug: "impression-catalogues", keyword: "impression catalogues", title: "Impression de catalogues et brochures commerciales | Art Vision", h1: "Impression de Catalogues & Brochures Multi-Pages", metaDesc: "Catalogues agrafés ou brochures dos carré collé pour présenter vos produits de manière élégante. Papiers de 135g à 300g.", pageType: "GENERIC" },
  { slug: "impression-cartes-de-visite", keyword: "impression cartes de visite", title: "Impression de cartes de visite professionnelles | Art Vision", h1: "Impression de Cartes de Visite Premium", metaDesc: "Cartes de visite de qualité sur papier 350g/400g avec pelliculage Soft Touch, vernis sélectif 3D et QR codes vCard dynamiques.", pageType: "GENERIC" },

  // Local SEO Le Mans
  { slug: "agence-graphique-le-mans", keyword: "agence graphique", city: "Le Mans", title: "Agence graphique au Le Mans | Studio & Design - Art Vision", h1: "Votre Agence Graphique Professionnelle au Le Mans", metaDesc: "Art Vision conçoit vos chartes graphiques, logos, brochures et vidéos publicitaires au Le Mans. Studio créatif à taille humaine.", pageType: "LOCAL" },
  { slug: "graphiste-le-mans", keyword: "graphiste", city: "Le Mans", title: "Graphiste professionnel au Le Mans | Design unique - Art Vision", h1: "Graphiste Professionnel Indépendant au Le Mans", metaDesc: "Besoin d'un graphiste au Le Mans ? Création de logos vectoriels originaux, mise en page publicitaire et supports print sous 5 jours.", pageType: "LOCAL" },
  { slug: "impression-le-mans", keyword: "impression", city: "Le Mans", title: "Impression publicitaire au Le Mans | Imprimerie locale - Art Vision", h1: "Imprimerie & Impression Publicitaire au Le Mans", metaDesc: "Impression locale au Le Mans pour flyers, bâches extérieures, panneaux de chantier et cartes de visite rigides. Devis express.", pageType: "LOCAL" },

  // Other Local SEO cities
  { slug: "agence-graphique-paris", keyword: "agence graphique", city: "Paris", title: "Agence graphique à Paris | Studio de communication - Art Vision", h1: "Agence Graphique et Studio Créatif à Paris", metaDesc: "Art Vision accompagne les startups et PME parisiennes dans leur branding, logos, films corporate et visualisations 3D.", pageType: "LOCAL" },
  { slug: "agence-graphique-lyon", keyword: "agence graphique", city: "Lyon", title: "Agence graphique à Lyon | Studio de design visuel - Art Vision", h1: "Agence Graphique et Identité Visuelle à Lyon", metaDesc: "Studio de création graphique lyonnais spécialisé en logos, brochures publicitaires, CGI 3D et supports de communication.", pageType: "LOCAL" },
  { slug: "agence-graphique-lille", keyword: "agence graphique", city: "Lille", title: "Agence graphique à Lille | Créations graphiques - Art Vision", h1: "Agence Graphique et Studio d'Impression à Lille", metaDesc: "Art Vision Lille réalise vos identités visuelles d'entreprises, dépliants de vente et animations de motion design.", pageType: "LOCAL" },
  { slug: "agence-graphique-marseille", keyword: "agence graphique", city: "Marseille", title: "Agence graphique à Marseille | Design & Vidéo - Art Vision", h1: "Agence Graphique et Studio de Communication à Marseille", metaDesc: "Donnez vie à vos projets à Marseille. Création de logotypes vectoriels, packshots 3D et impressions tous supports.", pageType: "LOCAL" },
  { slug: "agence-graphique-nantes", keyword: "agence graphique", city: "Nantes", title: "Agence graphique à Nantes | Studio créatif web & print - Art Vision", h1: "Agence Graphique et Création Site Web à Nantes", metaDesc: "Développez votre visibilité à Nantes avec un site web Next.js rapide, des chartes graphiques soignées et du motion design.", pageType: "LOCAL" },
  { slug: "agence-graphique-montpellier", keyword: "agence graphique", city: "Montpellier", title: "Agence graphique à Montpellier | Studio de design - Art Vision", h1: "Agence Graphique et Conception Graphique à Montpellier", metaDesc: "Studio graphique à Montpellier pour logos, packaging produits, vidéos publicitaires et impressions grand format.", pageType: "LOCAL" }
];

// Content Generator
function generateSEOContent(keyword: string, city?: string): string {
  const targetLocation = city ? `à ${city}` : "en France";
  const upperKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
  
  return `<div class="space-y-6">
    <p class="text-base leading-relaxed">
      À l'ère de la transformation numérique, se démarquer par une communication visuelle de qualité supérieure est devenu un impératif stratégique pour toutes les entreprises. C'est pourquoi faire appel à un expert pour votre projet de <strong>${keyword} ${targetLocation}</strong> s'avère être un choix pertinent et un investissement immédiatement rentable. Art Vision met à votre disposition des solutions créatives uniques, soignées et parfaitement adaptées à l'identité visuelle de votre marque.
    </p>

    <h2 class="text-2xl font-sora font-extrabold text-white pt-6">Pourquoi choisir Art Vision pour votre ${keyword} ?</h2>
    <p class="text-sm text-white/85 leading-relaxed">
      En tant que studio créatif à taille humaine, nous plaçons l'excellence visuelle et le respect de votre cahier des charges au cœur de nos priorités. Nous n'utilisons aucun gabarit automatique ou modèle pré-conçu de basse qualité. Chaque création de <strong>${keyword}</strong> fait l'objet d'une recherche approfondie de typographie, de composition et d'harmonie colorimétrique.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-xs text-white/70">
      <li><strong>Une conception sur-mesure :</strong> Nos designers dessinent des projets uniques pour refléter les valeurs réelles de votre marque.</li>
      <li><strong>Fichiers sources inclus :</strong> Toutes nos livraisons de créations vectorielles intègrent les formats sources (.AI, .SVG, .PDF) pour une flexibilité d'exploitation totale.</li>
      <li><strong>Contrôle qualité technique :</strong> De la colorimétrie CMJN pour l'impression au codage sémantique Next.js pour le web, nous respectons scrupuleusement les exigences techniques.</li>
    </ul>

    <h2 class="text-2xl font-sora font-extrabold text-white pt-6">Notre processus de création pour votre projet ${targetLocation}</h2>
    <p class="text-sm text-white/85 leading-relaxed">
      Pour garantir la conformité et la réussite de nos livrables, nous appliquons une méthodologie de travail rigoureuse structurée en cinq étapes claires :
    </p>
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
      <div class="bg-[#1A1238]/40 border border-brand-purple/15 p-4 rounded-xl">
        <span class="text-brand-magenta font-extrabold text-sm block">01. Cadrage</span>
        <p class="text-[10px] text-white/60">Analyse de votre besoin et audit concurrentiel initial.</p>
      </div>
      <div class="bg-[#1A1238]/40 border border-brand-purple/15 p-4 rounded-xl">
        <span class="text-brand-magenta font-extrabold text-sm block">02. Design</span>
        <p class="text-[10px] text-white/60">Création de concepts et soumission de planches graphiques.</p>
      </div>
      <div class="bg-[#1A1238]/40 border border-brand-purple/15 p-4 rounded-xl">
        <span class="text-brand-magenta font-extrabold text-sm block">03. Production</span>
        <p class="text-[10px] text-white/60">Vectorisation ou modélisation sous logiciels pro (Adobe, Blender).</p>
      </div>
      <div class="bg-[#1A1238]/40 border border-brand-purple/15 p-4 rounded-xl">
        <span class="text-brand-magenta font-extrabold text-sm block">04. Validation</span>
        <p class="text-[10px] text-white/60">Ajustements selon vos retours et signature du BAT officiel.</p>
      </div>
      <div class="bg-[#1A1238]/40 border border-brand-purple/15 p-4 rounded-xl">
        <span class="text-brand-magenta font-extrabold text-sm block">05. Livraison</span>
        <p class="text-[10px] text-white/60">Transfert de propriété intellectuelle et livraison des fichiers finaux.</p>
      </div>
    </div>

    <h2 class="text-2xl font-sora font-extrabold text-white pt-6">Optimisation et cohérence de votre communication visuelle</h2>
    <p class="text-sm text-white/85 leading-relaxed">
      Qu'il s'agisse de concevoir une identité visuelle complète, une modélisation 3D photoréaliste ou des supports d'impression grand format, la qualité d'exécution d'Art Vision garantit une mémorisation forte auprès de vos prospects. Nous vous aidons à bâtir une image cohérente, moderne et pérenne sur l'ensemble de vos canaux de diffusion.
    </p>
  </div>`;
}

// Generate FAQ JSON
function generateFAQs(keyword: string, city?: string): { question: string; answer: string }[] {
  const loc = city ? `à ${city}` : "en France";
  return [
    {
      question: `Quels sont les tarifs pour une prestation de ${keyword} ${loc} ?`,
      answer: `Les tarifs varient selon la complexité et le volume de livrables demandés. Nos offres débutent à partir de 70€ pour des logos basiques et s'adaptent selon les formules d'accompagnement.`
    },
    {
      question: `Quels sont vos délais moyens de réalisation pour un projet de ${keyword} ?`,
      answer: `Les délais dépendent de la complexité. En moyenne, un logo prend 5 à 7 jours, une identité complète 2 semaines, et une bâche publicitaire grand format 4 jours ouvrés.`
    },
    {
      question: `Les droits d'auteur sont-ils transférés avec le livrable ?`,
      answer: `Absolument. Dès la validation finale et le paiement du solde de la facture, la totalité des droits d'exploitation commerciale et intellectuelle vous est cédée.`
    },
    {
      question: `Proposez-vous des modifications après livraison ?`,
      answer: `Oui, toutes nos prestations incluent un nombre de révisions défini dans le devis initial, et nous fournissons les fichiers sources éditables pour des adaptations futures.`
    },
    {
      question: `Comment démarrer mon projet de ${keyword} avec votre agence ?`,
      answer: `Il vous suffit de cliquer sur 'Demander un devis' pour remplir notre formulaire en ligne, ou de nous contacter via le bouton WhatsApp pour échanger en direct avec un chef de projet.`
    }
  ];
}

export async function seedSEOLandingPages() {
  console.log("Seeding SEO Landing Pages in DB...");
  
  for (const page of SEO_TEMPLATES) {
    const content = generateSEOContent(page.keyword, page.city);
    const faqs = generateFAQs(page.keyword, page.city);
    
    // Upsert the Landing Page record
    await prisma.seoLandingPage.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        title: page.title,
        slug: page.slug,
        h1: page.h1,
        keyword: page.keyword,
        city: page.city || null,
        pageType: page.pageType,
        intro: `Art Vision est votre spécialiste de confiance en ${page.keyword} ${page.city ? `à ${page.city}` : "en France"}. Découvrez notre savoir-faire unique et premium.`,
        content: content,
        faq: JSON.stringify(faqs),
        relatedServices: "identite-visuelle,creation-logo-professionnel,design-graphique",
        relatedPortfolio: "oleapure-branding,tadaa-3d-packshot",
        status: "PUBLISHED",
        seoTitle: page.title,
        metaDescription: page.metaDesc,
        canonicalUrl: `https://art-visions.fr/${page.slug}`,
        ogImage: "/logo.png",
        indexable: true
      }
    });

    // Also populate SitemapEntry dynamically
    await prisma.sitemapEntry.upsert({
      where: { url: `/${page.slug}` },
      update: {},
      create: {
        url: `/${page.slug}`,
        priority: page.pageType === "LOCAL" ? 0.6 : 0.7,
        changeFrequency: "monthly",
        included: true,
        lastModified: new Date()
      }
    });

    // Also add to generic FAQ database table
    for (let i = 0; i < faqs.length; i++) {
      const f = faqs[i];
      await prisma.fAQ.upsert({
        where: { id: `faq-${page.slug}-${i}` },
        update: {},
        create: {
          id: `faq-${page.slug}-${i}`,
          pageType: "SEO_LANDING",
          pageId: page.slug,
          question: f.question,
          answer: f.answer,
          order: i,
          schemaEnabled: true
        }
      });
    }
  }
  
  console.log("SEO Landing Pages seeded successfully!");
}
