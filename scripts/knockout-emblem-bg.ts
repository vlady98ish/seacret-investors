/**
 * One-off: make baked-in dark plate transparent on concept-emblem.png.
 * Dark neutral pixels → alpha 0; teal (channel spread) is kept.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const INPUT = path.join(
  process.cwd(),
  "public/images/brand/concept-emblem.png",
);

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error("Missing:", INPUT);
    process.exit(1);
  }

  const { data, info } = await sharp(INPUT)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (channels !== 4) {
    throw new Error(`Expected RGBA, got ${channels} channels`);
  }

  // Dark + low chroma (gray/black plate); teal has higher channel delta.
  const maxLum = 72;
  const maxDelta = 38;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < maxLum && delta < maxDelta) {
      data[i + 3] = 0;
    }
  }

  const tmp = INPUT + ".tmp.png";
  await sharp(data, {
    raw: { width, height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(tmp);

  fs.renameSync(tmp, INPUT);
  console.log("Wrote transparent background:", INPUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
