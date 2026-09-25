import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Wrench, Briefcase } from "lucide-react";

export interface ClusterLinkItem {
  title: string;
  href: string;
  description?: string;
  badge?: string;
}

interface InternalLinksClusterProps {
  categoryTitle?: string;
  services?: ClusterLinkItem[];
  blogArticles?: ClusterLinkItem[];
  tools?: ClusterLinkItem[];
  className?: string;
}

export default function InternalLinksCluster({
  categoryTitle = "Découvrir aussi dans cet univers",
  services = [],
  blogArticles = [],
  tools = [],
  className = "",
}: InternalLinksClusterProps) {
  const hasContent = services.length > 0 || blogArticles.length > 0 || tools.length > 0;
  if (!hasContent) return null;

  return (
    <section className={`pt-12 border-t border-brand-purple/15 space-y-8 ${className}`}>
      <div className="space-y-1">
        <span className="text-[11px] uppercase font-bold tracking-widest text-brand-magenta">Maillage & Écosystème</span>
        <h3 className="font-montserrat font-bold text-xl md:text-2xl text-white">{categoryTitle}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.length > 0 && (
          <div className="bg-[#1A1238]/40 border border-brand-purple/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider">
              <Briefcase size={16} />
              <span>Services complémentaires</span>
            </div>
            <ul className="space-y-2.5">
              {services.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group block p-2.5 rounded-xl hover:bg-brand-purple/20 transition border border-transparent hover:border-brand-purple/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-brand-orange transition">
                        {item.title}
                      </span>
                      <ArrowRight size={13} className="text-white/40 group-hover:text-brand-orange transition-transform group-hover:translate-x-1 shrink-0" />
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-white/50 line-clamp-1 mt-1">{item.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {blogArticles.length > 0 && (
          <div className="bg-[#1A1238]/40 border border-brand-purple/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-brand-magenta text-xs font-bold uppercase tracking-wider">
              <BookOpen size={16} />
              <span>Guides & Conseils Blog</span>
            </div>
            <ul className="space-y-2.5">
              {blogArticles.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group block p-2.5 rounded-xl hover:bg-brand-purple/20 transition border border-transparent hover:border-brand-purple/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-brand-magenta transition">
                        {item.title}
                      </span>
                      <ArrowRight size={13} className="text-white/40 group-hover:text-brand-magenta transition-transform group-hover:translate-x-1 shrink-0" />
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-white/50 line-clamp-1 mt-1">{item.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tools.length > 0 && (
          <div className="bg-[#1A1238]/40 border border-brand-purple/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <Wrench size={16} />
              <span>Outils Gratuits Utiles</span>
            </div>
            <ul className="space-y-2.5">
              {tools.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group block p-2.5 rounded-xl hover:bg-brand-purple/20 transition border border-transparent hover:border-brand-purple/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-purple-300 transition">
                        {item.title}
                      </span>
                      <ArrowRight size={13} className="text-white/40 group-hover:text-purple-300 transition-transform group-hover:translate-x-1 shrink-0" />
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-white/50 line-clamp-1 mt-1">{item.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
