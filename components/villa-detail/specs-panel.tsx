import { Bath, BedDouble, Car, Maximize, Trees, Waves } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import type { UnitWithRefs, Villa } from "@/lib/sanity/types";

type SpecsPanelProps = {
  villa: Villa | null;
  units: UnitWithRefs[];
  locale: Locale;
  labelEyebrow?: string;
  labelBedrooms?: string;
  labelBathrooms?: string;
  labelBuiltArea?: string;
  labelOutdoorArea?: string;
  labelPool?: string;
  labelParking?: string;
  labelYes?: string;
  labelNo?: string;
  labelDetailsComing?: string;
};

type SpecItem = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

export function SpecsPanel({ villa, units, labelEyebrow, labelBedrooms, labelBathrooms, labelBuiltArea, labelOutdoorArea, labelPool, labelParking, labelYes, labelNo, labelDetailsComing }: SpecsPanelProps) {
  if (!villa) {
    return (
      <div className="tile py-10 text-center text-[var(--color-muted)]">
        {labelDetailsComing || "Details coming soon"}
      </div>
    );
  }

  // Compute built area range from units (ground + upper + attic), fall back to villa.areaRange
  let areaDisplay = villa.areaRange ? `${villa.areaRange} m²` : "—";
  if (units.length > 0) {
    const areas = units.map((u) => {
      const g = u.groundFloor ?? 0;
      const up = u.upperFloor ?? 0;
      const a = u.attic ?? 0;
      const sum = g + up + a;
      return sum > 0 ? Math.round(sum * 100) / 100 : u.totalArea;
    }).filter(Boolean);
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

  const yesLabel = labelYes || "Yes";
  const noLabel = labelNo || "No";

  const specs: SpecItem[] = [
    {
      icon: <BedDouble className="h-5 w-5" />,
      label: labelBedrooms || "Bedrooms",
      value: villa.typicalBedrooms ?? "—",
    },
    {
      icon: <Bath className="h-5 w-5" />,
      label: labelBathrooms || "Bathrooms",
      value: villa.typicalBathrooms ?? "—",
    },
    {
      icon: <Maximize className="h-5 w-5" />,
      label: labelBuiltArea || "Built Area",
      value: areaDisplay,
    },
    {
      icon: <Trees className="h-5 w-5" />,
      label: labelOutdoorArea || "Outdoor Area",
      value: outdoorDisplay,
    },
    {
      icon: <Waves className="h-5 w-5" />,
      label: labelPool || "Swimming Pool",
      value: hasPool ? yesLabel : noLabel,
    },
    {
      icon: <Car className="h-5 w-5" />,
      label: labelParking || "Parking",
      value: hasParking ? yesLabel : noLabel,
    },
  ];

  return (
    <div className="tile">
      <p className="eyebrow mb-6">{labelEyebrow || "Villa Specifications"}</p>
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
