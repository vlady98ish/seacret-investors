/**
 * Upload floor plan images to Sanity for Tai, Michal, and Yair villas.
 *
 * Usage: node scripts/upload-floorplans.mjs
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Load env
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

const UPLOADS = [
  { slug: "tai", file: "tai-floorplan.png", key: "tai-floorplan" },
  { slug: "michal", file: "michal-floorplan.png", key: "michal-floorplan" },
  { slug: "yair", file: "yair-floorplan.png", key: "yair-floorplan" },
];

async function main() {
  for (const { slug, file, key } of UPLOADS) {
    const filePath = path.join(root, "public/images/villas", file);
    console.log(`\n📷 Uploading ${file}...`);

    const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
      filename: file,
      contentType: "image/png",
    });
    console.log(`  ✓ Uploaded: ${asset._id}`);

    const villa = await client.fetch(
      '*[_type == "villa" && slug.current == $slug][0]{ _id, name, floorPlanImages }',
      { slug }
    );

    if (!villa) {
      console.error(`  ✗ Villa "${slug}" not found!`);
      continue;
    }

    const imageRef = {
      _type: "image",
      _key: key,
      asset: { _type: "reference", _ref: asset._id },
    };

    const existing = villa.floorPlanImages ?? [];
    await client
      .patch(villa._id)
      .set({ floorPlanImages: [...existing, imageRef] })
      .commit();

    console.log(`  ✓ ${villa.name} — floor plans now ${existing.length + 1} images`);
  }

  console.log("\n✅ All done!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
