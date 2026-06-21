import type { Metadata } from "next";
import { getTool, toolUrl } from "@/lib/tools";
import ToolPageFrame from "@/components/tools/ToolPageFrame";
import PrintCalculator from "./PrintCalculator";

const tool = getTool("calculateur-impression")!;
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
          <h2 className="text-xl font-sora font-bold text-white">Combien coûte une impression professionnelle ?</h2>
          <p>
            Le prix d'une impression dépend de plusieurs facteurs : le produit (flyers, affiches, bâches, panneaux,
            catalogues, cartes de visite), le format, la quantité, le type de papier ou de support, la finition et
            l'impression recto ou recto-verso. Plus la quantité est importante, plus le coût unitaire baisse.
          </p>
          <p>
            Ce calculateur vous donne une fourchette de prix immédiate pour préparer votre budget. Pour un tarif ferme,
            demandez votre devis : Art Vision vous accompagne de la conception graphique à l'impression finale.
          </p>
        </>
      }
    >
      <PrintCalculator />
    </ToolPageFrame>
  );
}
