import type { Metadata } from "next";
import { getTool, toolUrl } from "@/lib/tools";
import ToolPageFrame from "@/components/tools/ToolPageFrame";
import BioGenerator from "./BioGenerator";

const tool = getTool("generateur-bio-instagram")!;
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
          <h2 className="text-xl font-sora font-bold text-white">Réussir sa bio Instagram</h2>
          <p>
            La bio Instagram est votre carte de visite digitale : 150 caractères pour dire qui vous êtes, ce que vous
            proposez et inciter à passer à l'action. Une bonne bio combine clarté (activité + ville), preuve de valeur
            (services) et un appel à l'action vers votre lien.
          </p>
          <p>
            Utilisez le compteur de caractères pour rester dans la limite, activez les emojis pour aérer le texte, et
            confiez votre stratégie de contenu à Art Vision pour transformer vos visiteurs en clients.
          </p>
        </>
      }
    >
      <BioGenerator />
    </ToolPageFrame>
  );
}
