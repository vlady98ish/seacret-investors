/**
 * Patch siteSettings with real contact data + viberNumber field.
 * Also adds new Viber UI strings and updates directDescription.
 * Run: npx tsx sanity/seed/patch-site-settings.ts
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

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
    const value = trimmed
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    vars[key] = value;
  }
  return vars;
}

const env = loadEnv();
const projectId = env["NEXT_PUBLIC_SANITY_PROJECT_ID"];
const dataset = env["NEXT_PUBLIC_SANITY_DATASET"] ?? "production";
const token = env["SANITY_WRITE_TOKEN"];

if (!projectId || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function patchSiteSettings() {
  console.log("\n📞 Patching siteSettings with real contact data...\n");

  for (const id of ["siteSettings", "drafts.siteSettings"]) {
    const doc = await client.getDocument(id);
    if (!doc) {
      console.log(`⏭  ${id} not found, skipping`);
      continue;
    }

    await client
      .patch(id)
      .set({
        salesEmail: "office@livebettergr.com",
        salesPhone: "+30 693 1843439",
        whatsappNumber: "306931843439",
        viberNumber: "306931843439",
      })
      .commit();

    console.log(`✅ ${id} patched`);
  }
}

async function patchUiStrings() {
  console.log("\n💬 Adding Viber UI strings...\n");

  for (const id of ["uiStrings", "drafts.uiStrings"]) {
    const doc = await client.getDocument(id);
    if (!doc) {
      console.log(`⏭  ${id} not found, skipping`);
      continue;
    }

    await client
      .patch(id)
      .set({
        ctaViberUs: { en: "Viber Us", ru: "Напишите в Viber", he: "שלחו לנו בוייבר", el: "Στείλτε μας στο Viber" },
        miscChatViber: { en: "Chat on Viber", ru: "Написать в Viber", he: "שלחו הודעה בוייבר", el: "Συνομιλία στο Viber" },
      })
      .commit();

    console.log(`✅ ${id} patched`);
  }
}

async function patchContactPageDescription() {
  console.log("\n📝 Updating contact page directDescription to mention Viber...\n");

  for (const id of ["contactPage", "drafts.contactPage"]) {
    const doc = await client.getDocument(id);
    if (!doc) {
      console.log(`⏭  ${id} not found, skipping`);
      continue;
    }

    await client
      .patch(id)
      .set({
        "directDescription.en": "Prefer a direct conversation? Reach us on WhatsApp, Viber, by email, or give us a call.",
        "directDescription.ru": "Предпочитаете прямой разговор? Свяжитесь с нами через WhatsApp, Viber, email или по телефону.",
        "directDescription.he": "מעדיפים שיחה ישירה? פנו אלינו בוואטסאפ, וייבר, באימייל או בטלפון.",
        "directDescription.el": "Προτιμάτε άμεση επικοινωνία; Επικοινωνήστε μαζί μας μέσω WhatsApp, Viber, email ή τηλεφώνου.",
      })
      .unset(["responsePromise"])
      .commit();

    console.log(`✅ ${id} patched`);
  }
}

async function main() {
  await patchSiteSettings();
  await patchUiStrings();
  await patchContactPageDescription();
  console.log("\n🎉 All patches complete!\n");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
