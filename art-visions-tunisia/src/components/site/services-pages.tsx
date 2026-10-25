import Link from "next/link";
import { Suspense } from "react";
import { DbCards } from "./db-page";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, type Service } from "@/content/services";
import { TOOLS } from "@/content/tools";
import { ARTICLES } from "@/content/blog";
import { DICT, prefix, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const UI = {
  fr: {
    indexH1: "Nos services en Tunisie",
    indexLead: "Quatre expertises complémentaires pour construire une image de marque cohérente.",
    receive: "Ce que vous recevez", audience: "Pour qui ?", process: "Notre processus", faq: "Questions fréquentes",
    tools: "Outils gratuits associés", others: "Autres services", guides: "À lire aussi",
  },
  ar: {
    indexH1: "خدماتنا في تونس",
    indexLead: "أربع خبرات متكاملة لبناء صورة علامة متناسقة.",
    receive: "ما ستحصلون عليه", audience: "لمن؟", process: "مراحل العمل", faq: "الأسئلة الشائعة",
    tools: "", others: "خدمات أخرى", guides: "",
  },
} as const;

export function ServicesIndex({ locale }: { locale: Locale }) {
  const u = UI[locale];
  const p = prefix(locale);
  return (
    <>
      <section className="hero-field grain relative overflow-hidden text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <h1 className="max-w-4xl text-5xl font-semibold sm:text-7xl">{u.indexH1}</h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">{u.indexLead}</p>
        </div>
      </section>
      <ul className="mx-auto grid max-w-7xl gap-4 px-5 py-16 sm:px-8 md:grid-cols-2">
        {SERVICES.map((s, i) => (
          <li key={s.id}>
            <Link href={`${p}/services/${s.slugs[locale]}`} className={`group relative flex min-h-72 h-full flex-col justify-between overflow-hidden rounded-3xl p-8 transition-transform hover:-translate-y-1 ${s.tone.bg} ${s.tone.fg}`}>
              <span className="num text-sm opacity-70">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-3xl font-semibold">{s[locale].name}</h2>
                <p className="mt-2 max-w-sm opacity-85">{s[locale].short}</p>
              </div>
              <ArrowUpRight className="absolute end-7 top-7 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 rtl:-scale-x-100" />
            </Link>
          </li>
        ))}
      </ul>
      <Suspense fallback={null}><DbCards kind="service" lang={locale} /></Suspense>
    </>
  );
}

export function ServiceDetail({ service, locale }: { service: Service; locale: Locale }) {
  const s = service[locale];
  const u = UI[locale];
  const t = DICT[locale];
  const p = prefix(locale);
  const url = `${SITE.url}${p}/services/${service.slugs[locale]}`;
  const ld = [
    { "@context": "https://schema.org", "@type": "Service", name: s.name, description: s.seoDescription, areaServed: "TN", inLanguage: locale === "ar" ? "ar-TN" : "fr-TN", provider: { "@type": "Organization", name: SITE.name, url: SITE.url } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: t.home, item: `${SITE.url}${p}` || SITE.url },
      { "@type": "ListItem", position: 2, name: t.nav.services, item: `${SITE.url}${p}/services` },
      { "@type": "ListItem", position: 3, name: s.name, item: url },
    ] },
  ];
  const others = SERVICES.filter((x) => x.id !== service.id);
  const tools = TOOLS.filter((x) => service.relatedTools.includes(x.slug));
  const guides = ARTICLES.filter((a) => a.service === service.id);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className={`relative overflow-hidden ${service.tone.bg} ${service.tone.fg}`}>
        <div aria-hidden="true" className="absolute -end-24 -top-24 size-96 rounded-full bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <nav aria-label="Breadcrumb" className="num text-xs opacity-70">
            <Link href={p || "/"} className="hover:underline">{t.home}</Link> / <Link href={`${p}/services`} className="hover:underline">{t.nav.services}</Link>
          </nav>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.4rem,6vw,5.2rem)] font-semibold">{s.h1}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-90">{s.intro}</p>
          <Link href={`${p}/contact?service=${service.slugs[locale]}`} className="mt-10 inline-flex items-center gap-2 rounded-full bg-night px-7 py-4 font-medium text-white transition-colors hover:bg-white hover:text-night">
            {t.quote} <ArrowUpRight size={18} className="rtl:-scale-x-100" />
          </Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <h2 className="text-3xl font-semibold text-indigo">{u.receive}</h2>
          <ul className="mt-6 space-y-2">
            {s.deliverables.map((d) => (
              <li key={d} className={`flex gap-3 rounded-2xl px-4 py-3 text-sm ${service.tone.tint}`}>
                <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />{d}
              </li>
            ))}
          </ul>
          <h2 className="mt-14 text-3xl font-semibold text-indigo">{u.audience}</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {s.useCases.map((x) => (<li key={x} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm">{x}</li>))}
          </ul>
        </section>
        <section className="lg:col-span-7">
          <h2 className="text-3xl font-semibold text-indigo">{u.process}</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {s.process.map((st, i) => (
              <li key={st.title} className="rounded-3xl bg-white p-6 ring-1 ring-line">
                <span className="num stroke-text text-5xl font-semibold [--stroke:var(--brand)]">{i + 1}</span>
                <h3 className="mt-3 font-semibold">{st.title}</h3>
                <p className="mt-1 text-sm text-soft">{st.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="bg-tint-violet">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <h2 className="text-3xl font-semibold text-indigo">{u.faq}</h2>
          <Accordion className="mt-8 rounded-3xl bg-white px-6">
            {s.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`}>
                <AccordionTrigger className="text-base font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-soft">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        {locale === "fr" && tools.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-indigo">{u.tools}</h2>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm">
              {tools.map((x) => (<li key={x.slug}><Link href={`/outils-gratuits/${x.slug}`} className="inline-block rounded-full bg-night px-4 py-2 text-white hover:bg-brand">{x.name}</Link></li>))}
            </ul>
          </div>
        )}
        {locale === "fr" && guides.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-indigo">{u.guides}</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {guides.map((g) => (<li key={g.slug}><Link href={`/blog/${g.slug}`} className="block rounded-2xl border border-line bg-white p-5 font-medium hover:border-brand">{g.title}</Link></li>))}
            </ul>
          </div>
        )}
        <h2 className="text-2xl font-semibold text-indigo">{u.others}</h2>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm">
          {others.map((r) => (<li key={r.id}><Link href={`${p}/services/${r.slugs[locale]}`} className={`inline-block rounded-full px-4 py-2 ${r.tone.bg} ${r.tone.fg}`}>{r[locale].name}</Link></li>))}
        </ul>
      </section>
    </>
  );
}
