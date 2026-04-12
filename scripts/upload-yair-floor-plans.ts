/**
 * Upload only Yair floor plan images from public/villas/ to Sanity (no Vercel fetch for other assets).
 *
 * Usage: npx tsx scripts/upload-yair-floor-plans.ts
 */

import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

const envPath = [path.resolve(process.cwd(), ".env.local"), path.resolve(process.cwd(), ".env")].find((p) =>
  fs.existsSync(p)
);
if (!envPath) {
  throw new Error("Missing .env.local or .env");
}
const env: Record<string, string> = {};
for (const l of fs.readFileSync(envPath, "utf8").split("\n")) {
  const idx = l.indexOf("=");
  if (idx > 0) env[l.slice(0, idx).trim()] = l.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-03-28",
  useCdn: false,
  token: env.SANITY_WRITE_TOKEN!,
});

const PLANS = ["/villas/yair-ground-floor.png"];

async function uploadLocalPublic(urlPath: string) {
  const localPublic = path.join(process.cwd(), "public", urlPath.replace(/^\//, ""));
  if (!fs.existsSync(localPublic)) {
    throw new Error(`Missing file: ${localPublic}`);
  }
  const ext = path.extname(localPublic).slice(1) || "png";
  const contentType = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
  const filename = path.basename(localPublic);
  console.log(`↑ Uploading ${filename} to Sanity`);
  const asset = await client.assets.upload("image", fs.createReadStream(localPublic), {
    filename,
    contentType,
  });
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
}

async function main() {
  const villa = await client.fetch<{ _id: string; name: string } | null>(
    '*[_type == "villa" && name == "Yair"][0]{ _id, name }'
  );
  if (!villa) {
    throw new Error('No villa document with name "Yair"');
  }

  const floorPlanImages = await Promise.all(PLANS.map(uploadLocalPublic));
  await client.patch(villa._id).set({ floorPlanImages }).commit();
  console.log(`✓ Yair floorPlanImages updated (${floorPlanImages.length} image(s))`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
