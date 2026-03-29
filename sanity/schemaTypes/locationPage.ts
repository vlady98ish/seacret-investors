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
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
