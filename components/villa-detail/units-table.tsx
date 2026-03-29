import { Check, Minus } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import type { UnitWithRefs } from "@/lib/sanity/types";
import { StatusBadge } from "@/components/sections/status-badge";

type UnitsTableProps = {
  units: UnitWithRefs[];
  locale: Locale;
};

export function UnitsTable({ units }: UnitsTableProps) {
  if (units.length === 0) {
    return (
      <div className="tile py-10 text-center text-[var(--color-muted)]">
        Unit availability coming soon
      </div>
    );
  }

  const sorted = [...units].sort((a, b) => a.unitNumber.localeCompare(b.unitNumber));

  return (
    <div className="tile overflow-hidden p-0">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-deep-teal)]/10 text-left">
              <th className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                Unit #
              </th>
              <th className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                Plot
              </th>
              <th className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                Area m²
              </th>
              <th className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                Beds
              </th>
              <th className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                Pool
              </th>
              <th className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((unit, i) => (
              <tr
                key={unit._id}
                className={[
                  "border-b border-[var(--color-deep-teal)]/5 transition-colors hover:bg-[var(--color-deep-teal)]/5",
                  i % 2 === 0 ? "bg-transparent" : "bg-[var(--color-sand)]/30",
                ].join(" ")}
              >
                <td className="px-5 py-4 font-medium text-[var(--color-ink)]">
                  {unit.unitNumber}
                </td>
                <td className="px-5 py-4 text-[var(--color-muted)]">
                  {unit.plotName ?? "—"}
                </td>
                <td className="px-5 py-4 text-[var(--color-ink)]">{unit.totalArea}</td>
                <td className="px-5 py-4 text-[var(--color-ink)]">{unit.bedrooms}</td>
                <td className="px-5 py-4">
                  {unit.hasPool ? (
                    <Check className="h-4 w-4 text-[var(--color-deep-teal)]" />
                  ) : (
                    <Minus className="h-4 w-4 text-[var(--color-muted)]" />
                  )}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={unit.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="divide-y divide-[var(--color-deep-teal)]/10 sm:hidden">
        {sorted.map((unit) => (
          <div key={unit._id} className="flex items-center justify-between p-4">
            <div className="space-y-0.5">
              <p className="font-medium text-[var(--color-ink)]">Unit {unit.unitNumber}</p>
              <p className="text-xs text-[var(--color-muted)]">
                {unit.totalArea} m² · {unit.bedrooms} bed
                {unit.hasPool ? " · Pool" : ""}
              </p>
              {unit.plotName && (
                <p className="text-xs text-[var(--color-muted)]">{unit.plotName}</p>
              )}
            </div>
            <StatusBadge status={unit.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
