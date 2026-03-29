import { defineField, defineType } from "sanity";

export const masterplanPageType = defineType({
  name: "masterplanPage",
  title: "Masterplan Page",
  type: "document",
  fields: [
    defineField({ name: "heroImage", title: "Hero/Aerial Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString" }),
    defineField({ name: "introCopy", title: "Intro Copy", type: "localeText" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
