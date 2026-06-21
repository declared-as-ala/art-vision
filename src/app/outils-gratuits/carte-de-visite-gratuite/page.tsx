import type { Metadata } from "next";
import { getTool, toolUrl } from "@/lib/tools";
import ToolJsonLd from "@/components/tools/ToolJsonLd";
import ToolFooter from "@/components/tools/ToolFooter";
import BusinessCardGenerator from "@/app/carte-de-visite-gratuite/page";

const tool = getTool("carte-de-visite-gratuite")!;
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
      <BusinessCardGenerator />
      <ToolFooter
        tool={tool}
        seoContent={
          <>
            <h2 className="text-xl font-sora font-bold text-white">Créer une carte de visite professionnelle</h2>
            <p>
              Votre carte de visite est souvent le premier contact physique avec un client. Soignez-la : logo, QR code
              vCard, coordonnées claires et couleurs cohérentes avec votre marque. Cet outil génère une carte au format
              standard 85×55 mm, prête pour l'impression, exportable en PNG ou PDF.
            </p>
            <p>
              Pour une impression haut de gamme (papier 350g, pelliculage soft touch, vernis sélectif), confiez la
              production à Art Vision et recevez des cartes à la hauteur de votre image.
            </p>
          </>
        }
      />
    </div>
  );
}
