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
    defineField({ name: "locationTitle", title: "Location Section Title", type: "localeString" }),
    defineField({ name: "locationDescription", title: "Location Section Description", type: "localeText" }),
    defineField({
      name: "locationHighlights",
      title: "Location Highlights",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),
    defineField({ name: "residencesTitle", title: "Residences Section Title", type: "localeString" }),
    defineField({ name: "residencesDescription", title: "Residences Section Description", type: "localeText" }),
    defineField({ name: "masterplanTitle", title: "Masterplan Section Title", type: "localeString" }),
    defineField({ name: "masterplanDescription", title: "Masterplan Section Description", type: "localeText" }),
    defineField({ name: "lifestyleTitle", title: "Lifestyle Section Title", type: "localeString" }),
    defineField({ name: "inlineContactEyebrow", title: "Inline Contact Eyebrow", type: "localeString" }),
    defineField({ name: "inlineContactTitle", title: "Inline Contact Title", type: "localeString" }),
    defineField({ name: "inlineContactDescription", title: "Inline Contact Description", type: "localeText" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
