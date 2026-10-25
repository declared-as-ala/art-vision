import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { getDb } from "@/lib/db";
import Image from "next/image";
import { SERVICES } from "@/content/services";
import { DICT, prefix, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";

async function NavPages() {
  await connection();
  let pages: { slug: string; title: string }[] = [];
  try {
    pages = await getDb().page.findMany({ where: { kind: "page", navVisible: true, lang: "fr", noindex: false, status: "PUBLISHED" }, select: { slug: true, title: true }, orderBy: { title: "asc" }, take: 8 });
  } catch { /* DB unavailable: render nothing */ }
  return <>{pages.map((p) => (<li key={p.slug}><Link href={`/${p.slug}`} className="text-white/70 hover:text-white">{p.title}</Link></li>))}</>;
}

export function Footer({ locale }: { locale: Locale }) {
  const t = DICT[locale];
  const p = prefix(locale);
  return (
    <footer className="relative overflow-hidden bg-night text-white">
      <Image src="/brand/logo-mark.svg" alt="" width={280} height={400} aria-hidden="true" className="pointer-events-none absolute -bottom-24 end-0 h-[26rem] w-auto opacity-[0.06]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-3xl font-semibold tracking-tight">Art Visions</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">{t.footerTag}</p>
          <a href={`mailto:${SITE.email}`} className="num mt-6 inline-block text-sm text-white underline decoration-brand underline-offset-4">
            {SITE.email}
          </a>
        </div>
        <div>
          <p className="num text-xs uppercase tracking-widest text-copper">{t.footerServices}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link href={`${p}/services/${s.slugs[locale]}`} className="text-white/70 hover:text-white">{s[locale].name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="num text-xs uppercase tracking-widest text-copper">{t.footerAgency}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href={`${p}/services`} className="text-white/70 hover:text-white">{t.allServices}</Link></li>
            {locale === "fr" && (
              <>
                <li><Link href="/portfolio" className="text-white/70 hover:text-white">{t.nav.portfolio}</Link></li>
                <li><Link href="/outils-gratuits" className="text-white/70 hover:text-white">{t.nav.tools}</Link></li>
                <li><Link href="/blog" className="text-white/70 hover:text-white">{t.nav.blog}</Link></li>
              </>
            )}
            {locale === "fr" && <Suspense fallback={null}><NavPages /></Suspense>}
            <li><Link href={`${p}/contact`} className="text-white/70 hover:text-white">{t.quote}</Link></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-line-dark">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-white/40 sm:px-8">© Art Visions. {t.rights}</p>
      </div>
    </footer>
  );
}
