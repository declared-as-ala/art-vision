import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GoogleTrackers from "@/components/trackers/GoogleTrackers";
import PublicShell from "@/components/PublicShell";
import prisma from "@/lib/prisma";

const futuraBook = localFont({
  src: "./fonts/Futura-Book Book.ttf",
  variable: "--font-futura-book",
});

const futuraLight = localFont({
  src: "./fonts/Futura Light.otf",
  variable: "--font-futura-light",
});

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr");
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    const seo = await prisma.sEOSettings.findUnique({ where: { id: "default" } });
    
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
    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    gaId = settings?.googleAnalyticsId || "";
    gtmId = settings?.googleTagManagerId || "";
  } catch (e) {
    // Fail silently in build phase
  }

  return (
    <html lang="fr" className={`${futuraBook.variable} ${futuraLight.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col hero-gradient text-brand-white">
        <GoogleTrackers gaId={gaId} gtmId={gtmId} />
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
