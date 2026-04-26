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
    defineField({
      name: "price",
      title: "Price (EUR)",
      type: "number",
      description: "Price in EUR, excluding VAT. Leave empty if pricing is not public.",
    }),
    defineField({
      name: "priceUnit",
      title: "Price Unit",
      type: "string",
      options: {
        list: [
          { title: "Per item", value: "item" },
          { title: "Per meter", value: "meter" },
        ],
        layout: "radio",
      },
      initialValue: "item",
      hidden: ({ document }) => !document?.price,
    }),
    defineField({
      name: "priceNote",
      title: "Price Note",
      type: "localeString",
      description: 'Short note under the price, e.g. "excl. VAT".',
      hidden: ({ document }) => !document?.price,
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0, description: "Lower numbers appear first." }),
  ],
});
