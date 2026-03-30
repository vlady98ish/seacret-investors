import { readFileSync } from "fs";
import { createClient } from "@sanity/client";
import { resolve } from "path";

// Parse .env files manually
function loadEnv(filePath: string) {
  try {
    const content = readFileSync(filePath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
      }
    }
  } catch {}
}

loadEnv(resolve(__dirname, "../../.env.local"));
loadEnv(resolve(__dirname, "../../.env"));

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-28",
  useCdn: false,
});

// Recursively find all localeString/localeText fields missing Russian
function findMissingRu(obj: any, path: string, results: { path: string; en: string }[]) {
  if (!obj || typeof obj !== "object") return;

  // Check if this is a locale object (has 'en' key and is a simple string value)
  if (typeof obj.en === "string" && obj.en.length > 0) {
    if (!obj.ru || obj.ru.trim() === "") {
      results.push({ path, en: obj.en.substring(0, 80) });
    }
    return;
  }

  // Recurse into arrays
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => findMissingRu(item, `${path}[${i}]`, results));
    return;
  }

  // Recurse into objects
  for (const key of Object.keys(obj)) {
    if (key.startsWith("_")) continue;
    findMissingRu(obj[key], path ? `${path}.${key}` : key, results);
  }
}

async function main() {
  // Fetch all documents (excluding system types)
  const docs = await client.fetch(`*[!(_type in ["sanity.imageAsset", "sanity.fileAsset"])]`);

  console.log(`\nChecked ${docs.length} documents\n`);
  console.log("=== MISSING RUSSIAN TRANSLATIONS ===\n");

  let totalMissing = 0;

  for (const doc of docs) {
    const results: { path: string; en: string }[] = [];
    findMissingRu(doc, "", results);

    if (results.length > 0) {
      const title = doc.name || doc.title || doc.fullName || doc.companyName || doc._type;
      console.log(`📄 ${doc._type} — "${title}"`);
      for (const r of results) {
        console.log(`   ❌ ${r.path} — EN: "${r.en}"`);
      }
      console.log();
      totalMissing += results.length;
    }
  }

  if (totalMissing === 0) {
    console.log("✅ All locale fields have Russian translations!");
  } else {
    console.log(`\nTotal missing: ${totalMissing} fields`);
  }
}

main().catch(console.error);
