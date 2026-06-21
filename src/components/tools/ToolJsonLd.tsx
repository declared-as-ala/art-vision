import { ToolDef, toolUrl } from "@/lib/tools";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";

// Emits BreadcrumbList + FAQPage + WebApplication structured data for a tool.
export default function ToolJsonLd({ tool }: { tool: ToolDef }) {
  const url = `${BASE}${toolUrl(tool.slug)}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
        { "@type": "ListItem", position: 2, name: "Outils gratuits", item: `${BASE}/outils-gratuits` },
        { "@type": "ListItem", position: 3, name: tool.title, item: url },
      ],
    },
    {
      "@type": "WebApplication",
      name: `${tool.title} | Art Vision`,
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      description: tool.seoDescription,
      inLanguage: "fr",
    },
  ];

  if (tool.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: tool.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
