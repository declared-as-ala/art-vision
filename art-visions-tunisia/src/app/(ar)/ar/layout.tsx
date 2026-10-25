import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { SITE } from "@/lib/site";
import { HTML_LANG } from "@/lib/i18n";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { Tracker } from "@/components/site/tracker";
import { Suspense } from "react";

const arabic = IBM_Plex_Sans_Arabic({ variable: "--font-arabic", subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Art Visions تونس — وكالة تصميم جرافيك ورقمنة", template: "%s" },
  description: "شعارات وهوية بصرية ومطبوعات ومواقع إلكترونية للشركات التونسية. اطلبوا عرض سعر مجاني.",
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  openGraph: { siteName: SITE.name, locale: "ar_TN", type: "website" },
};

export const viewport: Viewport = { themeColor: "#150933" };

export default function ArLayout({ children }: LayoutProps<"/ar">) {
  return (
    <html lang={HTML_LANG.ar} dir="rtl" className={`${arabic.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SmoothScroll />
        <Suspense fallback={null}><Tracker /></Suspense>
        <Header locale="ar" />
        <main className="flex-1">{children}</main>
        <Footer locale="ar" />
      </body>
    </html>
  );
}
