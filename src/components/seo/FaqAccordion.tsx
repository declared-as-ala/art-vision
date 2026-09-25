import React from "react";
import { HelpCircle, ChevronRight } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
  className?: string;
  emitSchema?: boolean;
}

export default function FaqAccordion({
  title = "Questions Fréquentes",
  subtitle = "Tout ce que vous devez savoir avant de lancer votre projet.",
  items,
  className = "",
  emitSchema = true,
}: FaqAccordionProps) {
  if (!items || items.length === 0) return null;

  const faqSchema = emitSchema
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <section className={`space-y-6 pt-12 border-t border-brand-purple/15 ${className}`}>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-white flex items-center justify-center gap-2.5">
          <HelpCircle size={24} className="text-brand-magenta shrink-0" />
          <span>{title}</span>
        </h2>
        {subtitle && <p className="text-xs sm:text-sm text-white/60">{subtitle}</p>}
      </div>

      <div className="space-y-3.5 max-w-3xl mx-auto">
        {items.map((faq, idx) => (
          <details
            key={idx}
            className="group rounded-2xl border border-brand-purple/20 bg-[#1A1238]/40 p-5 backdrop-blur-sm transition hover:border-brand-magenta/30"
          >
            <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-white list-none select-none">
              <span className="pr-4">{faq.question}</span>
              <ChevronRight
                size={16}
                className="text-brand-magenta shrink-0 transition-transform duration-200 group-open:rotate-90"
              />
            </summary>
            <div className="mt-3.5 pt-3.5 border-t border-brand-purple/15 text-xs sm:text-sm text-white/75 leading-relaxed whitespace-pre-line">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
