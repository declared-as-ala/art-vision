import type { Metadata } from "next";
import ProductPageView from "@/components/impression/ProductPageView";

const faqItems = [
  {
    question: "Quels fichiers sont acceptés pour l'impression de flyers ?",
    answer: "Nous acceptons les fichiers PDF, JPG, TIF, EPS, AI et BMP. Les textes des fichiers EPS et AI doivent être vectorisés.",
  },
  {
    question: "Quelle qualité faut-il prévoir ?",
    answer: "Les fichiers doivent idéalement être en 300 DPI et en couleurs CMJN pour limiter les écarts de rendu à l'impression.",
  },
  {
    question: "Quels sont les délais de production ?",
    answer: "Le délai standard est de 2 jours ouvrables. Les vernis et pelliculages ajoutent généralement 2 jours ouvrables. La livraison prend 1 à 3 jours ouvrables.",
  },
  {
    question: "Faut-il ajouter des bords perdus ?",
    answer: "Oui. Prévoyez idéalement 2 mm de bord perdu et placez les textes à au moins 3 mm de chaque bord.",
  },
  {
    question: "Les prix affichés incluent-ils la TVA ?",
    answer: "Non. Les prix de chaque tableau sont affichés hors TVA.",
  },
];

export const metadata: Metadata = {
  title: "Impression flyers personnalisés | Tarifs flyers Art Vision",
  description:
    "Impression de flyers recto verso : tarifs par papier, formats A7, A6, A5, A4, carrés et ronds, fichiers 300 DPI CMJN, production rapide et devis sur mesure.",
  alternates: {
    canonical: "/impression/flyers",
  },
  openGraph: {
    title: "Impression flyers personnalisés | Art Vision",
    description:
      "Comparez les prix d'impression de flyers par grammage, format et quantité. Tables de prix HT et demande de devis rapide.",
    url: "/impression/flyers",
    type: "website",
  },
};

export default function FlyersPage() {
  return <ProductPageView slug="flyers" extraFaqs={faqItems} />;
}
