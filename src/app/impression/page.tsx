"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  BadgePercent,
  BookOpen,
  CalendarDays,
  Car,
  ClipboardList,
  Flag,
  FileText,
  Mail,
  Megaphone,
  NotebookTabs,
  Package,
  PanelTop,
  PenLine,
  Printer,
  ReceiptText,
  Search,
  Shirt,
  Square,
  Stamp,
  Tag,
  Ticket,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import catalog from "@/data/impression-catalog.json";
import type { Metadata } from "next";

const iconMap = {
  affiches: PanelTop,
  "affiches-fluo": Megaphone,
  autocollants: Tag,
  "autocollants-sol": BadgePercent,
  autocopiants: ReceiptText,
  baches: Square,
  badges: BadgePercent,
  ballons: CircleIcon,
  "beach-flags": Flag,
  "bloc-notes": NotebookTabs,
  "blocs-adhesifs": PenLine,
  bracelets: BadgePercent,
  brochures: BookOpen,
  cachets: Stamp,
  calendriers: CalendarDays,
  "cartes-de-visite": FileText,
  "cartes-de-voeux": Mail,
  "cartes-postales": FileText,
  "cartes-pvc": FileText,
  classeurs: ClipboardList,
  "cles-usb": Package,
  depliants: BookOpen,
  drapeaux: Flag,
  enveloppes: Mail,
  etiquettes: Tag,
  "fardes-a-rabats": BookOpen,
  flyers: FileText,
  "marquage-vehicules": Car,
  "marque-pages": FileText,
  "objets-pub": Package,
  panneaux: PanelTop,
  "panneaux-immo": PanelTop,
  "papier-entete": FileText,
  "roll-up": PanelTop,
  "sous-boc": CircleIcon,
  "sous-mains": Square,
  stylos: PenLine,
  textiles: Shirt,
  "tickets-entrees": Ticket,
  "tours-de-cou": BadgePercent,
} as const;

function CircleIcon(props: React.ComponentProps<typeof Square>) {
  return <Square {...props} className={`${props.className ?? ""} rounded-full`} />;
}

const products = catalog.products;
const activeCount = products.filter((p) => p.tableCount > 0).length;

type FilterMode = "all" | "prices" | "devis";

export default function ImpressionCatalogPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      const matchesSearch = !q || p.label.toLowerCase().includes(q);
      const matchesFilter =
        filter === "all" ||
        (filter === "prices" && p.tableCount > 0) ||
        (filter === "devis" && p.tableCount === 0);
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
              Catalogue impression
            </div>
            <h1 className="mt-5 text-[clamp(1.75rem,5vw,3.5rem)] font-extrabold leading-[1.05] text-white font-sora tracking-tight">
              Tous vos supports imprimés,<br />
              <span className="text-brand-magenta">organisés comme un vrai catalogue</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-white/60">
              Retrouvez les catégories principales inspirées du catalogue source, avec des pages de tarifs pour les produits qui publient des grilles de prix.
            </p>
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
            {[
              { value: products.length, label: "catégories" },
              { value: activeCount, label: "avec grille" },
              { value: "HT", label: "prix HT" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`glassmorphism rounded-xl p-4 sm:p-5 text-center border border-brand-purple/15 transition-all duration-700 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
                <p className="text-[11px] sm:text-sm text-white/50 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FILTERS + SEARCH ===== */}
      <div className="sticky top-20 z-30 py-3 backdrop-blur-xl bg-[#0b0314]/80 border-b border-brand-purple/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit…"
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
              {([
                { key: "all", label: "Tout" },
                { key: "prices", label: "Avec grille" },
                { key: "devis", label: "Sur devis" },
              ] as { key: FilterMode; label: string }[]).map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => setFilter(chip.key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    filter === chip.key
                      ? "bg-brand-magenta text-white shadow-md shadow-brand-magenta/25"
                      : "bg-white/5 text-white/60 border border-brand-purple/20 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          {search && (
            <p className="text-xs text-white/40 mt-2">
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* ===== CATALOG GRID ===== */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        {filtered.length > 0 ? (
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mt-6">
            {filtered.map((product, idx) => {
              const Icon = iconMap[product.slug as keyof typeof iconMap] ?? Printer;
              const hasPrices = product.tableCount > 0;
              return (
                <Link
                  key={product.slug}
                  href={hasPrices ? product.url : `/devis-sur-mesure?prefill=impression&product=${encodeURIComponent(product.label)}`}
                  className="group relative flex flex-col items-center justify-center rounded-2xl bg-[#1A1238]/40 border border-brand-purple/15 p-4 sm:p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-magenta/40 hover:shadow-xl hover:shadow-brand-magenta/10 overflow-hidden"
                  style={{
                    animation: visible ? `cardFadeIn 0.5s ease-out ${idx * 30}ms both` : "none",
                  }}
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-magenta/0 via-brand-magenta/0 to-brand-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Price badge */}
                  <span
                    className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider z-10 ${
                      hasPrices
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                    }`}
                  >
                    {hasPrices ? "Tarif" : "Devis"}
                  </span>

                  {/* Icon */}
                  <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-brand-purple/20 text-brand-magenta shadow-inner transition-all duration-300 group-hover:bg-brand-magenta/20 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-magenta/20">
                    <Icon size={28} className="sm:size-[32px]" aria-hidden="true" />
                  </span>

                  {/* Label */}
                  <span className="mt-3 text-[11px] sm:text-sm font-extrabold uppercase text-white/90 group-hover:text-brand-magenta transition-colors duration-200 leading-tight">
                    {product.label}
                  </span>

                  {/* Sub info */}
                  <span className="mt-1.5 text-[10px] sm:text-xs text-white/40">
                    {hasPrices
                      ? `${product.tableCount} tabl. · ${product.rowCount} prix`
                      : "Sur devis"}
                  </span>
                </Link>
              );
            })}
          </section>
        ) : (
          /* ===== EMPTY STATE ===== */
          <section className="mt-12 text-center py-20">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-purple/20 mb-5">
              <Search size={28} className="text-white/40" />
            </div>
            <h2 className="text-xl font-bold text-white">Aucun résultat</h2>
            <p className="mt-2 text-sm text-white/50 max-w-sm mx-auto">
              Aucun produit ne correspond à votre recherche. Essayez un autre mot-clé.
            </p>
            <button
              onClick={() => { setSearch(""); setFilter("all"); }}
              className="mt-6 inline-flex items-center gap-2 bg-brand-magenta/20 hover:bg-brand-magenta/30 text-brand-magenta px-5 py-2.5 rounded-full text-sm font-semibold transition"
            >
              Réinitialiser les filtres
            </button>
          </section>
        )}

        {/* ===== CTA ===== */}
        <section className="mt-12 sm:mt-16 glassmorphism rounded-2xl p-6 sm:p-8 border border-brand-magenta/20 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sora">
              Besoin d'un support qui n'a pas encore sa grille ?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60 max-w-xl">
              Certaines catégories utilisent un devis ou une configuration spéciale. Envoyez-nous le produit, la quantité et le format visé.
            </p>
          </div>
          <Link
            href="/devis-sur-mesure?prefill=impression"
            className="mt-5 sm:mt-0 inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/95 text-white px-6 sm:px-7 py-3 rounded-full text-sm font-bold transition-all shadow-md shadow-brand-orange/20 hover:shadow-lg hover:shadow-brand-orange/30 shrink-0 w-full sm:w-auto"
          >
            Demander un devis
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      </main>

      {/* ===== ANIMATION KEYFRAMES ===== */}
      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
