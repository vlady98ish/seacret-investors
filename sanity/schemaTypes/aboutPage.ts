import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    // Hero
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "localeString" }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),

    // Our Story section
    defineField({ name: "storyEyebrow", title: "Story Eyebrow", type: "localeString" }),
    defineField({ name: "storyTitle", title: "Story Title", type: "localeString" }),
    defineField({ name: "storyContent", title: "Story Content", type: "localeText" }),

    // Stats Bar
    defineField({
      name: "stats",
      title: "Stats Bar",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Value", type: "string" }),
          defineField({ name: "label", title: "Label", type: "localeString" }),
        ],
      }],
    }),

    // Values section
    defineField({ name: "valuesEyebrow", title: "Values Eyebrow", type: "localeString" }),
    defineField({ name: "valuesTitle", title: "Values Title", type: "localeString" }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon", type: "string" }),
          defineField({ name: "title", title: "Title", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),

    // Founders section
    defineField({ name: "foundersEyebrow", title: "Founders Eyebrow", type: "localeString" }),
    defineField({
      name: "founders",
      title: "Founders",
      type: "array",
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

    // CTA section
    defineField({ name: "ctaTitle", title: "CTA Title", type: "localeString" }),
    defineField({ name: "ctaSubtitle", title: "CTA Subtitle", type: "localeString" }),
    defineField({ name: "ctaButton", title: "CTA Button", type: "localeString" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
