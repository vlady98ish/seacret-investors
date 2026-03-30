import { defineField, defineType } from "sanity";
import { SparklesIcon } from "@sanity/icons";

export const upgradeType = defineType({
  name: "upgrade",
  title: "Upgrade",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, description: "Photo or illustration of this upgrade option." }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["pool", "jacuzzi", "sauna", "bbq", "smart-house", "security", "fireplace"] },
      description: "Used for filtering and grouping upgrades.",
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0, description: "Lower numbers appear first." }),
  ],
});
