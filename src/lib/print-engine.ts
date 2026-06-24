import prisma from "@/lib/prisma";
import { htToTtcCents } from "@/lib/money";

export interface PriceQuery {
  paper?: string;
  format?: string;
  finish?: string;
  side?: string;
  quantity: number;
}

export interface PriceResult {
  found: boolean;
  priceHtCents: number;
  priceTtcCents: number;
  promoTtcCents: number | null;
  productionDays: number;
}

/**
 * Looks up an exact price-matrix row for a product + options combination.
 * Returns { found: false } when no price exists → the UI shows
 * "Demandez un devis personnalisé" instead of a fake price.
 */
export async function lookupPrice(productId: string, q: PriceQuery): Promise<PriceResult | null> {
  try {
    const row = await prisma.printPrice.findFirst({
      where: {
        productId,
        active: true,
        paper: q.paper ?? "",
        format: q.format ?? "",
        finish: q.finish ?? "",
        side: q.side ?? "recto",
        quantity: q.quantity,
      },
    });
    if (!row) return { found: false, priceHtCents: 0, priceTtcCents: 0, promoTtcCents: null, productionDays: 0 };
    const ttc = row.priceTtcCents || htToTtcCents(row.priceHtCents);
    return {
      found: true,
      priceHtCents: row.priceHtCents,
      priceTtcCents: ttc,
      promoTtcCents: row.promoTtcCents ?? null,
      productionDays: row.productionDays,
    };
  } catch {
    return null;
  }
}
