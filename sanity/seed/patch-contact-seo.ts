/**
 * One-off patch: remove "We respond within 24 hours" from contactPage seoDescription
 * Run: npx tsx sanity/seed/patch-contact-seo.ts
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

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
    const value = trimmed
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    vars[key] = value;
  }
  return vars;
}

const env = loadEnv();
const projectId = env["NEXT_PUBLIC_SANITY_PROJECT_ID"];
const dataset = env["NEXT_PUBLIC_SANITY_DATASET"] ?? "production";
const token = env["SANITY_WRITE_TOKEN"];

if (!projectId || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const NEW_DESCRIPTION =
  "Get in touch with The Sea'cret Residences team. Inquire about villa types, pricing, and availability.";

async function main() {
  // Try both published and draft versions
  for (const id of ["contactPage", "drafts.contactPage"]) {
    const doc = await client.getDocument(id);
    if (!doc) {
      console.log(`⏭  ${id} not found, skipping`);
      continue;
    }

    const current = doc.seoDescription?.en;
    console.log(`📄 ${id} current seoDescription.en:\n   "${current}"`);

    if (current && !current.includes("We respond within 24 hours")) {
      console.log(`✅ ${id} already clean, nothing to patch`);
      continue;
    }

    await client.patch(id).set({ "seoDescription.en": NEW_DESCRIPTION }).commit();
    console.log(`✅ ${id} patched successfully`);
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
