"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Printer,
  Search,
  X,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Truck,
  FileCheck2,
} from "lucide-react";
import catalog from "@/data/impression-catalog.json";

// We display the 48 official categories on the main grid (excluding internal aliases like autocollants-sol)
const products = catalog.products.filter((p) => p.slug !== "autocollants-sol");

type FilterMode = "all" | "prices" | "devis";

export default function ImpressionCatalogPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const pricesCount = useMemo(() => products.filter((p) => !p.startingPrice?.isQuote).length, []);
  const devisCount = useMemo(() => products.filter((p) => p.startingPrice?.isQuote).length, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.label.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);
      const matchesFilter =
        filter === "all" ||
        (filter === "prices" && !p.startingPrice?.isQuote) ||
        (filter === "devis" && p.startingPrice?.isQuote);
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="relative hero-gradient min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,43,217,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,43,217,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

        {/* ORB glow */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-magenta/10 blur-[140px] pointer-events-none -z-10" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-purple/20 pl-2 pr-4 py-1 text-xs font-bold uppercase tracking-wide border border-brand-purple/30 text-brand-magenta">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-magenta/20">
                <Printer size={13} />
              </span>
              Catalogue impression professionnelle
            </div>
            <h1 className="mt-5 text-[clamp(1.75rem,5vw,3.5rem)] font-extrabold leading-[1.05] text-white font-montserrat tracking-tight">
              Tous vos supports imprimés,<br />
              <span className="text-brand-magenta">qualité atelier, finitions luxe et sur-mesure</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-white/70">
              Découvrez nos 48 gammes d'imprimés publicitaires, commerciaux et événementiels.
              Formats variés, papiers certifiés FSC, contrôle PAO gratuit avant tirage et livraison rapide suivie partout en France et en Europe.
            </p>
          </div>

          {/* Reassurance pills */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl">
            {[
              { icon: Printer, value: "48 catégories", label: "supports d'impression" },
              { icon: FileCheck2, value: "Contrôle PAO", label: "vérification fichiers incluse" },
              { icon: Sparkles, value: "Finitions Luxe", label: "dorure, vernis 3D, soft touch" },
              { icon: Truck, value: "Livraison Suivie", label: "France métropolitaine & Europe" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`glassmorphism rounded-xl p-3.5 sm:p-4 text-left border border-brand-purple/15 transition-all duration-700 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <stat.icon size={18} className="text-brand-magenta mb-2" />
                <p className="text-base sm:text-lg font-extrabold text-white">{stat.value}</p>
                <p className="text-[11px] text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FILTERS + SEARCH ===== */}
      <div className="sticky top-20 z-30 py-3 backdrop-blur-xl bg-[#0b0314]/90 border-b border-brand-purple/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un support (cartes, flyers, bâches, roll-up...)…"
                className="w-full h-10 pl-10 pr-9 rounded-xl bg-white/5 border border-brand-purple/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-magenta/50 focus:border-brand-magenta/50 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                  aria-label="Effacer la recherche"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrer par disponibilité">
              {[
                { key: "all" as const, label: `Tous les supports (${products.length})` },
                { key: "prices" as const, label: `Avec grille tarifaire (${pricesCount})` },
                { key: "devis" as const, label: `Sur devis (${devisCount})` },
              ].map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => setFilter(chip.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    filter === chip.key
                      ? "bg-brand-magenta text-white shadow-md shadow-brand-magenta/25"
                      : "bg-white/5 text-white/70 border border-brand-purple/20 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count indicator */}
          {search && (
            <p className="text-xs text-white/40 mt-2">
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* ===== CATALOG GRID ===== */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {filtered.length > 0 ? (
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 sm:gap-4.5 mt-6">
            {filtered.map((product, idx) => {
              const isQuote = product.startingPrice?.isQuote;
              const priceDisplay = product.startingPrice?.display || (isQuote ? "Sur devis" : "Tarif atelier");
              const priceUnit = product.startingPrice?.unit;

              return (
                <Link
                  key={product.slug}
                  href={`/impression/${product.slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl bg-[#1A1238]/50 border border-brand-purple/15 p-3 sm:p-3.5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-magenta/50 hover:shadow-xl hover:shadow-brand-magenta/15 overflow-hidden"
                  style={{
                    animation: visible ? `cardFadeIn 0.4s ease-out ${idx * 20}ms both` : "none",
                  }}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between w-full mb-2 z-10">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        !isQuote
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/25"
                      }`}
                    >
                      {!isQuote ? "Tarif direct" : "Sur mesure"}
                    </span>
                    <span className="text-[10px] text-white/30 font-mono">
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Product Miniature Visual */}
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#120a28]/80 border border-brand-purple/15 flex items-center justify-center p-2 mb-3 group-hover:border-brand-magenta/30 transition-colors">
                    <img
                      src={product.image}
                      alt={product.alt || `Impression ${product.label} Art Vision`}
                      loading="lazy"
                      className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <h2 className="text-xs sm:text-sm font-extrabold uppercase text-white font-montserrat tracking-tight line-clamp-2 leading-tight group-hover:text-brand-magenta transition-colors">
                      {product.label}
                    </h2>

                    {/* Pricing Pill */}
                    <div className="pt-1">
                      <div
                        className={`inline-block w-full py-1 px-2 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-wide ${
                          !isQuote
                            ? "bg-[#CD7942]/15 text-[#CD7942] border border-[#CD7942]/30 group-hover:bg-[#CD7942] group-hover:text-white transition-colors"
                            : "bg-white/5 text-white/70 border border-white/10 group-hover:border-brand-magenta/40 group-hover:text-white transition-colors"
                        }`}
                      >
                        {priceDisplay}
                      </div>
                      {priceUnit && !isQuote && (
                        <p className="text-[9px] text-white/40 mt-0.5 truncate">
                          {priceUnit}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Hint */}
                  <div className="mt-3 pt-2 border-t border-brand-purple/10 flex items-center justify-center text-[10px] font-semibold text-white/50 group-hover:text-brand-magenta transition-colors">
                    <span>Consulter la fiche</span>
                    <ChevronRight size={12} className="ml-0.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </section>
        ) : (
          <div className="py-20 text-center glassmorphism rounded-2xl border border-brand-purple/20 mt-8 max-w-lg mx-auto">
            <Printer size={36} className="mx-auto text-brand-magenta/60 mb-3" />
            <h3 className="text-lg font-bold text-white font-montserrat">Aucun produit ne correspond à votre recherche</h3>
            <p className="text-sm text-white/60 mt-1 max-w-sm mx-auto">
              Essayez avec un autre mot-clé (ex: « carte », « flyer », « bâche », « drapeau ») ou réinitialisez les filtres.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-magenta px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-magenta/90"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
