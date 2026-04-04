import Link from "next/link";
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

export function ComparisonTable({ villas, units, locale, headers }: ComparisonTableProps) {
  const villaTypeLabel = headers?.villaType || "Villa Type";
  const bedroomsLabel = headers?.bedrooms || "Bedrooms";
  const bathroomsLabel = headers?.bathrooms || "Bathrooms";
  const areaRangeLabel = headers?.areaRange || "Area m²";
  const priceFromLabel = headers?.priceFrom || "Price From";
  const availabilityLabel = headers?.availability || "Status";
  const contactUsLabel = headers?.contactUs || "Contact us";
  const soldOutLabel = headers?.soldOut || "Sold Out";
  const availableLabel = headers?.available || "Available";
  const fromLabel = headers?.fromLabel || "From";

  return (
    <div className="tile overflow-x-auto" role="region" aria-label="Villa comparison table" tabIndex={0} style={{ padding: "1.5rem 2rem" }}>
      <table className="w-full min-w-[720px] border-collapse">
        <caption className="sr-only">Villa type comparison</caption>
        <thead>
          <tr>
            {[villaTypeLabel, bedroomsLabel, bathroomsLabel, areaRangeLabel, priceFromLabel, availabilityLabel].map(
              (label, i) => (
                <th
                  key={label}
                  scope="col"
                  className={cn(
                    "pb-3 text-xs font-semibold uppercase tracking-[0.15em]",
                    i === 0 ? "text-left pr-6" : i === 5 ? "text-right pl-4" : "px-4 text-center"
                  )}
                  style={{ color: "var(--color-muted)", borderBottom: "2px solid var(--color-deep-teal)" }}
                >
                  {label}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {villas.map((villa, index) => {
            const villaUnits = units.filter(
              (u) => u.villaTypeName === villa.name || u.villaTypeSlug === villa.slug.current
            );
            const availableUnits = villaUnits.filter((u) => u.status === "available");
            const isSoldOut = villaUnits.length > 0 && availableUnits.length === 0;

            const minAvailableArea =
              availableUnits.length > 0
                ? Math.min(...availableUnits.map((u) => u.totalArea))
                : null;

            const isLast = index === villas.length - 1;

            return (
              <tr
                key={villa._id}
                className="group transition-colors hover:bg-[rgba(13,103,119,0.03)]"
                style={{
                  borderBottom: isLast ? "none" : "1px solid rgba(13,103,119,0.08)",
                }}
              >
                {/* Villa name — link to detail */}
                <td className="py-5 pr-6">
                  <Link
                    href={`/${locale}/villas/${villa.slug.current}`}
                    className="flex flex-col gap-0.5 group-hover:text-[var(--color-deep-teal)] transition-colors"
                  >
                    <span
                      className="font-serif font-semibold text-base"
                      style={{ letterSpacing: "0.02em", color: "var(--color-ink)" }}
                    >
                      {villa.name}
                    </span>
                    {villa.label?.[locale] && (
                      <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                        {villa.label[locale]}
                      </span>
                    )}
                  </Link>
                </td>

                {/* Bedrooms */}
                <td className="px-4 py-5 text-center" style={{ color: "var(--color-ink)" }}>
                  {villa.typicalBedrooms ?? "—"}
                </td>

                {/* Bathrooms */}
                <td className="px-4 py-5 text-center" style={{ color: "var(--color-ink)" }}>
                  {villa.typicalBathrooms ?? "—"}
                </td>

                {/* Area */}
                <td className="px-4 py-5 text-center" style={{ color: "var(--color-ink)" }}>
                  {villa.areaRange ? `${villa.areaRange} m²` : "—"}
                </td>

                {/* Price */}
                <td className="px-4 py-5 text-center">
                  {isSoldOut ? (
                    <span style={{ color: "var(--color-muted)" }}>—</span>
                  ) : minAvailableArea ? (
                    <span className="font-semibold" style={{ color: "var(--color-deep-teal)" }}>
                      {formatPriceFrom(minAvailableArea, fromLabel)}
                    </span>
                  ) : (
                    <span style={{ color: "var(--color-muted)" }}>{contactUsLabel}</span>
                  )}
                </td>

                {/* Status */}
                <td className="pl-4 py-5 text-right">
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
