/**
 * Fallback data module — real content from the PDF presentation.
 * Used when Sanity CMS is unavailable (demo project ID, no credentials, etc.).
 * All objects are typed to match the projected shapes returned by GROQ queries.
 */

import type {
  FeaturedVilla,
  HomePage,
  MasterplanPage,
  PlotWithUnits,
  ResidencesPage,
  UnitFlat,
  UnitStatus,
  UnitWithRefs,
  Villa,
} from "@/lib/sanity/types";

// ─── Villa Types ──────────────────────────────────────────────────────────────

export const fallbackVillas: Villa[] = [
  {
    _id: "fallback-villa-lola",
    name: "Lola",
    slug: { current: "lola" },
    label: {
      en: "The Studio Retreat",
      he: "הנסיגה הסטודיו",
      ru: "Студийный ретрит",
      el: "Η Στούντιο Αποδράση",
    },
    summary: {
      en: "An intimate studio villa with a private pool and terrace — ideal for couples or investors seeking a premium rental asset.",
      he: "וילה סטודיו אינטימית עם בריכה פרטית ומרפסת — אידיאלית לזוגות או משקיעים המחפשים נכס השכרה פרימיום.",
      ru: "Уютная студийная вилла с частным бассейном и террасой — идеально для пар или инвесторов, ищущих премиальный арендный актив.",
      el: "Μια οικεία βίλα στούντιο με ιδιωτική πισίνα και βεράντα — ιδανική για ζευγάρια ή επενδυτές.",
    },
    highlights: [
      { en: "Private pool on ground floor", he: "בריכה פרטית בקומת קרקע", ru: "Частный бассейн на первом этаже", el: "Ιδιωτική πισίνα στο ισόγειο" },
      { en: "49–52 m² interior", he: "פנים 49–52 מ\"ר", ru: "Интерьер 49–52 м²", el: "Εσωτερικό 49–52 τ.μ." },
      { en: "1 bed · 1 bath", he: "1 חדר שינה · 1 חדר אמבטיה", ru: "1 спальня · 1 ванная", el: "1 υπ/τιο · 1 μπάνιο" },
    ],
    heroImage: null as unknown as Villa["heroImage"],
    galleryImages: [],
    floorPlanImages: [],
    typicalBedrooms: 1,
    typicalBathrooms: 1,
    areaRange: "49–52",
    sortOrder: 1,
  },
  {
    _id: "fallback-villa-mikka",
    name: "Mikka",
    slug: { current: "mikka" },
    label: {
      en: "The Cozy Apartment",
      he: "הדירה הנעימה",
      ru: "Уютные апартаменты",
      el: "Το Άνετο Διαμέρισμα",
    },
    summary: {
      en: "An upper-floor apartment villa offering panoramic sea views and a thoughtfully designed compact living space.",
      he: "וילת דירה בקומה עליונה המציעה נוף ים פנורמי ומרחב מגורים קומפקטי ומעוצב בקפידה.",
      ru: "Апартаменты на верхнем этаже с панорамным видом на море и продуманной компактной планировкой.",
      el: "Διαμέρισμα ανώτερου ορόφου με πανοραμική θέα στη θάλασσα.",
    },
    highlights: [
      { en: "Upper floor sea views", he: "נוף ים מקומה עליונה", ru: "Вид на море с верхнего этажа", el: "Θέα θάλασσα από τον ανώτερο όροφο" },
      { en: "59–63 m² interior", he: "פנים 59–63 מ\"ר", ru: "Интерьер 59–63 м²", el: "Εσωτερικό 59–63 τ.μ." },
      { en: "1 bed · 1 bath", he: "1 חדר שינה · 1 חדר אמבטיה", ru: "1 спальня · 1 ванная", el: "1 υπ/τιο · 1 μπάνιο" },
    ],
    heroImage: null as unknown as Villa["heroImage"],
    galleryImages: [],
    floorPlanImages: [],
    typicalBedrooms: 1,
    typicalBathrooms: 1,
    areaRange: "59–63",
    sortOrder: 2,
  },
  {
    _id: "fallback-villa-tai",
    name: "Tai",
    slug: { current: "tai" },
    label: {
      en: "The Starter Villa",
      he: "הוילה הראשונה",
      ru: "Стартовая вилла",
      el: "Η Αρχική Βίλα",
    },
    summary: {
      en: "A stunning two-bedroom villa with two bathrooms and a private pool — the perfect introduction to luxury coastal living.",
      he: "וילה מדהימה עם שני חדרי שינה, שני חדרי אמבטיה ובריכה פרטית — הכניסה המושלמת לחיי חוף יוקרתיים.",
      ru: "Великолепная двухспальная вилла с двумя ванными и частным бассейном — идеальный старт в роскошной прибрежной жизни.",
      el: "Εντυπωσιακή βίλα δύο υπνοδωματίων με ιδιωτική πισίνα.",
    },
    highlights: [
      { en: "Private pool included", he: "בריכה פרטית כלולה", ru: "Частный бассейн включён", el: "Ιδιωτική πισίνα συμπεριλαμβάνεται" },
      { en: "85 m² interior", he: "פנים 85 מ\"ר", ru: "Интерьер 85 м²", el: "Εσωτερικό 85 τ.μ." },
      { en: "2 bed · 2 bath", he: "2 חדרי שינה · 2 חדרי אמבטיה", ru: "2 спальни · 2 ванных", el: "2 υπ/τια · 2 μπάνια" },
    ],
    heroImage: null as unknown as Villa["heroImage"],
    galleryImages: [],
    floorPlanImages: [],
    typicalBedrooms: 2,
    typicalBathrooms: 2,
    areaRange: "85",
    sortOrder: 3,
  },
  {
    _id: "fallback-villa-michal",
    name: "Michal",
    slug: { current: "michal" },
    label: {
      en: "The Family Home",
      he: "בית המשפחה",
      ru: "Семейный дом",
      el: "Το Οικογενειακό Σπίτι",
    },
    summary: {
      en: "A spacious three-bedroom family villa designed for long stays, with ample outdoor space and a private pool.",
      he: "וילה משפחתית מרווחת עם שלושה חדרי שינה המיועדת לשהות ממושכת, עם שטח חוץ גדול ובריכה פרטית.",
      ru: "Просторная семейная вилла с тремя спальнями, большой территорией и частным бассейном.",
      el: "Ευρύχωρη οικογενειακή βίλα τριών υπνοδωματίων με ιδιωτική πισίνα.",
    },
    highlights: [
      { en: "Private pool included", he: "בריכה פרטית כלולה", ru: "Частный бассейн включён", el: "Ιδιωτική πισίνα συμπεριλαμβάνεται" },
      { en: "130–134 m² interior", he: "פנים 130–134 מ\"ר", ru: "Интерьер 130–134 м²", el: "Εσωτερικό 130–134 τ.μ." },
      { en: "3 bed · 2 bath", he: "3 חדרי שינה · 2 חדרי אמבטיה", ru: "3 спальни · 2 ванных", el: "3 υπ/τια · 2 μπάνια" },
    ],
    heroImage: null as unknown as Villa["heroImage"],
    galleryImages: [],
    floorPlanImages: [],
    typicalBedrooms: 3,
    typicalBathrooms: 2,
    areaRange: "130–134",
    sortOrder: 4,
  },
  {
    _id: "fallback-villa-yair",
    name: "Yair",
    slug: { current: "yair" },
    label: {
      en: "The Premium Villa",
      he: "הוילה הפרימיום",
      ru: "Премиальная вилла",
      el: "Η Premium Βίλα",
    },
    summary: {
      en: "An exceptional three-bedroom premium villa with generous outdoor living areas and a private pool.",
      he: "וילה פרימיום יוצאת דופן עם שלושה חדרי שינה, שטחי מגורים חיצוניים נדיבים ובריכה פרטית.",
      ru: "Исключительная премиальная вилла с тремя спальнями, просторными открытыми зонами и частным бассейном.",
      el: "Εξαιρετική premium βίλα τριών υπνοδωματίων με γενναιόδωρους εξωτερικούς χώρους.",
    },
    highlights: [
      { en: "Private pool included", he: "בריכה פרטית כלולה", ru: "Частный бассейн включён", el: "Ιδιωτική πισίνα συμπεριλαμβάνεται" },
      { en: "142–150 m² interior", he: "פנים 142–150 מ\"ר", ru: "Интерьер 142–150 м²", el: "Εσωτερικό 142–150 τ.μ." },
      { en: "3 bed · 2 bath", he: "3 חדרי שינה · 2 חדרי אמבטיה", ru: "3 спальни · 2 ванных", el: "3 υπ/τια · 2 μπάνια" },
    ],
    heroImage: null as unknown as Villa["heroImage"],
    galleryImages: [],
    floorPlanImages: [],
    typicalBedrooms: 3,
    typicalBathrooms: 2,
    areaRange: "142–150",
    sortOrder: 5,
  },
  {
    _id: "fallback-villa-yehonatan",
    name: "Yehonatan",
    slug: { current: "yehonatan" },
    label: {
      en: "The Grand Estate",
      he: "האחוזה הגדולה",
      ru: "Большое поместье",
      el: "Η Μεγάλη Έπαυλη",
    },
    summary: {
      en: "The crown jewel of Sea'cret Residences — a five-bedroom grand estate with three bathrooms and a private pool.",
      he: "אבן הכתר של Sea'cret Residences — אחוזה גדולה עם חמישה חדרי שינה, שלושה חדרי אמבטיה ובריכה פרטית.",
      ru: "Жемчужина Sea'cret Residences — большое поместье с пятью спальнями, тремя ванными и частным бассейном.",
      el: "Το κορυφαίο κόσμημα — μεγάλη έπαυλη πέντε υπνοδωματίων με ιδιωτική πισίνα.",
    },
    highlights: [
      { en: "Private pool included", he: "בריכה פרטית כלולה", ru: "Частный бассейн включён", el: "Ιδιωτική πισίνα συμπεριλαμβάνεται" },
      { en: "212–214 m² interior", he: "פנים 212–214 מ\"ר", ru: "Интерьер 212–214 м²", el: "Εσωτερικό 212–214 τ.μ." },
      { en: "5 bed · 3 bath", he: "5 חדרי שינה · 3 חדרי אמבטיה", ru: "5 спален · 3 ванных", el: "5 υπ/τια · 3 μπάνια" },
    ],
    heroImage: null as unknown as Villa["heroImage"],
    galleryImages: [],
    floorPlanImages: [],
    typicalBedrooms: 5,
    typicalBathrooms: 3,
    areaRange: "212–214",
    sortOrder: 6,
  },
];

