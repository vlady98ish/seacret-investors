/**
 * Hardcoded layout plan images and unit pin positions.
 * Uses full presentation slide images as background with clickable pins on top.
 * Delete this file once all plots have Sanity layout data.
 */

type FallbackFloor = {
  label?: string;
  imagePath: string;
};

/** Pin position: x/y are percentage coordinates for the center of the pin on the slide image */
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

// Pin positions correspond to the numbered circles on the presentation slides
// x/y are percentages of the slide image (1920x1080)
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
};

export function getFallbackLayout(plotName: string): FallbackPlotLayout | null {
  const letter = getPlotLetter(plotName);
  return layouts[letter] ?? null;
}
