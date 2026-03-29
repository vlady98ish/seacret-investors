import { sanityClient } from "@/lib/sanity/client";

/**
 * Fetches data from Sanity CMS, falling back to local data when CMS is
 * unavailable (null result, network error, or demo project ID).
 */
export async function fetchWithFallback<T>(
  query: string,
  params?: Record<string, string>,
  fallbackFn?: () => T | null
): Promise<T | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await sanityClient.fetch<T>(query, params as any);
    if (result) return result;
  } catch {
    // CMS unavailable — fall through to local data
  }
  return fallbackFn?.() ?? null;
}
