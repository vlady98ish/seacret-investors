import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";

export const locationPageType = defineType({
  name: "locationPage",
  title: "Location Page",
  type: "document",
  icon: PinIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "why", title: "Why Chiliadou" },
    { name: "highlights", title: "Highlights" },
    { name: "distances", title: "Distances" },
    { name: "airports", title: "Airports" },
    { name: "experiences", title: "Experiences" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, group: "hero", validation: (r) => r.required().error("Please add a hero image for the location page.") }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString", group: "hero" }),

    // Why Chiliadou
    defineField({ name: "whySection", title: "Why Chiliadou Copy", type: "localeText", group: "why", description: "Main paragraph explaining why Chiliadou is special." }),
    defineField({ name: "whyEyebrow", title: "Why Eyebrow", type: "localeString", group: "why" }),
    defineField({ name: "whyTitle", title: "Why Title", type: "localeString", group: "why" }),
    defineField({
      name: "whyFeatures",
      title: "Why Features",
      type: "array",
      group: "why",
      description: "Key selling points with icons (e.g. climate, nature, safety).",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name", type: "string", description: "Lucide icon name (e.g. 'sun', 'shield', 'trees')." }),
          defineField({ name: "heading", title: "Heading", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),

    // Highlights
    defineField({ name: "highlightTitle", title: "Highlight Section Title", type: "localeString", group: "highlights" }),
    defineField({ name: "highlightDescription", title: "Highlight Section Description", type: "localeText", group: "highlights" }),
    defineField({
      name: "highlights",
      title: "Highlights (cards)",
      type: "array",
      group: "highlights",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),

    // Distances
    defineField({ name: "distanceEyebrow", title: "Distance Eyebrow", type: "localeString", group: "distances" }),
    defineField({ name: "distanceTitle", title: "Distance Title", type: "localeString", group: "distances" }),
    defineField({ name: "distanceDescription", title: "Distance Description", type: "localeText", group: "distances" }),
    defineField({
      name: "distances",
      title: "Distance Markers (non-localized)",
      type: "array",
      group: "distances",
      description: "Legacy distance markers with fixed-language place names.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "place", title: "Place", type: "string" }),
          defineField({ name: "time", title: "Travel Time", type: "string" }),
          defineField({ name: "lat", title: "Latitude", type: "number" }),
          defineField({ name: "lng", title: "Longitude", type: "number" }),
        ],
      }],
    }),
    defineField({
      name: "distanceMarkers",
      title: "Distance Markers (Localized)",
      type: "array",
      group: "distances",
      description: "Localized distance markers shown on the map.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "place", title: "Place", type: "localeString" }),
          defineField({ name: "time", title: "Travel Time", type: "localeString" }),
          defineField({ name: "detail", title: "Detail", type: "localeString" }),
          defineField({ name: "lat", title: "Latitude", type: "number" }),
          defineField({ name: "lng", title: "Longitude", type: "number" }),
        ],
      }],
    }),

    // Airports
    defineField({ name: "airportEyebrow", title: "Airport Eyebrow", type: "localeString", group: "airports" }),
    defineField({ name: "airportTitle", title: "Airport Title", type: "localeString", group: "airports" }),
    defineField({ name: "airportDescription", title: "Airport Description", type: "localeText", group: "airports" }),
    defineField({
      name: "airports",
      title: "Airports",
      type: "array",
      group: "airports",
      description: "List of nearby airports with connectivity details.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "code", title: "Code", type: "string", description: "IATA code (e.g. PFO, LCA)." }),
          defineField({ name: "name", title: "Airport Name", type: "localeString" }),
          defineField({ name: "city", title: "City", type: "localeString" }),
          defineField({ name: "travelTime", title: "Travel Time", type: "localeString" }),
          defineField({ name: "destinations", title: "Destinations Count", type: "number" }),
          defineField({ name: "countries", title: "Countries", type: "number" }),
          defineField({ name: "note", title: "Note", type: "localeString" }),
          defineField({ name: "isNearest", title: "Nearest?", type: "boolean" }),
        ],
      }],
    }),

    // Experiences
    defineField({ name: "experiencesEyebrow", title: "Experiences Eyebrow", type: "localeString", group: "experiences" }),
    defineField({ name: "experiencesTitle", title: "Experiences Title", type: "localeString", group: "experiences" }),
    defineField({ name: "experiencesDescription", title: "Experiences Description", type: "localeText", group: "experiences" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results." }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended)." }),
  ],
});
