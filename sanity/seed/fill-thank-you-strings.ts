/**
 * Seed thank-you page UI strings.
 * Run: npx tsx sanity/seed/fill-thank-you-strings.ts
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
  formThankYouMessage: {
    en: "We have received your enquiry and will be in touch shortly.",
    ru: "Мы получили ваш запрос и свяжемся с вами в ближайшее время.",
    he: "קיבלנו את פנייתכם וניצור קשר בהקדם.",
    el: "Λάβαμε το αίτημά σας και θα επικοινωνήσουμε σύντομα.",
  },
  formThankYouNextSteps: {
    en: "What happens next",
    ru: "Что дальше",
    he: "מה הלאה",
    el: "Τι ακολουθεί",
  },
  formThankYouStep1Title: {
    en: "A personal manager will contact you",
    ru: "Персональный менеджер свяжется с вами",
    he: "מנהל אישי ייצור איתכם קשר",
    el: "Ένας προσωπικός σύμβουλος θα επικοινωνήσει μαζί σας",
  },
  formThankYouStep1Desc: {
    en: "Via the email or phone you provided",
    ru: "По email или телефону, который вы указали",
    he: "באמצעות המייל או הטלפון שציינתם",
    el: "Μέσω email ή τηλεφώνου που δηλώσατε",
  },
  formThankYouStep2Title: {
    en: "We'll prepare a personalized offer",
    ru: "Подготовим индивидуальное предложение",
    he: "נכין עבורכם הצעה מותאמת אישית",
    el: "Θα ετοιμάσουμε μια εξατομικευμένη πρόταση",
  },
  formThankYouStep2Desc: {
    en: "Based on your preferences and budget",
    ru: "С учётом ваших предпочтений и бюджета",
    he: "בהתאם להעדפות ולתקציב שלכם",
    el: "Με βάση τις προτιμήσεις και τον προϋπολογισμό σας",
  },
  formThankYouStep3Title: {
    en: "We'll arrange a virtual or in-person tour",
    ru: "Организуем виртуальный или личный тур",
    he: "נארגן סיור וירטואלי או אישי",
    el: "Θα κανονίσουμε εικονική ή προσωπική ξενάγηση",
  },
  formThankYouStep3Desc: {
    en: "At your convenience",
    ru: "По вашему удобному графику",
    he: "בזמן הנוח לכם",
    el: "Στη δική σας ευκολία",
  },
};

async function main() {
  console.log("\n🎉 Seeding thank-you page strings...\n");

  for (const id of ["uiStrings", "drafts.uiStrings"]) {
    try {
      await client.patch(id).set(newStrings).commit();
      console.log(`  ✓ uiStrings (${id}) — ${Object.keys(newStrings).length} fields`);
      break;
    } catch {
      // try next
    }
  }

  console.log("\n✅ Done!\n");
}

main().catch(console.error);