// Lookup helpers
const villaByName = (name: string) =>
  fallbackVillas.find((v) => v.name === name)!;

// ─── Units ────────────────────────────────────────────────────────────────────

type UnitSpec = {
  _id: string;
  unitNumber: string;
  status: UnitStatus;
  totalArea: number;
  outdoorArea: number;
  bedrooms: number;
  bathrooms: number;
  hasPool: boolean;
  hasParking: boolean;
  floorLevel?: "ground" | "upper";
  plotName: string;
  villaName: string;
};

const rawUnits: UnitSpec[] = [
  // Plot A
  { _id: "fallback-unit-a1", unitNumber: "A1", status: "sold", totalArea: 285.92, outdoorArea: 196.80, bedrooms: 5, bathrooms: 3, hasPool: true, hasParking: false, plotName: "A", villaName: "Yehonatan" },
  { _id: "fallback-unit-a2", unitNumber: "A2", status: "available", totalArea: 231.23, outdoorArea: 141.23, bedrooms: 5, bathrooms: 3, hasPool: true, hasParking: false, plotName: "A", villaName: "Yehonatan" },
  { _id: "fallback-unit-a3", unitNumber: "A3", status: "sold", totalArea: 122.23, outdoorArea: 70.16, bedrooms: 2, bathrooms: 2, hasPool: true, hasParking: false, plotName: "A", villaName: "Tai" },
  { _id: "fallback-unit-a4", unitNumber: "A4", status: "sold", totalArea: 146.47, outdoorArea: 94.40, bedrooms: 2, bathrooms: 2, hasPool: true, hasParking: false, plotName: "A", villaName: "Tai" },
  // Plot B
  { _id: "fallback-unit-b1", unitNumber: "B1", status: "available", totalArea: 183.50, outdoorArea: 124.42, bedrooms: 3, bathrooms: 2, hasPool: true, hasParking: false, plotName: "B", villaName: "Yair" },
  { _id: "fallback-unit-b2", unitNumber: "B2", status: "available", totalArea: 139.32, outdoorArea: 80.23, bedrooms: 3, bathrooms: 2, hasPool: true, hasParking: false, plotName: "B", villaName: "Yair" },
  { _id: "fallback-unit-b3", unitNumber: "B3", status: "available", totalArea: 168.16, outdoorArea: 104.98, bedrooms: 3, bathrooms: 2, hasPool: true, hasParking: false, plotName: "B", villaName: "Yair" },
  { _id: "fallback-unit-b4", unitNumber: "B4", status: "sold", totalArea: 138.67, outdoorArea: 86.60, bedrooms: 2, bathrooms: 2, hasPool: true, hasParking: false, plotName: "B", villaName: "Tai" },
  { _id: "fallback-unit-b5", unitNumber: "B5", status: "sold", totalArea: 143.70, outdoorArea: 91.63, bedrooms: 2, bathrooms: 2, hasPool: true, hasParking: false, plotName: "B", villaName: "Tai" },
  // Plot C
  { _id: "fallback-unit-c1", unitNumber: "C1", status: "sold", totalArea: 205.97, outdoorArea: 145.92, bedrooms: 3, bathrooms: 2, hasPool: true, hasParking: false, plotName: "C", villaName: "Michal" },
  { _id: "fallback-unit-c2", unitNumber: "C2", status: "available", totalArea: 136.81, outdoorArea: 79.96, bedrooms: 3, bathrooms: 2, hasPool: true, hasParking: false, plotName: "C", villaName: "Michal" },
  { _id: "fallback-unit-c3", unitNumber: "C3", status: "available", totalArea: 137.59, outdoorArea: 77.54, bedrooms: 3, bathrooms: 2, hasPool: true, hasParking: false, plotName: "C", villaName: "Michal" },
  { _id: "fallback-unit-c4", unitNumber: "C4", status: "sold", totalArea: 158.86, outdoorArea: 106.79, bedrooms: 2, bathrooms: 2, hasPool: true, hasParking: false, plotName: "C", villaName: "Tai" },
  { _id: "fallback-unit-c5", unitNumber: "C5", status: "sold", totalArea: 158.54, outdoorArea: 106.47, bedrooms: 2, bathrooms: 2, hasPool: true, hasParking: false, plotName: "C", villaName: "Tai" },
  // Plot D
  { _id: "fallback-unit-d1", unitNumber: "D1", status: "available", totalArea: 217.03, outdoorArea: 154.71, bedrooms: 3, bathrooms: 2, hasPool: true, hasParking: false, plotName: "D", villaName: "Michal" },
  { _id: "fallback-unit-d2", unitNumber: "D2", status: "available", totalArea: 115.38, outdoorArea: 56.77, bedrooms: 3, bathrooms: 2, hasPool: true, hasParking: false, plotName: "D", villaName: "Michal" },
  { _id: "fallback-unit-d3", unitNumber: "D3", status: "available", totalArea: 144.51, outdoorArea: 81.70, bedrooms: 3, bathrooms: 2, hasPool: true, hasParking: false, plotName: "D", villaName: "Michal" },
  { _id: "fallback-unit-d4", unitNumber: "D4", status: "available", totalArea: 133.00, outdoorArea: 70.69, bedrooms: 2, bathrooms: 2, hasPool: true, hasParking: false, plotName: "D", villaName: "Michal" },
  { _id: "fallback-unit-d5", unitNumber: "D5", status: "available", totalArea: 160.05, outdoorArea: 97.74, bedrooms: 2, bathrooms: 2, hasPool: true, hasParking: false, plotName: "D", villaName: "Michal" },
  // Plot E — ground floor Lola
  { _id: "fallback-unit-e1", unitNumber: "E1", status: "available", totalArea: 112.19, outdoorArea: 60.71, bedrooms: 1, bathrooms: 1, hasPool: true, hasParking: false, floorLevel: "ground", plotName: "E", villaName: "Lola" },
  { _id: "fallback-unit-e2", unitNumber: "E2", status: "available", totalArea: 100.60, outdoorArea: 49.12, bedrooms: 1, bathrooms: 1, hasPool: true, hasParking: false, floorLevel: "ground", plotName: "E", villaName: "Lola" },
  { _id: "fallback-unit-e3", unitNumber: "E3", status: "sold", totalArea: 99.91, outdoorArea: 48.43, bedrooms: 1, bathrooms: 1, hasPool: true, hasParking: false, floorLevel: "ground", plotName: "E", villaName: "Lola" },
  { _id: "fallback-unit-e4", unitNumber: "E4", status: "available", totalArea: 78.85, outdoorArea: 30.34, bedrooms: 1, bathrooms: 1, hasPool: true, hasParking: false, floorLevel: "ground", plotName: "E", villaName: "Lola" },
  { _id: "fallback-unit-e5", unitNumber: "E5", status: "available", totalArea: 81.76, outdoorArea: 30.28, bedrooms: 1, bathrooms: 1, hasPool: true, hasParking: false, floorLevel: "ground", plotName: "E", villaName: "Lola" },
  // Plot E — upper floor Mikka
  { _id: "fallback-unit-e6", unitNumber: "E6", status: "available", totalArea: 62.26, outdoorArea: 0, bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: false, floorLevel: "upper", plotName: "E", villaName: "Mikka" },
  { _id: "fallback-unit-e7", unitNumber: "E7", status: "available", totalArea: 62.26, outdoorArea: 0, bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: false, floorLevel: "upper", plotName: "E", villaName: "Mikka" },
  { _id: "fallback-unit-e8", unitNumber: "E8", status: "available", totalArea: 61.94, outdoorArea: 0, bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: false, floorLevel: "upper", plotName: "E", villaName: "Mikka" },
  { _id: "fallback-unit-e9", unitNumber: "E9", status: "available", totalArea: 59.21, outdoorArea: 0, bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: false, floorLevel: "upper", plotName: "E", villaName: "Mikka" },
  { _id: "fallback-unit-e10", unitNumber: "E10", status: "available", totalArea: 62.84, outdoorArea: 0, bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: false, floorLevel: "upper", plotName: "E", villaName: "Mikka" },
  // Plot F — ground floor Lola
  { _id: "fallback-unit-f1", unitNumber: "F1", status: "sold", totalArea: 162.11, outdoorArea: 110.63, bedrooms: 1, bathrooms: 1, hasPool: true, hasParking: false, floorLevel: "ground", plotName: "F", villaName: "Lola" },
  { _id: "fallback-unit-f2", unitNumber: "F2", status: "available", totalArea: 93.81, outdoorArea: 45.30, bedrooms: 1, bathrooms: 1, hasPool: true, hasParking: false, floorLevel: "ground", plotName: "F", villaName: "Lola" },
  { _id: "fallback-unit-f3", unitNumber: "F3", status: "available", totalArea: 122.08, outdoorArea: 70.60, bedrooms: 1, bathrooms: 1, hasPool: true, hasParking: false, floorLevel: "ground", plotName: "F", villaName: "Lola" },
  { _id: "fallback-unit-f4", unitNumber: "F4", status: "available", totalArea: 89.79, outdoorArea: 38.31, bedrooms: 1, bathrooms: 1, hasPool: true, hasParking: false, floorLevel: "ground", plotName: "F", villaName: "Lola" },
  { _id: "fallback-unit-f5", unitNumber: "F5", status: "available", totalArea: 87.84, outdoorArea: 36.36, bedrooms: 1, bathrooms: 1, hasPool: true, hasParking: false, floorLevel: "ground", plotName: "F", villaName: "Lola" },
  // Plot F — upper floor Mikka
  { _id: "fallback-unit-f6", unitNumber: "F6", status: "available", totalArea: 61.94, outdoorArea: 0, bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: false, floorLevel: "upper", plotName: "F", villaName: "Mikka" },
  { _id: "fallback-unit-f7", unitNumber: "F7", status: "available", totalArea: 59.21, outdoorArea: 0, bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: false, floorLevel: "upper", plotName: "F", villaName: "Mikka" },
  { _id: "fallback-unit-f8", unitNumber: "F8", status: "available", totalArea: 62.84, outdoorArea: 0, bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: false, floorLevel: "upper", plotName: "F", villaName: "Mikka" },
  { _id: "fallback-unit-f9", unitNumber: "F9", status: "available", totalArea: 62.26, outdoorArea: 0, bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: false, floorLevel: "upper", plotName: "F", villaName: "Mikka" },
  { _id: "fallback-unit-f10", unitNumber: "F10", status: "available", totalArea: 62.26, outdoorArea: 0, bedrooms: 1, bathrooms: 1, hasPool: false, hasParking: false, floorLevel: "upper", plotName: "F", villaName: "Mikka" },
];

