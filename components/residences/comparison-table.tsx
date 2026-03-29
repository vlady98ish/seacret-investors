import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { formatPriceFrom } from "@/lib/pricing";
import type { UnitFlat, Villa } from "@/lib/sanity/types";

type ComparisonTableProps = {
  villas: Villa[];
  units: UnitFlat[];
  locale: Locale;
};

export function ComparisonTable({ villas, units }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="tile w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[rgba(13,103,119,0.12)]">
            <th className="py-3 pr-6 text-left font-semibold tracking-wide text-[var(--color-ink)]">
              Villa Type
            </th>
            <th className="px-4 py-3 text-center font-semibold tracking-wide text-[var(--color-ink)]">
              Bedrooms
            </th>
            <th className="px-4 py-3 text-center font-semibold tracking-wide text-[var(--color-ink)]">
              Bathrooms
            </th>
            <th className="px-4 py-3 text-center font-semibold tracking-wide text-[var(--color-ink)]">
              Area Range
            </th>
            <th className="px-4 py-3 text-center font-semibold tracking-wide text-[var(--color-ink)]">
              Price From
            </th>
            <th className="pl-4 py-3 text-center font-semibold tracking-wide text-[var(--color-ink)]">
              Availability
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
                      {formatPriceFrom(minAvailableArea)}
                    </span>
                  ) : (
                    <span className="text-[var(--color-muted)]">Contact us</span>
                  )}
                </td>
                <td className="pl-4 py-4 text-center">
                  {isSoldOut ? (
                    <span className="badge badge-sold">Sold Out</span>
                  ) : availableUnits.length > 0 ? (
                    <span className="badge badge-available">
                      {availableUnits.length} Available
                    </span>
                  ) : (
                    <span className="badge badge-reserved">Contact Us</span>
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
