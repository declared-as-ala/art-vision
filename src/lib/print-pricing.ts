// Default pricing model for the printing price calculator.
// These are *indicative* values; the admin can later refine real brackets via
// the PrintPriceRule table. The UI always shows a "estimation indicative" notice.

export interface PrintProductDef {
  id: string;
  name: string;
  formats: string[];
  papers: { id: string; label: string; mult: number }[];
  finishes: { id: string; label: string; mult: number }[];
  sides: boolean; // recto/recto-verso applicable
  basePrice: number; // setup
  unitPrice: number; // per piece at qty 100 baseline
  quantities: number[];
  leadTimeDays: number;
}

export const PRINT_PRODUCTS: PrintProductDef[] = [
  {
    id: "flyers", name: "Flyers", formats: ["A6", "A5", "A4", "DL (carré)"],
    papers: [
      { id: "135", label: "135g brillant", mult: 1 },
      { id: "170", label: "170g brillant", mult: 1.15 },
      { id: "300", label: "300g mat", mult: 1.4 },
    ],
    finishes: [
      { id: "none", label: "Sans finition", mult: 1 },
      { id: "mat", label: "Pelliculage mat", mult: 1.25 },
      { id: "vernis", label: "Vernis sélectif", mult: 1.5 },
    ],
    sides: true, basePrice: 20, unitPrice: 0.12, quantities: [100, 250, 500, 1000, 2500, 5000], leadTimeDays: 4,
  },
  {
    id: "affiches", name: "Affiches", formats: ["A3", "A2", "A1", "40x60 cm"],
    papers: [
      { id: "135", label: "135g brillant", mult: 1 },
      { id: "170", label: "170g brillant", mult: 1.2 },
      { id: "250", label: "250g satiné", mult: 1.5 },
    ],
    finishes: [{ id: "none", label: "Sans finition", mult: 1 }, { id: "mat", label: "Pelliculage mat", mult: 1.3 }],
    sides: false, basePrice: 25, unitPrice: 0.9, quantities: [10, 25, 50, 100, 250, 500], leadTimeDays: 5,
  },
  {
    id: "baches", name: "Bâches", formats: ["1x1 m", "2x1 m", "3x1 m", "4x2 m"],
    papers: [
      { id: "440", label: "Bâche 440g", mult: 1 },
      { id: "510", label: "Bâche 510g renforcée", mult: 1.25 },
    ],
    finishes: [{ id: "oeillets", label: "Œillets standard", mult: 1 }, { id: "ourlet", label: "Ourlet + œillets", mult: 1.2 }],
    sides: false, basePrice: 35, unitPrice: 14, quantities: [1, 2, 3, 5, 10, 20], leadTimeDays: 6,
  },
  {
    id: "panneaux", name: "Panneaux publicitaires", formats: ["50x70 cm", "80x120 cm", "100x150 cm"],
    papers: [
      { id: "akilux", label: "Akilux 3,5mm", mult: 1 },
      { id: "dibond", label: "Dibond 3mm", mult: 1.8 },
      { id: "pvc", label: "PVC 5mm", mult: 1.4 },
    ],
    finishes: [{ id: "none", label: "Standard", mult: 1 }, { id: "lam", label: "Lamination anti-UV", mult: 1.3 }],
    sides: false, basePrice: 40, unitPrice: 22, quantities: [1, 2, 5, 10, 25, 50], leadTimeDays: 7,
  },
  {
    id: "catalogues", name: "Catalogues", formats: ["A5 8p", "A5 16p", "A4 8p", "A4 16p"],
    papers: [
      { id: "135", label: "135g intérieur", mult: 1 },
      { id: "170", label: "170g intérieur", mult: 1.3 },
    ],
    finishes: [{ id: "piqure", label: "Piqûre à cheval", mult: 1 }, { id: "dos", label: "Dos carré collé", mult: 1.4 }],
    sides: false, basePrice: 60, unitPrice: 1.4, quantities: [50, 100, 250, 500, 1000], leadTimeDays: 8,
  },
  {
    id: "cartes-de-visite", name: "Cartes de visite", formats: ["85x55 mm standard", "Carré 55x55 mm"],
    papers: [
      { id: "350", label: "350g mat", mult: 1 },
      { id: "350b", label: "350g brillant", mult: 1.05 },
      { id: "couche", label: "350g + pelliculage soft touch", mult: 1.45 },
    ],
    finishes: [{ id: "none", label: "Sans finition", mult: 1 }, { id: "vernis", label: "Vernis 3D sélectif", mult: 1.6 }],
    sides: true, basePrice: 15, unitPrice: 0.05, quantities: [100, 250, 500, 1000, 2500], leadTimeDays: 4,
  },
];

export interface PriceInput {
  productId: string;
  format: string;
  quantity: number;
  paperId: string;
  finishId: string;
  doubleSided: boolean;
  delivery: boolean;
}

export interface PriceResult {
  low: number;
  high: number;
  leadTimeDays: number;
  currency: string;
}

// Volume discount: larger runs lower the per-unit cost.
function volumeFactor(qty: number, quantities: number[]): number {
  const max = quantities[quantities.length - 1] || 1000;
  const ratio = Math.min(qty / max, 1);
  return 1 - ratio * 0.45; // up to -45% per unit at the top bracket
}

export function estimatePrice(input: PriceInput): PriceResult | null {
  const product = PRINT_PRODUCTS.find((p) => p.id === input.productId);
  if (!product) return null;
  const paper = product.papers.find((p) => p.id === input.paperId) || product.papers[0];
  const finish = product.finishes.find((f) => f.id === input.finishId) || product.finishes[0];

  const qty = Math.max(1, input.quantity || 1);
  const vf = volumeFactor(qty, product.quantities);
  const unit = product.unitPrice * paper.mult * finish.mult * vf * (input.doubleSided && product.sides ? 1.35 : 1);
  let total = product.basePrice + unit * qty;
  if (input.delivery) total += Math.max(8, total * 0.04);

  // present as a range around the central estimate
  const low = Math.round(total * 0.9);
  const high = Math.round(total * 1.15);
  return { low, high, leadTimeDays: product.leadTimeDays, currency: "€" };
}
