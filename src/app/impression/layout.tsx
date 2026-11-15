import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impression : cartes de visite, flyers, bâches — tarifs HT | Art Vision",
  description:
    "Catalogue d'impression Art Vision : cartes de visite, flyers, dépliants, bâches, roll-up et panneaux. Tarifs HT par format et quantité, commande avec votre fichier ou création graphique sur devis.",
  alternates: {
    canonical: "https://art-visions.fr/impression",
  },
  openGraph: {
    title: "Impression : cartes de visite, flyers, bâches — tarifs HT | Art Vision",
    description:
      "Choisissez votre support, consultez les tarifs HT et commandez avec votre fichier ou demandez une création graphique.",
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
