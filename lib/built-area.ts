/** Built indoor area (m²): ground + upper + attic when present, else totalArea. */
export type BuiltAreaFields = {
  totalArea: number;
  groundFloor?: number;
  upperFloor?: number;
  attic?: number;
};

export function getBuiltAreaM2(unit: BuiltAreaFields): number {
  const g = unit.groundFloor ?? 0;
  const u = unit.upperFloor ?? 0;
  const a = unit.attic ?? 0;
  const sum = g + u + a;
  return sum > 0 ? Math.round(sum * 100) / 100 : unit.totalArea;
}
