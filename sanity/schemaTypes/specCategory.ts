import { defineField, defineType } from "sanity";
import { ComponentIcon } from "@sanity/icons";

export const specCategoryType = defineType({
  name: "specCategory",
  title: "Spec Category",
  type: "document",
  icon: ComponentIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "items", title: "Items" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "localeString",
      group: "general",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      group: "general",
      options: {
        list: [
          { title: "Sofa (Furniture)", value: "sofa" },
          { title: "Utensils (Kitchen)", value: "utensils-crossed" },
          { title: "Palmtree (Outdoor)", value: "palmtree" },
          { title: "Car (Parking)", value: "car" },
          { title: "Settings (Technical)", value: "settings-2" },
        ],
      },
      description: "Icon shown in the category navigation.",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      group: "general",
      initialValue: 0,
      description: "Lower numbers appear first.",
    }),
    defineField({
      name: "items",
      title: "Specification Items",
      type: "array",
      group: "items",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "area", title: "Area / Feature", type: "localeString" }),
            defineField({ name: "spec", title: "Specification", type: "localeString" }),
            defineField({ name: "notes", title: "Notes", type: "localeString" }),
          ],
          preview: {
            select: { title: "area.en", subtitle: "spec.en" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name.en", subtitle: "icon" },
    prepare({ title, subtitle }) {
      return { title: title ?? "Untitled", subtitle: subtitle ?? "" };
    },
  },
  orderings: [
    { title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] },
  ],
});
