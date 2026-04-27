/**
 * Sanity CMS seed script
 * Run: cd seacret-investors-v2 && npx tsx sanity/seed/seed-data.ts
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// 1. Read .env.local manually (tsx doesn't auto-load dotenv)
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

// ---------------------------------------------------------------------------
// 2. Sanity client
// ---------------------------------------------------------------------------

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ---------------------------------------------------------------------------
// 3. Helper: createOrReplace with deterministic _id
//
// The write token has "contributor" role, which allows creating/updating
// draft documents (drafts.*). We prefix all _id values with "drafts." so
// the token has permission to write. Open Sanity Studio → select all →
// Publish to make them live.
// ---------------------------------------------------------------------------

const DRAFT_PREFIX = "drafts.";

function draftId(id: string): string {
  return id.startsWith(DRAFT_PREFIX) ? id : `${DRAFT_PREFIX}${id}`;
}

async function upsert(doc: Record<string, unknown>) {
  const docWithDraftId = { ...doc, _id: draftId(doc._id as string) };
  const result = await client.createOrReplace(docWithDraftId as Parameters<typeof client.createOrReplace>[0]);
  console.log(`  ✓ ${doc._type} — ${docWithDraftId._id}`);
  return result;
}

// ---------------------------------------------------------------------------
// 4. Villa Types
// ---------------------------------------------------------------------------

const villas = [
  {
    _id: "villa-lola",
    _type: "villa",
    name: "Lola",
    slug: { _type: "slug", current: "lola" },
    tourUrl: "https://kuula.co/share/collection/7MxtZ?logo=1&info=0&logosize=115&fs=1&vr=1&initload=0&thumbs=1",
    typicalBedrooms: 1,
    typicalBathrooms: 1,
    areaRange: "49-52",
    sortOrder: 1,
    label: { en: "The Studio Retreat", he: "הסטודיו", ru: "Студия", el: "Το Στούντιο" },
    summary: {
      en: "A compact haven with private pool access, perfect for couples or as an investment property.",
      he: "מקלט קומפקטי עם גישה לבריכה פרטית",
      ru: "Компактный оазис с частным бассейном",
      el: "Ένα συμπαγές καταφύγιο με πρόσβαση σε ιδιωτική πισίνα",
    },
  },
  {
    _id: "villa-mika",
    _type: "villa",
    name: "Mika",
    slug: { _type: "slug", current: "mika" },
    tourUrl: "https://kuula.co/share/collection/7Mxtg?logo=1&info=0&logosize=115&fs=1&vr=1&initload=0&thumbs=1",
    typicalBedrooms: 1,
    typicalBathrooms: 1,
    areaRange: "59-63",
    sortOrder: 2,
    label: { en: "The Cozy Apartment", he: "הדירה הנעימה", ru: "Уютная квартира", el: "Το Άνετο Διαμέρισμα" },
    summary: {
      en: "Upper floor apartment with roof terrace and balcony. Sea and mountain views.",
      he: "דירת קומה עליונה עם מרפסת גג",
      ru: "Квартира на верхнем этаже с террасой на крыше",
      el: "Διαμέρισμα ορόφου με βεράντα στην οροφή",
    },
  },
  {
    _id: "villa-tai",
    _type: "villa",
    name: "Tai",
    slug: { _type: "slug", current: "tai" },
    typicalBedrooms: 2,
    typicalBathrooms: 2,
    areaRange: "85",
    sortOrder: 3,
    label: { en: "The Starter Villa", he: "הווילה הראשונה", ru: "Стартовая вилла", el: "Η Αρχική Βίλα" },
    summary: {
      en: "Two-story villa with private pool and garden. The perfect entry into coastal Greek living.",
      he: "וילה דו-קומתית עם בריכה פרטית וגינה",
      ru: "Двухэтажная вилла с бассейном и садом",
      el: "Διώροφη βίλα με ιδιωτική πισίνα και κήπο",
    },
  },
  {
    _id: "villa-michal",
    _type: "villa",
    name: "Michal",
    slug: { _type: "slug", current: "michal" },
    tourUrl: "https://kuula.co/share/collection/7MxrK?logo=1&info=0&logosize=115&fs=1&vr=1&initload=0&thumbs=1",
    typicalBedrooms: 3,
    typicalBathrooms: 2,
    areaRange: "130-134",
    sortOrder: 4,
    label: { en: "The Family Home", he: "בית המשפחה", ru: "Семейный дом", el: "Το Οικογενειακό Σπίτι" },
    summary: {
      en: "Spacious three-bedroom residence with attic, private pool, and generous outdoor living.",
      he: "מגורים מרווחים עם שלושה חדרי שינה",
      ru: "Просторная резиденция с тремя спальнями",
      el: "Ευρύχωρη κατοικία τριών υπνοδωματίων",
    },
  },
  {
    _id: "villa-yair",
    _type: "villa",
    name: "Yair",
    slug: { _type: "slug", current: "yair" },
    typicalBedrooms: 3,
    typicalBathrooms: 2,
    areaRange: "142-150",
    sortOrder: 5,
    label: { en: "The Premium Villa", he: "הווילה הפרימיום", ru: "Премиум вилла", el: "Η Premium Βίλα" },
    summary: {
      en: "Premium three-bedroom villa with expansive terraces, rooftop living, and panoramic sea views.",
      he: "וילת פרימיום עם שלושה חדרי שינה",
      ru: "Премиальная вилла с тремя спальнями",
      el: "Premium βίλα τριών υπνοδωματίων",
    },
  },
  {
    _id: "villa-yehonatan",
    _type: "villa",
    name: "Yehonatan",
    slug: { _type: "slug", current: "yehonatan" },
    typicalBedrooms: 5,
    typicalBathrooms: 3,
    areaRange: "212-214",
    sortOrder: 6,
    label: { en: "The Grand Estate", he: "האחוזה הגדולה", ru: "Большое поместье", el: "Το Μεγάλο Κτήμα" },
    summary: {
      en: "The crown jewel. Five bedrooms, three floors, private pool, and the largest outdoor area in the complex.",
      he: "יהלום הכתר. חמישה חדרי שינה, שלוש קומות",
      ru: "Жемчужина короны. Пять спален, три этажа",
      el: "Το κόσμημα του στέμματος. Πέντε υπνοδωμάτια",
    },
  },
];

// ---------------------------------------------------------------------------
// 5. Plots
// ---------------------------------------------------------------------------

const plots = [
  {
    _id: "plot-a",
    _type: "plot",
    name: "Plot A",
    sortOrder: 1,
    positionData: { x: 24, y: 56 },
    summary: {
      en: "Beachfront plot with 2 Yehonatan + 2 Tai villas",
      he: "מגרש חזית ים",
      ru: "Участок у моря",
      el: "Παραθαλάσσιο οικόπεδο",
    },
  },
  {
    _id: "plot-b",
    _type: "plot",
    name: "Plot B",
    sortOrder: 2,
    positionData: { x: 29, y: 60 },
    summary: {
      en: "Sea-view plot with 3 Yair + 2 Tai villas",
      he: "מגרש עם נוף לים",
      ru: "Участок с видом на море",
      el: "Οικόπεδο με θέα στη θάλασσα",
    },
  },
  {
    _id: "plot-c",
    _type: "plot",
    name: "Plot C",
    sortOrder: 3,
    positionData: { x: 37, y: 52 },
    summary: {
      en: "Central plot with 3 Michal + 2 Tai villas",
      he: "מגרש מרכזי",
      ru: "Центральный участок",
      el: "Κεντρικό οικόπεδο",
    },
  },
  {
    _id: "plot-d",
    _type: "plot",
    name: "Plot D",
    sortOrder: 4,
    positionData: { x: 44, y: 32 },
    summary: {
      en: "Garden-view plot with 5 Michal villas",
      he: "מגרש עם נוף לגינה",
      ru: "Участок с видом на сад",
      el: "Οικόπεδο με θέα στον κήπο",
    },
  },
  {
    _id: "plot-e",
    _type: "plot",
    name: "Plot E",
    sortOrder: 5,
    positionData: { x: 62, y: 42 },
    summary: {
      en: "Apartment complex: 5 Lola ground + 5 Mikka upper",
      he: "מתחם דירות",
      ru: "Жилой комплекс",
      el: "Συγκρότημα διαμερισμάτων",
    },
  },
  {
    _id: "plot-f",
    _type: "plot",
    name: "Plot F",
    sortOrder: 6,
    positionData: { x: 76, y: 25 },
    summary: {
      en: "Apartment complex: 5 Lola ground + 5 Mikka upper",
      he: "מתחם דירות",
      ru: "Жилой комплекс",
      el: "Συγκρότημα διαμερισμάτων",
    },
  },
];

// ---------------------------------------------------------------------------
// 6. Units
// Helper to build a reference object
// ---------------------------------------------------------------------------

function ref(id: string) {
  // Use the base (non-draft) ID for references. After publishing all docs in
  // Studio, these refs resolve correctly.
  return { _type: "reference" as const, _ref: id, _weak: true };
}

type UnitStatus = "available" | "sold" | "reserved";

interface UnitInput {
  _id: string;
  _type: "unit";
  unitNumber: string;
  plot: { _type: "reference"; _ref: string };
  villaType: { _type: "reference"; _ref: string };
  status: UnitStatus;
  totalArea: number;
  outdoorArea?: number;
  bedrooms: number;
  bathrooms: number;
  hasPool: boolean;
  hasParking: boolean;
  floorLevel?: "ground" | "upper";
}

const units: UnitInput[] = [
  // --- Plot A ---
  { _id: "unit-a1", _type: "unit", unitNumber: "A1", plot: ref("plot-a"), villaType: ref("villa-yehonatan"), status: "sold",      totalArea: 285.92, outdoorArea: 196.80, bedrooms: 5, bathrooms: 3, hasPool: true,  hasParking: true },
  { _id: "unit-a2", _type: "unit", unitNumber: "A2", plot: ref("plot-a"), villaType: ref("villa-yehonatan"), status: "available", totalArea: 231.23, outdoorArea: 141.23, bedrooms: 5, bathrooms: 3, hasPool: true,  hasParking: true },
  { _id: "unit-a3", _type: "unit", unitNumber: "A3", plot: ref("plot-a"), villaType: ref("villa-tai"),       status: "sold",      totalArea: 122.23, outdoorArea: 70.16,  bedrooms: 2, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-a4", _type: "unit", unitNumber: "A4", plot: ref("plot-a"), villaType: ref("villa-tai"),       status: "sold",      totalArea: 146.47, outdoorArea: 94.40,  bedrooms: 2, bathrooms: 2, hasPool: true,  hasParking: true },

  // --- Plot B ---
  { _id: "unit-b1", _type: "unit", unitNumber: "B1", plot: ref("plot-b"), villaType: ref("villa-yair"),  status: "available", totalArea: 183.50, outdoorArea: 124.42, bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-b2", _type: "unit", unitNumber: "B2", plot: ref("plot-b"), villaType: ref("villa-yair"),  status: "available", totalArea: 139.32, outdoorArea: 80.23,  bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-b3", _type: "unit", unitNumber: "B3", plot: ref("plot-b"), villaType: ref("villa-yair"),  status: "available", totalArea: 168.16, outdoorArea: 104.98, bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-b4", _type: "unit", unitNumber: "B4", plot: ref("plot-b"), villaType: ref("villa-tai"),   status: "sold",      totalArea: 138.67, outdoorArea: 86.60,  bedrooms: 2, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-b5", _type: "unit", unitNumber: "B5", plot: ref("plot-b"), villaType: ref("villa-tai"),   status: "sold",      totalArea: 143.70, outdoorArea: 91.63,  bedrooms: 2, bathrooms: 2, hasPool: true,  hasParking: true },

  // --- Plot C ---
  { _id: "unit-c1", _type: "unit", unitNumber: "C1", plot: ref("plot-c"), villaType: ref("villa-michal"), status: "sold",      totalArea: 205.97, outdoorArea: 145.92, bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-c2", _type: "unit", unitNumber: "C2", plot: ref("plot-c"), villaType: ref("villa-michal"), status: "available", totalArea: 136.81, outdoorArea: 79.96,  bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-c3", _type: "unit", unitNumber: "C3", plot: ref("plot-c"), villaType: ref("villa-michal"), status: "available", totalArea: 137.59, outdoorArea: 77.54,  bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-c4", _type: "unit", unitNumber: "C4", plot: ref("plot-c"), villaType: ref("villa-tai"),    status: "sold",      totalArea: 158.86, outdoorArea: 106.79, bedrooms: 2, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-c5", _type: "unit", unitNumber: "C5", plot: ref("plot-c"), villaType: ref("villa-tai"),    status: "sold",      totalArea: 158.54, outdoorArea: 106.47, bedrooms: 2, bathrooms: 2, hasPool: true,  hasParking: true },

  // --- Plot D ---
  { _id: "unit-d1", _type: "unit", unitNumber: "D1", plot: ref("plot-d"), villaType: ref("villa-michal"), status: "available", totalArea: 217.03, outdoorArea: 154.71, bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-d2", _type: "unit", unitNumber: "D2", plot: ref("plot-d"), villaType: ref("villa-michal"), status: "available", totalArea: 115.38, outdoorArea: 56.77,  bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-d3", _type: "unit", unitNumber: "D3", plot: ref("plot-d"), villaType: ref("villa-michal"), status: "available", totalArea: 144.51, outdoorArea: 81.70,  bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-d4", _type: "unit", unitNumber: "D4", plot: ref("plot-d"), villaType: ref("villa-michal"), status: "available", totalArea: 133.00, outdoorArea: 70.69,  bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-d5", _type: "unit", unitNumber: "D5", plot: ref("plot-d"), villaType: ref("villa-michal"), status: "available", totalArea: 160.05, outdoorArea: 97.74,  bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },

  // --- Plot E (ground = Lola, upper = Mikka) ---
  { _id: "unit-e1",  _type: "unit", unitNumber: "E1",  plot: ref("plot-e"), villaType: ref("villa-lola"),  status: "available", totalArea: 112.19, outdoorArea: 60.71, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-e2",  _type: "unit", unitNumber: "E2",  plot: ref("plot-e"), villaType: ref("villa-lola"),  status: "available", totalArea: 100.60, outdoorArea: 49.12, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-e3",  _type: "unit", unitNumber: "E3",  plot: ref("plot-e"), villaType: ref("villa-lola"),  status: "sold",      totalArea: 99.91,  outdoorArea: 48.43, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-e4",  _type: "unit", unitNumber: "E4",  plot: ref("plot-e"), villaType: ref("villa-lola"),  status: "available", totalArea: 78.85,  outdoorArea: 30.34, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-e5",  _type: "unit", unitNumber: "E5",  plot: ref("plot-e"), villaType: ref("villa-lola"),  status: "available", totalArea: 81.76,  outdoorArea: 30.28, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-e6",  _type: "unit", unitNumber: "E6",  plot: ref("plot-e"), villaType: ref("villa-mika"), status: "available", totalArea: 62.26,                      bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-e7",  _type: "unit", unitNumber: "E7",  plot: ref("plot-e"), villaType: ref("villa-mika"), status: "available", totalArea: 62.26,                      bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-e8",  _type: "unit", unitNumber: "E8",  plot: ref("plot-e"), villaType: ref("villa-mika"), status: "available", totalArea: 61.94,                      bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-e9",  _type: "unit", unitNumber: "E9",  plot: ref("plot-e"), villaType: ref("villa-mika"), status: "available", totalArea: 59.21,                      bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-e10", _type: "unit", unitNumber: "E10", plot: ref("plot-e"), villaType: ref("villa-mika"), status: "available", totalArea: 62.84,                      bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },

  // --- Plot F (ground = Lola, upper = Mikka) ---
  { _id: "unit-f1",  _type: "unit", unitNumber: "F1",  plot: ref("plot-f"), villaType: ref("villa-lola"),  status: "sold",      totalArea: 162.11, outdoorArea: 110.63, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-f2",  _type: "unit", unitNumber: "F2",  plot: ref("plot-f"), villaType: ref("villa-lola"),  status: "available", totalArea: 93.81,  outdoorArea: 45.30,  bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-f3",  _type: "unit", unitNumber: "F3",  plot: ref("plot-f"), villaType: ref("villa-lola"),  status: "available", totalArea: 122.08, outdoorArea: 70.60,  bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-f4",  _type: "unit", unitNumber: "F4",  plot: ref("plot-f"), villaType: ref("villa-lola"),  status: "available", totalArea: 89.79,  outdoorArea: 38.31,  bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-f5",  _type: "unit", unitNumber: "F5",  plot: ref("plot-f"), villaType: ref("villa-lola"),  status: "available", totalArea: 87.84,  outdoorArea: 36.36,  bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-f6",  _type: "unit", unitNumber: "F6",  plot: ref("plot-f"), villaType: ref("villa-mika"), status: "available", totalArea: 61.94,                       bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-f7",  _type: "unit", unitNumber: "F7",  plot: ref("plot-f"), villaType: ref("villa-mika"), status: "available", totalArea: 59.21,                       bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-f8",  _type: "unit", unitNumber: "F8",  plot: ref("plot-f"), villaType: ref("villa-mika"), status: "available", totalArea: 62.84,                       bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-f9",  _type: "unit", unitNumber: "F9",  plot: ref("plot-f"), villaType: ref("villa-mika"), status: "available", totalArea: 62.26,                       bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-f10", _type: "unit", unitNumber: "F10", plot: ref("plot-f"), villaType: ref("villa-mika"), status: "available", totalArea: 62.26,                       bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
];

// ---------------------------------------------------------------------------
// 7. Upgrades
// ---------------------------------------------------------------------------

const upgrades = [
  {
    _id: "upgrade-pool",
    _type: "upgrade",
    name: { en: "Private Swimming Pool", he: "בריכת שחייה פרטית", ru: "Частный бассейн", el: "Ιδιωτική πισίνα" },
    description: {
      en: "Private pool, minimum 2.50m × 4.00m, with optional heating system included.",
      he: "בריכה פרטית, מינימום 2.50 × 4.00 מ', כולל אפשרות לחימום",
      ru: "Частный бассейн, минимум 2,50 × 4,00 м, с опциональным подогревом",
      el: "Ιδιωτική πισίνα, ελάχιστες διαστάσεις 2,50 × 4,00 μ., με θέρμανση",
    },
    category: "pool",
    sortOrder: 1,
  },
  {
    _id: "upgrade-jacuzzi",
    _type: "upgrade",
    name: { en: "Outdoor Jacuzzi", he: "ג'קוזי חיצוני", ru: "Уличное джакузи", el: "Εξωτερικό τζακούζι" },
    description: {
      en: "Outdoor jacuzzi installed on the terrace or garden area.",
      he: "ג'קוזי חיצוני המותקן על המרפסת או הגינה",
      ru: "Уличное джакузи на террасе или в садовой зоне",
      el: "Εξωτερικό τζακούζι στη βεράντα ή στον κήπο",
    },
    category: "jacuzzi",
    sortOrder: 2,
  },
  {
    _id: "upgrade-sauna",
    _type: "upgrade",
    name: { en: "2-Person Outdoor Sauna", he: "סאונה חיצונית לשני אנשים", ru: "Уличная сауна на 2 человека", el: "Εξωτερική σάουνα 2 ατόμων" },
    description: {
      en: "Compact outdoor sauna cabin for two, cedar wood finish.",
      he: "קבינת סאונה חיצונית קומפקטית לשניים, גמר עץ ארז",
      ru: "Компактная уличная сауна на двоих, отделка из кедра",
      el: "Συμπαγής εξωτερική καμπίνα σάουνας για δύο, φινίρισμα κέδρου",
    },
    category: "sauna",
    sortOrder: 3,
  },
  {
    _id: "upgrade-bbq",
    _type: "upgrade",
    name: { en: "BBQ Corner", he: "פינת ברביקיו", ru: "Уголок барбекю", el: "Γωνία BBQ" },
    description: {
      en: "Built-in BBQ corner with grill, stone counter, and stainless steel sink.",
      he: "פינת ברביקיו מובנית עם גריל, משטח אבן וכיור נירוסטה",
      ru: "Встроенный уголок барбекю с грилем, каменной столешницей и раковиной",
      el: "Ενσωματωμένη γωνία BBQ με ψησταριά, πέτρινο πάγκο και ανοξείδωτο νεροχύτη",
    },
    category: "bbq",
    sortOrder: 4,
  },
  {
    _id: "upgrade-smart-house",
    _type: "upgrade",
    name: { en: "Smart House System", he: "מערכת בית חכם", ru: "Система умного дома", el: "Σύστημα έξυπνου σπιτιού" },
    description: {
      en: "Integrated smart home system controlling lighting, climate, and security from a single app.",
      he: "מערכת בית חכם משולבת לשליטה בתאורה, אקלים ואבטחה מאפליקציה אחת",
      ru: "Интегрированная система умного дома: освещение, климат и безопасность из одного приложения",
      el: "Ολοκληρωμένο σύστημα έξυπνου σπιτιού για φωτισμό, κλιματισμό και ασφάλεια",
    },
    category: "smart-house",
    sortOrder: 5,
  },
  {
    _id: "upgrade-security",
    _type: "upgrade",
    name: { en: "Security System", he: "מערכת אבטחה", ru: "Система безопасности", el: "Σύστημα ασφαλείας" },
    description: {
      en: "Comprehensive security system with HD cameras and monitored alarm.",
      he: "מערכת אבטחה מקיפה עם מצלמות HD וצופר מנוטר",
      ru: "Комплексная система безопасности с камерами HD и охранной сигнализацией",
      el: "Ολοκληρωμένο σύστημα ασφαλείας με κάμερες HD και συναγερμό",
    },
    category: "security",
    sortOrder: 6,
  },
  {
    _id: "upgrade-fireplace",
    _type: "upgrade",
    name: { en: "Indoor Fireplace", he: "אח פנימי", ru: "Комнатный камин", el: "Εσωτερικό τζάκι" },
    description: {
      en: "Bioethanol indoor fireplace — no chimney required, clean and elegant.",
      he: "אח פנימי ביואתנול — ללא ארובה, נקי ואלגנטי",
      ru: "Биоэтаноловый камин — не требует дымохода, чистый и элегантный",
      el: "Εσωτερικό τζάκι βιοαιθανόλης — χωρίς καμινάδα, καθαρό και κομψό",
    },
    category: "fireplace",
    sortOrder: 7,
  },
];

// ---------------------------------------------------------------------------
// 8. Site Settings
// ---------------------------------------------------------------------------

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  projectName: "The Sea'cret Residences Chiliadou",
  salesEmail: "office@livebettergr.com",
  salesPhone: "+30 693 1843439",
  whatsappNumber: "306931843439",
  viberNumber: "306931843439",
  officeHours: {
    en: "Sunday–Thursday, 9:00–18:00",
    he: "ראשון–חמישי, 9:00–18:00",
    ru: "Воскресенье–Четверг, 9:00–18:00",
    el: "Κυριακή–Πέμπτη, 9:00–18:00",
  },
  officeAddress: "Georg. Olimpiou 33-35, Patras, Greece 26222",
  officeRegion: "Patras, Western Greece",
};

// ---------------------------------------------------------------------------
// 9. Homepage
// ---------------------------------------------------------------------------

const homePage = {
  _id: "homePage",
  _type: "homePage",
  heroTagline: {
    en: "Hidden from many,",
    he: "נסתר מרבים,",
    ru: "Скрытый от многих,",
    el: "Κρυμμένο από πολλούς,",
  },
  heroSubtitle: {
    en: "perfect for few",
    he: "מושלם למעטים",
    ru: "идеальный для избранных",
    el: "τέλειο για λίγους",
  },
  conceptEyebrow: {
    en: "THE CONCEPT",
    he: "הקונספט",
    ru: "КОНЦЕПЦИЯ",
    el: "Η ΙΔΕΑ",
  },
  conceptCopy: {
    en: "In a world of crowded destinations and standard offerings, we create something different. Sea'cret Residences Chiliadou — modern coastal living in Greece's hidden gem, just 30 min from Patras.",
    he: "בעולם של יעדים צפופים והצעות סטנדרטיות, אנו יוצרים משהו שונה.",
    ru: "В мире переполненных направлений мы создаём нечто иное.",
    el: "Σε έναν κόσμο γεμάτο τουρίστες, δημιουργούμε κάτι διαφορετικό.",
  },
  ctaTitle: {
    en: "Discover Your Sea'cret",
    he: "גלה את הסי'קרט שלך",
    ru: "Откройте свой Sea'cret",
    el: "Ανακαλύψτε το Sea'cret σας",
  },
  ctaSubtitle: {
    en: "From €150K · Only 39 exclusive residences",
    he: "מ-€150K · רק 39 דירות בלעדיות",
    ru: "От €150K · Только 39 эксклюзивных резиденций",
    el: "Από €150K · Μόνο 39 αποκλειστικές κατοικίες",
  },
  lifestyleMoments: [
    {
      _key: "moment-morning",
      period: "Morning",
      copy: {
        en: "Wake to the sound of gentle waves. Coffee on your private terrace. The gulf stretching to the horizon.",
        he: "התעורר לצליל הגלים העדינים. קפה על המרפסת הפרטית.",
        ru: "Проснитесь под шум нежных волн. Кофе на вашей террасе.",
        el: "Ξυπνήστε με τον ήχο των κυμάτων. Καφές στη βεράντα σας.",
      },
    },
    {
      _key: "moment-day",
      period: "Day",
      copy: {
        en: "Explore ancient Delphi. Swim in crystal-clear waters. Discover charming Galaxidi.",
        he: "חקור את דלפי העתיקה. שחה במים צלולים.",
        ru: "Исследуйте Дельфы. Купайтесь в кристальных водах.",
        el: "Εξερευνήστε τους Δελφούς. Κολυμπήστε σε κρυστάλλινα νερά.",
      },
    },
    {
      _key: "moment-evening",
      period: "Evening",
      copy: {
        en: "Sunset from your private pool. Local wine and fresh seafood. Stars reflecting on the water.",
        he: "שקיעה מהבריכה הפרטית. יין מקומי ופירות ים.",
        ru: "Закат у вашего бассейна. Местное вино и морепродукты.",
        el: "Ηλιοβασίλεμα από την πισίνα σας. Τοπικό κρασί και θαλασσινά.",
      },
    },
  ],
  // --- Expanded fields ---
  locationTitle: { en: "Greece's best-kept secret" },
  locationDescription: {
    en: "Nestled on the northern shore of the Gulf of Corinth, Chiliadou offers untouched beauty just hours from Athens.",
  },
  locationHighlights: [
    {
      _key: "highlight-blueflag",
      title: { en: "Blue Flag Beach" },
      description: { en: "Chiliadou — pristine, uncrowded, award-winning coastline." },
    },
    {
      _key: "highlight-patras",
      title: { en: "30 min from Patras" },
      description: { en: "Quick access to Greece's third-largest city and its port." },
    },
    {
      _key: "highlight-athens",
      title: { en: "2.5 h from Athens" },
      description: { en: "An easy drive from the capital, via the scenic Rio-Antirrio bridge." },
    },
    {
      _key: "highlight-nocrowds",
      title: { en: "No crowds" },
      description: { en: "A hidden cove away from mass tourism — serenity guaranteed." },
    },
  ],
  residencesTitle: { en: "Designed for the discerning few" },
  residencesDescription: {
    en: "Each residence is a unique expression of modern Mediterranean architecture, thoughtfully positioned for maximum privacy and views.",
  },
  masterplanTitle: { en: "The master plan" },
  masterplanDescription: {
    en: "Six private plots along the coastline, each carefully positioned for privacy, views, and natural ventilation.",
  },
  lifestyleTitle: { en: "A day at Sea'cret" },
  inlineContactEyebrow: { en: "Get in Touch" },
  inlineContactTitle: { en: "Ready to discover your Sea'cret?" },
  inlineContactDescription: {
    en: "Schedule a private viewing or request detailed information about our residences. A member of our team will contact you within 24 hours.",
  },
};

// ---------------------------------------------------------------------------
// 10. UI Strings singleton
// ---------------------------------------------------------------------------

const uiStringsDoc = {
  _id: "uiStrings",
  _type: "uiStrings",

  // Navigation
  navHome: { en: "Home" },
  navResidences: { en: "Residences" },
  navMasterplan: { en: "Masterplan" },
  navLocation: { en: "Location" },
  navAbout: { en: "About" },
  navContact: { en: "Contact" },

  // Footer
  footerTagline: {
    en: "The Sea'cret Residences Chiliadou — Luxury coastal living on Greece's Corinthian Gulf.",
  },
  footerNavigate: { en: "Navigate" },
  footerLegal: { en: "Legal" },
  footerPrivacyPolicy: { en: "Privacy Policy" },
  footerTerms: { en: "Terms & Conditions" },
  footerCookiePolicy: { en: "Cookie Policy" },
  footerAllRights: { en: "All rights reserved." },
  footerProducedBy: { en: "Produced by LiveBetter" },

  // Status
  statusAvailable: { en: "Available" },
  statusReserved: { en: "Reserved" },
  statusSold: { en: "Sold" },
  statusSoldOut: { en: "Sold Out" },

  // Specs
  specBedrooms: { en: "Bedrooms" },
  specBathrooms: { en: "Bathrooms" },
  specTotalArea: { en: "Total Area" },
  specOutdoorArea: { en: "Outdoor Area" },
  specPool: { en: "Swimming Pool" },
  specParking: { en: "Parking" },
  specYes: { en: "Yes" },
  specNo: { en: "No" },

  // Form
  formFullName: { en: "Full Name" },
  formEmail: { en: "Email" },
  formPhone: { en: "Phone" },
  formMessage: { en: "Message" },
  formSubmit: { en: "Send Request" },
  formSending: { en: "Sending..." },
  formSuccess: { en: "Thank you! We'll be in touch within 24 hours." },
  formError: { en: "Something went wrong. Please try again." },
  formGdpr: {
    en: "I agree to the Privacy Policy and consent to being contacted",
  },
  formSelectOne: { en: "Select one" },
  formBack: { en: "Back" },
  formNext: { en: "Next" },

  // CTA
  ctaScheduleTour: { en: "Schedule a Viewing" },
  ctaRequestInfo: { en: "Request Information" },
  ctaDownloadBrochure: { en: "Download Brochure" },
  ctaWhatsappUs: { en: "WhatsApp Us" },
  ctaViberUs: { en: "Viber Us" },
  ctaExploreResidences: { en: "Explore Residences" },
  ctaViewAll: { en: "View All Residences" },
  ctaSendRequest: { en: "Send Request" },
  ctaContactUs: { en: "Contact Us" },

  // Filters & Tables
  filterBedrooms: { en: "Bedrooms" },
  filterAvailableOnly: { en: "Available only" },
  filterSort: { en: "Sort" },
  filterSortName: { en: "Name" },
  filterPriceLowHigh: { en: "Price: Low to High" },
  filterSizeSmallLarge: { en: "Size: Small to Large" },
  filterNoResults: { en: "No villas match your criteria" },
  filterAll: { en: "All" },
  filterAllTypes: { en: "All Types" },
  filterPlot: { en: "Plot" },
  filterType: { en: "Type" },
  filterShowing: { en: "Showing" },
  tableUnitNumber: { en: "Unit #" },
  tableVillaType: { en: "Villa Type" },
  tableBeds: { en: "Beds" },
  tableTotalArea: { en: "Total Area" },
  tablePriceFrom: { en: "Price From" },
  tableStatus: { en: "Status" },
  tableAreaM2: { en: "Area m\u00B2" },
  tablePool: { en: "Pool" },
  tablePlot: { en: "Plot" },

  // Pricing
  pricingFrom: { en: "From" },
  pricingContactFor: { en: "Contact for pricing" },

  // Misc
  miscNoImage: { en: "No image" },
  miscComingSoon: { en: "Coming soon" },
  miscImageComing: { en: "Image coming soon" },
  miscDataComing: { en: "Data coming soon" },
  miscUnit: { en: "unit" },
  miscUnits: { en: "units" },
  miscAvailable: { en: "available" },
  miscBed: { en: "bed" },
  miscBeds: { en: "beds" },
  miscOf: { en: "of" },
  miscGetInTouch: { en: "Get in Touch" },
  miscReadyToDiscover: { en: "Ready to discover your Sea'cret?" },
  miscContactPromise: {
    en: "Schedule a private viewing or request detailed information about our residences. A member of our team will contact you within 24 hours.",
  },
  miscGallery: { en: "Gallery" },
  miscFloorPlans: { en: "Floor Plans" },
  miscPricing: { en: "Pricing" },
  miscAvailableUnits: { en: "Available Units" },
  misc3dTour: { en: "3D Virtual Tour" },
  miscExploreMore: { en: "Explore More" },
  miscYouMightLike: { en: "You Might Also Like" },
  miscYouMightLikeDesc: {
    en: "Discover our other exclusive villa types at Sea'cret Residences.",
  },
  miscGroundFloor: { en: "Ground Floor" },
  miscUpperFloor: { en: "Upper Floor" },
  miscAttic: { en: "Attic" },
  miscFloor: { en: "Floor" },
  miscVillaSpecs: { en: "Villa Specifications" },
  miscDetailsComing: { en: "Details coming soon" },
  miscChatWhatsapp: { en: "Chat on WhatsApp" },
  miscChatViber: { en: "Chat on Viber" },
};

// ---------------------------------------------------------------------------
// 11. About Page singleton
// ---------------------------------------------------------------------------

const aboutPage = {
  _id: "aboutPage",
  _type: "aboutPage",

  // Hero
  heroTitle: { en: "About Live Better Group" },
  heroSubtitle: { en: "From a pandemic-era idea to Greece's most dynamic developer" },

  // Our Story
  storyEyebrow: { en: "Our Story" },
  storyTitle: { en: "From a pandemic-era idea to Greece's most dynamic developer" },
  storyContent: {
    en: `In September 2020, while the world was in lockdown, Tom Linkovsky and Evgeny Kalika — friends for over 30 years — saw what others missed: untapped potential in the Greek real estate market. They started in Patras, a vibrant university city and major transport hub on the Peloponnese coast.

The problem was clear — students were living in outdated, poorly maintained apartments. The solution became Live Better's first concept: the "Airbnb for students" — fully furnished apartments for long-term rental. Five years in, the model has a perfect track record: zero vacant units exceeding one week.

From student housing, the group expanded into family residences, property flips, villa construction, and luxury vacation homes. Today Live Better Group operates across Patras, Athens, and the resort towns of Chiliadou and Akrata — with 14 projects in progress and over 420 housing units in the pipeline.`,
  },

  // Stats Bar
  stats: [
    { _key: "stat-projects", value: "12+", label: { en: "Completed Projects" } },
    { _key: "stat-units", value: "80+", label: { en: "Units Delivered" } },
    { _key: "stat-capital", value: "\u20AC10M+", label: { en: "Capital Raised" } },
    { _key: "stat-roi", value: "45%+", label: { en: "ROI in 2023\u20132024" } },
  ],

  // Values
  valuesEyebrow: { en: "Why Live Better" },
  valuesTitle: { en: "A 360\u00B0 approach to real estate investment" },
  values: [
    {
      _key: "value-transparency",
      icon: "Shield",
      title: { en: "Full Transparency" },
      description: { en: "Honesty at every stage. Online access to construction monitoring." },
    },
    {
      _key: "value-ownership",
      icon: "Key",
      title: { en: "Real Ownership" },
      description: { en: "Full property rights registered in your name from day one." },
    },
    {
      _key: "value-global",
      icon: "Globe",
      title: { en: "Global Investor Base" },
      description: { en: "Dozens of investors from Israel, Greece, Poland, Germany, USA, and beyond." },
    },
    {
      _key: "value-returns",
      icon: "TrendingUp",
      title: { en: "Above-Market Returns" },
      description: { en: "Investment profitability exceeded 45% in 2023\u20132024. Expected 7\u201310% annual rental yield." },
    },
    {
      _key: "value-support",
      icon: "Handshake",
      title: { en: "End-to-End Support" },
      description: { en: "Full transaction support from property selection to key handover." },
    },
    {
      _key: "value-local",
      icon: "MapPin",
      title: { en: "Local Expertise" },
      description: { en: "Deep relationships with Greek agents, architects, engineers, contractors, and authorities." },
    },
  ],

  // Founders
  foundersEyebrow: { en: "The Founders" },
  founders: [
    {
      _key: "founder-tom",
      name: "Tom Linkovsky",
      role: { en: "Co-Founder" },
      bio: {
        en: "Entrepreneur with over 20 years of experience. Previously owned a restaurant chain in Tel Aviv, worked in import and large-scale event management. Brings operational drive and strategic vision to every project.",
      },
    },
    {
      _key: "founder-evgeny",
      name: "Evgeny Kalika",
      role: { en: "Co-Founder" },
      bio: {
        en: "Specialist in marketing, strategic consulting, and advertising. Known for discipline, reliability, and responsibility. Drives the group's investor relations and market positioning across Europe.",
      },
    },
  ],

  // CTA
  ctaTitle: { en: "Ready to invest with confidence?" },
  ctaSubtitle: { en: "Join dozens of investors already building wealth with Live Better Group" },
  ctaButton: { en: "Schedule a Consultation" },

  // SEO
  seoTitle: { en: "About Us — Live Better Group" },
  seoDescription: {
    en: "Learn about Live Better Group — from a pandemic-era idea to Greece's most dynamic real estate developer. Meet the founders and discover our values.",
  },
};

// ---------------------------------------------------------------------------
// 12. Location Page singleton
// ---------------------------------------------------------------------------

const locationPage = {
  _id: "locationPage",
  _type: "locationPage",

  heroTitle: { en: "Your Secret Escape" },

  // Why Chiliadou
  whySection: {
    en: "A village that still belongs to those who seek authenticity over convenience — and find it in abundance.",
  },
  whyEyebrow: { en: "Why Chiliadou" },
  whyTitle: { en: "Hidden from many. Perfect for few." },
  whyFeatures: [
    {
      _key: "why-blueflag",
      icon: "Waves",
      heading: { en: "Blue Flag Beach" },
      description: {
        en: "Chiliadou boasts an EU Blue Flag certified beach — a mark of exceptional water quality, safety, and environmental management. Crystal-clear waters of the Corinthian Gulf, just steps from your doorstep.",
      },
    },
    {
      _key: "why-nocrowds",
      icon: "Users",
      heading: { en: "No Crowds" },
      description: {
        en: "Hidden from mass tourism, Chiliadou remains one of the last unspoiled stretches of the Greek coastline. No resort hotels. No noisy beach bars. Just the sea, the olive groves, and absolute peace.",
      },
    },
    {
      _key: "why-authentic",
      icon: "Heart",
      heading: { en: "Pure Authenticity" },
      description: {
        en: "Life here moves at the rhythm of the tides and the harvest seasons. Stone-built tavernas, olive oil pressed from century-old trees, local fishermen bringing in the day's catch — Greece as it was meant to be.",
      },
    },
  ],

  // Distance section
  distanceEyebrow: { en: "Connectivity" },
  distanceTitle: { en: "Easy to reach. Hard to leave." },
  distanceDescription: {
    en: "Chiliadou sits at the heart of the Corinthian Gulf, connecting you effortlessly to the best of Greece.",
  },
  distanceMarkers: [
    { _key: "dist-nafpaktos", place: { en: "Nafpaktos" }, time: { en: "10 min" }, detail: { en: "Historic castle town" } },
    { _key: "dist-rio", place: { en: "Rio Bridge" }, time: { en: "20 min" }, detail: { en: "Landmark suspension bridge" } },
    { _key: "dist-trizonia", place: { en: "Trizonia Island" }, time: { en: "20 min" }, detail: { en: "Scenic island ferry" } },
    { _key: "dist-patras", place: { en: "Patras" }, time: { en: "30 min" }, detail: { en: "Major port city" } },
    { _key: "dist-galaxidi", place: { en: "Galaxidi" }, time: { en: "1 hour" }, detail: { en: "Charming seafront village" } },
    { _key: "dist-athens", place: { en: "Athens" }, time: { en: "2.5 hours" }, detail: { en: "International hub" } },
  ],

  // Airport section
  airportEyebrow: { en: "Air Connectivity" },
  airportTitle: { en: "Three gateways to paradise." },
  airportDescription: {
    en: "Whether you fly direct from Europe or connect through Athens, the Corinthian Gulf is closer than you think.",
  },
  airports: [
    {
      _key: "airport-pvk",
      code: "PVK",
      name: { en: "Aktion National Airport" },
      city: { en: "Preveza" },
      travelTime: { en: "1h 45m" },
      destinations: 38,
      countries: 14,
      note: { en: "Closest summer gateway — direct from major EU cities" },
      isNearest: false,
    },
    {
      _key: "airport-gpa",
      code: "GPA",
      name: { en: "Araxos Airport" },
      city: { en: "Patras" },
      travelTime: { en: "1h 10m" },
      destinations: 17,
      countries: 9,
      note: { en: "Nearest airport, expanding international routes every season" },
      isNearest: true,
    },
    {
      _key: "airport-ath",
      code: "ATH",
      name: { en: "Athens Int'l Airport" },
      city: { en: "Eleftherios Venizelos" },
      travelTime: { en: "2h 44m" },
      destinations: 160,
      note: { en: "Year-round hub connecting 160+ airports worldwide" },
      isNearest: false,
    },
  ],

  // Experiences section
  experiencesEyebrow: { en: "Local Experiences" },
  experiencesTitle: { en: "A life well-lived, every day." },
  experiencesDescription: {
    en: "From ancient ruins to fresh-caught seafood — the richness of this region becomes your everyday backdrop.",
  },

  // SEO
  seoTitle: { en: "Location & Connectivity | The Sea'cret Residences Chiliadou" },
  seoDescription: {
    en: "Discover Chiliadou — a hidden Blue Flag beach on the Corinthian Gulf. Easily reached from Athens, Patras, and major European airports.",
  },
};

// ---------------------------------------------------------------------------
// 13. Residences Page singleton
// ---------------------------------------------------------------------------

const residencesPage = {
  _id: "residencesPage",
  _type: "residencesPage",

  heroTitle: { en: "The Residences" },
  introCopy: { en: "Six distinct villa types. Each a private world." },

  // Collection section
  collectionEyebrow: { en: "Our Collection" },
  collectionTitle: { en: "Choose Your Villa" },
  collectionDescription: {
    en: "Filter and sort all six villa types to find the one that fits your vision.",
  },

  // Compare section
  compareEyebrow: { en: "Side by Side" },
  compareTitle: { en: "Compare Villa Types" },
  compareDescription: {
    en: "A quick reference for all specifications and pricing across our collection.",
  },

  // Upgrades section
  upgradesEyebrow: { en: "Personalise Your Home" },
  upgradesTitle: { en: "Optional Upgrades" },
  upgradesDescription: {
    en: "Elevate your villa with bespoke additions, from private pools to full smart-home automation.",
  },

  // FAQ section
  faqEyebrow: { en: "FAQ" },
  faqTitle: { en: "Frequently Asked Questions" },

  // SEO
  seoTitle: { en: "Residences — Sea'cret Residences" },
  seoDescription: {
    en: "Discover all 6 villa types. Filter, compare, and find the perfect private retreat.",
  },
};

// ---------------------------------------------------------------------------
// 14. Masterplan Page singleton
// ---------------------------------------------------------------------------

const masterplanPage = {
  _id: "masterplanPage",
  _type: "masterplanPage",

  heroTitle: { en: "The Masterplan" },
  introCopy: { en: "6 residential plots. 39 exclusive villas. Explore the layout." },

  // Stat labels
  statTotalLabel: { en: "Total Residences" },
  statAvailableLabel: { en: "Available" },
  statReservedLabel: { en: "Reserved" },
  statSoldLabel: { en: "Sold" },
  statPlotsLabel: { en: "Plots" },

  // Explorer section
  explorerEyebrow: { en: "Explore" },
  explorerTitle: { en: "Interactive Masterplan" },
  explorerDescription: {
    en: "Click on a plot to view its residences, availability, and pricing.",
  },

  // Inventory section
  inventoryEyebrow: { en: "Full Inventory" },
  inventoryTitle: { en: "All Residences" },
  inventoryDescription: {
    en: "Filter, sort, and browse every available unit across all plots.",
  },

  // SEO
  seoTitle: { en: "Masterplan — Sea'cret Residences" },
  seoDescription: {
    en: "Explore the interactive masterplan. Browse plots, check availability, and find your ideal residence.",
  },
};

// ---------------------------------------------------------------------------
// 15. Contact Page singleton
// ---------------------------------------------------------------------------

const contactPage = {
  _id: "contactPage",
  _type: "contactPage",

  heroTitle: { en: "Get in Touch" },
  heroSubtitle: { en: "Our team is here to guide you through every step." },
  // Direct contact section
  directEyebrow: { en: "Direct Contact" },
  directTitle: { en: "Speak with our team" },
  directDescription: {
    en: "Prefer a direct conversation? Reach us on WhatsApp, Viber, by email, or give us a call.",
  },
  labelEmail: { en: "Email" },
  labelPhone: { en: "Phone" },
  labelOfficeHours: { en: "Office Hours" },

  // Budget options
  budgetOptions: [
    { _key: "budget-1", en: "Under \u20AC150,000" },
    { _key: "budget-2", en: "\u20AC150,000 \u2013 \u20AC250,000" },
    { _key: "budget-3", en: "\u20AC250,000 \u2013 \u20AC400,000" },
    { _key: "budget-4", en: "Over \u20AC400,000" },
  ],

  // Timeline options
  timelineOptions: [
    { _key: "timeline-1", en: "Within 3 months" },
    { _key: "timeline-2", en: "3\u20136 months" },
    { _key: "timeline-3", en: "6\u201312 months" },
    { _key: "timeline-4", en: "Just exploring" },
  ],

  // SEO
  seoTitle: { en: "Contact Us — Sea'cret Residences" },
  seoDescription: {
    en: "Get in touch with The Sea'cret Residences team. Inquire about villa types, pricing, and availability.",
  },
};

// ---------------------------------------------------------------------------
// 16. Main: seed in order
// ---------------------------------------------------------------------------

async function seed() {
  console.log(`\nConnecting to Sanity project: ${projectId} / ${dataset}\n`);

  // --- Villa Types ---
  console.log("Seeding villa types...");
  for (const villa of villas) {
    await upsert(villa);
  }

  // --- Plots ---
  console.log("\nSeeding plots...");
  for (const plot of plots) {
    await upsert(plot);
  }

  // --- Units ---
  console.log("\nSeeding units...");
  for (const unit of units) {
    await upsert(unit as unknown as Record<string, unknown>);
  }

  // --- Upgrades ---
  console.log("\nSeeding upgrades...");
  for (const upgrade of upgrades) {
    await upsert(upgrade);
  }

  // --- Site Settings ---
  console.log("\nSeeding site settings...");
  await upsert(siteSettings);

  // --- Homepage ---
  console.log("\nSeeding homepage...");
  await upsert(homePage);

  // --- UI Strings ---
  console.log("\nSeeding UI strings...");
  await upsert(uiStringsDoc);

  // --- About Page ---
  console.log("\nSeeding about page...");
  await upsert(aboutPage);

  // --- Location Page ---
  console.log("\nSeeding location page...");
  await upsert(locationPage);

  // --- Residences Page ---
  console.log("\nSeeding residences page...");
  await upsert(residencesPage);

  // --- Masterplan Page ---
  console.log("\nSeeding masterplan page...");
  await upsert(masterplanPage);

  // --- Contact Page ---
  console.log("\nSeeding contact page...");
  await upsert(contactPage);

  // --- Summary ---
  console.log("\n--- Seed complete ---");
  console.log(`  ${villas.length} villa types`);
  console.log(`  ${plots.length} plots`);
  console.log(`  ${units.length} units`);
  console.log(`  ${upgrades.length} upgrades`);
  console.log("  1 site settings");
  console.log("  1 homepage");
  console.log("  1 UI strings");
  console.log("  1 about page");
  console.log("  1 location page");
  console.log("  1 residences page");
  console.log("  1 masterplan page");
  console.log("  1 contact page");
}

seed().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
