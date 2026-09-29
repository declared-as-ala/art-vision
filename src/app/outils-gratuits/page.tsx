import type { Metadata } from "next";
import Link from "next/link";
import { Gift, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { toolsByOrder } from "@/lib/tools";
import OutilsGrid from "./OutilsGrid";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";

export const metadata: Metadata = {
  title: "Outils gratuits pour entrepreneurs, impression et marketing | Art Visions",
  description:
    "25 outils gratuits Art Visions pour créer menus, cartes de fidélité, QR codes, visuels, signatures e-mail, gabarits d'impression, briefs et contenus marketing.",
  alternates: { canonical: `${BASE}/outils-gratuits` },
  openGraph: {
    title: "Outils gratuits pour entrepreneurs, impression et marketing | Art Visions",
    description:
      "Une boîte à outils gratuite pour entrepreneurs, restaurants, boutiques, freelances et entreprises : impression, identité visuelle, réseaux sociaux et web.",
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
        name: "Outils gratuits Art Visions",
        itemListElement: toolsByOrder.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.title,
          url: `${BASE}/outils-gratuits/${tool.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="hero-gradient min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mx-auto max-w-7xl px-4 pb-12 pt-36 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-brand-purple/30 bg-brand-purple/25 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-white">
          <Sparkles size={13} className="text-brand-orange" />
          Boîte à outils créative
        </div>
        <h1 className="mx-auto max-w-4xl font-montserrat text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl">
          Des outils <span className="text-brand-magenta">gratuits</span> pour donner vie à votre marque
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/65">
          Art Visions met à disposition des entrepreneurs, restaurants, commerces, freelances et entreprises
          une suite d'outils gratuits pour préparer vos supports d'impression, votre identité visuelle, vos
          contenus marketing et vos briefs web. Créez, prévisualisez et exportez sans inscription.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {[
            { icon: Gift, label: "100% gratuit" },
            { icon: Zap, label: "Résultat instantané" },
            { icon: ShieldCheck, label: "Sans inscription" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/70">
              <Icon size={13} className="text-brand-magenta" /> {label}
            </span>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <OutilsGrid />
      </main>

      <section className="mx-auto max-w-3xl space-y-4 px-4 pb-20 text-sm leading-relaxed text-white/65 sm:px-6 lg:px-8">
        <h2 className="font-montserrat text-2xl font-extrabold text-white">
          Une suite d'outils pensée par une agence créative
        </h2>
        <p>
          Chez <strong className="text-white">Art Visions</strong>, nous accompagnons chaque jour des entrepreneurs,
          commerçants et indépendants dans la création de leur image de marque. Ces outils gratuits sont une porte
          d'entrée : ils vous permettent d'obtenir rapidement un résultat exploitable, qu'il s'agisse d'un menu de
          restaurant, d'une carte de fidélité, d'une affiche QR code, d'un visuel produit ou d'un brief de site web.
        </p>
        <p>
          Besoin d'aller plus loin ? Notre studio propose la{" "}
          <Link href="/creation-logo-professionnel" className="text-brand-orange underline">création de logo</Link>,
          l'<Link href="/identite-visuelle" className="text-brand-orange underline">identité visuelle</Link>, le{" "}
          <Link href="/design-graphique" className="text-brand-orange underline">design graphique</Link>, la{" "}
          <Link href="/community-management" className="text-brand-orange underline">gestion des réseaux sociaux</Link> et l'
          <Link href="/impression" className="text-brand-orange underline">impression</Link>.
        </p>
      </section>
    </div>
  );
}
