import type { Metadata } from "next";
import { ServicesIndex } from "@/components/site/services-pages";
import { alternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services de création graphique et digitale en Tunisie | Art Visions",
  description: "Création de logo, identité visuelle, supports imprimés et sites web pour entreprises tunisiennes. Découvrez nos services et demandez un devis.",
  alternates: alternates({ fr: "/services", ar: "/ar/services" }, "fr"),
};

export default function Page() {
  return <ServicesIndex locale="fr" />;
}
