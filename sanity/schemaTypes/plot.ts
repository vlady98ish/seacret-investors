import { defineField, defineType } from "sanity";

export const plotType = defineType({
  name: "plot",
  title: "Plot",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Summary", type: "localeText" }),
    defineField({ name: "aerialImage", title: "Aerial Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "positionData",
      title: "Position on Masterplan",
      type: "object",
      fields: [
        defineField({ name: "x", title: "X (%)", type: "number" }),
        defineField({ name: "y", title: "Y (%)", type: "number" }),
      ],
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "name" } },
  orderings: [{ title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
});
