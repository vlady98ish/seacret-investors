import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";
import { requireAllTranslations } from "../lib/validation";

export const residencesPageType = defineType({
  name: "residencesPage",
  title: "Residences Page",
  type: "document",
  icon: DocumentsIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, group: "hero", validation: (r) => r.required().error("Please add a hero image for the residences page.") }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString", group: "hero", validation: requireAllTranslations }),
    defineField({ name: "introCopy", title: "Intro Copy", type: "localeText", group: "hero", description: "Introductory paragraph below the hero." }),

    // Sections
    defineField({ name: "collectionEyebrow", title: "Collection Eyebrow", type: "localeString", group: "sections" }),
    defineField({ name: "collectionTitle", title: "Collection Title", type: "localeString", group: "sections" }),
    defineField({ name: "collectionDescription", title: "Collection Description", type: "localeText", group: "sections" }),
    defineField({ name: "compareEyebrow", title: "Compare Eyebrow", type: "localeString", group: "sections" }),
    defineField({ name: "compareTitle", title: "Compare Title", type: "localeString", group: "sections" }),
    defineField({ name: "compareDescription", title: "Compare Description", type: "localeText", group: "sections" }),
    defineField({ name: "upgradesEyebrow", title: "Upgrades Eyebrow", type: "localeString", group: "sections" }),
    defineField({ name: "upgradesTitle", title: "Upgrades Title", type: "localeString", group: "sections" }),
    defineField({ name: "upgradesDescription", title: "Upgrades Description", type: "localeText", group: "sections" }),
    defineField({ name: "faqEyebrow", title: "FAQ Eyebrow", type: "localeString", group: "sections" }),
    defineField({ name: "faqTitle", title: "FAQ Title", type: "localeString", group: "sections" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results.", validation: requireAllTranslations }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended).", validation: requireAllTranslations }),
  ],
});
