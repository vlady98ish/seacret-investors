/**
 * Reads villa_system Excel MASTER sheet and writes lib/data/villa-master-units.json
 *
 * Usage:
 *   npx tsx scripts/import-villa-master-excel.ts [path/to/villa_system_22_03_26.xlsx]
 *
 * Default: C:/Users/User/Downloads/villa_system_22_03_26.xlsx
 */

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

import type { VillaMasterById, VillaMasterRecord } from "../lib/villa-master-types";

const defaultPath = "C:/Users/User/Downloads/villa_system_22_03_26.xlsx";
const outPath = path.resolve(process.cwd(), "lib/data/villa-master-units.json");

function findHeaderRow(rows: unknown[][]): number {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    if (row?.some((c) => String(c).trim() === "Villa ID")) return i;
  }
  throw new Error("MASTER sheet: could not find header row with 'Villa ID'");
}

function cellNum(v: unknown): number | null {
  if (v === "" || v === null || v === undefined) return null;
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  const s = String(v).trim().replace(/[€,\s]/g, "");
  if (s === "" || s === "ok") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function cellText(v: unknown): string | null {
  if (v === "" || v === null || v === undefined) return null;
  return String(v).trim() || null;
}

/**
 * MASTER reuses E1–F5 for both Lola (ground) and Mika (upper) on plots E/F.
 * CMS uses E1–E5 / F1–F5 for Lola and E6–E10 / F6–F10 for Mika.
 */
function canonicalUnitNumber(plot: string, villaId: string, type: string): string {
  const t = type.trim().toLowerCase();
  const isMika = t === "mika" || t === "mikka";
  const p = plot.trim().toUpperCase();
  const m = villaId.trim().toUpperCase().match(/^([EF])([1-5])$/);
  if (isMika && m && (p === "E" || p === "F")) {
    const letter = m[1];
    const n = parseInt(m[2], 10);
    return `${letter}${n + 5}`;
  }
  return villaId.trim().toUpperCase();
}

function rowToRecord(headers: string[], row: unknown[]): VillaMasterRecord | null {
  const col = (name: string) => {
    const i = headers.indexOf(name);
    return i === -1 ? -1 : i;
  };

  const idxVilla = col("Villa ID");
  if (idxVilla < 0) return null;
  const villaId = cellText(row[idxVilla]);
  if (!villaId || villaId === "undefined") return null;

  const num = (name: string) => {
    const i = col(name);
    return i < 0 ? null : cellNum(row[i]);
  };

  const txt = (name: string) => {
    const i = col(name);
    if (i < 0) return null;
    const raw = row[i];
    if (raw === "" || raw === null || raw === undefined) return null;
    if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
    const s = String(raw).trim();
    return s || null;
  };

  return {
    plot: txt("Plot") ?? "",
    villaId,
    type: txt("Type") ?? "",
    floors: num("Floors"),
    builtM2: num("Built m²"),
    groundFloor: num("ground floor"),
    firstFloor: num("first floor"),
    secondFloor: num("second floor"),
    plotSize: num("plot size"),
    gardenM2: num("Garden m²"),
    balconyM2: num("Balcony m²"),
    roofTerraceM2: num("Roof terassa m²"),
    poolM2: num("Pool m²"),
    parkingSpaces: num("Parking Spaces"),
    bedrooms: num("Bedrooms"),
    bathrooms: num("Bathrooms"),
    livingM2: num("Living m²"),
    bedroomGroundFloor: txt("bedroom ground floor"),
    livingRoomFirstFloor: txt("living room first floor"),
    bedroomFirstFloor: txt("bedroom first floor"),
    bedroomSecondFloor: txt("bedroom second floor"),
    status: txt("Status") ?? "",
    priceEur: num("Price (€)"),
    pricePerBuiltM2: num("Price / Built m² (€)"),
  };
}

function main() {
  const xlsxPath = path.resolve(process.argv[2] || defaultPath);
  if (!fs.existsSync(xlsxPath)) {
    console.error("File not found:", xlsxPath);
    process.exit(1);
  }

  const wb = XLSX.readFile(xlsxPath);
  const ws = wb.Sheets["MASTER"];
  if (!ws) {
    console.error("Sheet MASTER not found. Sheets:", wb.SheetNames.join(", "));
    process.exit(1);
  }

  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as unknown[][];
  const headerIdx = findHeaderRow(rows);
  const headers = (rows[headerIdx] as unknown[]).map((h) => String(h).trim());

  const byId: VillaMasterById = {};

  for (let r = headerIdx + 1; r < rows.length; r++) {
    const rec = rowToRecord(headers, rows[r] as unknown[]);
    if (!rec) continue;
    const key = canonicalUnitNumber(rec.plot, rec.villaId, rec.type);
    byId[key] = { ...rec, villaId: key };
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(byId, null, 2), "utf-8");
  console.log(`Wrote ${Object.keys(byId).length} units to ${outPath}`);
}

main();
