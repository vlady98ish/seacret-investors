/**
 * Fix Yehonatan villa:
 * 1. Revert hero image to the original
 * 2. Move the 3D render to floorPlanImages
 *
 * Usage: node scripts/fix-yehonatan.mjs
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const envPath = path.join(root, ".env.local");
const envLines = fs.readFileSync(envPath, "utf8").split("\n");
const env = {};
for (const l of envLines) {
  const idx = l.indexOf("=");
  if (idx > 0) env[l.slice(0, idx).trim()] = l.slice(idx + 1).trim();
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-03-28",
  useCdn: false,
  token: env.SANITY_WRITE_TOKEN,
});

const THREE_D_ASSET_ID = "image-b7fc7706081373d8f46fed80a7f5fc1b4cc3d523-512x343-jpg";

async function main() {
  const villa = await client.fetch(
    '*[_type == "villa" && slug.current == "yehonatan"][0]{ _id, name, heroImage, galleryImages, floorPlanImages }'
  );

  if (!villa) {
    console.error("Villa Yehonatan not found!");
    process.exit(1);
  }

  console.log(`Found: ${villa.name} (${villa._id})`);

  // Find the original hero from galleryImages (first image that isn't the 3D render)
  const gallery = villa.galleryImages ?? [];
  const originalHero = gallery.find(
    (img) => img?.asset?._ref !== THREE_D_ASSET_ID
  );

  if (originalHero) {
    // Restore hero to the first gallery image (the original hero)
    console.log("Restoring hero from gallery...");
    await client.patch(villa._id).set({
      heroImage: {
        _type: "image",
        asset: { _type: "reference", _ref: originalHero.asset._ref },
      },
    }).commit();
    console.log("  ✓ Hero image reverted");
  } else {
    console.log("⚠ No original hero found in gallery, checking asset history...");
    // Query for the original yehonatan-hero asset
    const assets = await client.fetch(
      '*[_type == "sanity.imageAsset" && originalFilename == "yehonatan-hero.png"][0]{ _id }'
    );
    if (assets) {
      await client.patch(villa._id).set({
        heroImage: {
          _type: "image",
          asset: { _type: "reference", _ref: assets._id },
        },
      }).commit();
      console.log("  ✓ Hero image reverted from original asset");
    } else {
      console.error("  ✗ Could not find original hero image!");
    }
  }

  // Now ensure 3D render is in floorPlanImages (not duplicated)
  const floorPlans = villa.floorPlanImages ?? [];
  const alreadyInPlans = floorPlans.some(
    (img) => img?.asset?._ref === THREE_D_ASSET_ID
  );

  if (!alreadyInPlans) {
    console.log("Adding 3D render to floor plans...");
    await client.patch(villa._id).set({
      floorPlanImages: [
        ...floorPlans,
        {
          _type: "image",
          _key: "yehonatan3dfloorplan",
          asset: { _type: "reference", _ref: THREE_D_ASSET_ID },
        },
      ],
    }).commit();
    console.log(`  ✓ Floor plans now ${floorPlans.length + 1} images`);
  } else {
    console.log("  3D render already in floor plans");
  }

  // Remove 3D render from galleryImages if present
  const cleanGallery = gallery.filter(
    (img) => img?.asset?._ref !== THREE_D_ASSET_ID
  );
  if (cleanGallery.length !== gallery.length) {
    console.log("Removing 3D render from gallery...");
    await client.patch(villa._id).set({ galleryImages: cleanGallery }).commit();
    console.log(`  ✓ Gallery cleaned (${cleanGallery.length} images)`);
  }

  console.log("\n✅ Done!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
