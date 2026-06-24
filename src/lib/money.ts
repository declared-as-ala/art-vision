// Money is always handled as INTEGER CENTS — never floats.
export const TVA_RATE = 0.2; // 20% (France)

export const toCents = (euros: number | string): number => {
  const n = typeof euros === "string" ? parseFloat(euros.replace(",", ".")) : euros;
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};

export const fromCents = (cents: number | null | undefined): number =>
  cents == null ? 0 : cents / 100;

export const htToTtcCents = (htCents: number): number => Math.round(htCents * (1 + TVA_RATE));
export const ttcToHtCents = (ttcCents: number): number => Math.round(ttcCents / (1 + TVA_RATE));

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export function formatEuros(cents: number | null | undefined): string {
  if (cents == null) return "—";
  return fmt.format(cents / 100);
}

// Editable euros string (e.g. "12.50") from cents, for form inputs.
export const centsToInput = (cents: number | null | undefined): string =>
  cents == null ? "" : (cents / 100).toFixed(2);