/** All units shaped as UnitFlat (used by residences and masterplan pages) */
export const fallbackUnitsFlat: UnitFlat[] = rawUnits.map((u) => {
  const villa = villaByName(u.villaName);
  return {
    _id: u._id,
    unitNumber: u.unitNumber,
    status: u.status,
    totalArea: u.totalArea,
    bedrooms: u.bedrooms,
    bathrooms: u.bathrooms,
    hasPool: u.hasPool,
    plotName: u.plotName,
    villaTypeName: villa.name,
    villaTypeSlug: villa.slug.current,
  };
});

/** Units shaped as UnitWithRefs (used by villa detail page) */
export function getFallbackUnitsForVilla(slug: string): UnitWithRefs[] {
  return rawUnits
    .filter((u) => u.villaName.toLowerCase() === slug.toLowerCase())
    .map((u) => ({
      _id: u._id,
      unitNumber: u.unitNumber,
      status: u.status,
      totalArea: u.totalArea,
      outdoorArea: u.outdoorArea,
      bedrooms: u.bedrooms,
      bathrooms: u.bathrooms,
      hasPool: u.hasPool,
      hasParking: u.hasParking,
      plotName: u.plotName,
    }));
}

// ─── Plots ────────────────────────────────────────────────────────────────────

// Positions matched to the aerial photo from the PDF presentation
const plotPositions: Record<string, { x: number; y: number }> = {
  A: { x: 22, y: 62 },
  B: { x: 32, y: 72 },
  C: { x: 46, y: 58 },
  D: { x: 56, y: 45 },
  E: { x: 68, y: 33 },
  F: { x: 82, y: 27 },
};

