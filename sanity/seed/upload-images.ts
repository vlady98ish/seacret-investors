/**
 * Download images from Vercel deployment and upload to Sanity CMS.
 * Links uploaded assets to existing CMS documents.
 *
 * Usage: npx tsx sanity/seed/upload-images.ts
 */

import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// Load env (.env.local preferred, else .env)
const envPath = [path.resolve(process.cwd(), ".env.local"), path.resolve(process.cwd(), ".env")].find((p) =>
  fs.existsSync(p)
);
if (!envPath) {
  throw new Error("Create .env.local or .env with NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN");
}
const envLines = fs.readFileSync(envPath, "utf8").split("\n");
const env: Record<string, string> = {};
for (const l of envLines) {
  const idx = l.indexOf("=");
  if (idx > 0) env[l.slice(0, idx).trim()] = l.slice(idx + 1).trim();
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-03-28",
  useCdn: false,
  token: env.SANITY_WRITE_TOKEN,
});

const BASE_URL = "https://seacret-investors-v2.vercel.app";
const TMP_DIR = path.join(os.tmpdir(), "sanity-image-upload");

// ─── Image manifest ──────────────────────────────────────────────────────

const VILLA_IMAGES: Record<string, { hero: string; gallery: string[]; plans: string[] }> = {
  Tai: {
    hero: "/assets/pdf/villas/tai-hero.png",
    gallery: ["/assets/pdf/villas/tai-gallery.png", "/assets/pdf/villas/tai-living.png"],
    plans: ["/assets/pdf/villas/tai-plans.png"],
  },
  Yehonatan: {
    hero: "/assets/pdf/villas/yehonatan-hero.png",
    gallery: ["/assets/pdf/villas/yehonatan-gallery.png", "/assets/pdf/villas/yehonatan-pool.png"],
    plans: ["/assets/pdf/villas/yehonatan-plans.png"],
  },
  Michal: {
    hero: "/assets/pdf/villas/michal-hero.png",
    gallery: ["/assets/pdf/villas/michal-gallery.png", "/assets/pdf/villas/michal-pool.png"],
    plans: ["/assets/pdf/villas/michal-plans.png"],
  },
  Yair: {
    hero: "/assets/pdf/villas/yair-hero.png",
    gallery: ["/assets/pdf/villas/yair-gallery.png"],
    // Floor plan tabs: ground → upper → attic (same order as FloorPlans labels on the site)
    plans: [
      "/villas/yair-ground-floor.png",
      // Add when ready: "/villas/yair-upper-floor.png", "/villas/yair-attic.png"
    ],
  },
  Lola: {
    hero: "/assets/pdf/villas/green-hero.png",
    gallery: ["/assets/pdf/villas/green-gallery.png", "/assets/pdf/villas/green-interior.png"],
    plans: ["/assets/pdf/villas/green-plans.png"],
  },
  Mikka: {
    hero: "/assets/pdf/villas/green-hero.png",
    gallery: ["/assets/pdf/villas/green-gallery.png", "/assets/pdf/villas/green-interior.png"],
    plans: ["/assets/pdf/villas/green-plans.png"],
  },
};

const PAGE_IMAGES = {
  homePage: { heroImage: "/assets/pdf/page-02-hero.jpg", conceptImage: "/assets/pdf/page-04-location.jpg" },
  locationPage: { heroImage: "/assets/pdf/page-04-location.jpg" },
  masterplanPage: { heroImage: "/assets/pdf/masterplan-aerial.jpg" },
  residencesPage: { heroImage: "/assets/pdf/page-02-hero.jpg" },
  aboutPage: { heroImage: "/assets/team/about-hero.jpg" },
};

const LIFESTYLE_IMAGES = [
  "/assets/pdf/lifestyle-morning.jpg",
  "/assets/pdf/lifestyle-day.jpg",
  "/assets/pdf/page-02-hero.jpg", // evening
];

/** Shown on the homepage masterplan teaser as a carousel (requires ≥2 successful downloads). */
const HOME_MASTERPLAN_GALLERY = [
  "/assets/pdf/masterplan-aerial.jpg",
  "/assets/pdf/page-02-hero.jpg",
  "/assets/pdf/page-04-location.jpg",
  "/assets/pdf/lifestyle-morning.jpg",
  "/assets/pdf/lifestyle-day.jpg",
];

const FOUNDER_IMAGES: Record<string, string> = {
  "Tom Linkovsky": "/assets/team/tom-linkovsky.webp",
  "Evgeny Kalika": "/assets/team/evgeny-kalika.webp",
};

// ─── Helpers ─────────────────────────────────────────────────────────────

