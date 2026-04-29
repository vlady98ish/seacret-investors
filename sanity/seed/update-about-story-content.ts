import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

function loadEnv(): Record<string, string> {
  const envLocalPath = path.resolve(process.cwd(), ".env.local");
  const envPath = fs.existsSync(envLocalPath) ? envLocalPath : path.resolve(process.cwd(), ".env");

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

const storyContent = {
  en: "In September 2020, while the world was in lockdown, Tom Linkovsky and Evgeny Kalika — friends for over 30 years — saw what others missed: untapped potential in the Greek real estate market. They started in Patras, a vibrant university city and major transport hub on the Peloponnese coast.\n\nThe problem was clear — students were living in outdated, poorly maintained apartments. The solution became Live Better's first concept: the \"Airbnb for students\" — fully furnished apartments for long-term rental. Five years in, the model has a perfect track record: zero vacant units exceeding one week.\n\nFrom student housing, the group expanded into family residences, property flips, villa construction, and luxury vacation homes. Today Live Better Group operates across Patras, Athens, and the resort towns of Chiliadou and Akrata — with 14 projects in progress and over 420 housing units in the pipeline.",
  ru: "В сентябре 2020 года, когда мир был на карантине, Том Линковски и Евгений Калика — друзья более 30 лет — увидели то, что другие упустили: нереализованный потенциал греческого рынка недвижимости. Они начали в Патрах — динамичном университетском городе и важном транспортном узле Пелопоннеса.\n\nПроблема была очевидной: студенты жили в устаревших и плохо обслуживаемых квартирах. Ответом стала первая концепция Live Better — «Airbnb для студентов»: полностью меблированные квартиры для долгосрочной аренды. За пять лет модель показала безупречный результат: ни один объект не простаивал дольше недели.\n\nОт студенческого жилья группа перешла к семейным резиденциям, реновациям, строительству вилл и курортной недвижимости премиального уровня. Сегодня Live Better Group работает в Патрах, Афинах, а также в курортных локациях Хилиаду и Акрата — с 14 проектами в реализации и портфелем более 420 жилых единиц.",
  he: "בספטמבר 2020, כשהעולם היה בסגר, טום לינקובסקי ויבגני קליקה — חברים למעלה מ-30 שנה — זיהו מה שאחרים פספסו: פוטנציאל לא ממומש בשוק הנדל״ן היווני. הם התחילו בפטרס, עיר אוניברסיטאית תוססת ומוקד תחבורה מרכזי בפלופונס.\n\nהבעיה הייתה ברורה: סטודנטים התגוררו בדירות מיושנות ומתוחזקות ברמה נמוכה. הפתרון היה הקונספט הראשון של Live Better — \"Airbnb לסטודנטים\": דירות מרוהטות במלואן להשכרה ארוכת טווח. בתוך חמש שנים המודל הוכיח את עצמו עם נתון עקבי: אפס נכסים שנותרו ריקים ליותר משבוע.\n\nמהדיור לסטודנטים התרחבה הקבוצה למגורי משפחות, שיפוצים, בניית וילות ונכסי נופש ברמת פרימיום. כיום Live Better Group פועלת בפטרס, אתונה, וכן באזורי הנופש חיליאדו ואקרטה — עם 14 פרויקטים פעילים וצנרת של יותר מ-420 יחידות דיור.",
  el: "Τον Σεπτέμβριο του 2020, ενώ ο κόσμος βρισκόταν σε lockdown, ο Tom Linkovsky και ο Evgeny Kalika — φίλοι για πάνω από 30 χρόνια — είδαν αυτό που άλλοι δεν είδαν: τις ανεκμετάλλευτες δυνατότητες της ελληνικής αγοράς ακινήτων. Ξεκίνησαν από την Πάτρα, μια δυναμική πανεπιστημιούπολη και σημαντικό συγκοινωνιακό κόμβο της Πελοποννήσου.\n\nΤο πρόβλημα ήταν ξεκάθαρο: οι φοιτητές ζούσαν σε παλιά και κακώς συντηρημένα διαμερίσματα. Η απάντηση ήταν το πρώτο concept της Live Better — το «Airbnb για φοιτητές»: πλήρως επιπλωμένα διαμερίσματα για μακροχρόνια μίσθωση. Μέσα σε πέντε χρόνια, το μοντέλο απέδειξε την αξία του: κανένα ακίνητο δεν έμενε κενό για περισσότερο από μία εβδομάδα.\n\nΑπό τη φοιτητική κατοικία, ο όμιλος επεκτάθηκε σε οικογενειακές κατοικίες, ανακαινίσεις, κατασκευή βιλών και πολυτελείς εξοχικές κατοικίες. Σήμερα η Live Better Group δραστηριοποιείται στην Πάτρα, την Αθήνα, καθώς και στις περιοχές αναψυχής Χιλιαδού και Ακράτα — με 14 έργα σε εξέλιξη και χαρτοφυλάκιο άνω των 420 κατοικιών.",
};

async function main() {
  console.log(`\nUpdating aboutPage storyContent translations in ${projectId}/${dataset}...\n`);

  for (const id of ["aboutPage", "drafts.aboutPage"]) {
    try {
      await client.patch(id).set({ storyContent }).commit();
      console.log(`  ✓ updated ${id}`);
    } catch {
      // ignore if doc variant doesn't exist
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nFailed:", err);
  process.exit(1);
});
