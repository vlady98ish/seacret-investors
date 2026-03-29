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
    _id: "villa-mikka",
    _type: "villa",
    name: "Mikka",
    slug: { _type: "slug", current: "mikka" },
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
    positionData: { x: 18, y: 45 },
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
    positionData: { x: 30, y: 55 },
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
    positionData: { x: 45, y: 45 },
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
    positionData: { x: 58, y: 35 },
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
    positionData: { x: 72, y: 28 },
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
    positionData: { x: 84, y: 25 },
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
  { _id: "unit-d4", _type: "unit", unitNumber: "D4", plot: ref("plot-d"), villaType: ref("villa-michal"), status: "available", totalArea: 133.00, outdoorArea: 70.69,  bedrooms: 2, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-d5", _type: "unit", unitNumber: "D5", plot: ref("plot-d"), villaType: ref("villa-michal"), status: "available", totalArea: 160.05, outdoorArea: 97.74,  bedrooms: 2, bathrooms: 2, hasPool: true,  hasParking: true },

  // --- Plot E (ground = Lola, upper = Mikka) ---
  { _id: "unit-e1",  _type: "unit", unitNumber: "E1",  plot: ref("plot-e"), villaType: ref("villa-lola"),  status: "available", totalArea: 112.19, outdoorArea: 60.71, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-e2",  _type: "unit", unitNumber: "E2",  plot: ref("plot-e"), villaType: ref("villa-lola"),  status: "available", totalArea: 100.60, outdoorArea: 49.12, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-e3",  _type: "unit", unitNumber: "E3",  plot: ref("plot-e"), villaType: ref("villa-lola"),  status: "sold",      totalArea: 99.91,  outdoorArea: 48.43, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-e4",  _type: "unit", unitNumber: "E4",  plot: ref("plot-e"), villaType: ref("villa-lola"),  status: "available", totalArea: 78.85,  outdoorArea: 30.34, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-e5",  _type: "unit", unitNumber: "E5",  plot: ref("plot-e"), villaType: ref("villa-lola"),  status: "available", totalArea: 81.76,  outdoorArea: 30.28, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-e6",  _type: "unit", unitNumber: "E6",  plot: ref("plot-e"), villaType: ref("villa-mikka"), status: "available", totalArea: 62.26,                      bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-e7",  _type: "unit", unitNumber: "E7",  plot: ref("plot-e"), villaType: ref("villa-mikka"), status: "available", totalArea: 62.26,                      bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-e8",  _type: "unit", unitNumber: "E8",  plot: ref("plot-e"), villaType: ref("villa-mikka"), status: "available", totalArea: 61.94,                      bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-e9",  _type: "unit", unitNumber: "E9",  plot: ref("plot-e"), villaType: ref("villa-mikka"), status: "available", totalArea: 59.21,                      bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-e10", _type: "unit", unitNumber: "E10", plot: ref("plot-e"), villaType: ref("villa-mikka"), status: "available", totalArea: 62.84,                      bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },

  // --- Plot F (ground = Lola, upper = Mikka) ---
  { _id: "unit-f1",  _type: "unit", unitNumber: "F1",  plot: ref("plot-f"), villaType: ref("villa-lola"),  status: "sold",      totalArea: 162.11, outdoorArea: 110.63, bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-f2",  _type: "unit", unitNumber: "F2",  plot: ref("plot-f"), villaType: ref("villa-lola"),  status: "available", totalArea: 93.81,  outdoorArea: 45.30,  bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-f3",  _type: "unit", unitNumber: "F3",  plot: ref("plot-f"), villaType: ref("villa-lola"),  status: "available", totalArea: 122.08, outdoorArea: 70.60,  bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-f4",  _type: "unit", unitNumber: "F4",  plot: ref("plot-f"), villaType: ref("villa-lola"),  status: "available", totalArea: 89.79,  outdoorArea: 38.31,  bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-f5",  _type: "unit", unitNumber: "F5",  plot: ref("plot-f"), villaType: ref("villa-lola"),  status: "available", totalArea: 87.84,  outdoorArea: 36.36,  bedrooms: 1, bathrooms: 1, hasPool: true,  hasParking: true, floorLevel: "ground" },
  { _id: "unit-f6",  _type: "unit", unitNumber: "F6",  plot: ref("plot-f"), villaType: ref("villa-mikka"), status: "available", totalArea: 61.94,                       bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-f7",  _type: "unit", unitNumber: "F7",  plot: ref("plot-f"), villaType: ref("villa-mikka"), status: "available", totalArea: 59.21,                       bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-f8",  _type: "unit", unitNumber: "F8",  plot: ref("plot-f"), villaType: ref("villa-mikka"), status: "available", totalArea: 62.84,                       bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-f9",  _type: "unit", unitNumber: "F9",  plot: ref("plot-f"), villaType: ref("villa-mikka"), status: "available", totalArea: 62.26,                       bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
  { _id: "unit-f10", _type: "unit", unitNumber: "F10", plot: ref("plot-f"), villaType: ref("villa-mikka"), status: "available", totalArea: 62.26,                       bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: true, floorLevel: "upper"  },
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
  salesEmail: "info@seacret-residences.com",
  salesPhone: "+30 123 456 7890",
  whatsappNumber: "+972501234567",
  officeHours: {
    en: "Sunday–Thursday, 9:00–18:00",
    he: "ראשון–חמישי, 9:00–18:00",
    ru: "Воскресенье–Четверг, 9:00–18:00",
    el: "Κυριακή–Πέμπτη, 9:00–18:00",
  },
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
    ru: "идеальный для немногих",
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
};

// ---------------------------------------------------------------------------
// 10. Main: seed in order
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

  // --- Summary ---
  console.log("\n--- Seed complete ---");
  console.log(`  ${villas.length} villa types`);
  console.log(`  ${plots.length} plots`);
  console.log(`  ${units.length} units`);
  console.log(`  ${upgrades.length} upgrades`);
  console.log("  1 site settings");
  console.log("  1 homepage");
}

seed().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
