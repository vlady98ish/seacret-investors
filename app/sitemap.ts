import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seacret-residences.com";
const locales = ["en", "he", "ru", "el"];
const villaSlugs = ["lola", "mikka", "tai", "michal", "yair", "yehonatan"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/residences", "/masterplan", "/location", "/about", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  for (const slug of villaSlugs) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/villas/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
