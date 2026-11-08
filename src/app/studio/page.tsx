import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Sparkles,
  CreditCard,
  FileText,
  Gift,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Truck,
  ArrowRight,
  Palette,
  Layers,
  Clock,
} from "lucide-react";
import { STUDIO_TEMPLATES } from "@/components/studio/StudioTemplates";

export const metadata: Metadata = {
  title: "Studio de création graphique en ligne | Art Vision",
  description:
    "Personnalisez gratuitement vos cartes de visite, flyers et supports de communication en ligne avec aperçu temps réel. Impression professionnelle et livraison rapide par Art Vision.",
  alternates: {
    canonical: "https://art-visions.fr/studio",
  },
  openGraph: {
    title: "Studio de création graphique en ligne | Art Vision",
    description:
      "Créez votre visuel en ligne, on s'occupe de l'impression professionnelle. Modèles personnalisables pour artisans, commerces, restaurants et indépendants.",
    url: "https://art-visions.fr/studio",
    type: "website",
  },
};

export default function StudioHubPage() {
  const products = [
    {
      id: "cartes-de-visite",
      slug: "cartes-de-visite",
      title: "Cartes de visite professionnelles",
      format: "85 × 55 mm",
      sides: "Recto / Verso",
      badge: "⭐ Le plus populaire",
      description:
        "Le support incontournable pour vos rendez-vous. Formats standard, papier 300g à 400g, finitions Soft-Touch et vernis sélectif.",
      image: "/images/impression/16-cartes-de-visite-art-vision.webp",
      icon: CreditCard,
      active: true,
      startingPrice: "Dès 46 € HT",
    },
    {
      id: "flyers",
      slug: "flyers",
      title: "Flyers & Prospectus publicitaires",
      format: "A5 (148 × 210 mm) & A6",
      sides: "Recto / Verso",
      badge: "Grand impact",
      description:
        "Faites la promotion de vos événements, ouvertures ou menus. Papiers couché brillant ou mat de 130g à 350g.",
      image: "/images/impression/29-flyers-art-vision.webp",
      icon: FileText,
      active: true,
      startingPrice: "Dès 49 € HT",
    },
    {
      id: "bons-cadeaux",
      slug: "cartes-de-visite", // shares the studio card engine
      title: "Bons & Chèques cadeaux",
      format: "210 × 100 mm & A6",
      sides: "Recto / Verso",
      badge: "Fêtes & Boutiques",
      description:
        "Idéal pour instituts, boutiques, restaurants et spas. Papier inscriptible pour montant et message personnalisé.",
      image: "/images/impression/17-cartes-de-voeux-art-vision.webp",
      icon: Gift,
      active: true,
      startingPrice: "Dès 55 € HT",
    },
  ];

  return (
    <main className="min-h-screen bg-[#070512] text-white pt-28 pb-20 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-brand-purple/20 rounded-full filter blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-1/4 w-[450px] h-[450px] bg-brand-magenta/15 rounded-full filter blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 1. HERO BANNER */}
        <section className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <Sparkles size={14} className="text-brand-orange" />
            <span>Nouveau • Studio de création en ligne</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-montserrat tracking-tight leading-tight">
            Créez votre visuel,{" "}
            <span className="bg-gradient-to-r from-brand-orange via-brand-magenta to-brand-purple bg-clip-text text-transparent">
              on s'occupe de l'impression.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Personnalisez un modèle ou laissez parler votre créativité. Ajoutez vos textes, votre logo et vos images,
            puis commandez votre support imprimé haute définition chez Art Vision.
          </p>

          {/* Principle highlight box */}
          <div className="inline-block bg-[#160f2e]/90 border border-brand-magenta/40 px-6 py-3 rounded-2xl shadow-xl shadow-brand-magenta/10">
            <p className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Création en ligne incluse avec votre commande d'impression chez Art Vision.</span>
            </p>
            <span className="text-[11px] text-white/50 block mt-0.5">
              Sans inscription préalable • Aperçu temps réel • Fichiers certifiés aux normes PAO
            </span>
          </div>
        </section>

        {/* 2. PRODUCT SELECTION GRID */}
        <section className="space-y-8">
          <div className="text-left space-y-2">
            <h2 className="text-2xl font-bold font-montserrat text-white">
              1. Choisissez votre support à personnaliser
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              Sélectionnez un produit ci-dessous pour lancer immédiatement l'éditeur interactif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="group relative rounded-3xl bg-[#0f0b24] border border-brand-purple/20 hover:border-brand-magenta/50 transition-all duration-300 p-6 flex flex-col justify-between hover:shadow-2xl hover:shadow-brand-purple/20 hover:-translate-y-1 text-left"
                >
                  <div className="space-y-4">
                    {/* Badge & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2.5 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                      <div className="p-2 rounded-xl bg-brand-purple/20 text-brand-magenta">
                        <Icon size={20} />
                      </div>
                    </div>

                    {/* Image Preview */}
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#160f2e] border border-white/5 p-3 flex items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold font-montserrat text-white group-hover:text-brand-magenta transition">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-brand-orange font-semibold mt-1">
                        <span>Format {p.format}</span>
                        <span>•</span>
                        <span>{p.sides}</span>
                      </div>
                      <p className="text-xs text-white/60 mt-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-brand-purple/15 mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-white/40 block">Tarif atelier :</span>
                      <strong className="text-sm font-extrabold text-white">{p.startingPrice}</strong>
                    </div>

                    <Link
                      href={`/studio/editor?product=${p.slug}`}
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-brand-orange/20"
                    >
                      <span>Personnaliser</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. READY-TO-USE TEMPLATES GALLERY */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
            <div>
              <span className="text-xs font-bold text-brand-magenta uppercase tracking-wider block">
                2. Démarrez en quelques secondes
              </span>
              <h2 className="text-2xl font-bold font-montserrat text-white mt-1">
                Ou partez directement d'un modèle adapté à votre métier
              </h2>
            </div>

            <Link
              href="/studio/editor?product=cartes-de-visite"
              className="text-xs font-bold text-brand-orange hover:text-white flex items-center gap-1 transition"
            >
              <span>+ Créer à partir d'une page blanche</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STUDIO_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-2xl bg-[#0f0b24] border border-brand-purple/20 hover:border-brand-orange p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-brand-orange/10 text-left space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white group-hover:text-brand-orange transition">
                    {tpl.name}
                  </span>
                  <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                    {tpl.categoryLabel}
                  </span>
                </div>

                {/* Mockup Card */}
                <div
                  className="w-full aspect-[85/55] rounded-xl border border-white/10 p-4 flex flex-col justify-between shadow-lg"
                  style={{ backgroundColor: tpl.design.recto.backgroundColor }}
                >
                  <div className="space-y-1">
                    <div
                      className="h-2.5 w-28 rounded-xs"
                      style={{
                        backgroundColor:
                          tpl.design.recto.elements.find((el) => el.type === "text")?.color || "#ffffff",
                      }}
                    />
                    <div className="h-1.5 w-36 bg-white/20 rounded-xs" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="h-1.5 w-20 bg-white/30 rounded-xs" />
                    <span className="text-[9px] text-brand-orange font-bold uppercase">Recto / Verso</span>
                  </div>
                </div>

                <Link
                  href={`/studio/editor?product=${tpl.productSlug}&template=${tpl.id}`}
                  className="w-full bg-white/5 hover:bg-brand-purple/40 border border-brand-purple/30 text-white text-xs font-bold py-2.5 rounded-xl transition text-center block"
                >
                  Utiliser ce modèle →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 4. WORKFLOW STEP-BY-STEP */}
        <section className="rounded-3xl bg-[#0d0922] border border-brand-purple/20 p-8 md:p-12 text-left">
          <div className="max-w-3xl mb-10 space-y-2">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Une expérience fluide & professionnelle
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold font-montserrat text-white">
              Comment fonctionne le Studio Art Vision ?
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              De votre idée à la livraison de vos cartons d'impression sur votre lieu d'activité.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Création intuitive en ligne",
                desc: "Personnalisez textes, typographies, couleurs, importez votre logo et vos visuels sans aucune compétence technique.",
                icon: Palette,
              },
              {
                step: "02",
                title: "Options d'impression réelles",
                desc: "Choisissez votre papier, grammage (300g à 400g), finitions Soft-Touch ou vernis 3D et votre quantité aux tarifs atelier.",
                icon: Layers,
              },
              {
                step: "03",
                title: "Contrôle PAO & BAT offert",
                desc: "Notre atelier graphique vérifie vos fonds perdus et vous envoie votre Bon à Tirer (BAT) numérique par e-mail.",
                icon: ShieldCheck,
              },
              {
                step: "04",
                title: "Impression HD & Livraison",
                desc: "Règlement sécurisé après votre accord. Vos supports sont imprimés et expédiés avec suivi partout en France et en Europe.",
                icon: Truck,
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="p-5 rounded-2xl bg-[#160f2e]/60 border border-brand-purple/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold font-mono text-brand-magenta">{s.step}</span>
                    <Icon size={20} className="text-brand-orange" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-montserrat">{s.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
