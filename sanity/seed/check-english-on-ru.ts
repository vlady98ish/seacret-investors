/**
 * Opens each page in Russian locale and finds any remaining English text.
 * Run: npx tsx sanity/seed/check-english-on-ru.ts
 */

import { chromium } from "playwright";

const BASE = "http://localhost:3002/ru";
const PAGES = ["", "/residences", "/masterplan", "/location", "/about", "/contact"];

// Words/phrases that are OK in English even on Russian page
const ALLOWED = new Set([
  "sea'cret", "seacret", "live better", "live better group",
  "whatsapp", "email", "phone", "faq", "roi", "seo",
  "lola", "mikka", "tai", "michal", "yair", "yehonatan",
  "en", "he", "ru", "gr", "m²", "m2", "€",
  "pdf", "3d", "cookie", "cookies", "google",
]);

function isEnglish(text: string): boolean {
  const clean = text.trim().toLowerCase();
  if (clean.length < 3) return false;
  if (ALLOWED.has(clean)) return false;
  // Check if text contains mostly Latin characters (English)
  const latinChars = clean.replace(/[^a-z]/g, "").length;
  const totalChars = clean.replace(/[\s\d\.\,\-\|\—\–\/\:\;\(\)\[\]\{\}\@\#\$\%\^\&\*\+\=\~\!\?\'\"\€\²]+/g, "").length;
  if (totalChars === 0) return false;
  // If more than 70% Latin characters, it's likely English
  return latinChars / totalChars > 0.7;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const path of PAGES) {
    const url = `${BASE}${path}`;
    console.log(`\n📄 ${url}`);
    console.log("─".repeat(60));

    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Get all visible text nodes
    const texts = await page.evaluate(() => {
      const results: { text: string; tag: string; classes: string }[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            if (["script", "style", "noscript", "svg", "path"].includes(tag)) return NodeFilter.FILTER_REJECT;
            const style = window.getComputedStyle(parent);
            if (style.display === "none" || style.visibility === "hidden") return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        },
      );

      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent?.trim();
        if (text && text.length > 2) {
          const parent = node.parentElement!;
          results.push({
            text,
            tag: parent.tagName.toLowerCase(),
            classes: parent.className?.toString().slice(0, 50) || "",
          });
        }
      }
      return results;
    });

    const englishTexts = texts.filter((t) => isEnglish(t.text));

    if (englishTexts.length === 0) {
      console.log("  ✅ No English text found");
    } else {
      for (const t of englishTexts) {
        const preview = t.text.length > 80 ? t.text.slice(0, 80) + "…" : t.text;
        console.log(`  ❌ <${t.tag}> "${preview}"`);
      }
      console.log(`  Total: ${englishTexts.length} English fragments`);
    }
  }

  await browser.close();
}

main().catch(console.error);
