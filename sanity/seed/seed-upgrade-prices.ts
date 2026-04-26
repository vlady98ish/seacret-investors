import { createClient } from "@sanity/client";
import "dotenv/config";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const PRICE_NOTE = { en: "excl. VAT", he: 'לא כולל מע"מ', ru: "без НДС", el: "excl. VAT" };

const upgradePrices: Record<string, { price: number; priceUnit: string }> = {
  bbq: { price: 6000, priceUnit: "item" },
  jacuzzi: { price: 8000, priceUnit: "item" },
  sauna: { price: 4000, priceUnit: "item" },
  pool: { price: 16000, priceUnit: "item" },
  "smart-house": { price: 7000, priceUnit: "item" },
  security: { price: 3000, priceUnit: "item" },
  fireplace: { price: 3000, priceUnit: "item" },
};

async function main() {
  const upgrades = await client.fetch<Array<{ _id: string; category: string }>>(
    `*[_type == "upgrade"]{ _id, category }`
  );

  const tx = client.transaction();
  let patched = 0;

  for (const u of upgrades) {
    const priceInfo = upgradePrices[u.category];
    if (priceInfo) {
      tx.patch(u._id, (p) =>
        p.set({
          price: priceInfo.price,
          priceUnit: priceInfo.priceUnit,
          priceNote: PRICE_NOTE,
        })
      );
      patched++;
    }
  }

  if (patched > 0) {
    const result = await tx.commit();
    console.log(`Patched ${patched} upgrades with prices`, result);
  } else {
    console.log("No upgrades matched. Check category values in Sanity.");
  }
}

main().catch(console.error);
