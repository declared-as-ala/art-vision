import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprimerie en Ligne & Impression Professionnelle | Art Vision",
  description:
    "Impression professionnelle au meilleur prix : cartes de visite, flyers, affiches, dépliants, brochures, bâches, roll-up et panneaux. Contrôle PAO gratuit et livraison rapide.",
  alternates: {
    canonical: "https://art-visions.fr/impression",
  },
  openGraph: {
    title: "Imprimerie en Ligne & Impression Professionnelle | Art Vision",
    description:
      "Tous vos supports de communication imprimés en atelier haute définition : cartes de visite, flyers, affiches, bâches et signalétique.",
    url: "https://art-visions.fr/impression",
    type: "website",
    images: [{ url: "https://art-visions.fr/logo.png" }],
  },
};

export default function ImpressionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://art-visions.fr" },
          { "@type": "ListItem", position: 2, name: "Impression", item: "https://art-visions.fr/impression" },
        ],
      },
      {
        "@type": "Service",
        name: "Impression Professionnelle & Imprimerie en Ligne",
        provider: {
          "@type": "Organization",
          name: "Art Vision",
          url: "https://art-visions.fr",
          logo: "https://art-visions.fr/logo.png",
        },
        description:
          "Impression publicitaire et papeterie d'entreprise : cartes de visite, flyers, dépliants, affiches grand format, bâches et roll-up.",
        areaServed: ["France", "Belgique"],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
