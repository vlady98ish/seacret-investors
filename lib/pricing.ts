/** EUR per m² built (indoor) area — price = rate × built area. */
const PRICE_PER_M2_BUILT = 3500;

export function computePriceFrom(builtAreaM2: number): number {
  return Math.round(builtAreaM2 * PRICE_PER_M2_BUILT);
}

export function formatPrice(euros: number): string {
  if (euros >= 1_000_000) {
    return `€${(euros / 1_000_000).toFixed(1)}M`;
  }
  return `€${Math.round(euros / 1000)}K`;
}

export function formatPriceFrom(builtAreaM2: number, fromLabel: string = "From"): string {
  return `${fromLabel} ${formatPrice(computePriceFrom(builtAreaM2))}`;
}
