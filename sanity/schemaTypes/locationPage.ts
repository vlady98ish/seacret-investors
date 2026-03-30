import { defineField, defineType } from "sanity";

export const locationPageType = defineType({
  name: "locationPage",
  title: "Location Page",
  type: "document",
  fields: [
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString" }),
    defineField({ name: "whySection", title: "Why Chiliadou Copy", type: "localeText" }),
    defineField({
      name: "distances",
      title: "Distance Markers",
      type: "array",
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
    // Why Chiliadou section
    defineField({ name: "whyEyebrow", title: "Why Eyebrow", type: "localeString" }),
    defineField({ name: "whyTitle", title: "Why Title", type: "localeString" }),
    defineField({
      name: "whyFeatures",
      title: "Why Features",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name", type: "string" }),
          defineField({ name: "heading", title: "Heading", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),
    // Location highlights
    defineField({ name: "highlightTitle", title: "Highlight Section Title", type: "localeString" }),
    defineField({ name: "highlightDescription", title: "Highlight Section Description", type: "localeText" }),
    defineField({
      name: "highlights",
      title: "Highlights (cards)",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),
    // Distance section
    defineField({ name: "distanceEyebrow", title: "Distance Eyebrow", type: "localeString" }),
    defineField({ name: "distanceTitle", title: "Distance Title", type: "localeString" }),
    defineField({ name: "distanceDescription", title: "Distance Description", type: "localeText" }),
    defineField({
      name: "distanceMarkers",
      title: "Distance Markers (Localized)",
      type: "array",
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
    // Airport section
    defineField({ name: "airportEyebrow", title: "Airport Eyebrow", type: "localeString" }),
    defineField({ name: "airportTitle", title: "Airport Title", type: "localeString" }),
    defineField({ name: "airportDescription", title: "Airport Description", type: "localeText" }),
    defineField({
      name: "airports",
      title: "Airports",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "code", title: "Code (e.g. AGP)", type: "string" }),
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
    // Experiences section
    defineField({ name: "experiencesEyebrow", title: "Experiences Eyebrow", type: "localeString" }),
    defineField({ name: "experiencesTitle", title: "Experiences Title", type: "localeString" }),
    defineField({ name: "experiencesDescription", title: "Experiences Description", type: "localeText" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