export const fallbackPlots: PlotWithUnits[] = ["A", "B", "C", "D", "E", "F"].map(
  (name, idx) => {
    const plotUnits = rawUnits
      .filter((u) => u.plotName === name)
      .map((u) => {
        const villa = villaByName(u.villaName);
        return {
          _id: u._id,
          unitNumber: u.unitNumber,
          status: u.status,
          totalArea: u.totalArea,
          bedrooms: u.bedrooms,
          hasPool: u.hasPool,
          villaTypeName: villa.name,
          villaTypeSlug: villa.slug.current,
        };
      });

    return {
      _id: `fallback-plot-${name.toLowerCase()}`,
      name,
      summary: {
        en: `Plot ${name} — ${plotUnits.length} exclusive residences with private pools and sea views.`,
        he: `מגרש ${name} — ${plotUnits.length} דירות יוקרה עם בריכות פרטיות ונוף לים.`,
        ru: `Участок ${name} — ${plotUnits.length} эксклюзивных резиденций с частными бассейнами и видом на море.`,
        el: `Οικόπεδο ${name} — ${plotUnits.length} αποκλειστικές κατοικίες με ιδιωτικές πισίνες και θέα στη θάλασσα.`,
      },
      aerialImage: null as unknown as PlotWithUnits["aerialImage"],
      positionData: plotPositions[name],
      sortOrder: idx + 1,
      units: plotUnits,
    };
  }
);

