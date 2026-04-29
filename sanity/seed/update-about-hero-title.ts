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
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function main() {
  const patch = {
    heroTitle: {
      en: "Live Better Group",
      ru: "Live Better Group",
      he: "Live Better Group",
      el: "Live Better Group",
    },
  };

  console.log(`\nUpdating aboutPage hero title in ${projectId}/${dataset}...\n`);

  for (const id of ["aboutPage", "drafts.aboutPage"]) {
    try {
      await client.patch(id).set(patch).commit();
      console.log(`  ✓ updated ${id}`);
    } catch {
      // ignore missing doc version
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nFailed:", err);
  process.exit(1);
});
