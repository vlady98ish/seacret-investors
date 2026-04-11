/**
 * Set the 3D floorplan as Yehonatan villa's hero image.
 *
 * Usage: node scripts/set-yehonatan-hero.mjs
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

const IMAGE_PATH = path.join(root, "public/images/villas/yehonatan-3d-floorplan.jpeg");

async function main() {
  console.log("Uploading image...");
  const asset = await client.assets.upload("image", fs.createReadStream(IMAGE_PATH), {
    filename: "yehonatan-3d-floorplan.jpeg",
    contentType: "image/jpeg",
  });
  console.log(`  ✓ Uploaded: ${asset._id}`);

  const villa = await client.fetch(
    '*[_type == "villa" && slug.current == "yehonatan"][0]{ _id, name }',
  );

  if (!villa) {
    console.error("Villa Yehonatan not found!");
    process.exit(1);
  }

  const heroImage = {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };

  await client.patch(villa._id).set({ heroImage }).commit();
  console.log(`  ✓ ${villa.name} hero image updated`);
  console.log("\n✅ Done!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
