"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SERVICES } from "@/content/services";
import { DICT, type Locale } from "@/lib/i18n";

/** Maps the current URL to its equivalent in the other language (only where a real translation exists). */
function counterpart(path: string, locale: Locale): string {
  if (locale === "fr") {
    const m = path.match(/^\/services\/([^/]+)$/);
    if (m) {
      const s = SERVICES.find((x) => x.slugs.fr === m[1]);
      if (s) return `/ar/services/${s.slugs.ar}`;
    }
    if (path === "/services") return "/ar/services";
    if (path === "/contact") return "/ar/contact";
    return "/ar";
  }
  const rest = path.replace(/^\/ar/, "") || "/";
  const m = rest.match(/^\/services\/([^/]+)$/);
  if (m) {
    const s = SERVICES.find((x) => x.slugs.ar === m[1]);
    if (s) return `/services/${s.slugs.fr}`;
  }
  if (rest === "/services" || rest === "/contact") return rest;
  return "/";
}

export function LangSwitch({ locale }: { locale: Locale }) {
  const path = usePathname();
  const t = DICT[locale];
  const other: Locale = locale === "fr" ? "ar" : "fr";
  return (
    <Link
      href={counterpart(path, locale)}
      hrefLang={other}
      lang={other}
      aria-label={t.switchLabel}
      className="rounded-full border border-white/25 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-white hover:text-white"
    >
      {t.switchTo}
    </Link>
  );
}
