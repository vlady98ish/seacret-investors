/**
 * One-time migration: populate unit floor breakdowns from Excel MASTER tab.
 * Also fixes D4/D5 bedrooms to 3 and renames Mikka → Mika.
 *
 * Run: npx tsx sanity/seed/migrate-unit-details.ts
 */

import { createClient } from "@sanity/client";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// 1. Load env (same pattern as seed-data.ts)
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
// 2. Read Excel
// ---------------------------------------------------------------------------

const EXCEL_PATH = path.resolve(
  process.env.HOME || "~",
  "Downloads/YAIR villa_system_22_03_26.xlsx"
);

if (!fs.existsSync(EXCEL_PATH)) {
  throw new Error(`Excel file not found at ${EXCEL_PATH}`);
}

const wb = XLSX.readFile(EXCEL_PATH);
const ws = wb.Sheets["MASTER"];
if (!ws) throw new Error("MASTER sheet not found in Excel");

const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { header: 1 }) as unknown[][];

// Find header row (contains "Villa ID")
let headerIdx = -1;
for (let i = 0; i < rows.length; i++) {
  const row = rows[i] as string[];
  if (row && row.some((cell) => String(cell).includes("Villa ID"))) {
    headerIdx = i;
    break;
  }
}

if (headerIdx === -1) throw new Error("Could not find header row in MASTER sheet");

const headers = (rows[headerIdx] as string[]).map((h) => String(h).trim());
const dataRows = rows.slice(headerIdx + 1).filter((row) => {
  const r = row as unknown[];
  return r[0] && r[1]; // has Plot and Villa ID
});

// Column indices
const col = (name: string) => headers.indexOf(name);
const COL_ID = col("Villa ID");
const COL_GROUND = col("ground floor");
const COL_FIRST = col("first floor");
const COL_SECOND = col("second floor");
const COL_BALCONY = col("Balcony m²");
const COL_ROOF = col("Roof terassa m²");
const COL_BEDROOMS = col("Bedrooms");

console.log("Column mapping:", { COL_ID, COL_GROUND, COL_FIRST, COL_SECOND, COL_BALCONY, COL_ROOF, COL_BEDROOMS });

// ---------------------------------------------------------------------------
// 3. Build patches
// ---------------------------------------------------------------------------

type Patch = {
  unitId: string;
  fields: Record<string, number | undefined>;
};

const patches: Patch[] = [];

for (const row of dataRows) {
  const r = row as unknown[];
  const villaId = String(r[COL_ID]).trim();
  if (!villaId || villaId === "undefined") continue;

  const unitId = `unit-${villaId.toLowerCase()}`;

  const num = (idx: number): number | undefined => {
    const val = Number(r[idx]);
    return isNaN(val) || val === 0 ? undefined : Math.round(val * 100) / 100;
  };

  const fields: Record<string, number | undefined> = {
    groundFloor: num(COL_GROUND),
    upperFloor: num(COL_FIRST),
    attic: num(COL_SECOND),
    balcony: num(COL_BALCONY),
    roofTerrace: num(COL_ROOF),
  };

  // Fix D4/D5 bedrooms
  if (villaId === "D4" || villaId === "D5") {
    fields.bedrooms = 3;
  }

  patches.push({ unitId, fields });
}

console.log(`\nFound ${patches.length} units to patch.\n`);

// ---------------------------------------------------------------------------
// 4. Apply patches
// ---------------------------------------------------------------------------

async function run() {
  for (const { unitId, fields } of patches) {
    const cleanFields: Record<string, number> = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) cleanFields[k] = v;
    }

    if (Object.keys(cleanFields).length === 0) {
      console.log(`  ⏭ ${unitId} — no fields to update`);
      continue;
    }

    try {
      try {
        await client.patch(unitId).set(cleanFields).commit();
        console.log(`  ✓ ${unitId} (published)`, cleanFields);
      } catch {
        await client.patch(`drafts.${unitId}`).set(cleanFields).commit();
        console.log(`  ✓ ${unitId} (draft)`, cleanFields);
      }
    } catch (err) {
      console.error(`  ✗ ${unitId}`, err);
    }
  }

  // Rename Mikka → Mika
  console.log("\nRenaming Mikka → Mika...");
  const mikaFields = { name: "Mika", slug: { _type: "slug", current: "mika" } };
  try {
    await client.patch("villa-mikka").set(mikaFields).commit();
    console.log("  ✓ villa-mikka → Mika (published)");
  } catch {
    try {
      await client.patch("drafts.villa-mikka").set(mikaFields).commit();
      console.log("  ✓ villa-mikka → Mika (draft)");
    } catch (err) {
      console.error("  ✗ rename failed:", err);
    }
  }

  console.log("\nDone!");
}

run().catch(console.error);
