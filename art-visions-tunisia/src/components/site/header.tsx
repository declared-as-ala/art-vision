import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { DICT, prefix, type Locale } from "@/lib/i18n";
import { LangSwitch } from "./lang-switch";

export function Header({ locale }: { locale: Locale }) {
  const t = DICT[locale];
  const p = prefix(locale);
  // Arabic currently covers home, services and contact; other sections are French-only.
  const links =
    locale === "fr"
      ? [
          { href: "/services", label: t.nav.services },
          { href: "/portfolio", label: t.nav.portfolio },
          { href: "/outils-gratuits", label: t.nav.tools },
          { href: "/blog", label: t.nav.blog },
        ]
      : [{ href: "/ar/services", label: t.nav.services }];

  return (
    <header className="sticky top-0 z-40 border-b border-line-dark bg-night text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href={p || "/"} aria-label="Art Visions" className="flex items-center gap-3">
          <Image src="/brand/logo-mark.svg" alt="" width={28} height={40} className="h-8 w-auto" priority />
          <span className="text-[15px] font-semibold tracking-tight">
            Art Visions <span className="num text-[11px] font-normal text-white/50">.TN</span>
          </span>
        </Link>

        <nav aria-label="Navigation" className="hidden items-center gap-1 text-sm md:flex">
          {links.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-white/70 transition-colors hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Suspense fallback={<span className="w-20" />}><LangSwitch locale={locale} /></Suspense>
          <Link href={`${p}/contact`} className="hidden rounded-full bg-brand px-4 py-2 text-sm font-medium transition-colors hover:bg-hot sm:block">
            {t.quote}
          </Link>
          {/* CSS-only mobile menu: no JS, works before hydration. */}
          <details className="group relative md:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/25 marker:hidden" aria-label="Menu">
              <Menu size={18} />
            </summary>
            <div className="absolute end-0 mt-3 w-64 rounded-2xl border border-line-dark bg-night p-2 shadow-2xl">
              {[...links, { href: `${p}/contact`, label: t.quote }].map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-xl px-4 py-3 text-sm text-white/85 hover:bg-white/10">
                  {n.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
