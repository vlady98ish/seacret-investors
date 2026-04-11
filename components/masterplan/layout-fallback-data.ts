/**
 * Hardcoded layout plan images and unit positions.
 * Used as fallback until data is uploaded to Sanity.
 * Delete this file once all plots have Sanity layout data.
 */

type FallbackFloor = {
  label?: string;
  imagePath: string;
};

type FallbackUnitPosition = {
  unitNumber: string;
  floorIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

type FallbackPlotLayout = {
  floors: FallbackFloor[];
  unitPositions: FallbackUnitPosition[];
};

function getPlotLetter(name: string): string {
  const match = name.match(/[A-F]/i);
  return match ? match[0].toUpperCase() : "";
}

const layouts: Record<string, FallbackPlotLayout> = {
  A: {
    floors: [{ imagePath: "/images/layouts/plot-a.png" }],
    unitPositions: [
      { unitNumber: "A1", floorIndex: 0, x: 8, y: 10, width: 22, height: 75 },
      { unitNumber: "A2", floorIndex: 0, x: 32, y: 10, width: 20, height: 75 },
      { unitNumber: "A3", floorIndex: 0, x: 54, y: 10, width: 18, height: 75 },
      { unitNumber: "A4", floorIndex: 0, x: 74, y: 10, width: 18, height: 75 },
    ],
  },
  B: {
    floors: [{ imagePath: "/images/layouts/plot-b.png" }],
    unitPositions: [
      { unitNumber: "B1", floorIndex: 0, x: 5, y: 6, width: 18, height: 38 },
      { unitNumber: "B2", floorIndex: 0, x: 24, y: 12, width: 16, height: 30 },
      { unitNumber: "B3", floorIndex: 0, x: 41, y: 18, width: 16, height: 28 },
      { unitNumber: "B4", floorIndex: 0, x: 58, y: 24, width: 16, height: 28 },
      { unitNumber: "B5", floorIndex: 0, x: 5, y: 52, width: 30, height: 40 },
    ],
  },
  C: {
    floors: [{ imagePath: "/images/layouts/plot-c.png" }],
    unitPositions: [
      { unitNumber: "C1", floorIndex: 0, x: 5, y: 6, width: 18, height: 35 },
      { unitNumber: "C2", floorIndex: 0, x: 24, y: 10, width: 16, height: 32 },
      { unitNumber: "C3", floorIndex: 0, x: 41, y: 16, width: 16, height: 30 },
      { unitNumber: "C4", floorIndex: 0, x: 58, y: 22, width: 16, height: 28 },
      { unitNumber: "C5", floorIndex: 0, x: 5, y: 50, width: 30, height: 42 },
    ],
  },
  D: {
    floors: [{ imagePath: "/images/layouts/plot-d.png" }],
    unitPositions: [
      { unitNumber: "D1", floorIndex: 0, x: 5, y: 6, width: 18, height: 35 },
      { unitNumber: "D2", floorIndex: 0, x: 24, y: 10, width: 16, height: 32 },
      { unitNumber: "D3", floorIndex: 0, x: 41, y: 16, width: 16, height: 30 },
      { unitNumber: "D4", floorIndex: 0, x: 58, y: 22, width: 16, height: 28 },
      { unitNumber: "D5", floorIndex: 0, x: 5, y: 50, width: 30, height: 42 },
    ],
  },
  E: {
    floors: [
      { label: "Ground Floor", imagePath: "/images/layouts/plot-e-ground.png" },
      { label: "1st Floor", imagePath: "/images/layouts/plot-e-upper.png" },
    ],
    unitPositions: [
      // Ground floor — LOLA
      { unitNumber: "E1", floorIndex: 0, x: 5, y: 8, width: 17, height: 40 },
      { unitNumber: "E2", floorIndex: 0, x: 24, y: 8, width: 17, height: 40 },
      { unitNumber: "E3", floorIndex: 0, x: 43, y: 8, width: 17, height: 40 },
      { unitNumber: "E4", floorIndex: 0, x: 62, y: 8, width: 17, height: 40 },
      { unitNumber: "E5", floorIndex: 0, x: 81, y: 8, width: 14, height: 40 },
      // 1st floor — MIKA
      { unitNumber: "E6", floorIndex: 1, x: 5, y: 8, width: 17, height: 40 },
      { unitNumber: "E7", floorIndex: 1, x: 24, y: 8, width: 17, height: 40 },
      { unitNumber: "E8", floorIndex: 1, x: 43, y: 8, width: 17, height: 40 },
      { unitNumber: "E9", floorIndex: 1, x: 62, y: 8, width: 17, height: 40 },
      { unitNumber: "E10", floorIndex: 1, x: 81, y: 8, width: 14, height: 40 },
    ],
  },
  F: {
    floors: [
      { label: "Ground Floor", imagePath: "/images/layouts/plot-f-ground.png" },
      { label: "1st Floor", imagePath: "/images/layouts/plot-f-upper.png" },
    ],
    unitPositions: [
      // Ground floor — LOLA
      { unitNumber: "F1", floorIndex: 0, x: 5, y: 8, width: 17, height: 40 },
      { unitNumber: "F2", floorIndex: 0, x: 24, y: 8, width: 17, height: 40 },
      { unitNumber: "F3", floorIndex: 0, x: 43, y: 8, width: 17, height: 40 },
      { unitNumber: "F4", floorIndex: 0, x: 62, y: 8, width: 17, height: 40 },
      { unitNumber: "F5", floorIndex: 0, x: 81, y: 8, width: 14, height: 40 },
      // 1st floor — MIKA
      { unitNumber: "F6", floorIndex: 1, x: 5, y: 8, width: 17, height: 40 },
      { unitNumber: "F7", floorIndex: 1, x: 24, y: 8, width: 17, height: 40 },
      { unitNumber: "F8", floorIndex: 1, x: 43, y: 8, width: 17, height: 40 },
      { unitNumber: "F9", floorIndex: 1, x: 62, y: 8, width: 17, height: 40 },
      { unitNumber: "F10", floorIndex: 1, x: 81, y: 8, width: 14, height: 40 },
    ],
  },
};

export function getFallbackLayout(plotName: string): FallbackPlotLayout | null {
  const letter = getPlotLetter(plotName);
  return layouts[letter] ?? null;
}
