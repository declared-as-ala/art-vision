import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Zap, ShieldCheck, Gift } from "lucide-react";
import { toolsByOrder } from "@/lib/tools";
import OutilsGrid from "./OutilsGrid";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";

export const metadata: Metadata = {
  title: "Outils gratuits pour CV, carte de visite, QR code et design | Art Vision",
  description:
    "10 outils gratuits Art Vision : générateur de CV, carte de visite, QR code, palette de couleurs, slogan, bio Instagram, flyer et calculateur d'impression. Sans inscription.",
  alternates: { canonical: `${BASE}/outils-gratuits` },
  openGraph: {
    title: "Outils gratuits pour CV, carte de visite, QR code et design | Art Vision",
    description:
      "10 outils gratuits pour créer CV, cartes de visite, QR codes, palettes, slogans, bios Instagram, flyers et estimer vos impressions.",
    url: `${BASE}/outils-gratuits`,
    type: "website",
  },
};

export default function OutilsGratuitsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
          { "@type": "ListItem", position: 2, name: "Outils gratuits", item: `${BASE}/outils-gratuits` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Outils gratuits Art Vision",
        itemListElement: toolsByOrder.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.title,
          url: `${BASE}/outils-gratuits/${t.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="hero-gradient min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 text-center">
        <div className="inline-flex items-center gap-1.5 bg-brand-purple/25 border border-brand-purple/30 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wider text-brand-white uppercase mb-6">
          <Sparkles size={13} className="text-brand-orange" />
          Boîte à outils créative
        </div>
        <h1 className="text-4xl md:text-6xl font-sora font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.05]">
          Des outils <span className="text-brand-magenta">gratuits</span> pour donner vie à votre marque
        </h1>
        <p className="text-white/65 max-w-2xl mx-auto mt-5 text-base leading-relaxed">
          Créez vos CV, cartes de visite, QR codes, palettes de couleurs, slogans, contenus Instagram,
          flyers et estimez vos impressions — en quelques clics, sans inscription. Et quand vous voudrez
          passer au niveau supérieur, le studio Art Vision sera là.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-7">
          {[
            { icon: Gift, label: "100% gratuit" },
            { icon: Zap, label: "Résultat instantané" },
            { icon: ShieldCheck, label: "Sans inscription" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 bg-white/5 border border-white/10 px-3.5 py-2 rounded-full"
            >
              <Icon size={13} className="text-brand-magenta" /> {label}
            </span>
          ))}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <OutilsGrid />
      </main>

      {/* SEO content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-sm text-white/65 leading-relaxed space-y-4">
        <h2 className="text-2xl font-sora font-extrabold text-white">
          Une suite d'outils pensée par une agence créative
        </h2>
        <p>
          Chez <strong className="text-white">Art Vision</strong>, nous accompagnons chaque jour des entrepreneurs,
          commerçants et indépendants dans la création de leur image de marque. Ces outils gratuits sont une porte
          d'entrée : ils vous permettent d'obtenir rapidement un résultat professionnel, que ce soit un CV soigné,
          une carte de visite élégante, un QR code à vos couleurs ou une palette cohérente pour votre identité.
        </p>
        <p>
          Besoin d'aller plus loin ? Notre studio propose la <Link href="/creation-logo-professionnel" className="text-brand-orange underline">création de logo</Link>,
          l'<Link href="/identite-visuelle" className="text-brand-orange underline">identité visuelle</Link>, le{" "}
          <Link href="/design-graphique" className="text-brand-orange underline">design graphique</Link>, la{" "}
          <Link href="/community-management" className="text-brand-orange underline">gestion des réseaux sociaux</Link> et l'
          <Link href="/impression" className="text-brand-orange underline">impression</Link>.
        </p>
      </section>
    </div>
  );
}
