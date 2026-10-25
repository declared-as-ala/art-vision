import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/content/services";
import { PROJECTS } from "@/content/portfolio";
import { TOOLS } from "@/content/tools";
import { ARTICLES } from "@/content/blog";
import { DICT, prefix, type Locale } from "@/lib/i18n";
import { ProjectCover } from "./project-cover";
import { TunisiaFlag } from "./tunisia-flag";

const COPY = {
  fr: {
    eyebrow: "Agence de design graphique, web & impression en Tunisie",
    whatsapp: "WhatsApp direct",
    map: "Notre localisation",
    flagCaption: "Conçu en Tunisie,\npour la Tunisie",
    h1a: "Une marque",
    h1b: "qui se voit.",
    h1c: "",
    lead: "Logo, identité visuelle, imprimés et site web. Un seul interlocuteur.",
    seeServices: "Voir les services",
    audiences: ["Restaurants & cafés", "Boutiques de mode", "Salons de beauté", "Startups", "Artisans", "Hôtels", "Cabinets & cliniques", "E-commerce"],
    servicesTitle: "Ce que nous faisons pour votre marque",
    processTitle: "Une méthode simple, des livrables clairs.",
    process: [
      ["Brief", "Nous cadrons votre activité, votre cible et votre budget."],
      ["Création", "Des propositions concrètes, testées sur de vrais supports."],
      ["Ajustements", "Vos retours intégrés jusqu'à validation."],
      ["Livraison", "Fichiers organisés, prêts pour l'imprimeur et le web."],
    ],
    workTitle: "Réalisations",
    workAll: "Tout le portfolio",
    toolsEyebrow: "Outils gratuits",
    toolsTitle: "Avancez avant même de nous contacter.",
    blogEyebrow: "Blog",
    blogTitle: "Conseils pratiques pour vos supports.",
    ctaTitle: "Parlez-nous de votre projet.",
  },
  ar: {
    eyebrow: "وكالة تصميم جرافيكي وويب وطباعة في تونس",
    whatsapp: "واتساب مباشر",
    map: "موقعنا على الخريطة",
    flagCaption: "صُمّم في تونس،\nلتونس",
    h1a: "علامة",
    h1b: "تُرى وتُذكر.",
    h1c: "",
    lead: "شعار وهوية بصرية ومطبوعات وموقع إلكتروني. مُحاوِر واحد.",
    seeServices: "اكتشفوا الخدمات",
    audiences: ["مطاعم ومقاهي", "محلات الأزياء", "صالونات التجميل", "شركات ناشئة", "حرفيون", "فنادق", "عيادات ومكاتب مهنية", "تجارة إلكترونية"],
    servicesTitle: "ما نقدّمه لعلامتكم",
    processTitle: "منهجية بسيطة ومخرجات واضحة.",
    process: [
      ["الملخّص", "نحدّد نشاطكم وجمهوركم وميزانيتكم."],
      ["الإبداع", "مقترحات ملموسة مُجرَّبة على دعائم حقيقية."],
      ["التعديلات", "ملاحظاتكم مدمجة حتى الاعتماد النهائي."],
      ["التسليم", "ملفات منظّمة جاهزة للمطبعة والويب."],
    ],
    workTitle: "",
    workAll: "",
    toolsEyebrow: "",
    toolsTitle: "",
    blogEyebrow: "",
    blogTitle: "",
    ctaTitle: "حدّثونا عن مشروعكم.",
  },
} as const;