async function downloadFile(urlPath: string): Promise<string> {
  const url = BASE_URL + urlPath;
  const filename = urlPath.replace(/\//g, "_").slice(1);
  const dest = path.join(TMP_DIR, filename);

  if (fs.existsSync(dest)) return dest;

  console.log(`  ↓ Downloading ${urlPath}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return dest;
}

/** Prefer committed files under public/ so uploads work before the next Vercel deploy. */
async function resolveLocalOrRemote(urlPath: string): Promise<string> {
  const localPublic = path.join(process.cwd(), "public", urlPath.replace(/^\//, ""));
  if (fs.existsSync(localPublic)) {
    console.log(`  📁 Using local public${urlPath}`);
    return localPublic;
  }
  return downloadFile(urlPath);
}

const uploadCache = new Map<string, string>(); // urlPath → asset._id

async function uploadImage(urlPath: string): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } }> {
  if (uploadCache.has(urlPath)) {
    const cachedId = uploadCache.get(urlPath)!;
    return { _type: "image", asset: { _type: "reference", _ref: cachedId } };
  }

  const filePath = await resolveLocalOrRemote(urlPath);
  const ext = path.extname(filePath).slice(1) || "png";
  const contentType = ext === "jpg" ? "image/jpeg" : ext === "webp" ? "image/webp" : `image/${ext}`;
  const filename = path.basename(urlPath);

  console.log(`  ↑ Uploading ${filename} to Sanity`);
  const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
    filename,
    contentType,
  });

  uploadCache.set(urlPath, asset._id);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

// ─── Upload logic ────────────────────────────────────────────────────────

async function uploadVillaImages() {
  console.log("\n═══ Villa Images ═══");
  const villas = await client.fetch<Array<{ _id: string; name: string }>>(
    '*[_type == "villa"]{ _id, name }'
  );

  for (const villa of villas) {
    const images = VILLA_IMAGES[villa.name];
    if (!images) {
      console.log(`⚠ No images mapped for villa: ${villa.name}`);
      continue;
    }

    console.log(`\n📷 ${villa.name}`);
    const heroImage = await uploadImage(images.hero);
    const galleryImages = await Promise.all(images.gallery.map(uploadImage));
    const floorPlanImages = await Promise.all(images.plans.map(uploadImage));

    await client.patch(villa._id).set({ heroImage, galleryImages, floorPlanImages }).commit();
    console.log(`  ✓ ${villa.name} updated`);
  }
}

async function uploadPageImages() {
  console.log("\n═══ Page Images ═══");

  for (const [docType, imageFields] of Object.entries(PAGE_IMAGES)) {
    const doc = await client.fetch<{ _id: string } | null>(
      `*[_type == "${docType}"][0]{ _id }`
    );
    if (!doc) {
      console.log(`⚠ No ${docType} document found`);
      continue;
    }

    console.log(`\n📄 ${docType}`);
    const patch: Record<string, any> = {};
    for (const [field, urlPath] of Object.entries(imageFields)) {
      patch[field] = await uploadImage(urlPath);
    }

    await client.patch(doc._id).set(patch).commit();
    console.log(`  ✓ ${docType} updated`);
  }
}

async function uploadHomeMasterplanGallery() {
  console.log("\n═══ Home page — Masterplan gallery ═══");

  const homePage = await client.fetch<{ _id: string } | null>('*[_type == "homePage"][0]{ _id }');
  if (!homePage?._id) {
    console.log("⚠ No homePage document found");
    return;
  }

  const images: Array<{ _type: "image"; asset: { _type: "reference"; _ref: string } }> = [];
  for (const urlPath of HOME_MASTERPLAN_GALLERY) {
    try {
      images.push(await uploadImage(urlPath));
    } catch (e) {
      console.warn(`  ⚠ Skipped ${urlPath}:`, e instanceof Error ? e.message : e);
    }
  }

  if (images.length < 2) {
    console.log(
      `  ⚠ Need at least 2 images for a carousel; got ${images.length}. Add files under public/images/home/masterplan/ or fix paths in HOME_MASTERPLAN_GALLERY.`
    );
    return;
  }

  await client.patch(homePage._id).set({ masterplanGallery: images }).commit();
  console.log(`  ✓ homePage.masterplanGallery set (${images.length} images)`);
}

async function uploadLifestyleImages() {
  console.log("\n═══ Lifestyle Moment Images ═══");

  const homePage = await client.fetch<{ _id: string; lifestyleMoments: Array<{ _key: string; period: string }> } | null>(
    '*[_type == "homePage"][0]{ _id, lifestyleMoments[]{ _key, period } }'
  );
  if (!homePage?.lifestyleMoments?.length) {
    console.log("⚠ No lifestyle moments found");
    return;
  }

  const periods = ["Morning", "Day", "Evening"];
  for (let i = 0; i < homePage.lifestyleMoments.length; i++) {
    const moment = homePage.lifestyleMoments[i];
    const imgPath = LIFESTYLE_IMAGES[i];
    if (!imgPath) continue;

    console.log(`  ${moment.period || periods[i]}`);
    const image = await uploadImage(imgPath);

    await client
      .patch(homePage._id)
      .set({ [`lifestyleMoments[_key=="${moment._key}"].image`]: image })
      .commit();
  }
  console.log("  ✓ Lifestyle moments updated");
}

async function uploadFounderImages() {
  console.log("\n═══ Founder Photos ═══");

  const aboutPage = await client.fetch<{ _id: string; founders: Array<{ _key: string; name: string }> } | null>(
    '*[_type == "aboutPage"][0]{ _id, founders[]{ _key, name } }'
  );
  if (!aboutPage?.founders?.length) {
    console.log("⚠ No founders found in aboutPage");
    return;
  }

  for (const founder of aboutPage.founders) {
    const imgPath = FOUNDER_IMAGES[founder.name];
    if (!imgPath) {
      console.log(`  ⚠ No photo mapped for ${founder.name}`);
      continue;
    }

    console.log(`  ${founder.name}`);
    const photo = await uploadImage(imgPath);

    await client
      .patch(aboutPage._id)
      .set({ [`founders[_key=="${founder._key}"].photo`]: photo })
      .commit();
  }
  console.log("  ✓ Founder photos updated");
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(TMP_DIR, { recursive: true });
  console.log("Downloading from:", BASE_URL);
  console.log("Uploading to Sanity:", env.NEXT_PUBLIC_SANITY_PROJECT_ID, "/", env.NEXT_PUBLIC_SANITY_DATASET);

  await uploadPageImages();
  await uploadHomeMasterplanGallery();
  await uploadVillaImages();
  await uploadLifestyleImages();
  await uploadFounderImages();

  // Cleanup
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
  console.log("\n✅ All images uploaded and linked!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
