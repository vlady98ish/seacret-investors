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

const EXPERIENCE_IMAGES: Record<string, { url: string; filename: string }> = {
  "exp-delphi": {
    url: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1200&h=800&fit=crop&q=80",
    filename: "delphi-ruins.jpg",
  },
  "exp-galaxidi": {
    url: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&h=800&fit=crop&q=80",
    filename: "galaxidi-harbor.jpg",
  },
  "exp-monasteries": {
    url: "https://images.unsplash.com/photo-1584463699033-0c0dbc267698?w=1200&h=800&fit=crop&q=80",
    filename: "byzantine-monastery.jpg",
  },
  "exp-tavernas": {
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop&q=80",
    filename: "greek-taverna.jpg",
  },
  "exp-beaches": {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&q=80",
    filename: "blue-flag-beach.jpg",
  },
  "exp-pools": {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop&q=80",
    filename: "infinity-pool.jpg",
  },
  "exp-hiking": {
    url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&h=800&fit=crop&q=80",
    filename: "olive-grove-trail.jpg",
  },
  "exp-kayaking": {
    url: "https://images.unsplash.com/photo-1472745433479-4556f22e32c2?w=1200&h=800&fit=crop&q=80",
    filename: "kayaking-bay.jpg",
  },
  "exp-olives": {
    url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&h=800&fit=crop&q=80",
    filename: "amfissa-olives.jpg",
  },
  "exp-seafood": {
    url: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=1200&h=800&fit=crop&q=80",
    filename: "fresh-seafood.jpg",
  },
  "exp-cheese": {
    url: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=1200&h=800&fit=crop&q=80",
    filename: "cheese-honey.jpg",
  },
  "exp-wine": {
    url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&h=800&fit=crop&q=80",
    filename: "wine-tasting.jpg",
  },
};

function download(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const get = url.startsWith("https") ? https.get : http.get;
    get(url, { headers: { "User-Agent": "sanity-seed-script" } }, (res) => {
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
  console.log("\n🖼️  Uploading experience images to Sanity...\n");

  const tmpDir = path.resolve(process.cwd(), "tmp", "experience-images");
  fs.mkdirSync(tmpDir, { recursive: true });

  for (const [expId, imgInfo] of Object.entries(EXPERIENCE_IMAGES)) {
    try {
      console.log(`📥 ${expId}: downloading ${imgInfo.filename}...`);
      const buffer = await download(imgInfo.url);
      const tmpPath = path.join(tmpDir, imgInfo.filename);
      fs.writeFileSync(tmpPath, buffer);
      console.log(`   saved (${Math.round(buffer.length / 1024)}KB)`);

      console.log(`   uploading to Sanity...`);
      const asset = await client.assets.upload("image", fs.createReadStream(tmpPath), {
        filename: imgInfo.filename,
      });
      console.log(`   asset: ${asset._id}`);

      await client.patch(expId).set({
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        },
      }).commit();
      console.log(`   ✅ ${expId} patched\n`);
    } catch (e: unknown) {
      console.log(`   ❌ ${expId} failed: ${e instanceof Error ? e.message : e}\n`);
    }
  }

  console.log("Done! Experience images uploaded.");
}

main().catch(console.error);
