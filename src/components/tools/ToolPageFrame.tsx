import Link from "next/link";
import { ChevronRight, Home, Sparkles } from "lucide-react";
import { ToolDef } from "@/lib/tools";
import ToolIcon from "./ToolIcon";
import ToolJsonLd from "./ToolJsonLd";
import ToolFooter from "./ToolFooter";

/**
 * Server-rendered chrome shared by every tool page:
 * breadcrumb → premium hero → interactive tool (children) → SEO content →
 * FAQ → CTA → related tools + structured data.
 */
export default function ToolPageFrame({
  tool,
  children,
  seoContent,
}: {
  tool: ToolDef;
  children: React.ReactNode;
  seoContent?: React.ReactNode;
}) {
  return (
    <div className="hero-gradient min-h-screen">
      <ToolJsonLd tool={tool} />

      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-2">
        <ol className="flex items-center gap-1.5 text-[11px] text-white/50 flex-wrap">
          <li>
            <Link href="/" className="hover:text-brand-magenta inline-flex items-center gap-1 transition">
              <Home size={11} /> Accueil
            </Link>
          </li>
          <ChevronRight size={11} className="opacity-40" />
          <li>
            <Link href="/outils-gratuits" className="hover:text-brand-magenta transition">
              Outils gratuits
            </Link>
          </li>
          <ChevronRight size={11} className="opacity-40" />
          <li className="text-white/80 font-semibold">{tool.title}</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 text-green-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            <Sparkles size={11} /> 100% Gratuit
          </span>
          <span className="bg-brand-purple/25 border border-brand-purple/30 text-white/70 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest">
            {tool.category}
          </span>
        </div>
        <div className="flex justify-center mb-4">
          <div className="p-3.5 rounded-2xl border border-white/10" style={{ background: `${tool.accent}22`, color: tool.accent }}>
            <ToolIcon name={tool.icon} size={30} />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-sora font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
          {tool.title}
        </h1>
        <p className="text-white/65 max-w-2xl mx-auto mt-4 text-sm md:text-base leading-relaxed">
          {tool.seoText}
        </p>
      </header>

      {/* Interactive tool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">{children}</section>

      <ToolFooter tool={tool} seoContent={seoContent} />
    </div>
  );
}
