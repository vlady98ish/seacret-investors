import { defineField, defineType } from "sanity";

export const residencesPageType = defineType({
  name: "residencesPage",
  title: "Residences Page",
  type: "document",
  fields: [
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString" }),
    defineField({ name: "introCopy", title: "Intro Copy", type: "localeText" }),
    defineField({ name: "collectionEyebrow", title: "Collection Eyebrow", type: "localeString" }),
    defineField({ name: "collectionTitle", title: "Collection Title", type: "localeString" }),
    defineField({ name: "collectionDescription", title: "Collection Description", type: "localeText" }),
    defineField({ name: "compareEyebrow", title: "Compare Eyebrow", type: "localeString" }),
    defineField({ name: "compareTitle", title: "Compare Title", type: "localeString" }),
    defineField({ name: "compareDescription", title: "Compare Description", type: "localeText" }),
    defineField({ name: "upgradesEyebrow", title: "Upgrades Eyebrow", type: "localeString" }),
    defineField({ name: "upgradesTitle", title: "Upgrades Title", type: "localeString" }),
    defineField({ name: "upgradesDescription", title: "Upgrades Description", type: "localeText" }),
    defineField({ name: "faqEyebrow", title: "FAQ Eyebrow", type: "localeString" }),
    defineField({ name: "faqTitle", title: "FAQ Title", type: "localeString" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
