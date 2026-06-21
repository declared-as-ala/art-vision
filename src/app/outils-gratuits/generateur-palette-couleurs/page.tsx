import type { Metadata } from "next";
import { getTool, toolUrl } from "@/lib/tools";
import ToolPageFrame from "@/components/tools/ToolPageFrame";
import PaletteGenerator from "./PaletteGenerator";

const tool = getTool("generateur-palette-couleurs")!;
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
          <h2 className="text-xl font-sora font-bold text-white">Comment choisir les couleurs de votre marque ?</h2>
          <p>
            Une bonne palette repose sur l'équilibre : une couleur primaire forte qui porte votre identité, une
            secondaire pour la nuance, une couleur d'accent pour les appels à l'action, et des neutres pour le texte
            et les fonds. La vérification du contraste garantit que vos textes restent lisibles par tous, conformément
            aux recommandations d'accessibilité WCAG.
          </p>
          <p>
            Importez votre logo pour extraire automatiquement ses couleurs dominantes, ou partez d'une teinte de base
            pour générer une harmonie complète. Exportez ensuite votre nuancier en PNG ou PDF pour le partager avec
            votre équipe ou votre imprimeur.
          </p>
        </>
      }
    >
      <PaletteGenerator />
    </ToolPageFrame>
  );
}
