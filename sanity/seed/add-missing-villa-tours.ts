import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

function loadEnv(): Record<string, string> {
  const envLocalPath = path.resolve(process.cwd(), ".env.local");
  const envPath = fs.existsSync(envLocalPath)
    ? envLocalPath
    : path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    throw new Error(`Neither .env.local nor .env found in ${process.cwd()}`);
  }

  const raw = fs.readFileSync(envPath, "utf-8");
  const vars: Record<string, string> = {};

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    vars[key] = value;
  }

  return vars;
}

const env = loadEnv();
const projectId = env["NEXT_PUBLIC_SANITY_PROJECT_ID"];
const dataset = env["NEXT_PUBLIC_SANITY_DATASET"] ?? "production";
const token = env["SANITY_WRITE_TOKEN"];

if (!projectId || !token) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const TOUR_URLS: Record<string, string> = {
  "villa-michal": "https://kuula.co/share/collection/7MxrK?logo=1&info=0&logosize=115&fs=1&vr=1&initload=0&thumbs=1",
  "villa-lola": "https://kuula.co/share/collection/7MxtZ?logo=1&info=0&logosize=115&fs=1&vr=1&initload=0&thumbs=1",
  "villa-mika": "https://kuula.co/share/collection/7Mxtg?logo=1&info=0&logosize=115&fs=1&vr=1&initload=0&thumbs=1",
};

async function setTourUrlForDoc(baseId: string, tourUrl: string): Promise<number> {
  let updated = 0;
  for (const id of [baseId, `drafts.${baseId}`]) {
    try {
      await client.patch(id).set({ tourUrl }).commit();
      console.log(`  ✓ updated ${id}`);
      updated += 1;
    } catch {
      // ignore missing doc version
    }
  }
  return updated;
}

async function patchBySelectors(tourUrl: string, slugs: string[], names: string[]): Promise<number> {
  const docs = await client.fetch<Array<{ _id: string }>>(
    `*[_type == "villa" && (slug.current in $slugs || name in $names)]{_id}`,
    { slugs, names }
  );

  let updated = 0;
  for (const doc of docs) {
    try {
      await client.patch(doc._id).set({ tourUrl }).commit();
      console.log(`  ✓ updated ${doc._id}`);
      updated += 1;
    } catch {
      // ignore patch errors for individual docs
    }
  }
  return updated;
}

async function main() {
  console.log(`\nUpdating tourUrl for villas in ${projectId}/${dataset}...\n`);

  await setTourUrlForDoc("villa-michal", TOUR_URLS["villa-michal"]);
  await setTourUrlForDoc("villa-lola", TOUR_URLS["villa-lola"]);

  let mikaUpdates = await setTourUrlForDoc("villa-mika", TOUR_URLS["villa-mika"]);
  if (mikaUpdates === 0) {
    mikaUpdates = await setTourUrlForDoc("villa-mikka", TOUR_URLS["villa-mika"]);
  }
  if (mikaUpdates === 0) {
    mikaUpdates = await patchBySelectors(TOUR_URLS["villa-mika"], ["mika", "mikka"], ["Mika", "Mikka"]);
  }

  if (mikaUpdates === 0) {
    console.log("  ! Mika document not found by id/slug/name");
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nFailed:", err);
  process.exit(1);
});
