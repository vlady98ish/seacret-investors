const PRESALE_RATE_PER_M2 = 2950;

export function computePriceFrom(totalAreaM2: number): number {
  return Math.ceil((totalAreaM2 * PRESALE_RATE_PER_M2) / 1000) * 1000;
}

export function formatPrice(euros: number): string {
  if (euros >= 1_000_000) {
    return `€${(euros / 1_000_000).toFixed(1)}M`;
  }
  return `€${Math.round(euros / 1000)}K`;
}

export function formatPriceFrom(totalAreaM2: number): string {
  return `From ${formatPrice(computePriceFrom(totalAreaM2))}`;
}