// ─── Upgrades ─────────────────────────────────────────────────────────────────

export const fallbackUpgrades = [
  {
    _id: "fallback-upgrade-pool",
    name: { en: "Pool", he: "בריכה", ru: "Бассейн", el: "Πισίνα" },
    description: {
      en: "Private swimming pool with automated cleaning system.",
      he: "בריכת שחייה פרטית עם מערכת ניקוי אוטומטית.",
      ru: "Частный бассейн с автоматической системой очистки.",
      el: "Ιδιωτική πισίνα με αυτόματο σύστημα καθαρισμού.",
    },
    image: null as unknown as NonNullable<unknown>,
    category: "outdoor",
    sortOrder: 1,
  },
  {
    _id: "fallback-upgrade-jacuzzi",
    name: { en: "Outdoor Jacuzzi", he: "ג'קוזי חיצוני", ru: "Джакузи на открытом воздухе", el: "Εξωτερικό Τζακούζι" },
    description: {
      en: "Premium outdoor jacuzzi for ultimate relaxation.",
      he: "ג'קוזי חיצוני פרימיום לרגיעה מוחלטת.",
      ru: "Премиальное джакузи для максимального расслабления.",
      el: "Premium εξωτερικό τζακούζι για απόλυτη χαλάρωση.",
    },
    image: null as unknown as NonNullable<unknown>,
    category: "outdoor",
    sortOrder: 2,
  },
  {
    _id: "fallback-upgrade-sauna",
    name: { en: "2-Person Outdoor Sauna", he: "סאונה חיצונית לשניים", ru: "Уличная сауна на 2 человека", el: "Εξωτερική Σάουνα 2 Ατόμων" },
    description: {
      en: "Finnish-style outdoor sauna for two, crafted from premium wood.",
      he: "סאונה חיצונית בסגנון פיני לשניים, עשויה מעץ פרימיום.",
      ru: "Финская уличная сауна на двоих из премиальной древесины.",
      el: "Φινλανδική εξωτερική σάουνα δύο ατόμων από premium ξύλο.",
    },
    image: null as unknown as NonNullable<unknown>,
    category: "outdoor",
    sortOrder: 3,
  },
  {
    _id: "fallback-upgrade-bbq",
    name: { en: "BBQ Corner", he: "פינת ברביקיו", ru: "Уголок барбекю", el: "Γωνία BBQ" },
    description: {
      en: "Built-in outdoor BBQ station with counter and seating.",
      he: "תחנת ברביקיו חיצונית מובנית עם דלפק ומקומות ישיבה.",
      ru: "Встроенный открытый барбекю с столешницей и сиденьями.",
      el: "Ενσωματωμένος εξωτερικός σταθμός BBQ με πάγκο και καθίσματα.",
    },
    image: null as unknown as NonNullable<unknown>,
    category: "outdoor",
    sortOrder: 4,
  },
  {
    _id: "fallback-upgrade-smarthome",
    name: { en: "Smart House System", he: "מערכת בית חכם", ru: "Система умного дома", el: "Σύστημα Έξυπνου Σπιτιού" },
    description: {
      en: "Full home automation — lighting, climate, security and entertainment all from your phone.",
      he: "אוטומציה מלאה לבית — תאורה, אקלים, אבטחה ובידור - הכל מהטלפון שלך.",
      ru: "Полная автоматизация дома — освещение, климат, безопасность и развлечения с телефона.",
      el: "Πλήρης οικιακή αυτοματοποίηση — φωτισμός, κλίμα, ασφάλεια και ψυχαγωγία από το τηλέφωνό σας.",
    },
    image: null as unknown as NonNullable<unknown>,
    category: "technology",
    sortOrder: 5,
  },
  {
    _id: "fallback-upgrade-security",
    name: { en: "Security System", he: "מערכת אבטחה", ru: "Система безопасности", el: "Σύστημα Ασφαλείας" },
    description: {
      en: "24/7 monitored security with cameras, motion sensors and smart locks.",
      he: "אבטחה 24/7 עם מצלמות, חיישני תנועה ומנעולים חכמים.",
      ru: "Круглосуточная охрана с камерами, датчиками движения и умными замками.",
      el: "Παρακολούθηση ασφαλείας 24/7 με κάμερες, αισθητήρες κίνησης και έξυπνες κλειδαριές.",
    },
    image: null as unknown as NonNullable<unknown>,
    category: "technology",
    sortOrder: 6,
  },
  {
    _id: "fallback-upgrade-fireplace",
    name: { en: "Indoor Fireplace", he: "אח פנימי", ru: "Домашний камин", el: "Εσωτερικό Τζάκι" },
    description: {
      en: "Elegant bio-ethanol indoor fireplace for cosy winter evenings.",
      he: "אח פנימי אלגנטי מביו-אתנול לערבי חורף נעימים.",
      ru: "Элегантный биоэтанольный камин для уютных зимних вечеров.",
      el: "Κομψό εσωτερικό τζάκι βιο-αιθανόλης για ζεστά χειμωνιάτικα βράδια.",
    },
    image: null as unknown as NonNullable<unknown>,
    category: "interior",
    sortOrder: 7,
  },
];

