import { defineField, defineType } from "sanity";
import { PresentationIcon } from "@sanity/icons";

export const masterplanPageType = defineType({
  name: "masterplanPage",
  title: "Masterplan Page",
  type: "document",
  icon: PresentationIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "stats", title: "Stats" },
    { name: "explorer", title: "Explorer" },
    { name: "inventory", title: "Inventory" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroImage", title: "Hero / Aerial Image", type: "image", options: { hotspot: true }, group: "hero", validation: (r) => r.required().error("Please add a hero image for the masterplan page.") }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString", group: "hero" }),
    defineField({ name: "introCopy", title: "Intro Copy", type: "localeText", group: "hero", description: "Introductory paragraph below the hero." }),

    // Stats
    defineField({ name: "statTotalLabel", title: "Total Residences Label", type: "localeString", group: "stats" }),
    defineField({ name: "statAvailableLabel", title: "Available Label", type: "localeString", group: "stats" }),
    defineField({ name: "statReservedLabel", title: "Reserved Label", type: "localeString", group: "stats" }),
    defineField({ name: "statSoldLabel", title: "Sold Label", type: "localeString", group: "stats" }),
    defineField({ name: "statPlotsLabel", title: "Plots Label", type: "localeString", group: "stats" }),

    // Explorer
    defineField({ name: "explorerEyebrow", title: "Explorer Eyebrow", type: "localeString", group: "explorer" }),
    defineField({ name: "explorerTitle", title: "Explorer Title", type: "localeString", group: "explorer" }),
    defineField({ name: "explorerDescription", title: "Explorer Description", type: "localeText", group: "explorer" }),

    // Inventory
    defineField({ name: "inventoryEyebrow", title: "Inventory Eyebrow", type: "localeString", group: "inventory" }),
    defineField({ name: "inventoryTitle", title: "Inventory Title", type: "localeString", group: "inventory" }),
    defineField({ name: "inventoryDescription", title: "Inventory Description", type: "localeText", group: "inventory" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results." }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended)." }),
  ],
});
