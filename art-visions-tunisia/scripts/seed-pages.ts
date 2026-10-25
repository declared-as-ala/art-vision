import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// Creates DRAFT institutional pages in THIS project's database (never overwrites published slugs).
// Legal facts are NOT invented: anything unknown is a [bracketed placeholder] to complete in the admin
// before publishing. Legal wording should be validated by a qualified professional.

const id = () => Math.random().toString(36).slice(2, 10);
const style = (bg = "paper") => ({ bg, space: "md", align: "left", hide: "none" });
const hero = (title: string, text = "") => ({ id: id(), type: "hero", data: { eyebrow: "", title, text, ctaLabel: "", ctaHref: "" }, style: style("night") });
const text = (body: string, bg = "paper") => ({ id: id(), type: "text", data: { body }, style: style(bg) });
const block = (type: string, data: object, bg = "paper") => ({ id: id(), type, data, style: style(bg) });

const PRIVACY_COOKIES =
  "## Cookies et mesure d'audience\n\nLe site n'utilise aucun cookie. Une mesure d'audience interne et anonyme comptabilise les pages vues (page consultée, date et site d'origine) sans adresse IP ni identifiant personnel ; le signal « Do Not Track » de votre navigateur est respecté. Cette section sera mise à jour avant l'ajout de tout autre outil de suivi.";

type Def = { slug: string; lang: "fr" | "ar"; title: string; template: string; primaryKeyword?: string; seoTitle: string; metaDescription: string; noindex?: boolean; navVisible: boolean; blocks: object[] };

const PAGES: Def[] = [
  {
    slug: "a-propos", lang: "fr", title: "À propos", template: "landing", primaryKeyword: "agence graphique Tunisie",
    seoTitle: "À propos d'Art Visions : agence graphique et digitale en Tunisie",
    metaDescription: "Art Visions conçoit logos, identités visuelles, supports imprimés et sites web pour les entreprises tunisiennes. Découvrez notre approche et notre façon de travailler.",
    navVisible: true,
    blocks: [
      hero("À propos d'Art Visions", "Une agence de création graphique et digitale pour les entreprises tunisiennes : logo, identité visuelle, supports imprimés et sites web."),
      text("## Notre approche\n\nNous partons de votre activité et de vos clients, pas d'un modèle tout fait. Chaque projet commence par un brief précis, se poursuit par des propositions concrètes testées sur de vrais supports, puis se termine par des fichiers organisés, prêts pour l'imprimeur ou le web.\n\nNous préférons un résultat clair et durable à un effet de mode : un logo lisible sur une enseigne comme sur un profil Instagram, une charte simple à appliquer, un site rapide qui répond aux questions de vos visiteurs."),
      block("features", { title: "Ce qui guide notre travail", items: [
        { title: "Clarté", text: "Des visuels qui se comprennent en quelques secondes, sur tous les supports." },
        { title: "Cohérence", text: "Une même identité du logo à la vitrine, du menu au site web." },
        { title: "Transparence", text: "Livrables, révisions et délais précisés par écrit dans le devis." },
      ] }, "white"),
      block("services", { title: "Ce que nous faisons" }),
      block("cta", { title: "Parlons de votre projet", text: "Décrivez votre activité et votre besoin, nous revenons vers vous avec une proposition.", label: "Demander un devis", href: "/contact" }, "brand"),
    ],
  },
  {
    slug: "man-nahnu", lang: "ar", title: "عن Art Visions", template: "landing", primaryKeyword: "وكالة تصميم جرافيك تونس",
    seoTitle: "عن Art Visions: وكالة تصميم جرافيك ورقمنة في تونس",
    metaDescription: "تصمّم Art Visions الشعارات والهويات البصرية والمطبوعات والمواقع الإلكترونية للشركات التونسية. تعرّفوا على منهجنا وطريقة عملنا.",
    navVisible: false,
    blocks: [
      hero("عن Art Visions", "وكالة تصميم جرافيك ورقمنة للشركات التونسية: شعارات، هوية بصرية، مطبوعات ومواقع إلكترونية."),
      text("## منهجنا\n\nننطلق من نشاطكم وزبائنكم لا من قالب جاهز. كل مشروع يبدأ بملخّص دقيق، ثم مقترحات ملموسة مُجرَّبة على دعائم حقيقية، وينتهي بملفات منظّمة جاهزة للمطبعة أو للويب.\n\nنفضّل نتيجة واضحة ودائمة على موضة عابرة: شعار مقروء على اللافتة كما على حساب إنستغرام، ودليل هوية بسيط التطبيق، وموقع سريع يجيب عن أسئلة زواره."),
      block("features", { title: "ما يوجّه عملنا", items: [
        { title: "الوضوح", text: "تصاميم تُفهم في ثوانٍ على جميع الدعائم." },
        { title: "الاتساق", text: "هوية واحدة من الشعار إلى واجهة المحل، ومن قائمة الطعام إلى الموقع." },
        { title: "الشفافية", text: "المخرجات والتعديلات والآجال مكتوبة بوضوح في عرض السعر." },
      ] }, "white"),
      block("cta", { title: "حدّثونا عن مشروعكم", text: "صِفوا نشاطكم وحاجتكم وسنعود إليكم بمقترح مناسب.", label: "اطلب عرض سعر", href: "/ar/contact" }, "brand"),
    ],
  },
  {
    slug: "mentions-legales", lang: "fr", title: "Mentions légales", template: "legal",
    seoTitle: "Mentions légales | Art Visions", metaDescription: "Mentions légales du site art-visions.tn : éditeur, hébergeur et contact.", noindex: true, navVisible: true,
    blocks: [
      hero("Mentions légales"),
      text("## Éditeur du site\n\n- Dénomination : [à compléter]\n- Forme juridique : [à compléter]\n- Matricule fiscal : [à compléter]\n- Adresse : [à compléter]\n- Email : [à compléter]\n- Téléphone : [à compléter]\n- Responsable de la publication : [à compléter]\n\n## Hébergement\n\n- Hébergeur : [à compléter]\n- Adresse de l'hébergeur : [à compléter]\n\n## Propriété intellectuelle\n\nLes contenus du site (textes, visuels, logo, code) sont la propriété d'Art Visions, sauf mention contraire. Toute reproduction sans autorisation écrite est interdite.\n\n## Contact\n\nPour toute question concernant ce site, utilisez la page [Demander un devis](/contact)."),
    ],
  },
  {
    slug: "politique-de-confidentialite", lang: "fr", title: "Politique de confidentialité", template: "legal",
    seoTitle: "Politique de confidentialité | Art Visions", metaDescription: "Comment Art Visions collecte, utilise et protège les données personnelles transmises via le formulaire de devis.", noindex: true, navVisible: true,
    blocks: [
      hero("Politique de confidentialité"),
      text("## Données collectées\n\nLorsque vous envoyez le formulaire de devis, nous collectons les informations que vous saisissez : nom, adresse email, téléphone (facultatif), entreprise (facultatif), service souhaité et description de votre projet.\n\n## Finalité\n\nCes données servent uniquement à répondre à votre demande et à vous proposer un devis. Elles ne sont ni vendues ni cédées à des tiers à des fins commerciales.\n\n## Durée de conservation\n\nLes demandes sont conservées [durée à définir] puis supprimées ou anonymisées.\n\n## Vos droits\n\nVous pouvez demander l'accès, la rectification ou la suppression de vos données en nous écrivant à [email à compléter]. Mentionnez le cadre légal applicable après validation par un professionnel du droit.\n\n" + PRIVACY_COOKIES + "\n\n## Sécurité\n\nL'accès à l'administration du site est protégé par authentification, et les données sont stockées sur une base de données dédiée à ce site."),
    ],
  },
];

