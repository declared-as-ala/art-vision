import Link from "next/link";
import { ChevronRight, ArrowRight, HelpCircle } from "lucide-react";
import { ToolDef, toolsByOrder, toolUrl } from "@/lib/tools";
import ToolIcon from "./ToolIcon";

// Shared bottom-of-page block: SEO content → FAQ → CTA → related tools.
// Used both by ToolPageFrame and by the CV / business-card wrapper pages.
export default function ToolFooter({
  tool,
  seoContent,
}: {
  tool: ToolDef;
  seoContent?: React.ReactNode;
}) {
  const related = toolsByOrder.filter((t) => t.slug !== tool.slug).slice(0, 3);

  return (
    <>
      {seoContent && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="space-y-4 text-white/70 text-sm leading-relaxed">{seoContent}</div>
        </section>
      )}

      {tool.faq.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-sora font-extrabold text-white mb-6 flex items-center gap-2">
            <HelpCircle size={22} className="text-brand-magenta" /> Questions fréquentes
          </h2>
          <div className="space-y-3">
            {tool.faq.map((f, i) => (
              <details key={i} className="group rounded-xl border border-brand-purple/20 bg-brand-purple-dark/40 px-5 py-4 backdrop-blur-sm">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-white list-none">
                  {f.question}
                  <ChevronRight size={16} className="text-brand-magenta transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-xs text-white/60 leading-relaxed mt-3">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-brand-magenta/25 p-8 md:p-10 text-center"
          style={{ background: "linear-gradient(135deg, rgba(108,43,217,0.25), rgba(215,40,136,0.18))" }}>
          <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-brand-magenta/20 blur-[90px]" aria-hidden />
          <h2 className="relative text-2xl md:text-3xl font-sora font-extrabold text-white max-w-2xl mx-auto leading-tight">
            {tool.cta.label}
          </h2>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={tool.cta.href} className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-3 rounded-full text-sm font-bold transition hover:scale-[1.02]">
              {tool.cta.label.length > 40 ? "Contacter Art Vision" : tool.cta.label}
              <ArrowRight size={16} />
            </Link>
            {tool.relatedServices.map((s) => (
              <Link key={s.href} href={s.href} className="inline-flex items-center gap-1.5 border border-white/15 hover:border-brand-magenta/40 text-white/80 hover:text-white px-4 py-3 rounded-full text-xs font-semibold transition">
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-xl font-sora font-extrabold text-white mb-5">Autres outils gratuits</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {related.map((t) => (
            <Link key={t.slug} href={toolUrl(t.slug)} className="group rounded-2xl border border-brand-purple/20 bg-brand-purple-dark/40 p-5 hover:border-brand-magenta/40 transition backdrop-blur-sm">
              <div className="inline-flex p-2.5 rounded-xl mb-3 border border-white/10" style={{ background: `${t.accent}22`, color: t.accent }}>
                <ToolIcon name={t.icon} size={20} />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-brand-magenta transition">{t.title}</h3>
              <p className="text-[11px] text-white/55 mt-1 leading-relaxed line-clamp-2">{t.shortDesc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
