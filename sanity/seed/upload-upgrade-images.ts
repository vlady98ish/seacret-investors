import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

function loadEnv(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const name of [".env.local", ".env"]) {
    const envPath = path.resolve(process.cwd(), name);
    if (!fs.existsSync(envPath)) continue;
    for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      vars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return vars;
}

const env = loadEnv();
const token = process.env["SANITY_WRITE_TOKEN"] || env["SANITY_WRITE_TOKEN"] || env["SANITY_API_TOKEN"];
const client = createClient({
  projectId: env["NEXT_PUBLIC_SANITY_PROJECT_ID"],
  dataset: env["NEXT_PUBLIC_SANITY_DATASET"] ?? "production",
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Unsplash images — direct URLs with size params
const UPGRADE_IMAGES: Record<string, { url: string; filename: string }> = {
  bbq: {
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop&q=80",
    filename: "bbq-grill-area.jpg",
  },
  jacuzzi: {
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=500&fit=crop&q=80",
    filename: "outdoor-jacuzzi.jpg",
  },
  sauna: {
    url: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&h=500&fit=crop&q=80",
    filename: "wooden-sauna.jpg",
  },
  pool: {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop&q=80",
    filename: "villa-pool.jpg",
  },
  "smart-house": {
    url: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=500&fit=crop&q=80",
    filename: "smart-home.jpg",
  },
  security: {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop&q=80",
    filename: "security-camera.jpg",
  },
  fireplace: {
    url: "https://images.unsplash.com/photo-1543459176-4426b37223ba?w=800&h=500&fit=crop&q=80",
    filename: "fireplace-modern.jpg",
  },
};

function download(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const get = url.startsWith("https") ? https.get : http.get;
    get(url, { headers: { "User-Agent": "sanity-seed-script" } }, (res) => {
      // Follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  const upgrades = await client.fetch<Array<{ _id: string; category: string }>>(
    `*[_type == "upgrade"]{ _id, category }`
  );

  const tmpDir = path.resolve(process.cwd(), "tmp", "upgrade-images");
  fs.mkdirSync(tmpDir, { recursive: true });

  for (const u of upgrades) {
    const imgInfo = UPGRADE_IMAGES[u.category];
    if (!imgInfo) {
      console.log(`  skip ${u.category} — no image mapped`);
      continue;
    }

    console.log(`Downloading ${u.category}...`);
    const buffer = await download(imgInfo.url);
    const tmpPath = path.join(tmpDir, imgInfo.filename);
    fs.writeFileSync(tmpPath, buffer);
    console.log(`  saved ${tmpPath} (${Math.round(buffer.length / 1024)}KB)`);

    console.log(`  uploading to Sanity...`);
    const asset = await client.assets.upload("image", fs.createReadStream(tmpPath), {
      filename: imgInfo.filename,
    });
    console.log(`  uploaded: ${asset._id}`);

    await client.patch(u._id).set({
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    }).commit();
    console.log(`  patched ${u._id} with image`);
  }

  console.log("\nDone! All upgrade images uploaded.");
}

main().catch(console.error);
