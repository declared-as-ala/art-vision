import type { Metadata } from "next";
import { getTool, toolUrl } from "@/lib/tools";
import ToolPageFrame from "@/components/tools/ToolPageFrame";
import LogoBriefGenerator from "./LogoBriefGenerator";

const tool = getTool("generateur-brief-logo")!;
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
          <h2 className="text-xl font-sora font-bold text-white">Pourquoi rédiger un brief de logo ?</h2>
          <p>
            Un brief clair est la clé d'un logo réussi. Il évite les allers-retours en alignant le designer sur votre
            secteur, votre cible, la personnalité de votre marque et vos préférences de style et de couleurs. Résultat :
            un projet plus rapide et une création fidèle à votre vision.
          </p>
          <p>
            Répondez aux quelques étapes de ce questionnaire, téléchargez votre brief professionnel en PDF, puis
            envoyez-le à Art Vision pour recevoir une proposition de création de logo.
          </p>
        </>
      }
    >
      <LogoBriefGenerator />
    </ToolPageFrame>
  );
}
