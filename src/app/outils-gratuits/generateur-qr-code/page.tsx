import type { Metadata } from "next";
import { getTool, toolUrl } from "@/lib/tools";
import ToolPageFrame from "@/components/tools/ToolPageFrame";
import QrGenerator from "./QrGenerator";

const tool = getTool("generateur-qr-code")!;
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
          <h2 className="text-xl font-sora font-bold text-white">À quoi sert un QR code pour votre entreprise ?</h2>
          <p>
            Un QR code relie instantanément vos supports physiques (carte de visite, vitrine, flyer, packaging) à
            votre univers digital : site web, page WhatsApp, compte Instagram, menu en ligne ou fiche contact. C'est
            un outil simple et économique pour générer du trafic et faciliter le contact.
          </p>
          <p>
            Avec ce générateur gratuit, personnalisez les couleurs aux teintes de votre marque, ajoutez votre logo
            au centre et téléchargez un fichier vectoriel SVG haute définition, idéal pour l'impression grand format.
          </p>
        </>
      }
    >
      <QrGenerator />
    </ToolPageFrame>
  );
}
