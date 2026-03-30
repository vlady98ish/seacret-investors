import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: UsersIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Our Story" },
    { name: "stats", title: "Stats" },
    { name: "values", title: "Values" },
    { name: "founders", title: "Founders" },
    { name: "cta", title: "CTA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString", group: "hero" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "localeString", group: "hero" }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, group: "hero", validation: (r) => r.required().error("Please add a hero image for the about page.") }),

    // Story
    defineField({ name: "storyEyebrow", title: "Story Eyebrow", type: "localeString", group: "story" }),
    defineField({ name: "storyTitle", title: "Story Title", type: "localeString", group: "story" }),
    defineField({ name: "storyContent", title: "Story Content", type: "localeText", group: "story" }),

    // Stats
    defineField({
      name: "stats",
      title: "Stats Bar",
      type: "array",
      group: "stats",
      description: "Key numbers displayed in a horizontal bar (e.g. '20+ Villas', '6 Plots').",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Value", type: "string", description: "The number or figure (e.g. '20+', '6')." }),
          defineField({ name: "label", title: "Label", type: "localeString" }),
        ],
      }],
    }),

    // Values
    defineField({ name: "valuesEyebrow", title: "Values Eyebrow", type: "localeString", group: "values" }),
    defineField({ name: "valuesTitle", title: "Values Title", type: "localeString", group: "values" }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      group: "values",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon", type: "string", description: "Lucide icon name (e.g. 'heart', 'shield', 'leaf')." }),
          defineField({ name: "title", title: "Title", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),

    // Founders
    defineField({ name: "foundersEyebrow", title: "Founders Eyebrow", type: "localeString", group: "founders" }),
    defineField({
      name: "founders",
      title: "Founders",
      type: "array",
      group: "founders",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name", title: "Name", type: "string" }),
          defineField({ name: "role", title: "Role", type: "localeString" }),
          defineField({ name: "bio", title: "Bio", type: "localeText" }),
          defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
        ],
      }],
    }),

    // CTA
    defineField({ name: "ctaTitle", title: "CTA Title", type: "localeString", group: "cta" }),
    defineField({ name: "ctaSubtitle", title: "CTA Subtitle", type: "localeString", group: "cta" }),
    defineField({ name: "ctaButton", title: "CTA Button Text", type: "localeString", group: "cta" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results." }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended)." }),
  ],
});
