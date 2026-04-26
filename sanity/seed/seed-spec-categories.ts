import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

function loadEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) throw new Error(`.env.local not found at ${envPath}`);
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

const categories = [
  {
    _type: "specCategory",
    _id: "specCategory-furniture",
    name: { en: "Furniture", he: "ריהוט", ru: "Мебель", el: "Furniture" },
    icon: "sofa",
    sortOrder: 1,
    items: [
      {
        _key: "living",
        area: { en: "Living Room", he: "סלון", ru: "Гостиная", el: "Living Room" },
        spec: { en: "Sofa 3-4 seats, armchairs, coffee table, TV unit, carpet", he: "ספה 3-4 מושבים, כורסאות, שולחן קפה, מזנון טלוויזיה, שטיח", ru: "Диван 3-4 места, кресла, журнальный стол, ТВ-тумба, ковёр", el: "Sofa 3-4 seats, armchairs, coffee table, TV unit, carpet" },
        notes: { en: "Core furnished living area", he: "אזור מגורים מרוהט", ru: "Основная жилая зона", el: "Core furnished living area" },
      },
      {
        _key: "bedrooms",
        area: { en: "Bedrooms", he: "חדרי שינה", ru: "Спальни", el: "Bedrooms" },
        spec: { en: "Bed, mattress, wardrobes, side tables", he: "מיטה, מזרן, ארונות, שידות", ru: "Кровать, матрас, шкафы, тумбочки", el: "Bed, mattress, wardrobes, side tables" },
        notes: { en: "Per room according to unit type", he: "לחדר בהתאם לסוג היחידה", ru: "На комнату по типу юнита", el: "Per room according to unit type" },
      },
      {
        _key: "dining",
        area: { en: "Dining", he: "פינת אוכל", ru: "Столовая", el: "Dining" },
        spec: { en: "Table + 4-8 chairs", he: "שולחן + 4-8 כיסאות", ru: "Стол + 4-8 стульев", el: "Table + 4-8 chairs" },
        notes: { en: "Depends on villa size", he: "בהתאם לגודל הווילה", ru: "Зависит от размера виллы", el: "Depends on villa size" },
      },
      {
        _key: "outdoor",
        area: { en: "Outdoor", he: "חוץ", ru: "Открытая зона", el: "Outdoor" },
        spec: { en: "Sunbeds, lounge set, dining set", he: "מיטות שיזוף, פינת ישיבה, פינת אוכל", ru: "Шезлонги, лаунж-набор, обеденный набор", el: "Sunbeds, lounge set, dining set" },
        notes: { en: "Garden / terrace package", he: "חבילת גינה / מרפסת", ru: "Пакет сад / терраса", el: "Garden / terrace package" },
      },
      {
        _key: "extras",
        area: { en: "Extras", he: "תוספות", ru: "Доп. элементы", el: "Extras" },
        spec: { en: "Curtains, lighting fixtures, mirrors", he: "וילונות, גופי תאורה, מראות", ru: "Шторы, светильники, зеркала", el: "Curtains, lighting fixtures, mirrors" },
        notes: { en: "Decor and fit-out package", he: "חבילת עיצוב וגימור", ru: "Пакет декора и отделки", el: "Decor and fit-out package" },
      },
    ],
  },
  {
    _type: "specCategory",
    _id: "specCategory-kitchen",
    name: { en: "Kitchen", he: "מטבח", ru: "Кухня", el: "Kitchen" },
    icon: "utensils-crossed",
    sortOrder: 2,
    items: [
      { _key: "cabinets", area: { en: "Cabinets", he: "ארונות", ru: "Шкафы", el: "Cabinets" }, spec: { en: "Custom MDF / lacquer", he: "MDF מותאם / לכה", ru: "MDF на заказ / лак", el: "Custom MDF / lacquer" }, notes: { en: "Final finish to be selected", he: "גימור סופי ייבחר", ru: "Финишное покрытие по выбору", el: "Final finish to be selected" } },
      { _key: "countertop", area: { en: "Countertop", he: "משטח עבודה", ru: "Столешница", el: "Countertop" }, spec: { en: "Quartz / Granite", he: "קוורץ / גרניט", ru: "Кварц / Гранит", el: "Quartz / Granite" }, notes: { en: "According to villa tier", he: "בהתאם לדרגת הווילה", ru: "По классу виллы", el: "According to villa tier" } },
      { _key: "appliances", area: { en: "Appliances", he: "מכשירי חשמל", ru: "Техника", el: "Appliances" }, spec: { en: "Oven, stove, hood, fridge", he: "תנור, כיריים, קולט, מקרר", ru: "Духовка, плита, вытяжка, холодильник", el: "Oven, stove, hood, fridge" }, notes: { en: "Integrated package", he: "חבילה משולבת", ru: "Комплексный пакет", el: "Integrated package" } },
      { _key: "sink", area: { en: "Sink", he: "כיור", ru: "Мойка", el: "Sink" }, spec: { en: "Double stainless", he: "כיור כפול נירוסטה", ru: "Двойная нержавеющая", el: "Double stainless" }, notes: { en: "Standard specification", he: "מפרט סטנדרטי", ru: "Стандартная спецификация", el: "Standard specification" } },
      { _key: "island", area: { en: "Island", he: "אי מטבח", ru: "Остров", el: "Island" }, spec: { en: "Yes (mid/high types)", he: "כן (סוגים בינוניים/גבוהים)", ru: "Да (средний/высокий тип)", el: "Yes (mid/high types)" }, notes: { en: "Applies to larger villas", he: "רלוונטי לווילות גדולות", ru: "Для больших вилл", el: "Applies to larger villas" } },
    ],
  },
  {
    _type: "specCategory",
    _id: "specCategory-outdoor",
    name: { en: "Outdoor & Pool", he: "חוץ ובריכה", ru: "Двор и бассейн", el: "Outdoor & Pool" },
    icon: "palmtree",
    sortOrder: 3,
    items: [
      { _key: "pool", area: { en: "Pool", he: "בריכה", ru: "Бассейн", el: "Pool" }, spec: { en: "Private", he: "פרטית", ru: "Частный", el: "Private" }, notes: { en: "Dedicated pool per villa / where applicable", he: "בריכה ייעודית לכל וילה", ru: "Отдельный бассейн на виллу", el: "Dedicated pool per villa" } },
      { _key: "size", area: { en: "Size", he: "גודל", ru: "Размер", el: "Size" }, spec: { en: "18–45 m²", he: "18–45 מ\"ר", ru: "18–45 м²", el: "18–45 m²" }, notes: { en: "By villa type", he: "בהתאם לסוג הווילה", ru: "По типу виллы", el: "By villa type" } },
      { _key: "heating", area: { en: "Heating", he: "חימום", ru: "Подогрев", el: "Heating" }, spec: { en: "Optional", he: "אופציונלי", ru: "Опционально", el: "Optional" }, notes: { en: "Upgrade option", he: "אפשרות שדרוג", ru: "Опция апгрейда", el: "Upgrade option" } },
      { _key: "garden", area: { en: "Garden", he: "גינה", ru: "Сад", el: "Garden" }, spec: { en: "Mediterranean landscaping", he: "גינון ים-תיכוני", ru: "Средиземноморский ландшафт", el: "Mediterranean landscaping" }, notes: { en: "Low-maintenance concept", he: "קונספט תחזוקה נמוכה", ru: "Концепция минимального ухода", el: "Low-maintenance concept" } },
      { _key: "irrigation", area: { en: "Irrigation", he: "השקיה", ru: "Полив", el: "Irrigation" }, spec: { en: "Automatic", he: "אוטומטית", ru: "Автоматический", el: "Automatic" }, notes: { en: "Installed system", he: "מערכת מותקנת", ru: "Установленная система", el: "Installed system" } },
      { _key: "fence", area: { en: "Fence", he: "גדר", ru: "Забор", el: "Fence" }, spec: { en: "Yes", he: "כן", ru: "Да", el: "Yes" }, notes: { en: "Privacy and safety", he: "פרטיות ובטיחות", ru: "Приватность и безопасность", el: "Privacy and safety" } },
    ],
  },
  {
    _type: "specCategory",
    _id: "specCategory-parking",
    name: { en: "Parking", he: "חניה", ru: "Парковка", el: "Parking" },
    icon: "car",
    sortOrder: 4,
    items: [
      { _key: "type", area: { en: "Type", he: "סוג", ru: "Тип", el: "Type" }, spec: { en: "Private", he: "פרטית", ru: "Частная", el: "Private" }, notes: { en: "Allocated to each villa", he: "מוקצה לכל וילה", ru: "Выделена для каждой виллы", el: "Allocated to each villa" } },
      { _key: "spaces", area: { en: "Spaces", he: "מקומות", ru: "Мест", el: "Spaces" }, spec: { en: "1–3", he: "1–3", ru: "1–3", el: "1–3" }, notes: { en: "According to unit type", he: "בהתאם לסוג היחידה", ru: "По типу юнита", el: "According to unit type" } },
      { _key: "covered", area: { en: "Covered", he: "מקורה", ru: "Крытая", el: "Covered" }, spec: { en: "Optional", he: "אופציונלי", ru: "Опционально", el: "Optional" }, notes: { en: "Pergola / covered option", he: "פרגולה / אפשרות מקורה", ru: "Пергола / крытый вариант", el: "Pergola / covered option" } },
      { _key: "ev", area: { en: "EV", he: "רכב חשמלי", ru: "Электромобиль", el: "EV" }, spec: { en: "Ready", he: "מוכן", ru: "Готово", el: "Ready" }, notes: { en: "Electric vehicle preparation", he: "הכנה לרכב חשמלי", ru: "Подготовка для электромобиля", el: "Electric vehicle preparation" } },
    ],
  },
  {
    _type: "specCategory",
    _id: "specCategory-technical",
    name: { en: "Technical", he: "מפרט טכני", ru: "Технические системы", el: "Technical" },
    icon: "settings-2",
    sortOrder: 5,
    items: [
      { _key: "ac", area: { en: "AC", he: "מיזוג אוויר", ru: "Кондиционер", el: "AC" }, spec: { en: "VRF / Split", he: "VRF / Split", ru: "VRF / Split", el: "VRF / Split" }, notes: { en: "Depending on MEP design", he: "בהתאם לתכנון MEP", ru: "По проекту MEP", el: "Depending on MEP design" } },
      { _key: "heating", area: { en: "Heating", he: "חימום", ru: "Отопление", el: "Heating" }, spec: { en: "Heat Pump", he: "משאבת חום", ru: "Тепловой насос", el: "Heat Pump" }, notes: { en: "Energy efficient solution", he: "פתרון חסכוני באנרגיה", ru: "Энергоэффективное решение", el: "Energy efficient solution" } },
      { _key: "solar", area: { en: "Solar", he: "סולארי", ru: "Солнечная", el: "Solar" }, spec: { en: "Yes", he: "כן", ru: "Да", el: "Yes" }, notes: { en: "Solar support / water heating", he: "תמיכה סולארית / חימום מים", ru: "Солнечная поддержка / нагрев воды", el: "Solar support / water heating" } },
      { _key: "windows", area: { en: "Windows", he: "חלונות", ru: "Окна", el: "Windows" }, spec: { en: "Double glazing", he: "זיגוג כפול", ru: "Двойное остекление", el: "Double glazing" }, notes: { en: "Energy-efficient glazing", he: "זיגוג חסכוני באנרגיה", ru: "Энергосберегающее остекление", el: "Energy-efficient glazing" } },
      { _key: "insulation", area: { en: "Insulation", he: "בידוד", ru: "Изоляция", el: "Insulation" }, spec: { en: "Full EU standard", he: "תקן EU מלא", ru: "Полный стандарт ЕС", el: "Full EU standard" }, notes: { en: "Envelope insulation standard", he: "תקן בידוד מעטפת", ru: "Стандарт изоляции оболочки", el: "Envelope insulation standard" } },
      { _key: "smart", area: { en: "Smart Home", he: "בית חכם", ru: "Умный дом", el: "Smart Home" }, spec: { en: "Optional", he: "אופציונלי", ru: "Опционально", el: "Optional" }, notes: { en: "Upgrade package", he: "חבילת שדרוג", ru: "Пакет апгрейда", el: "Upgrade package" } },
    ],
  },
];

async function main() {
  const tx = client.transaction();
  for (const cat of categories) {
    tx.createOrReplace(cat);
  }
  const result = await tx.commit();
  console.log(`Seeded ${categories.length} spec categories`, result);
}

main().catch(console.error);
