import type { Metadata } from "next";
import { getTool, toolUrl } from "@/lib/tools";
import ToolPageFrame from "@/components/tools/ToolPageFrame";
import SloganGenerator from "./SloganGenerator";

const tool = getTool("generateur-slogan")!;
const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  alternates: { canonical: `${BASE}${toolUrl(tool.slug)}` },
  openGraph: { title: tool.seoTitle, description: tool.seoDescription, url: `${BASE}${toolUrl(tool.slug)}`, type: "website" },
};

export default function Page() {
  return (
    <ToolPageFrame
      tool={tool}
      seoContent={
        <>
          <h2 className="text-xl font-sora font-bold text-white">Qu'est-ce qu'un bon slogan ?</h2>
          <p>
            Un slogan efficace est court, mémorable et résume la promesse de votre marque. Il renforce votre
            positionnement et facilite la mémorisation. Le ton — premium, amical, audacieux — doit refléter la
            personnalité de votre entreprise et parler à votre cible.
          </p>
          <p>
            Notre générateur compose des propositions à partir de structures publicitaires éprouvées, enrichies par
            l'IA lorsqu'une clé est configurée. Sélectionnez vos favoris, copiez-les, et confiez la création de votre
            identité de marque complète à Art Vision pour aller plus loin.
          </p>
        </>
      }
    >
      <SloganGenerator />
    </ToolPageFrame>
  );
}
