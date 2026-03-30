"""
Opens each page in Russian locale and finds remaining English text.
Run: python sanity/seed/check-english-on-ru.py
"""

import re
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3002/ru"
PAGES = ["", "/residences", "/masterplan", "/location", "/about", "/contact"]

ALLOWED = {
    "sea'cret", "seacret", "sea'cret residences", "live better", "live better group",
    "whatsapp", "email", "phone", "faq", "roi", "seo", "pdf", "google",
    "lola", "mikka", "tai", "michal", "yair", "yehonatan",
    "en", "he", "ru", "gr", "el",
    "cookie", "cookies", "3d", "react",
    "chiliadou", "nafpaktos", "patras", "athens", "galaxidi",
    "trizonia", "corinth", "corinthian",
}

def is_english(text: str) -> bool:
    clean = text.strip()
    if len(clean) < 3:
        return False
    low = clean.lower()
    if low in ALLOWED:
        return False
    # Skip if any allowed word is the entire text
    for w in ALLOWED:
        if low == w:
            return False
    # Count Latin vs non-Latin characters
    latin = len(re.findall(r'[a-zA-Z]', clean))
    total = len(re.sub(r'[\s\d\.\,\-\|\—\–\/\:\;\(\)\[\]\{\}\@\#\$\%\^\&\*\+\=\~\!\?\'\"\€\²\°\→\←]+', '', clean))
    if total == 0:
        return False
    return latin / total > 0.7

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        for path in PAGES:
            url = f"{BASE}{path}"
            print(f"\n📄 {url}")
            print("─" * 60)

            page.goto(url, wait_until="networkidle", timeout=30000)

            texts = page.evaluate("""() => {
                const results = [];
                const walker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_TEXT,
                    {
                        acceptNode(node) {
                            const parent = node.parentElement;
                            if (!parent) return NodeFilter.FILTER_REJECT;
                            const tag = parent.tagName.toLowerCase();
                            if (['script','style','noscript','svg','path'].includes(tag)) return NodeFilter.FILTER_REJECT;
                            const style = window.getComputedStyle(parent);
                            if (style.display === 'none' || style.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }
                );
                let node;
                while (node = walker.nextNode()) {
                    const text = node.textContent?.trim();
                    if (text && text.length > 2) {
                        const parent = node.parentElement;
                        results.push({
                            text: text,
                            tag: parent.tagName.toLowerCase(),
                        });
                    }
                }
                return results;
            }""")

            english = [t for t in texts if is_english(t["text"])]

            if not english:
                print("  ✅ No English text found")
            else:
                for t in english:
                    preview = t["text"][:80] + "…" if len(t["text"]) > 80 else t["text"]
                    print(f'  ❌ <{t["tag"]}> "{preview}"')
                print(f"  Total: {len(english)} English fragments")

        browser.close()

if __name__ == "__main__":
    main()
