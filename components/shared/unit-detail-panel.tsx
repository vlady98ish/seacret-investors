type DetailItem = {
  label: string;
  value: string;
};

type UnitDetailPanelProps = {
  groundFloor?: number;
  upperFloor?: number;
  attic?: number;
  balcony?: number;
  roofTerrace?: number;
  outdoorArea?: number;
  propertySize?: number;
  bathrooms?: number;
  hasPool?: boolean;
  hasParking?: boolean;
  labels: {
    groundFloor: string;
    upperFloor: string;
    attic: string;
    balcony: string;
    roofTerrace: string;
    outdoorArea: string;
    propertySize: string;
    bathrooms: string;
    pool: string;
    parking: string;
    yes: string;
    no: string;
  };
};

export function UnitDetailPanel({
  groundFloor,
  upperFloor,
  attic,
  balcony,
  roofTerrace,
  outdoorArea,
  propertySize,
  bathrooms,
  hasPool,
  hasParking,
  labels,
}: UnitDetailPanelProps) {
  const items: DetailItem[] = [];

  if (groundFloor && groundFloor > 0) items.push({ label: labels.groundFloor, value: `${groundFloor} m²` });
  if (upperFloor && upperFloor > 0) items.push({ label: labels.upperFloor, value: `${upperFloor} m²` });
  if (attic && attic > 0) items.push({ label: labels.attic, value: `${attic} m²` });
  if (balcony && balcony > 0) items.push({ label: labels.balcony, value: `${balcony} m²` });
  if (roofTerrace && roofTerrace > 0) items.push({ label: labels.roofTerrace, value: `${roofTerrace} m²` });
  if (outdoorArea && outdoorArea > 0) items.push({ label: labels.outdoorArea, value: `${outdoorArea} m²` });
  if (propertySize && propertySize > 0) items.push({ label: labels.propertySize, value: `${propertySize} m²` });
  if (bathrooms && bathrooms > 0) items.push({ label: labels.bathrooms, value: String(bathrooms) });
  if (hasPool !== undefined) items.push({ label: labels.pool, value: hasPool ? labels.yes : labels.no });
  if (hasParking !== undefined) items.push({ label: labels.parking, value: hasParking ? labels.yes : labels.no });

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2 px-4 py-4 sm:grid-cols-2 sm:px-8">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between border-b border-[rgba(13,103,119,0.06)] py-1.5">
          <span className="text-xs text-[var(--color-muted)]">{item.label}</span>
          <span className="text-xs font-medium text-[var(--color-ink)]">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
