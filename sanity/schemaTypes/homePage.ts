import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "heroTagline", title: "Hero Tagline", type: "localeString" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "localeString" }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroVideoUrl", title: "Hero Video URL (Tier 2)", type: "url" }),
    defineField({ name: "conceptEyebrow", title: "Concept Eyebrow", type: "localeString" }),
    defineField({ name: "conceptCopy", title: "Concept Copy", type: "localeText" }),
    defineField({ name: "conceptImage", title: "Concept Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "lifestyleMoments",
      title: "Lifestyle Moments",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "period", title: "Period (Morning/Day/Evening)", type: "string" }),
          defineField({ name: "copy", title: "Copy", type: "localeText" }),
          defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
        ],
      }],
    }),
    defineField({
      name: "featuredVillas",
      title: "Featured Villas (Homepage Preview)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "villa" }] })],
    }),
    defineField({ name: "masterplanImage", title: "Masterplan Aerial Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "ctaTitle", title: "CTA Title", type: "localeString" }),
    defineField({ name: "ctaSubtitle", title: "CTA Subtitle", type: "localeString" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
