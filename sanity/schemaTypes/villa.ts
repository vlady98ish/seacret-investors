import { defineField, defineType } from "sanity";

export const villaType = defineType({
  name: "villa",
  title: "Villa Type",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "label", title: "Label", type: "localeString" }),
    defineField({ name: "summary", title: "Summary", type: "localeText" }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "localeString" }],
    }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "floorPlanImages",
      title: "Floor Plan Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "tourUrl", title: "3D Tour URL", type: "url" }),
    defineField({ name: "typicalBedrooms", title: "Typical Bedrooms", type: "number" }),
    defineField({ name: "typicalBathrooms", title: "Typical Bathrooms", type: "number" }),
    defineField({ name: "areaRange", title: "Area Range", type: "string", description: "e.g. '130-134'" }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "name", subtitle: "areaRange" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `${subtitle} m²` : "" };
    },
  },
  orderings: [{ title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
});
