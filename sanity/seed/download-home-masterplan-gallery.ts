/**
 * Fetches image asset refs from the public Sanity API and writes JPEGs to
 * public/images/home/masterplan/ for the homepage masterplan teaser carousel.
 *
 * Usage: npx tsx sanity/seed/download-home-masterplan-gallery.ts
 */

import * as fs from "fs";
import * as path from "path";

function loadEnv(): { projectId: string; dataset: string } {
  for (const name of [".env.local", ".env"]) {
    const p = path.resolve(process.cwd(), name);
    if (!fs.existsSync(p)) continue;
    const env: Record<string, string> = {};
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const i = line.indexOf("=");
      if (i > 0) env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
    if (projectId) return { projectId, dataset };
  }
  throw new Error("Add NEXT_PUBLIC_SANITY_PROJECT_ID to .env or .env.local");
}

function refToCdnUrl(projectId: string, dataset: string, ref: string): string {
  let body = ref.replace(/^image-/, "");
  body = body
    .replace(/-jpg$/i, ".jpg")
    .replace(/-jpeg$/i, ".jpeg")
    .replace(/-png$/i, ".png")
    .replace(/-webp$/i, ".webp");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${body}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function main() {
  const { projectId, dataset } = loadEnv();
  const q = encodeURIComponent(`*[_type=="homePage"][0]{
    "mp": masterplanImage.asset->_id,
    "life": lifestyleMoments[].image.asset->_id
  }`);
  const home = await fetchJson<{ result: { mp?: string; life?: string[] } }>(
    `https://${projectId}.apicdn.sanity.io/v2023-08-01/data/query/${dataset}?query=${q}`
  ).then((r) => r.result);

  const q2 = encodeURIComponent(`*[_type=="villa" && name == "Tai"][0]{ "hero": heroImage.asset->_id }`);
  const tai = await fetchJson<{ result: { hero?: string } }>(
    `https://${projectId}.apicdn.sanity.io/v2023-08-01/data/query/${dataset}?query=${q2}`
  ).then((r) => r.result);

  const refs = [home?.mp, ...(home?.life ?? []), tai?.hero].filter(Boolean) as string[];
  const unique = [...new Set(refs)];
  if (unique.length < 2) {
    console.error("Not enough image refs from Sanity (need at least 2).");
    process.exit(1);
  }

  const outDir = path.resolve(process.cwd(), "public/images/home/masterplan");
  fs.mkdirSync(outDir, { recursive: true });

  /** First slide is reserved when this file exists (e.g. art-directed PNG). */
  const pinnedFirst = fs
    .readdirSync(outDir)
    .find((f) => /^01-masterplan-gallery\./i.test(f) && fs.statSync(path.join(outDir, f)).size > 0);
  const refsToFetch = pinnedFirst ? unique.slice(1) : unique;
  const startIndex = pinnedFirst ? 2 : 1;

  if (pinnedFirst) {
    console.log(`Keeping pinned first slide: ${pinnedFirst}`);
  }
  if (refsToFetch.length < (pinnedFirst ? 1 : 2)) {
    console.error(pinnedFirst ? "Need at least one more Sanity image after pin." : "Not enough image refs.");
    process.exit(1);
  }

  for (const f of fs.readdirSync(outDir)) {
    if (!/^0\d-masterplan-gallery\.|^1\d-masterplan-gallery\./i.test(f)) continue;
    const n = parseInt(f.slice(0, 2), 10);
    if (!pinnedFirst || n >= startIndex) {
      if (/\.(jpe?g|png|webp)$/i.test(f)) fs.unlinkSync(path.join(outDir, f));
    }
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  for (let i = 0; i < refsToFetch.length; i++) {
    const ref = refsToFetch[i];
    const url = refToCdnUrl(projectId, dataset, ref);
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Skip ${ref} (${res.status})`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = path.extname(new URL(url).pathname) || ".jpg";
    const file = path.join(outDir, `${pad(startIndex + i)}-masterplan-gallery${ext}`);
    fs.writeFileSync(file, buf);
    console.log(`✓ ${path.basename(file)} (${buf.length} bytes)`);
  }

  console.log(`\nDone — ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
