/**
 * In development, use floor plans from /public so new files are visible
 * before running `npx tsx sanity/seed/upload-images.ts`.
 * Production always uses Sanity only.
 *
 * Set DISABLE_LOCAL_FLOOR_PLANS=1 in .env.local to show CMS images in dev.
 */
const SLUG_TO_PATHS: Record<string, string[]> = {
  yair: ["/villas/yair-ground-floor.png"],
};

export function getDevFloorPlanUrls(villaSlug: string): string[] | null {
  if (process.env.NODE_ENV !== "development") return null;
  if (process.env.DISABLE_LOCAL_FLOOR_PLANS === "1") return null;
  return SLUG_TO_PATHS[villaSlug] ?? null;
}
