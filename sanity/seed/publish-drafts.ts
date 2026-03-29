/**
 * Publish all Sanity drafts
 * Run: cd seacret-investors-v2 && npx tsx sanity/seed/publish-drafts.ts
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// 1. Read .env.local
// ---------------------------------------------------------------------------

function loadEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env.local not found at ${envPath}`);
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

// ---------------------------------------------------------------------------
// 2. Fetch all drafts and publish them
// ---------------------------------------------------------------------------

async function publishAllDrafts() {
  // Fetch all draft documents
  const drafts = await client.fetch<Array<{ _id: string; _type: string }>>(
    `*[_id in path("drafts.**")]{ _id, _type }`
  );

  if (drafts.length === 0) {
    console.log("No drafts found — everything is already published.");
    return;
  }

  console.log(`Found ${drafts.length} draft(s). Publishing...\n`);

  let published = 0;
  let failed = 0;

  for (const draft of drafts) {
    const publishedId = draft._id.replace(/^drafts\./, "");
    try {
      // Fetch the full draft document
      const doc = await client.getDocument(draft._id);
      if (!doc) {
        console.log(`  ⚠ ${draft._type} — ${draft._id} (not found, skipping)`);
        failed++;
        continue;
      }

      // Remove internal fields and set the published _id
      const { _rev, _updatedAt, _createdAt, ...rest } = doc;
      const publishedDoc = { ...rest, _id: publishedId };

      // Create or replace the published version
      await client.createOrReplace(publishedDoc);

      // Delete the draft
      await client.delete(draft._id);

      console.log(`  ✓ ${draft._type} — ${publishedId}`);
      published++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${draft._type} — ${draft._id}: ${msg}`);
      failed++;
    }
  }

  console.log(`\nDone: ${published} published, ${failed} failed.`);
}

publishAllDrafts().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
