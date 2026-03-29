import type { UnitStatus } from "@/lib/sanity/types";

type StatusBadgeProps = {
  status: UnitStatus;
};

const labels: Record<UnitStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge badge-${status}`}>{labels[status]}</span>;
}
