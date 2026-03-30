import { sanityClient } from "@/lib/sanity/client";
import { uiStringsQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import type { UiStrings, SiteSettings } from "@/lib/sanity/types";

export async function getUiStrings(): Promise<UiStrings | null> {
  try {
    return await sanityClient.fetch<UiStrings>(uiStringsQuery);
  } catch {
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await sanityClient.fetch<SiteSettings>(siteSettingsQuery);
  } catch {
    return null;
  }
}
