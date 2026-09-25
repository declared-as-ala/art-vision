import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://art-visions.fr";

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [{ name: "Accueil", url: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? (item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`) : undefined,
    })),
  };

  return (
    <nav aria-label="Fil d'Ariane" className={`text-xs text-white/50 flex flex-wrap items-center gap-1.5 font-medium ${className}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {allItems.map((item, idx) => {
        const isLast = idx === allItems.length - 1;
        const isFirst = idx === 0;

        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight size={12} className="text-white/30 shrink-0" />}
            {isLast || !item.url ? (
              <span className="text-white font-semibold truncate max-w-[240px] sm:max-w-none">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className="hover:text-brand-magenta transition flex items-center gap-1 shrink-0"
              >
                {isFirst && <Home size={12} className="text-brand-magenta/80" />}
                <span>{item.name}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