// ─── Derived stats ────────────────────────────────────────────────────────────

export const fallbackStats = {
  total: rawUnits.length,
  available: rawUnits.filter((u) => u.status === "available").length,
  reserved: rawUnits.filter((u) => u.status === "reserved").length,
  sold: rawUnits.filter((u) => u.status === "sold").length,
};

// ─── Page documents ───────────────────────────────────────────────────────────

export function getFallbackHomePage(): HomePage {
  return {
    heroTagline: {
      en: "Hidden from many,",
      he: "נסתר מרבים,",
      ru: "Скрыто от многих,",
      el: "Κρυμμένο από πολλούς,",
    },
    heroSubtitle: {
      en: "perfect for few",
      he: "מושלם לבודדים",
      ru: "совершенно для немногих",
      el: "τέλειο για λίγους",
    },
    heroImage: null as unknown as HomePage["heroImage"],
    conceptEyebrow: {
      en: "THE CONCEPT",
      he: "הרעיון",
      ru: "КОНЦЕПЦИЯ",
      el: "Η ΙΔΕΑ",
    },
    conceptCopy: {
      en: "In a world of crowded destinations and standard offerings, we create something different. Sea'cret Residences Chiliadou — modern coastal living in Greece's hidden gem, just 30 min from Patras. 10 min from Nafpaktos. 20 min from Trizonia Island. A secret worth discovering.",
      he: "בעולם של יעדים עמוסים והצעות סטנדרטיות, אנחנו יוצרים משהו אחר. Sea'cret Residences Chiliadou — חיי חוף מודרניים באבן חן נסתרת של יוון, 30 דק' מפטרס. 10 דק' מנפקטוס. 20 דק' מאי טריזוניה.",
      ru: "В мире переполненных направлений и стандартных предложений мы создаём нечто иное. Sea'cret Residences Chiliadou — современная прибрежная жизнь в скрытой жемчужине Греции, всего в 30 минутах от Патр.",
      el: "Σε έναν κόσμο με πολυσύχναστους προορισμούς, δημιουργούμε κάτι διαφορετικό. Sea'cret Residences Chiliadou — σύγχρονη παράκτια ζωή στο κρυμμένο διαμάντι της Ελλάδας.",
    },
    conceptImage: null as unknown as HomePage["conceptImage"],
    lifestyleMoments: [
      {
        period: "Morning",
        copy: {
          en: "Wake to the sound of gentle waves. Coffee on your private terrace. The gulf stretching to the horizon.",
          he: "התעוררות לצלילי גלים עדינים. קפה במרפסת הפרטית שלך. המפרץ המתפרש עד האופק.",
          ru: "Просыпайтесь под звук мягких волн. Кофе на частной террасе. Залив, уходящий к горизонту.",
          el: "Ξυπνήστε με τον ήχο απαλών κυμάτων. Καφές στην ιδιωτική σας βεράντα.",
        },
        image: null as unknown as HomePage["lifestyleMoments"][number]["image"],
      },
      {
        period: "Day",
        copy: {
          en: "Explore ancient Delphi. Swim in crystal-clear waters. Discover charming Galaxidi.",
          he: "גלה את דלפי העתיקה. שחה במים צלולים כבדולח. גלה את גלקסידי הקסומה.",
          ru: "Исследуйте древние Дельфы. Плавайте в кристально чистых водах. Откройте для себя очаровательный Галаксиди.",
          el: "Εξερευνήστε τους αρχαίους Δελφούς. Κολυμπήστε σε κρυστάλλινα νερά. Ανακαλύψτε τη γοητευτική Γαλαξίδι.",
        },
        image: null as unknown as HomePage["lifestyleMoments"][number]["image"],
      },
      {
        period: "Evening",
        copy: {
          en: "Sunset from your private pool. Local wine and fresh seafood. Stars reflecting on the water.",
          he: "שקיעה מהבריכה הפרטית שלך. יין מקומי ופירות ים טריים. כוכבים המשתקפים במים.",
          ru: "Закат у частного бассейна. Местное вино и свежие морепродукты. Звёзды, отражающиеся в воде.",
          el: "Ηλιοβασίλεμα από την ιδιωτική σας πισίνα. Τοπικό κρασί και φρέσκα θαλασσινά.",
        },
        image: null as unknown as HomePage["lifestyleMoments"][number]["image"],
      },
    ],
    featuredVillas: fallbackVillas.map(
      (v): FeaturedVilla => ({
        _id: v._id,
        name: v.name,
        slug: v.slug,
        label: v.label,
        heroImage: v.heroImage,
        typicalBedrooms: v.typicalBedrooms,
        areaRange: v.areaRange,
        sortOrder: v.sortOrder,
      })
    ),
    masterplanImage: null as unknown as HomePage["masterplanImage"],
    ctaTitle: {
      en: "Discover Your Sea'cret",
      he: "גלה את ה-Sea'cret שלך",
      ru: "Откройте свой Sea'cret",
      el: "Ανακαλύψτε το Sea'cret σας",
    },
    ctaSubtitle: {
      en: "From €150K · Only 39 exclusive residences",
      he: "מ-€150K · רק 39 בתי מגורים בלעדיים",
      ru: "От €150K · Только 39 эксклюзивных резиденций",
      el: "Από €150K · Μόνο 39 αποκλειστικές κατοικίες",
    },
    seoTitle: {
      en: "Sea'cret Residences Chiliadou — Luxury Coastal Living in Greece",
      he: "Sea'cret Residences Chiliadou — מגורי חוף יוקרתיים ביוון",
      ru: "Sea'cret Residences Chiliadou — Роскошная прибрежная жизнь в Греции",
      el: "Sea'cret Residences Chiliadou — Πολυτελής Παράκτια Διαβίωση στην Ελλάδα",
    },
    seoDescription: {
      en: "Discover 39 exclusive beachfront residences in Chiliadou, Greece. Modern architecture, pristine coastline, from €150K.",
      he: "גלה 39 בתי מגורים בלעדיים על קו החוף בצ'יליאדו, יוון. אדריכלות מודרנית, חוף פסטורלי, מ-€150K.",
      ru: "Откройте для себя 39 эксклюзивных резиденций на берегу моря в Чилиаду, Греция. Современная архитектура, нетронутое побережье, от €150K.",
      el: "Ανακαλύψτε 39 αποκλειστικές κατοικίες παραλίας στο Χιλιαδού, Ελλάδα. Σύγχρονη αρχιτεκτονική, από €150K.",
    },
  };
}

