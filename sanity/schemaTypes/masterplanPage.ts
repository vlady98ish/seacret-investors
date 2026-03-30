import { defineField, defineType } from "sanity";

export const masterplanPageType = defineType({
  name: "masterplanPage",
  title: "Masterplan Page",
  type: "document",
  fields: [
    defineField({ name: "heroImage", title: "Hero/Aerial Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString" }),
    defineField({ name: "introCopy", title: "Intro Copy", type: "localeText" }),
    defineField({ name: "statTotalLabel", title: "Stat: Total Residences", type: "localeString" }),
    defineField({ name: "statAvailableLabel", title: "Stat: Available", type: "localeString" }),
    defineField({ name: "statReservedLabel", title: "Stat: Reserved", type: "localeString" }),
    defineField({ name: "statSoldLabel", title: "Stat: Sold", type: "localeString" }),
    defineField({ name: "statPlotsLabel", title: "Stat: Plots", type: "localeString" }),
    defineField({ name: "explorerEyebrow", title: "Explorer Eyebrow", type: "localeString" }),
    defineField({ name: "explorerTitle", title: "Explorer Title", type: "localeString" }),
    defineField({ name: "explorerDescription", title: "Explorer Description", type: "localeText" }),
    defineField({ name: "inventoryEyebrow", title: "Inventory Eyebrow", type: "localeString" }),
    defineField({ name: "inventoryTitle", title: "Inventory Title", type: "localeString" }),
    defineField({ name: "inventoryDescription", title: "Inventory Description", type: "localeText" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
