"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Printer,
  ChevronRight,
  ShieldCheck,
  Check,
  Truck,
  Sparkles,
  HelpCircle,
  FileText
} from "lucide-react";

// Pricing data structures
interface PrintProduct {
  name: string;
  basePrice: number;
  formats: { name: string; multiplier: number }[];
  papers: { name: string; multiplier: number }[];
  finishes: { name: string; multiplier: number }[];
}

const PRODUCTS: Record<string, PrintProduct> = {
  flyers: {
    name: "Flyers",
    basePrice: 0.1,
    formats: [
      { name: "A5 (14.8 x 21 cm)", multiplier: 1.0 },
      { name: "A6 (10.5 x 14.8 cm)", multiplier: 0.7 },
      { name: "A4 (21 x 29.7 cm)", multiplier: 1.5 }
    ],
    papers: [
      { name: "135g Couché Brillant", multiplier: 1.0 },
      { name: "250g Couché Demi-Mat", multiplier: 1.3 },
      { name: "350g Couché Rigide", multiplier: 1.7 }
    ],
    finishes: [
      { name: "Sans pelliculage", multiplier: 1.0 },
      { name: "Pelliculage Mat (Recto/Verso)", multiplier: 1.25 },
      { name: "Pelliculage Brillant (Recto/Verso)", multiplier: 1.25 }
    ]
  },
  affiches: {
    name: "Affiches",
    basePrice: 0.8,
    formats: [
      { name: "A3 (29.7 x 42 cm)", multiplier: 1.0 },
      { name: "A2 (42 x 59.4 cm)", multiplier: 1.8 },
      { name: "A1 (59.4 x 84.1 cm)", multiplier: 3.2 },
      { name: "A0 (84.1 x 118.9 cm)", multiplier: 5.5 }
    ],
    papers: [
      { name: "135g Couché Brillant", multiplier: 1.0 },
      { name: "250g Couché Demi-Mat", multiplier: 1.4 }
    ],
    finishes: [
      { name: "Sans vernis", multiplier: 1.0 },
      { name: "Vernis UV Brillant", multiplier: 1.2 }
    ]
  },
  baches: {
    name: "Bâches Publicitaires",
    basePrice: 12.0,
    formats: [
      { name: "Bâche 200 x 100 cm", multiplier: 1.0 },
      { name: "Bâche 300 x 100 cm", multiplier: 1.4 },
      { name: "Bâche 400 x 150 cm", multiplier: 2.2 }
    ],
    papers: [
      { name: "PVC 500g Standard", multiplier: 1.0 },
      { name: "PVC 550g Ignifugé M1", multiplier: 1.35 },
      { name: "Micro-perforé Mesh (Vent)", multiplier: 1.25 }
    ],
    finishes: [
      { name: "Oeillets tous les 50cm (Inclus)", multiplier: 1.0 },
      { name: "Fourreau haut & bas", multiplier: 1.15 }
    ]
  },
  cartes: {
    name: "Cartes de Visite",
    basePrice: 0.15,
    formats: [
      { name: "Format Standard (8.5 x 5.5 cm)", multiplier: 1.0 },
      { name: "Format Carré (5.5 x 5.5 cm)", multiplier: 1.2 }
    ],
    papers: [
      { name: "350g Couché Demi-Mat (Premium)", multiplier: 1.0 },
      { name: "400g Couché Rigide", multiplier: 1.25 },
      { name: "Papier Texturé Recyclé", multiplier: 1.4 }
    ],
    finishes: [
      { name: "Sans pelliculage", multiplier: 1.0 },
      { name: "Pelliculage Mat Soft Touch", multiplier: 1.35 },
      { name: "Vernis Sélectif 3D", multiplier: 1.7 }
    ]
  }
};

const QUANTITIES = [100, 250, 500, 1000, 2500, 5000];

