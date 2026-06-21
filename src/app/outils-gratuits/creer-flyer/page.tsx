import type { Metadata } from "next";
import { getTool, toolUrl } from "@/lib/tools";
import ToolPageFrame from "@/components/tools/ToolPageFrame";
import FlyerCreator from "./FlyerCreator";

const tool = getTool("creer-flyer")!;
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
          <h2 className="text-xl font-sora font-bold text-white">Créer un flyer efficace</h2>
          <p>
            Un flyer percutant repose sur une hiérarchie claire : un titre fort, une offre visible, les informations
            essentielles (date, lieu, contact) et un appel à l'action. Choisissez un modèle adapté à votre objectif —
            promotion, ouverture, événement ou nouveauté — et personnalisez les couleurs à votre image.
          </p>
          <p>
            Téléchargez votre flyer en PNG pour le partager sur les réseaux ou en PDF pour l'impression. Pour un rendu
            100% professionnel et une impression de qualité, confiez la finition à Art Vision.
          </p>
        </>
      }
    >
      <FlyerCreator />
    </ToolPageFrame>
  );
}
