import { Bath, BedDouble, Car, Maximize, Trees, Waves } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import type { UnitWithRefs, Villa } from "@/lib/sanity/types";

type SpecsPanelProps = {
  villa: Villa | null;
  units: UnitWithRefs[];
  locale: Locale;
};

type SpecItem = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

export function SpecsPanel({ villa, units }: SpecsPanelProps) {
  if (!villa) {
    return (
      <div className="tile py-10 text-center text-[var(--color-muted)]">
        Details coming soon
      </div>
    );
  }

  // Compute area range from units if available, else fall back to villa.areaRange
  let areaDisplay = villa.areaRange ? `${villa.areaRange} m²` : "—";
  if (units.length > 0) {
    const areas = units.map((u) => u.totalArea).filter(Boolean);
    if (areas.length > 0) {
      const min = Math.min(...areas);
      const max = Math.max(...areas);
      areaDisplay = min === max ? `${min} m²` : `${min}–${max} m²`;
    }
  }

  // Outdoor area from units
  let outdoorDisplay = "—";
  if (units.length > 0) {
    const outdoors = units.map((u) => u.outdoorArea).filter(Boolean);
    if (outdoors.length > 0) {
      const min = Math.min(...outdoors);
      const max = Math.max(...outdoors);
      outdoorDisplay = min === max ? `${min} m²` : `${min}–${max} m²`;
    }
  }

  // Pool and parking from units (any unit with pool/parking)
  const hasPool = units.some((u) => u.hasPool);
  const hasParking = units.some((u) => u.hasParking);

  const specs: SpecItem[] = [
    {
      icon: <BedDouble className="h-5 w-5" />,
      label: "Bedrooms",
      value: villa.typicalBedrooms ?? "—",
    },
    {
      icon: <Bath className="h-5 w-5" />,
      label: "Bathrooms",
      value: villa.typicalBathrooms ?? "—",
    },
    {
      icon: <Maximize className="h-5 w-5" />,
      label: "Total Area",
      value: areaDisplay,
    },
    {
      icon: <Trees className="h-5 w-5" />,
      label: "Outdoor Area",
      value: outdoorDisplay,
    },
    {
      icon: <Waves className="h-5 w-5" />,
      label: "Swimming Pool",
      value: hasPool ? "Yes" : "No",
    },
    {
      icon: <Car className="h-5 w-5" />,
      label: "Parking",
      value: hasParking ? "Yes" : "No",
    },
  ];

  return (
    <div className="tile">
      <p className="eyebrow mb-6">Villa Specifications</p>
      <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0 text-[var(--color-deep-teal)]">
              {spec.icon}
            </span>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                {spec.label}
              </dt>
              <dd className="mt-0.5 text-base font-medium text-[var(--color-ink)]">
                {spec.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
