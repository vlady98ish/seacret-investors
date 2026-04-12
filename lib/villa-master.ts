import type { VillaMasterRecord } from "@/lib/villa-master-types";

import raw from "@/lib/data/villa-master-units.json";

const byId = raw as Record<string, VillaMasterRecord>;

export function getVillaMasterRecord(unitNumber: string): VillaMasterRecord | undefined {
  const key = unitNumber.trim().toUpperCase();
  return byId[key];
}
