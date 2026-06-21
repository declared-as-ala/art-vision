import React from "react";
import Link from "next/link";
import { Search, HelpCircle, ArrowRight, Home, Briefcase, PhoneCall } from "lucide-react";

export default function NotFound() {
  const serviceLinks = [
    { name: "Création de Logo", href: "/creation-logo-professionnel" },
    { name: "Identité Visuelle & Branding", href: "/identite-visuelle" },
    { name: "Vidéo & Motion Design", href: "/motion-design" },
    { name: "Rendu 3D & Packshot 3D", href: "/rendu-3d-produit" },
    { name: "Impression Grand Format", href: "/impression-grand-format" },
    { name: "Modélisation 3D", href: "/modelisation-3d" },
  ];

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8 glassmorphism rounded-3xl p-8 md:p-12 border border-brand-purple/20 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-magenta/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-purple/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="space-y-4">
          <span className="text-brand-orange font-sora font-black text-6xl md:text-8xl tracking-widest block animate-pulse">404</span>
          <h1 className="text-2xl md:text-3xl font-sora font-extrabold text-white tracking-tight leading-tight">
            Page introuvable
          </h1>
          <p className="text-sm text-white/70 max-w-md mx-auto">
            La page que vous recherchez a été déplacée, supprimée ou n'existe pas. Vous pouvez utiliser les raccourcis ci-dessous pour reprendre votre navigation.
          </p>
        </div>

        {/* Links to main services */}
        <div className="space-y-4 pt-6 border-t border-brand-purple/15">
          <h2 className="text-xs uppercase font-bold text-brand-magenta tracking-wider text-left">Nos services populaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {serviceLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="flex items-center justify-between p-3 rounded-xl bg-[#1A1238]/40 border border-brand-purple/10 hover:border-brand-magenta/40 transition text-xs text-white/80 hover:text-white font-medium"
              >
                <span>{link.name}</span>
                <ArrowRight size={12} className="text-brand-orange" />
              </Link>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Link
            href="/"
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition"
          >
            <Home size={14} />
            <span>Accueil</span>
          </Link>
          <Link
            href="/devis-sur-mesure"
            className="flex items-center space-x-2 bg-brand-orange hover:bg-brand-orange/95 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-brand-orange/15"
          >
            <Briefcase size={14} />
            <span>Demander un Devis</span>
          </Link>
          <Link
            href="/contact"
            className="flex items-center space-x-2 bg-brand-purple/20 hover:bg-brand-purple/35 border border-brand-purple/30 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition"
          >
            <PhoneCall size={14} />
            <span>Nous Contacter</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
