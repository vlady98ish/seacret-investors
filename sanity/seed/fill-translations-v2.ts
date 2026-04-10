/**
 * Fill new UI strings added for v2 localization pass.
 * Run: npx tsx sanity/seed/fill-translations-v2.ts
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

function loadEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) throw new Error(`.env.local not found`);
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

const newStrings: Record<string, { en: string; ru: string; he: string; el: string }> = {
  miscSimilarOptions: {
    en: "— similar options available",
    ru: "— доступны похожие варианты",
    he: "— אפשרויות דומות זמינות",
    el: "— παρόμοιες επιλογές διαθέσιμες",
  },
  sectionLocation: { en: "Location", ru: "Расположение", he: "מיקום", el: "Τοποθεσία" },
  sectionResidences: { en: "Residences", ru: "Резиденции", he: "מגורים", el: "Κατοικίες" },
  sectionMasterplan: { en: "Masterplan", ru: "Генплан", he: "תוכנית אב", el: "Γενικό Σχέδιο" },
  sectionLifestyle: { en: "Lifestyle", ru: "Стиль жизни", he: "אורח חיים", el: "Τρόπος ζωής" },
  ctaExploreLocation: { en: "Explore the Location", ru: "Узнать о расположении", he: "חקרו את המיקום", el: "Εξερευνήστε την τοποθεσία" },
  ctaExploreMasterplan: { en: "Explore the Masterplan", ru: "Изучить генплан", he: "חקרו את תוכנית האב", el: "Εξερευνήστε το γενικό σχέδιο" },
  ctaRequestBrochure: { en: "Request a Brochure", ru: "Запросить брошюру", he: "בקשו חוברת", el: "Ζητήστε φυλλάδιο" },
  formStep: { en: "Step", ru: "Шаг", he: "שלב", el: "Βήμα" },
  formWhatInterested: { en: "What are you interested in?", ru: "Что вас интересует?", he: "?במה אתם מעוניינים", el: "Τι σας ενδιαφέρει;" },
  formChooseVilla: {
    en: "Choose a villa type or general inquiry",
    ru: "Выберите тип виллы или общий запрос",
    he: "בחרו סוג וילה או פנייה כללית",
    el: "Επιλέξτε τύπο βίλας ή γενικό αίτημα",
  },
  formGeneralInquiry: { en: "General Inquiry", ru: "Общий запрос", he: "פנייה כללית", el: "Γενικό αίτημα" },
  formYourDetails: { en: "Your details", ru: "Ваши данные", he: "הפרטים שלכם", el: "Τα στοιχεία σας" },
  formPhonePlaceholder: { en: "+30 XXX XXX XXXX", ru: "+30 XXX XXX XXXX", he: "+30 XXX XXX XXXX", el: "+30 XXX XXX XXXX" },
  formAdditionalInfo: { en: "Additional information", ru: "Дополнительная информация", he: "מידע נוסף", el: "Επιπλέον πληροφορίες" },
  formBudgetRange: { en: "Budget Range", ru: "Диапазон бюджета", he: "טווח תקציב", el: "Εύρος προϋπολογισμού" },
  formTimeline: { en: "Timeline", ru: "Сроки", he: "לוח זמנים", el: "Χρονοδιάγραμμα" },
  formMessagePlaceholder: {
    en: "Tell us about your plans...",
    ru: "Расскажите о ваших планах...",
    he: "...ספרו לנו על התוכניות שלכם",
    el: "Πείτε μας για τα σχέδιά σας...",
  },
  formThankYou: { en: "Thank you!", ru: "Спасибо!", he: "!תודה", el: "Ευχαριστούμε!" },
  formThankYouMessage: {
    en: "We have received your enquiry and will be in touch shortly.",
    ru: "Мы получили ваш запрос и свяжемся с вами в ближайшее время.",
    he: "קיבלנו את פנייתכם וניצור קשר בהקדם.",
    el: "Λάβαμε το αίτημά σας και θα επικοινωνήσουμε σύντομα.",
  },
  miscSelectPlot: {
    en: "Select a plot on the map to see details",
    ru: "Выберите участок на карте для подробностей",
    he: "בחרו מגרש במפה לפרטים",
    el: "Επιλέξτε ένα οικόπεδο στον χάρτη για λεπτομέρειες",
  },
  miscChatWhatsapp: { en: "Chat on WhatsApp", ru: "Написать в WhatsApp", he: "שלחו הודעה בוואטסאפ", el: "Συνομιλία στο WhatsApp" },
  miscChatViber: { en: "Chat on Viber", ru: "Написать в Viber", he: "שלחו הודעה בוייבר", el: "Συνομιλία στο Viber" },
  ctaViberUs: { en: "Viber Us", ru: "Напишите в Viber", he: "שלחו לנו בוייבר", el: "Στείλτε μας στο Viber" },
};

async function main() {
  console.log("\n🌐 Adding new UI strings with translations...\n");

  const patch: Record<string, { en: string; ru: string; he: string; el: string }> = {};
  for (const [key, value] of Object.entries(newStrings)) {
    patch[key] = value;
  }

  for (const id of ["uiStrings", "drafts.uiStrings"]) {
    try {
      await client.patch(id).set(patch).commit();
      console.log(`  ✓ uiStrings (${id}) — ${Object.keys(newStrings).length} new fields`);
      break;
    } catch {
      // try next
    }
  }

  console.log("\n✅ Done!\n");
}

main().catch(console.error);
