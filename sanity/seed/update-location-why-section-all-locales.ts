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
    vars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
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

const WHY_SECTION = {
  en: "A destination for those who choose authenticity - a place where time moves differently.",
  ru: "Локация для тех, кто выбирает подлинность — место, где время течёт по-другому.",
  he: "לוקיישן למי שבוחר באותנטיות — מקום שבו הזמן זורם אחרת.",
  el: "Ένας προορισμός για όσους επιλέγουν την αυθεντικότητα — ένας τόπος όπου ο χρόνος κυλά αλλιώς.",
};

async function patchOne(id: string) {
  await client.patch(id).set({ whySection: WHY_SECTION }).commit();
  console.log(`✓ Patched ${id}`);
}

async function main() {
  try {
    await patchOne("locationPage");
  } catch {
    await patchOne("drafts.locationPage");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
