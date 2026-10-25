import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SITE } from "@/lib/site";
import { HTML_LANG } from "@/lib/i18n";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { Tracker } from "@/components/site/tracker";
import { Suspense } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Art Visions Tunisie — Agence de création graphique et digitale", template: "%s" },
  description: "Logo, identité visuelle, supports imprimés et sites web pour les entreprises tunisiennes. Demandez votre devis gratuit.",
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  openGraph: { siteName: SITE.name, locale: "fr_TN", type: "website" },
};

export const viewport: Viewport = { themeColor: "#150933" };

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/brand/logo.svg`,
  areaServed: "TN",
  email: SITE.email,
};

export default function FrLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={HTML_LANG.fr} dir="ltr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <SmoothScroll />
        <Suspense fallback={null}><Tracker /></Suspense>
        <Header locale="fr" />
        <main className="flex-1">{children}</main>
        <Footer locale="fr" />
      </body>
    </html>
  );
}
