import type { Metadata } from "next";
import { getTool, toolUrl } from "@/lib/tools";
import ToolJsonLd from "@/components/tools/ToolJsonLd";
import ToolFooter from "@/components/tools/ToolFooter";
import CVGenerator from "@/app/cv-modeles-gratuits/page";

const tool = getTool("cv-gratuit")!;
const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  alternates: { canonical: `${BASE}${toolUrl(tool.slug)}` },
  openGraph: { title: tool.seoTitle, description: tool.seoDescription, url: `${BASE}${toolUrl(tool.slug)}`, type: "website" },
};

export default function Page() {
  return (
    <div className="hero-gradient min-h-screen">
      <ToolJsonLd tool={tool} />
      <CVGenerator />
      <ToolFooter
        tool={tool}
        seoContent={
          <>
            <h2 className="text-xl font-sora font-bold text-white">Créer un CV professionnel gratuitement</h2>
            <p>
              Un bon CV est clair, structuré et adapté à votre métier. Renseignez votre parcours, vos compétences et
              vos projets, choisissez un modèle et une couleur d'accent, puis téléchargez votre CV au format PDF en un
              clic. Tout est gratuit et sans inscription.
            </p>
            <p>
              Besoin d'un CV au design vraiment distinctif, d'un portfolio ou d'une identité visuelle complète ? Le
              studio Art Vision peut concevoir des documents sur mesure qui font la différence.
            </p>
          </>
        }
      />
    </div>
  );
}
