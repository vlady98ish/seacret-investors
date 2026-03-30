/**
 * Seed experience + FAQ documents with all 4 language translations.
 * Also adds airport-related uiStrings.
 * Run: npx tsx sanity/seed/seed-cms-content.ts
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

type L = { en: string; ru: string; he: string; el: string };

// ---------------------------------------------------------------------------
// Experience documents
// ---------------------------------------------------------------------------

const experiences: Array<{ _id: string; title: L; description: L; category: string; sortOrder: number }> = [
  // Culture
  {
    _id: "exp-delphi",
    title: { en: "Ancient Delphi — Oracle of the ancient world", ru: "Древние Дельфы — оракул античного мира", he: "דלפי העתיקה — אורקל העולם העתיק", el: "Αρχαίοι Δελφοί — Μαντείο του αρχαίου κόσμου" },
    description: { en: "UNESCO World Heritage site, just 2 hours away", ru: "Объект Всемирного наследия ЮНЕСКО, всего в 2 часах езды", he: "אתר מורשת עולמית של אונסק״ו, במרחק שעתיים בלבד", el: "Μνημείο Παγκόσμιας Κληρονομιάς UNESCO, μόλις 2 ώρες μακριά" },
    category: "culture", sortOrder: 1,
  },
  {
    _id: "exp-galaxidi",
    title: { en: "Galaxidi — A preserved 19th-century seafaring town", ru: "Галаксиди — сохранённый морской город XIX века", he: "גלקסידי — עיר ימית משומרת מהמאה ה-19", el: "Γαλαξίδι — Διατηρημένη ναυτική πόλη του 19ου αιώνα" },
    description: { en: "Charming stone houses, waterfront tavernas, nautical museum", ru: "Очаровательные каменные дома, таверны на набережной, морской музей", he: "בתי אבן מקסימים, טברנות על הטיילת, מוזיאון ימי", el: "Γοητευτικά πέτρινα σπίτια, ταβέρνες στο λιμάνι, ναυτικό μουσείο" },
    category: "culture", sortOrder: 2,
  },
  {
    _id: "exp-monasteries",
    title: { en: "Byzantine monasteries in the hills", ru: "Византийские монастыри в холмах", he: "מנזרים ביזנטיים בגבעות", el: "Βυζαντινά μοναστήρια στους λόφους" },
    description: { en: "Hidden spiritual retreats amid olive groves", ru: "Скрытые духовные убежища среди оливковых рощ", he: "מפלטים רוחניים מוסתרים בין כרמי זיתים", el: "Κρυμμένα πνευματικά καταφύγια ανάμεσα σε ελαιώνες" },
    category: "culture", sortOrder: 3,
  },
  {
    _id: "exp-tavernas",
    title: { en: "Local tavernas with generational recipes", ru: "Местные таверны с рецептами поколений", he: "טברנות מקומיות עם מתכונים מדורי דורות", el: "Τοπικές ταβέρνες με συνταγές γενεών" },
    description: { en: "Authentic Greek cuisine passed down through families", ru: "Аутентичная греческая кухня, передаваемая из поколения в поколение", he: "מטבח יווני אותנטי שעובר מדור לדור", el: "Αυθεντική ελληνική κουζίνα που περνά από γενιά σε γενιά" },
    category: "culture", sortOrder: 4,
  },
  // Nature
  {
    _id: "exp-beaches",
    title: { en: "Blue Flag beaches minutes from home", ru: "Пляжи с Голубым флагом в минутах от дома", he: "חופי דגל כחול דקות מהבית", el: "Παραλίες Γαλάζιας Σημαίας λίγα λεπτά από το σπίτι" },
    description: { en: "Crystal-clear waters with EU quality certification", ru: "Кристально чистые воды с сертификацией качества ЕС", he: "מים צלולים עם תו תקן איכות אירופי", el: "Κρυστάλλινα νερά με πιστοποίηση ποιότητας ΕΕ" },
    category: "nature", sortOrder: 1,
  },
  {
    _id: "exp-pools",
    title: { en: "Private pools with Corinthian Gulf views", ru: "Частные бассейны с видом на Коринфский залив", he: "בריכות פרטיות עם נוף למפרץ קורינתוס", el: "Ιδιωτικές πισίνες με θέα στον Κορινθιακό Κόλπο" },
    description: { en: "Infinity edges meeting the horizon", ru: "Бассейны-инфинити, сливающиеся с горизонтом", he: "בריכות אינסוף שנפגשות עם האופק", el: "Πισίνες υπερχείλισης που συναντούν τον ορίζοντα" },
    category: "nature", sortOrder: 2,
  },
  {
    _id: "exp-hiking",
    title: { en: "Olive grove hiking trails through ancient trees", ru: "Пешие тропы через оливковые рощи", he: "שבילי הליכה בכרמי זיתים עתיקים", el: "Μονοπάτια πεζοπορίας σε αιωνόβιους ελαιώνες" },
    description: { en: "Centuries-old olive trees along scenic paths", ru: "Вековые оливковые деревья вдоль живописных троп", he: "עצי זית בני מאות שנים לאורך שבילים ציוריים", el: "Αιωνόβια ελαιόδεντρα κατά μήκος γραφικών μονοπατιών" },
    category: "nature", sortOrder: 3,
  },
  {
    _id: "exp-kayaking",
    title: { en: "Kayaking in secluded coastal bays", ru: "Каякинг в уединённых прибрежных бухтах", he: "שייט קיאקים במפרצונים מבודדים", el: "Καγιάκ σε απομονωμένους παραθαλάσσιους κόλπους" },
    description: { en: "Explore hidden coves along the coastline", ru: "Исследуйте скрытые бухты вдоль побережья", he: "חקרו מפרצונים נסתרים לאורך קו החוף", el: "Εξερευνήστε κρυφούς κόλπους κατά μήκος της ακτογραμμής" },
    category: "nature", sortOrder: 4,
  },
  // Gastronomy
  {
    _id: "exp-olives",
    title: { en: "Amfissa olives — PDO protected, world-renowned", ru: "Оливки Амфиссы — защищённое наименование, мировая известность", he: "זיתי אמפיסה — מוגנים PDO, בעלי שם עולמי", el: "Ελιές Άμφισσας — ΠΟΠ, παγκοσμίως γνωστές" },
    description: { en: "Greece's most prized table olives from the region", ru: "Самые ценные столовые оливки Греции из этого региона", he: "זיתי השולחן היוקרתיים ביותר של יוון מהאזור", el: "Οι πιο πολύτιμες επιτραπέζιες ελιές της Ελλάδας από την περιοχή" },
    category: "gastronomy", sortOrder: 1,
  },
  {
    _id: "exp-seafood",
    title: { en: "Fresh gulf seafood caught daily", ru: "Свежие морепродукты залива каждый день", he: "פירות ים טריים מהמפרץ כל יום", el: "Φρέσκα θαλασσινά του κόλπου καθημερινά" },
    description: { en: "Straight from the Corinthian Gulf to your table", ru: "Прямо из Коринфского залива на ваш стол", he: "ישירות ממפרץ קורינתוס לשולחן שלכם", el: "Από τον Κορινθιακό Κόλπο κατευθείαν στο τραπέζι σας" },
    category: "gastronomy", sortOrder: 2,
  },
  {
    _id: "exp-cheese",
    title: { en: "Local cheeses and artisan honey", ru: "Местные сыры и ремесленный мёд", he: "גבינות מקומיות ודבש אומן", el: "Τοπικά τυριά και αρτοποιητικό μέλι" },
    description: { en: "Small-batch producers keeping traditions alive", ru: "Мелкие производители, хранящие традиции", he: "יצרנים קטנים ששומרים על מסורות חיות", el: "Μικροί παραγωγοί που κρατούν τις παραδόσεις ζωντανές" },
    category: "gastronomy", sortOrder: 3,
  },
  {
    _id: "exp-wine",
    title: { en: "Wine tastings at regional estates", ru: "Дегустации вин на региональных поместьях", he: "טעימות יין באחוזות אזוריות", el: "Γευσιγνωσίες κρασιού σε τοπικά κτήματα" },
    description: { en: "Discover local varietals in stunning settings", ru: "Откройте местные сорта в потрясающих декорациях", he: "גלו זנים מקומיים בנופים מדהימים", el: "Ανακαλύψτε τοπικές ποικιλίες σε εκπληκτικά σκηνικά" },
    category: "gastronomy", sortOrder: 4,
  },
];

// ---------------------------------------------------------------------------
// FAQ documents
// ---------------------------------------------------------------------------

const faqs: Array<{ _id: string; question: L; answer: L; category: string; sortOrder: number }> = [
  {
    _id: "faq-golden-visa",
    question: {
      en: "Is this property eligible for Greece's Golden Visa program?",
      ru: "Подходит ли эта недвижимость для программы «Золотая виза» Греции?",
      he: "?האם הנכס כשיר לתוכנית ויזת הזהב של יוון",
      el: "Είναι αυτό το ακίνητο επιλέξιμο για το πρόγραμμα Golden Visa της Ελλάδας;",
    },
    answer: {
      en: "Yes, the Greek Golden Visa program grants residency permits to non-EU nationals who invest in real estate above a certain threshold. Our team can guide you through the entire process, from property selection to permit application.",
      ru: "Да, программа «Золотая виза» Греции предоставляет вид на жительство гражданам стран, не входящих в ЕС, при инвестициях в недвижимость выше определённого порога. Наша команда проведёт вас через весь процесс — от выбора объекта до подачи заявления.",
      he: "כן, תוכנית ויזת הזהב של יוון מעניקה היתרי שהייה לאזרחים שאינם מהאיחוד האירופי שמשקיעים בנדל״ן מעל סף מסוים. הצוות שלנו ילווה אתכם בכל התהליך, מבחירת הנכס ועד הגשת הבקשה.",
      el: "Ναι, το πρόγραμμα Golden Visa της Ελλάδας χορηγεί άδειες διαμονής σε πολίτες εκτός ΕΕ που επενδύουν σε ακίνητα πάνω από ένα ορισμένο κατώφλι. Η ομάδα μας μπορεί να σας καθοδηγήσει σε όλη τη διαδικασία.",
    },
    category: "investment", sortOrder: 1,
  },
  {
    _id: "faq-timeline",
    question: {
      en: "What is the expected delivery timeline?",
      ru: "Каковы ожидаемые сроки сдачи?",
      he: "?מהם לוחות הזמנים הצפויים למסירה",
      el: "Ποιο είναι το αναμενόμενο χρονοδιάγραμμα παράδοσης;",
    },
    answer: {
      en: "Construction is progressing on schedule. Current units are in various stages of completion. Contact us for specific timeline details on available units.",
      ru: "Строительство идёт по графику. Текущие юниты находятся на различных стадиях завершения. Свяжитесь с нами для уточнения сроков по доступным юнитам.",
      he: "הבנייה מתקדמת בהתאם ללוח הזמנים. יחידות נוכחיות נמצאות בשלבי השלמה שונים. צרו קשר לפרטים ספציפיים על לוחות זמנים.",
      el: "Η κατασκευή προχωρά σύμφωνα με το χρονοδιάγραμμα. Οι τρέχουσες μονάδες βρίσκονται σε διάφορα στάδια ολοκλήρωσης. Επικοινωνήστε μαζί μας για συγκεκριμένες λεπτομέρειες.",
    },
    category: "construction", sortOrder: 2,
  },
  {
    _id: "faq-rental",
    question: {
      en: "Can I rent out my property when not in use?",
      ru: "Могу ли я сдавать свою недвижимость в аренду, когда не использую её?",
      he: "?האם אפשר להשכיר את הנכס כשאני לא משתמש/ת בו",
      el: "Μπορώ να νοικιάσω το ακίνητό μου όταν δεν το χρησιμοποιώ;",
    },
    answer: {
      en: "Absolutely. Chiliadou's growing tourism appeal makes short-term rental a viable income source. We can connect you with local property management services.",
      ru: "Безусловно. Растущая туристическая привлекательность Хилиаду делает краткосрочную аренду жизнеспособным источником дохода. Мы можем связать вас с местными управляющими компаниями.",
      he: "בהחלט. הקסם התיירותי הגובר של חיליאדו הופך השכרה לטווח קצר למקור הכנסה ריאלי. נוכל לחבר אתכם עם שירותי ניהול נכסים מקומיים.",
      el: "Απολύτως. Η αυξανόμενη τουριστική ελκυστικότητα της Χιλιαδού καθιστά τη βραχυχρόνια μίσθωση βιώσιμη πηγή εισοδήματος. Μπορούμε να σας συνδέσουμε με τοπικές υπηρεσίες διαχείρισης.",
    },
    category: "investment", sortOrder: 3,
  },
  {
    _id: "faq-financing",
    question: {
      en: "What financing options are available?",
      ru: "Какие варианты финансирования доступны?",
      he: "?אילו אפשרויות מימון זמינות",
      el: "Ποιες επιλογές χρηματοδότησης είναι διαθέσιμες;",
    },
    answer: {
      en: "We work with several Greek and international banks that offer mortgage financing for non-residents. Terms typically range from 15 to 25 years with competitive rates. Our team can introduce you to our banking partners.",
      ru: "Мы сотрудничаем с несколькими греческими и международными банками, предлагающими ипотечное финансирование для нерезидентов. Сроки обычно составляют от 15 до 25 лет с конкурентными ставками.",
      he: "אנו עובדים עם מספר בנקים יווניים ובינלאומיים שמציעים מימון משכנתא לתושבי חוץ. התנאים נעים בין 15 ל-25 שנה עם ריביות תחרותיות.",
      el: "Συνεργαζόμαστε με αρκετές ελληνικές και διεθνείς τράπεζες που προσφέρουν στεγαστικά δάνεια σε μη κατοίκους. Οι όροι κυμαίνονται συνήθως από 15 έως 25 έτη με ανταγωνιστικά επιτόκια.",
    },
    category: "legal", sortOrder: 4,
  },
  {
    _id: "faq-upgrades",
    question: {
      en: "What upgrades are available?",
      ru: "Какие улучшения доступны?",
      he: "?אילו שדרוגים זמינים",
      el: "Ποιες αναβαθμίσεις είναι διαθέσιμες;",
    },
    answer: {
      en: "Each residence can be customized with premium upgrades including private swimming pools, jacuzzis, outdoor BBQ areas, smart-home automation, enhanced security systems, and fireplaces. See the Upgrades section for details.",
      ru: "Каждую резиденцию можно индивидуализировать премиальными улучшениями: частные бассейны, джакузи, зоны барбекю, системы умного дома, усиленная безопасность и камины. Подробности в разделе «Улучшения».",
      he: "כל מגורים ניתנים להתאמה אישית עם שדרוגים פרימיום כולל בריכות שחייה פרטיות, ג׳קוזי, אזורי ברביקיו, אוטומציית בית חכם, מערכות אבטחה משופרות וקמינים.",
      el: "Κάθε κατοικία μπορεί να προσαρμοστεί με premium αναβαθμίσεις όπως ιδιωτικές πισίνες, τζακούζι, χώρους BBQ, αυτοματισμό έξυπνου σπιτιού, ενισχυμένα συστήματα ασφαλείας και τζάκια.",
    },
    category: "lifestyle", sortOrder: 5,
  },
];

// ---------------------------------------------------------------------------
// Airport-related uiStrings
// ---------------------------------------------------------------------------

const airportStrings: Record<string, { en: string; ru: string; he: string; el: string }> = {
  miscFromChiliadou: { en: "from Chiliadou", ru: "из Хилиаду", he: "מחיליאדו", el: "από τη Χιλιαδού" },
  miscDestinations: { en: "destinations", ru: "направлений", he: "יעדים", el: "προορισμοί" },
  miscCountries: { en: "countries", ru: "стран", he: "מדינות", el: "χώρες" },
  miscWorldwide: { en: "worldwide", ru: "по всему миру", he: "ברחבי העולם", el: "παγκοσμίως" },
  miscNearest: { en: "Nearest", ru: "Ближайший", he: "הקרוב ביותר", el: "Πλησιέστερο" },
  miscCorinthianGulf: { en: "Corinthian Gulf, Central Greece", ru: "Коринфский залив, Центральная Греция", he: "מפרץ קורינתוס, מרכז יוון", el: "Κορινθιακός Κόλπος, Κεντρική Ελλάδα" },
};

// ---------------------------------------------------------------------------
// Seed logic
// ---------------------------------------------------------------------------

async function main() {
  console.log("\n🌐 Seeding experiences, FAQs, and airport uiStrings...\n");

  // Seed experiences
  for (const exp of experiences) {
    try {
      await client.createOrReplace({
        _id: exp._id,
        _type: "experience",
        title: exp.title,
        description: exp.description,
        category: exp.category,
        sortOrder: exp.sortOrder,
      });
      console.log(`  ✓ experience: ${exp._id}`);
    } catch (e: unknown) {
      console.log(`  ✗ experience: ${exp._id} — ${e instanceof Error ? e.message : e}`);
    }
  }

  // Seed FAQs
  for (const faq of faqs) {
    try {
      await client.createOrReplace({
        _id: faq._id,
        _type: "faq",
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        sortOrder: faq.sortOrder,
      });
      console.log(`  ✓ faq: ${faq._id}`);
    } catch (e: unknown) {
      console.log(`  ✗ faq: ${faq._id} — ${e instanceof Error ? e.message : e}`);
    }
  }

  // Patch airport uiStrings
  for (const id of ["uiStrings", "drafts.uiStrings"]) {
    try {
      await client.patch(id).set(airportStrings).commit();
      console.log(`  ✓ uiStrings airport fields (${id})`);
      break;
    } catch {
      // try next
    }
  }

  console.log("\n✅ Done!\n");
}

main().catch(console.error);