async function main() {
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  for (const p of PAGES) {
    const where = { kind_lang_slug: { kind: "page", lang: p.lang, slug: p.slug } };
    const exists = await db.page.findUnique({ where });
    if (exists) {
      // Keep the (draft) privacy page in sync with the analytics wording; never touch published pages.
      if (p.slug === "politique-de-confidentialite" && exists.status === "DRAFT") {
        await db.page.update({ where, data: { blocks: p.blocks as object[] } });
        console.log("updated draft:", p.slug);
      } else console.log("skip (exists):", p.slug);
      continue;
    }
    await db.page.create({
      data: {
        kind: "page", lang: p.lang, slug: p.slug, title: p.title, template: p.template, status: "DRAFT", blocks: p.blocks as object[],
        primaryKeyword: p.primaryKeyword || null, seoTitle: p.seoTitle, metaDescription: p.metaDescription,
        noindex: !!p.noindex, navVisible: p.navVisible,
      },
    });
    console.log("created draft:", p.lang, p.slug);
  }
  // Link the French and Arabic About pages as translations (hreflang once both are published).
  const fr = await db.page.findUnique({ where: { kind_lang_slug: { kind: "page", lang: "fr", slug: "a-propos" } } });
  const ar = await db.page.findUnique({ where: { kind_lang_slug: { kind: "page", lang: "ar", slug: "man-nahnu" } } });
  if (fr && ar && !fr.translationId) {
    await db.page.update({ where: { id: fr.id }, data: { translationId: ar.id } });
    await db.page.update({ where: { id: ar.id }, data: { translationId: fr.id } });
    console.log("linked a-propos <-> man-nahnu");
  }
  await db.$disconnect();
}
main();
