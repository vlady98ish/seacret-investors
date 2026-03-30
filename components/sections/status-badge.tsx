import type { UnitStatus } from "@/lib/sanity/types";

type StatusBadgeProps = {
  status: UnitStatus;
  labelAvailable?: string;
  labelReserved?: string;
  labelSold?: string;
};

const DEFAULT_LABELS: Record<UnitStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export function StatusBadge({ status, labelAvailable, labelReserved, labelSold }: StatusBadgeProps) {
  const resolved: Record<UnitStatus, string> = {
    available: labelAvailable || DEFAULT_LABELS.available,
    reserved: labelReserved || DEFAULT_LABELS.reserved,
    sold: labelSold || DEFAULT_LABELS.sold,
  };
  return <span className={`badge badge-${status}`}>{resolved[status]}</span>;
}
