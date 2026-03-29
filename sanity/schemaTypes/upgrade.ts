import { defineField, defineType } from "sanity";

export const upgradeType = defineType({
  name: "upgrade",
  title: "Upgrade",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["pool", "jacuzzi", "sauna", "bbq", "smart-house", "security", "fireplace"] },
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 }),
  ],
});