export default function PrintingEstimator() {
  const [productKey, setProductKey] = useState("flyers");
  const [formatIndex, setFormatIndex] = useState(0);
  const [paperIndex, setPaperIndex] = useState(0);
  const [finishIndex, setFinishIndex] = useState(0);
  const [quantity, setQuantity] = useState(500);

  const [priceHt, setPriceHt] = useState(0);
  const [priceTtc, setPriceTtc] = useState(0);

  const product = PRODUCTS[productKey];

  useEffect(() => {
    // Reset index bounds on product change
    setFormatIndex(0);
    setPaperIndex(0);
    setFinishIndex(0);
  }, [productKey]);

  useEffect(() => {
    if (!product) return;

    const formatMult = product.formats[formatIndex]?.multiplier || 1;
    const paperMult = product.papers[paperIndex]?.multiplier || 1;
    const finishMult = product.finishes[finishIndex]?.multiplier || 1;

    // Price scaling: Base price * quantity * multipliers
    // Larger quantities get scaling discounts
    let discountFactor = 1.0;
    if (quantity >= 5000) discountFactor = 0.5;
    else if (quantity >= 2500) discountFactor = 0.6;
    else if (quantity >= 1000) discountFactor = 0.7;
    else if (quantity >= 500) discountFactor = 0.8;
    else if (quantity >= 250) discountFactor = 0.9;

    let computedHt = product.basePrice * quantity * formatMult * paperMult * finishMult * discountFactor;
    
    // Minimum charge check
    if (computedHt < 25) computedHt = 25;

    setPriceHt(Number(computedHt.toFixed(2)));
    setPriceTtc(Number((computedHt * 1.2).toFixed(2))); // 20% French VAT
  }, [productKey, formatIndex, paperIndex, finishIndex, quantity]);

  return (
    <div className="min-h-screen hero-gradient pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-purple/30 border border-brand-purple/40 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-brand-white uppercase animate-pulse">
            <Printer size={14} className="text-brand-orange" />
            <span>Impression Professionnelle</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold tracking-tight">
            Impression publicitaire haute qualité
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            De la carte de visite au panneau publicitaire grand format, Art Vision gère vos impressions en atelier français avec des finitions premium.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Price Estimator Widget (Left 7 Columns) */}
          <div className="lg:col-span-7 glassmorphism rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="font-sora font-bold text-xl text-white border-b border-brand-purple/20 pb-3 flex items-center space-x-2">
              <Sparkles className="text-brand-orange" size={20} />
              <span>Calculateur de prix en ligne</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Selector */}
              <div className="space-y-2">
                <label className="text-xs text-white/60 font-semibold uppercase tracking-wider block">
                  1. Produit
                </label>
                <select
                  value={productKey}
                  onChange={(e) => setProductKey(e.target.value)}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-magenta cursor-pointer"
                >
                  {Object.entries(PRODUCTS).map(([key, value]) => (
                    <option key={key} value={key} className="bg-brand-navy">
                      {value.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-xs text-white/60 font-semibold uppercase tracking-wider block">
                  2. Quantité
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-magenta cursor-pointer"
                >
                  {QUANTITIES.map((q) => (
                    <option key={q} value={q} className="bg-brand-navy">
                      {q} exemplaires
                    </option>
                  ))}
                </select>
              </div>

              {/* Format Selector */}
              <div className="space-y-2">
                <label className="text-xs text-white/60 font-semibold uppercase tracking-wider block">
                  3. Format
                </label>
                <select
                  value={formatIndex}
                  onChange={(e) => setFormatIndex(Number(e.target.value))}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-magenta cursor-pointer"
                >
                  {product.formats.map((f, idx) => (
                    <option key={idx} value={idx} className="bg-brand-navy">
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Paper / Material */}
              <div className="space-y-2">
                <label className="text-xs text-white/60 font-semibold uppercase tracking-wider block">
                  4. Support / Papier
                </label>
                <select
                  value={paperIndex}
                  onChange={(e) => setPaperIndex(Number(e.target.value))}
                  className="w-full bg-brand-navy border border-brand-purple/30 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-magenta cursor-pointer"
                >
                  {product.papers.map((p, idx) => (
                    <option key={idx} value={idx} className="bg-brand-navy">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Finishes */}
            <div className="space-y-2">
              <label className="text-xs text-white/60 font-semibold uppercase tracking-wider block">
                5. Finition & Pelliculage
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {product.finishes.map((f, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFinishIndex(idx)}
                    className={`px-3 py-3 rounded-lg border text-left text-xs font-semibold transition cursor-pointer ${
                      finishIndex === idx
                        ? "bg-brand-magenta border-brand-magenta text-white"
                        : "border-brand-purple/30 bg-brand-navy hover:bg-brand-purple/20 text-white/70"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery banner */}
            <div className="flex items-center space-x-3 bg-brand-purple/10 border border-brand-purple/25 p-4 rounded-xl text-xs text-white/80">
              <Truck className="text-brand-orange shrink-0" size={18} />
              <span>Livraison estimée en 4 jours ouvrés. Suivi disponible en direct de nos ateliers.</span>
            </div>
          </div>

          {/* Pricing Panel Summary (Right 5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glassmorphism rounded-2xl p-6 md:p-8 space-y-6 border border-brand-orange/20">
              <h3 className="font-sora font-bold text-lg text-white">
                Résumé du devis
              </h3>

              <div className="space-y-3 border-b border-brand-purple/20 pb-4 text-sm text-white/85">
                <div className="flex justify-between">
                  <span>Produit</span>
                  <strong className="text-white">{product.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Format</span>
                  <strong className="text-white">{product.formats[formatIndex]?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Quantité</span>
                  <strong className="text-white">{quantity} ex.</strong>
                </div>
                <div className="flex justify-between">
                  <span>Papier</span>
                  <strong className="text-white">{product.papers[paperIndex]?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Finition</span>
                  <strong className="text-white">{product.finishes[finishIndex]?.name}</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Prix HT :</span>
                  <span>{priceHt} €</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-white/95">Prix TTC :</span>
                  <span className="text-3xl font-sora font-extrabold text-brand-orange">{priceTtc} €</span>
                </div>
                <p className="text-[10px] text-white/45 text-right">TVA de 20% incluse (soit {(priceTtc - priceHt).toFixed(2)} €)</p>
              </div>

              {/* Redirect CTA to Devis page */}
              <Link
                href={`/devis-sur-mesure?prefill=impression&product=${encodeURIComponent(product.name)}&qty=${quantity}&format=${encodeURIComponent(product.formats[formatIndex]?.name)}&total=${priceTtc}`}
                className="block text-center bg-brand-orange hover:bg-brand-orange/95 text-white py-3.5 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] shadow-md shadow-brand-orange/20"
              >
                Commander / Demander un Bon à Tirer
              </Link>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-white/50">
                <ShieldCheck size={14} className="text-green-400" />
                <span>Paiement sécurisé après signature du BAT</span>
              </div>
            </div>

            {/* Side features details */}
            <div className="glassmorphism rounded-xl p-5 space-y-4">
              <h4 className="font-sora font-semibold text-sm text-white">Pourquoi imprimer avec Art Vision ?</h4>
              <ul className="text-xs space-y-2.5 text-white/70">
                <li className="flex items-center space-x-2">
                  <Check size={12} className="text-brand-magenta" />
                  <span>Vérification technique de vos fichiers par un infographiste</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={12} className="text-brand-magenta" />
                  <span>Gabarits et repères de coupe vérifiés gratuitement</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={12} className="text-brand-magenta" />
                  <span>Livraison neutre possible pour les revendeurs (white-label)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Marketing Details Sections */}
        <div className="mt-24 border-t border-brand-purple/20 pt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-sora font-bold text-lg text-white">Impression Grand Format</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Valorisez votre marque en extérieur ou sur vos salons. Bâches publicitaires résistantes aux intempéries (œillets en laiton compris), panneaux alu Dibond, bâches mesh microperforées ou affiches abribus.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-sora font-bold text-lg text-white">Supports Commerciaux</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Flyers A5, plaquettes à 3 volets, dépliants professionnels et catalogues multi-pages. Nous offrons des papiers de 135g à 350g rigides avec des finitions pelliculées mats ou brillantes très qualitatives.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-sora font-bold text-lg text-white">Papeterie Corporate</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Cartes de visite classiques ou carrées, têtes de lettre professionnelles et enveloppes personnalisées. Finition pelliculage peau de pêche (Soft Touch) et vernis 3D sélectif en surbrillance pour un toucher luxueux.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