export function getFallbackResidencesPage(): ResidencesPage {
  return {
    heroImage: null as unknown as ResidencesPage["heroImage"],
    heroTitle: {
      en: "The Residences",
      he: "הדירות",
      ru: "Резиденции",
      el: "Οι Κατοικίες",
    },
    introCopy: {
      en: "Six distinct villa types. Each a private world.",
      he: "שישה סוגי וילות שונים. כל אחת עולם פרטי.",
      ru: "Шесть различных типов вилл. Каждая — отдельный мир.",
      el: "Έξι διακριτοί τύποι βιλών. Ο καθένας ένας ιδιωτικός κόσμος.",
    },
    seoTitle: {
      en: "Residences — Sea'cret Residences",
      he: "הדירות — Sea'cret Residences",
      ru: "Резиденции — Sea'cret Residences",
      el: "Κατοικίες — Sea'cret Residences",
    },
    seoDescription: {
      en: "Discover all 6 villa types. Filter, compare, and find the perfect private retreat.",
      he: "גלה את כל 6 סוגי הוילות. סנן, השווה ומצא את המקלט הפרטי המושלם.",
      ru: "Откройте для себя все 6 типов вилл. Фильтруйте, сравнивайте и найдите идеальное частное убежище.",
      el: "Ανακαλύψτε και τους 6 τύπους βιλών. Φιλτράρετε, συγκρίνετε και βρείτε την τέλεια ιδιωτική κατοικία.",
    },
  };
}

