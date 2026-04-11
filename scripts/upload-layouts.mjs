/**
 * Upload layout images to Sanity and set unit positions for all plots.
 * Usage: npx tsx scripts/upload-layouts.mjs
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
const envLines = fs.readFileSync(envPath, "utf8").split("\n");
const env = {};
for (const l of envLines) {
  const idx = l.indexOf("=");
  if (idx > 0) env[l.slice(0, idx).trim()] = l.slice(idx + 1).trim();
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-03-28",
  useCdn: false,
  token: env.SANITY_WRITE_TOKEN,
});

const plotLayouts = {
  A: [{ label: "", path: "public/images/layouts/plot-a-plan.png" }],
  B: [{ label: "", path: "public/images/layouts/plot-b-plan.png" }],
  C: [{ label: "", path: "public/images/layouts/plot-c-plan.png" }],
  D: [{ label: "", path: "public/images/layouts/plot-d-plan.png" }],
  E: [
    { label: "Ground Floor", path: "public/images/layouts/plot-e-ground.png" },
    { label: "1st Floor", path: "public/images/layouts/plot-e-upper.png" },
  ],
  F: [
    { label: "Ground Floor", path: "public/images/layouts/plot-f-ground.png" },
    { label: "1st Floor", path: "public/images/layouts/plot-f-upper.png" },
  ],
};

const pinPositions = {
  A: [
    { unitNumber: "A1", floorIndex: 0, x: 52, y: 20 },
    { unitNumber: "A2", floorIndex: 0, x: 48, y: 46 },
    { unitNumber: "A3", floorIndex: 0, x: 50, y: 68 },
    { unitNumber: "A4", floorIndex: 0, x: 50, y: 83 },
  ],
  B: [
    { unitNumber: "B1", floorIndex: 0, x: 48, y: 15 },
    { unitNumber: "B2", floorIndex: 0, x: 48, y: 32 },
    { unitNumber: "B3", floorIndex: 0, x: 50, y: 50 },
    { unitNumber: "B4", floorIndex: 0, x: 38, y: 72 },
    { unitNumber: "B5", floorIndex: 0, x: 58, y: 78 },
  ],
  C: [
    { unitNumber: "C1", floorIndex: 0, x: 55, y: 82 },
    { unitNumber: "C2", floorIndex: 0, x: 50, y: 62 },
    { unitNumber: "C3", floorIndex: 0, x: 48, y: 45 },
    { unitNumber: "C4", floorIndex: 0, x: 72, y: 22 },
    { unitNumber: "C5", floorIndex: 0, x: 40, y: 18 },
  ],
  D: [
    { unitNumber: "D1", floorIndex: 0, x: 52, y: 85 },
    { unitNumber: "D2", floorIndex: 0, x: 50, y: 68 },
    { unitNumber: "D3", floorIndex: 0, x: 48, y: 50 },
    { unitNumber: "D4", floorIndex: 0, x: 48, y: 35 },
    { unitNumber: "D5", floorIndex: 0, x: 48, y: 16 },
  ],
  E: [
    { unitNumber: "E1", floorIndex: 0, x: 42, y: 88 },
    { unitNumber: "E2", floorIndex: 0, x: 42, y: 70 },
    { unitNumber: "E3", floorIndex: 0, x: 42, y: 50 },
    { unitNumber: "E4", floorIndex: 0, x: 38, y: 33 },
    { unitNumber: "E5", floorIndex: 0, x: 38, y: 17 },
    { unitNumber: "E6", floorIndex: 1, x: 45, y: 85 },
    { unitNumber: "E7", floorIndex: 1, x: 45, y: 68 },
    { unitNumber: "E8", floorIndex: 1, x: 45, y: 48 },
    { unitNumber: "E9", floorIndex: 1, x: 45, y: 30 },
    { unitNumber: "E10", floorIndex: 1, x: 45, y: 15 },
  ],
  F: [
    { unitNumber: "F1", floorIndex: 0, x: 48, y: 82 },
    { unitNumber: "F2", floorIndex: 0, x: 45, y: 62 },
    { unitNumber: "F3", floorIndex: 0, x: 38, y: 42 },
    { unitNumber: "F4", floorIndex: 0, x: 42, y: 28 },
    { unitNumber: "F5", floorIndex: 0, x: 42, y: 14 },
    { unitNumber: "F6", floorIndex: 1, x: 50, y: 82 },
    { unitNumber: "F7", floorIndex: 1, x: 48, y: 65 },
    { unitNumber: "F8", floorIndex: 1, x: 48, y: 48 },
    { unitNumber: "F9", floorIndex: 1, x: 52, y: 25 },
    { unitNumber: "F10", floorIndex: 1, x: 52, y: 12 },
  ],
};

async function uploadImage(filePath) {
  const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  });
  return asset;
}

async function main() {
  const plots = await client.fetch(`*[_type == "plot"] | order(sortOrder asc) {
    _id, name,
    "units": *[_type == "unit" && plot._ref == ^._id] { _id, unitNumber } | order(unitNumber asc)
  }`);

  console.log("Found plots:", plots.map((p) => p.name).join(", "));

  for (const plot of plots) {
    const letter = plot.name.match(/[A-F]/i)?.[0]?.toUpperCase();
    if (!letter || !plotLayouts[letter]) {
      console.log(`Skipping ${plot.name}`);
      continue;
    }

    console.log(`\n=== ${plot.name} ===`);

    // Upload images
    const layoutImages = [];
    for (const floor of plotLayouts[letter]) {
      console.log(`  Uploading ${floor.path}...`);
      const asset = await uploadImage(floor.path);
      console.log(`  -> ${asset._id}`);
      layoutImages.push({
        _key: `floor-${layoutImages.length}`,
        label: floor.label || undefined,
        image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
      });
    }

    // Build unit positions
    const positions = pinPositions[letter] || [];
    const unitPositions = [];
    for (const pin of positions) {
      const unit = plot.units.find((u) => u.unitNumber === pin.unitNumber);
      if (!unit) {
        console.log(`  ⚠ unit ${pin.unitNumber} not found, skipping`);
        continue;
      }
      unitPositions.push({
        _key: `${unit._id.slice(-6)}-${pin.floorIndex}`,
        unit: { _type: "reference", _ref: unit._id },
        floorIndex: pin.floorIndex,
        x: pin.x,
        y: pin.y,
        width: 10,
        height: 10,
      });
      console.log(`  Pin ${pin.unitNumber} -> (${pin.x}, ${pin.y})`);
    }

    // Patch
    await client.patch(plot._id).set({ layoutImages, unitPositions }).commit();
    console.log(`  ✓ ${plot.name} updated`);
  }

  console.log("\n✅ Done!");
}

main().catch(console.error);
