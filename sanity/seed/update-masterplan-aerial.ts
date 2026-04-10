/**
 * Upload new masterplan aerial image (with compass) and set it as masterplanPage.heroImage.
 * Run: npx tsx sanity/seed/update-masterplan-aerial.ts
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

function loadEnv(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const name of [".env", ".env.local"]) {
    const p = path.resolve(process.cwd(), name);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf-8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      vars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return vars;
}

const env = loadEnv();
const client = createClient({
  projectId: env["NEXT_PUBLIC_SANITY_PROJECT_ID"],
  dataset: env["NEXT_PUBLIC_SANITY_DATASET"] ?? "production",
  token: env["SANITY_WRITE_TOKEN"],
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function main() {
  const imagePath = path.resolve(
    process.cwd(),
    "public/images/home/masterplan/masterplan-aerial-compass.jpeg"
  );

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }

  console.log("\n📸 Uploading new masterplan aerial (with compass)...\n");

  const imageAsset = await client.assets.upload("image", fs.createReadStream(imagePath), {
    filename: "masterplan-aerial-compass.jpeg",
    contentType: "image/jpeg",
  });

  console.log(`  ✓ Uploaded: ${imageAsset._id}`);

  // Find masterplanPage document
  const masterplanPage = await client.fetch<{ _id: string } | null>(
    `*[_type == "masterplanPage"][0]{ _id }`
  );

  if (!masterplanPage) {
    console.error("  ✗ masterplanPage document not found in Sanity");
    return;
  }

  await client
    .patch(masterplanPage._id)
    .set({
      heroImage: {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      },
    })
    .commit();

  console.log(`  ✓ masterplanPage.heroImage updated (${masterplanPage._id})`);
  console.log("\n✅ Done!\n");
}

main().catch(console.error);
