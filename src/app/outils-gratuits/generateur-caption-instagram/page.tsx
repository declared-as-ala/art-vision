import type { Metadata } from "next";
import { getTool, toolUrl } from "@/lib/tools";
import ToolPageFrame from "@/components/tools/ToolPageFrame";
import CaptionGenerator from "./CaptionGenerator";

const tool = getTool("generateur-caption-instagram")!;
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
          <h2 className="text-xl font-sora font-bold text-white">Des légendes Instagram qui engagent</h2>
          <p>
            Une bonne publication combine une accroche forte, un message clair et un appel à l'action. Les hashtags,
            eux, augmentent la portée : mélangez des termes larges et des hashtags de niche liés à votre activité et à
            votre ville pour toucher la bonne audience.
          </p>
          <p>
            Cet outil génère une légende, ses variantes courte et longue, plusieurs CTA et une sélection de 15 à 25
            hashtags. Pour des visuels et une ligne éditoriale cohérente, faites appel au studio Art Vision.
          </p>
        </>
      }
    >
      <CaptionGenerator />
    </ToolPageFrame>
  );
}