export function Home({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const t = DICT[locale];
  const p = prefix(locale);
  const projects = PROJECTS.slice(0, 2);

  return (
    <>
      {/* HERO — dark, bold, with the Tunisian touch */}
      <section className="hero-field grain relative isolate overflow-hidden text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-12 lg:pb-20 lg:pt-16">
          <div className="lg:col-span-7">
            <p className="rise rise-1 num inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/90">
              <TunisiaFlag className="h-5 w-8 rounded-sm object-cover" title="" />
              {c.eyebrow}
            </p>
            <h1 className="rise rise-2 mt-6 text-[clamp(2.6rem,6vw,5.6rem)] font-extrabold uppercase leading-[0.98]">
              {c.h1a}<br />
              <span className="text-sun">{c.h1b}</span>
              {c.h1c && <><br />{c.h1c}</>}
            </h1>
            <p className="rise rise-3 mt-6 max-w-xl text-lg leading-relaxed text-white/75">{c.lead}</p>
            <div className="rise rise-4 mt-9 flex flex-wrap items-center gap-3">
              <Link href={`${p}/contact`} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d95500] px-8 py-4 font-bold uppercase tracking-wide shadow-lg shadow-[#d95500]/30 transition-colors hover:bg-sun">
                {t.quoteFree} <ArrowUpRight size={18} className="rtl:-scale-x-100" />
              </Link>
              <Link href={`${p}/services`} className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 font-bold uppercase tracking-wide transition-colors hover:border-white hover:bg-white/5">
                {c.seeServices}
              </Link>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-400/20">
                <MessageCircle size={18} /> {c.whatsapp} : <span dir="ltr" className="num">{SITE.phoneDisplay}</span>
              </a>
              <a href={SITE.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10">
                <MapPin size={18} className="text-sun" /> {c.map}
              </a>
            </div>
          </div>

          <div className="rise rise-3 relative lg:col-span-5" aria-hidden="true">
            <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
              <div className="absolute inset-[8%] rounded-full bg-[#E70013]/45 blur-3xl" />
              <div className="absolute inset-[14%] rounded-full bg-violet/40 blur-3xl" />
              <svg viewBox="0 0 400 400" className="absolute inset-0 size-full">
                <circle cx="200" cy="200" r="168" fill="none" stroke="#E70013" strokeOpacity=".55" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
                <circle cx="200" cy="200" r="132" fill="none" stroke="#fff" strokeOpacity=".14" strokeWidth="1.5" />
                <path d="M200 40 a160 160 0 1 0 0 320 a124 124 0 1 1 0 -320z" fill="#E70013" fillOpacity=".16" />
              </svg>
              <div className="drift absolute inset-0 grid place-items-center">
                <Image src="/brand/logo-mark.svg" alt="" width={420} height={600} priority className="h-[62%] w-auto -rotate-3 drop-shadow-[0_30px_60px_rgba(231,0,19,0.35)]" />
              </div>
              <div className="absolute bottom-[6%] end-[2%] flex items-center gap-2 rounded-full bg-white py-1.5 pe-4 ps-1.5 text-night shadow-xl">
                <TunisiaFlag className="h-6 w-9 rounded-full object-cover" title="" />
                <span className="text-xs font-bold">{c.flagCaption.split("\n").join(" ")}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden border-y border-white/10 bg-brand py-4 text-white" aria-hidden="true">
          <div className="marquee flex w-max gap-10 whitespace-nowrap text-sm font-medium">
            {[...c.audiences, ...c.audiences].map((a, i) => (
              <span key={i} className="flex items-center gap-10">{a}<span className="text-night/60">✦</span></span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES — colour-blocked bento */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <h2 className="max-w-2xl text-4xl font-semibold text-indigo sm:text-6xl">{c.servicesTitle}</h2>
          <Link href={`${p}/services`} className="hidden shrink-0 text-sm font-medium underline decoration-brand decoration-2 underline-offset-4 sm:block">{t.allServices}</Link>
        </div>
        <ul className="mt-14 grid gap-4 md:grid-cols-6">
          {SERVICES.map((s, i) => (
            <li key={s.id} className={i === 0 || i === 3 ? "md:col-span-4" : "md:col-span-2"}>
              <Link
                href={`${p}/services/${s.slugs[locale]}`}
                className={`group relative flex min-h-64 h-full flex-col justify-between overflow-hidden rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1 ${s.tone.bg} ${s.tone.fg}`}
              >
                <span className="num text-sm opacity-70">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" className="num pointer-events-none absolute -bottom-6 end-4 text-[9rem] font-semibold leading-none opacity-[0.12]">{i + 1}</span>
                <div className="relative">
                  <h3 className="text-2xl font-semibold sm:text-3xl">{s[locale].name}</h3>
                  <p className="mt-2 max-w-sm text-sm opacity-85">{s[locale].short}</p>
                </div>
                <ArrowUpRight className="absolute end-6 top-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* PROCESS */}
      <section className="bg-tint-violet">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12">
          <h2 className="text-4xl font-semibold text-indigo sm:text-5xl lg:col-span-4">{c.processTitle}</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {c.process.map(([title, text], i) => (
              <li key={title} className="rounded-3xl bg-white p-7">
                <span className="num stroke-text text-6xl font-semibold [--stroke:var(--brand)]">{i + 1}</span>
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-soft">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {locale === "fr" && (
        <>
          {/* PORTFOLIO */}
          <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-4xl font-semibold text-indigo sm:text-6xl">{c.workTitle}</h2>
              <Link href="/portfolio" className="text-sm font-medium underline decoration-brand decoration-2 underline-offset-4">{c.workAll}</Link>
            </div>
            <ul className="mt-12 grid gap-5 md:grid-cols-2">
              {projects.map((pr) => (
                <li key={pr.slug}>
                  <Link href={`/portfolio/${pr.slug}`} className="group block">
                    <div className="aspect-[4/3] overflow-hidden rounded-3xl transition-transform duration-500 group-hover:scale-[0.985]"><ProjectCover project={pr} /></div>
                    <p className="num mt-4 text-xs uppercase tracking-widest text-brand">{pr.category}</p>
                    <h3 className="mt-1 text-2xl font-semibold">{pr.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* TOOLS */}
          <section className="bg-night text-white">
            <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
              <p className="num text-xs uppercase tracking-[0.22em] text-copper">{c.toolsEyebrow}</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold sm:text-5xl">{c.toolsTitle}</h2>
              <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {TOOLS.map((tool) => (
                  <li key={tool.slug}>
                    <Link href={`/outils-gratuits/${tool.slug}`} className={`group flex h-full min-h-44 flex-col justify-between rounded-3xl p-6 text-white transition-transform hover:-translate-y-1 ${tool.tone}`}>
                      <ArrowUpRight className="self-end transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                      <div>
                        <h3 className="text-lg font-semibold">{tool.name}</h3>
                        <p className="mt-1 text-sm text-white/80">{tool.text}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* BLOG */}
          <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <p className="num text-xs uppercase tracking-[0.22em] text-brand">{c.blogEyebrow}</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold text-indigo sm:text-5xl">{c.blogTitle}</h2>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
              {ARTICLES.slice(0, 3).map((a) => (
                <li key={a.slug} className="bg-white">
                  <Link href={`/blog/${a.slug}`} className="block h-full p-7 transition-colors hover:bg-tint-brand">
                    <p className="num text-xs uppercase tracking-widest text-copper">{a.category}</p>
                    <h3 className="mt-3 text-xl font-semibold leading-snug">{a.title}</h3>
                    <p className="num mt-6 text-xs text-soft">{a.readMinutes} min</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 py-24 sm:px-8 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-2xl text-5xl font-semibold sm:text-7xl">{c.ctaTitle}</h2>
          <Link href={`${p}/contact`} className="inline-flex items-center gap-2 rounded-full bg-night px-8 py-4 font-medium text-white transition-colors hover:bg-indigo">
            {t.quote} <ArrowUpRight size={18} className="rtl:-scale-x-100" />
          </Link>
        </div>
      </section>
    </>
  );
}
