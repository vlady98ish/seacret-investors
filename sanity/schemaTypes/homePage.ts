import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";
import { requireAllTranslations } from "../lib/validation";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "concept", title: "Concept" },
    { name: "lifestyle", title: "Lifestyle" },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroTagline", title: "Hero Tagline", type: "localeString", group: "hero", description: "Main headline displayed over the hero image.", validation: requireAllTranslations }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "localeString", group: "hero", description: "Smaller text below the tagline." }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, group: "hero", description: "Full-width background image for the homepage hero.", validation: (r) => r.required().error("Please add a hero image — it's the first thing visitors see.") }),
    defineField({ name: "heroVideoUrl", title: "Hero Video URL", type: "url", group: "hero", description: "YouTube or Vimeo link. Plays in background on the homepage hero." }),

    // Concept
    defineField({ name: "conceptEyebrow", title: "Concept Eyebrow", type: "localeString", group: "concept", description: "Small label above the concept title (e.g. 'Our Vision')." }),
    defineField({ name: "conceptTitle", title: "Concept Title", type: "localeString", group: "concept", description: "Main heading for the concept section." }),
    defineField({ name: "conceptCopy", title: "Concept Copy", type: "localeText", group: "concept", description: "Main body text for the concept section." }),
    defineField({ name: "conceptImage", title: "Concept Image", type: "image", options: { hotspot: true }, group: "concept" }),

    // Lifestyle
    defineField({ name: "lifestyleTitle", title: "Lifestyle Section Title", type: "localeString", group: "lifestyle" }),
    defineField({
      name: "lifestyleMoments",
      title: "Lifestyle Moments",
      type: "array",
      group: "lifestyle",
      description: "Add moments that showcase the Sea'cret lifestyle. Each needs a time period, description, and photo.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "period", title: "Period", type: "string", description: "e.g. 'Morning', 'Afternoon', 'Evening'" }),
          defineField({ name: "copy", title: "Copy", type: "localeText" }),
          defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
        ],
      }],
    }),

    // Sections
    defineField({
      name: "featuredVillas",
      title: "Featured Villas",
      type: "array",
      group: "sections",
      description: "Select villas to highlight on the homepage.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "villa" }] })],
    }),
    defineField({ name: "masterplanImage", title: "Masterplan Aerial Image", type: "image", options: { hotspot: true }, group: "sections" }),
    defineField({ name: "ctaTitle", title: "CTA Title", type: "localeString", group: "sections" }),
    defineField({ name: "ctaSubtitle", title: "CTA Subtitle", type: "localeString", group: "sections" }),
    defineField({ name: "locationTitle", title: "Location Section Title", type: "localeString", group: "sections" }),
    defineField({ name: "locationDescription", title: "Location Section Description", type: "localeText", group: "sections" }),
    defineField({
      name: "locationHighlights",
      title: "Location Highlights",
      type: "array",
      group: "sections",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),
    defineField({ name: "residencesTitle", title: "Residences Section Title", type: "localeString", group: "sections" }),
    defineField({ name: "residencesDescription", title: "Residences Section Description", type: "localeText", group: "sections" }),
    defineField({ name: "masterplanTitle", title: "Masterplan Section Title", type: "localeString", group: "sections" }),
    defineField({ name: "masterplanDescription", title: "Masterplan Section Description", type: "localeText", group: "sections" }),
    defineField({ name: "inlineContactEyebrow", title: "Inline Contact Eyebrow", type: "localeString", group: "sections" }),
    defineField({ name: "inlineContactTitle", title: "Inline Contact Title", type: "localeString", group: "sections" }),
    defineField({ name: "inlineContactDescription", title: "Inline Contact Description", type: "localeText", group: "sections" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results.", validation: requireAllTranslations }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended).", validation: requireAllTranslations }),
  ],
});
