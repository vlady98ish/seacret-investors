/**
 * Uploads every image in public/images/home/masterplan/ to Sanity and sets
 * homePage.masterplanGallery so Studio matches what the site shows from /public.
 *
 * Requires SANITY_WRITE_TOKEN in .env.local (or .env).
 *
 * Usage: npx tsx sanity/seed/push-home-masterplan-gallery-to-sanity.ts
 */

import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

import { listPublicMasterplanGalleryPaths } from "../../lib/home-masterplan-gallery";

function loadEnv(): { projectId: string; dataset: string; token: string } {
  const merged: Record<string, string> = {};
  for (const name of [".env", ".env.local"]) {
    const p = path.resolve(process.cwd(), name);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const i = line.indexOf("=");
      if (i > 0) merged[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? merged.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ?? merged.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token =
    process.env.SANITY_WRITE_TOKEN ??
    process.env.SANITY_API_TOKEN ??
    merged.SANITY_WRITE_TOKEN ??
    merged.SANITY_API_TOKEN ??
    "";
  if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env or .env.local");
  if (!token) {
    throw new Error(
      "Missing write token: set SANITY_WRITE_TOKEN (recommended: add to .env.local) or export it in the shell, then run npm run cms:masterplan-gallery",
    );
  }
  return { projectId, dataset, token };
}

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function main() {
  const { projectId, dataset, token } = loadEnv();
  const paths = listPublicMasterplanGalleryPaths();
  if (paths.length < 2) {
    console.error("Need at least 2 images in public/images/home/masterplan/ (sorted by filename).");
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-28",
    useCdn: false,
    token,
  });

  const home = await client.fetch<{ _id: string } | null>('*[_type == "homePage"][0]{ _id }');
  if (!home?._id) {
    console.error("No homePage document in dataset.");
    process.exit(1);
  }

  const gallery: Array<{ _type: "image"; asset: { _type: "reference"; _ref: string } }> = [];

  for (const filePath of paths) {
    const filename = path.basename(filePath);
    console.log(`↑ ${filename}`);
    const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
      filename,
      contentType: contentTypeFor(filePath),
    });
    gallery.push({ _type: "image", asset: { _type: "reference", _ref: asset._id } });
  }

  await client.patch(home._id).set({ masterplanGallery: gallery }).commit();

  console.log(`\n✓ homePage.masterplanGallery → ${gallery.length} images (Studio should match the site now)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
