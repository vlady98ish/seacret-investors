import fs from "node:fs";
import path from "node:path";

const MASTERPLAN_PUBLIC_DIR = path.join(process.cwd(), "public", "images", "home", "masterplan");

/** Sorted filenames only (e.g. for upload scripts). */
export function listPublicMasterplanGalleryFilenames(): string[] {
  try {
    if (!fs.existsSync(MASTERPLAN_PUBLIC_DIR)) return [];
    return fs
      .readdirSync(MASTERPLAN_PUBLIC_DIR)
      .filter((f) => /\.(webp|png|jpg|jpeg)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

/** Absolute paths to each image, same order as on the site. */
export function listPublicMasterplanGalleryPaths(): string[] {
  return listPublicMasterplanGalleryFilenames().map((f) => path.join(MASTERPLAN_PUBLIC_DIR, f));
}

/**
 * Images in `public/images/home/masterplan/` (sorted by filename) are used as the
 * home masterplan section gallery when Sanity `masterplanGallery` is empty and
 * `masterplanImage` alone is not enough for a carousel — useful when CMS was not synced yet.
 */
export function getPublicMasterplanGalleryUrls(): string[] {
  return listPublicMasterplanGalleryFilenames().map(
    (f) => `/images/home/masterplan/${encodeURIComponent(f)}`,
  );
}
