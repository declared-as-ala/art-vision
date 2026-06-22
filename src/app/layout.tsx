import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GoogleTrackers from "@/components/trackers/GoogleTrackers";
import PublicShell from "@/components/PublicShell";
import NavigationProgress from "@/components/NavigationProgress";
import prisma from "@/lib/prisma";
import { cached } from "@/lib/cache";

// Cache the singletons read on every page (rarely change) for 60s.
const getSettings = () =>
  cached("siteSettings", 60_000, () => prisma.siteSettings.findUnique({ where: { id: "default" } }));
const getSeo = () =>
  cached("seoSettings", 60_000, () => prisma.sEOSettings.findUnique({ where: { id: "default" } }));

const futuraBook = localFont({
  src: "./fonts/Futura-Book Book.ttf",
  variable: "--font-futura-book",
});

const futuraLight = localFont({
  src: "./fonts/Futura Light.otf",
  variable: "--font-futura-light",
});

export async function generateMetadata(): Promise<Metadata> {
  // Tolerate NEXT_PUBLIC_APP_URL set without a protocol (e.g. "site.vercel.app").
  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";
  const appUrl = /^https?:\/\//.test(rawAppUrl) ? rawAppUrl : `https://${rawAppUrl}`;
  let metadataBase: URL;
  try {
    metadataBase = new URL(appUrl);
  } catch {
    metadataBase = new URL("https://art-visions.fr");
  }
  try {
    const [settings, seo] = await Promise.all([getSettings(), getSeo()]);

    return {
      metadataBase,
      title: {
        default: seo?.globalTitle || "Art Vision | Agence graphique & Studio créatif en France",
        template: `%s - Art Vision`
      },
      description: seo?.globalDesc || settings?.slogan || "Art Vision est une agence de communication visuelle spécialisée en design graphique, branding, logo, vidéo, 3D, impression.",
      verification: {
        google: seo?.googleSearchCons || undefined,
      }
    };
  } catch (error) {
    return {
      metadataBase,
      title: "Art Vision | Agence graphique & Studio créatif en France",
      description: "Art Vision est une agence de communication visuelle spécialisée en design graphique, branding, logo, vidéo, 3D, impression.",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let gaId = "";
  let gtmId = "";
  try {
    const settings = await getSettings();
    gaId = settings?.googleAnalyticsId || "";
    gtmId = settings?.googleTagManagerId || "";
  } catch (e) {
    // Fail silently in build phase
  }

  return (
    <html lang="fr" className={`${futuraBook.variable} ${futuraLight.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col hero-gradient text-brand-white">
        <NavigationProgress />
        <GoogleTrackers gaId={gaId} gtmId={gtmId} />
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
