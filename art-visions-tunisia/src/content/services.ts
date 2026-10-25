import type { Locale } from "@/lib/i18n";

export type L10nService = {
  name: string;
  short: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  deliverables: string[];
  process: { title: string; text: string }[];
  useCases: string[];
  faqs: { q: string; a: string }[];
};

export type Service = {
  id: string;
  /** Tailwind classes: solid block colour + readable text colour */
  tone: { bg: string; fg: string; tint: string };
  slugs: Record<Locale, string>;
  keyword: string;
  relatedTools: string[];
  fr: L10nService;
  ar: L10nService;
};

// Only services Art Visions genuinely provides. No prices until approved by the owner.
export const SERVICES: Service[] = [
  {
    id: "logo",
    tone: { bg: "bg-brand", fg: "text-white", tint: "bg-tint-brand" },
    slugs: { fr: "creation-logo-tunisie", ar: "tasmim-logo-tunis" },
    keyword: "création logo Tunisie",
    relatedTools: ["generateur-brief-logo", "generateur-palette-couleurs", "generateur-slogan"],
    fr: {
      name: "Création de logo",
      short: "Un logo mémorable, livré en tous formats.",
      seoTitle: "Création de logo professionnel en Tunisie | Art Visions",
      seoDescription:
        "Création de logo sur mesure pour entreprises tunisiennes : recherche, concepts, révisions et fichiers vectoriels prêts pour le print et le web. Devis gratuit.",
      h1: "Création de logo professionnel en Tunisie",
      intro:
        "Votre logo travaille sur une enseigne, un menu, un profil Instagram et une facture. Nous le concevons pour qu'il reste lisible et reconnaissable sur chacun de ces supports, avant même de penser à la décoration.",
      deliverables: [
        "Recherche et brief créatif",
        "Concepts de logo originaux",
        "Révisions sur la proposition retenue",
        "Fichiers vectoriels (SVG, PDF) et PNG",
        "Déclinaisons couleur, noir et blanc, monochrome",
      ],
      process: [
        { title: "Brief", text: "Activité, cible, concurrents locaux et ambiance souhaitée." },
        { title: "Concepts", text: "Pistes graphiques distinctes, présentées sur des supports réels." },
        { title: "Affinage", text: "Ajustements de forme, de couleur et de typographie." },
        { title: "Livraison", text: "Pack de fichiers organisés, prêts pour l'imprimeur et le web." },
      ],
      useCases: ["Restaurants et cafés", "Boutiques de prêt-à-porter", "Salons de beauté", "Startups", "Artisans", "Cabinets et cliniques"],
      faqs: [
        { q: "Combien de temps faut-il pour créer un logo ?", a: "Le délai dépend de la complexité du projet et de la rapidité de vos retours. Nous le confirmons dans le devis." },
        { q: "Recevrai-je les fichiers sources ?", a: "Oui, les fichiers vectoriels sont inclus pour que vous puissiez imprimer chez n'importe quel prestataire." },
        { q: "Puis-je demander des modifications ?", a: "Des révisions sont prévues sur la piste retenue ; leur nombre est précisé dans le devis." },
      ],
    },
    ar: {
      name: "تصميم الشعار",
      short: "شعار لا يُنسى، بجميع الصيغ الجاهزة.",
      seoTitle: "تصميم شعار احترافي في تونس | Art Visions",
      seoDescription:
        "تصميم شعار حسب الطلب للشركات التونسية: بحث، مقترحات، تعديلات وملفات vector جاهزة للطباعة والويب. اطلب عرض سعر مجاني.",
      h1: "تصميم شعار احترافي في تونس",
      intro:
        "شعارك يظهر على اللافتة وقائمة الطعام وحساب إنستغرام والفاتورة. نصمّمه ليبقى واضحًا ومميّزًا على كل هذه الدعائم، قبل التفكير في الزخرفة.",
      deliverables: [
        "بحث وملخّص إبداعي",
        "مقترحات شعار أصلية",
        "تعديلات على المقترح المختار",
        "ملفات vector (SVG وPDF) وPNG",
        "نسخ ملوّنة وبالأبيض والأسود وأحادية اللون",
      ],
      process: [
        { title: "الملخّص", text: "النشاط والجمهور المستهدف والمنافسون المحليون والأجواء المطلوبة." },
        { title: "المقترحات", text: "اتجاهات بصرية متنوعة تُعرض على دعائم حقيقية." },
        { title: "التحسين", text: "تعديل الشكل واللون والخط." },
        { title: "التسليم", text: "حزمة ملفات منظّمة جاهزة للمطبعة والويب." },
      ],
      useCases: ["المطاعم والمقاهي", "محلات الملابس", "صالونات التجميل", "الشركات الناشئة", "الحرفيون", "العيادات والمكاتب المهنية"],
      faqs: [
        { q: "كم يستغرق تصميم الشعار؟", a: "تتوقف المدة على تعقيد المشروع وسرعة ردودكم، ونحدّدها في عرض السعر." },
        { q: "هل سأحصل على الملفات المصدرية؟", a: "نعم، ملفات vector مشمولة لتتمكنوا من الطباعة لدى أي مطبعة." },
        { q: "هل يمكنني طلب تعديلات؟", a: "التعديلات متاحة على المقترح المختار، ويُحدَّد عددها في عرض السعر." },
      ],
    },
  },
  {
    id: "identity",
    tone: { bg: "bg-indigo", fg: "text-white", tint: "bg-tint-violet" },
    slugs: { fr: "identite-visuelle-charte-graphique-tunisie", ar: "hawiya-basariya-tunis" },
    keyword: "identité visuelle Tunisie",
    relatedTools: ["generateur-palette-couleurs", "generateur-brief-logo"],
    fr: {
      name: "Identité visuelle & charte graphique",
      short: "Un système cohérent sur tous vos supports.",
      seoTitle: "Identité visuelle et charte graphique en Tunisie | Art Visions",
      seoDescription:
        "Identité visuelle et charte graphique pour marques tunisiennes : logo, couleurs, typographies et règles d'usage pour une image cohérente partout.",
      h1: "Identité visuelle et charte graphique en Tunisie",
      intro:
        "Une identité visuelle, c'est la règle du jeu qui garde votre marque cohérente, de la carte de visite à la vitrine. Nous formalisons couleurs, typographies, usages du logo et exemples d'application.",
      deliverables: [
        "Audit de l'existant et positionnement",
        "Palette de couleurs et typographies",
        "Règles d'usage du logo",
        "Charte graphique en PDF",
        "Exemples d'applications (papeterie, réseaux sociaux)",
      ],
      process: [
        { title: "Diagnostic", text: "Analyse de vos supports actuels et de votre marché." },
        { title: "Direction", text: "Choix du territoire visuel et validation." },
        { title: "Système", text: "Construction des éléments et des règles." },
        { title: "Charte", text: "Document final et fichiers de travail." },
      ],
      useCases: ["Marques en lancement", "Refonte d'image", "Réseaux de points de vente", "E-commerce"],
      faqs: [
        { q: "Quelle différence entre logo et charte graphique ?", a: "Le logo est un élément ; la charte définit comment l'utiliser avec couleurs, typographies et supports." },
        { q: "Ai-je besoin d'une charte si je débute ?", a: "Une charte simple évite les incohérences dès les premiers supports et vous fait gagner du temps ensuite." },
      ],
    },
    ar: {
      name: "الهوية البصرية ودليل الاستخدام",
      short: "نظام متكامل يوحّد جميع دعائمكم.",
      seoTitle: "الهوية البصرية ودليل الاستخدام في تونس | Art Visions",
      seoDescription:
        "هوية بصرية ودليل استخدام للعلامات التونسية: شعار وألوان وخطوط وقواعد استعمال لصورة موحّدة في كل مكان.",
      h1: "الهوية البصرية ودليل الاستخدام في تونس",
      intro:
        "الهوية البصرية هي القواعد التي تُبقي علامتكم متسقة، من بطاقة الزيارة إلى واجهة المحل. نحدّد الألوان والخطوط وطرق استعمال الشعار مع أمثلة تطبيقية.",
      deliverables: [
        "تشخيص الوضع الحالي والتموضع",
        "لوحة ألوان وخطوط",
        "قواعد استعمال الشعار",
        "دليل الهوية بصيغة PDF",
        "أمثلة تطبيقية (مطبوعات ومواقع التواصل)",
      ],
      process: [
        { title: "التشخيص", text: "تحليل دعائمكم الحالية وسوقكم." },
        { title: "الاتجاه", text: "اختيار الاتجاه البصري واعتماده." },
        { title: "النظام", text: "بناء العناصر والقواعد." },
        { title: "الدليل", text: "الوثيقة النهائية وملفات العمل." },
      ],
      useCases: ["علامات في مرحلة الإطلاق", "تجديد الصورة", "شبكات نقاط البيع", "التجارة الإلكترونية"],
      faqs: [
        { q: "ما الفرق بين الشعار ودليل الهوية؟", a: "الشعار عنصر واحد، أما الدليل فيحدّد كيفية استعماله مع الألوان والخطوط والدعائم." },
        { q: "هل أحتاج إلى دليل هوية وأنا في البداية؟", a: "دليل بسيط يجنّبكم التناقض منذ أولى الدعائم ويوفّر عليكم الوقت لاحقًا." },
      ],
    },
  },
  {
    id: "print",
    tone: { bg: "bg-copper", fg: "text-white", tint: "bg-tint-copper" },
    slugs: { fr: "impression-supports-publicitaires-tunisie", ar: "tasmim-matbou3at-tunis" },
    keyword: "impression flyers Tunisie",
    relatedTools: [],
    fr: {
      name: "Création & impression de supports",
      short: "Flyers, cartes, affiches, menus et catalogues.",
      seoTitle: "Flyers, cartes de visite, affiches et menus en Tunisie | Art Visions",
      seoDescription:
        "Conception et préparation à l'impression de flyers, cartes de visite, affiches, menus de restaurant et catalogues pour entreprises tunisiennes.",
      h1: "Flyers, cartes de visite, affiches et menus en Tunisie",
      intro:
        "Un bon support imprimé se lit en deux secondes. Nous concevons des visuels clairs, au bon format et avec les bons fonds perdus, pour que l'impression soit propre du premier coup.",
      deliverables: ["Conception graphique sur mesure", "Fichiers prêts pour l'imprimeur", "Déclinaisons de formats", "Conseils papier et finitions"],
      process: [
        { title: "Brief", text: "Objectif, format, quantité et budget." },
        { title: "Maquette", text: "Proposition graphique et corrections." },
        { title: "Fichiers", text: "Export print avec fonds perdus et repères." },
      ],
      useCases: ["Menus de restaurant", "Flyers promotionnels", "Cartes de visite", "Affiches", "Catalogues"],
      faqs: [
        { q: "Pouvez-vous seulement concevoir, sans imprimer ?", a: "Oui, vous recevez des fichiers prêts pour l'imprimeur de votre choix." },
        { q: "Quels formats proposez-vous ?", a: "Tous les formats courants ; le format exact est défini avec vous au brief." },
      ],
    },
    ar: {
      name: "تصميم المطبوعات والدعائم الإعلانية",
      short: "فلايرات وبطاقات وملصقات وقوائم طعام وكتالوجات.",
      seoTitle: "فلايرات وبطاقات زيارة وملصقات وقوائم طعام في تونس | Art Visions",
      seoDescription:
        "تصميم وتحضير للطباعة: فلايرات وبطاقات زيارة وملصقات وقوائم مطاعم وكتالوجات للشركات التونسية.",
      h1: "فلايرات وبطاقات زيارة وملصقات وقوائم طعام في تونس",
      intro:
        "المطبوع الجيد يُقرأ في ثانيتين. نصمّم تصاميم واضحة بالمقاس الصحيح وهوامش القص المناسبة لتخرج الطباعة سليمة من المرة الأولى.",
      deliverables: ["تصميم مخصّص", "ملفات جاهزة للمطبعة", "نسخ بمقاسات متعددة", "نصائح حول الورق والتشطيبات"],
      process: [
        { title: "الملخّص", text: "الهدف والمقاس والكمية والميزانية." },
        { title: "النموذج", text: "مقترح تصميم وتعديلات." },
        { title: "الملفات", text: "تصدير للطباعة مع هوامش القص وعلامات الضبط." },
      ],
      useCases: ["قوائم المطاعم", "فلايرات ترويجية", "بطاقات الزيارة", "الملصقات", "الكتالوجات"],
      faqs: [
        { q: "هل تكتفون بالتصميم دون الطباعة؟", a: "نعم، تتسلمون ملفات جاهزة للمطبعة التي تختارونها." },
        { q: "ما المقاسات المتاحة؟", a: "كل المقاسات الشائعة، ويُحدَّد المقاس بدقة عند الملخّص." },
      ],
    },
  },
  {
    id: "web",
    tone: { bg: "bg-violet", fg: "text-white", tint: "bg-tint-violet" },
    slugs: { fr: "creation-site-web-tunisie", ar: "tasmim-mawqi3-tunis" },
    keyword: "création site web Tunisie",
    relatedTools: ["generateur-qr-code"],
    fr: {
      name: "Création de site web",
      short: "Un site vitrine rapide, pensé pour générer des demandes.",
      seoTitle: "Création de site web vitrine en Tunisie | Art Visions",
      seoDescription:
        "Création de sites vitrines rapides et optimisés pour Google en Tunisie : design sur mesure, mobile-first, formulaire de devis et bases SEO.",
      h1: "Création de site web vitrine en Tunisie",
      intro:
        "Votre site doit répondre vite à une question : que faites-vous, et comment vous contacter ? Nous construisons des sites rapides, lisibles sur mobile et structurés pour être bien compris par Google.",
      deliverables: [
        "Design sur mesure aligné à votre identité",
        "Développement responsive",
        "Bases SEO (balises, sitemap, données structurées)",
        "Formulaire de contact ou de devis",
        "Mise en ligne et prise en main",
      ],
      process: [
        { title: "Cadrage", text: "Objectifs, pages et contenus." },
        { title: "Design", text: "Maquettes validées avant développement." },
        { title: "Développement", text: "Intégration, performance et tests." },
        { title: "Lancement", text: "Mise en ligne et suivi." },
      ],
      useCases: ["Restaurants", "Cabinets et cliniques", "Hôtels", "Artisans", "Boutiques en ligne"],
      faqs: [
        { q: "Mon site sera-t-il visible sur Google ?", a: "Nous mettons en place des bases SEO solides. Aucune position n'est garantie : le classement dépend de nombreux facteurs." },
        { q: "Puis-je modifier le contenu moi-même ?", a: "Selon la formule, un espace d'administration peut être prévu. Nous le précisons dans le devis." },
      ],
    },
    ar: {
      name: "تصميم المواقع الإلكترونية",
      short: "موقع تعريفي سريع، مصمَّم لجلب الطلبات.",
      seoTitle: "تصميم موقع إلكتروني تعريفي في تونس | Art Visions",
      seoDescription:
        "تصميم مواقع تعريفية سريعة ومهيّأة لمحركات البحث في تونس: تصميم مخصّص، متوافق مع الهاتف، نموذج طلب عرض سعر وأسس SEO.",
      h1: "تصميم موقع إلكتروني تعريفي في تونس",
      intro:
        "موقعكم يجب أن يجيب بسرعة: ماذا تقدّمون وكيف نتواصل معكم؟ نبني مواقع سريعة وواضحة على الهاتف ومنظَّمة ليفهمها محرك البحث جيدًا.",
      deliverables: [
        "تصميم مخصّص ينسجم مع هويتكم",
        "تطوير متجاوب مع جميع الشاشات",
        "أسس SEO (وسوم وخريطة موقع وبيانات منظّمة)",
        "نموذج تواصل أو طلب عرض سعر",
        "النشر والتدريب على الاستخدام",
      ],
      process: [
        { title: "التأطير", text: "الأهداف والصفحات والمحتوى." },
        { title: "التصميم", text: "نماذج معتمدة قبل التطوير." },
        { title: "التطوير", text: "البرمجة والأداء والاختبار." },
        { title: "الإطلاق", text: "النشر والمتابعة." },
      ],
      useCases: ["المطاعم", "العيادات والمكاتب المهنية", "الفنادق", "الحرفيون", "المتاجر الإلكترونية"],
      faqs: [
        { q: "هل سيظهر موقعي في غوغل؟", a: "نضع أسس SEO متينة، لكن لا نضمن أي ترتيب لأنه يعتمد على عوامل كثيرة." },
        { q: "هل يمكنني تعديل المحتوى بنفسي؟", a: "حسب الصيغة المختارة قد تتوفر لوحة إدارة، ونوضّح ذلك في عرض السعر." },
      ],
    },
  },
];

export function getService(slug: string, locale: Locale) {
  return SERVICES.find((s) => s.slugs[locale] === slug);
}