export function getFallbackMasterplanPage(): MasterplanPage {
  return {
    heroImage: null as unknown as MasterplanPage["heroImage"],
    heroTitle: {
      en: "The Masterplan",
      he: "התוכנית הכוללת",
      ru: "Генеральный план",
      el: "Το Κύριο Σχέδιο",
    },
    introCopy: {
      en: "6 residential plots. 39 exclusive villas. Explore the layout.",
      he: "6 מגרשי מגורים. 39 וילות בלעדיות. חקור את הפריסה.",
      ru: "6 жилых участков. 39 эксклюзивных вилл. Изучите планировку.",
      el: "6 οικιστικά οικόπεδα. 39 αποκλειστικές βίλες. Εξερευνήστε τη διάταξη.",
    },
    seoTitle: {
      en: "Masterplan — Sea'cret Residences",
      he: "תוכנית כוללת — Sea'cret Residences",
      ru: "Генеральный план — Sea'cret Residences",
      el: "Κύριο Σχέδιο — Sea'cret Residences",
    },
    seoDescription: {
      en: "Explore the interactive masterplan. Browse plots, check availability, and find your ideal residence.",
      he: "חקור את התוכנית הכוללת האינטראקטיבית. עיין במגרשים, בדוק זמינות ומצא את מגוריך האידיאליים.",
      ru: "Изучите интерактивный генеральный план. Просматривайте участки, проверяйте наличие и находите идеальную резиденцию.",
      el: "Εξερευνήστε το διαδραστικό κύριο σχέδιο. Περιηγηθείτε σε οικόπεδα, ελέγξτε διαθεσιμότητα.",
    },
  };
}

/** Fallback villa-with-units for the villa detail page */
export function getFallbackVillaWithUnits(
  slug: string
): (Villa & { units: UnitWithRefs[] }) | null {
  const villa = fallbackVillas.find((v) => v.slug.current === slug);
  if (!villa) return null;
  return { ...villa, units: getFallbackUnitsForVilla(slug) };
}
