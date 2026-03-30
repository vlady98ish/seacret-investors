import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { formatPriceFrom } from "@/lib/pricing";
import type { UnitFlat, Villa } from "@/lib/sanity/types";

type TableHeaders = {
  villaType?: string;
  bedrooms?: string;
  bathrooms?: string;
  areaRange?: string;
  priceFrom?: string;
  availability?: string;
  contactUs?: string;
  soldOut?: string;
  available?: string;
  fromLabel?: string;
};

type ComparisonTableProps = {
  villas: Villa[];
  units: UnitFlat[];
  locale: Locale;
  headers?: TableHeaders;
};

export function ComparisonTable({ villas, units, headers }: ComparisonTableProps) {
  const villaTypeLabel = headers?.villaType || "Villa Type";
  const bedroomsLabel = headers?.bedrooms || "Bedrooms";
  const bathroomsLabel = headers?.bathrooms || "Bathrooms";
  const areaRangeLabel = headers?.areaRange || "Area Range";
  const priceFromLabel = headers?.priceFrom || "Price From";
  const availabilityLabel = headers?.availability || "Availability";
  const contactUsLabel = headers?.contactUs || "Contact us";
  const soldOutLabel = headers?.soldOut || "Sold Out";
  const availableLabel = headers?.available || "Available";
  const fromLabel = headers?.fromLabel || "From";

  return (
    <div className="overflow-x-auto">
      <table className="tile w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[rgba(13,103,119,0.12)]">
            <th className="py-3 pr-6 text-left font-semibold tracking-wide text-[var(--color-ink)]">
              {villaTypeLabel}
            </th>
            <th className="px-4 py-3 text-center font-semibold tracking-wide text-[var(--color-ink)]">
              {bedroomsLabel}
            </th>
            <th className="px-4 py-3 text-center font-semibold tracking-wide text-[var(--color-ink)]">
              {bathroomsLabel}
            </th>
            <th className="px-4 py-3 text-center font-semibold tracking-wide text-[var(--color-ink)]">
              {areaRangeLabel}
            </th>
            <th className="px-4 py-3 text-center font-semibold tracking-wide text-[var(--color-ink)]">
              {priceFromLabel}
            </th>
            <th className="pl-4 py-3 text-center font-semibold tracking-wide text-[var(--color-ink)]">
              {availabilityLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {villas.map((villa, index) => {
            const villaUnits = units.filter(
              (u) =>
                u.villaTypeName === villa.name ||
                u.villaTypeSlug === villa.slug.current
            );
            const availableUnits = villaUnits.filter((u) => u.status === "available");
            const isSoldOut = villaUnits.length > 0 && availableUnits.length === 0;

            const minAvailableArea =
              availableUnits.length > 0
                ? Math.min(...availableUnits.map((u) => u.totalArea))
                : null;

            return (
              <tr
                key={villa._id}
                className={cn(
                  "border-b border-[rgba(13,103,119,0.08)] transition-colors hover:bg-[rgba(13,103,119,0.03)]",
                  index === villas.length - 1 && "border-b-0"
                )}
              >
                <td className="py-4 pr-6 font-medium text-[var(--color-ink)]">
                  {villa.name}
                </td>
                <td className="px-4 py-4 text-center text-[var(--color-muted)]">
                  {villa.typicalBedrooms ?? "—"}
                </td>
                <td className="px-4 py-4 text-center text-[var(--color-muted)]">
                  {villa.typicalBathrooms ?? "—"}
                </td>
                <td className="px-4 py-4 text-center text-[var(--color-muted)]">
                  {villa.areaRange ? `${villa.areaRange} m²` : "—"}
                </td>
                <td className="px-4 py-4 text-center">
                  {isSoldOut ? (
                    <span className="text-[var(--color-muted)]">—</span>
                  ) : minAvailableArea ? (
                    <span className="font-semibold text-[var(--color-deep-teal)]">
                      {formatPriceFrom(minAvailableArea, fromLabel)}
                    </span>
                  ) : (
                    <span className="text-[var(--color-muted)]">{contactUsLabel}</span>
                  )}
                </td>
                <td className="pl-4 py-4 text-center">
                  {isSoldOut ? (
                    <span className="badge badge-sold">{soldOutLabel}</span>
                  ) : availableUnits.length > 0 ? (
                    <span className="badge badge-available">
                      {availableUnits.length} {availableLabel}
                    </span>
                  ) : (
                    <span className="badge badge-reserved">{contactUsLabel}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
