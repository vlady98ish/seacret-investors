/**
 * Hardcoded layout plan images and unit pin positions.
 * Uses cropped presentation slide images as background with clickable pins on top.
 * Delete this file once all plots have Sanity layout data.
 */

type FallbackFloor = {
  label?: string;
  imagePath: string;
};

/** Pin position: x/y are percentage coordinates for the center of the pin */
type FallbackUnitPin = {
  unitNumber: string;
  floorIndex: number;
  x: number;
  y: number;
};

type FallbackPlotLayout = {
  floors: FallbackFloor[];
  unitPins: FallbackUnitPin[];
};

function getPlotLetter(name: string): string {
  const match = name.match(/[A-F]/i);
  return match ? match[0].toUpperCase() : "";
}

const layouts: Record<string, FallbackPlotLayout> = {
  A: {
    floors: [{ imagePath: "/images/layouts/plot-a-plan.png" }],
    unitPins: [
      { unitNumber: "A1", floorIndex: 0, x: 52, y: 20 },
      { unitNumber: "A2", floorIndex: 0, x: 48, y: 46 },
      { unitNumber: "A3", floorIndex: 0, x: 50, y: 68 },
      { unitNumber: "A4", floorIndex: 0, x: 50, y: 83 },
    ],
  },
  B: {
    floors: [{ imagePath: "/images/layouts/plot-b-plan.png" }],
    unitPins: [
      { unitNumber: "B1", floorIndex: 0, x: 48, y: 15 },
      { unitNumber: "B2", floorIndex: 0, x: 48, y: 32 },
      { unitNumber: "B3", floorIndex: 0, x: 50, y: 50 },
      { unitNumber: "B4", floorIndex: 0, x: 38, y: 72 },
      { unitNumber: "B5", floorIndex: 0, x: 58, y: 78 },
    ],
  },
  C: {
    floors: [{ imagePath: "/images/layouts/plot-c-plan.png" }],
    unitPins: [
      { unitNumber: "C1", floorIndex: 0, x: 55, y: 82 },
      { unitNumber: "C2", floorIndex: 0, x: 50, y: 62 },
      { unitNumber: "C3", floorIndex: 0, x: 48, y: 45 },
      { unitNumber: "C4", floorIndex: 0, x: 72, y: 22 },
      { unitNumber: "C5", floorIndex: 0, x: 40, y: 18 },
    ],
  },
  D: {
    floors: [{ imagePath: "/images/layouts/plot-d-plan.png" }],
    unitPins: [
      { unitNumber: "D1", floorIndex: 0, x: 52, y: 85 },
      { unitNumber: "D2", floorIndex: 0, x: 50, y: 68 },
      { unitNumber: "D3", floorIndex: 0, x: 48, y: 50 },
      { unitNumber: "D4", floorIndex: 0, x: 48, y: 35 },
      { unitNumber: "D5", floorIndex: 0, x: 48, y: 16 },
    ],
  },
  E: {
    floors: [
      { label: "Ground Floor", imagePath: "/images/layouts/plot-e-ground.png" },
      { label: "1st Floor", imagePath: "/images/layouts/plot-e-upper.png" },
    ],
    unitPins: [
      // Ground floor — LOLA
      { unitNumber: "E1", floorIndex: 0, x: 42, y: 88 },
      { unitNumber: "E2", floorIndex: 0, x: 42, y: 70 },
      { unitNumber: "E3", floorIndex: 0, x: 42, y: 50 },
      { unitNumber: "E4", floorIndex: 0, x: 38, y: 33 },
      { unitNumber: "E5", floorIndex: 0, x: 38, y: 17 },
      // 1st floor — MIKA
      { unitNumber: "E6", floorIndex: 1, x: 45, y: 85 },
      { unitNumber: "E7", floorIndex: 1, x: 45, y: 68 },
      { unitNumber: "E8", floorIndex: 1, x: 45, y: 48 },
      { unitNumber: "E9", floorIndex: 1, x: 45, y: 30 },
      { unitNumber: "E10", floorIndex: 1, x: 45, y: 15 },
    ],
  },
  F: {
    floors: [
      { label: "Ground Floor", imagePath: "/images/layouts/plot-f-ground.png" },
      { label: "1st Floor", imagePath: "/images/layouts/plot-f-upper.png" },
    ],
    unitPins: [
      // Ground floor — LOLA
      { unitNumber: "F1", floorIndex: 0, x: 48, y: 82 },
      { unitNumber: "F2", floorIndex: 0, x: 45, y: 62 },
      { unitNumber: "F3", floorIndex: 0, x: 38, y: 42 },
      { unitNumber: "F4", floorIndex: 0, x: 42, y: 28 },
      { unitNumber: "F5", floorIndex: 0, x: 42, y: 14 },
      // 1st floor — MIKA
      { unitNumber: "F6", floorIndex: 1, x: 50, y: 82 },
      { unitNumber: "F7", floorIndex: 1, x: 48, y: 65 },
      { unitNumber: "F8", floorIndex: 1, x: 48, y: 48 },
      { unitNumber: "F9", floorIndex: 1, x: 52, y: 25 },
      { unitNumber: "F10", floorIndex: 1, x: 52, y: 12 },
    ],
  },
};

export function getFallbackLayout(plotName: string): FallbackPlotLayout | null {
  const letter = getPlotLetter(plotName);
  return layouts[letter] ?? null;
}
